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

  function disconnect() {
    rm.disconnect();
  }

  function signalflowRequest(opts, requestType) {
    var metaDataMap = {};
    var msgBuffer = [];
    var callback = null;

    function resolveMessage(msg) {
      // we're duck typing error messages here, but it should be okay.
      if (msg.hasOwnProperty('error') && !msg.type) {
        errorMessageCallback(msg);
      } else {
        callback(null, msg);
      }
    }

    function errorMessageCallback(msg) {
      callback(msg, null);
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

    var callbacks = {
      onMessage: msgCallback,
      onError: errorMessageCallback
    };

    var requestId = rm.execute(opts, callbacks, null, requestType);

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
      stream: function (fn, errorFn) {
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

  return {
    disconnect: disconnect,
    execute: function (opts) {
      return signalflowRequest(opts, 'execute');
    },
    explain: function (opts) {
      return signalflowRequest(opts, 'explain');
    }
  };
}

module.exports = SignalflowClient;
