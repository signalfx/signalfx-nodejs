'use strict';
// Copyright (C) 2016 SignalFx, Inc. All rights reserved.

var sflowclient = require('../../lib/client/signalflow/signalflow_client.js');
var expect = require('chai').expect;

describe('The SignalFlow Client', function () {
  //TODO : re-enable this test once we figure out why it causes a hang
  xit('should initialize and wrap a request manager', function (done) {
    var client = sflowclient('AUTHTOKEN');
    var exposedFns = Object.keys(client);
    expect(exposedFns.length).to.equal(1);
    expect(exposedFns.indexOf('execute')).to.equal(-1);
  });
});
