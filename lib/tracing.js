'use strict';
// Copyright (C) 2020 SignalFx, Inc. All rights reserved.

var tracing;
var logger = require('./logger');

try {
  tracing = require('signalfx-tracing');
  logger.info('found signalfx-tracing library. Protecting metrics code from being traced.');
} catch (err) {
  tracing = {};
}

if (tracing.withNonReportingScope === undefined) {
  tracing.withNonReportingScope = function (callback) {
    return callback();
  };
}

module.exports = tracing;
