[![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/sheremetat/signalfx-nodejs.svg?branch=master)](https://travis-ci.org/sheremetat/signalfx-nodejs)
# NodeJS client library for SignalFx

This is a programmatic interface in JavaScript(CommonJS) for SignalFx's metadata and
ingest APIs. It is meant to provide a base for communicating with
SignalFx APIs that can be easily leveraged by scripts and applications
to interact with SignalFx or report metric and event data to SignalFx.


## Installation

To install using npm:
```sh
$ npm install signalfx --save-dev
```


## Usage

### API access token

To use this library, you need a SignalFx API access token, which can be
obtained from the SignalFx organization you want to report data into.

### Create client

There are two ways to create client object: using default constructor `SignalFx` 
or JSON constructor `SignalFxJson`. Default constructor uses Protobuf to send data to SignalFx,
or, if it is impossible, JSON. JSON constructor force use JSON format to send data to SignalFx

```js
var signalfx = require('signalfx');

// Create default client
var client = new signalFx.SignalFx('MY_SIGNALFX_TOKEN');
// or create JSON client
var clientJson = new signalFx.SignalFxJson('MY_SIGNALFX_TOKEN');
```

### Reporting data
```js
var signalfx = require('signalfx');

var client = new signalFx.SignalFx('MY_SIGNALFX_TOKEN');

client.send({
           cumulative_counters:[
             {metric: 'myfunc.calls_cumulative', value: 10},
             ...
           ],
           gauges:[
             {metric: 'myfunc.time', value: 532},
             ...
           ],
           counters:[
             {metric: 'myfunc.calls', value: 42},
             ...
           ]});
```

Reporting Dimensions for the data is optional and can be accomplished as follows:

```js
var signalfx = require('signalfx');

var client = new signalFx.SignalFx('MY_SIGNALFX_TOKEN');

client.send({
          cumulative_counters:[
            {'metric': 'myfunc.calls_cumulative', 'value': 10, 'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ],
          gauges:[
            {'metric': 'myfunc.time', 'value': 532, 'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ],
          counters:[
            {'metric': 'myfunc.calls', 'value': 42, 'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ]});
```

### Sending events

Events can be sent to SignalFx via the `sendEvent` function. The
event type must be specified, and dimensions and extra event properties
can be supplied as well.

```js
var signalfx = require('signalfx');

var client = new signalFx.SignalFx('MY_SIGNALFX_TOKEN');

client.sendEvent(
          '[event_type]',
          {
              'host': 'myhost',
              'service': 'myservice',
              'instance': 'myinstance'
          },
          properties={
              'version': 'event_version'})
```

## Examples

Complete code example for Reporting data
```js
var signalfx = require('signalfx');

var myToken = 'MY_SIGNALFX_TOKEN';

var client = new signalFx.SignalFx(myToken);
var gauges = [{
        metric: 'test.cpu',
        value: 10
      }];

var counters = [{
        metric: 'cpu_cnt',
        value:  2
      }];
      
client.send({gauges: gauges, counters: counters});
```

Complete code example for Sending events
```js
var signalfx = require('signalfx');

var myToken = '[MY_SIGNALFX_TOKEN]';

var client = new signalFx.SignalFx(myToken);

var eventType = '[EVENT-TYPE]'
var dimensions = {
     host: 'myhost',
     service: 'myservice',
     instance: 'myinstance'
  };
var properties = {version: '[EVENT-VERSION]'};

client.sendEvent(eventType, dimensions, properties);
```


## License

Apache Software License v2 © [SignalFx](https://signalfx.com)

[npm-image]: https://badge.fury.io/js/signalfx.svg
[npm-url]: https://npmjs.org/package/signalfx
