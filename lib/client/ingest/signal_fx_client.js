'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var request = require('request'); // Use for create post request
var winston = require('winston'); // Logging library
var Promise = require('promise');

var conf = require('../conf');

// Application version and name for User-Agent
var name = 'signalfx-nodejs-client';
var version = require('../../../package.json').version;

/**
 * SignalFx API client.
 * This class presents a programmatic interface to SignalFx's metadata and
 * ingest APIs. At the time being, only ingest is supported; more will come
 * later.
 *
 * @constructor
 * @param apiToken
 * @param options - {
 *                    enableAmazonUniqueId: boolean, // "false by default"
 *                    dimensions:"object", // dimensions for each datapoint and event
 *                    ingestEndpoint:"string",
 *                    timeout:"number",
 *                    batchSize:"number",
 *                    userAgents:"array",
 *                    proxy:"string" //http://<USER>:<PASSWORD>@<HOST>:<PORT>
 *                  }
 */
function SignalFxClient(apiToken, options) {
  var _this = this;

  this.apiToken = apiToken;
  var params = options || {};

  this.ingestEndpoint = params.ingestEndpoint || conf.DEFAULT_INGEST_ENDPOINT;
  this.timeout = params.timeout || conf.DEFAULT_TIMEOUT;
  this.batchSize = Math.max(1, (params.batchSize ? params.batchSize : conf.DEFAULT_BATCH_SIZE));
  this.userAgents = params.userAgents || null;
  this.globalDimensions = params.dimensions || {};
  this.enableAmazonUniqueId = params.enableAmazonUniqueId || false;
  this.proxy = params.proxy || null;

  this.rawData = [];
  this.rawEvents = [];
  this.queue = [];

  this.loadAWSUniqueId = new Promise(function (resolve) {
    if (!_this.enableAmazonUniqueId) {
      resolve();
      return;
    } else {
      if (_this.AWSUniqueId !== undefined && _this.AWSUniqueId !== '') {
        resolve();
        return;
      }
    }

    _this._retrieveAWSUniqueId(function (isSuccess, AWSUniqueId) {
      if (isSuccess) {
        _this.AWSUniqueId = AWSUniqueId;
        _this.globalDimensions[_this.AWSUniqueId_DIMENTION_NAME] = AWSUniqueId;
      } else {
        _this.enableAmazonUniqueId = false;
        _this.AWSUniqueId = '';
        delete _this.globalDimensions[_this.AWSUniqueId_DIMENTION_NAME];
      }
      resolve();
    });
  });
}

SignalFxClient.prototype.AWSUniqueId_DIMENTION_NAME = 'AWSUniqueId';
SignalFxClient.prototype.HEADER_API_TOKEN_KEY = 'X-SF-Token';
SignalFxClient.prototype.HEADER_USER_AGENT_KEY = 'User-Agent';
SignalFxClient.prototype.HEADER_CONTENT_TYPE = 'Content-Type';
SignalFxClient.prototype.INGEST_ENDPOINT_SUFFIX = 'v2/datapoint';
SignalFxClient.prototype.EVENT_ENDPOINT_SUFFIX = 'v2/event';

SignalFxClient.prototype.EVENT_CATEGORIES = {
  USER_DEFINED: 'USER_DEFINED',
  ALERT: 'ALERT',
  AUDIT: 'AUDIT',
  JOB: 'JOB',
  COLLECTD: 'COLLECTD',
  SERVICE_DISCOVERY: 'SERVICE_DISCOVERY',
  EXCEPTION: 'EXCEPTION'
};

/**
 * Send the given metrics to SignalFx.
 *
 * @param data - param object with following fields:
 *    'cumulative_counters' (list): a list of dictionaries representing the cumulative counters to report.
 *    'gauges' (list): a list of dictionaries representing the gauges to report.
 *    'counters' (list): a list of dictionaries representing the counters to report.
 */
SignalFxClient.prototype.send = function (data) {
  var _this = this;
  this.rawData.push(data);
  return this.loadAWSUniqueId
    .then(function () {
      _this.processingData();
      return _this.startAsyncSend();
    });
};

SignalFxClient.prototype.processingData = function () {
  var _this = this;

  function processDataPoints(metricType, dataPoints) {
    if (!dataPoints) {
      return;
    }

    if (!Array.isArray(dataPoints)) {
      throw new TypeError('DataPoints not of type list: ' + dataPoints);
    }

    dataPoints.forEach(function (dp) {
      var datapoint = dp;
      if (!datapoint.dimensions) {
        datapoint.dimensions = {};
      }
      for (var key in _this.globalDimensions) {
        if (_this.globalDimensions.hasOwnProperty(key)) {
          datapoint.dimensions[key] = _this.globalDimensions[key];
        }
      }

      _this._addToQueue(metricType, datapoint);
    });
  }

  while (this.rawData.length) {
    var data = this.rawData.pop();
    if (data) {
      processDataPoints('cumulative_counter', data.cumulative_counters);
      processDataPoints('gauge', data.gauges);
      processDataPoints('counter', data.counters);
    }
  }
};

SignalFxClient.prototype._addToQueue = function (metricType, datapoint) {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._batchData = function (datapointsList) {
  throw new Error('Subclasses should implement this!');
};

/**
 * Send an event to SignalFx
 *
 * @param event - param object with following fields:
 *    category (string) - the category of event. Choose one from EVENT_CATEGORIES list
 *    eventType (string) - the event type (name of the event time series).
 *    dimensions  (dict) - a map of event dimensions, empty dictionary by default
 *    properties  (dict) - a map of extra properties on that event, empty dictionary by default
 *    timestamp (int64) - a timestamp, by default is current time
 *
 * Only eventType field is required
 */
SignalFxClient.prototype.sendEvent = function (event) {
  var _this = this;
  if (!event || !event.eventType) {
    throw new Error('Type of event should not be empty!');
  }
  // Check than passed event category is supported
  if (!this.EVENT_CATEGORIES[event.category]) {
    throw new Error('Unsupported event category: ' + event.category);
  }

  var data = {
    category: event.category || _this.EVENT_CATEGORIES.USER_DEFINED,
    eventType: event.eventType,
    dimensions: event.dimensions || {},
    properties: event.properties || {},
    timestamp: event.timestamp || (new Date()).getTime()
  };

  this.rawEvents.push(data);
  return this.loadAWSUniqueId.then(function () {
    return _this.startAsyncEventSend();
  });
};


SignalFxClient.prototype._retrieveAWSUniqueId = function (callback) {
  var getOptions = {
    url: conf.AWS_UNIQUE_ID_URL,
    timeout: 1000,
    method: 'GET',
    proxy: this.proxy
  };

  request(getOptions, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(false, '');
      winston.error('Failed to retrieve AWS unique ID: ', response ? response.statusCode : '', body);
    } else {
      try {
        var jsonBody = JSON.parse(body);
        if (jsonBody && jsonBody.instanceId && jsonBody.region && jsonBody.accountId) {
          var AWSUniqueId = jsonBody.instanceId + '_' + jsonBody.region + '_' + jsonBody.accountId;
          callback(true, AWSUniqueId);
        } else {
          callback(false, '');
        }
      } catch (e) {
        callback(false, '');
      }
    }
  });
};

SignalFxClient.prototype.getHeaderContentType = function () {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._buildEvent = function (event) {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._encodeEvent = function (event) {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype.startAsyncSend = function () {
  var _this = this;
  // Send post request in separate thread
  var datapointsList = [];
  while (_this.queue.length !== 0 && datapointsList.length < _this.batchSize) {
    datapointsList.push(_this.queue.shift());
  }

  if (datapointsList.length > 0) {
    var dataToSend = _this._batchData(datapointsList);
    if (dataToSend && dataToSend.length > 0) {
      var url = _this.ingestEndpoint + '/' + _this.INGEST_ENDPOINT_SUFFIX;
      return _this.post(dataToSend, url, _this.getHeaderContentType());
    }
  }
  return new Promise(function (resolve) {
    resolve(null);
  });
};

SignalFxClient.prototype.startAsyncEventSend = function () {
  var _this = this;
  while (this.rawEvents.length) {
    var data = this.rawEvents.pop();
    for (var key in this.globalDimensions) {
      if (this.globalDimensions.hasOwnProperty(key)) {
        data.dimensions[key] = this.globalDimensions[key];
      }
    }

    try {
      var eventToSend = _this._buildEvent(data);
      if (eventToSend) {
        var url = this.ingestEndpoint + '/' + this.EVENT_ENDPOINT_SUFFIX;
        return this.post(_this._encodeEvent(eventToSend), url, _this.getHeaderContentType());
      }
    } catch (error) {
      winston.error('Can\'t process event: ', error);
    }
  }
};

SignalFxClient.prototype.post = function (data, postUrl, contentType) {
  var _this = this;

  var headers = {};
  headers[_this.HEADER_USER_AGENT_KEY] = name + '/' + version;
  //Adding custom user agents passed by client modules
  if (_this.userAgents) {
    headers[_this.HEADER_USER_AGENT_KEY] += ',' + _this.userAgents;
  }
  headers[_this.HEADER_API_TOKEN_KEY] = _this.apiToken;
  headers[_this.HEADER_CONTENT_TYPE] = contentType;

  // An object of options to indicate where to post to
  var postOptions = {
    url: postUrl,
    timeout: _this.timeout,
    headers: headers,
    body: data,
    method: 'POST',
    proxy: _this.proxy
  };

  return new Promise(function (resolve, reject) {
    request(postOptions, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        winston.error('Failed to send datapoint: ', response ? response.statusCode : '', body, error);
        reject(error);
      }
      resolve(body);
    });
  });
};

exports.SignalFxClient = SignalFxClient;
