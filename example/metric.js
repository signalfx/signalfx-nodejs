'use strict';

var assert = require('assert').strict;
var signalfx = require('../');

var token = process.env['SPLUNK_ACCESS_TOKEN'];
var realm = process.env['SPLUNK_REALM'] || 'us0';

// generate a plausibly unique dimension
var runId = Math.round(Math.random() * 1000000).toString();

var ingestClient = new signalfx.Ingest(token, {
  ingestEndpoint: 'https://ingest.' + realm + '.signalfx.com'
});

var values = [
  1e18, // max is Int64
  1e15,
  1e10,
  1e5,
  100,
  1,
  0.9,
  0.8,
  0.7,
  0.01,
  0.001,
  0.0001
];

function send(index) {
  index = index || 0;
  if (index >= values.length) {
    return;
  }

  ingestClient.send({
    gauges: [
      {
        metric: 'test.value',
        value: values[index],
        timestamp: Date.now(),
        dimensions: {
          'run.id': runId
        }
      }
    ]
  });
  console.log('value sent: ' + values[index]);

  setTimeout(function () {
    send(index + 1);
  }, 1000);
}
send();

var sfxClient = new signalfx.SignalFlow(token, {
  signalflowEndpoint: 'wss://stream.' + realm + '.signalfx.com',
  apiEndpoint: 'https://api.' + realm + '.signalfx.com'
});

function receive() {
  var program = 'A = data("test.value", rollup="latest", filter=filter("run.id", "' + runId + '")).publish("A")';
  console.log('signalflow: ', program);

  var handle = sfxClient.execute({
    program: program,
    start: Date.now(),
    stop: Date.now() + (values.length + 1) * 1000,
    resolution: 1000,
    maxDelay: 1000
  });

  var ourTsId;
  handle.stream(function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    if (data.type === 'metadata') {
      if (data.properties.sf_originatingMetric !== 'test.value') {
        return;
      }

      ourTsId = data.tsId;
      return;
    }

    if (data.type === 'data') {
      data.data.forEach(function (dataPoint) {
        if (dataPoint.tsId !== ourTsId) {
          return;
        }

        console.log('value received: ' + dataPoint.value);
      });
    }
  });
}
receive();
