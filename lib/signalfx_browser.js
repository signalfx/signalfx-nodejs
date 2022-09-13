'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var SignalFlowClient = require('./client/signalflow/signalflow_client');
var consts = require('./constants');

// ============================================================================================
//                                 Export modules
// ============================================================================================
module.exports.streamer = {
  SignalFlow: SignalFlowClient,
  CONSTANTS: consts
};
