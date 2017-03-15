'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

// Default Parameters
exports.DEFAULT_INGEST_ENDPOINT = 'https://ingest.signalfx.com';
exports.DEFAULT_API_ENDPOINT = 'https://api.signalfx.com';
exports.DEFAULT_SIGNALFLOW_WEBSOCKET_ENDPOINT = 'wss://stream.signalfx.com';
exports.DEFAULT_BATCH_SIZE = 300;// Will wait for this many requests before posting
exports.DEFAULT_TIMEOUT = 1000; // Default timeout is 1s

// Whether to request SignalFlow WebSocket message compression.
exports.COMPRESS_SIGNALFLOW_WEBSOCKET_MESSAGES = true;

// Global Parameters
exports.PROTOBUF_HEADER_CONTENT_TYPE = 'application/x-protobuf';
exports.JSON_HEADER_CONTENT_TYPE = 'application/json';

exports.AWS_UNIQUE_ID_URL = 'http://169.254.169.254/2014-11-05/dynamic/instance-identity/document';
