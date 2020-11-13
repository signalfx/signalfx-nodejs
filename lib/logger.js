'use strict';
// Copyright (C) 2020 Splunk, Inc. All rights reserved.

var winston = require('winston');

var logger = winston.createLogger({
  level: process.env.SFX_CLIENT_LOG_LEVEL || 'info',
  format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
