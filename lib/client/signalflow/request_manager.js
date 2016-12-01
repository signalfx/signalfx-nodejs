'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var sfxWSMsgHandler = require('./websocket_message_parser');
var routedMessageHandler = require('./message_router');

var WebSocket = null;
try {
  //huge hack.
  WebSocket = window.WebSocket; // eslint-disable-line
} catch (e) {
  WebSocket = require('ws');
}
var conf = require('../conf');
var SSE = require('sse.js');


function RequestManager(endPoint) {
  var knownComputations = {};
  var requestIdIndex = 0;
  var maxJobCount = 10000;
  var authToken = null;
  var sfxEndpoint = conf.DEFAULT_API_ENDPOINT; // TODO : SSE support?
  var wsEndpoint = endPoint || conf.DEFAULT_SIGNALFLOW_WEBSOCKET_ENDPOINT;
  var pendingWSRequests = [];
  var wsConnectionOpen = false;

  //move me to constants
  var transports = {
    WEBSOCKET: 1,
    SSE: 2
  };

  var requiredParams = {
    execute: ['program'],
    explain: ['incidentId']
  };

  var activeSocket = null;
  var transport = transport || transports.WEBSOCKET;
  var lastKeepAliveTime = -1;
  var warnedDisconnected = false;
  var keepAliveInterval = null;

  function getRequestIdAndIncrement() {
    return 'R' + requestIdIndex++;
  }

  function onWebSocketMessage(msg) {
    var parsedMsg = sfxWSMsgHandler.parseWebSocketMessage(msg);
    if (parsedMsg.event === 'KEEP_ALIVE') {
      lastKeepAliveTime = Date.now();
    }

    if (parsedMsg.event === 'JOB_START') {
      if(!knownComputations[parsedMsg.channel]) {
        //this occurs when the job has been stopped before it started
        return;
      }
      knownComputations[parsedMsg.channel].handle = parsedMsg.handle;
      if (knownComputations[parsedMsg.channel].pendingStop) {
        stop(parsedMsg.channel);
      }
    }

    if (parsedMsg.type === 'authenticated') {
      flushPendingWSRequests();
    }

    if (parsedMsg.channel) {
      //do not attempt to route messages that lack a channel, such as keepalive
      routeMessage(parsedMsg, parsedMsg.channel);
    }

    // This must always be last, or there dont be a request to route this message to.
    if(parsedMsg.event === 'END_OF_CHANNEL') {
      removeComputation(parsedMsg.channel);
    }
  }

  function flushPendingWSRequests() {
    pendingWSRequests.forEach(function (pendingRequest) {
      streamComputationWebsocket(pendingRequest.params, pendingRequest.requestId, pendingRequest.callback, pendingRequest.requestType);
    });
    pendingWSRequests = [];
  }

  function hasRequiredJobParams(params, requestType) {
    var hasErrors = false;
    (requiredParams[requestType]||[]).forEach(function (reqParam) {
      if(!params[reqParam]) {
        console.error('Unable to create signalflow request without required property : '+ reqParam);
        hasErrors = true;
      }
    });
    return hasErrors === false;
  }

  function validateJobParams(params, requestType) {
    if(!hasRequiredJobParams(params, requestType)) {
      throw new Error('There were insufficient parameters in the request.');
    }
  }

  function getJobObject(params, requestType) {
    validateJobParams(params, requestType);
    var obj = {};
    Object.keys(params).forEach(function (paramName) {
      // TODO : we should deep copy here to prevent weirdness if we eventually allow non string/number/boolean values...
      obj[paramName] = params[paramName];
    });
    return obj;
  }

  function reconnect(token) {
    wsConnectionOpen = false;
    authenticate(token);
    Object.keys(knownComputations).forEach(function (computation) {
      knownComputations[computation].streamController.retry();
    });
  }

  function authenticate(token) {
    authToken = token;
    if (transport === transports.SSE) {
      //no pre-auth necessary
    } else if (transport === transports.WEBSOCKET) {
      lastKeepAliveTime = Date.now();
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      keepAliveInterval = setInterval(function () {
        if ((Date.now() - lastKeepAliveTime) > 60000) {
          if (!warnedDisconnected) {
            warnedDisconnected = true;
            console.error('Socket disconnected.');
            //TODO: alert all channels?
          }
          reconnect(token);
        }
      }, 5000);
      if (activeSocket) {
        activeSocket.close();
      }


      activeSocket = new WebSocket(wsEndpoint + '/v2/signalflow/connect');
      activeSocket.binaryType = 'arraybuffer';
      activeSocket.onmessage = onWebSocketMessage;
      activeSocket.onopen = function (ev) {
        activeSocket.send(JSON.stringify({type: 'authenticate', token: authToken}));
        wsConnectionOpen = true;
      };
    } else {
      console.error('Unrecognized transport type.');
    }
  }

  function routeMessage(msg, requestId) {
    if(knownComputations[requestId]) {
      knownComputations[requestId].onMessage(msg);
    }
  }

  function getNormalizedStreamTracker(streamObject) {
    if (streamObject.transport === transports.WEBSOCKET) {
      return {
        stop: function (reason) {
          activeSocket.send(JSON.stringify({
            type: 'detach',
            channel: streamObject.requestId,
            reason: reason || 'Stopped by client request.'
          }));
          removeComputation(streamObject.requestId);
          return true;
        },
        retry: function () {
          //TODO : apply config policy (alwaysFillGaps).
          var alwaysFillGaps = false;
          var originalRange = streamObject.range;
          var dataDelta = Date.now() - streamObject.lastDataBatchTime();

          if (alwaysFillGaps || dataDelta < originalRange) {
            streamObject.params.start = streamObject.lastDataBatchTime();
          } else {
            streamObject.params.start = Date.now() - originalRange;
          }
          removeComputation(streamObject.requestId);
          execute(streamObject.params, streamObject.callback, streamObject.requestId, streamObject.requestType);
        }
      };
    } else if (streamObject.transport === transports.SSE) {
      return {
        stop: function () {
          streamObject.SSE.close();
          return true;
        },
        retry: function () {
          //NYI
        }
      };
    }
  }

  function addComputation(params, requestId, transportType, cb, requestType) {
    var router = routedMessageHandler(params, cb);
    knownComputations[requestId] = {
      params: params,
      callback: cb,
      onMessage: router.onMessage,
      transport: transportType,
      requestId: requestId,
      lastDataBatchTime: router.getLatestBatchTimeStamp,
      range: Date.now() - params.start,
      requestType: requestType // unused at the moment but useful for debugging
    };

    knownComputations[requestId].streamController = getNormalizedStreamTracker(knownComputations[requestId]);
    return knownComputations[requestId];
  }

  function streamComputationWebsocket(params, requestId, cb, requestType) {
    //hack, obviously
    if (!wsConnectionOpen) {
      pendingWSRequests.push({params: params, requestId: requestId, callback: cb, requestType: requestType});
    } else {
      addComputation(params, requestId, transports.WEBSOCKET, cb, requestType);
      var jobObject = getJobObject(params, requestType);
      jobObject.type = requestType;
      jobObject.channel = requestId;
      activeSocket.send(JSON.stringify(jobObject));
    }
  }

  function streamComputationSSE(params, requestId, requestType) {
    var comp = addComputation(params, requestId, transports.SSE, null, requestType);
    var myStream = new SSE(sfxEndpoint + '/v2/signalflow/' + requestType, {
      headers: {
        'X-SF-TOKEN': authToken
      },
      payload: params.program,
      method: 'POST'
    });


    myStream.addEventListener('message', function (e) {
      //call appropriate callback on params
      if (e.data) {
        var msg = JSON.parse(e.data);
        msg.type = 'message';
        routeMessage(msg, requestId);
      }
    });

    myStream.addEventListener('data', function (e) {
      var msg = JSON.parse(e.data);
      msg.type = 'data';
      routeMessage(msg, requestId);
    });

    myStream.addEventListener('metadata', function (e) {
      //call appropriate callback on params
      var msg = JSON.parse(e.data);
      msg.type = 'metadata';
      routeMessage(msg, requestId);
    });

    myStream.addEventListener('error', function (e) {
      // this is pretty coarse logic, but basically on error make sure we aren't tracking this job for restarts if its finished
      // for now, on any error, remove the computation.  we need to improve error messages because its not possible to determine
      // if an error was due to a bad request or something else, and we don't know when to retry
      //if(true || streamObject.stopRequested || params.stop > -1 && ((streamObject.lastSeenDataTime + (streamObject.resolution || 0)) > params.stop)) {
      //  removeComputation(streamObject.requestId);
      //} else {
      //  //infinite duration.  is this safe to do?
      //  if(streamObject.start) {
      //    var startOffset = streamObject.start + (Date.now() - streamObject.initTime);
      //    // set the new start time to be the greater of time elapsed - range, or last datapoint seen from server
      //    streamObject.start = Math.max(startOffset, streamObject.lastSeenDataTime || 0);
      //  }
      //
      //  //for websockets, this would be global, not per stream
      //  console.log('retry queued for '+streamObject.requestId);
      //  streamObject.restartPending = true;
      //}
    });

    myStream.stream();

    comp.SSE = myStream;
  }

  function removeComputation(requestId) {
    if (knownComputations[requestId]) {
      knownComputations[requestId].stopRequested = true;
      delete knownComputations[requestId];
      return true;
    } else {
      return false;
    }
  }

  function execute(params, cb, overrideRequestId, optionalRequestType) {
    var requestType = optionalRequestType || 'execute';
    if (!hasRequiredJobParams(params, requestType)) {
      console.error('There were insufficient parameters in the request.');
      return;
    }
    if (Object.keys(knownComputations).length >= maxJobCount) {
      console.error('Too many active jobs open!  Stop one of the returned IDs to proceed.  ');
      return Object.keys(knownComputations);
    }
    var requestId = overrideRequestId || getRequestIdAndIncrement();
    //todo : deep copy params?

    if (transport === transports.SSE) {
      streamComputationSSE(params, requestId, requestType);
    } else if (transport === transports.WEBSOCKET) {
      streamComputationWebsocket(params, requestId, cb, requestType);
    } else {
      console.error('Unrecognized transport');
    }
    return requestId;
  }

  function stop(requestId) {
    if (knownComputations[requestId]) {
      return knownComputations[requestId].streamController.stop();
    } else {
      var requestIndex = -1;
      pendingWSRequests.some(function (req, idx) {
        if (req.requestId === requestId) {
          requestIndex = idx;
          return true;
        }
      });
      if (requestIndex > -1) {
        pendingWSRequests.splice(requestIndex, 1);
        console.log('Removed ' + requestId + ' from authentication queue.');
      }
      // if the request wasn't a found in activeRequests, nor pending, then it was likely created
      // with a stop time in the past and was stopped internally
      return true;
    }
  }

  function disconnect() {
    //should we give a brief 1s window for pre-close messages to be sent?
    setTimeout(function () {
      activeSocket.close();
    }, 1000);
    authToken = null;
    clearInterval(keepAliveInterval);
    //destroy all open SSE connections
  }

  return {
    authenticate: authenticate,
    execute: execute,
    stop: stop,
    disconnect: disconnect
  };
}

module.exports = RequestManager;
