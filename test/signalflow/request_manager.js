'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var sflowclient = require('../../lib/client/signalflow/request_manager.js');
var expect = require('chai').expect;

describe('The SignalFlow Request Manager', function () {
  //TODO : re-enable this test once we figure out why it causes a hang
  var client = sflowclient('AUTHTOKEN');
  it('should initialize a request manager with three methods, execute, stop, authenticate', function (done) {
    var exposedFns = Object.keys(client);
    expect(exposedFns.length).to.equal(4);
    expect(exposedFns.indexOf('execute')).to.not.be.equal(-1);
    expect(exposedFns.indexOf('stop')).to.not.be.equal(-1);
    expect(exposedFns.indexOf('authenticate')).to.not.be.equal(-1);
    expect(exposedFns.indexOf('disconnect')).to.not.be.equal(-1);
    done();
  });

  xit('should attempt to authenticate when called', function (done) {
    //need to figure out how to implement this.
    var handle = client.authenticate('MYSESSIONTOKEN');
    done();
  });

  it('should return a request handle when execute is called, and remove from execute queue when stopped', function (done) {
    function cb() {}
    var handle = client.execute({
      program: 'data(\'jvm.cpu.load\').count().map(lambda x: x).publish()',
      start: Date.now() - 60000,
      stop: Date.now() + 600000,
      resolution: 10000,
      maxDelay: 1000
    }, cb);
    expect(client.stop(handle)).to.equal(true);
    expect(client.stop('R999')).to.equal(false);
    done();
  });
});
