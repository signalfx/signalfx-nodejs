'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var wsmh = require('../../lib/client/signalflow/websocket_message_parser.js');
var expect = require('chai').expect;

describe('should properly convert a typed array converted from typed array to a snowflake ID', function () {
  it('should convert nonspecial ids correctly', function () {
    var originalNums = [0, 0, 0, 0, 228, 4, 148, 99];
    var snowFlakeIdArrayBuffer = new ArrayBuffer(8);
    var snowFlakeTypedArray = new Uint8Array(snowFlakeIdArrayBuffer);
    originalNums.forEach(function (val, idx) {
      snowFlakeTypedArray[idx] = val;
    });
    expect(wsmh.getSnowflakeIdFromUint8Array(snowFlakeTypedArray)).to.equal('AAAAAOQElGM');
  });

  it('should convert special replacement ids correctly', function () {
    var originalNums = [0, 0, 0, 0, 228, 4, 248, 99];
    var snowFlakeIdArrayBuffer = new ArrayBuffer(8);
    var snowFlakeTypedArray = new Uint8Array(snowFlakeIdArrayBuffer);
    originalNums.forEach(function (val, idx) {
      snowFlakeTypedArray[idx] = val;
    });
    expect(wsmh.getSnowflakeIdFromUint8Array(snowFlakeTypedArray)).to.equal('AAAAAOQE-GM');
  });

  it('should not return padding characters', function () {
    var originalNums = [0, 0, 0, 0, 228, 4, 248, 99];
    var snowFlakeIdArrayBuffer = new ArrayBuffer(8);
    var snowFlakeTypedArray = new Uint8Array(snowFlakeIdArrayBuffer);
    originalNums.forEach(function (val, idx) {
      snowFlakeTypedArray[idx] = val;
    });
    expect(wsmh.getSnowflakeIdFromUint8Array(snowFlakeTypedArray).indexOf('=')).to.equal(-1);
  });
});

describe('it should properly unpack binary float messages', function () {
  var originalMsg = [1, 5, 0, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 84, 155, 225, 145, 160, 0, 0, 0, 1, 2, 0, 0, 0, 0, 228, 4, 148, 99, 64, 35, 169, 164, 8, 60, 223, 182];
  var arrBuff = new ArrayBuffer(49);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({ data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack 1-byte version correctly', function () {
    expect(outputMsg.version).to.equal(1);
  });

  it('should unpack floats correctly and return a regular number when bigNumber is not set', function () {
    expect(outputMsg.data[0].value).to.equal(9.831329591208355);
  });

  it('should unpack the channel name correctly', function () {
    expect(outputMsg.channel).to.equal('R0');
  });

  it('should detect binary message types correctly', function () {
    expect(outputMsg.type).to.equal('data');
  });

  it('version 1 message should not have a max delay', function () {
    expect(typeof outputMsg.maxDelayMs === 'undefined').to.equal(true);
  });

  it('should return the correct timestamp', function () {
    expect(outputMsg.logicalTimestampMs === 1462904132000).to.equal(true);
  });
});

describe('it should properly unpack negative binary integer messages', function () {
  // this represents a 64 bit long response of -9620000000000001 which will be rounded off in javascript because javascript
  var negativeLong = [2, 0, 5, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 1, 84, 185, 237, 208, 120, 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 0, 1, 1, 0, 0, 0, 0, 220, 123, 36, 27, 255, 221, 210, 169, 53, 66, 191, 255];
  var arrBuff = new ArrayBuffer(negativeLong.length);
  var typedArr = new Uint8Array(arrBuff);
  negativeLong.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var bigNumberOutputMsg = wsmh.parseWebSocketMessage({ data: arrBuff}, {
    R0: {
      params: {
        bigNumber: true
      }
    }
  });

  it('should unpack the version from 2 bytes', function () {
    expect(bigNumberOutputMsg.version).to.equal(512);
  });

  it('should unpack the channel name correctly', function () {
    expect(bigNumberOutputMsg.channel).to.equal('R0');
  });

  it('should unpack the max delay correctly', function () {
    expect(bigNumberOutputMsg.maxDelayMs).to.equal(0);
  });

  it('should unpack negative integers correctly, not losing precision in big number mode', function () {
    expect(bigNumberOutputMsg.data[0].value.toString()).to.equal('-9620000000000001');
  });
});

describe('it should properly unpack positive binary integer messages', function () {
  // this represents a 64 bit long response of -9620000000000001 which will be rounded off in javascript because javascript
  var positiveLong = [2, 0, 5, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 1, 84, 186, 1, 162, 176, 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 0, 1, 1, 0, 0, 0, 0, 220, 123, 36, 27, 13, 89, 181, 231, 49, 237, 0, 1];
  var arrBuff = new ArrayBuffer(positiveLong.length);
  var typedArr = new Uint8Array(arrBuff);
  positiveLong.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var bigNumberOutputMsg = wsmh.parseWebSocketMessage({ data: arrBuff}, {
    R0: {
      params: {
        bigNumber: true
      }
    }
  });

  it('should unpack the version from 2 bytes', function () {
    expect(bigNumberOutputMsg.version).to.equal(512);
  });

  it('should unpack the channel name correctly', function () {
    expect(bigNumberOutputMsg.channel).to.equal('R0');
  });

  it('should unpack the max delay correctly', function () {
    expect(bigNumberOutputMsg.maxDelayMs).to.equal(0);
  });

  it('should unpack negative integers correctly, not losing precision in big number mode', function () {
    expect(bigNumberOutputMsg.data[0].value.toString()).to.equal('962000000000000001');
  });
});

describe('it should unpack the max delay value correctly', function () {
  var originalMsg = [2, 0, 5, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 1, 84, 186, 1, 162, 176, 0, 0, 0, 0, 0, 0, 1, 1,
                     0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0];
  var arrBuff = new ArrayBuffer(originalMsg.length);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack the version from 2 bytes', function () {
    expect(outputMsg.version).to.equal(512);
  });

  it('should unpack the channel name correctly', function () {
    expect(outputMsg.channel).to.equal('R0');
  });

  it('should unpack the max delay value correctly', function () {
    expect(outputMsg.maxDelayMs).to.equal(257);
  });

  it('should unpack the payload values correctly', function () {
    expect(outputMsg.data.length).to.equal(1);
  });
});

describe('it should properly unpack null datapoints', function () {
  var originalMsg = [2, 0, 5, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 1, 84, 186, 1, 162, 176, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0];
  var arrBuff = new ArrayBuffer(originalMsg.length);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack the version from 2 bytes', function () {
    expect(outputMsg.version).to.equal(512);
  });

  it('should unpack the channel name correctly', function () {
    expect(outputMsg.channel).to.equal('R0');
  });

  it('should unpack the null tsid correctly', function () {
    expect(outputMsg.data[0].tsId).to.equal('AAAAAAAAABs');
  });

  it('should unpack the null value correctly', function () {
    expect(outputMsg.data[0].value).to.equal(null);
  });
});

describe('it should properly unpack positive binary integer messages with small values (int type)', function () {
  var originalMsg = [2, 0, 5, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 1, 84, 186, 1, 162, 176, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 1, 3, 0, 0, 0, 0, 220, 123, 36, 27, 0, 0, 0, 0, 0, 0, 0, 42];
  var arrBuff = new ArrayBuffer(originalMsg.length);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack the version from 2 bytes', function () {
    expect(outputMsg.version).to.equal(512);
  });

  it('should unpack the channel name correctly', function () {
    expect(outputMsg.channel).to.equal('R0');
  });

  it('should unpack integers correctly', function () {
    expect(outputMsg.data[0].value.toString()).to.equal('42');
  });
});

describe('it should properly unpack binary compressed json messages', function () {
  var originalMsg = [1, 1, 3, 0, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     120, 156, 171, 86, 42, 169, 44, 72, 85, 82, 176, 82, 80, 74, 206, 207, 43, 41, 202, 207, 209, 205, 77, 45, 46, 78,
                     76, 79, 85, 210, 81, 80, 74, 45, 75, 205, 43, 81, 2, 202, 121, 249, 59, 197, 7, 135, 56, 6, 133, 128, 68, 51, 18,
                     243, 82, 114, 82, 65, 194, 142, 48, 224, 156, 175, 84, 11, 0, 128, 222, 22, 125];
  var arrBuff = new ArrayBuffer(originalMsg.length);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack the 1-byte version correctly', function () {
    expect(outputMsg.version).to.equal(1);
  });

  it('should unpack the 1-byte message type correctly', function () {
    expect(outputMsg.type).to.equal('control-message');
  });

  it('should unpack the 1-byte flags correctly', function () {
    expect(outputMsg.flags).to.equal(3);
  });

  it('should unpack the channel name correctly', function () {
    expect(outputMsg.channel).to.equal('R0');
  });

  it('should unpack the json message body correctly', function () {
    expect(outputMsg.event).to.equal('JOB_START');
    expect(outputMsg.handle).to.equal('AAAAAAAAACo');
  });
});

describe('it should properly unpack binary compressed data messages', function () {
  var originalMsg = [2, 0, 5, 1, 82, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     120, 156, 99, 96, 0, 1, 150, 75, 96, 138, 65, 32, 3, 72, 48, 49,
                     67, 56, 12, 92, 80, 90, 139, 9, 202, 224, 118, 224, 148, 219, 17,
                     248, 186, 85, 30, 0, 74, 190, 4, 148];
  var arrBuff = new ArrayBuffer(originalMsg.length);
  var typedArr = new Uint8Array(arrBuff);
  originalMsg.forEach(function (val, idx) {
    typedArr[idx] = val;
  });

  var outputMsg = wsmh.parseWebSocketMessage({data: arrBuff}, {
    R0: {
      params: {
      }
    }
  });

  it('should unpack the 2-byte version correctly', function () {
    expect(outputMsg.version).to.equal(512);
  });

  it('should unpack the 1-byte message type correctly', function () {
    expect(outputMsg.type).to.equal('data');
  });

  it('should unpack the 1-byte flags correctly', function () {
    expect(outputMsg.flags).to.equal(1);
  });

  it('should unpack the correct data batch timestamp', function () {
    expect(outputMsg.logicalTimestampMs).to.equal(1234);
  });

  it('should unpack the correct data batch max delay', function () {
    expect(outputMsg.maxDelayMs).to.equal(4200);
  });

  it('should detect the correct number of datapoints in binary data batch', function () {
    expect(outputMsg.data.length).to.equal(2);
  });

  it('should decode the first datapoint correctly from the binary data batch', function () {
    expect(outputMsg.data[0].tsId).to.equal('AAAAAAAAAAo');
    expect(outputMsg.data[0].value).to.equal(42);
  });

  it('should decode the second datapoint correctly from the binary data batch', function () {
    expect(outputMsg.data[1].tsId).to.equal('AAAAAAAAAAs');
    expect(outputMsg.data[1].value).to.equal(3.14);
  });
});
