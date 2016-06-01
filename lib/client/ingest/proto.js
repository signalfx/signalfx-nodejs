'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var winston = require('winston'); // Logging library

var protocolBuffers;
var protocolBufferEnabled = false;
try {
  protocolBuffers = require('../../proto/signal_fx_protocol_buffers_pb2').com.signalfx.metrics.protobuf;
  protocolBufferEnabled = true;
} catch (error) {
  winston.warn('Protocol Buffers not installed properly. ', error);
  protocolBufferEnabled = false;
}

exports.protocolBufferEnabled = protocolBufferEnabled;
exports.protocolBuffers = protocolBuffers;
