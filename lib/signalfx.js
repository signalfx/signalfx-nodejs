'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var ProtoBufSignalFx = require('./client/protobuf_signal_fx_client').ProtoBufSignalFx;
var JsonSignalFx = require('./client/json_signal_fx_client').JsonSignalFx;
var protocolBufferEnabled = require('./client/proto').protocolBufferEnabled;

// ============================================================================================
//                                 Export modules
// ============================================================================================
module.exports.SignalFx = protocolBufferEnabled ? ProtoBufSignalFx : JsonSignalFx;
module.exports.SignalFxJson = JsonSignalFx;

