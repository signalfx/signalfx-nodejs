'use strict';
// Copyright (C) 2015 SignalFx, Inc. All rights reserved.

var sinon = require('sinon');
var mockery = require('mockery');
require('request');
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

    signalFx = require('../../lib/signalfx');
    client = new signalFx.Ingest(token);
  });

  after(function () {
    mockery.disable();
    mockery.deregisterAll();
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
      client.sendEvent({category: 'EXCEPTION',
        eventType: 'deployments',
        dimensions: dimensions,
        properties: properties});
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

    signalFx = require('../../lib/signalfx');
  });

  after(function () {
    mockery.disable();
    mockery.deregisterAll();
  });

  it('should be created', function () {
    var token = 'my token';
    var client = new signalFx.Ingest(token);
    client.should.not.be.empty;
    client.apiToken.should.be.equal(token);

    var isInstancedOfSignalFx = (client instanceof signalFx.Ingest);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with all parameters', function () {
    var token = 'my token';
    var ingestEndpoint = 'ingestEndpoint';
    var timeout = 3000;
    var batchSize = 301;
    var userAgents = 'TestCl';

    var client = new signalFx.Ingest(token, {
      ingestEndpoint: ingestEndpoint,
      timeout: timeout,
      batchSize: batchSize, userAgents: userAgents
    });

    client.should.not.be.empty;

    client.apiToken.should.be.equal(token);
    client.ingestEndpoint.should.be.equal(ingestEndpoint);
    client.batchSize.should.be.equal(batchSize);
    client.timeout.should.be.equal(timeout);
    client.userAgents.should.be.equal(userAgents);

    var isInstancedOfSignalFx = (client instanceof signalFx.Ingest);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with AWS Unique ID', function () {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var enableAmazonUniqueId = true;

    var client = new signalFx.IngestJson(token, {
      enableAmazonUniqueId: enableAmazonUniqueId
    });

    client.apiToken.should.be.equal(token);
    client.AWSUniqueId.should.be.equal('instance_region_account');
    client.enableAmazonUniqueId.should.be.equal(true);
    should.exist(client.globalDimensions[client.AWSUniqueId_DIMENTION_NAME]);
    client.globalDimensions[client.AWSUniqueId_DIMENTION_NAME].should.be.equal('instance_region_account');

    var isInstancedOfSignalFx = (client instanceof signalFx.IngestJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be not created with AWS Unique ID(wrong responce)', function () {
    requestStub.yields(null, {statusCode: 28}, '');

    var token = 'my token';
    var enableAmazonUniqueId = true;

    var client = new signalFx.IngestJson(token, {
      enableAmazonUniqueId: enableAmazonUniqueId
    });

    client.apiToken.should.be.equal(token);
    client.enableAmazonUniqueId.should.be.equal(false);
    client.AWSUniqueId.should.be.equal('');
    should.not.exist(client.globalDimensions[client.AWSUniqueId_DIMENTION_NAME]);

    var isInstancedOfSignalFx = (client instanceof signalFx.IngestJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('add datapoint to queue', function () {
    var token = 'my token';
    var client = new signalFx.Ingest(token);

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
    var client = new signalFx.Ingest(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({gauges: gauges});

    this.timeout(2020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 2000);

  });


  it('Send event', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var eventCategory = 'EXCEPTION';
    var version = 'version';
    var dimensions = {
      host: 'myhost',
      service: 'myservice',
      instance: 'myinstance'
    };
    var properties = {version: version};
    client.sendEvent({category: eventCategory,
      eventType: 'deployments',
      dimensions: dimensions,
      properties: properties});

    this.timeout(1020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });

  it('Send datapoint with wrong token', function (done) {
    requestStub.yields(null, {statusCode: 401}, 'Unauthorized');

    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({gauges: gauges});


    this.timeout(1020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });


  it('Send datapoint with wrong data', function (done) {
    requestStub.yields(null, {statusCode: 400}, '');

    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({gauges: gauges});

    this.timeout(1020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });


  it('Batch data (Protobuf)', function () {

    var token = 'my token';
    var client = new signalFx.Ingest(token);

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
    var client = new signalFx.Ingest(token);

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

  it('should have dimensions + predefined dimensions (Protobuf)', function () {

    var token = 'my token';
    var client = new signalFx.Ingest(token, {dimensions: {dep1: 'dep1', dep2: 'dep2'}});

    var gauges = [{
      metric: 'test.cpu',
      value: 10,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    }];
    client.rawData.push({gauges: gauges});
    requestStub.yields(null, {statusCode: 200}, 'OK');

    client.processingData();
    client.queue.length.should.be.equal(1);

    var expectedGauge = {
      source: null,
      metric: 'test.cpu',
      timestamp: null,
      value: {intValue: 10},
      metricType: 0,
      dimensions: [{key: 'host', value: 'server1'}, {key: 'host_ip', value: '1.2.3.4'}, {
        key: 'dep1',
        value: 'dep1'
      }, {key: 'dep2', value: 'dep2'}]
    };

    var queue = client.queue;
    var realGauge = queue[0];
    realGauge.metric.should.be.equal(expectedGauge.metric);
    realGauge.value.intValue.should.be.equal(expectedGauge.value.intValue);
    realGauge.metricType.should.be.equal(expectedGauge.metricType);
    realGauge.dimensions.length.should.be.equal(expectedGauge.dimensions.length);
    realGauge.dimensions[0].key.should.not.be.empty;
    realGauge.dimensions[0].key.should.be.equal(expectedGauge.dimensions[0].key);
    realGauge.dimensions[0].value.should.not.be.empty;
    realGauge.dimensions[0].value.should.be.equal(expectedGauge.dimensions[0].value);

    realGauge.dimensions[2].key.should.not.be.empty;
    realGauge.dimensions[2].key.should.be.equal('dep1');
    realGauge.dimensions[2].value.should.not.be.empty;
    realGauge.dimensions[2].value.should.be.equal('dep1');


    realGauge.dimensions[3].key.should.not.be.empty;
    realGauge.dimensions[3].key.should.be.equal('dep2');
    realGauge.dimensions[3].value.should.not.be.empty;
    realGauge.dimensions[3].value.should.be.equal('dep2');
  });

  it('should have only predefined dimensions (Protobuf)', function () {

    var token = 'my token';
    var client = new signalFx.Ingest(token, {dimensions: {dep1: 'dep1', dep2: 'dep2'}});

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.rawData.push({gauges: gauges});

    requestStub.yields(null, {statusCode: 200}, 'OK');
    client.processingData();
    client.queue.length.should.be.equal(1);

    var expectedGauge = {
      source: null,
      metric: 'test.cpu',
      timestamp: null,
      value: {intValue: 10},
      metricType: 0,
      dimensions: [{
        key: 'dep1',
        value: 'dep1'
      }, {key: 'dep2', value: 'dep2'}]
    };

    var queue = client.queue;
    var realGauge = queue[0];
    realGauge.metric.should.be.equal(expectedGauge.metric);
    realGauge.value.intValue.should.be.equal(expectedGauge.value.intValue);
    realGauge.metricType.should.be.equal(expectedGauge.metricType);

    realGauge.dimensions[0].key.should.not.be.empty;
    realGauge.dimensions[0].key.should.be.equal('dep1');
    realGauge.dimensions[0].value.should.not.be.empty;
    realGauge.dimensions[0].value.should.be.equal('dep1');


    realGauge.dimensions[1].key.should.not.be.empty;
    realGauge.dimensions[1].key.should.be.equal('dep2');
    realGauge.dimensions[1].value.should.not.be.empty;
    realGauge.dimensions[1].value.should.be.equal('dep2');
  });

  it('should have only AWSUniqueID in dimensions (Protobuf)', function (done) {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var client = new signalFx.Ingest(token, {enableAmazonUniqueId: true});

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    this.setTimeout = 1050;
    setTimeout(function () {
      client.send({gauges: gauges}).then(function () {
        client.AWSUniqueId.should.be.equal('instance_region_account');
        client.globalDimensions.AWSUniqueId.should.be.equal('instance_region_account');
        done();
      });
    }, 1000);
  });

  it('should have AWSUniqueID in dimensions (Protobuf)', function (done) {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var client = new signalFx.Ingest(token, {enableAmazonUniqueId: true});

    var gauges = [{
      metric: 'test.cpu',
      value: 10,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    }];

    this.setTimeout = 1050;
    setTimeout(function () {
      client.send({gauges: gauges}).then(function () {
        client.AWSUniqueId.should.be.equal('instance_region_account');
        client.globalDimensions.AWSUniqueId.should.be.equal('instance_region_account');
        done();
      });
    }, 1000);

  });

  it('Build event', function (done) {
    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var eventCategory = 'EXCEPTION';
    var eventType = 'deployment';
    var version = 'version';
    var dimensions = {
      host: 'myhost',
      service: 'myservice',
      instance: 'myinstance'
    };
    var properties = {version: version, intVersion: 5};
    var timestamp = (new Date()).getTime();
    var event = {
      category: eventCategory,
      eventType: eventType,
      dimensions: dimensions,
      properties: properties,
      timestamp: timestamp
    };

    var builtEvent = client._buildEvent(event);


    builtEvent.category.should.be.equal(700000);
    builtEvent.eventType.should.be.equal(eventType);
    builtEvent.timestamp.should.be.equal(timestamp);

    builtEvent.dimensions[0].key.should.not.be.empty;
    builtEvent.dimensions[0].key.should.be.equal('host');
    builtEvent.dimensions[0].value.should.not.be.empty;
    builtEvent.dimensions[0].value.should.be.equal('myhost');

    builtEvent.dimensions[1].key.should.not.be.empty;
    builtEvent.dimensions[1].key.should.be.equal('service');
    builtEvent.dimensions[1].value.should.not.be.empty;
    builtEvent.dimensions[1].value.should.be.equal('myservice');

    builtEvent.dimensions[2].key.should.not.be.empty;
    builtEvent.dimensions[2].key.should.be.equal('instance');
    builtEvent.dimensions[2].value.should.not.be.empty;
    builtEvent.dimensions[2].value.should.be.equal('myinstance');

    builtEvent.properties[0].key.should.not.be.empty;
    builtEvent.properties[0].key.should.be.equal('version');
    builtEvent.properties[0].value.strValue.should.not.be.empty;
    builtEvent.properties[0].value.strValue.should.be.equal('version');

    builtEvent.properties[1].key.should.not.be.empty;
    builtEvent.properties[1].key.should.be.equal('intVersion');
    builtEvent.properties[1].value.intValue.should.not.be.empty;
    builtEvent.properties[1].value.intValue.should.be.equal(5);

    done();
  });

  it('should have Protobuf content type', function () {
    var token = 'my token';
    var client = new signalFx.Ingest(token);

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

    signalFx = require('../../lib/signalfx');
  });

  after(function () {
    mockery.disable();
    mockery.deregisterAll();
  });

  it('should be created', function () {
    var token = 'my token';
    var client = new signalFx.IngestJson(token);
    client.should.not.be.empty;
    client.apiToken.should.be.equal(token);

    var isInstancedOfSignalFx = (client instanceof signalFx.IngestJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with all parameters', function () {
    var token = 'my token';
    var ingestEndpoint = 'ingestEndpoint';
    var timeout = 3000;
    var batchSize = 301;
    var userAgents = 'TestCl';

    var client = new signalFx.IngestJson(token, {
      ingestEndpoint: ingestEndpoint,
      timeout: timeout,
      batchSize: batchSize, userAgents: userAgents
    });

    client.should.not.be.empty;

    client.apiToken.should.be.equal(token);
    client.ingestEndpoint.should.be.equal(ingestEndpoint);
    client.batchSize.should.be.equal(batchSize);
    client.timeout.should.be.equal(timeout);
    client.userAgents.should.be.equal(userAgents);

    var isInstancedOfSignalFx = (client instanceof signalFx.IngestJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('should be created with AWS Unique ID', function () {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var enableAmazonUniqueId = true;

    var client = new signalFx.IngestJson(token, {
      enableAmazonUniqueId: enableAmazonUniqueId
    });

    client.apiToken.should.be.equal(token);
    client.AWSUniqueId.should.be.equal('instance_region_account');

    var isInstancedOfSignalFx = (client instanceof signalFx.IngestJson);
    isInstancedOfSignalFx.should.be.equal(true);
  });

  it('add datapoint to queue', function () {
    var token = 'my token';
    var client = new signalFx.IngestJson(token);

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
    var client = new signalFx.IngestJson(token);

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    client.send({gauges: gauges});

    this.timeout(1020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });

  it('Batch data (Json)', function () {

    var token = 'my token';
    var client = new signalFx.IngestJson(token);

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
    var client = new signalFx.IngestJson(token);

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

  it('should have dimensions + predefined dimensions (Json)', function () {

    var token = 'my token';
    var client = new signalFx.IngestJson(token, {dimensions: {dep1: 'dep1', dep2: 'dep2'}});

    var gauges = [{
      metric: 'test.cpu',
      value: 10,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    }];

    requestStub.yields(null, {statusCode: 200}, 'OK');
    client.rawData.push({gauges: gauges});

    client.processingData();
    client.queue.length.should.be.equal(1);

    var expectedGauge = {
      gauge: [{
        metric: 'test.cpu',
        value: 10,
        dimensions: {host: 'server1', host_ip: '1.2.3.4', dep1: 'dep1', dep2: 'dep2'}
      }]
    };

    var queue = client.queue;
    var dataToSend = client._batchData(queue);
    dataToSend.should.be.equal(JSON.stringify(expectedGauge));
  });

  it('should have only predefined dimensions (Json)', function () {

    var token = 'my token';
    var client = new signalFx.IngestJson(token, {dimensions: {dep1: 'dep1', dep2: 'dep2'}});

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    requestStub.yields(null, {statusCode: 200}, 'OK');
    client.rawData.push({gauges: gauges});
    client.processingData();
    client.queue.length.should.be.equal(1);

    var expectedGauge = {
      gauge: [{
        metric: 'test.cpu',
        value: 10,
        dimensions: {dep1: 'dep1', dep2: 'dep2'}
      }]
    };

    var queue = client.queue;
    var dataToSend = client._batchData(queue);
    dataToSend.should.be.equal(JSON.stringify(expectedGauge));
  });

  it('should have only AWSUniqueID in dimensions (Json)', function (done) {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var client = new signalFx.IngestJson(token, {enableAmazonUniqueId: true});

    var gauges = [{
      metric: 'test.cpu',
      value: 10
    }];

    this.setTimeout = 1050;
    setTimeout(function () {
      requestStub.yields(null, {statusCode: 200}, 'OK');
      client.send({gauges: gauges}).then(function () {
        client.AWSUniqueId.should.be.equal('instance_region_account');
        client.globalDimensions.AWSUniqueId.should.be.equal('instance_region_account');
        done();
      });
    }, 1500);

  });

  it('should have AWSUniqueID in dimensions (Json)', function (done) {
    requestStub.yields(null, {statusCode: 200}, '{"region": "region", "instanceId": "instance", "accountId": "account"}');

    var token = 'my token';
    var client = new signalFx.IngestJson(token, {enableAmazonUniqueId: true});

    var gauges = [{
      metric: 'test.cpu',
      value: 10,
      dimensions: {host: 'server1', host_ip: '1.2.3.4'}
    }];

    this.setTimeout = 1050;
    setTimeout(function () {
      requestStub.yields(null, {statusCode: 200}, 'OK');
      client.send({gauges: gauges}).then(function () {
        client.AWSUniqueId.should.be.equal('instance_region_account');
        client.globalDimensions.AWSUniqueId.should.be.equal('instance_region_account');
        done();
      });
    }, 1500);

  });


  it('should have Json content type', function () {
    var token = 'my token';
    var client = new signalFx.IngestJson(token);

    client.getHeaderContentType().should.be.equal('application/json');
  });

  it('Send event', function (done) {
    requestStub.yields(null, {statusCode: 200}, 'OK');

    var token = 'my token';
    var client = new signalFx.IngestJson(token);

    var eventCategory = 'EXCEPTION';
    var version = 'version';
    var dimensions = {
      host: 'myhost',
      service: 'myservice',
      instance: 'myinstance'
    };
    var properties = {version: version};
    client.sendEvent({category: eventCategory,
      eventType: 'deployments',
      dimensions: dimensions,
      properties: properties});

    this.timeout(1020);
    setTimeout(function () {
      requestStub.called.should.be.equal(true);
      done();
    }, 1000);

  });

  it('Build event', function (done) {
    var token = 'my token';
    var client = new signalFx.IngestJson(token);

    var eventCategory = 'EXCEPTION';
    var eventType = 'deployment';
    var version = 'version';
    var dimensions = {
      host: 'myhost',
      service: 'myservice',
      instance: 'myinstance'
    };
    var properties = {version: version};
    var timestamp = (new Date()).getTime();
    var event = {
      category: eventCategory,
      eventType: eventType,
      dimensions: dimensions,
      properties: properties,
      timestamp: timestamp
    };

    var eventsList = [];
    eventsList.push(event);
    var expectedResult = JSON.stringify(eventsList);

    var builtEvent = client._buildEvent(event);
    builtEvent.should.be.equal(expectedResult);
    done();
  });

});

describe('SignalFx client library (General)', function () {

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

    signalFx = require('../../lib/signalfx');
  });

  after(function () {
    mockery.disable();
    mockery.deregisterAll();
  });

  it('Send event: throw error when event type is empty', function (done) {
    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var eventCategory = 'EXCEPTION';
    try {
      client.sendEvent({category: eventCategory});
    } catch (err) {
      err.message.should.be.equal('Type of event should not be empty!');
    }
    done();

  });

  it('Send event: unsupported event category', function (done) {
    var token = 'my token';
    var client = new signalFx.Ingest(token);

    var eventCategory = 1;
    var eventType = 'deployment';
    try {
      client.sendEvent({category: eventCategory, eventType: eventType});
    } catch (err) {
      err.message.should.be.equal('Unsupported event category: 1');
    }
    done();

  });
});
