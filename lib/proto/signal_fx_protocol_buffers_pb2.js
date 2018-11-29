/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.com = (function() {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    var com = {};

    com.signalfx = (function() {

        /**
         * Namespace signalfx.
         * @memberof com
         * @namespace
         */
        var signalfx = {};

        signalfx.metrics = (function() {

            /**
             * Namespace metrics.
             * @memberof com.signalfx
             * @namespace
             */
            var metrics = {};

            metrics.protobuf = (function() {

                /**
                 * Namespace protobuf.
                 * @memberof com.signalfx.metrics
                 * @namespace
                 */
                var protobuf = {};

                /**
                 * MetricType enum.
                 * @name com.signalfx.metrics.protobuf.MetricType
                 * @enum {string}
                 * @property {number} GAUGE=0 Numerical: Periodic, instantaneous measurement of some state.
                 * @property {number} COUNTER=1 Numerical: Count of occurrences. Generally non-negative integers.
                 * @property {number} ENUM=2 String: Used for non-continuous quantities (that is, measurements where there is a fixed
                 * set of meaningful values). This is essentially a special case of gauge.
                 * @property {number} CUMULATIVE_COUNTER=3 Tracks a value that increases over time, where only the difference is important.
                 */
                protobuf.MetricType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "GAUGE"] = 0;
                    values[valuesById[1] = "COUNTER"] = 1;
                    values[valuesById[2] = "ENUM"] = 2;
                    values[valuesById[3] = "CUMULATIVE_COUNTER"] = 3;
                    return values;
                })();

                protobuf.Datum = (function() {

                    /**
                     * Properties of a Datum.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IDatum
                     * @property {string|null} [strValue] Datum strValue
                     * @property {number|null} [doubleValue] Datum doubleValue
                     * @property {number|Long|null} [intValue] Datum intValue
                     */

                    /**
                     * Constructs a new Datum.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a Datum.
                     * @implements IDatum
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IDatum=} [properties] Properties to set
                     */
                    function Datum(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Datum strValue.
                     * @member {string} strValue
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @instance
                     */
                    Datum.prototype.strValue = "";

                    /**
                     * Datum doubleValue.
                     * @member {number} doubleValue
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @instance
                     */
                    Datum.prototype.doubleValue = 0;

                    /**
                     * Datum intValue.
                     * @member {number|Long} intValue
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @instance
                     */
                    Datum.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new Datum instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDatum=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.Datum} Datum instance
                     */
                    Datum.create = function create(properties) {
                        return new Datum(properties);
                    };

                    /**
                     * Encodes the specified Datum message. Does not implicitly {@link com.signalfx.metrics.protobuf.Datum.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDatum} message Datum message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Datum.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.strValue);
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            writer.uint32(/* id 2, wireType 1 =*/17).double(message.doubleValue);
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.intValue);
                        return writer;
                    };

                    /**
                     * Encodes the specified Datum message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.Datum.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDatum} message Datum message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Datum.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Datum message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.Datum} Datum
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Datum.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.Datum();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.strValue = reader.string();
                                break;
                            case 2:
                                message.doubleValue = reader.double();
                                break;
                            case 3:
                                message.intValue = reader.int64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Datum message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.Datum} Datum
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Datum.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Datum message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Datum.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            if (!$util.isString(message.strValue))
                                return "strValue: string expected";
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            if (typeof message.doubleValue !== "number")
                                return "doubleValue: number expected";
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                                return "intValue: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a Datum message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.Datum} Datum
                     */
                    Datum.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.Datum)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.Datum();
                        if (object.strValue != null)
                            message.strValue = String(object.strValue);
                        if (object.doubleValue != null)
                            message.doubleValue = Number(object.doubleValue);
                        if (object.intValue != null)
                            if ($util.Long)
                                (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
                            else if (typeof object.intValue === "string")
                                message.intValue = parseInt(object.intValue, 10);
                            else if (typeof object.intValue === "number")
                                message.intValue = object.intValue;
                            else if (typeof object.intValue === "object")
                                message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a Datum message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @static
                     * @param {com.signalfx.metrics.protobuf.Datum} message Datum
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Datum.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.strValue = "";
                            object.doubleValue = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.intValue = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.intValue = options.longs === String ? "0" : 0;
                        }
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            object.strValue = message.strValue;
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            if (typeof message.intValue === "number")
                                object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                            else
                                object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                        return object;
                    };

                    /**
                     * Converts this Datum to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.Datum
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Datum.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Datum;
                })();

                protobuf.Dimension = (function() {

                    /**
                     * Properties of a Dimension.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IDimension
                     * @property {string|null} [key] Dimension key
                     * @property {string|null} [value] Dimension value
                     */

                    /**
                     * Constructs a new Dimension.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a Dimension.
                     * @implements IDimension
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IDimension=} [properties] Properties to set
                     */
                    function Dimension(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Dimension key.
                     * @member {string} key
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @instance
                     */
                    Dimension.prototype.key = "";

                    /**
                     * Dimension value.
                     * @member {string} value
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @instance
                     */
                    Dimension.prototype.value = "";

                    /**
                     * Creates a new Dimension instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDimension=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.Dimension} Dimension instance
                     */
                    Dimension.create = function create(properties) {
                        return new Dimension(properties);
                    };

                    /**
                     * Encodes the specified Dimension message. Does not implicitly {@link com.signalfx.metrics.protobuf.Dimension.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDimension} message Dimension message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Dimension.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.key != null && message.hasOwnProperty("key"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                        if (message.value != null && message.hasOwnProperty("value"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                        return writer;
                    };

                    /**
                     * Encodes the specified Dimension message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.Dimension.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDimension} message Dimension message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Dimension.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Dimension message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.Dimension} Dimension
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Dimension.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.Dimension();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.key = reader.string();
                                break;
                            case 2:
                                message.value = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Dimension message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.Dimension} Dimension
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Dimension.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Dimension message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Dimension.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.key != null && message.hasOwnProperty("key"))
                            if (!$util.isString(message.key))
                                return "key: string expected";
                        if (message.value != null && message.hasOwnProperty("value"))
                            if (!$util.isString(message.value))
                                return "value: string expected";
                        return null;
                    };

                    /**
                     * Creates a Dimension message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.Dimension} Dimension
                     */
                    Dimension.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.Dimension)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.Dimension();
                        if (object.key != null)
                            message.key = String(object.key);
                        if (object.value != null)
                            message.value = String(object.value);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Dimension message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @static
                     * @param {com.signalfx.metrics.protobuf.Dimension} message Dimension
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Dimension.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.key = "";
                            object.value = "";
                        }
                        if (message.key != null && message.hasOwnProperty("key"))
                            object.key = message.key;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = message.value;
                        return object;
                    };

                    /**
                     * Converts this Dimension to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.Dimension
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Dimension.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Dimension;
                })();

                protobuf.DataPoint = (function() {

                    /**
                     * Properties of a DataPoint.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IDataPoint
                     * @property {string|null} [source] DataPoint source
                     * @property {string|null} [metric] DataPoint metric
                     * @property {number|Long|null} [timestamp] DataPoint timestamp
                     * @property {com.signalfx.metrics.protobuf.IDatum|null} [value] DataPoint value
                     * @property {com.signalfx.metrics.protobuf.MetricType|null} [metricType] DataPoint metricType
                     * @property {Array.<com.signalfx.metrics.protobuf.IDimension>|null} [dimensions] DataPoint dimensions
                     */

                    /**
                     * Constructs a new DataPoint.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a DataPoint.
                     * @implements IDataPoint
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IDataPoint=} [properties] Properties to set
                     */
                    function DataPoint(properties) {
                        this.dimensions = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DataPoint source.
                     * @member {string} source
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.source = "";

                    /**
                     * DataPoint metric.
                     * @member {string} metric
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.metric = "";

                    /**
                     * DataPoint timestamp.
                     * @member {number|Long} timestamp
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * DataPoint value.
                     * @member {com.signalfx.metrics.protobuf.IDatum|null|undefined} value
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.value = null;

                    /**
                     * DataPoint metricType.
                     * @member {com.signalfx.metrics.protobuf.MetricType} metricType
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.metricType = 0;

                    /**
                     * DataPoint dimensions.
                     * @member {Array.<com.signalfx.metrics.protobuf.IDimension>} dimensions
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     */
                    DataPoint.prototype.dimensions = $util.emptyArray;

                    /**
                     * Creates a new DataPoint instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPoint=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.DataPoint} DataPoint instance
                     */
                    DataPoint.create = function create(properties) {
                        return new DataPoint(properties);
                    };

                    /**
                     * Encodes the specified DataPoint message. Does not implicitly {@link com.signalfx.metrics.protobuf.DataPoint.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPoint} message DataPoint message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataPoint.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.source != null && message.hasOwnProperty("source"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
                        if (message.metric != null && message.hasOwnProperty("metric"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.metric);
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
                        if (message.value != null && message.hasOwnProperty("value"))
                            $root.com.signalfx.metrics.protobuf.Datum.encode(message.value, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        if (message.metricType != null && message.hasOwnProperty("metricType"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.metricType);
                        if (message.dimensions != null && message.dimensions.length)
                            for (var i = 0; i < message.dimensions.length; ++i)
                                $root.com.signalfx.metrics.protobuf.Dimension.encode(message.dimensions[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified DataPoint message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.DataPoint.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPoint} message DataPoint message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataPoint.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a DataPoint message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.DataPoint} DataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataPoint.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.DataPoint();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.source = reader.string();
                                break;
                            case 2:
                                message.metric = reader.string();
                                break;
                            case 3:
                                message.timestamp = reader.int64();
                                break;
                            case 4:
                                message.value = $root.com.signalfx.metrics.protobuf.Datum.decode(reader, reader.uint32());
                                break;
                            case 5:
                                message.metricType = reader.int32();
                                break;
                            case 6:
                                if (!(message.dimensions && message.dimensions.length))
                                    message.dimensions = [];
                                message.dimensions.push($root.com.signalfx.metrics.protobuf.Dimension.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DataPoint message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.DataPoint} DataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataPoint.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DataPoint message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DataPoint.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.source != null && message.hasOwnProperty("source"))
                            if (!$util.isString(message.source))
                                return "source: string expected";
                        if (message.metric != null && message.hasOwnProperty("metric"))
                            if (!$util.isString(message.metric))
                                return "metric: string expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.value != null && message.hasOwnProperty("value")) {
                            var error = $root.com.signalfx.metrics.protobuf.Datum.verify(message.value);
                            if (error)
                                return "value." + error;
                        }
                        if (message.metricType != null && message.hasOwnProperty("metricType"))
                            switch (message.metricType) {
                            default:
                                return "metricType: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                break;
                            }
                        if (message.dimensions != null && message.hasOwnProperty("dimensions")) {
                            if (!Array.isArray(message.dimensions))
                                return "dimensions: array expected";
                            for (var i = 0; i < message.dimensions.length; ++i) {
                                var error = $root.com.signalfx.metrics.protobuf.Dimension.verify(message.dimensions[i]);
                                if (error)
                                    return "dimensions." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a DataPoint message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.DataPoint} DataPoint
                     */
                    DataPoint.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.DataPoint)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.DataPoint();
                        if (object.source != null)
                            message.source = String(object.source);
                        if (object.metric != null)
                            message.metric = String(object.metric);
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.value != null) {
                            if (typeof object.value !== "object")
                                throw TypeError(".com.signalfx.metrics.protobuf.DataPoint.value: object expected");
                            message.value = $root.com.signalfx.metrics.protobuf.Datum.fromObject(object.value);
                        }
                        switch (object.metricType) {
                        case "GAUGE":
                        case 0:
                            message.metricType = 0;
                            break;
                        case "COUNTER":
                        case 1:
                            message.metricType = 1;
                            break;
                        case "ENUM":
                        case 2:
                            message.metricType = 2;
                            break;
                        case "CUMULATIVE_COUNTER":
                        case 3:
                            message.metricType = 3;
                            break;
                        }
                        if (object.dimensions) {
                            if (!Array.isArray(object.dimensions))
                                throw TypeError(".com.signalfx.metrics.protobuf.DataPoint.dimensions: array expected");
                            message.dimensions = [];
                            for (var i = 0; i < object.dimensions.length; ++i) {
                                if (typeof object.dimensions[i] !== "object")
                                    throw TypeError(".com.signalfx.metrics.protobuf.DataPoint.dimensions: object expected");
                                message.dimensions[i] = $root.com.signalfx.metrics.protobuf.Dimension.fromObject(object.dimensions[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a DataPoint message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @static
                     * @param {com.signalfx.metrics.protobuf.DataPoint} message DataPoint
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DataPoint.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.dimensions = [];
                        if (options.defaults) {
                            object.source = "";
                            object.metric = "";
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            object.value = null;
                            object.metricType = options.enums === String ? "GAUGE" : 0;
                        }
                        if (message.source != null && message.hasOwnProperty("source"))
                            object.source = message.source;
                        if (message.metric != null && message.hasOwnProperty("metric"))
                            object.metric = message.metric;
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = $root.com.signalfx.metrics.protobuf.Datum.toObject(message.value, options);
                        if (message.metricType != null && message.hasOwnProperty("metricType"))
                            object.metricType = options.enums === String ? $root.com.signalfx.metrics.protobuf.MetricType[message.metricType] : message.metricType;
                        if (message.dimensions && message.dimensions.length) {
                            object.dimensions = [];
                            for (var j = 0; j < message.dimensions.length; ++j)
                                object.dimensions[j] = $root.com.signalfx.metrics.protobuf.Dimension.toObject(message.dimensions[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this DataPoint to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.DataPoint
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DataPoint.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return DataPoint;
                })();

                protobuf.DataPointUploadMessage = (function() {

                    /**
                     * Properties of a DataPointUploadMessage.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IDataPointUploadMessage
                     * @property {Array.<com.signalfx.metrics.protobuf.IDataPoint>|null} [datapoints] DataPointUploadMessage datapoints
                     */

                    /**
                     * Constructs a new DataPointUploadMessage.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a DataPointUploadMessage.
                     * @implements IDataPointUploadMessage
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IDataPointUploadMessage=} [properties] Properties to set
                     */
                    function DataPointUploadMessage(properties) {
                        this.datapoints = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DataPointUploadMessage datapoints.
                     * @member {Array.<com.signalfx.metrics.protobuf.IDataPoint>} datapoints
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @instance
                     */
                    DataPointUploadMessage.prototype.datapoints = $util.emptyArray;

                    /**
                     * Creates a new DataPointUploadMessage instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPointUploadMessage=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.DataPointUploadMessage} DataPointUploadMessage instance
                     */
                    DataPointUploadMessage.create = function create(properties) {
                        return new DataPointUploadMessage(properties);
                    };

                    /**
                     * Encodes the specified DataPointUploadMessage message. Does not implicitly {@link com.signalfx.metrics.protobuf.DataPointUploadMessage.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPointUploadMessage} message DataPointUploadMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataPointUploadMessage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.datapoints != null && message.datapoints.length)
                            for (var i = 0; i < message.datapoints.length; ++i)
                                $root.com.signalfx.metrics.protobuf.DataPoint.encode(message.datapoints[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified DataPointUploadMessage message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.DataPointUploadMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IDataPointUploadMessage} message DataPointUploadMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataPointUploadMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a DataPointUploadMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.DataPointUploadMessage} DataPointUploadMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataPointUploadMessage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.DataPointUploadMessage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.datapoints && message.datapoints.length))
                                    message.datapoints = [];
                                message.datapoints.push($root.com.signalfx.metrics.protobuf.DataPoint.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DataPointUploadMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.DataPointUploadMessage} DataPointUploadMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataPointUploadMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DataPointUploadMessage message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DataPointUploadMessage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.datapoints != null && message.hasOwnProperty("datapoints")) {
                            if (!Array.isArray(message.datapoints))
                                return "datapoints: array expected";
                            for (var i = 0; i < message.datapoints.length; ++i) {
                                var error = $root.com.signalfx.metrics.protobuf.DataPoint.verify(message.datapoints[i]);
                                if (error)
                                    return "datapoints." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a DataPointUploadMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.DataPointUploadMessage} DataPointUploadMessage
                     */
                    DataPointUploadMessage.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.DataPointUploadMessage)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.DataPointUploadMessage();
                        if (object.datapoints) {
                            if (!Array.isArray(object.datapoints))
                                throw TypeError(".com.signalfx.metrics.protobuf.DataPointUploadMessage.datapoints: array expected");
                            message.datapoints = [];
                            for (var i = 0; i < object.datapoints.length; ++i) {
                                if (typeof object.datapoints[i] !== "object")
                                    throw TypeError(".com.signalfx.metrics.protobuf.DataPointUploadMessage.datapoints: object expected");
                                message.datapoints[i] = $root.com.signalfx.metrics.protobuf.DataPoint.fromObject(object.datapoints[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a DataPointUploadMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.DataPointUploadMessage} message DataPointUploadMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DataPointUploadMessage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.datapoints = [];
                        if (message.datapoints && message.datapoints.length) {
                            object.datapoints = [];
                            for (var j = 0; j < message.datapoints.length; ++j)
                                object.datapoints[j] = $root.com.signalfx.metrics.protobuf.DataPoint.toObject(message.datapoints[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this DataPointUploadMessage to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.DataPointUploadMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DataPointUploadMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return DataPointUploadMessage;
                })();

                protobuf.PointValue = (function() {

                    /**
                     * Properties of a PointValue.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IPointValue
                     * @property {number|Long|null} [timestamp] PointValue timestamp
                     * @property {com.signalfx.metrics.protobuf.IDatum|null} [value] PointValue value
                     */

                    /**
                     * Constructs a new PointValue.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a PointValue.
                     * @implements IPointValue
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IPointValue=} [properties] Properties to set
                     */
                    function PointValue(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PointValue timestamp.
                     * @member {number|Long} timestamp
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @instance
                     */
                    PointValue.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * PointValue value.
                     * @member {com.signalfx.metrics.protobuf.IDatum|null|undefined} value
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @instance
                     */
                    PointValue.prototype.value = null;

                    /**
                     * Creates a new PointValue instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPointValue=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.PointValue} PointValue instance
                     */
                    PointValue.create = function create(properties) {
                        return new PointValue(properties);
                    };

                    /**
                     * Encodes the specified PointValue message. Does not implicitly {@link com.signalfx.metrics.protobuf.PointValue.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPointValue} message PointValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PointValue.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
                        if (message.value != null && message.hasOwnProperty("value"))
                            $root.com.signalfx.metrics.protobuf.Datum.encode(message.value, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified PointValue message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.PointValue.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPointValue} message PointValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PointValue.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a PointValue message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.PointValue} PointValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PointValue.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.PointValue();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 3:
                                message.timestamp = reader.int64();
                                break;
                            case 4:
                                message.value = $root.com.signalfx.metrics.protobuf.Datum.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PointValue message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.PointValue} PointValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PointValue.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PointValue message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PointValue.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.value != null && message.hasOwnProperty("value")) {
                            var error = $root.com.signalfx.metrics.protobuf.Datum.verify(message.value);
                            if (error)
                                return "value." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a PointValue message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.PointValue} PointValue
                     */
                    PointValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.PointValue)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.PointValue();
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.value != null) {
                            if (typeof object.value !== "object")
                                throw TypeError(".com.signalfx.metrics.protobuf.PointValue.value: object expected");
                            message.value = $root.com.signalfx.metrics.protobuf.Datum.fromObject(object.value);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a PointValue message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.PointValue} message PointValue
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PointValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            object.value = null;
                        }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = $root.com.signalfx.metrics.protobuf.Datum.toObject(message.value, options);
                        return object;
                    };

                    /**
                     * Converts this PointValue to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.PointValue
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PointValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return PointValue;
                })();

                /**
                 * Different categories of events supported
                 * @name com.signalfx.metrics.protobuf.EventCategory
                 * @enum {string}
                 * @property {number} USER_DEFINED=1000000 Created by user via UI or API, e.g. a deployment event
                 * @property {number} ALERT=100000 Output by anomaly detectors
                 * @property {number} AUDIT=200000 Audit trail events
                 * @property {number} JOB=300000 Generated by analytics server
                 * @property {number} COLLECTD=400000 Event originated within collectd
                 * @property {number} SERVICE_DISCOVERY=500000 Service discovery event
                 * @property {number} EXCEPTION=700000 Created by exception appenders to denote exceptional events
                 */
                protobuf.EventCategory = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[1000000] = "USER_DEFINED"] = 1000000;
                    values[valuesById[100000] = "ALERT"] = 100000;
                    values[valuesById[200000] = "AUDIT"] = 200000;
                    values[valuesById[300000] = "JOB"] = 300000;
                    values[valuesById[400000] = "COLLECTD"] = 400000;
                    values[valuesById[500000] = "SERVICE_DISCOVERY"] = 500000;
                    values[valuesById[700000] = "EXCEPTION"] = 700000;
                    return values;
                })();

                protobuf.Property = (function() {

                    /**
                     * Properties of a Property.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IProperty
                     * @property {string|null} [key] Property key
                     * @property {com.signalfx.metrics.protobuf.IPropertyValue|null} [value] Property value
                     */

                    /**
                     * Constructs a new Property.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a Property.
                     * @implements IProperty
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IProperty=} [properties] Properties to set
                     */
                    function Property(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Property key.
                     * @member {string} key
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @instance
                     */
                    Property.prototype.key = "";

                    /**
                     * Property value.
                     * @member {com.signalfx.metrics.protobuf.IPropertyValue|null|undefined} value
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @instance
                     */
                    Property.prototype.value = null;

                    /**
                     * Creates a new Property instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IProperty=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.Property} Property instance
                     */
                    Property.create = function create(properties) {
                        return new Property(properties);
                    };

                    /**
                     * Encodes the specified Property message. Does not implicitly {@link com.signalfx.metrics.protobuf.Property.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IProperty} message Property message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Property.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.key != null && message.hasOwnProperty("key"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                        if (message.value != null && message.hasOwnProperty("value"))
                            $root.com.signalfx.metrics.protobuf.PropertyValue.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified Property message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.Property.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IProperty} message Property message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Property.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Property message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.Property} Property
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Property.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.Property();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.key = reader.string();
                                break;
                            case 2:
                                message.value = $root.com.signalfx.metrics.protobuf.PropertyValue.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Property message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.Property} Property
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Property.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Property message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Property.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.key != null && message.hasOwnProperty("key"))
                            if (!$util.isString(message.key))
                                return "key: string expected";
                        if (message.value != null && message.hasOwnProperty("value")) {
                            var error = $root.com.signalfx.metrics.protobuf.PropertyValue.verify(message.value);
                            if (error)
                                return "value." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a Property message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.Property} Property
                     */
                    Property.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.Property)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.Property();
                        if (object.key != null)
                            message.key = String(object.key);
                        if (object.value != null) {
                            if (typeof object.value !== "object")
                                throw TypeError(".com.signalfx.metrics.protobuf.Property.value: object expected");
                            message.value = $root.com.signalfx.metrics.protobuf.PropertyValue.fromObject(object.value);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a Property message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @static
                     * @param {com.signalfx.metrics.protobuf.Property} message Property
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Property.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.key = "";
                            object.value = null;
                        }
                        if (message.key != null && message.hasOwnProperty("key"))
                            object.key = message.key;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = $root.com.signalfx.metrics.protobuf.PropertyValue.toObject(message.value, options);
                        return object;
                    };

                    /**
                     * Converts this Property to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.Property
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Property.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Property;
                })();

                protobuf.PropertyValue = (function() {

                    /**
                     * Properties of a PropertyValue.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IPropertyValue
                     * @property {string|null} [strValue] PropertyValue strValue
                     * @property {number|null} [doubleValue] PropertyValue doubleValue
                     * @property {number|Long|null} [intValue] PropertyValue intValue
                     * @property {boolean|null} [boolValue] PropertyValue boolValue
                     */

                    /**
                     * Constructs a new PropertyValue.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents a PropertyValue.
                     * @implements IPropertyValue
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IPropertyValue=} [properties] Properties to set
                     */
                    function PropertyValue(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PropertyValue strValue.
                     * @member {string} strValue
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @instance
                     */
                    PropertyValue.prototype.strValue = "";

                    /**
                     * PropertyValue doubleValue.
                     * @member {number} doubleValue
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @instance
                     */
                    PropertyValue.prototype.doubleValue = 0;

                    /**
                     * PropertyValue intValue.
                     * @member {number|Long} intValue
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @instance
                     */
                    PropertyValue.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * PropertyValue boolValue.
                     * @member {boolean} boolValue
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @instance
                     */
                    PropertyValue.prototype.boolValue = false;

                    /**
                     * Creates a new PropertyValue instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPropertyValue=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.PropertyValue} PropertyValue instance
                     */
                    PropertyValue.create = function create(properties) {
                        return new PropertyValue(properties);
                    };

                    /**
                     * Encodes the specified PropertyValue message. Does not implicitly {@link com.signalfx.metrics.protobuf.PropertyValue.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPropertyValue} message PropertyValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PropertyValue.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.strValue);
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            writer.uint32(/* id 2, wireType 1 =*/17).double(message.doubleValue);
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.intValue);
                        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue);
                        return writer;
                    };

                    /**
                     * Encodes the specified PropertyValue message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.PropertyValue.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IPropertyValue} message PropertyValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PropertyValue.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a PropertyValue message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.PropertyValue} PropertyValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PropertyValue.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.PropertyValue();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.strValue = reader.string();
                                break;
                            case 2:
                                message.doubleValue = reader.double();
                                break;
                            case 3:
                                message.intValue = reader.int64();
                                break;
                            case 4:
                                message.boolValue = reader.bool();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PropertyValue message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.PropertyValue} PropertyValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PropertyValue.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PropertyValue message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PropertyValue.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            if (!$util.isString(message.strValue))
                                return "strValue: string expected";
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            if (typeof message.doubleValue !== "number")
                                return "doubleValue: number expected";
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                                return "intValue: integer|Long expected";
                        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                            if (typeof message.boolValue !== "boolean")
                                return "boolValue: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a PropertyValue message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.PropertyValue} PropertyValue
                     */
                    PropertyValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.PropertyValue)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.PropertyValue();
                        if (object.strValue != null)
                            message.strValue = String(object.strValue);
                        if (object.doubleValue != null)
                            message.doubleValue = Number(object.doubleValue);
                        if (object.intValue != null)
                            if ($util.Long)
                                (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
                            else if (typeof object.intValue === "string")
                                message.intValue = parseInt(object.intValue, 10);
                            else if (typeof object.intValue === "number")
                                message.intValue = object.intValue;
                            else if (typeof object.intValue === "object")
                                message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
                        if (object.boolValue != null)
                            message.boolValue = Boolean(object.boolValue);
                        return message;
                    };

                    /**
                     * Creates a plain object from a PropertyValue message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @static
                     * @param {com.signalfx.metrics.protobuf.PropertyValue} message PropertyValue
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PropertyValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.strValue = "";
                            object.doubleValue = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.intValue = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.intValue = options.longs === String ? "0" : 0;
                            object.boolValue = false;
                        }
                        if (message.strValue != null && message.hasOwnProperty("strValue"))
                            object.strValue = message.strValue;
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
                            object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                        if (message.intValue != null && message.hasOwnProperty("intValue"))
                            if (typeof message.intValue === "number")
                                object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                            else
                                object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                            object.boolValue = message.boolValue;
                        return object;
                    };

                    /**
                     * Converts this PropertyValue to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.PropertyValue
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PropertyValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return PropertyValue;
                })();

                protobuf.Event = (function() {

                    /**
                     * Properties of an Event.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IEvent
                     * @property {string} eventType Event eventType
                     * @property {Array.<com.signalfx.metrics.protobuf.IDimension>|null} [dimensions] Event dimensions
                     * @property {Array.<com.signalfx.metrics.protobuf.IProperty>|null} [properties] Event properties
                     * @property {com.signalfx.metrics.protobuf.EventCategory|null} [category] Event category
                     * @property {number|Long|null} [timestamp] Event timestamp
                     */

                    /**
                     * Constructs a new Event.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents an Event.
                     * @implements IEvent
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IEvent=} [properties] Properties to set
                     */
                    function Event(properties) {
                        this.dimensions = [];
                        this.properties = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Event eventType.
                     * @member {string} eventType
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     */
                    Event.prototype.eventType = "";

                    /**
                     * Event dimensions.
                     * @member {Array.<com.signalfx.metrics.protobuf.IDimension>} dimensions
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     */
                    Event.prototype.dimensions = $util.emptyArray;

                    /**
                     * Event properties.
                     * @member {Array.<com.signalfx.metrics.protobuf.IProperty>} properties
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     */
                    Event.prototype.properties = $util.emptyArray;

                    /**
                     * Event category.
                     * @member {com.signalfx.metrics.protobuf.EventCategory} category
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     */
                    Event.prototype.category = 1000000;

                    /**
                     * Event timestamp.
                     * @member {number|Long} timestamp
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     */
                    Event.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new Event instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEvent=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.Event} Event instance
                     */
                    Event.create = function create(properties) {
                        return new Event(properties);
                    };

                    /**
                     * Encodes the specified Event message. Does not implicitly {@link com.signalfx.metrics.protobuf.Event.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEvent} message Event message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Event.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.eventType);
                        if (message.dimensions != null && message.dimensions.length)
                            for (var i = 0; i < message.dimensions.length; ++i)
                                $root.com.signalfx.metrics.protobuf.Dimension.encode(message.dimensions[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.properties != null && message.properties.length)
                            for (var i = 0; i < message.properties.length; ++i)
                                $root.com.signalfx.metrics.protobuf.Property.encode(message.properties[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.category != null && message.hasOwnProperty("category"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.category);
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int64(message.timestamp);
                        return writer;
                    };

                    /**
                     * Encodes the specified Event message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.Event.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEvent} message Event message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Event.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Event message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.Event} Event
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Event.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.Event();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.eventType = reader.string();
                                break;
                            case 2:
                                if (!(message.dimensions && message.dimensions.length))
                                    message.dimensions = [];
                                message.dimensions.push($root.com.signalfx.metrics.protobuf.Dimension.decode(reader, reader.uint32()));
                                break;
                            case 3:
                                if (!(message.properties && message.properties.length))
                                    message.properties = [];
                                message.properties.push($root.com.signalfx.metrics.protobuf.Property.decode(reader, reader.uint32()));
                                break;
                            case 4:
                                message.category = reader.int32();
                                break;
                            case 5:
                                message.timestamp = reader.int64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        if (!message.hasOwnProperty("eventType"))
                            throw $util.ProtocolError("missing required 'eventType'", { instance: message });
                        return message;
                    };

                    /**
                     * Decodes an Event message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.Event} Event
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Event.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Event message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Event.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (!$util.isString(message.eventType))
                            return "eventType: string expected";
                        if (message.dimensions != null && message.hasOwnProperty("dimensions")) {
                            if (!Array.isArray(message.dimensions))
                                return "dimensions: array expected";
                            for (var i = 0; i < message.dimensions.length; ++i) {
                                var error = $root.com.signalfx.metrics.protobuf.Dimension.verify(message.dimensions[i]);
                                if (error)
                                    return "dimensions." + error;
                            }
                        }
                        if (message.properties != null && message.hasOwnProperty("properties")) {
                            if (!Array.isArray(message.properties))
                                return "properties: array expected";
                            for (var i = 0; i < message.properties.length; ++i) {
                                var error = $root.com.signalfx.metrics.protobuf.Property.verify(message.properties[i]);
                                if (error)
                                    return "properties." + error;
                            }
                        }
                        if (message.category != null && message.hasOwnProperty("category"))
                            switch (message.category) {
                            default:
                                return "category: enum value expected";
                            case 1000000:
                            case 100000:
                            case 200000:
                            case 300000:
                            case 400000:
                            case 500000:
                            case 700000:
                                break;
                            }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates an Event message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.Event} Event
                     */
                    Event.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.Event)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.Event();
                        if (object.eventType != null)
                            message.eventType = String(object.eventType);
                        if (object.dimensions) {
                            if (!Array.isArray(object.dimensions))
                                throw TypeError(".com.signalfx.metrics.protobuf.Event.dimensions: array expected");
                            message.dimensions = [];
                            for (var i = 0; i < object.dimensions.length; ++i) {
                                if (typeof object.dimensions[i] !== "object")
                                    throw TypeError(".com.signalfx.metrics.protobuf.Event.dimensions: object expected");
                                message.dimensions[i] = $root.com.signalfx.metrics.protobuf.Dimension.fromObject(object.dimensions[i]);
                            }
                        }
                        if (object.properties) {
                            if (!Array.isArray(object.properties))
                                throw TypeError(".com.signalfx.metrics.protobuf.Event.properties: array expected");
                            message.properties = [];
                            for (var i = 0; i < object.properties.length; ++i) {
                                if (typeof object.properties[i] !== "object")
                                    throw TypeError(".com.signalfx.metrics.protobuf.Event.properties: object expected");
                                message.properties[i] = $root.com.signalfx.metrics.protobuf.Property.fromObject(object.properties[i]);
                            }
                        }
                        switch (object.category) {
                        case "USER_DEFINED":
                        case 1000000:
                            message.category = 1000000;
                            break;
                        case "ALERT":
                        case 100000:
                            message.category = 100000;
                            break;
                        case "AUDIT":
                        case 200000:
                            message.category = 200000;
                            break;
                        case "JOB":
                        case 300000:
                            message.category = 300000;
                            break;
                        case "COLLECTD":
                        case 400000:
                            message.category = 400000;
                            break;
                        case "SERVICE_DISCOVERY":
                        case 500000:
                            message.category = 500000;
                            break;
                        case "EXCEPTION":
                        case 700000:
                            message.category = 700000;
                            break;
                        }
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from an Event message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @static
                     * @param {com.signalfx.metrics.protobuf.Event} message Event
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Event.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.dimensions = [];
                            object.properties = [];
                        }
                        if (options.defaults) {
                            object.eventType = "";
                            object.category = options.enums === String ? "USER_DEFINED" : 1000000;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                        }
                        if (message.eventType != null && message.hasOwnProperty("eventType"))
                            object.eventType = message.eventType;
                        if (message.dimensions && message.dimensions.length) {
                            object.dimensions = [];
                            for (var j = 0; j < message.dimensions.length; ++j)
                                object.dimensions[j] = $root.com.signalfx.metrics.protobuf.Dimension.toObject(message.dimensions[j], options);
                        }
                        if (message.properties && message.properties.length) {
                            object.properties = [];
                            for (var j = 0; j < message.properties.length; ++j)
                                object.properties[j] = $root.com.signalfx.metrics.protobuf.Property.toObject(message.properties[j], options);
                        }
                        if (message.category != null && message.hasOwnProperty("category"))
                            object.category = options.enums === String ? $root.com.signalfx.metrics.protobuf.EventCategory[message.category] : message.category;
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        return object;
                    };

                    /**
                     * Converts this Event to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.Event
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Event.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Event;
                })();

                protobuf.EventUploadMessage = (function() {

                    /**
                     * Properties of an EventUploadMessage.
                     * @memberof com.signalfx.metrics.protobuf
                     * @interface IEventUploadMessage
                     * @property {Array.<com.signalfx.metrics.protobuf.IEvent>|null} [events] EventUploadMessage events
                     */

                    /**
                     * Constructs a new EventUploadMessage.
                     * @memberof com.signalfx.metrics.protobuf
                     * @classdesc Represents an EventUploadMessage.
                     * @implements IEventUploadMessage
                     * @constructor
                     * @param {com.signalfx.metrics.protobuf.IEventUploadMessage=} [properties] Properties to set
                     */
                    function EventUploadMessage(properties) {
                        this.events = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * EventUploadMessage events.
                     * @member {Array.<com.signalfx.metrics.protobuf.IEvent>} events
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @instance
                     */
                    EventUploadMessage.prototype.events = $util.emptyArray;

                    /**
                     * Creates a new EventUploadMessage instance using the specified properties.
                     * @function create
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEventUploadMessage=} [properties] Properties to set
                     * @returns {com.signalfx.metrics.protobuf.EventUploadMessage} EventUploadMessage instance
                     */
                    EventUploadMessage.create = function create(properties) {
                        return new EventUploadMessage(properties);
                    };

                    /**
                     * Encodes the specified EventUploadMessage message. Does not implicitly {@link com.signalfx.metrics.protobuf.EventUploadMessage.verify|verify} messages.
                     * @function encode
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEventUploadMessage} message EventUploadMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    EventUploadMessage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.events != null && message.events.length)
                            for (var i = 0; i < message.events.length; ++i)
                                $root.com.signalfx.metrics.protobuf.Event.encode(message.events[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified EventUploadMessage message, length delimited. Does not implicitly {@link com.signalfx.metrics.protobuf.EventUploadMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.IEventUploadMessage} message EventUploadMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    EventUploadMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an EventUploadMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.signalfx.metrics.protobuf.EventUploadMessage} EventUploadMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    EventUploadMessage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.signalfx.metrics.protobuf.EventUploadMessage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.events && message.events.length))
                                    message.events = [];
                                message.events.push($root.com.signalfx.metrics.protobuf.Event.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an EventUploadMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.signalfx.metrics.protobuf.EventUploadMessage} EventUploadMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    EventUploadMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an EventUploadMessage message.
                     * @function verify
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    EventUploadMessage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.events != null && message.hasOwnProperty("events")) {
                            if (!Array.isArray(message.events))
                                return "events: array expected";
                            for (var i = 0; i < message.events.length; ++i) {
                                var error = $root.com.signalfx.metrics.protobuf.Event.verify(message.events[i]);
                                if (error)
                                    return "events." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates an EventUploadMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.signalfx.metrics.protobuf.EventUploadMessage} EventUploadMessage
                     */
                    EventUploadMessage.fromObject = function fromObject(object) {
                        if (object instanceof $root.com.signalfx.metrics.protobuf.EventUploadMessage)
                            return object;
                        var message = new $root.com.signalfx.metrics.protobuf.EventUploadMessage();
                        if (object.events) {
                            if (!Array.isArray(object.events))
                                throw TypeError(".com.signalfx.metrics.protobuf.EventUploadMessage.events: array expected");
                            message.events = [];
                            for (var i = 0; i < object.events.length; ++i) {
                                if (typeof object.events[i] !== "object")
                                    throw TypeError(".com.signalfx.metrics.protobuf.EventUploadMessage.events: object expected");
                                message.events[i] = $root.com.signalfx.metrics.protobuf.Event.fromObject(object.events[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from an EventUploadMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @static
                     * @param {com.signalfx.metrics.protobuf.EventUploadMessage} message EventUploadMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    EventUploadMessage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.events = [];
                        if (message.events && message.events.length) {
                            object.events = [];
                            for (var j = 0; j < message.events.length; ++j)
                                object.events[j] = $root.com.signalfx.metrics.protobuf.Event.toObject(message.events[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this EventUploadMessage to JSON.
                     * @function toJSON
                     * @memberof com.signalfx.metrics.protobuf.EventUploadMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    EventUploadMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return EventUploadMessage;
                })();

                return protobuf;
            })();

            return metrics;
        })();

        return signalfx;
    })();

    return com;
})();

module.exports = $root;
