'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var RequestManager = require('./request_manager');


function SignalflowClient(apiToken, options) {
  var signalflowEndpoint = null;
  if (options && options.signalflowEndpoint) {
    signalflowEndpoint = options.signalflowEndpoint;
  }
  var rm = new RequestManager(signalflowEndpoint);

  rm.authenticate(apiToken);
  return {
    disconnect: function () {
      rm.disconnect();
    },
    execute: function (opts, optionalRequestType) {
      var metaDataMap = {};
      var msgBuffer = [];
      var callback = null;

      function resolveMessage(msg) {
        // we're duck typing error messages here, but it should be okay.
        if (msg.hasOwnProperty('error') && !msg.type) {
          callback(msg, null);
        } else {
          callback(null, msg);
        }
      }

      function msgCallback(msg) {
        if (msg.type === 'metadata') {
          metaDataMap[msg.tsId] = msg;
        }
        if (!callback) {
          msgBuffer.push(msg);
        } else {
          resolveMessage(msg);
        }
      }

      var requestId = rm.execute(opts, msgCallback, null, optionalRequestType);

      return {
        close: function () {
          return rm.stop(requestId);
        },
        get_known_tsids: function () {
          return Object.keys(metaDataMap);
        },
        get_metadata: function (tsid) {
          if (!tsid || !metaDataMap[tsid]) {
            return null;
          }
          return metaDataMap[tsid];
        },
        stream: function (fn) {
          if (typeof fn !== 'function') {
            return false;
          }
          callback = fn;
          msgBuffer.forEach(resolveMessage);
          msgBuffer = [];
          return true;
        }
      };
    }
  };
}

module.exports = SignalflowClient;
