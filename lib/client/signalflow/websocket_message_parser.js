'use strict';
// Copyright (C) 2016-2017 SignalFx, Inc. All rights reserved.

var base64js = require('base64-js');
var BigNumber = require('bignumber.js');
// unfortunately, bigNumber will throw an error on constructors with more than
// 15 significant digits, which is certainly possible in JS.
BigNumber.config({ ERRORS: false });
var pako = require('pako');
var TextEncoding = require('text-encoding');

var textDecoder = new TextEncoding.TextDecoder('utf-8');

var hiMult = Math.pow(2, 32);
var binaryHeaderLength = 20;
var binaryHeaderFormats = {
  1: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //+---------------+---------------+-------------------------------+
    //| Version       | Message type  | Flags         | (Reserved)    |
    //+---------------+---------------+-------------------------------+
    //|        Channel name (fixed 16 bytes, right-NUL-padded)        |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+---------------------------------------------------------------+
    {
      label: 'version',
      type: 'Uint',
      size: 1
    },
    {
      label: 'type',
      type: 'Uint',
      size: 1
    },
    {
      label: 'flags',
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
    }
  ],


  2: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //+---------------+---------------+-------------------------------+
    //|            Version            | Message type  | Flags         |
    //+---------------+---------------+-------------------------------+
    //|        Channel name (fixed 16 bytes, right-NUL-padded)        |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
    //|                   Channel name (continued)                    |
    //+---------------------------------------------------------------+
    {
      label: 'version',
      type: 'Uint',
      size: 2
    },
    {
      label: 'type',
      type: 'Uint',
      size: 1
    },
    {
      label: 'flags',
      type: 'Uint',
      size: 1
    },
    {
      label: 'channel',
      type: 'string',
      size: 16
    }
  ]
};

/**
 * Stream message types.
 */
var binaryMessageTypes = {
  1: 'control-message',
  2: 'message',
  3: 'event',
  4: 'metadata',
  5: 'data',
  6: 'error',
  7: 'authenticated',
  8: 'computation-started',
  9: 'estimation',
  10: 'expired-tsid'
};

var binaryDataMessageFormats = {
  1: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
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

  512: [
    //.0                   1                   2                   3
    //.0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
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

/**
 * Convert the given Uint8 array into a SignalFx Snowflake ID.
 */
function getSnowflakeIdFromUint8Array(Uint8Arr) {
  // packaged lib uses base64 not base64URL, so swap the different chars
  return base64js.fromByteArray(Uint8Arr).substring(0, 11).replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Extract fields from the given DataView following a specific a binary format
 * specification into the given target object.
 */
function extractBinaryFields(target, spec, data) {
  var offset = 0;

  for (var x = 0; x < spec.length; x++) {
    var item = spec[x];
    if (item.label) {
      if (item.type === 'string') {
        var bytes = new DataView(data.buffer, offset, item.size);
        var str = textDecoder.decode(bytes);
        target[item.label] = str.replace(/\0/g, '');
      } else {
        target[item.label] = data['get' + item.type + (item.size * 8)](offset);
      }
    }
    offset += item.size;
  }

  return offset;
}

/**
 * Parse a binary WebSocket message.
 *
 * Binary messages have a 20-byte header (binaryHeaderLength), followed by a
 * body. Depending on the flags set in the header, the body of the message may
 * be compressed, so it needs to be decompressed before being parsed.
 *
 * Finally, depending on the message type and the 'json' flag, the body of the
 * message may be a JSON string, or a binary format. As of now, only data batch
 * messages encode their body in binary, as per the binaryDataMessageFormats
 * defined above.
 */
function parseBinaryMessage(data, knownComputations) {
  var msg = {};

  var header = new DataView(data, 0, binaryHeaderLength);
  var version = header.getUint8(0);
  extractBinaryFields(msg, binaryHeaderFormats[version], header);

  var type = binaryMessageTypes[msg.type];
  if (type === undefined) {
    console.warn('Unknown binary message type ' + msg.type);
    return null;
  }
  msg.type = type;

  var bigNumberRequested = false;
  if (typeof knownComputations[msg.channel] !== 'undefined' && knownComputations[msg.channel].params) {
    bigNumberRequested = knownComputations[msg.channel].params.bigNumber;
  }

  var compressed = msg.flags & (1 << 0);
  var json = msg.flags & (1 << 1);

  if (compressed) {
    // Decompress the message body if necessary.
    data = new DataView(pako.ungzip(new Uint8Array(data, binaryHeaderLength)).buffer);
  } else {
    data = new DataView(data, binaryHeaderLength);
  }

  if (json) {
    var decoded = textDecoder.decode(data);
    return JSON.parse(decoded);
  }

  switch (msg['type']) {
    case 'data':
      return parseBinaryDataMessage(msg, data, bigNumberRequested);
    default:
      console.warn('Unsupported binary "' + msg['type'] + '" message');
      return null;
  }
}

/**
 * Parse a binary data message body.
 *
 * Parse the binary-encoded information and datapoints of a data batch message.
 */
function parseBinaryDataMessage(msg, data, bigNumberRequested) {
  var offset = extractBinaryFields(msg, binaryDataMessageFormats[msg['version']], data);

  msg.logicalTimestampMs = (msg.timestampMs1 * hiMult) + msg.timestampMs2;
  delete msg.timestampMs1;
  delete msg.timestampMs2;

  if (typeof msg.maxDelayMs1 !== 'undefined' && typeof msg.maxDelayMs2 !== 'undefined') {
    msg.maxDelayMs = (msg.maxDelayMs1 * hiMult) + msg.maxDelayMs2;
    delete msg.maxDelayMs1;
    delete msg.maxDelayMs2;
  }

  var values = [];
  msg.data = values;

  for (var dataPointCount = 0; dataPointCount < msg.count; dataPointCount++) {
    var type = data.getUint8(offset);
    offset++;

    var tsidBytes = [];
    for (var tsidByteIndex = 0; tsidByteIndex < 8; tsidByteIndex++) {
      tsidBytes.push(data.getUint8(offset));
      offset++;
    }
    var tsId = getSnowflakeIdFromUint8Array(tsidBytes);

    var val = null;
    if (type === 0) {
      // NULL_TYPE, nothing to do
    } else if (type === 1) {
      // LONG_TYPE

      // get MSB for twos complement to determine sign
      var isNegative = data.getUint32(offset) >>> 31 > 0;
      if (isNegative) {
        // twos complement manual handling, because we cannot do Int64.
        // must do >>> 0 to prevent bit flips from turning into signed integers.
        val = (new BigNumber(hiMult)
               .times(~data.getUint32(offset) >>> 0)
               .plus(~data.getUint32(offset + 4) >>> 0)
               .plus(1)
               .times(-1));
      } else {
        val = (new BigNumber(data.getUint32(offset))
               .times(hiMult)
               .plus(data.getUint32(offset + 4)));
      }

      if (!bigNumberRequested) {
        val = val.toNumber();
      }
    } else if (type === 2) {
      // DOUBLE_TYPE
      val = data.getFloat64(offset);
      if (bigNumberRequested) {
        val = new BigNumber(val);
      }
    } else if (type === 3) {
      // INT_TYPE
      val = data.getUint32(offset + 4);
      if (bigNumberRequested) {
        val = new BigNumber(val);
      }
    }

    offset += 8;
    values.push({tsId: tsId, value: val});
  }

  delete msg.count;
  return msg;
}


module.exports = {
  getSnowflakeIdFromUint8Array: getSnowflakeIdFromUint8Array,

  /**
   * Parse the given received WebSocket message into its canonical Javascript representation.
   */
  parseWebSocketMessage: function (msg, knownComputations) {
    if (msg.data && msg.data.byteLength) {
      // The presence of byteLength indicates data is an ArrayBuffer from a WebSocket data frame.
      return parseBinaryMessage(msg.data, knownComputations);
    } else if (msg.type) {
      // Otherwise it's JSON in a WebSocket text frame.
      return JSON.parse(msg.data);
    } else {
      console.warn('Unrecognized websocket message.');
      return null;
    }
  }
};
