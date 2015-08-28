'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var sinon = require('sinon');
var mockery = require('mockery');
var should = require('chai').should();

var signalFx;

describe('Integration test (Protobuf mode)', function () {

  var requestStub;
  var client;
  var token = 'my token';

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    requestStub = sinon.stub();

    // replace the module `request` with a stub object
    mockery.registerMock('request', requestStub);

    signalFx = require('../lib/signalfx');
    client = new signalFx.SignalFx(token);
  });

  after(function () {
    mockery.disable();
  });


  var counter = 0;
  it('should sent ', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    this.timeout(1200);
    setTimeout(done, 1000);

    var gauges = [{
      metric: 'test.cpu',
      value: counter % 10
    }];

    var counters = [{
      metric: 'cpu_cnt',
      value: counter % 2
    }];

    client.send({gauges: gauges, counters: counters});

    if (counter % 100 === 0) { // Factoring for reduced activity for events
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }

      today = yyyy + '-' + mm + '-' + dd;
      var version = '' + today + '-' + counter;
      var dimensions = {
        host: 'myhost',
        service: 'myservice',
        instance: 'myinstance'
      };
      var properties = {version: version};
      client.sendEvent('deployments', dimensions, properties);
    }
    counter += 1;
  });
});


describe('SignalFx client library (Protobuf mode)', function () {

  var requestStub;

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    requestStub = sinon.stub();

    // replace the module `request` with a stub object
    mockery.registerMock('request', requestStub);

    signalFx = require('../lib/signalfx');
  });

  after(function () {
    mockery.disable();
  });

  it('should be created', function () {
    var token = 'my token';
    var client = new signalFx.SignalFx(token);
    client.should.not.be.empty;
    client.apiToken.should.be.equal(token);

    var isInstancedOfSignalFx = (client instanceof signalFx.SignalFx);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with all parameters', function () {
    var token = 'my token';
    var ingestEndpoint = 'ingestEndpoint';
    var apiEndpoint = 'apiEndpoint';
    var timeout = 3000;
    var batchSize = 301;
    var userAgents = 'TestCl';

    var client = new signalFx.SignalFx(token, ingestEndpoint,
      apiEndpoint, timeout,
      batchSize, userAgents);

    client.should.not.be.empty;

    client.apiToken.should.be.equal(token);
    client.ingestEndpoint.should.be.equal(ingestEndpoint);
    client.apiEndpoint.should.be.equal(apiEndpoint);
    client.batchSize.should.be.equal(batchSize);
    client.timeout.should.be.equal(timeout);
    client.userAgents.should.be.equal(userAgents);

    var isInstancedOfSignalFx = (client instanceof signalFx.SignalFx);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('add datapoint to queue', function () {
    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2
    });

    client.queue.length.should.be.equal(1);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10
    });

    client.queue.length.should.be.equal(2);
  });

  it('Send datapoint via queue', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({ gauges: gauges });
    client.queue.length.should.be.equal(1);

    this.timeout(1020);
    setTimeout(function () {
      client.queue.length.should.be.equal(0);
      client.asyncRunning.should.be.equal(false);
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });


  it('Send event via queue', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    var version = 'version';
    var dimensions = {
      host: 'myhost',
      service: 'myservice',
      instance: 'myinstance'
    };
    var properties = {version: version};
    client.sendEvent('deployments', dimensions, properties);

    this.timeout(1020);
    setTimeout(function () {
      client.asyncRunning.should.be.equal(false);
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });

  it('Send datapoint with wrong token', function (done) {
    requestStub.yields(null, {statusCode: 401}, 'Unauthorized');

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({ gauges: gauges });
    client.queue.length.should.be.equal(1);

    this.timeout(1020);
    setTimeout(function () {
      client.queue.length.should.be.equal(0);
      client.asyncRunning.should.be.equal(false);
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });


  it('Send datapoint with wrong data', function (done) {
    requestStub.yields(null, {statusCode: 400}, '');

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({ gauges: gauges });
    client.queue.length.should.be.equal(1);

    this.timeout(1020);
    setTimeout(function () {
      client.queue.length.should.be.equal(0);
      client.asyncRunning.should.be.equal(false);
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });


  it('Batch data (Protobuf)', function () {

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2
    });

    client.queue.length.should.be.equal(1);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10
    });

    client.queue.length.should.be.equal(2);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10.3
    });

    client.queue.length.should.be.equal(3);

    var expectedGauge = {
        source: null, metric: 'test.cpu', timestamp: null, value: {intValue: 2}, metricType: 0, dimensions: []
    };
    var expectedCounter = {
        source: null, metric: 'cpu_cnt', timestamp: null, value: {intValue: 10}, metricType: 1, dimensions: []
    };
    var expectedCounter2 = {
        source: null, metric: 'cpu_cnt', timestamp: null, value: {doubleValue: 10.3}, metricType: 1, dimensions: []
      };

    var realGauge = client.queue[0];
    realGauge.metric.should.be.equal(expectedGauge.metric);
    realGauge.value.intValue.should.be.equal(expectedGauge.value.intValue);
    realGauge.metricType.should.be.equal(expectedGauge.metricType);
    realGauge.dimensions.length.should.be.equal(expectedGauge.dimensions.length);

    var realCounter = client.queue[1];
    realCounter.metric.should.be.equal(expectedCounter.metric);
    realCounter.value.intValue.should.be.equal(expectedCounter.value.intValue);
    realCounter.metricType.should.be.equal(expectedCounter.metricType);
    realCounter.dimensions.length.should.be.equal(expectedCounter.dimensions.length);

    var realCounter2 = client.queue[2];
    realCounter2.metric.should.be.equal(expectedCounter2.metric);
    realCounter2.value.doubleValue.should.be.equal(expectedCounter2.value.doubleValue);
    realCounter2.metricType.should.be.equal(expectedCounter2.metricType);
    realCounter2.dimensions.length.should.be.equal(expectedCounter2.dimensions.length);

    var dataToSend = client._batchData(client.queue);
    dataToSend.should.not.be.empty;
  });


  it('Dimensions (Protobuf)', function () {

    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    });

    client.queue.length.should.be.equal(1);

    var expectedGauge = {
      source: null,
      metric: 'test.cpu',
      timestamp: null,
      value: {intValue: 2},
      metricType: 0,
      dimensions: [{key: 'host', value: 'server1'}, {key: 'host_ip', value: '1.2.3.4'}]
    };

    var realGauge = client.queue[0];
    realGauge.metric.should.be.equal(expectedGauge.metric);
    realGauge.value.intValue.should.be.equal(expectedGauge.value.intValue);
    realGauge.metricType.should.be.equal(expectedGauge.metricType);
    realGauge.dimensions.length.should.be.equal(expectedGauge.dimensions.length);
    realGauge.dimensions[0].key.should.not.be.empty;
    realGauge.dimensions[0].key.should.be.equal(expectedGauge.dimensions[0].key);
    realGauge.dimensions[0].value.should.not.be.empty;
    realGauge.dimensions[0].value.should.be.equal(expectedGauge.dimensions[0].value);

    var dataToSend = client._batchData(client.queue);
    dataToSend.should.not.be.empty;
  });

  it('should have Protobuf content type', function () {
    var token = 'my token';
    var client = new signalFx.SignalFx(token);

    client.getHeaderContentType().should.be.equal('application/x-protobuf');
  });
});


describe('SignalFx client library (Json mode)', function () {

  var requestStub;

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    requestStub = sinon.stub();

    // replace the module `request` with a stub object
    mockery.registerMock('request', requestStub);

    signalFx = require('../lib/signalfx');
  });

  after(function () {
    mockery.disable();
  });

  it('should be created', function () {
    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);
    client.should.not.be.empty;
    client.apiToken.should.be.equal(token);

    var isInstancedOfSignalFx = (client instanceof signalFx.SignalFxJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with all parameters', function () {
    var token = 'my token';
    var ingestEndpoint = 'ingestEndpoint';
    var apiEndpoint = 'apiEndpoint';
    var timeout = 3000;
    var batchSize = 301;
    var userAgents = 'TestCl';

    var client = new signalFx.SignalFxJson(token, ingestEndpoint,
      apiEndpoint, timeout,
      batchSize, userAgents);

    client.should.not.be.empty;

    client.apiToken.should.be.equal(token);
    client.ingestEndpoint.should.be.equal(ingestEndpoint);
    client.apiEndpoint.should.be.equal(apiEndpoint);
    client.batchSize.should.be.equal(batchSize);
    client.timeout.should.be.equal(timeout);
    client.userAgents.should.be.equal(userAgents);

    var isInstancedOfSignalFx = (client instanceof signalFx.SignalFxJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('add datapoint to queue', function () {
    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2
    });

    client.queue.length.should.be.equal(1);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10
    });

    client.queue.length.should.be.equal(2);
  });

  it('Send datapoint via queue', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({ gauges: gauges });
    client.queue.length.should.be.equal(1);

    this.timeout(1020);
    setTimeout(function () {
      client.queue.length.should.be.equal(0);
      client.asyncRunning.should.be.equal(false);
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });

  it('Batch data (Json)', function () {

    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2
    });

    client.queue.length.should.be.equal(1);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10
    });

    client.queue.length.should.be.equal(2);

    client._addToQueue('counter', {
      metric: 'cpu_cnt',
      value: 10.3
    });

    client.queue.length.should.be.equal(3);

    var expectedGauge = {
      gauge: [{metric: 'test.cpu', value: 2}],
      counter: [{metric: 'cpu_cnt', value: 10}, {metric: 'cpu_cnt', value: 10.3}]
    };

    var dataToSend = client._batchData(client.queue);
    dataToSend.should.be.equal(JSON.stringify(expectedGauge));
  });


  it('should have dimensions (Json)', function () {

    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);

    client._addToQueue('gauge', {
      metric: 'test.cpu',
      value: 2,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    });

    client.queue.length.should.be.equal(1);

    var expectedGauge = {gauge: [{metric: 'test.cpu', value: 2, dimensions: {host: 'server1', host_ip: '1.2.3.4'}}]};

    var dataToSend = client._batchData(client.queue);
    dataToSend.should.be.equal(JSON.stringify(expectedGauge));
  });


  it('should have Json content type', function () {
    var token = 'my token';
    var client = new signalFx.SignalFxJson(token);

    client.getHeaderContentType().should.be.equal('application/json');
  });
});
