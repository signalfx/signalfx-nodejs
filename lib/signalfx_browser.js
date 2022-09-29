'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var SignalFlowClient = require('./client/signalflow/signalflow_client');
var consts = require('./constants');

module.exports.SignalFlow = SignalFlowClient;
module.exports.CONSTANTS = consts;

if (typeof window === 'object') {
  window.signalfx = window.signalfx || {};
  window.signalfx.streamer = window.signalfx.streamer || {};
  window.signalfx.streamer.SignalFlow = SignalFlowClient;
  window.signalfx.streamer.CONSTANTS = consts;
}
