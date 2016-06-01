'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var ProtoBufSignalFx = require('./client/ingest/protobuf_signal_fx_client').ProtoBufSignalFx;
var JsonSignalFx = require('./client/ingest/json_signal_fx_client').JsonSignalFx;
var protocolBufferEnabled = require('./client/ingest/proto').protocolBufferEnabled;
var SignalFlowClient = require('./client/signalflow/signalflow_client');

// ============================================================================================
//                                 Export modules
// ============================================================================================
module.exports.Ingest = protocolBufferEnabled ? ProtoBufSignalFx : JsonSignalFx;
module.exports.IngestJson = JsonSignalFx;
module.exports.SignalFlow = SignalFlowClient;
