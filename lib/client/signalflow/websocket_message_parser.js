'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var base64js = require('base64-js');
var BigNumber = require('bignumber.js');
// unfortunately, bigNumber will throw an error on constructors with more than 15 significant digits, which is certainly possible in JS.
BigNumber.config({ ERRORS: false });

var hiMult = Math.pow(2, 32);

var msgFormats = {
  1: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //+---------------+---------------+-------------------------------+
    //| Version       | Message type  | (Reserved)                    |
    //+---------------+---------------+-------------------------------+
    //|        Channel name (fixed 16 bytes, right-NUL-padded)        |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+---------------------------------------------------------------+
    //|           Data batch logical millisecond timestamp            |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                      Timetamp (continued)                     |
    //+---------------------------------------------------------------+
    //|                     Payload element count                     |
    //+---------------------------------------------------------------+
    //| Payload data, series of 17-byte 3-uples: 1-byte value type,   |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| 8-byte timeseries ID (long) and 8-byte datapoint value,       |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| either a long (0x01) or a double (0x02), based on value type. |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| Payload data continued ...                                    |
    //+---------------------------------------------------------------+
    {
      label: 'version',
      type: 'Uint',
      size: 1
    },
    {
      label: 'messageType',
      type: 'Uint',
      size: 1
    },
    {
      label: null,
      size: 2
    },
    {
      label: 'channel',
      type: 'string',
      size: 16
    },
    {
      label: 'timestampMs1',
      type: 'Uint',
      size: 4
    },
    {
      label: 'timestampMs2',
      type: 'Uint',
      size: 4
    },
    {
      label: 'count',
      type: 'Uint',
      size: 4
    }
  ],
  2: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //+---------------+---------------+-------------------------------+
    //|            Version            | Message type  | (Reserved)    |
    //+---------------+---------------+-------------------------------+
    //|        Channel name (fixed 16 bytes, right-NUL-padded)        |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+---------------------------------------------------------------+
    //|           Data batch logical millisecond timestamp            |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                      Timetamp (continued)                     |
    //+---------------------------------------------------------------+
    //|           Effective maxDelay (in milliseconds) used           |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|             for the processing of this data batch             |
    //+---------------------------------------------------------------+
    //|                     Payload element count                     |
    //+---------------------------------------------------------------+
    //| Payload data, series of 17-byte 3-uples: 1-byte value type,   |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| 8-byte timeseries ID (long) and 8-byte datapoint value,       |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| either a long (0x01) or a double (0x02), based on value type. |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //| Payload data continued ...                                    |
    //+---------------------------------------------------------------+
    {
      label: 'version',
      type: 'Uint',
      size: 2
    },
    {
      label: 'messageType',
      type: 'Uint',
      size: 1
    },
    {
      label: null,
      size: 1
    },
    {
      label: 'channel',
      type: 'string',
      size: 16
    },
    {
      label: 'timestampMs1',
      type: 'Uint',
      size: 4
    },
    {
      label: 'timestampMs2',
      type: 'Uint',
      size: 4
    },
    {
      label: 'maxDelayMs1',
      type: 'Uint',
      size: 4
    },
    {
      label: 'maxDelayMs2',
      type: 'Uint',
      size: 4
    },
    {
      label: 'count',
      type: 'Uint',
      size: 4
    }
  ]
};

function getSnowflakeIdFromUint8Array(Uint8Arr) {
  //packaged lib uses base64 not base64URL, so swap the different chars
  return base64js.fromByteArray(Uint8Arr).substring(0, 11).replace(/\+/g, '-').replace(/\//g, '_');
}

function parseWebSocketMessage(msg, knownComputations) {
  if (msg.data && msg.data.byteLength) {
    var msgObject = {
      type: 'data'
    };

    var view = new DataView(msg.data);
    var version = view.getUint8(0);
    var offset = 0;

    for (var x = 0; x < msgFormats[version].length; x++) {
      var item = msgFormats[version][x];
      if (item.label) {
        if (item.type === 'string') {
          msgObject[item.label] = '';
          for (var y = 0; y < item.size; y++) {
            var chr = view.getUint8(offset + y);
            if (chr === 0) {
              break;
            }
            msgObject[item.label] += String.fromCharCode(chr);
          }
        } else {
          msgObject[item.label] = view['get' + item.type + (item.size * 8)](offset);
        }
      }
      offset += item.size;
    }

    msgObject.logicalTimestampMs = (msgObject.timestampMs1 * hiMult) + msgObject.timestampMs2;
    delete msgObject.timestampMs1;
    delete msgObject.timestampMs2;

    if (typeof msgObject.maxDelayMs1 !== 'undefined' && typeof msgObject.maxDelayMs2 !== 'undefined') {
      msgObject.maxDelayMs = (msgObject.maxDelayMs1 * hiMult) + msgObject.maxDelayMs2;
      delete msgObject.maxDelayMs1;
      delete msgObject.maxDelayMs2;
    }

    var bigNumberRequested = false;
    if (typeof knownComputations[msgObject.channel] !== 'undefined' && knownComputations[msgObject.channel].params) {
      bigNumberRequested = knownComputations[msgObject.channel].params.bigNumber;
    }

    var values = [];

    msgObject.data = values;

    for (var dataPointCount = 0; dataPointCount < msgObject.count; dataPointCount++) {
      var type = view.getUint8(offset);
      offset++;
      var tsidBytes = [];
      for (var tsidByteIndex = 0; tsidByteIndex < 8; tsidByteIndex++) {
        tsidBytes.push(view.getUint8(offset));
        offset++;
      }
      var tsId = getSnowflakeIdFromUint8Array(tsidBytes);

      var val = null;
      if (type === 2) {
        val = view.getFloat64(offset);
        if (bigNumberRequested) {
          val = new BigNumber(val);
        }
      } else {
        // get MSB for twos complement to determine sign
        var isNegative = view.getUint32(offset) >>> 31 > 0;
        if (isNegative) {
          // twos complement manual handling, because we cannot do Int64.
          // must do >>> 0 to prevent bit flips from turning into signed integers.
          val = new BigNumber(hiMult).times(~view.getUint32(offset) >>> 0).plus(~view.getUint32(offset + 4) >>> 0).plus(1).times(-1);
        } else {
          val = (new BigNumber(view.getUint32(offset))).times(hiMult).plus(view.getUint32(offset + 4));
        }
        if (!bigNumberRequested) {
          val = val.toNumber();
        }
      }
      offset += 8;
      values.push({tsId: tsId, value: val});
    }

    delete msgObject.count;
    return msgObject;
  } else if (msg.type) {
    return JSON.parse(msg.data);
  } else {
    console.warn('Unrecognized websocket message.');
    return null;
  }
}

module.exports = {
  getSnowflakeIdFromUint8Array: getSnowflakeIdFromUint8Array,
  parseWebSocketMessage: parseWebSocketMessage
};
