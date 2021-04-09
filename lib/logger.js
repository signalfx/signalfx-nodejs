'use strict';
// Copyright (C) 2020 Splunk, Inc. All rights reserved.

var levels = {
  error: 1,
  info: 2,
  warn: 3,
  debug: 4
};

var methods = {
  error: console.error,
  info: console.info,
  warn: console.warn,
  debug: console.debug
};

var defaultLevel = levels[process.env.SFX_CLIENT_LOG_LEVEL || 'info'];

function createLogger(level) {
  if (defaultLevel && levels[level] > defaultLevel) {
    return function () {};
  }
  return function () {
    var method = methods[level] || console.log;
    arguments[0] = level + ': ' + arguments[0];
    method.apply(this, arguments);
  };
}

module.exports = {
  log: createLogger(defaultLevel),
  info: createLogger('info'),
  warn: createLogger('warn'),
  warning: createLogger('warn'),
  error: createLogger('error'),
  debug: createLogger('debug')
};
