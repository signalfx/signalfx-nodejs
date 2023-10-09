> ℹ️&nbsp;&nbsp;SignalFx was acquired by Splunk in October 2019. See [Splunk SignalFx](https://www.splunk.com/en_us/investor-relations/acquisitions/signalfx.html) for more information.

<p align="center">
  <a href="https://github.com/signalfx/signalfx-nodejs/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/signalfx/signalfx-nodejs?include_prereleases&style=for-the-badge">
  </a>
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/signalfx/signalfx-nodejs/main?style=for-the-badge">
  <img alt="npm" src="https://img.shields.io/npm/v/signalfx?style=for-the-badge">
  <img alt="node-current" src="https://img.shields.io/node/v/signalfx?style=for-the-badge">
</p>

# Node.js client library for SignalFx

This is a programmatic interface in JavaScript for SignalFx's metadata and
ingest APIs. It is meant to provide a base for communicating with
SignalFx APIs that can be easily leveraged by scripts and applications
to interact with SignalFx or report metric and event data to SignalFx.

## Installation

To install using npm:

```sh
$ npm install signalfx
```

### Supported Node.js versions

| Version | Node.js         |
| ------- | --------------- |
| `8.x.x` | `>=12.10.0 <=20` |
| `7.4.x` | `>=8.0.0 <18`   |
| `7.3.1` | `>=8.0.0 <11`   |

## Usage

### API access token

To use this library, you need a SignalFx access token. When using the ingest client
you will need to specify your organization's access token. For the SignalFlow Client,
either an organization access token or a user API token may be used. For
more information on access tokens, see the API's [Authentication documentation](https://dev.splunk.com/observability/docs/apibasics/authentication_basics/).

### Create client

There are two ways to create an ingest client object:

- The default constructor `Ingest`. This constructor uses Protobuf to send data to SignalFx. If it cannot send Protobuf, it falls back to sending JSON.
- The JSON constructor `IngestJson`. This constructor uses JSON format to send data to SignalFx.

```js
var signalfx = require("signalfx");

// Create default client
var client = new signalfx.Ingest("ORG_TOKEN", { options });
// or create JSON client
var clientJson = new signalfx.IngestJson("ORG_TOKEN", { options });
```

Object `options` is an optional map and may contains following fields:

- **enableAmazonUniqueId** - boolean, `false` by default. If `true`, library will retrieve Amazon unique identifier and set it as `AWSUniqueId` dimension for each datapoint and event. Use this option only if your application deployed to Amazon
- **dimensions** - object, pre-defined dimensions for each datapoint and event. This object has key-value format `{ dimension_name: dimension_value, ...}`
- **ingestEndpoint** - string, custom url to send datapoints in format http://custom.domain/api/path
- **timeout** - number, sending datapoints timeout in ms (default is 5000ms)
- **batchSize** - number, batch size to group sending datapoints
- **userAgents** - array of strings, items from this array will be added to 'user-agent' header separated by comma
- **proxy** - object, defines an address and credentials for sending metrics through a proxy server, it has the following format:
    ```javascript
    {
      protocol: 'http(s)',
      host: '127.0.0.1',
      port: 1234,
      auth: {
        username: '<username>',
        password: '<password>'
      }
    },
    ```

#### Configuring the ingest endpoint

If the ingestEndpoint is not set manually, this library uses the `us0` realm by default.
If you are not in this realm, you will need to explicitly set the
endpoint urls above. To determine if you are in a different realm and need to
explicitly set the endpoints, check your profile page in the SignalFx
web application.

### Reporting data

This example shows how to report metrics to SignalFx, as gauges, counters, or cumulative counters.

```js
var signalfx = require('signalfx');

var client = new signalfx.Ingest('ORG_TOKEN');

client.send({
           cumulative_counters:[
             {  metric: 'myfunc.calls_cumulative',
                value: 10,
                timestamp: 1442960607000},
             ...
           ],
           gauges:[
             {  metric: 'myfunc.time',
                value: 532,
                timestamp: 1442960607000},
             ...
           ],
           counters:[
             {  metric: 'myfunc.calls',
                value: 42,
                timestamp: 1442960607000},
             ...
           ]});
```

The `timestamp` must be a millisecond precision timestamp; the number of milliseconds elapsed since Epoch. The `timestamp` field is optional, but strongly recommended. If not specified, it will be set by SignalFx's ingest servers automatically; in this situation, the timestamp of your datapoints will not accurately represent the time of their measurement (network latency, batching, etc. will all impact when those datapoints actually make it to SignalFx).

### Sending multi-dimensional data

Reporting dimensions for the data is also optional, and can be accomplished by specifying a `dimensions` parameter on each datapoint containing a dictionary of string to string key/value pairs representing the dimensions:

```js
var signalfx = require('signalfx');

var client = new signalfx.Ingest('ORG_TOKEN');

client.send({
          cumulative_counters:[
            { 'metric': 'myfunc.calls_cumulative',
              'value': 10,
              'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ],
          gauges:[
            { 'metric': 'myfunc.time',
              'value': 532,
              'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ],
          counters:[
            { 'metric': 'myfunc.calls',
              'value': 42,
              'dimensions': {'host': 'server1', 'host_ip': '1.2.3.4'}},
            ...
          ]});
```

### Sending events

Events can be send to SignalFx via the `sendEvent` function. The
event param objects must be specified. `Event` param object is an optional map and may contains following fields:

- **eventType** (string) - Required field. The event type (name of the event time series).
- **category** (int) - the category of event. Choose one from EVENT_CATEGORIES list.
  Different categories of events are supported.Available categories of events are `USER_DEFINED`, `ALERT`, `AUDIT`, `JOB`,
  `COLLECTD`, `SERVICE_DISCOVERY`, `EXCEPTION`. For mode details see
  `proto/signal_fx_protocol_buffers.proto` file. Value by default is `USER_DEFINED`
- **dimensions** (dict) - a map of event dimensions, empty dictionary by default
- **properties** (dict) - a map of extra properties on that event, empty dictionary by default
- **timestamp** (int64) - a timestamp, by default is current time
  Also please specify event category: for that get
  option from dictionary `client.EVENT_CATEGORIES`.

```js
var signalfx = require("signalfx");

var client = new signalfx.Ingest("ORG_TOKEN");

client.sendEvent({
  category: "[event_category]",
  eventType: "[event_type]",
  dimensions: {
    host: "myhost",
    service: "myservice",
    instance: "myinstance",
  },
  properties: {
    version: "event_version",
  },
  timestamp: timestamp,
});
```

## Examples

Complete code example for Reporting data

```js
var signalfx = require("signalfx");

var myToken = "ORG_TOKEN";

var client = new signalfx.Ingest(myToken);
var gauges = [
  {
    metric: "test.cpu",
    value: 10,
  },
];

var counters = [
  {
    metric: "cpu_cnt",
    value: 2,
  },
];

client.send({ gauges: gauges, counters: counters });
```

Complete code example for Sending events

```js
var signalfx = require("signalfx");

var myToken = "[ORG_TOKEN]";

var client = new signalfx.Ingest(myToken);

var eventCategory = client.EVENT_CATEGORIES.USER_DEFINED;
var eventType = "deployment";
var dimensions = {
  host: "myhost",
  service: "myservice",
  instance: "myinstance",
};
var properties = { version: "[EVENT-VERSION]" };

client.sendEvent({
  category: eventCategory,
  eventType: eventType,
  dimensions: dimensions,
  properties: properties,
});
```

See `example/general_usage.js` for a complete code example for Reporting data.
Set your SignalFx token and run example

```sh
$ SPLUNK_ACCESS_TOKEN=xxx SPLUNK_REALM=xxx node example/general_usage.js
```

### Log level

The default log level is `info`.
You can override it by setting `SFX_CLIENT_LOG_LEVEL` environment variable. Valid values are winston log levels: `error`, `warn`, `info`, `http`, `verbose`, `debug` and `silly`.

## SignalFlow API

SignalFlow is SignalFx's real-time analytics computation language. The
SignalFlow API allows SignalFx users to execute real-time streaming analytics
computations on the SignalFx platform. For more information, head over to our
Developers documentation:

- [SignalFlow Overview](https://developers.signalfx.com/signalflow_analytics/signalflow_overview.html)
- [SignalFlow API Reference](https://developers.signalfx.com/signalflow_reference.html)

### API access token

The SignalFlow cilent accepts either an Organization Access Token or a User API Token.
For more information on access tokens, see the API's [Authentication Documentation](https://dev.splunk.com/observability/docs/apibasics/authentication_basics/).

### SignalFlow

#### Configuring the Signalflow websocket endpoint

If the websocket endpoint is not set manually, this library uses the `us0` realm by default.
If you are not in this realm, you will need to explicitly set the
endpoint urls above. To determine if you are in a different realm and need to
explicitly set the endpoints, check your profile page in the SignalFx
web application.

#### Examples

Complete code example for executing a computation

```js
var signalfx = require('signalfx');

var wsCallback = function(evt) {
    console.log('Hello, I'm a custom callback: ' + evt);
}

var myToken = '[ACCESS_TOKEN]';
var options = {'signalflowEndpoint': 'wss://stream.{REALM}.signalfx.com',
               'apiEndpoint': 'https://api.{REALM}.signalfx.com',
               'webSocketErrorCallback': wsCallback
              };

var client = new signalfx.SignalFlow(myToken, options);

var handle = client.execute({
            program: "data('cpu.utilization').mean().publish()",
            start: Date.now() - 60000,
            stop: Date.now() + 60000,
            resolution: 10000,
            immediate: false});

handle.stream(function(err, data) { console.log(data); });
```

Object `options` is an optional map and may contains following fields:

- **signalflowEndpoint** - string, `wss://stream.us0.signalfx.com` by default. Override this if you are in a different realm than `us0`.
- **apiEndpoint** - string, `https://api.us0.signalfx.com` by default. Override this if you are in a different realm than `us0`.
- **webSocketErrorCallback** - function, Throws an Error event by default. Override this if you want to handle a websocket error differently.

**Note**: A token created via the REST API is necessary to use this API. API Access tokens intended for ingest are not allowed.

#### API Options

Parameters to the execute method are as follows :

- **program** (string) - Required field. The signalflow to be run.
- **start** (int | string) - A milliseconds since epoch number or a string representing a relative time : e.g. -1h. Defaults to now.
- **stop** (int | string) - A milliseconds since epoch number or a string representing a relative time : e.g. -30m. Defaults to infinity.
- **resolution** (int) - The interval across which to calculate, in 1000 millisecond intervals. Defaults to 1000.
- **maxDelay** (int) - The maximum time to wait for a datapoint to arrive, in 10000 millisecond intervals. Defaults to dynamic.
- **bigNumber** (boolean) - True if returned values require precision beyond MAX_SAFE_INTEGER. Returns all values in data messages as bignumber objects as per https://www.npmjs.com/package/bignumber.js Defaults to false.
- **immediate** (boolean) - Whether to adjust the stop timestamp so that the computation doesn't wait for future data to be available.

#### Computation Objects

The returned object from an execute call possesses the following methods:

- **stream** (function (err, data)) - accepts a function and will call the function with computation messages when available. It returns multiple types of messages, detailed below. This follows error first callback conventions, so data is returned in the second argument if no errors occurred.
- **close** () - terminates the computation.
- **get_known_tsids** () - gets all known timeseries ID's for the current computation
- **get_metadata** (string) - gets the metadata message associated with the specific timeseries ID.

#### Stream Message Types

- Metadata

```js
{
  type : "metadata",
  channel : "<CHID>",
  properties : {
    sf_key : [<String>]
    sf_metric: <String>
    ...
  },
  tsId : "<ID>"
}
```

- Data

```js
{
  type : "data",
  channel : "<CHID>",
  data : [
    {
      tsId : "<ID>",
      value : <Number>
    },
    ...
  ],
  logicalTimestampMs : <Number>
}
```

- Event

```js
{
  tsId : "<ID>",
  timestampMs: 1461353198000,
  channel: "<CHID>",
  type: "event",
  properties: {
    incidentId: "<ID>",
    "inputValues" : "{\"a\":4}",
    was: "ok",
    is: "anomalous"
  }
}
```

More information about messages can be found at https://developers.signalfx.com/v2/docs/stream-messages-specification

#### Usage in a Web Browser

The signalflow client can be built for usage in a browser. This is accomplished via the following commands.

```
$ npm install
$ npm run build:browser
The output can be found at ./build/signalfx.js
```

It can then be loaded as usual via a script tag

```
<script src="build/signalfx.js" type="text/javascript"></script>
```

Once loaded, a signalfx global will be created(window.signalfx). Note that only the SignalFlow package is included in this built file.

#### Browser Usage Example using D3

First ensure your current working directory is the root of the nodejs repository clone, then do the following :

Make the following changes to example/index.html

```
replace 'ACCESS_TOKEN' with your own token.
replace 'cpu.utilization' with an appropriate metric as necessary.
```

Execute the following commands

```
$ npm install
$ gulp browserify
$ node example/server.js
```

Finally, open http://localhost:8888/example/index.html

## License

Apache Software License v2 © [SignalFx](https://signalfx.com)
