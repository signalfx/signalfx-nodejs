'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var logger = require('../../logger');

var protocolBuffers;
var protocolBufferEnabled = false;
try {
  protocolBuffers = require('../../proto/signal_fx_protocol_buffers_pb2').com.signalfx.metrics.protobuf;
  protocolBufferEnabled = true;
} catch (error) {
  logger.warn('Protocol Buffers not installed properly %s', error);
  protocolBufferEnabled = false;
}

exports.protocolBufferEnabled = protocolBufferEnabled;
exports.protocolBuffers = protocolBuffers;
