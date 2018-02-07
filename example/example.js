(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Barchart || (g.Barchart = {})).UserConfiguration = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var JwtGateway = require('@barchart/jwt-tgam-js/lib/JwtGateway');

module.exports = function () {
	'use strict';

	window.Barchart = window.Barchart || {};
	window.Barchart.Jwt = window.Barchart.Jwt || {};
	window.Barchart.Jwt.JwtProvider = JwtGateway;
}();

},{"@barchart/jwt-tgam-js/lib/JwtGateway":27}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('@barchart/common-js/lang/assert'),
    Disposable = require('@barchart/common-js/lang/Disposable'),
    Enum = require('@barchart/common-js/lang/Enum'),
    is = require('@barchart/common-js/lang/is');

var EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
    Gateway = require('@barchart/common-client-js/http/Gateway'),
    ProtocolType = require('@barchart/common-client-js/http/definitions/ProtocolType'),
    RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
    ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
    VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

module.exports = function () {
	'use strict';

	/**
  * Web service gateway for invoking user configuration data storage service.
  *
  * @public
  * @extends {Disposable}
  */

	var UserConfigurationGateway = function (_Disposable) {
		_inherits(UserConfigurationGateway, _Disposable);

		function UserConfigurationGateway() {
			_classCallCheck(this, UserConfigurationGateway);

			var _this = _possibleConstructorReturn(this, (UserConfigurationGateway.__proto__ || Object.getPrototypeOf(UserConfigurationGateway)).call(this));

			_this._started = false;
			_this._startPromise = null;

			_this._readConfigurationEndpoint = null;
			_this._writeConfigurationEndpoint = null;
			return _this;
		}

		/**
   * Initializes the connection to the remote server and returns a promise.
   *
   * @public
   * @param {String} protocol - The protocol to use (either HTTP or HTTPS).
   * @param {String} host - The host name of the Watchlist web service.
   * @param {Number} port - The TCP port number of the Watchlist web service.
   * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
   * @returns {Promise.<Boolean>}
   */


		_createClass(UserConfigurationGateway, [{
			key: 'start',
			value: function start(protocol, host, port, requestInterceptor) {
				var _this2 = this;

				return Promise.resolve().then(function () {
					if (_this2._startPromise === null) {
						assert.argumentIsRequired(protocol, 'protocol', String);
						assert.argumentIsRequired(host, 'host', String);
						assert.argumentIsRequired(port, 'port', Number);
						assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

						var protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

						var requestInterceptorToUse = void 0;

						if (requestInterceptor) {
							requestInterceptorToUse = requestInterceptor;
						} else {
							requestInterceptorToUse = RequestInterceptor.EMPTY;
						}

						_this2._readConfigurationEndpoint = EndpointBuilder.for('read-user').withVerb(VerbType.GET).withProtocol(protocolType).withHost(host).withPort(port).withPathBuilder(function (pb) {
							return pb.withLiteralParameter('v1').withLiteralParameter('user');
						}).withRequestInterceptor(requestInterceptorToUse).withResponseInterceptor(ResponseInterceptor.DATA).endpoint;

						_this2._writeConfigurationEndpoint = EndpointBuilder.for('write-user').withVerb(VerbType.PUT).withProtocol(protocolType).withHost(host).withPort(port).withPathBuilder(function (pb) {
							return pb.withLiteralParameter('v1').withLiteralParameter('user');
						}).withEntireBody().withRequestInterceptor(requestInterceptorToUse).endpoint;

						_this2._started = true;

						return _this2._started;
					}

					return _this2._startPromise;
				});
			}

			/**
    * Retrieves user configuration data from the remote server.
    *
    * @public
    * @returns {Promise.<Object>}
    */

		}, {
			key: 'readConfiguration',
			value: function readConfiguration() {
				var _this3 = this;

				return Promise.resolve().then(function () {
					checkStart.call(_this3);

					return Gateway.invoke(_this3._readConfigurationEndpoint);
				});
			}

			/**
    * Instructs the remote server to save user configuration data.
    *
    * @public
    * @param {Object} data
    * @returns {Promise}
    */

		}, {
			key: 'writeConfiguration',
			value: function writeConfiguration(data) {
				var _this4 = this;

				return Promise.resolve().then(function () {
					assert.argumentIsRequired(data, 'data', Object);

					checkStart.call(_this4);

					return Gateway.invoke(_this4._writeConfigurationEndpoint, data);
				});
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[UserConfigurationGateway]';
			}
		}]);

		return UserConfigurationGateway;
	}(Disposable);

	function checkStart() {
		if (this.getIsDisposed()) {
			throw new Error('Unable to use gateway, the gateway has been disposed.');
		}

		if (!this._started) {
			throw new Error('Unable to use gateway, the gateway has not started.');
		}
	}

	return UserConfigurationGateway;
}();

},{"@barchart/common-client-js/http/Gateway":4,"@barchart/common-client-js/http/builders/EndpointBuilder":5,"@barchart/common-client-js/http/definitions/ProtocolType":12,"@barchart/common-client-js/http/definitions/VerbType":13,"@barchart/common-client-js/http/interceptors/RequestInterceptor":16,"@barchart/common-client-js/http/interceptors/ResponseInterceptor":17,"@barchart/common-js/lang/Disposable":18,"@barchart/common-js/lang/Enum":19,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],3:[function(require,module,exports){
'use strict';

var UserConfigurationGateway = require('./gateway/UserConfigurationGateway');

module.exports = function () {
	'use strict';

	return {
		UserConfigurationGateway: UserConfigurationGateway,
		version: '1.0.0'
	};
}();

},{"./gateway/UserConfigurationGateway":2}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var assert = require('@barchart/common-js/lang/assert'),
    attributes = require('@barchart/common-js/lang/attributes'),
    is = require('@barchart/common-js/lang/is'),
    promise = require('@barchart/common-js/lang/promise');

var BodyType = require('./definitions/BodyType'),
    Endpoint = require('./definitions/Endpoint'),
    Parameter = require('./definitions/Parameter'),
    VerbType = require('./definitions/VerbType');

module.exports = function () {
	'use strict';

	/**
  * Invokes web service calls using an {@link Endpoint} definition.
  *
  * @public
  */

	var Gateway = function () {
		function Gateway() {
			_classCallCheck(this, Gateway);
		}

		/**
   * Invokes a web service endpoint, given the payload supplied.
   *
   * @public
   * @static
   * @param {Endpoint} endpoint
   * @param {*=} payload
   * @returns {Promise.<Object>}
   */


		_createClass(Gateway, [{
			key: 'toString',
			value: function toString() {
				return '[Gateway]';
			}
		}], [{
			key: 'invoke',
			value: function invoke(endpoint, payload) {
				return Promise.resolve({}).then(function () {
					assert.argumentIsRequired(endpoint, 'endpoint', Endpoint, 'Endpoint');

					return Promise.resolve({}).then(function (options) {
						return Promise.resolve([]).then(function (url) {
							url.push(endpoint.protocol.prefix);
							url.push(endpoint.host);

							if (endpoint.port !== endpoint.protocol.defaultPort) {
								url.push(':');
								url.push(endpoint.port);
							}

							url.push('/');

							return promise.pipeline(endpoint.path.parameters.map(function (parameter) {
								return function (previous) {
									return parameter.extractor(payload).then(function (value) {
										previous.push(value);

										return previous;
									});
								};
							}), []).then(function (paths) {
								url.push(paths.join('/'));

								return url.join('');
							});
						}).then(function (url) {
							options.method = verbs.get(endpoint.verb);
							options.url = url;

							return options;
						});
					}).then(function (options) {
						var headerParameters = endpoint.headers.parameters;

						if (headerParameters.length === 0) {
							return Promise.resolve(options);
						}

						return Promise.resolve({}).then(function (headers) {
							return promise.pipeline(headerParameters.map(function (parameter) {
								return function (previous) {
									return parameter.extractor(payload).then(function (value) {
										if (value !== null) {
											previous[parameter.key] = value;
										} else if (!parameter.optional) {
											throw new Error('Unable to extract header parameter [ ' + parameter.key + ' ]');
										}

										return previous;
									});
								};
							}), headers);
						}).then(function (headers) {
							options.headers = headers;

							return options;
						});
					}).then(function (options) {
						var queryParameters = endpoint.query.parameters;

						if (queryParameters.length === 0) {
							return Promise.resolve(options);
						}

						return Promise.resolve({}).then(function (query) {
							return promise.pipeline(queryParameters.map(function (parameter) {
								return function (previous) {
									return parameter.extractor(payload).then(function (value) {
										if (value !== null) {
											previous[parameter.key] = value;
										} else if (!parameter.optional) {
											throw new Error('Unable to extract query parameter [ ' + parameter.key + ' ]');
										}

										return previous;
									});
								};
							}), query);
						}).then(function (query) {
							options.params = query;

							return options;
						});
					}).then(function (options) {
						var body = endpoint.body;

						if (body.type === BodyType.ENTIRE) {
							options.data = payload;
						} else if (body.type === BodyType.VARIABLE) {
							if (attributes.has(payload, body.name)) {
								options.data = attributes.read(payload, body.name);
							} else {
								throw new Error('Unable construct web service request, payload is missing variable [ ' + body + ' ].');
							}
						}

						return options;
					}).then(function (options) {
						if (endpoint.requestInterceptor) {
							return endpoint.requestInterceptor.process(options);
						} else {
							return Promise.resolve(options);
						}
					}).then(function (options) {
						return promise.build(function (resolve, reject) {
							axios.request(options).then(function (response) {
								var responsePromise = void 0;

								if (endpoint.responseInterceptor) {
									responsePromise = endpoint.responseInterceptor.process(response);
								} else {
									responsePromise = resolve(response);
								}

								return responsePromise.then(function (response) {
									return resolve(response);
								});
							}).catch(function (e) {
								reject(e);
							});
						});
					});
				});
			}
		}]);

		return Gateway;
	}();

	var verbs = new Map();

	verbs.set(VerbType.GET, 'get');
	verbs.set(VerbType.DELETE, 'delete');
	verbs.set(VerbType.POST, 'post');
	verbs.set(VerbType.PUT, 'put');

	return Gateway;
}();

},{"./definitions/BodyType":8,"./definitions/Endpoint":9,"./definitions/Parameter":10,"./definitions/VerbType":13,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/attributes":22,"@barchart/common-js/lang/is":23,"@barchart/common-js/lang/promise":25,"axios":28}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert');

var ParametersBuilder = require('./ParametersBuilder');

var Body = require('./../definitions/Body'),
    BodyType = require('./../definitions/BodyType'),
    Endpoint = require('./../definitions/Endpoint'),
    Parameters = require('./../definitions/Parameters'),
    ProtocolType = require('./../definitions/ProtocolType'),
    VerbType = require('./../definitions/VerbType');

var CompositeResponseInterceptor = require('./../interceptors/CompositeResponseInterceptor'),
    CompositeRequestInterceptor = require('./../interceptors/CompositeRequestInterceptor'),
    ResponseInterceptor = require('./../interceptors/ResponseInterceptor'),
    RequestInterceptor = require('./../interceptors/RequestInterceptor');

module.exports = function () {
	'use strict';

	/**
  * Fluent interface for building a {@link Endpoint}.
  *
  * @public
  * @param {string} name
  */

	var EndpointBuilder = function () {
		function EndpointBuilder(name) {
			_classCallCheck(this, EndpointBuilder);

			assert.argumentIsRequired(name, 'name', String);

			this._endpoint = new Endpoint(name);
		}

		/**
   * The {@link Endpoint}, given all the information provided thus far.
   *
   * @public
   * @returns {Endpoint}
   */


		_createClass(EndpointBuilder, [{
			key: 'withVerb',


			/**
    * Sets the verb.
    *
    * @public
    * @param {VerbType} verb
    * @returns {EndpointBuilder}
    */
			value: function withVerb(verb) {
				assert.argumentIsRequired(verb, 'verb', VerbType, 'VerbType');

				this._endpoint = new Endpoint(this.endpoint.name, verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Sets the host.
    *
    * @public
    * @param {ProtocolType} protocol
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withProtocol',
			value: function withProtocol(protocol) {
				assert.argumentIsRequired(protocol, 'protocol', ProtocolType, 'ProtocolType');

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Sets the host.
    *
    * @public
    * @param {String} host
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withHost',
			value: function withHost(host) {
				assert.argumentIsRequired(host, 'host', String);

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Sets the port.
    *
    * @public
    * @param {Number} port
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withPort',
			value: function withPort(port) {
				assert.argumentIsRequired(port, 'port', Number);

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a {@link Parameters} collection, describing the request headers, using a callback.
    *
    * @public
    * @param {EndpointBuilder~parametersBuilderCallback} callback
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withHeadersBuilder',
			value: function withHeadersBuilder(callback) {
				assert.argumentIsRequired(callback, 'callback', Function);

				var builder = new ParametersBuilder();

				callback(builder);

				var headers = builder.parameters;

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a {@link Parameters} collection, describing the request path, using a callback.
    *
    * @public
    * @param {EndpointBuilder~parametersBuilderCallback} callback
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withPathBuilder',
			value: function withPathBuilder(callback) {
				assert.argumentIsRequired(callback, 'callback', Function);

				var builder = new ParametersBuilder();

				callback(builder);

				var path = builder.parameters;

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a {@link Parameters} collection, describing the request querystring, using a callback.
    *
    * @public
    * @param {EndpointBuilder~parametersBuilderCallback} callback
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withQueryBuilder',
			value: function withQueryBuilder(callback) {
				assert.argumentIsRequired(callback, 'callback', Function);

				var builder = new ParametersBuilder();

				callback(builder);

				var query = builder.parameters;

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a body to the request, selecting the value from a variable
    * on the request payload.
    *
    * @public
    * @param {String} variable - The name of the variable whose value contains the body.
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withVariableBody',
			value: function withVariableBody(variable) {
				assert.argumentIsRequired(variable, 'variable', String);

				var body = new Body(variable, BodyType.VARIABLE);

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a body to the request using the entire payload.
    *
    * @public
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withEntireBody',
			value: function withEntireBody() {
				var body = new Body(name, BodyType.ENTIRE);

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, body, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a {@link RequestInterceptor}.
    *
    * @public
    * @param {RequestInterceptor} requestInterceptor
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withRequestInterceptor',
			value: function withRequestInterceptor(requestInterceptor) {
				assert.argumentIsRequired(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

				var existingRequestInterceptor = this.endpoint.requestInterceptor;
				var updatedRequestInterceptor = void 0;

				if (existingRequestInterceptor) {
					updatedRequestInterceptor = new CompositeRequestInterceptor(existingRequestInterceptor, requestInterceptor);
				} else {
					updatedRequestInterceptor = requestInterceptor;
				}

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, updatedRequestInterceptor, this.endpoint.responseInterceptor);

				return this;
			}

			/**
    * Adds a {@link ResponseInterceptor}.
    *
    * @public
    * @param {ResponseInterceptor} responseInterceptor
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'withResponseInterceptor',
			value: function withResponseInterceptor(responseInterceptor) {
				assert.argumentIsRequired(responseInterceptor, 'responseInterceptor', ResponseInterceptor, 'ResponseInterceptor');

				var existingResponseInterceptor = this.endpoint.responseInterceptor;
				var updatedResponseInterceptor = void 0;

				if (existingResponseInterceptor) {
					updatedResponseInterceptor = new CompositeResponseInterceptor(existingResponseInterceptor, responseInterceptor);
				} else {
					updatedResponseInterceptor = responseInterceptor;
				}

				this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.requestInterceptor, updatedResponseInterceptor);

				return this;
			}

			/**
    * Factory function for creating an {@link EndpointBuilder} instance.
    *
    * @static
    * @public
    * @param {String} name
    * @returns {EndpointBuilder}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[EndpointBuilder]';
			}
		}, {
			key: 'endpoint',
			get: function get() {
				return this._endpoint;
			}
		}], [{
			key: 'for',
			value: function _for(name) {
				return new EndpointBuilder(name);
			}
		}]);

		return EndpointBuilder;
	}();

	/**
  * A function that, when passed the request's payload, returns a parameter's value.
  *
  * @callback EndpointBuilder~parametersBuilderCallback
  * @param {ParametersBuilder} parameter
  */

	return EndpointBuilder;
}();

},{"./../definitions/Body":7,"./../definitions/BodyType":8,"./../definitions/Endpoint":9,"./../definitions/Parameters":11,"./../definitions/ProtocolType":12,"./../definitions/VerbType":13,"./../interceptors/CompositeRequestInterceptor":14,"./../interceptors/CompositeResponseInterceptor":15,"./../interceptors/RequestInterceptor":16,"./../interceptors/ResponseInterceptor":17,"./ParametersBuilder":6,"@barchart/common-js/lang/assert":21}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    attributes = require('@barchart/common-js/lang/attributes'),
    is = require('@barchart/common-js/lang/is');

var Parameter = require('./../definitions/Parameter'),
    Parameters = require('./../definitions/Parameters');

module.exports = function () {
	'use strict';

	/**
  * Fluent interface for building a {@link Parameters} collection.
  *
  * @public
  */

	var ParametersBuilder = function () {
		function ParametersBuilder() {
			_classCallCheck(this, ParametersBuilder);

			this._parameters = new Parameters();
		}

		/**
   * The {@link Parameters} collection, given all the information provided thus far.
   *
   * @public
   * @returns {Parameters}
   */


		_createClass(ParametersBuilder, [{
			key: 'withDelegateParameter',


			/**
    * Adds a new parameter that extracts its value from a delegate.
    *
    * @param {String} key
    * @param {Function} delegate
    * @param (Boolean=} optional
    * @returns {ParametersBuilder}
    */
			value: function withDelegateParameter(key, delegate, optional) {
				addParameter.call(this, new Parameter(key, buildDelegateExtractor(delegate), optional));

				return this;
			}

			/**
    * Adds a new parameter with a literal value.
    *
    * @param {String} key
    * @param {Function} delegate
    * @param (Boolean=} optional
    * @returns {ParametersBuilder}
    */

		}, {
			key: 'withLiteralParameter',
			value: function withLiteralParameter(key, value, optional) {
				addParameter.call(this, new Parameter(key, buildLiteralExtractor(value || key), optional));

				return this;
			}

			/**
    * Adds a new parameter that reads its value from the a variable
    * on the request payload.
    *
    * @param {String} key
    * @param {Function} delegate
    * @param (Boolean=} optional
    * @returns {ParametersBuilder}
    */

		}, {
			key: 'withVariableParameter',
			value: function withVariableParameter(key, variable, optional) {
				addParameter.call(this, new Parameter(key, buildVariableExtractor(variable), optional));

				return this;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ParametersBuilder]';
			}
		}, {
			key: 'parameters',
			get: function get() {
				return this._parameters;
			}
		}]);

		return ParametersBuilder;
	}();

	function addParameter(parameter) {
		var items = this._parameters.parameters.slice(0);

		items.push(parameter);

		this._parameters = new Parameters(items);
	}

	function buildDelegateExtractor(fn) {
		assert.argumentIsRequired(fn, 'fn', Function);

		return function (payload) {
			return Promise.resolve().then(function () {
				return fn(payload);
			});
		};
	}

	function buildLiteralExtractor(value) {
		assert.argumentIsRequired(value, 'value', String);

		return function (payload) {
			return Promise.resolve(value);
		};
	}

	function buildVariableExtractor(variable) {
		assert.argumentIsRequired(variable, 'variable', String);

		return buildDelegateExtractor(function (payload) {
			if (is.object(payload) && attributes.has(payload, variable)) {
				return attributes.read(payload, variable);
			} else {
				return null;
			}
		});
	}

	return ParametersBuilder;
}();

},{"./../definitions/Parameter":10,"./../definitions/Parameters":11,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/attributes":22,"@barchart/common-js/lang/is":23}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var BodyType = require('./BodyType');

module.exports = function () {
	'use strict';

	/**
  * The definition the body for an {@link Endpoint}.
  *
  * @public
  * @param {String=} name
  * @param {BodyType=} type
  */

	var Body = function () {
		function Body(name, type) {
			_classCallCheck(this, Body);

			this._name = name || null;
			this._type = type || BodyType.NONE;
		}

		/**
   * If necessary, the name of the variable (read from the payload) to
   * use on the request body.
   *
   * @public
   * @returns {String|null}
   */


		_createClass(Body, [{
			key: 'validate',


			/**
    * Throws an {@link Error} if the instance is invalid.
    *
    * @public
    */
			value: function validate() {
				if (this._name && !is.string(this._name)) {
					throw new Error('If present, the body name must be a non-zero-length string.');
				}

				if (!(this._type instanceof BodyType)) {
					throw new Error('Parameter type must be an instance of BodyType.');
				}
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Body]';
			}
		}, {
			key: 'name',
			get: function get() {
				return this._name;
			}

			/**
    * The type of the parameter.
    *
    * @public
    * @returns {BodyType}
    */

		}, {
			key: 'type',
			get: function get() {
				return this._type;
			}
		}]);

		return Body;
	}();

	return Body;
}();

},{"./BodyType":8,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Enum = require('@barchart/common-js/lang/Enum');

module.exports = function () {
	'use strict';

	/**
  * Defines the mechanism used to select the body of the
  * request from the request payload.
  *
  * @public
  * @extends {Enum}
  * @param {String} code
  * @param {String} description
  */

	var BodyType = function (_Enum) {
		_inherits(BodyType, _Enum);

		function BodyType(code, description) {
			_classCallCheck(this, BodyType);

			return _possibleConstructorReturn(this, (BodyType.__proto__ || Object.getPrototypeOf(BodyType)).call(this, code, description));
		}

		/**
   * Uses no body for the request.
   *
   * @static
   * @returns {BodyType}
   */


		_createClass(BodyType, [{
			key: 'toString',
			value: function toString() {
				return '[BodyType (description=' + this.description + ')]';
			}
		}], [{
			key: 'NONE',
			get: function get() {
				return bodyTypeNone;
			}

			/**
    * Uses the entire payload as the request body.
    *
    * @static
    * @returns {BodyType}
    */

		}, {
			key: 'ENTIRE',
			get: function get() {
				return bodyTypeEntire;
			}

			/**
    * Uses a single property, selected using a variable name, from the payload
    * as the request body.
    *
    * @static
    * @returns {BodyType}
    */

		}, {
			key: 'VARIABLE',
			get: function get() {
				return bodyTypeVariable;
			}
		}]);

		return BodyType;
	}(Enum);

	var bodyTypeNone = new BodyType('NONE', 'none');
	var bodyTypeEntire = new BodyType('ENTIRE', 'entire');
	var bodyTypeVariable = new BodyType('VARIABLE', 'variable');

	return BodyType;
}();

},{"@barchart/common-js/lang/Enum":19}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var Body = require('./Body'),
    Parameter = require('./Parameter'),
    Parameters = require('./Parameters'),
    ProtocolType = require('./ProtocolType'),
    VerbType = require('./VerbType');

var RequestInterceptor = require('./../interceptors/RequestInterceptor'),
    ResponseInterceptor = require('./../interceptors/ResponseInterceptor');

module.exports = function () {
	'use strict';

	/**
  * The definition of a web service endpoint.
  *
  * @public
  * @param {String=} name
  * @param {VerbType=} verb
  * @param {ProtocolType=} protocol
  * @param {String=} host
  * @param {Number=} port
  * @param {Parameters=} path
  * @param {Parameters=} query
  * @param {Parameters=} headers
  * @param {Body=} body
  * @param {RequestInterceptor} requestInterceptor
  * @param {ResponseInterceptor} responseInterceptor
  */

	var Endpoint = function () {
		function Endpoint(name, verb, protocol, host, port, path, query, headers, body, requestInterceptor, responseInterceptor) {
			_classCallCheck(this, Endpoint);

			this._name = name || null;
			this._verb = verb || VerbType.GET;
			this._protocol = protocol || ProtocolType.HTTPS;
			this._host = host || null;
			this._port = port || this._protocol.defaultPort;
			this._path = path || new Parameters();
			this._query = query || new Parameters();
			this._headers = headers || new Parameters();
			this._body = body || new Body();
			this._requestInterceptor = requestInterceptor || RequestInterceptor.EMPTY;
			this._responseInterceptor = responseInterceptor || ResponseInterceptor.EMPTY;
		}

		/**
   * The name of the endpoint (used for descriptive purposes only).
   *
   * @public
   * @returns {String}
   */


		_createClass(Endpoint, [{
			key: 'validate',


			/**
    * Throws an {@link Error} if the instance is invalid.
    *
    * @public
    */
			value: function validate() {
				if (!(this.protocol instanceof ProtocolType)) {
					throw new Error('Endpoint protocol must be an instance of ProtocolType.');
				}

				if (!is.string(this._host) || this._host.length === 0) {
					throw new Error('Endpoint host is invalid.');
				}

				if (!is.integer(this._port) || this._port < 0 || this._port > 65535) {
					throw new Error('Endpoint port range is invalid.');
				}

				if (!(this.path instanceof Parameters)) {
					throw new Error('The path must be a Parameters collection.');
				}

				this.path.validate();

				if (!(this.query instanceof Parameters)) {
					throw new Error('The query must be a Parameters collection.');
				}

				this.query.validate();

				if (!(this.headers instanceof Parameters)) {
					throw new Error('The headers must be a Parameters collection.');
				}

				this.headers.validate();

				if (!(this.body instanceof Body)) {
					throw new Error('The body must be a Body instance.');
				}

				this.body.validate();

				if (this.requestInterceptor && !(this.requestInterceptor instanceof RequestInterceptor)) {
					throw new Error('Endpoint request interceptor must be an instance of RequestInterceptor.');
				}

				if (this.responseInterceptor && !(this.responseInterceptor instanceof ResponseInterceptor)) {
					throw new Error('Endpoint response interceptor must be an instance of ResponseInterceptor.');
				}
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Endpoint (name=' + this._name + ')]';
			}
		}, {
			key: 'name',
			get: function get() {
				return this._name;
			}

			/**
    * The verb to use when making the request.
    *
    * @public
    * @returns {VerbType}
    */

		}, {
			key: 'verb',
			get: function get() {
				return this._verb;
			}

			/**
    * The protocol to use with the endpoint.
    *
    * @public
    * @returns {ProtocolType}
    */

		}, {
			key: 'protocol',
			get: function get() {
				return this._protocol;
			}

			/**
    * The host of the endpoint.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'host',
			get: function get() {
				return this._host;
			}

			/**
    * The host of the endpoint.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'port',
			get: function get() {
				return this._port;
			}

			/**
    * The path definition of the endpoint.
    *
    * @public
    * @returns {Parameters}
    */

		}, {
			key: 'path',
			get: function get() {
				return this._path;
			}

			/**
    * The query definition of the endpoint.
    *
    * @public
    * @returns {Parameters}
    */

		}, {
			key: 'query',
			get: function get() {
				return this._query;
			}

			/**
    * The header definition of the endpoint.
    *
    * @public
    * @returns {Parameters}
    */

		}, {
			key: 'headers',
			get: function get() {
				return this._headers;
			}

			/**
    * The body definition of the endpoint.
    *
    * @public
    * @returns {Body}
    */

		}, {
			key: 'body',
			get: function get() {
				return this._body;
			}

			/**
    * The request interceptor of the endpoint.
    *
    * @public
    * @returns {RequestInterceptor|null}
    */

		}, {
			key: 'requestInterceptor',
			get: function get() {
				return this._requestInterceptor;
			}

			/**
    * The request interceptor of the endpoint.
    *
    * @public
    * @returns {ResponseInterceptor|null}
    */

		}, {
			key: 'responseInterceptor',
			get: function get() {
				return this._responseInterceptor;
			}
		}]);

		return Endpoint;
	}();

	return Endpoint;
}();

},{"./../interceptors/RequestInterceptor":16,"./../interceptors/ResponseInterceptor":17,"./Body":7,"./Parameter":10,"./Parameters":11,"./ProtocolType":12,"./VerbType":13,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	/**
  * Encapsulates definition of a parameter -- that is, its name and
  * its value. Parameters are used in request paths, querystrings, and
  * as headers.
  *
  * @public
  * @param {String=} key
  * @param {Parameter~parameterValueCallback} value
  * @param {Boolean=} optional
  */

	var Parameter = function () {
		function Parameter(key, extractor, optional) {
			_classCallCheck(this, Parameter);

			this._key = key || null;
			this._extractor = extractor || null;
			this._optional = is.boolean(optional) && optional;
		}

		/**
   * The name of the parameter.
   *
   * @public
   * @returns {String}
   */


		_createClass(Parameter, [{
			key: 'validate',


			/**
    * Throws an {@link Error} if the instance is invalid.
    *
    * @public
    */
			value: function validate() {
				if (!is.string(this.key) || this.key.length === 0) {
					throw new Error('Parameter key must be a non-zero length string');
				}

				if (!is.fn(this.value)) {
					throw new Error('Parameter extractor must be a function.');
				}
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Parameter]';
			}
		}, {
			key: 'key',
			get: function get() {
				return this._key;
			}

			/**
    * A function for extracting the parameter's value.
    *
    * @public
    * @returns {Parameter~parameterValueCallback}
    */

		}, {
			key: 'extractor',
			get: function get() {
				return this._extractor;
			}

			/**
    * Indicates if the parameter is required.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'optional',
			get: function get() {
				return this._optional;
			}
		}]);

		return Parameter;
	}();

	/**
  * A function that, when passed the request's payload, returns a parameter's value.
  *
  * @callback Parameter~parameterValueCallback
  * @param {Object} payload
  * @returns {Promise.<String>}
  */

	return Parameter;
}();

},{"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var Parameter = require('./Parameter');

module.exports = function () {
	'use strict';

	/**
  * An ordered collection of {@link Parameter} items.
  *
  * @public
  * @param {Parameter[]|undefined} parameters
  */

	var Parameters = function () {
		function Parameters(parameters) {
			_classCallCheck(this, Parameters);

			this._parameters = parameters || [];
		}

		/**
   * The list of {@link Parameter} items.
   *
   * @public
   * @returns {Parameter[]}
   */


		_createClass(Parameters, [{
			key: 'validate',


			/**
    * Throws an {@link Error} if the instance is invalid.
    *
    * @public
    */
			value: function validate() {
				if (!is.array(this._parameters)) {
					throw new Error('Parameters must be an array.');
				}

				if (this._parameters.some(function (p) {
					return !(p instanceof Parameter);
				})) {
					throw new Error('All parameter items must be instances of Parameters.');
				}

				this._parameters.forEach(function (p) {
					return p.validate();
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Parameters]';
			}
		}, {
			key: 'parameters',
			get: function get() {
				return this._parameters;
			}
		}]);

		return Parameters;
	}();

	return Parameters;
}();

},{"./Parameter":10,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('@barchart/common-js/lang/assert'),
    Enum = require('@barchart/common-js/lang/Enum'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	/**
  * Defines the protocol for a web request.
  *
  * @public
  * @extends {Enum}
  * @param {String} code
  * @param {Number} defaultPort
  * @param {String} prefix
  */

	var ProtocolType = function (_Enum) {
		_inherits(ProtocolType, _Enum);

		function ProtocolType(code, defaultPort, prefix) {
			_classCallCheck(this, ProtocolType);

			var _this = _possibleConstructorReturn(this, (ProtocolType.__proto__ || Object.getPrototypeOf(ProtocolType)).call(this, code, code));

			assert.argumentIsRequired(prefix, 'prefix', String);
			assert.argumentIsValid(defaultPort, 'defaultPort', function (p) {
				return is.integer(p) && !(p < 0 || p > 65535);
			});

			_this._defaultPort = defaultPort;
			_this._prefix = prefix;
			return _this;
		}

		/**
   * Returns the default TCP port used by the protocol.
   *
   * @public
   * @returns {Number}
   */


		_createClass(ProtocolType, [{
			key: 'toString',
			value: function toString() {
				return '[ProtocolType (description=' + this.description + ')]';
			}
		}, {
			key: 'defaultPort',
			get: function get() {
				return this._defaultPort;
			}

			/**
    * Returns the prefix used to compose a URL.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'prefix',
			get: function get() {
				return this._prefix;
			}

			/**
    * HTTP.
    *
    * @static
    * @returns {ProtocolType}
    */

		}], [{
			key: 'HTTP',
			get: function get() {
				return protocolTypeHttp;
			}

			/**
    * HTTPS.
    *
    * @static
    * @returns {ProtocolType}
    */

		}, {
			key: 'HTTPS',
			get: function get() {
				return protocolTypeHttps;
			}
		}]);

		return ProtocolType;
	}(Enum);

	var protocolTypeHttp = new ProtocolType('HTTP', 80, 'http://');
	var protocolTypeHttps = new ProtocolType('HTTPS', 443, 'https://');

	return ProtocolType;
}();

},{"@barchart/common-js/lang/Enum":19,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Enum = require('@barchart/common-js/lang/Enum');

module.exports = function () {
	'use strict';

	/**
  * An HTTP verb.
  *
  * @public
  * @extends {Enum}
  * @param {String} description
  */

	var VerbType = function (_Enum) {
		_inherits(VerbType, _Enum);

		function VerbType(description) {
			_classCallCheck(this, VerbType);

			return _possibleConstructorReturn(this, (VerbType.__proto__ || Object.getPrototypeOf(VerbType)).call(this, description, description));
		}

		/**
   * DELETE.
   *
   * @static
   * @returns {VerbType}
   */


		_createClass(VerbType, [{
			key: 'toString',
			value: function toString() {
				return '[VerbType (description=' + this.description + ')]';
			}
		}], [{
			key: 'DELETE',
			get: function get() {
				return verbTypeDelete;
			}

			/**
    * GET.
    *
    * @static
    * @returns {VerbType}
    */

		}, {
			key: 'GET',
			get: function get() {
				return verbTypeGet;
			}

			/**
    * POST.
    *
    * @static
    * @returns {VerbType}
    */

		}, {
			key: 'POST',
			get: function get() {
				return verbTypePost;
			}

			/**
    * PUT.
    *
    * @static
    * @returns {VerbType}
    */

		}, {
			key: 'PUT',
			get: function get() {
				return verbTypePut;
			}
		}]);

		return VerbType;
	}(Enum);

	var verbTypeDelete = new VerbType('DELETE');
	var verbTypeGet = new VerbType('GET');
	var verbTypePost = new VerbType('POST');
	var verbTypePut = new VerbType('PUT');

	return VerbType;
}();

},{"@barchart/common-js/lang/Enum":19}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var RequestInterceptor = require('./RequestInterceptor');

module.exports = function () {
	'use strict';

	/**
  * A {@link ResponseInterceptor} that delegates work to two other instances.
  *
  * @public
  * @extends {RequestInterceptor}
  * @param {RequestInterceptor} a - The first interceptor to process.
  * @param {RequestInterceptor} b - The second interceptor to process.
  */

	var CompositeRequestInterceptor = function (_RequestInterceptor) {
		_inherits(CompositeRequestInterceptor, _RequestInterceptor);

		function CompositeRequestInterceptor(a, b) {
			_classCallCheck(this, CompositeRequestInterceptor);

			var _this = _possibleConstructorReturn(this, (CompositeRequestInterceptor.__proto__ || Object.getPrototypeOf(CompositeRequestInterceptor)).call(this));

			assert.argumentIsRequired(a, 'a', RequestInterceptor, 'RequestInterceptor');
			assert.argumentIsRequired(b, 'b', RequestInterceptor, 'RequestInterceptor');

			_this._a = a;
			_this._b = b;
			return _this;
		}

		_createClass(CompositeRequestInterceptor, [{
			key: '_onProcess',
			value: function _onProcess(request) {
				var _this2 = this;

				return this._a.process(request).then(function (adjusted) {
					return _this2._b.process(adjusted);
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[CompositeRequestInterceptor]';
			}
		}]);

		return CompositeRequestInterceptor;
	}(RequestInterceptor);

	return CompositeRequestInterceptor;
}();

},{"./RequestInterceptor":16,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var ResponseInterceptor = require('./ResponseInterceptor');

module.exports = function () {
	'use strict';

	/**
  * A {@link ResponseInterceptor} that delegates work to two other instances.
  *
  * @public
  * @extends {ResponseInterceptor}
  * @param {ResponseInterceptor} a - The first interceptor to process.
  * @param {ResponseInterceptor} b - The second interceptor to process.
  */

	var CompositeResponseInterceptor = function (_ResponseInterceptor) {
		_inherits(CompositeResponseInterceptor, _ResponseInterceptor);

		function CompositeResponseInterceptor(a, b) {
			_classCallCheck(this, CompositeResponseInterceptor);

			var _this = _possibleConstructorReturn(this, (CompositeResponseInterceptor.__proto__ || Object.getPrototypeOf(CompositeResponseInterceptor)).call(this));

			assert.argumentIsRequired(a, 'a', ResponseInterceptor, 'ResponseInterceptor');
			assert.argumentIsRequired(b, 'b', ResponseInterceptor, 'ResponseInterceptor');

			_this._a = a;
			_this._b = b;
			return _this;
		}

		_createClass(CompositeResponseInterceptor, [{
			key: '_onProcess',
			value: function _onProcess(response) {
				var _this2 = this;

				return this._a.process(response).then(function (adjusted) {
					return _this2._b.process(adjusted);
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[CompositeResponseInterceptor]';
			}
		}]);

		return CompositeResponseInterceptor;
	}(ResponseInterceptor);

	return CompositeResponseInterceptor;
}();

},{"./ResponseInterceptor":17,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	/**
  * A processor that transforms a web service request before it is transmitted.
  *
  * @public
  * @interface
  */

	var RequestInterceptor = function () {
		function RequestInterceptor() {
			_classCallCheck(this, RequestInterceptor);
		}

		/**
   * Adjusts outgoing requests data before the request is transmitted.
   *
   * @public
   * @param {Object} request
   * @returns {Promise.<TResult>}
   */


		_createClass(RequestInterceptor, [{
			key: 'process',
			value: function process(request) {
				var _this = this;

				return Promise.resolve().then(function () {
					return _this._onProcess(request);
				});
			}
		}, {
			key: '_onProcess',
			value: function _onProcess(request, payload) {
				return request;
			}

			/**
    * A no-op request interceptor.
    *
    * @public
    * @static
    * @returns {RequestInterceptor}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[RequestInterceptor]';
			}
		}], [{
			key: 'fromDelegate',


			/**
    * Returns a new {@link RequestInterceptor} which delegates its work to another function.
    *
    * @public
    * @static
    * @param {Function} delegate
    * @returns {RequestInterceptor}
    */
			value: function fromDelegate(delegate) {
				return new DelegateRequestInterceptor(delegate);
			}
		}, {
			key: 'EMPTY',
			get: function get() {
				return requestInterceptorEmpty;
			}
		}]);

		return RequestInterceptor;
	}();

	var DelegateRequestInterceptor = function (_RequestInterceptor) {
		_inherits(DelegateRequestInterceptor, _RequestInterceptor);

		function DelegateRequestInterceptor(delegate) {
			_classCallCheck(this, DelegateRequestInterceptor);

			var _this2 = _possibleConstructorReturn(this, (DelegateRequestInterceptor.__proto__ || Object.getPrototypeOf(DelegateRequestInterceptor)).call(this));

			assert.argumentIsRequired(delegate, 'delegate', Function);

			_this2._delegate = delegate;
			return _this2;
		}

		_createClass(DelegateRequestInterceptor, [{
			key: '_onProcess',
			value: function _onProcess(request) {
				return this._delegate(request);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DelegateRequestInterceptor]';
			}
		}]);

		return DelegateRequestInterceptor;
	}(RequestInterceptor);

	var requestInterceptorEmpty = new RequestInterceptor();

	return RequestInterceptor;
}();

},{"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	/**
  * A processor that transforms web service response before passing
  * it on to the original requestor.
  *
  * @public
  * @interface
  */

	var ResponseInterceptor = function () {
		function ResponseInterceptor() {
			_classCallCheck(this, ResponseInterceptor);
		}

		/**
   * Adjusts incoming response data before the response is forwarded
   * back to the orginal caller.
   *
   * @public
   * @param {Object} request
   * @returns {Promise.<TResult>}
   */


		_createClass(ResponseInterceptor, [{
			key: 'process',
			value: function process(response) {
				var _this = this;

				return Promise.resolve().then(function () {
					return _this._onProcess(response);
				});
			}
		}, {
			key: '_onProcess',
			value: function _onProcess(response) {
				return response;
			}

			/**
    * A no-op request interceptor (which will return the raw response).
    *
    * @public
    * @static
    * @returns {ResponseInterceptor}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[ResponseInterceptor]';
			}
		}], [{
			key: 'fromDelegate',


			/**
    * Returns a new {@link ResponseInterceptor} which delegates its work to another function.
    *
    * @public
    * @static
    * @param {Function} delegate
    * @returns {ResponseInterceptor}
    */
			value: function fromDelegate(delegate) {
				return new DelegateResponseInterceptor(delegate);
			}
		}, {
			key: 'EMPTY',
			get: function get() {
				return responseInterceptorEmpty;
			}

			/**
    * A response interceptor returns only the data payload in the format
    * specified by the response's "content-type" header.
    *
    * @public
    * @static
    * @returns {ResponseInterceptor}
    */

		}, {
			key: 'DATA',
			get: function get() {
				return responseInterceptorData;
			}
		}]);

		return ResponseInterceptor;
	}();

	var DelegateResponseInterceptor = function (_ResponseInterceptor) {
		_inherits(DelegateResponseInterceptor, _ResponseInterceptor);

		function DelegateResponseInterceptor(delegate) {
			_classCallCheck(this, DelegateResponseInterceptor);

			var _this2 = _possibleConstructorReturn(this, (DelegateResponseInterceptor.__proto__ || Object.getPrototypeOf(DelegateResponseInterceptor)).call(this));

			assert.argumentIsRequired(delegate, 'delegate', Function);

			_this2._delegate = delegate;
			return _this2;
		}

		_createClass(DelegateResponseInterceptor, [{
			key: '_onProcess',
			value: function _onProcess(response) {
				return this._delegate(response);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DelegateResponseInterceptor]';
			}
		}]);

		return DelegateResponseInterceptor;
	}(ResponseInterceptor);

	var responseInterceptorEmpty = new ResponseInterceptor();

	var responseInterceptorData = new DelegateResponseInterceptor(function (response) {
		return response.data;
	});

	return ResponseInterceptor;
}();

},{"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * An object that has an end-of-life process.
  *
  * @public
  * @interface
  */

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this._disposed = false;
		}

		/**
   * Invokes end-of-life logic. Once this function has been
   * invoked, further interaction with the object is not
   * recommended.
   *
   * @public
   */


		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (this._disposed) {
					return;
				}

				this._disposed = true;

				this._onDispose();
			}

			/**
    * @protected
    * @abstract
    * @ignore
    */

		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}

			/**
    * Returns true if the {@link Disposable#dispose} function has been invoked.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsDisposed',
			value: function getIsDisposed() {
				return this._disposed || false;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Disposable]';
			}

			/**
    * Creates and returns a {@link Disposable} object with end-of-life logic
    * delegated to a function.
    *
    * @public
    * @param disposeAction {Function}
    * @returns {Disposable}
    */

		}], [{
			key: 'fromAction',
			value: function fromAction(disposeAction) {
				assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

				return new DisposableAction(disposeAction);
			}

			/**
    * Creates and returns a {@link Disposable} object whose end-of-life
    * logic does nothing.
    *
    * @public
    * @returns {Disposable}
    */

		}, {
			key: 'getEmpty',
			value: function getEmpty() {
				return Disposable.fromAction(function () {
					return;
				});
			}
		}]);

		return Disposable;
	}();

	var DisposableAction = function (_Disposable) {
		_inherits(DisposableAction, _Disposable);

		function DisposableAction(disposeAction) {
			_classCallCheck(this, DisposableAction);

			var _this = _possibleConstructorReturn(this, (DisposableAction.__proto__ || Object.getPrototypeOf(DisposableAction)).call(this, disposeAction));

			_this._disposeAction = disposeAction;
			return _this;
		}

		_createClass(DisposableAction, [{
			key: '_onDispose',
			value: function _onDispose() {
				this._disposeAction();
				this._disposeAction = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DisposableAction]';
			}
		}]);

		return DisposableAction;
	}(Disposable);

	return Disposable;
}();

},{"./assert":21}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var types = new Map();

	/**
  * An enumeration. Must be inherited. Do not instantiate directly.
  * Also, this class uses the ES6 Map, therefore a polyfill must
  * be supplied.
  *
  * @public
  * @interface
  * @param {String} code - The unique code of the enumeration item.
  * @param {String} description - A description of the enumeration item.
  */

	var Enum = function () {
		function Enum(code, description) {
			_classCallCheck(this, Enum);

			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);

			this._code = code;
			this._description = description;

			var c = this.constructor;

			if (!types.has(c)) {
				types.set(c, []);
			}

			var existing = Enum.fromCode(c, code);

			if (existing === null) {
				types.get(c).push(this);
			}
		}

		/**
   * The unique code.
   *
   * @returns {String}
   */


		_createClass(Enum, [{
			key: 'equals',


			/**
    * Returns true if the provided {@link Enum} argument is equal
    * to the instance.
    *
    * @param {Enum} other
    * @returns {boolean}
    */
			value: function equals(other) {
				return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.code;
			}

			/**
    * Looks up a enumeration item; given the enumeration type and the enumeration
    * item's value. If no matching item can be found, a null value is returned.
    *
    * @param {Function} type - The enumeration type.
    * @param {String} code - The enumeration item's code.
    * @returns {*|null}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Enum]';
			}
		}, {
			key: 'code',
			get: function get() {
				return this._code;
			}

			/**
    * The description.
    *
    * @returns {String}
    */

		}, {
			key: 'description',
			get: function get() {
				return this._description;
			}
		}], [{
			key: 'fromCode',
			value: function fromCode(type, code) {
				return Enum.getItems(type).find(function (x) {
					return x.code === code;
				}) || null;
			}

			/**
    * Returns all of the enumeration's items (given an enumeration type).
    *
    * @param {Function} type - The enumeration to list.
    * @returns {Array}
    */

		}, {
			key: 'getItems',
			value: function getItems(type) {
				return types.get(type) || [];
			}
		}]);

		return Enum;
	}();

	return Enum;
}();

},{"./assert":21}],20:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with arrays.
  *
  * @public
  * @module lang/array
  */

	return {
		/**
   * Returns the unique items from an array, where the unique
   * key is determined via a strict equality check.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		unique: function unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				return array.indexOf(item) === index;
			});
		},


		/**
   * Returns the unique items from an array, where the unique
   * key is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Array}
   */
		uniqueBy: function uniqueBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				var key = keySelector(item);

				return array.findIndex(function (candidate) {
					return key === keySelector(candidate);
				}) === index;
			});
		},


		/**
   * Splits array into groups and returns an object (where the properties have
   * arrays). Unlike the indexBy function, there can be many items
   * which share the same key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a key.
   * @returns {Object}
   */
		groupBy: function groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (groups, item) {
				var key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [];
				}

				groups[key].push(item);

				return groups;
			}, {});
		},


		/**
   * Splits array into groups and returns an array of arrays where the items of each
   * nested array share a common key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a key.
   * @returns {Array}
   */
		batchBy: function batchBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			var currentKey = null;
			var currentBatch = null;

			return a.reduce(function (batches, item) {
				var key = keySelector(item);

				if (currentBatch === null || currentKey !== key) {
					currentKey = key;

					currentBatch = [];
					batches.push(currentBatch);
				}

				currentBatch.push(item);

				return batches;
			}, []);
		},


		/**
   * Splits array into groups and returns an object (where the properties are items from the
   * original array). Unlike the groupBy, Only one item can have a given key
   * value.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Object}
   */
		indexBy: function indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (map, item) {
				var key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, {});
		},


		/**
   * Returns a new array containing all but the last item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropRight: function dropRight(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},


		/**
   * Returns the last item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		last: function last(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Returns a copy of an array, replacing any item that is itself an array
   * with the item's items.
   *
   * @static
   * @param {Array} a
   * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
   * @returns {Array}
   */
		flatten: function flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			var empty = [];

			var flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(function (x) {
				return is.array(x);
			})) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},


		/**
   * Breaks an array into smaller arrays, returning an array of arrays.
   *
   * @static
   * @param {Array} a
   * @param {Number} size - The maximum number of items per partition.
   * @param {Array<Array>}
   */
		partition: function partition(a, size) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(size, 'size', Number);

			var copy = a.slice(0);
			var partitions = [];

			while (copy.length !== 0) {
				partitions.push(copy.splice(0, size));
			}

			return partitions;
		},


		/**
   * Set difference operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		difference: function difference(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var exclude = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set symmetric difference operation (using strict equality). In
   * other words, this is the union of the differences between the
   * sets.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		differenceSymmetric: function differenceSymmetric(a, b) {
			return this.union(this.difference(a, b), this.difference(b, a));
		},


		/**
   * Set union operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		union: function union(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = a.slice();

			b.forEach(function (candidate) {
				var exclude = returnRef.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set intersection operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		intersection: function intersection(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var include = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (include) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		}
	};
}();

},{"./assert":21,"./is":23}],21:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ], at index [ ' + index.toString() + ' ] must be a [ ' + (typeDescription || 'unknown') + ' ]';
		} else {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ] must be a [ ' + (typeDescription || 'Object') + ' ]';
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error('The argument [ ' + (variableName || 'unspecified') + ' ] failed a validation check [ ' + (predicateDescription || 'No description available') + ' ]');
	}

	/**
  * Utilities checking arguments.
  *
  * @public
  * @module lang/assert
  */
	return {
		/**
   * Throws an error if an argument doesn't conform to the desired specification (as
   * determined by a type check).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},


		/**
   * A relaxed version of the "argumentIsRequired" function that will not throw if
   * the value is undefined or null.
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				var itemValidator = void 0;

				if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
					itemValidator = function itemValidator(value, index) {
						return value instanceof itemConstraint || itemConstraint(value, variableName + '[' + index + ']');
					};
				} else {
					itemValidator = function itemValidator(value, index) {
						return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
					};
				}

				variable.forEach(function (v, i) {
					itemValidator(v, i);
				});
			}
		},


		/**
   * Throws an error if an argument doesn't conform to the desired specification
   * (as determined by a predicate).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {Function=} predicate - A function used to validate the item (beyond type checking).
   * @param {Function=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
   */
		argumentIsValid: function argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		},
		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		}
	};
}();

},{"./is":23}],22:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	function getPropertyNameArray(propertyNames) {
		var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';

		var returnRef = void 0;

		if (is.array(propertyNames)) {
			returnRef = propertyNames;
		} else {
			returnRef = propertyNames.split(separator);
		}

		return returnRef;
	}

	function getPropertyTarget(target, propertyNameArray, create) {
		var returnRef = void 0;

		var propertyTarget = target;

		for (var i = 0; i < propertyNameArray.length - 1; i++) {
			var propertyName = propertyNameArray[i];

			if (propertyTarget.hasOwnProperty(propertyName) && !is.null(propertyTarget[propertyName]) && !is.undefined(propertyTarget[propertyName])) {
				propertyTarget = propertyTarget[propertyName];
			} else if (create) {
				propertyTarget = propertyTarget[propertyName] = {};
			} else {
				propertyTarget = null;

				break;
			}
		}

		return propertyTarget;
	}

	function last(array) {
		if (array.length !== 0) {
			return array[array.length - 1];
		} else {
			return null;
		}
	}

	/**
  * Utilities for reading and writing "complex" properties to
  * objects. For example, the property "name.first" reads the
  * "first" property on the "name" object of the target.
  *
  * @public
  * @module lang/attributes
  */
	return {
		/**
   * Checks to see if an attribute exists on the target object.
   *
   * @static
   * @param {Object} target - The object to check for existence of the property.
   * @param {String|Array<String>} propertyNames - The property to check -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   * @returns {boolean}
   */
		has: function has(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			return propertyTarget !== null && propertyTarget.hasOwnProperty(last(propertyNameArray));
		},


		/**
   * Returns a value from the target object. If the property doesn't exist; undefined
   * is returned.
   *
   * @static
   * @param {Object} target - The object to read from.
   * @param {String|Array<String>} propertyNames - The property to read -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   * @returns {*}
   */
		read: function read(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			var returnRef = void 0;

			if (propertyTarget) {
				var propertyName = last(propertyNameArray);

				returnRef = propertyTarget[propertyName];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Writes a value to the target object.
   *
   * @static
   * @param {Object} target - The object to write to.
   * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   */
		write: function write(target, propertyNames, value, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			propertyTarget[propertyName] = value;
		},


		/**
   * Erases a property from the target object.
   *
   * @static
   * @param {Object} target - The object to erase a property from.
   * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   */
		erase: function erase(target, propertyNames, separator) {
			if (!this.has(target, propertyNames)) {
				return;
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};
}();

},{"./assert":21,"./is":23}],23:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	'use strict';

	/**
  * Utilities for interrogating variables (e.g. checking data types).
  *
  * @public
  * @module lang/is
  */

	return {
		/**
   * Returns true, if the argument is a number. NaN will return false.
   *
   * @static
   * @public
   * @param candidate {*}
   * @returns {boolean}
   */
		number: function number(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate);
		},


		/**
   * Returns true, if the argument is NaN.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		nan: function nan(candidate) {
			return typeof candidate === 'number' && isNaN(candidate);
		},


		/**
   * Returns true, if the argument is a valid 32-bit integer.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		integer: function integer(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
		},


		/**
   * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
   * the check can fail above the value of Number.MAX_SAFE_INTEGER.
   *
   * @static
   * @public
   * @param {*) candidate
   * @returns {boolean}
   */
		large: function large(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
		},


		/**
   * Returns true, if the argument is a number that is positive.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		positive: function positive(candidate) {
			return this.number(candidate) && candidate > 0;
		},


		/**
   * Returns true, if the argument is a number that is negative.
   *
   * @static
   * @public
   * @param candidate
   * @returns {*|boolean}
   */
		negative: function negative(candidate) {
			return this.number(candidate) && candidate < 0;
		},


		/**
   * Returns true, if the argument is a string.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		string: function string(candidate) {
			return typeof candidate === 'string';
		},


		/**
   * Returns true, if the argument is a JavaScript Date instance.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		date: function date(candidate) {
			return candidate instanceof Date;
		},


		/**
   * Returns true, if the argument is a function.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		fn: function fn(candidate) {
			return typeof candidate === 'function';
		},


		/**
   * Returns true, if the argument is an array.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		array: function array(candidate) {
			return Array.isArray(candidate);
		},


		/**
   * Returns true, if the argument is a Boolean value.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		boolean: function boolean(candidate) {
			return typeof candidate === 'boolean';
		},


		/**
   * Returns true, if the argument is an object.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		object: function object(candidate) {
			return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
		},


		/**
   * Returns true, if the argument is a null value.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		null: function _null(candidate) {
			return candidate === null;
		},


		/**
   * Returns true, if the argument is an undefined value.
   *
   * @static
   * @public
   * @param candidate
   * @returns {boolean}
   */
		undefined: function (_undefined) {
			function undefined(_x) {
				return _undefined.apply(this, arguments);
			}

			undefined.toString = function () {
				return _undefined.toString();
			};

			return undefined;
		}(function (candidate) {
			return candidate === undefined;
		}),


		/**
   * Given two classes, determines if the "child" class extends
   * the "parent" class (without instantiation).
   *
   * @param {Function} parent
   * @param {Function} child
   * @returns {Boolean}
   */
		extension: function extension(parent, child) {
			return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
		}
	};
}();

},{}],24:[function(require,module,exports){
'use strict';

var array = require('./array'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with objects.
  *
  * @public
  * @module lang/object
  */

	var object = {
		/**
   * <p>Performs "deep" equality check on two objects.</p>
   *
   * <p>Array items are compared, object properties are compared, and
   * finally "primitive" values are checked using strict equality rules.</p>
   *
   * @static
   * @param {Object} a
   * @param {Object} b
   * @returns {Boolean}
   */
		equals: function equals(a, b) {
			var returnVal = void 0;

			if (a === b) {
				returnVal = true;
			} else if (is.array(a) && is.array(b)) {
				if (a.length === b.length) {
					returnVal = a.length === 0 || a.every(function (x, i) {
						return object.equals(x, b[i]);
					});
				} else {
					returnVal = false;
				}
			} else if (is.object(a) && is.object(b)) {
				var keysA = object.keys(a);
				var keysB = object.keys(b);

				returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every(function (key) {
					var valueA = a[key];
					var valueB = b[key];

					return object.equals(valueA, valueB);
				});
			} else {
				returnVal = false;
			}

			return returnVal;
		},


		/**
   * Performs a "deep" copy.
   *
   * @static
   * @param {Object} source - The object to copy.
   * @returns {Object}
   */
		clone: function clone(source) {
			var c = void 0;

			if (is.array(source)) {
				c = source.map(function (sourceItem) {
					return object.clone(sourceItem);
				});
			} else if (is.object(source)) {
				c = object.keys(source).reduce(function (accumulator, key) {
					accumulator[key] = object.clone(source[key]);

					return accumulator;
				}, {});
			} else {
				c = source;
			}

			return c;
		},


		/**
   * Creates a new object (or array) by performing a deep copy
   * of the properties from each object. If the same property
   * exists on both objects, the property value from the
   * second object ("b") is preferred.
   *
   * @static
   * @param {Object} a
   * @param {Object} b
   * @returns {Object}
   */
		merge: function merge(a, b) {
			var m = void 0;

			var mergeTarget = is.object(a) && !is.array(a);
			var mergeSource = is.object(b) && !is.array(b);

			if (mergeTarget && mergeSource) {
				var properties = array.unique(object.keys(a).concat(object.keys(b)));

				m = properties.reduce(function (accumulator, property) {
					accumulator[property] = object.merge(a[property], b[property]);

					return accumulator;
				}, {});
			} else if (is.undefined(b)) {
				m = object.clone(a);
			} else {
				m = object.clone(b);
			}

			return m;
		},


		/**
   * Given an object, returns an array of "own" properties.
   *
   * @static
   * @param {Object} target - The object to interrogate.
   * @returns {Array<string>}
   */
		keys: function keys(target) {
			var keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		}
	};

	return object;
}();

},{"./array":20,"./is":23}],25:[function(require,module,exports){
'use strict';

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with promises.
  *
  * @public
  * @module lang/promise
  */

	return {
		timeout: function timeout(promise, _timeout) {
			var _this = this;

			return Promise.resolve().then(function () {
				assert.argumentIsRequired(promise, 'promise', Promise, 'Promise');
				assert.argumentIsRequired(_timeout, 'timeout', Number);

				if (!(_timeout > 0)) {
					throw new Error('Promise timeout must be greater than zero.');
				}

				return _this.build(function (resolveCallback, rejectCallback) {
					var pending = true;

					var token = setTimeout(function () {
						if (pending) {
							pending = false;

							rejectCallback('Promise timed out after ' + _timeout + ' milliseconds');
						}
					}, _timeout);

					promise.then(function (result) {
						if (pending) {
							pending = false;
							clearTimeout(token);

							resolveCallback(result);
						}
					}).catch(function (error) {
						if (pending) {
							pending = false;
							clearTimeout(token);

							rejectCallback(error);
						}
					});
				});
			});
		},


		/**
   * A mapping function that works asynchronously. Given an array of items, each item through
   * a mapping function, which can return a promise. Then, this function returns a single promise
   * which is the result of each mapped promise.
   *
   * @param {Array} items - The items to map
   * @param {Function} mapper - The mapping function (e.g. given an item, return a promise).
   * @param {Number} concurrency - The maximum number of promises that are allowed to run at once.
   * @returns {Promise.<Array>}
   */
		map: function map(items, mapper, concurrency) {
			var _this2 = this;

			return Promise.resolve().then(function () {
				assert.argumentIsArray(items, 'items');
				assert.argumentIsRequired(mapper, 'mapper', Function);
				assert.argumentIsOptional(concurrency, 'concurrency', Number);

				var c = Math.max(0, concurrency || 0);

				var mapPromise = void 0;

				if (c === 0 || items.length === 0) {
					mapPromise = Promise.all(items.map(function (item) {
						return Promise.resolve(mapper(item));
					}));
				} else {
					var total = items.length;
					var active = 0;
					var complete = 0;
					var failure = false;

					var results = Array.of(total);

					var executors = items.map(function (item, index) {
						return function () {
							return Promise.resolve().then(function () {
								return mapper(item);
							}).then(function (result) {
								results[index] = result;
							});
						};
					});

					mapPromise = _this2.build(function (resolveCallback, rejectCallback) {
						var execute = function execute() {
							if (!(executors.length > 0 && c > active && !failure)) {
								return;
							}

							active = active + 1;

							var executor = executors.shift();

							executor().then(function () {
								if (failure) {
									return;
								}

								active = active - 1;
								complete = complete + 1;

								if (complete < total) {
									execute();
								} else {
									resolveCallback(results);
								}
							}).catch(function (error) {
								failure = false;

								rejectCallback(error);
							});

							execute();
						};

						execute();
					});
				}

				return mapPromise;
			});
		},


		/**
   * Runs a series of functions sequentially (where each function can be
   * synchronous or asynchronous). The result of each function is passed
   * to the successive function and the result of the final function is
   * returned to the consumer.
   *
   * @static
   * @public
   * @param {Function[]} functions - An array of functions, each expecting a single argument.
   * @param input - The argument to pass the first function.
   * @returns {Promise.<TResult>}
   */
		pipeline: function pipeline(functions, input) {
			return Promise.resolve().then(function () {
				assert.argumentIsArray(functions, 'functions', Function);

				return functions.reduce(function (previous, fn) {
					return previous.then(function (result) {
						return fn(result);
					});
				}, Promise.resolve(input));
			});
		},


		/**
   * Creates a new promise, given an executor.
   *
   * This is a wrapper for the {@link Promise} constructor; however, any error
   * is caught and the resulting promise is rejected (instead of letting the
   * error bubble up to the top-level handler).
   *
   * @static
   * @public
   * @param {Function} executor - A function which has two callback parameters. The first is used to resolve the promise, the second rejects it.
   * @returns {Promise}
   */
		build: function build(executor) {
			return new Promise(function (resolve, reject) {
				try {
					executor(resolve, reject);
				} catch (e) {
					reject(e);
				}
			});
		}
	};
}();

},{"./assert":21}],26:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable'),
    is = require('./../lang/is'),
    object = require('./../lang/object'),
    promise = require('./../lang/promise');

module.exports = function () {
	'use strict';

	/**
  * An object that wraps asynchronous delays (i.e. timeout and interval).
  *
  * @public
  * @extends {Disposable}
  */

	var Scheduler = function (_Disposable) {
		_inherits(Scheduler, _Disposable);

		function Scheduler() {
			_classCallCheck(this, Scheduler);

			var _this = _possibleConstructorReturn(this, (Scheduler.__proto__ || Object.getPrototypeOf(Scheduler)).call(this));

			_this._timeoutBindings = {};
			_this._intervalBindings = {};
			return _this;
		}

		/**
   * Schedules an action to execute in the future, returning a Promise.
   *
   * @public
   * @param {Function} actionToSchedule - The action to execute.
   * @param {number} millisecondDelay - Milliseconds before the action can be started.
   * @param {string=} actionDescription - A description of the action, used for logging purposes.
   * @returns {Promise}
   */


		_createClass(Scheduler, [{
			key: 'schedule',
			value: function schedule(actionToSchedule, millisecondDelay, actionDescription) {
				var _this2 = this;

				return Promise.resolve().then(function () {
					assert.argumentIsRequired(actionToSchedule, 'actionToSchedule', Function);
					assert.argumentIsRequired(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);

					if (_this2.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					var token = void 0;

					var schedulePromise = promise.build(function (resolveCallback, rejectCallback) {
						var wrappedAction = function wrappedAction() {
							delete _this2._timeoutBindings[token];

							try {
								resolveCallback(actionToSchedule());
							} catch (e) {
								rejectCallback(e);
							}
						};

						token = setTimeout(wrappedAction, millisecondDelay);
					});

					_this2._timeoutBindings[token] = Disposable.fromAction(function () {
						clearTimeout(token);

						delete _this2._timeoutBindings[token];
					});

					return schedulePromise;
				});
			}
		}, {
			key: 'repeat',
			value: function repeat(actionToRepeat, millisecondInterval, actionDescription) {
				var _this3 = this;

				assert.argumentIsRequired(actionToRepeat, 'actionToRepeat', Function);
				assert.argumentIsRequired(millisecondInterval, 'millisecondInterval', Number);
				assert.argumentIsOptional(actionDescription, 'actionDescription', String);

				if (this.getIsDisposed()) {
					throw new Error('The Scheduler has been disposed.');
				}

				var wrappedAction = function wrappedAction() {
					try {
						actionToRepeat();
					} catch (e) {}
				};

				var token = setInterval(wrappedAction, millisecondInterval);

				this._intervalBindings[token] = Disposable.fromAction(function () {
					clearInterval(token);

					delete _this3._intervalBindings[token];
				});

				return this._intervalBindings[token];
			}

			/**
    * Attempts an action, repeating if necessary, using an exponential backoff.
    *
    * @public
    * @param {Function} actionToBackoff - The action to attempt. If it fails -- because an error is thrown, a promise is rejected, or the function returns a falsey value -- the action will be invoked again.
    * @param {number=} millisecondDelay - The amount of time to wait to execute the action. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc. If not specified, the first attemopt will execute immediately, then a value of 1000 will be used.
    * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
    * @param {number=} maximumAttempts - The number of attempts to before giving up.
    * @param {Function=} failureCallback - If provided, will be invoked if a function is considered to be failing.
    * @param {Object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, a "falsey" value will trigger a retry.
    */

		}, {
			key: 'backoff',
			value: function backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue) {
				var _this4 = this;

				return Promise.resolve().then(function () {
					assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
					assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);
					assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);
					assert.argumentIsOptional(failureCallback, 'failureCallback', Function);

					if (_this4.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					var scheduleBackoff = function scheduleBackoff(failureCount, e) {
						if (failureCount > 0 && is.fn(failureCallback)) {
							failureCallback(failureCount);
						}

						if (maximumAttempts > 0 && failureCount > maximumAttempts) {
							var message = 'Maximum failures reached for ' + actionDescription;

							var rejection = void 0;

							if (e) {
								e.backoff = message;

								rejection = e;
							} else {
								rejection = message;
							}

							return Promise.reject(rejection);
						}

						var backoffDelay = void 0;

						if (failureCount === 0) {
							backoffDelay = millisecondDelay || 0;
						} else {
							backoffDelay = (millisecondDelay || 1000) * Math.pow(2, failureCount);
						}

						var successPredicate = void 0;

						if (is.undefined(failureValue)) {
							successPredicate = function successPredicate(value) {
								return value;
							};
						} else {
							successPredicate = function successPredicate(value) {
								return !object.equals(value, failureValue);
							};
						}

						return _this4.schedule(actionToBackoff, backoffDelay, (actionDescription || 'unspecified') + ', attempt ' + (failureCount + 1)).then(function (result) {
							if (successPredicate(result)) {
								return result;
							} else {
								return scheduleBackoff(++failureCount);
							}
						}).catch(function (e) {
							return scheduleBackoff(++failureCount, e);
						});
					};

					return scheduleBackoff(0);
				});
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				var _this5 = this;

				object.keys(this._timeoutBindings).forEach(function (key) {
					_this5._timeoutBindings[key].dispose();
				});

				object.keys(this._intervalBindings).forEach(function (key) {
					_this5._intervalBindings[key].dispose();
				});

				this._timeoutBindings = null;
				this._intervalBindings = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Scheduler]';
			}
		}], [{
			key: 'schedule',
			value: function schedule(actionToSchedule, millisecondDelay, actionDescription) {
				var scheduler = new Scheduler();

				scheduler.schedule(actionToSchedule, millisecondDelay, actionDescription).then(function (result) {
					scheduler.dispose();

					return result;
				}).catch(function (e) {
					scheduler.dispose();

					throw e;
				});
			}
		}]);

		return Scheduler;
	}(Disposable);

	return Scheduler;
}();

},{"./../lang/Disposable":18,"./../lang/assert":21,"./../lang/is":23,"./../lang/object":24,"./../lang/promise":25}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('@barchart/common-js/lang/assert'),
    Disposable = require('@barchart/common-js/lang/Disposable'),
    Enum = require('@barchart/common-js/lang/Enum'),
    is = require('@barchart/common-js/lang/is'),
    Scheduler = require('@barchart/common-js/timing/Scheduler');

var EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
    Gateway = require('@barchart/common-client-js/http/Gateway'),
    ProtocolType = require('@barchart/common-client-js/http/definitions/ProtocolType'),
    RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
    ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
    VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

module.exports = function () {
	'use strict';

	/**
  * Web service gateway for invoking the Watchlist API.
  *
  * @public
  * @extends {Disposable}
  */

	var JwtGateway = function (_Disposable) {
		_inherits(JwtGateway, _Disposable);

		function JwtGateway(endpoint) {
			_classCallCheck(this, JwtGateway);

			var _this = _possibleConstructorReturn(this, (JwtGateway.__proto__ || Object.getPrototypeOf(JwtGateway)).call(this));

			_this._started = false;
			_this._startPromise = null;

			_this._endpoint = endpoint;
			return _this;
		}

		/**
   * Initializes the connection to the remote server and returns a promise
   * containing the server's metadata.
   *
   * @public
   * @returns {Promise.<Boolean>}
   */


		_createClass(JwtGateway, [{
			key: 'start',
			value: function start() {
				var _this2 = this;

				return Promise.resolve().then(function () {
					if (_this2._startPromise === null) {
						_this2._startPromise = Promise.resolve().then(function () {
							_this2._started = true;

							return _this2._started;
						});
					}

					return _this2._startPromise;
				});
			}

			/**
    * Retrieves a JWT token from the remote server.
    *
    * @public
    * @returns {Promise.<String>}
    */

		}, {
			key: 'readToken',
			value: function readToken() {
				var _this3 = this;

				return Promise.resolve().then(function () {
					checkStart.call(_this3);

					return Gateway.invoke(_this3._endpoint);
				});
			}

			/**
    * Returns a {@link RequestInterceptor} suitable for use with other API calls.
    *
    * @public
    * @param {Number=} refreshInterval - Interval, in milliseconds, for refreshing cached token. If zero, no caching is used.
    * @returns {RequestInterceptor}
    */

		}, {
			key: 'toRequestInterceptor',
			value: function toRequestInterceptor(refreshInterval) {
				var _this4 = this;

				assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

				var scheduler = new Scheduler();

				var refreshToken = function refreshToken() {
					return scheduler.backoff(function () {
						return _this4.readToken();
					}, 100, 'Read JWT token', 3);
				};

				var cachePromise = null;

				if (refreshInterval > 0) {
					cachePromise = refreshToken();

					scheduler.repeat(function () {
						return cachePromise = refreshToken();
					});
				}

				var delegate = function delegate(options) {
					var tokenPromise = void 0;

					if (cachePromise !== null) {
						tokenPromise = cachePromise;
					} else {
						tokenPromise = refreshToken();
					}

					return tokenPromise.then(function (token) {
						options.headers = options.headers || {};
						options.headers.Authorization = 'Bearer ' + token;

						return options;
					});
				};

				return RequestInterceptor.fromDelegate(delegate);
			}

			/**
    * Creates and starts a new {@link JwtGateway} for use in the development environment.
    *
    * @public
    * @static
    * @param {String} host
    * @param {String} userId
    * @returns {Promise.<JwtGateway>}
    */

		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[JwtGateway]';
			}
		}], [{
			key: 'forDevelopment',
			value: function forDevelopment(host, userId) {
				return start(new JwtGateway(_forDevelopment(host, userId)));
			}

			/**
    * Creates and starts a new {@link JwtGateway} for use in the staging environment.
    *
    * @public
    * @static
    * @returns {Promise.<JwtGateway>}
    */

		}, {
			key: 'forStaging',
			value: function forStaging() {
				return start(new JwtGateway(_forProduction('gamservices.stg2.theglobeandmail.com/usermanagement/public/v3/user/sso')));
			}

			/**
    * Creates and starts a new {@link JwtGateway} for use in the production environment.
    *
    * @public
    * @static
    * @returns {Promise.<JwtGateway>}
    */

		}, {
			key: 'forProduction',
			value: function forProduction() {
				return start(new JwtGateway(_forProduction('gamservices.stg2.theglobeandmail.com/usermanagement/public/v3/user/sso')));
			}
		}]);

		return JwtGateway;
	}(Disposable);

	function start(gateway) {
		return gateway.start().then(function () {
			return gateway;
		});
	}

	function checkStart() {
		if (this.getIsDisposed()) {
			throw new Error('Unable to use gateway, the gateway has been disposed.');
		}

		if (!this._started) {
			throw new Error('Unable to use gateway, the gateway has not started.');
		}
	}

	function _forDevelopment(host, userId) {
		return EndpointBuilder.for('read-jwt-token-for-development').withVerb(VerbType.GET).withProtocol(ProtocolType.HTTPS).withHost(host).withPathBuilder(function (pb) {
			return pb.withLiteralParameter('v1').withLiteralParameter('token');
		}).withQueryBuilder(function (qb) {
			return qb.withLiteralParameter('userId', userId);
		}).withResponseInterceptor(ResponseInterceptor.DATA).endpoint;
	}

	function _forProduction(host) {
		return EndpointBuilder.for('read-jwt-token-for-production').withVerb(VerbType.GET).withProtocol(ProtocolType.HTTPS).withHeadersBuilder(function (hb) {
			return hb.withLiteralParameter('X-GAM-CLIENT-APP-ID', '1348').withLiteralParameter('X-GAM-CLIENT-APP-SECRET', '1bcc5c85-e833-4936-9313-abe5dfdcef76');
		}).withHost(host).withResponseInterceptor(ResponseInterceptor.DATA).endpoint;
	}

	return JwtGateway;
}();

},{"@barchart/common-client-js/http/Gateway":4,"@barchart/common-client-js/http/builders/EndpointBuilder":5,"@barchart/common-client-js/http/definitions/ProtocolType":12,"@barchart/common-client-js/http/definitions/VerbType":13,"@barchart/common-client-js/http/interceptors/RequestInterceptor":16,"@barchart/common-client-js/http/interceptors/ResponseInterceptor":17,"@barchart/common-js/lang/Disposable":18,"@barchart/common-js/lang/Enum":19,"@barchart/common-js/lang/assert":21,"@barchart/common-js/lang/is":23,"@barchart/common-js/timing/Scheduler":26}],28:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":30}],29:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

}).call(this,require('_process'))
},{"../core/createError":36,"./../core/settle":39,"./../helpers/btoa":43,"./../helpers/buildURL":44,"./../helpers/cookies":46,"./../helpers/isURLSameOrigin":48,"./../helpers/parseHeaders":50,"./../utils":52,"_process":53}],30:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":31,"./cancel/CancelToken":32,"./cancel/isCancel":33,"./core/Axios":34,"./defaults":41,"./helpers/bind":42,"./helpers/spread":51,"./utils":52}],31:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],32:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":31}],33:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],34:[function(require,module,exports){
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":41,"./../utils":52,"./InterceptorManager":35,"./dispatchRequest":37}],35:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":52}],36:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":38}],37:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":33,"../defaults":41,"./../helpers/combineURLs":45,"./../helpers/isAbsoluteURL":47,"./../utils":52,"./transformData":40}],38:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],39:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":36}],40:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":52}],41:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":29,"./adapters/xhr":29,"./helpers/normalizeHeaderName":49,"./utils":52,"_process":53}],42:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],43:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],44:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":52}],45:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],46:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":52}],47:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],48:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":52}],49:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":52}],50:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":52}],51:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],52:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":42,"is-buffer":54}],53:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],54:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}]},{},[1,3])(3)
});