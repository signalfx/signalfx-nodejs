'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var request = require('request'); // Use for create post request
var async = require('async'); // Use fo make post request in separate thread
var winston = require('winston'); // Logging library

var conf = require('./conf');

// Application version and name for User-Agent
var name = 'signalfx-nodejs-client';
var version = require('../../package.json').version;

/**
 * SignalFx API client.
 * This class presents a programmatic interface to SignalFx's metadata and
 * ingest APIs. At the time being, only ingest is supported; more will come
 * later.
 *
 * @constructor
 * @param apiToken
 * @param ingestEndpoint
 * @param apiEndpoint
 * @param timeout
 * @param batchSize
 * @param userAgents
 */
function SignalFxClient(apiToken, ingestEndpoint,
                        apiEndpoint, timeout,
                        batchSize, userAgents) {
  this.apiToken = apiToken;
  this.ingestEndpoint = ingestEndpoint || conf.DEFAULT_INGEST_ENDPOINT;
  this.apiEndpoint = apiEndpoint || conf.DEFAULT_API_ENDPOINT;
  this.timeout = timeout || conf.DEFAULT_TIMEOUT;
  this.batchSize = Math.max(1, (batchSize ? batchSize : conf.DEFAULT_BATCH_SIZE));
  this.userAgents = userAgents || null;

  this.queue = [];
  this.asyncRunning = false;
}

SignalFxClient.prototype.HEADER_API_TOKEN_KEY = 'X-SF-Token';
SignalFxClient.prototype.HEADER_USER_AGENT_KEY = 'User-Agent';
SignalFxClient.prototype.HEADER_CONTENT_TYPE = 'Content-Type';
SignalFxClient.prototype.INGEST_ENDPOINT_SUFFIX = 'v2/datapoint';
SignalFxClient.prototype.API_ENDPOINT_SUFFIX = 'v1/event';

/**
 * Send the given metrics to SignalFx.
 *
 * @param data - param object with followinf fields:
 *    'cumulative_counters' (list): a list of dictionaries representing the cumulative counters to report.
 *    'gauges' (list): a list of dictionaries representing the gauges to report.
 *    'counters' (list): a list of dictionaries representing the counters to report.
 */
SignalFxClient.prototype.send = function (data) {
  var _this = this;

  function processDataPoints(metricType, dataPoints) {
    if (!dataPoints) {
      return;
    }

    if (!Array.isArray(dataPoints)) {
      throw new TypeError('DataPoints not of type list: ' + dataPoints);
    }

    dataPoints.forEach(function (dp) {
      _this._addToQueue(metricType, dp);
    });
  }

  processDataPoints('cumulative_counter', data.cumulative_counters);
  processDataPoints('gauge', data.gauges);
  processDataPoints('counter', data.counters);


  this.startAsyncSend();
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
 * @param eventType (string): the event type (name of the event time series).
 * @param dimensions  (dict): a map of event dimensions.
 * @param properties  (dict): a map of extra properties on that event.
 */
SignalFxClient.prototype.sendEvent = function (eventType, dimensions, properties) {
  var data = {
    eventType: eventType,
    dimensions: dimensions || {},
    properties: properties || {}
  };

  var url = this.apiEndpoint + '/' + this.API_ENDPOINT_SUFFIX;
  this.post(JSON.stringify(data), url, conf.JSON_HEADER_CONTENT_TYPE);
};

SignalFxClient.prototype.getHeaderContentType = function () {
  throw new Error('Subclasses should implement this!');
};

SignalFxClient.prototype.startAsyncSend = function () {
  if (this.asyncRunning) {
    return;
  }

  var _this = this;
  this.asyncRunning = true;


  // Send post request in separate thread
  async.queue(function (task, callback) {
    var datapointsList = [];
    while (_this.queue.length !== 0 && datapointsList.length < _this.batchSize) {
      datapointsList.push(_this.queue.shift());
    }

    var dataToSend = _this._batchData(datapointsList);
    if (dataToSend) {
      var url = _this.ingestEndpoint + '/' + _this.INGEST_ENDPOINT_SUFFIX;
      _this.post(dataToSend, url, _this.getHeaderContentType(), callback);
    }
  }, 2).push({}, function () {
    _this.asyncRunning = false;
  });
};

SignalFxClient.prototype.post = function (data, postUrl, contentType, callback) {
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
    method: 'POST'
  };

  request(postOptions, function (error, response, body) {
    if (callback) {
      callback();
    }

    if (error || response.statusCode !== 200) {
      winston.error('Failed to sent datapoint: ', response.statusCode ? response.statusCode : '', body);
    }
  });
};

exports.SignalFxClient = SignalFxClient;
