'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var axios = require('axios');
var logger = require('../../logger'); // Logging library

var conf = require('../conf');
var tracing = require('../../tracing');

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

  this.loadAWSUniqueId = new Promise((resolve) => {
    if (!this.enableAmazonUniqueId) {
      resolve();
      return;
    } else if (this.AWSUniqueId) {
      resolve();
      return;
    }

    this._retrieveAWSUniqueId().then((id) => {
      this.AWSUniqueId = id;
      this.globalDimensions[this.AWSUniqueId_DIMENTION_NAME] = id;
      resolve();
    }).catch((error) => {
      this.AWSUniqueId = undefined;
      delete this.globalDimensions[this.AWSUniqueId_DIMENTION_NAME];

      this.enableAmazonUniqueId = false;

      logger.error(error);
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

SignalFxClient.prototype._addToQueue = function (_metricType, _datapoint) {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._batchData = function (_datapointsList) {
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


SignalFxClient.prototype._retrieveAWSUniqueId = function () {
  var getOptions = {
    url: conf.AWS_UNIQUE_ID_URL,
    timeout: 1000,
    method: 'GET',
    proxy: this.proxy
  };

  return tracing.withNonReportingScope(() => axios(getOptions).then(
    (response) => {
      if (!response.data) {
        return Promise.reject('Missing response body in response from AWS instance metadata.');
      }

      const { instanceId, region, accountId } = response.data;
      if (!instanceId || !region || !accountId) {
        return Promise.reject('Missing fields in response from AWS instance metadata.');
      }

      return `${instanceId}_${region}_${accountId}`;
    },
    (err) => {
      return Promise.reject(`Failed to fetch AWS instance metadata: ${err.message}`);
    }
  ));
};

SignalFxClient.prototype.getHeaderContentType = function () {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._buildEvent = function (_event) {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype._encodeEvent = function (_event) {
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
      logger.error('Can\'t process event: %s', error);
    }
  }
};

SignalFxClient.prototype.post = function (data, postUrl, contentType) {
  var headers = {};
  headers[this.HEADER_USER_AGENT_KEY] = name + '/' + version;
  //Adding custom user agents passed by client modules
  if (this.userAgents) {
    headers[this.HEADER_USER_AGENT_KEY] += ',' + this.userAgents;
  }
  headers[this.HEADER_API_TOKEN_KEY] = this.apiToken;
  headers[this.HEADER_CONTENT_TYPE] = contentType;

  // An object of options to indicate where to post to
  var postOptions = {
    url: postUrl,
    timeout: this.timeout,
    headers: headers,
    data,
    method: 'POST',
    proxy: this.proxy
  };

  return tracing.withNonReportingScope(() => axios(postOptions).then(
    (response) => response.data,
    (error) => {
      const { response } = error;
      if (response) {
        logger.error('Failed to send datapoint: %s %s %s', response.status, response.data, error.message);
      } else {
        logger.error('Failed to send datapoint: %s', error.message);
      }
    }
  ));
};

exports.SignalFxClient = SignalFxClient;
