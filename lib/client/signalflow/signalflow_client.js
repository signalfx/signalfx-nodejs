'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var RequestManager = require('./request_manager');


function SignalflowClient(apiToken, options) {
  var rm = new RequestManager(options);

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
      if (Object.prototype.hasOwnProperty.call(msg, 'error') && !msg.type) {
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
      // TODO: fix usage of _errorFn
      stream: function (fn, _errorFn) {
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
  /**
   * This is a method on  SignalflowClient that registers a live tail and exposes the stream and close methos to
   * get live tail data and to stop a live tail.
   * @param opts - {
   *                query: {
   *                  matcher: {
   *                    params: {
   *                      op: string,
   *                      args: object
   *                    },
   *                  }
   *                },
   *                throttleOptions: { rate: number }
   *              }
   */
  function liveTailRequest(opts) {
    var msgBuffer = [];
    var callback = null;

    function resolveMessage(msg) {
      if (!callback) {
        msgBuffer.push(msg);
        return;
      }
      if (msg.type === 'error') {
        callback(msg, null);
      } else {
        callback(null, msg);
      }
    }

    var requestId = rm.registerLiveTail(opts, resolveMessage, null);

    return {
      close: function () {
        return rm.stopLiveTail(requestId);
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
  return {
    disconnect: disconnect,
    execute: function (opts) {
      return signalflowRequest(opts, 'execute');
    },
    explain: function (opts) {
      return signalflowRequest(opts, 'explain');
    },
    preflight: function (opts) {
      return signalflowRequest(opts, 'preflight');
    },
    livetail: liveTailRequest
  };
}

module.exports = SignalflowClient;
