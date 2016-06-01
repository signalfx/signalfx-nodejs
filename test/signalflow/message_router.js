'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var rmh = require('../../lib/client/signalflow/message_router.js');
var BigNumber = require('bignumber.js');
var should = require('chai').should();
BigNumber.config({ ERRORS: false });

function getJobMessages() {
  // the job message handler directly modifies messages when packaging batches, so data needs to be
  // reset before each test.
  return [
    {
      channel: 'R0',
      event: 'STREAM_START',
      timestampMs: 1462845657589,
      type: 'control-message'
    },
    {
      channel: 'R0',
      event: 'JOB_START',
      timestampMs: 1462845657917,
      handle: 'CiDsZWZAIAw',
      type: 'control-message'
    },
    {
      channel: 'R0',
      tsId: 'AAAAAOQElGM',
      properties: {
        jobId: 'CiDsZWZAIAw',
        sf_organizationID: 'BqDQY5OAAAA',
        sf_key: ['jobId', 'sf_originatingMetric', 'sf_metric'],
        sf_streamLabel: 'mean',
        sf_metric: '__SF_COMP_CiDsZWZAIAw_02-PUBLISH_metric',
        sf_resolutionMs: 1000,
        sf_type: 'MetricTimeSeries',
        sf_originatingMetric: 'jvm.cpu.load',
        sf_isPreQuantized: true
      },
      type: 'metadata'
    },
    {
      type: 'data',
      channel: 'R0',
      version: 1,
      messageType: 5,
      logicalTimestampMs: 1462845656000,
      data: [{tsId: 'AAAAAOQElGM', value: new BigNumber(22.06513496503497)}]
    },
    {
      channel: 'R0',
      tsId: 'AAAAAJ5grV4',
      properties: {
        jobId: 'CiDsZWZAIAw',
        sf_organizationID: 'BqDQY5OAAAA',
        sf_key: ['jobId', 'sf_originatingMetric', 'sf_metric'],
        sf_streamLabel: 'max',
        sf_metric: '__SF_COMP_CiDsZWZAIAw_05-PUBLISH_metric',
        sf_resolutionMs: 1000,
        sf_type: 'MetricTimeSeries',
        sf_originatingMetric: 'jvm.cpu.load',
        sf_isPreQuantized: true
      },
      type: 'metadata'
    },
    {
      type: 'data',
      channel: 'R0',
      version: 1,
      messageType: 5,
      logicalTimestampMs: 1462845656000,
      data: [{tsId: 'AAAAAJ5grV4', value: new BigNumber(82.06513496503497)}]
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 0,
        timestampMs: 1462845656000,
        messageCode: 'JOB_RUNNING_RESOLUTION',
        messageLevel: 'INFO',
        numInputTimeSeries: 0,
        contents: {
          resolutionMs: 1000
        }
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 0,
        timestampMs: 1462845656000,
        messageCode: 'JOB_DETECTED_LAG',
        messageLevel: 'INFO',
        numInputTimeSeries: 0,
        tsIds: ['CS15peGAIAM'],
        contents: {
          lagMs: 10000
        }
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 3,
        timestampMs: 1462845657000,
        messageCode: 'FIND_MATCHED_DIMENSIONS',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        pipeline: '___ANONYMOUS_PIPELINE___1',
        pipelineOffset: 0,
        contents: {
         dimensionCounts: [{
            dimensions: ['sf_source', 'sf_metric'],
            count: 37
          }]
        }
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 0,
        timestampMs: 1462845657000,
        messageCode: 'FIND_MATCHED_DIMENSIONS',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        pipeline: '___ANONYMOUS_PIPELINE___0',
        pipelineOffset: 0,
        contents: {
          dimensionCounts: [{
            dimensions: ['sf_source', 'sf_metric'],
            count: 37
          }]
        }
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 0,
        timestampMs: 1462845657000,
        messageCode: 'FETCH_NUM_TIMESERIES',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        tsIds: ['CfPGJpyAEAE', 'CeVwGhQAAAM', 'CeVuWIaAAAA', 'CeVwGiHAIAI', 'CPci7M7AAAg', 'CNLkzcqAIAE', 'CL1cqWlAEAE', 'Bq1GFVpAEAA', 'Cc-Ge_sAIAk', 'CclCSG9AEAQ', 'CMtjFDTAEAQ', 'CMQVzohAIAA', 'Cc-HzRxAAAQ', 'CS15peGAIAM', 'B894hKaAAAA', 'CPciyPqAIAA', 'CLwZ0aMAEAE', 'CLwtlHAAAAU', 'CMucoHfAAAE', 'CPcixksAEAI', 'CPciw_dAEAA', 'CLwfDwIAAAI', 'CfPNE1hAAAI', 'CLwVwmMAAAA', 'CPciyuoAAAA', 'CfPHhSSAAAg', 'CL02u3rAAAA', 'CSRkhCAAEAE', 'CZlUE8TAAAA', 'CMQVrxsAIAA', 'CMtiJKkAIAA', 'CDD2PV-AIAA', 'CL02uReAEAE', 'CL1cM4zAAAA', 'CMQT6sQAAAA', 'CSRdyJ-AIAQ', 'CgD5ME5AEAA'],
        pipeline: '___ANONYMOUS_PIPELINE___0',
        pipelineOffset: 0
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 0,
        timestampMs: 1462845657000,
        messageCode: 'ID_NUM_TIMESERIES',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        pipeline: '___ANONYMOUS_PIPELINE___0',
        pipelineOffset: 0
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 3,
        timestampMs: 1462845657000,
        messageCode: 'FETCH_NUM_TIMESERIES',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        tsIds: ['CfPGJpyAEAE', 'CeVwGhQAAAM', 'CeVuWIaAAAA', 'CeVwGiHAIAI', 'CPci7M7AAAg', 'CNLkzcqAIAE', 'CL1cqWlAEAE', 'Bq1GFVpAEAA', 'Cc-Ge_sAIAk', 'CclCSG9AEAQ', 'CMtjFDTAEAQ', 'CMQVzohAIAA', 'Cc-HzRxAAAQ', 'CS15peGAIAM', 'B894hKaAAAA', 'CPciyPqAIAA', 'CLwZ0aMAEAE', 'CLwtlHAAAAU', 'CMucoHfAAAE', 'CPcixksAEAI', 'CPciw_dAEAA', 'CLwfDwIAAAI', 'CfPNE1hAAAI', 'CLwVwmMAAAA', 'CPciyuoAAAA', 'CfPHhSSAAAg', 'CL02u3rAAAA', 'CSRkhCAAEAE', 'CZlUE8TAAAA', 'CMQVrxsAIAA', 'CMtiJKkAIAA', 'CDD2PV-AIAA', 'CL02uReAEAE', 'CL1cM4zAAAA', 'CMQT6sQAAAA', 'CSRdyJ-AIAQ', 'CgD5ME5AEAA'],
        pipeline: '___ANONYMOUS_PIPELINE___1',
        pipelineOffset: 0
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      channel: 'R0',
      message: {
        blockSerialNumber: 3,
        timestampMs: 1462845657000,
        messageCode: 'ID_NUM_TIMESERIES',
        messageLevel: 'INFO',
        numInputTimeSeries: 37,
        pipeline: '___ANONYMOUS_PIPELINE___1',
        pipelineOffset: 0
      },
      logicalTimestampMs: 1462845657000,
      type: 'message'
    },
    {
      type: 'data',
      channel: 'R0',
      version: 1,
      messageType: 5,
      logicalTimestampMs: 1462845657000,
      data: [{tsId: 'AAAAAOQElGM', value: new BigNumber(22.06513496503497)}]
    },
    {
      type: 'data',
      channel: 'R0',
      version: 1,
      messageType: 5,
      logicalTimestampMs: 1462845657000,
      data: [{tsId: 'AAAAAJ5grV4', value: new BigNumber(82.06513496503497)}]
    }
  ];
}

var jobMessages = getJobMessages();

describe('routed message handler properly determines job state', function () {

  var numMetaDataMessages = 0;
  var knownEmitters = {};
  function onMessage(msg) {
    switch (msg.type) {
      case 'data':
        it('should never send data before metadata', function () {
          msg.data.forEach(function (dataObj) {
            (typeof knownEmitters[dataObj.tsId]).should.not.be.equal('undefined');
          });
        });

        it('should properly batch data messages into the correct size', function () {
          msg.data.length.should.be.equal(2);
        });

        it('should return regular js numbers', function () {
          (typeof msg.data[0].value).should.be.equal('number');
        });
      break;
      case 'metadata':
          knownEmitters[msg.tsId] = msg;
          numMetaDataMessages++;
        break;
      case 'event':
        break;
      default:
        break;
    }
  }
  var params = {
    program: 'data(\'jvm.cpu.load\').mean().stream(label=\'mean\')\ndata(\'jvm.cpu.load\').max().stream(label=\'max\')'
  };

  var inst = rmh(params, onMessage);
  jobMessages.forEach(inst);

  it('should return every metadata message sent', function () {
    numMetaDataMessages.should.be.equal(2);
  });
});

jobMessages = getJobMessages();
describe('routed message handler properly returns big numbers', function () {
  var numMetaDataMessages = 0;
  var knownEmitters = {};
  function onMessage(msg) {
    switch (msg.type) {
      case 'data':
        it('should return bignumbers', function () {
          (typeof msg.data[0].value).should.be.equal('object');
        });
        break;
      case 'metadata':
        knownEmitters[msg.tsId] = msg;
        numMetaDataMessages++;
        break;
      case 'event':
        break;
      default:
        break;
    }
  }
  var params = {
    program: 'data(\'jvm.cpu.load\').mean().stream(label=\'mean\')\ndata(\'jvm.cpu.load\').max().stream(label=\'max\')',
    bigNumber: true
  };
  var inst = rmh(params, onMessage);
  jobMessages.forEach(inst);
});


