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
        }
    ]
}).build();
