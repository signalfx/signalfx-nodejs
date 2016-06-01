'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var winston = require('winston'); // Logging library

var SignalFxClient = require('./signal_fx_client').SignalFxClient;
var conf = require('../conf');

var protocolBuffers = require('./proto').protocolBuffers;

/**
 * SignalFx API client data handler that uses Protocol Buffers.
 * This class presents the interfaces that handle the serialization of data
 * using Protocol Buffers
 *
 * @param apiToken
 * @constructor
 */
function ProtoBufSignalFx(apiToken) {
  SignalFxClient.apply(this, arguments);
}

ProtoBufSignalFx.prototype = Object.create(SignalFxClient.prototype);
ProtoBufSignalFx.prototype.constructor = SignalFxClient;

ProtoBufSignalFx.prototype.getHeaderContentType = function () {
  return conf.PROTOBUF_HEADER_CONTENT_TYPE;
};

ProtoBufSignalFx.prototype._addToQueue = function (metricType, datapoint) {
  var protobufDatapoint = new protocolBuffers.DataPoint();

  // Set value by type
  protobufDatapoint.value = {};
  if (typeof datapoint.value === 'string') { // string value
    protobufDatapoint.value.strValue = datapoint.value;
  } else if (typeof datapoint.value === 'number' && datapoint.value % 1 !== 0) { // 'double' value
    protobufDatapoint.value.doubleValue = +datapoint.value;
  } else if (typeof datapoint.value === 'number' && datapoint.value % 1 === 0) { // int value
    protobufDatapoint.value.intValue = +datapoint.value;
  } else {
    throw new TypeError('Invalid Value ' + datapoint.value);
  }

  protobufDatapoint.metricType = protocolBuffers.MetricType[metricType.toUpperCase()];
  protobufDatapoint.metric = datapoint['metric'];

  if (datapoint['timestamp']) {
    protobufDatapoint.timestamp = +datapoint['timestamp'];
  }

  // set datapoint dimensions
  var dimensions = datapoint['dimensions'] || {};
  for (var key in dimensions) {
    if (dimensions.hasOwnProperty(key)) {
      var dim = {};
      dim.key = key;
      dim.value = dimensions[key];
      protobufDatapoint.dimensions.push(dim);
    }
  }
  this.queue.push(protobufDatapoint);
};

ProtoBufSignalFx.prototype._batchData = function (datapointsList) {
  var dpum = new protocolBuffers.DataPointUploadMessage();
  dpum.datapoints = dpum.datapoints.concat(datapointsList);

  try {
    var dataToSend = dpum.encode();
    return dataToSend.toBuffer();
  } catch (error) {
    winston.error('Invalid Protobuf object', error);
  }

  return undefined;
};

ProtoBufSignalFx.prototype._buildEvent = function (event) {
  var protobufEvent = new protocolBuffers.Event();
  if (event.eventType) {
    protobufEvent.eventType = event.eventType;
  }
  if (event.category) {
    protobufEvent.category = protocolBuffers.EventCategory[event.category.toUpperCase()];
  }

  if (event.timestamp) {
    protobufEvent.timestamp = +event.timestamp;
  }

  // set datapoint dimensions
  var dimensions = event['dimensions'] || {};
  for (var key in dimensions) {
    if (dimensions.hasOwnProperty(key)) {
      var dim = {};
      dim.key = key;
      dim.value = dimensions[key];
      protobufEvent.dimensions.push(dim);
    }
  }

  // set datapoint dimensions
  var properties = event.properties || {};
  for (var keyProp in properties) {
    if (properties.hasOwnProperty(keyProp)) {
      var prop = new protocolBuffers.Property();
      prop.key = keyProp;
      prop.value = new protocolBuffers.PropertyValue();
      var rawValue = properties[keyProp];
      if (typeof rawValue === 'string') { // string value
        prop.value.strValue = rawValue;
      } else if (typeof rawValue === 'number' && rawValue % 1 !== 0) { // 'double' value
        prop.value.doubleValue = +rawValue;
      } else if (typeof rawValue === 'number' && rawValue % 1 === 0) { // int value
        prop.value.intValue = +rawValue;
      } else {
        throw new TypeError('Invalid Value ' + rawValue);
      }
      protobufEvent.properties.push(prop);
    }
  }
  return protobufEvent; // dataToSend.toBuffer();
};

ProtoBufSignalFx.prototype._encodeEvent = function (protobufEvent) {
  var eventMessage = new protocolBuffers.EventUploadMessage();
  eventMessage.events = [];
  eventMessage.events.push(protobufEvent);
  var eventToSend = eventMessage.encode();
  return eventToSend.toBuffer();
};

exports.ProtoBufSignalFx = ProtoBufSignalFx;

