'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var SignalFxClient = require('./signal_fx_client').SignalFxClient;
var conf = require('./conf');
/**
 * SignalFx API client data handler that uses Json
 * This class presents the interfaces that handle the serialization of data
 * using Json
 *
 * @param apiToken
 * @constructor
 */
function JsonSignalFx(apiToken) {
  SignalFxClient.apply(this, arguments);
}

JsonSignalFx.prototype = Object.create(SignalFxClient.prototype);
JsonSignalFx.prototype.constructor = SignalFxClient;

JsonSignalFx.prototype.getHeaderContentType = function () {
  return conf.JSON_HEADER_CONTENT_TYPE;
};

JsonSignalFx.prototype._addToQueue = function (metricType, datapoint) {
  var jsonObject = {};
  jsonObject[metricType] = datapoint;
  this.queue.push(jsonObject);
};

JsonSignalFx.prototype._batchData = function (datapointsList) {
  var data = {};
  datapointsList.forEach(function (element) {

    for (var metricType in element) {
      if (element.hasOwnProperty(metricType)) {
        if (!data[metricType]) {
          data[metricType] = [];
        }
        data[metricType].push(element[metricType]);
      }
    }
  });
  return JSON.stringify(data);
};

exports.JsonSignalFx = JsonSignalFx;
