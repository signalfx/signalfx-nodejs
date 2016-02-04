module.exports = require("protobufjs").newBuilder({})['import']({
    "package": "com.signalfx.metrics.protobuf",
    "messages": [
        {
            "name": "Datum",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "strValue",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "doubleValue",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "intValue",
                    "id": 3
                }
            ]
        },
        {
            "name": "Dimension",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "key",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "value",
                    "id": 2
                }
            ]
        },
        {
            "name": "DataPoint",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "source",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "metric",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "Datum",
                    "name": "value",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "MetricType",
                    "name": "metricType",
                    "id": 5
                },
                {
                    "rule": "repeated",
                    "type": "Dimension",
                    "name": "dimensions",
                    "id": 6
                }
            ]
        },
        {
            "name": "DataPointUploadMessage",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "DataPoint",
                    "name": "datapoints",
                    "id": 1
                }
            ]
        },
        {
            "name": "PointValue",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "Datum",
                    "name": "value",
                    "id": 4
                }
            ]
        },
        {
            "name": "Property",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "key",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "PropertyValue",
                    "name": "value",
                    "id": 2
                }
            ]
        },
        {
            "name": "PropertyValue",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "strValue",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "doubleValue",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "intValue",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "boolValue",
                    "id": 4
                }
            ]
        },
        {
            "name": "Event",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "eventType",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "Dimension",
                    "name": "dimensions",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "Property",
                    "name": "properties",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "EventCategory",
                    "name": "category",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 5
                }
            ]
        },
        {
            "name": "EventUploadMessage",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "Event",
                    "name": "events",
                    "id": 1
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "MetricType",
            "values": [
                {
                    "name": "GAUGE",
                    "id": 0
                },
                {
                    "name": "COUNTER",
                    "id": 1
                },
                {
                    "name": "ENUM",
                    "id": 2
                },
                {
                    "name": "CUMULATIVE_COUNTER",
                    "id": 3
                }
            ]
        },
        {
            "name": "EventCategory",
            "values": [
                {
                    "name": "USER_DEFINED",
                    "id": 1000000
                },
                {
                    "name": "ALERT",
                    "id": 100000
                },
                {
                    "name": "AUDIT",
                    "id": 200000
                },
                {
                    "name": "JOB",
                    "id": 300000
                },
                {
                    "name": "COLLECTD",
                    "id": 400000
                },
                {
                    "name": "SERVICE_DISCOVERY",
                    "id": 500000
                },
                {
                    "name": "EXCEPTION",
                    "id": 700000
                }
            ]
        }
    ]
}).build();
