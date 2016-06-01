'use strict';
var signalFx = require('../lib/signalfx');

var token = 'YOUR SIGNALFX TOKEN'; // Replace with you token

var client = new signalFx.Ingest(token, {
  enableAmazonUniqueId: false, // Set this parameter to `true` to retrieve and add Amazon unique identifier as dimension
  dimensions: {type: 'test.cust_dim'} // This dimension will be added to every datapoint and event
});

// Sent datapoints routine
var counter = 0;
function loop() {
  setTimeout(function () {
    console.log(counter);
    var timestamp = (new Date()).getTime();
    var gauges = [{metric: 'test.cpu', value: counter % 10, timestamp: timestamp}];
    var counters = [{metric: 'cpu_cnt', value: counter % 2, timestamp: timestamp}];

    // Send datapoint
    client.send({gauges: gauges, counters: counters});

    if (counter % 100) {
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
      var dimensions = {host: 'myhost', service: 'myservice', instance: 'myinstance'};
      var properties = {version: version};

      // Send event
      client.sendEvent({category: client.EVENT_CATEGORIES.EXCEPTION,
        eventType: 'deployments',
        dimensions: dimensions,
        properties: properties,
        timestamp: timestamp});
    }
    counter += 1;
    loop();
  }, 1000);
}

loop();
