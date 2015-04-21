(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/keith/Work/Flux/fluxor/node_modules/flightjs/build/flight.js":[function(require,module,exports){
/*! Flight v1.5.0 | (c) Twitter, Inc. | MIT License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["flight"] = factory();
	else
		root["flight"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(1),
    __webpack_require__(2),
    __webpack_require__(3),
    __webpack_require__(4),
    __webpack_require__(5),
    __webpack_require__(6),
    __webpack_require__(7)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(advice, component, compose, debug, logger, registry, utils) {
    'use strict';

    return {
      advice: advice,
      component: component,
      compose: compose,
      debug: debug,
      logger: logger,
      registry: registry,
      utils: utils
    };

  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(utils) {
    'use strict';

    var advice = {

      around: function(base, wrapped) {
        return function composedAround() {
          // unpacking arguments by hand benchmarked faster
          var i = 0, l = arguments.length, args = new Array(l + 1);
          args[0] = base.bind(this);
          for (; i < l; i++) {
            args[i + 1] = arguments[i];
          }
          return wrapped.apply(this, args);
        };
      },

      before: function(base, before) {
        var beforeFn = (typeof before == 'function') ? before : before.obj[before.fnName];
        return function composedBefore() {
          beforeFn.apply(this, arguments);
          return base.apply(this, arguments);
        };
      },

      after: function(base, after) {
        var afterFn = (typeof after == 'function') ? after : after.obj[after.fnName];
        return function composedAfter() {
          var res = (base.unbound || base).apply(this, arguments);
          afterFn.apply(this, arguments);
          return res;
        };
      },

      // a mixin that allows other mixins to augment existing functions by adding additional
      // code before, after or around.
      withAdvice: function() {
        ['before', 'after', 'around'].forEach(function(m) {
          this[m] = function(method, fn) {
            var methods = method.trim().split(' ');

            methods.forEach(function(i) {
              utils.mutateProperty(this, i, function() {
                if (typeof this[i] == 'function') {
                  this[i] = advice[m](this[i], fn);
                } else {
                  this[i] = fn;
                }

                return this[i];
              });
            }, this);
          };
        }, this);
      }
    };

    return advice;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(1),
    __webpack_require__(7),
    __webpack_require__(3),
    __webpack_require__(8),
    __webpack_require__(6),
    __webpack_require__(5),
    __webpack_require__(4)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(advice, utils, compose, withBase, registry, withLogging, debug) {
    'use strict';

    var functionNameRegEx = /function (.*?)\s?\(/;
    var ignoredMixin = {
      withBase: true,
      withLogging: true
    };

    // teardown for all instances of this constructor
    function teardownAll() {
      var componentInfo = registry.findComponentInfo(this);

      componentInfo && Object.keys(componentInfo.instances).forEach(function(k) {
        var info = componentInfo.instances[k];
        // It's possible that a previous teardown caused another component to teardown,
        // so we can't assume that the instances object is as it was.
        if (info && info.instance) {
          info.instance.teardown();
        }
      });
    }

    function attachTo(selector/*, options args */) {
      // unpacking arguments by hand benchmarked faster
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) {
        args[i - 1] = arguments[i];
      }

      if (!selector) {
        throw new Error('Component needs to be attachTo\'d a jQuery object, native node or selector string');
      }

      var options = utils.merge.apply(utils, args);
      var componentInfo = registry.findComponentInfo(this);

      $(selector).each(function(i, node) {
        if (componentInfo && componentInfo.isAttachedTo(node)) {
          // already attached
          return;
        }

        (new this).initialize(node, options);
      }.bind(this));
    }

    function prettyPrintMixins() {
      //could be called from constructor or constructor.prototype
      var mixedIn = this.mixedIn || this.prototype.mixedIn || [];
      return mixedIn.map(function(mixin) {
        if (mixin.name == null) {
          // function name property not supported by this browser, use regex
          var m = mixin.toString().match(functionNameRegEx);
          return (m && m[1]) ? m[1] : '';
        }
        return (!ignoredMixin[mixin.name] ? mixin.name : '');
      }).filter(Boolean).join(', ');
    };


    // define the constructor for a custom component type
    // takes an unlimited number of mixin functions as arguments
    // typical api call with 3 mixins: define(timeline, withTweetCapability, withScrollCapability);
    function define(/*mixins*/) {
      // unpacking arguments by hand benchmarked faster
      var l = arguments.length;
      var mixins = new Array(l);
      for (var i = 0; i < l; i++) {
        mixins[i] = arguments[i];
      }

      var Component = function() {};

      Component.toString = Component.prototype.toString = prettyPrintMixins;
      if (debug.enabled) {
        Component.describe = Component.prototype.describe = Component.toString();
      }

      // 'options' is optional hash to be merged with 'defaults' in the component definition
      Component.attachTo = attachTo;
      // enables extension of existing "base" Components
      Component.mixin = function() {
        var newComponent = define(); //TODO: fix pretty print
        var newPrototype = Object.create(Component.prototype);
        newPrototype.mixedIn = [].concat(Component.prototype.mixedIn);
        newPrototype.defaults = utils.merge(Component.prototype.defaults);
        newPrototype.attrDef = Component.prototype.attrDef;
        compose.mixin(newPrototype, arguments);
        newComponent.prototype = newPrototype;
        newComponent.prototype.constructor = newComponent;
        return newComponent;
      };
      Component.teardownAll = teardownAll;

      // prepend common mixins to supplied list, then mixin all flavors
      if (debug.enabled) {
        mixins.unshift(withLogging);
      }
      mixins.unshift(withBase, advice.withAdvice, registry.withRegistration);
      compose.mixin(Component.prototype, mixins);

      return Component;
    }

    define.teardownAll = function() {
      registry.components.slice().forEach(function(c) {
        c.component.teardownAll();
      });
      registry.reset();
    };

    return define;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(utils) {
    'use strict';

    var dontLock = ['mixedIn', 'attrDef'];

    function setWritability(obj, writable) {
      Object.keys(obj).forEach(function (key) {
        if (dontLock.indexOf(key) < 0) {
          utils.propertyWritability(obj, key, writable);
        }
      });
    }

    function mixin(base, mixins) {
      base.mixedIn = Object.prototype.hasOwnProperty.call(base, 'mixedIn') ? base.mixedIn : [];

      for (var i = 0; i < mixins.length; i++) {
        if (base.mixedIn.indexOf(mixins[i]) == -1) {
          setWritability(base, false);
          mixins[i].call(base);
          base.mixedIn.push(mixins[i]);
        }
      }

      setWritability(base, true);
    }

    return {
      mixin: mixin
    };

  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function(registry) {
    'use strict';

    // ==========================================
    // Search object model
    // ==========================================

    function traverse(util, searchTerm, options) {
      options = options || {};
      var obj = options.obj || window;
      var path = options.path || ((obj == window) ? 'window' : '');
      var props = Object.keys(obj);
      props.forEach(function(prop) {
        if ((tests[util] || util)(searchTerm, obj, prop)) {
          console.log([path, '.', prop].join(''), '->', ['(', typeof obj[prop], ')'].join(''), obj[prop]);
        }
        if (Object.prototype.toString.call(obj[prop]) == '[object Object]' && (obj[prop] != obj) && path.split('.').indexOf(prop) == -1) {
          traverse(util, searchTerm, {obj: obj[prop], path: [path,prop].join('.')});
        }
      });
    }

    function search(util, expected, searchTerm, options) {
      if (!expected || typeof searchTerm == expected) {
        traverse(util, searchTerm, options);
      } else {
        console.error([searchTerm, 'must be', expected].join(' '));
      }
    }

    var tests = {
      'name': function(searchTerm, obj, prop) {return searchTerm == prop;},
      'nameContains': function(searchTerm, obj, prop) {return prop.indexOf(searchTerm) > -1;},
      'type': function(searchTerm, obj, prop) {return obj[prop] instanceof searchTerm;},
      'value': function(searchTerm, obj, prop) {return obj[prop] === searchTerm;},
      'valueCoerced': function(searchTerm, obj, prop) {return obj[prop] == searchTerm;}
    };

    function byName(searchTerm, options) {search('name', 'string', searchTerm, options);}
    function byNameContains(searchTerm, options) {search('nameContains', 'string', searchTerm, options);}
    function byType(searchTerm, options) {search('type', 'function', searchTerm, options);}
    function byValue(searchTerm, options) {search('value', null, searchTerm, options);}
    function byValueCoerced(searchTerm, options) {search('valueCoerced', null, searchTerm, options);}
    function custom(fn, options) {traverse(fn, null, options);}

    // ==========================================
    // Event logging
    // ==========================================

    var ALL = 'all'; //no filter

    //log nothing by default
    var logFilter = {
      eventNames: [],
      actions: []
    }

    function filterEventLogsByAction(/*actions*/) {
      var actions = [].slice.call(arguments);

      logFilter.eventNames.length || (logFilter.eventNames = ALL);
      logFilter.actions = actions.length ? actions : ALL;
      saveLogFilter();
    }

    function filterEventLogsByName(/*eventNames*/) {
      var eventNames = [].slice.call(arguments);

      logFilter.actions.length || (logFilter.actions = ALL);
      logFilter.eventNames = eventNames.length ? eventNames : ALL;
      saveLogFilter();
    }

    function hideAllEventLogs() {
      logFilter.actions = [];
      logFilter.eventNames = [];
      saveLogFilter();
    }

    function showAllEventLogs() {
      logFilter.actions = ALL;
      logFilter.eventNames = ALL;
      saveLogFilter();
    }

    function saveLogFilter() {
      try {
        if (window.localStorage) {
          localStorage.setItem('logFilter_eventNames', logFilter.eventNames);
          localStorage.setItem('logFilter_actions', logFilter.actions);
        }
      } catch (ignored) {};
    }

    function retrieveLogFilter() {
      var eventNames, actions;
      try {
        eventNames = (window.localStorage && localStorage.getItem('logFilter_eventNames'));
        actions = (window.localStorage && localStorage.getItem('logFilter_actions'));
      } catch (ignored) {
        return;
      }
      eventNames && (logFilter.eventNames = eventNames);
      actions && (logFilter.actions = actions);

      // reconstitute arrays in place
      Object.keys(logFilter).forEach(function(k) {
        var thisProp = logFilter[k];
        if (typeof thisProp == 'string' && thisProp !== ALL) {
          logFilter[k] = thisProp ? thisProp.split(',') : [];
        }
      });
    }

    return {

      enable: function(enable) {
        this.enabled = !!enable;

        if (enable && window.console) {
          console.info('Booting in DEBUG mode');
          console.info('You can configure event logging with DEBUG.events.logAll()/logNone()/logByName()/logByAction()');
        }

        retrieveLogFilter();

        window.DEBUG = this;
      },

      warn: function (message) {
        if (!window.console) { return; }
        var fn = (console.warn || console.log);
        fn.call(console, this.toString() + ': ' + message);
      },

      registry: registry,

      find: {
        byName: byName,
        byNameContains: byNameContains,
        byType: byType,
        byValue: byValue,
        byValueCoerced: byValueCoerced,
        custom: custom
      },

      events: {
        logFilter: logFilter,

        // Accepts any number of action args
        // e.g. DEBUG.events.logByAction("on", "off")
        logByAction: filterEventLogsByAction,

        // Accepts any number of event name args (inc. regex or wildcards)
        // e.g. DEBUG.events.logByName(/ui.*/, "*Thread*");
        logByName: filterEventLogsByName,

        logAll: showAllEventLogs,
        logNone: hideAllEventLogs
      }
    };
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(utils) {
    'use strict';

    var actionSymbols = {
      on: '<-',
      trigger: '->',
      off: 'x '
    };

    function elemToString(elem) {
      var tagStr = elem.tagName ? elem.tagName.toLowerCase() : elem.toString();
      var classStr = elem.className ? '.' + (elem.className) : '';
      var result = tagStr + classStr;
      return elem.tagName ? ['\'', '\''].join(result) : result;
    }

    function log(action, component, eventArgs) {
      if (!window.DEBUG || !window.DEBUG.enabled) {
        return;
      }
      var name, eventType, elem, fn, payload, logFilter, toRegExp, actionLoggable, nameLoggable, info;

      if (typeof eventArgs[eventArgs.length - 1] == 'function') {
        fn = eventArgs.pop();
        fn = fn.unbound || fn; // use unbound version if any (better info)
      }

      if (eventArgs.length == 1) {
        elem = component.$node[0];
        eventType = eventArgs[0];
      } else if ((eventArgs.length == 2) && typeof eventArgs[1] == 'object' && !eventArgs[1].type) {
        //2 args, first arg is not elem
        elem = component.$node[0];
        eventType = eventArgs[0];
        if (action == "trigger") {
          payload = eventArgs[1];
        }
      } else {
        //2+ args, first arg is elem
        elem = eventArgs[0];
        eventType = eventArgs[1];
        if (action == "trigger") {
          payload = eventArgs[2];
        }
      }

      name = typeof eventType == 'object' ? eventType.type : eventType;

      logFilter = DEBUG.events.logFilter;

      // no regex for you, actions...
      actionLoggable = logFilter.actions == 'all' || (logFilter.actions.indexOf(action) > -1);
      // event name filter allow wildcards or regex...
      toRegExp = function(expr) {
        return expr.test ? expr : new RegExp('^' + expr.replace(/\*/g, '.*') + '$');
      };
      nameLoggable =
        logFilter.eventNames == 'all' ||
        logFilter.eventNames.some(function(e) {return toRegExp(e).test(name);});

      if (actionLoggable && nameLoggable) {
        info = [actionSymbols[action], action, '[' + name + ']'];
        payload && info.push(payload);
        info.push(elemToString(elem));
        info.push(component.constructor.describe.split(' ').slice(0,3).join(' '));
        console.groupCollapsed && action == 'trigger' && console.groupCollapsed(action, name);
        // IE9 doesn't define `apply` for console methods, but this works everywhere:
        Function.prototype.apply.call(console.info, console, info);
      }
    }

    function withLogging() {
      this.before('trigger', function() {
        log('trigger', this, utils.toArray(arguments));
      });
      if (console.groupCollapsed) {
        this.after('trigger', function() {
          console.groupEnd();
        });
      }
      this.before('on', function() {
        log('on', this, utils.toArray(arguments));
      });
      this.before('off', function() {
        log('off', this, utils.toArray(arguments));
      });
    }

    return withLogging;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
    'use strict';

    function parseEventArgs(instance, args) {
      var element, type, callback;
      var end = args.length;

      if (typeof args[end - 1] == 'function') {
        end -= 1;
        callback = args[end];
      }

      if (typeof args[end - 1] == 'object') {
        end -= 1;
      }

      if (end == 2) {
        element = args[0];
        type = args[1];
      } else {
        element = instance.node;
        type = args[0];
      }

      return {
        element: element,
        type: type,
        callback: callback
      };
    }

    function matchEvent(a, b) {
      return (
        (a.element == b.element) &&
        (a.type == b.type) &&
        (b.callback == null || (a.callback == b.callback))
      );
    }

    function Registry() {

      var registry = this;

      (this.reset = function() {
        this.components = [];
        this.allInstances = {};
        this.events = [];
      }).call(this);

      function ComponentInfo(component) {
        this.component = component;
        this.attachedTo = [];
        this.instances = {};

        this.addInstance = function(instance) {
          var instanceInfo = new InstanceInfo(instance);
          this.instances[instance.identity] = instanceInfo;
          this.attachedTo.push(instance.node);

          return instanceInfo;
        };

        this.removeInstance = function(instance) {
          delete this.instances[instance.identity];
          var indexOfNode = this.attachedTo.indexOf(instance.node);
          (indexOfNode > -1) && this.attachedTo.splice(indexOfNode, 1);

          if (!Object.keys(this.instances).length) {
            //if I hold no more instances remove me from registry
            registry.removeComponentInfo(this);
          }
        };

        this.isAttachedTo = function(node) {
          return this.attachedTo.indexOf(node) > -1;
        };
      }

      function InstanceInfo(instance) {
        this.instance = instance;
        this.events = [];

        this.addBind = function(event) {
          this.events.push(event);
          registry.events.push(event);
        };

        this.removeBind = function(event) {
          for (var i = 0, e; e = this.events[i]; i++) {
            if (matchEvent(e, event)) {
              this.events.splice(i, 1);
            }
          }
        };
      }

      this.addInstance = function(instance) {
        var component = this.findComponentInfo(instance);

        if (!component) {
          component = new ComponentInfo(instance.constructor);
          this.components.push(component);
        }

        var inst = component.addInstance(instance);

        this.allInstances[instance.identity] = inst;

        return component;
      };

      this.removeInstance = function(instance) {
        //remove from component info
        var componentInfo = this.findComponentInfo(instance);
        componentInfo && componentInfo.removeInstance(instance);

        //remove from registry
        delete this.allInstances[instance.identity];
      };

      this.removeComponentInfo = function(componentInfo) {
        var index = this.components.indexOf(componentInfo);
        (index > -1) && this.components.splice(index, 1);
      };

      this.findComponentInfo = function(which) {
        var component = which.attachTo ? which : which.constructor;

        for (var i = 0, c; c = this.components[i]; i++) {
          if (c.component === component) {
            return c;
          }
        }

        return null;
      };

      this.findInstanceInfo = function(instance) {
        return this.allInstances[instance.identity] || null;
      };

      this.getBoundEventNames = function(instance) {
        return this.findInstanceInfo(instance).events.map(function(ev) {
          return ev.type;
        });
      };

      this.findInstanceInfoByNode = function(node) {
        var result = [];
        Object.keys(this.allInstances).forEach(function(k) {
          var thisInstanceInfo = this.allInstances[k];
          if (thisInstanceInfo.instance.node === node) {
            result.push(thisInstanceInfo);
          }
        }, this);
        return result;
      };

      this.on = function(componentOn) {
        var instance = registry.findInstanceInfo(this), boundCallback;

        // unpacking arguments by hand benchmarked faster
        var l = arguments.length, i = 1;
        var otherArgs = new Array(l - 1);
        for (; i < l; i++) {
          otherArgs[i - 1] = arguments[i];
        }

        if (instance) {
          boundCallback = componentOn.apply(null, otherArgs);
          if (boundCallback) {
            otherArgs[otherArgs.length - 1] = boundCallback;
          }
          var event = parseEventArgs(this, otherArgs);
          instance.addBind(event);
        }
      };

      this.off = function(/*el, type, callback*/) {
        var event = parseEventArgs(this, arguments),
            instance = registry.findInstanceInfo(this);

        if (instance) {
          instance.removeBind(event);
        }

        //remove from global event registry
        for (var i = 0, e; e = registry.events[i]; i++) {
          if (matchEvent(e, event)) {
            registry.events.splice(i, 1);
          }
        }
      };

      // debug tools may want to add advice to trigger
      registry.trigger = function() {};

      this.teardown = function() {
        registry.removeInstance(this);
      };

      this.withRegistration = function() {
        this.after('initialize', function() {
          registry.addInstance(this);
        });

        this.around('on', registry.on);
        this.after('off', registry.off);
        //debug tools may want to add advice to trigger
        window.DEBUG && (false).enabled && this.after('trigger', registry.trigger);
        this.after('teardown', {obj: registry, fnName: 'teardown'});
      };

    }

    return new Registry;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function(debug) {
    'use strict';

    var DEFAULT_INTERVAL = 100;

    function canWriteProtect() {
      var writeProtectSupported = debug.enabled && !Object.propertyIsEnumerable('getOwnPropertyDescriptor');
      if (writeProtectSupported) {
        //IE8 getOwnPropertyDescriptor is built-in but throws exeption on non DOM objects
        try {
          Object.getOwnPropertyDescriptor(Object, 'keys');
        } catch (e) {
         return false;
        }
      }

      return writeProtectSupported;
    }

    var utils = {

      isDomObj: function(obj) {
        return !!(obj.nodeType || (obj === window));
      },

      toArray: function(obj, from) {
        from = from || 0;
        var len = obj.length, arr = new Array(len - from);
        for (var i = from; i < len; i++) {
          arr[i - from] = obj[i];
        }
        return arr;
      },

      // returns new object representing multiple objects merged together
      // optional final argument is boolean which specifies if merge is recursive
      // original objects are unmodified
      //
      // usage:
      //   var base = {a:2, b:6};
      //   var extra = {b:3, c:4};
      //   merge(base, extra); //{a:2, b:3, c:4}
      //   base; //{a:2, b:6}
      //
      //   var base = {a:2, b:6};
      //   var extra = {b:3, c:4};
      //   var extraExtra = {a:4, d:9};
      //   merge(base, extra, extraExtra); //{a:4, b:3, c:4. d: 9}
      //   base; //{a:2, b:6}
      //
      //   var base = {a:2, b:{bb:4, cc:5}};
      //   var extra = {a:4, b:{cc:7, dd:1}};
      //   merge(base, extra, true); //{a:4, b:{bb:4, cc:7, dd:1}}
      //   base; //{a:2, b:{bb:4, cc:5}};

      merge: function(/*obj1, obj2,....deepCopy*/) {
        // unpacking arguments by hand benchmarked faster
        var l = arguments.length,
            args = new Array(l + 1);

        if (l === 0) {
          return {};
        }

        for (var i = 0; i < l; i++) {
          args[i + 1] = arguments[i];
        }

        //start with empty object so a copy is created
        args[0] = {};

        if (args[args.length - 1] === true) {
          //jquery extend requires deep copy as first arg
          args.pop();
          args.unshift(true);
        }

        return $.extend.apply(undefined, args);
      },

      // updates base in place by copying properties of extra to it
      // optionally clobber protected
      // usage:
      //   var base = {a:2, b:6};
      //   var extra = {c:4};
      //   push(base, extra); //{a:2, b:6, c:4}
      //   base; //{a:2, b:6, c:4}
      //
      //   var base = {a:2, b:6};
      //   var extra = {b: 4 c:4};
      //   push(base, extra, true); //Error ("utils.push attempted to overwrite 'b' while running in protected mode")
      //   base; //{a:2, b:6}
      //
      // objects with the same key will merge recursively when protect is false
      // eg:
      // var base = {a:16, b:{bb:4, cc:10}};
      // var extra = {b:{cc:25, dd:19}, c:5};
      // push(base, extra); //{a:16, {bb:4, cc:25, dd:19}, c:5}
      //
      push: function(base, extra, protect) {
        if (base) {
          Object.keys(extra || {}).forEach(function(key) {
            if (base[key] && protect) {
              throw new Error('utils.push attempted to overwrite "' + key + '" while running in protected mode');
            }

            if (typeof base[key] == 'object' && typeof extra[key] == 'object') {
              // recurse
              this.push(base[key], extra[key]);
            } else {
              // no protect, so extra wins
              base[key] = extra[key];
            }
          }, this);
        }

        return base;
      },

      // If obj.key points to an enumerable property, return its value
      // If obj.key points to a non-enumerable property, return undefined
      getEnumerableProperty: function(obj, key) {
        return obj.propertyIsEnumerable(key) ? obj[key] : undefined;
      },

      // build a function from other function(s)
      // utils.compose(a,b,c) -> a(b(c()));
      // implementation lifted from underscore.js (c) 2009-2012 Jeremy Ashkenas
      compose: function() {
        var funcs = arguments;

        return function() {
          var args = arguments;

          for (var i = funcs.length - 1; i >= 0; i--) {
            args = [funcs[i].apply(this, args)];
          }

          return args[0];
        };
      },

      // Can only unique arrays of homogeneous primitives, e.g. an array of only strings, an array of only booleans, or an array of only numerics
      uniqueArray: function(array) {
        var u = {}, a = [];

        for (var i = 0, l = array.length; i < l; ++i) {
          if (u.hasOwnProperty(array[i])) {
            continue;
          }

          a.push(array[i]);
          u[array[i]] = 1;
        }

        return a;
      },

      debounce: function(func, wait, immediate) {
        if (typeof wait != 'number') {
          wait = DEFAULT_INTERVAL;
        }

        var timeout, result;

        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          var callNow = immediate && !timeout;

          timeout && clearTimeout(timeout);
          timeout = setTimeout(later, wait);

          if (callNow) {
            result = func.apply(context, args);
          }

          return result;
        };
      },

      throttle: function(func, wait) {
        if (typeof wait != 'number') {
          wait = DEFAULT_INTERVAL;
        }

        var context, args, timeout, throttling, more, result;
        var whenDone = this.debounce(function() {
          more = throttling = false;
        }, wait);

        return function() {
          context = this; args = arguments;
          var later = function() {
            timeout = null;
            if (more) {
              result = func.apply(context, args);
            }
            whenDone();
          };

          if (!timeout) {
            timeout = setTimeout(later, wait);
          }

          if (throttling) {
            more = true;
          } else {
            throttling = true;
            result = func.apply(context, args);
          }

          whenDone();
          return result;
        };
      },

      countThen: function(num, base) {
        return function() {
          if (!--num) { return base.apply(this, arguments); }
        };
      },

      delegate: function(rules) {
        return function(e, data) {
          var target = $(e.target), parent;

          Object.keys(rules).forEach(function(selector) {
            if (!e.isPropagationStopped() && (parent = target.closest(selector)).length) {
              data = data || {};
              e.currentTarget = data.el = parent[0];
              return rules[selector].apply(this, [e, data]);
            }
          }, this);
        };
      },

      // ensures that a function will only be called once.
      // usage:
      // will only create the application once
      //   var initialize = utils.once(createApplication)
      //     initialize();
      //     initialize();
      //
      // will only delete a record once
      //   var myHanlder = function () {
      //     $.ajax({type: 'DELETE', url: 'someurl.com', data: {id: 1}});
      //   };
      //   this.on('click', utils.once(myHandler));
      //
      once: function(func) {
        var ran, result;

        return function() {
          if (ran) {
            return result;
          }

          ran = true;
          result = func.apply(this, arguments);

          return result;
        };
      },

      propertyWritability: function(obj, prop, writable) {
        if (canWriteProtect() && obj.hasOwnProperty(prop)) {
          Object.defineProperty(obj, prop, { writable: writable });
        }
      },

      // Property locking/unlocking
      mutateProperty: function(obj, prop, op) {
        var writable;

        if (!canWriteProtect() || !obj.hasOwnProperty(prop)) {
          op.call(obj);
          return;
        }

        writable = Object.getOwnPropertyDescriptor(obj, prop).writable;

        Object.defineProperty(obj, prop, { writable: true });
        op.call(obj);
        Object.defineProperty(obj, prop, { writable: writable });

      }

    };

    return utils;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright 2013 Twitter, Inc. Licensed under The MIT License. http://opensource.org/licenses/MIT */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(6),
    __webpack_require__(4)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = function(utils, registry, debug) {
    'use strict';

    // common mixin allocates basic functionality - used by all component prototypes
    // callback context is bound to component
    var componentId = 0;

    function teardownInstance(instanceInfo) {
      instanceInfo.events.slice().forEach(function(event) {
        var args = [event.type];

        event.element && args.unshift(event.element);
        (typeof event.callback == 'function') && args.push(event.callback);

        this.off.apply(this, args);
      }, instanceInfo.instance);
    }

    function checkSerializable(type, data) {
      try {
        window.postMessage(data, '*');
      } catch (e) {
        debug.warn.call(this, [
          'Event "', type, '" was triggered with non-serializable data. ',
          'Flight recommends you avoid passing non-serializable data in events.'
        ].join(''));
      }
    }

    function warnAboutReferenceType(key) {
      debug.warn.call(this, [
        'Attribute "', key, '" defaults to an array or object. ',
        'Enclose this in a function to avoid sharing between component instances.'
      ].join(''));
    }

    function initAttributes(attrs) {
      var definedKeys = [], incomingKeys;

      this.attr = new this.attrDef;

      if (debug.enabled && window.console) {
        for (var key in this.attrDef.prototype) {
          definedKeys.push(key);
        }
        incomingKeys = Object.keys(attrs);

        for (var i = incomingKeys.length - 1; i >= 0; i--) {
          if (definedKeys.indexOf(incomingKeys[i]) == -1) {
            debug.warn.call(this, 'Passed unused attribute "' + incomingKeys[i] + '".');
            break;
          }
        }
      }

      for (var key in this.attrDef.prototype) {
        if (typeof attrs[key] == 'undefined') {
          if (this.attr[key] === null) {
            throw new Error('Required attribute "' + key +
                            '" not specified in attachTo for component "' + this.toString() + '".');
          }
          // Warn about reference types in attributes
          if (debug.enabled && typeof this.attr[key] === 'object') {
            warnAboutReferenceType.call(this, key);
          }
        } else {
          this.attr[key] = attrs[key];
        }

        if (typeof this.attr[key] == 'function') {
          this.attr[key] = this.attr[key].call(this);
        }
      }

    }

    function initDeprecatedAttributes(attrs) {
      // merge defaults with supplied options
      // put options in attr.__proto__ to avoid merge overhead
      var attr = Object.create(attrs);

      for (var key in this.defaults) {
        if (!attrs.hasOwnProperty(key)) {
          attr[key] = this.defaults[key];
          // Warn about reference types in defaultAttrs
          if (debug.enabled && typeof this.defaults[key] === 'object') {
            warnAboutReferenceType.call(this, key);
          }
        }
      }

      this.attr = attr;

      Object.keys(this.defaults || {}).forEach(function(key) {
        if (this.defaults[key] === null && this.attr[key] === null) {
          throw new Error('Required attribute "' + key +
                          '" not specified in attachTo for component "' + this.toString() + '".');
        }
      }, this);
    }

    function proxyEventTo(targetEvent) {
      return function(e, data) {
        $(e.target).trigger(targetEvent, data);
      };
    }

    function withBase() {

      // delegate trigger, bind and unbind to an element
      // if $element not supplied, use component's node
      // other arguments are passed on
      // event can be either a string specifying the type
      // of the event, or a hash specifying both the type
      // and a default function to be called.
      this.trigger = function() {
        var $element, type, data, event, defaultFn;
        var lastIndex = arguments.length - 1, lastArg = arguments[lastIndex];

        if (typeof lastArg != 'string' && !(lastArg && lastArg.defaultBehavior)) {
          lastIndex--;
          data = lastArg;
        }

        if (lastIndex == 1) {
          $element = $(arguments[0]);
          event = arguments[1];
        } else {
          $element = this.$node;
          event = arguments[0];
        }

        if (event.defaultBehavior) {
          defaultFn = event.defaultBehavior;
          event = $.Event(event.type);
        }

        type = event.type || event;

        if (debug.enabled && window.postMessage) {
          checkSerializable.call(this, type, data);
        }

        if (typeof this.attr.eventData == 'object') {
          data = $.extend(true, {}, this.attr.eventData, data);
        }

        $element.trigger((event || type), data);

        if (defaultFn && !event.isDefaultPrevented()) {
          (this[defaultFn] || defaultFn).call(this, event, data);
        }

        return $element;
      };


      this.on = function() {
        var $element, type, callback, originalCb;
        var lastIndex = arguments.length - 1, origin = arguments[lastIndex];

        if (typeof origin == 'object') {
          //delegate callback
          originalCb = utils.delegate(
            this.resolveDelegateRules(origin)
          );
        } else if (typeof origin == 'string') {
          originalCb = proxyEventTo(origin);
        } else {
          originalCb = origin;
        }

        if (lastIndex == 2) {
          $element = $(arguments[0]);
          type = arguments[1];
        } else {
          $element = this.$node;
          type = arguments[0];
        }

        if (typeof originalCb != 'function' && typeof originalCb != 'object') {
          throw new Error('Unable to bind to "' + type +
                          '" because the given callback is not a function or an object');
        }

        callback = originalCb.bind(this);
        callback.target = originalCb;
        callback.context = this;

        $element.on(type, callback);

        // store every bound version of the callback
        originalCb.bound || (originalCb.bound = []);
        originalCb.bound.push(callback);

        return callback;
      };

      this.off = function() {
        var $element, type, callback;
        var lastIndex = arguments.length - 1;

        if (typeof arguments[lastIndex] == 'function') {
          callback = arguments[lastIndex];
          lastIndex -= 1;
        }

        if (lastIndex == 1) {
          $element = $(arguments[0]);
          type = arguments[1];
        } else {
          $element = this.$node;
          type = arguments[0];
        }

        if (callback) {
          //this callback may be the original function or a bound version
          var boundFunctions = callback.target ? callback.target.bound : callback.bound || [];
          //set callback to version bound against this instance
          boundFunctions && boundFunctions.some(function(fn, i, arr) {
            if (fn.context && (this.identity == fn.context.identity)) {
              arr.splice(i, 1);
              callback = fn;
              return true;
            }
          }, this);
          $element.off(type, callback);
        } else {
          // Loop through the events of `this` instance
          // and unbind using the callback
          registry.findInstanceInfo(this).events.forEach(function (event) {
            if (type == event.type) {
              $element.off(type, event.callback);
            }
          });
        }

        return $element;
      };

      this.resolveDelegateRules = function(ruleInfo) {
        var rules = {};

        Object.keys(ruleInfo).forEach(function(r) {
          if (!(r in this.attr)) {
            throw new Error('Component "' + this.toString() + '" wants to listen on "' + r + '" but no such attribute was defined.');
          }
          rules[this.attr[r]] = (typeof ruleInfo[r] == 'string') ? proxyEventTo(ruleInfo[r]) : ruleInfo[r];
        }, this);

        return rules;
      };

      this.select = function(attributeKey) {
        return this.$node.find(this.attr[attributeKey]);
      };

      // New-style attributes

      this.attributes = function(attrs) {

        var Attributes = function() {};

        if (this.attrDef) {
          Attributes.prototype = new this.attrDef;
        }

        for (var name in attrs) {
          Attributes.prototype[name] = attrs[name];
        }

        this.attrDef = Attributes;
      };

      // Deprecated attributes

      this.defaultAttrs = function(defaults) {
        utils.push(this.defaults, defaults, true) || (this.defaults = defaults);
      };

      this.initialize = function(node, attrs) {
        attrs = attrs || {};
        this.identity || (this.identity = componentId++);

        if (!node) {
          throw new Error('Component needs a node');
        }

        if (node.jquery) {
          this.node = node[0];
          this.$node = node;
        } else {
          this.node = node;
          this.$node = $(node);
        }

        if (this.attrDef) {
          initAttributes.call(this, attrs);
        } else {
          initDeprecatedAttributes.call(this, attrs);
        }

        return this;
      };

      this.teardown = function() {
        teardownInstance(registry.findInstanceInfo(this));
      };
    }

    return withBase;
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});

},{}],"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/compiler.js":[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      rLineSep = /\u2028/,
      rParagraphSep = /\u2029/;

  Hogan.tags = {
    '#': 1, '^': 2, '<': 3, '$': 4,
    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
    '{': 10, '&': 11, '_t': 12
  };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push({tag: '_t', text: new String(buf)});
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (tokens[j].text) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].text.toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[delimiters.length - 1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = Hogan.tags[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  // the tags allowed inside super templates
  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        tail = null,
        token = null;

    tail = stack[stack.length - 1];

    while (tokens.length > 0) {
      token = tokens.shift();

      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
        throw new Error('Illegal content in < super tag.');
      }

      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else if (token.tag == '\n') {
        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
      }

      instructions.push(token);
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  function stringifySubstitutions(obj) {
    var items = [];
    for (var key in obj) {
      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
    }
    return "{ " + items.join(",") + " }";
  }

  function stringifyPartials(codeObj) {
    var partials = [];
    for (var key in codeObj.partials) {
      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
    }
    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
  }

  Hogan.stringify = function(codeObj, text, options) {
    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
  }

  var serialNo = 0;
  Hogan.generate = function(tree, text, options) {
    serialNo = 0;
    var context = { code: '', subs: {}, partials: {} };
    Hogan.walk(tree, context);

    if (options.asString) {
      return this.stringify(context, text, options);
    }

    return this.makeTemplate(context, text, options);
  }

  Hogan.wrapMain = function(code) {
    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
  }

  Hogan.template = Hogan.Template;

  Hogan.makeTemplate = function(codeObj, text, options) {
    var template = this.makePartials(codeObj);
    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
    return new this.template(template, text, this, options);
  }

  Hogan.makePartials = function(codeObj) {
    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
    for (key in template.partials) {
      template.partials[key] = this.makePartials(template.partials[key]);
    }
    for (key in codeObj.subs) {
      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
    }
    return template;
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r')
            .replace(rLineSep, '\\u2028')
            .replace(rParagraphSep, '\\u2029');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function createPartial(node, context) {
    var prefix = "<" + (context.prefix || "");
    var sym = prefix + node.n + serialNo++;
    context.partials[sym] = {name: node.n, partials: {}};
    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
    return sym;
  }

  Hogan.codegen = {
    '#': function(node, context) {
      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
                      't.rs(c,p,' + 'function(c,p,t){';
      Hogan.walk(node.nodes, context);
      context.code += '});c.pop();}';
    },

    '^': function(node, context) {
      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
      Hogan.walk(node.nodes, context);
      context.code += '};';
    },

    '>': createPartial,
    '<': function(node, context) {
      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
      Hogan.walk(node.nodes, ctx);
      var template = context.partials[createPartial(node, context)];
      template.subs = ctx.subs;
      template.partials = ctx.partials;
    },

    '$': function(node, context) {
      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
      Hogan.walk(node.nodes, ctx);
      context.subs[node.n] = ctx.code;
      if (!context.inPartial) {
        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
      }
    },

    '\n': function(node, context) {
      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
    },

    '_v': function(node, context) {
      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
    },

    '_t': function(node, context) {
      context.code += write('"' + esc(node.text) + '"');
    },

    '{': tripleStache,

    '&': tripleStache
  }

  function tripleStache(node, context) {
    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
  }

  function write(s) {
    return 't.b(' + s + ');';
  }

  Hogan.walk = function(nodelist, context) {
    var func;
    for (var i = 0, l = nodelist.length; i < l; i++) {
      func = Hogan.codegen[nodelist[i].tag];
      func && func(nodelist[i], context);
    }
    return context;
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  }

  Hogan.cache = {};

  Hogan.cacheKey = function(text, options) {
    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
  }

  Hogan.compile = function(text, options) {
    options = options || {};
    var key = Hogan.cacheKey(text, options);
    var template = this.cache[key];

    if (template) {
      var partials = template.partials;
      for (var name in partials) {
        delete partials[name].instance;
      }
      return template;
    }

    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = template;
  }
})(typeof exports !== 'undefined' ? exports : Hogan);

},{}],"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/hogan.js":[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// This file is for use with Node.js. See dist/ for browser files.

var Hogan = require('./compiler');
Hogan.Template = require('./template').Template;
Hogan.template = Hogan.Template;
module.exports = Hogan;

},{"./compiler":"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/compiler.js","./template":"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/template.js"}],"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/template.js":[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan) {
  Hogan.Template = function (codeObj, text, compiler, options) {
    codeObj = codeObj || {};
    this.r = codeObj.code || this.r;
    this.c = compiler;
    this.options = options || {};
    this.text = text || '';
    this.partials = codeObj.partials || {};
    this.subs = codeObj.subs || {};
    this.buf = '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // ensurePartial
    ep: function(symbol, partials) {
      var partial = this.partials[symbol];

      // check to see that if we've instantiated this partial before
      var template = partials[partial.name];
      if (partial.instance && partial.base == template) {
        return partial.instance;
      }

      if (typeof template == 'string') {
        if (!this.c) {
          throw new Error("No compiler available.");
        }
        template = this.c.compile(template, this.options);
      }

      if (!template) {
        return null;
      }

      // We use this to check whether the partials dictionary has changed
      this.partials[symbol].base = template;

      if (partial.subs) {
        // Make sure we consider parent template now
        if (!partials.stackText) partials.stackText = {};
        for (key in partial.subs) {
          if (!partials.stackText[key]) {
            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
          }
        }
        template = createSpecializedPartial(template, partial.subs, partial.partials,
          this.stackSubs, this.stackPartials, partials.stackText);
      }
      this.partials[symbol].instance = template;

      return template;
    },

    // tries to find a partial in the current scope and render it
    rp: function(symbol, context, partials, indent) {
      var partial = this.ep(symbol, partials);
      if (!partial) {
        return '';
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ms(val, ctx, partials, inverted, start, end, tags);
      }

      pass = !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var found,
          names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          doModelGet = this.options.modelGet,
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        val = ctx[ctx.length - 1];
      } else {
        for (var i = 1; i < names.length; i++) {
          found = findInScope(names[i], val, doModelGet);
          if (found !== undefined) {
            cx = val;
            val = found;
          } else {
            val = '';
          }
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.mv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false,
          doModelGet = this.options.modelGet;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        val = findInScope(key, v, doModelGet);
        if (val !== undefined) {
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.mv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ls: function(func, cx, partials, text, tags) {
      var oldTags = this.options.delimiters;

      this.options.delimiters = tags;
      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
      this.options.delimiters = oldTags;

      return false;
    },

    // compile text
    ct: function(text, cx, partials) {
      if (this.options.disableLambda) {
        throw new Error('Lambda features disabled.');
      }
      return this.c.compile(text, this.options).render(cx, partials);
    },

    // template result buffering
    b: function(s) { this.buf += s; },

    fl: function() { var r = this.buf; this.buf = ''; return r; },

    // method replace section
    ms: function(func, ctx, partials, inverted, start, end, tags) {
      var textSource,
          cx = ctx[ctx.length - 1],
          result = func.call(cx);

      if (typeof result == 'function') {
        if (inverted) {
          return true;
        } else {
          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
        }
      }

      return result;
    },

    // method replace variable
    mv: function(func, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = func.call(cx);

      if (typeof result == 'function') {
        return this.ct(coerceToString(result.call(cx)), cx, partials);
      }

      return result;
    },

    sub: function(name, context, partials, indent) {
      var f = this.subs[name];
      if (f) {
        this.activeSub = name;
        f(context, partials, this, indent);
        this.activeSub = false;
      }
    }

  };

  //Find a key in an object
  function findInScope(key, scope, doModelGet) {
    var val;

    if (scope && typeof scope == 'object') {

      if (scope[key] !== undefined) {
        val = scope[key];

      // try lookup with get for backbone or similar model data
      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
        val = scope.get(key);
      }
    }

    return val;
  }

  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
    function PartialTemplate() {};
    PartialTemplate.prototype = instance;
    function Substitutions() {};
    Substitutions.prototype = instance.subs;
    var key;
    var partial = new PartialTemplate();
    partial.subs = new Substitutions();
    partial.subsText = {};  //hehe. substext.
    partial.buf = '';

    stackSubs = stackSubs || {};
    partial.stackSubs = stackSubs;
    partial.subsText = stackText;
    for (key in subs) {
      if (!stackSubs[key]) stackSubs[key] = subs[key];
    }
    for (key in stackSubs) {
      partial.subs[key] = stackSubs[key];
    }

    stackPartials = stackPartials || {};
    partial.stackPartials = stackPartials;
    for (key in partials) {
      if (!stackPartials[key]) stackPartials[key] = partials[key];
    }
    for (key in stackPartials) {
      partial.partials[key] = stackPartials[key];
    }

    return partial;
  }

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      hChars = /[&<>\"\']/;

  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);

},{}],"/Users/keith/Work/Flux/fluxor/src/js/app.js":[function(require,module,exports){
var Flightjs = require('flightjs');
var hello = require('helloworld');

var start = +new Date();

hello.render('Mars');
console.log(+new Date() - start);

window.Flightjs = Flightjs;

},{"flightjs":"/Users/keith/Work/Flux/fluxor/node_modules/flightjs/build/flight.js","helloworld":"/Users/keith/Work/Flux/fluxor/src/js/node_modules/helloworld/index.js"}],"/Users/keith/Work/Flux/fluxor/src/js/node_modules/helloworld/index.js":[function(require,module,exports){
// Templates
var template = require('./templates/title.hogan');

// var Store = function() {
//   this.trigger = function(name) {
//     event = document.createEvent('HTMLEvents');
//     event.initEvent(name, true, true);
//     element.dispatchEvent(event);
//   }
//
//   this.add = function() {
//     this.trigger('change');
//   };
//
//   this.remove = function) {
//     this.trigger('change');
//   }
// }

var render = function(name) {

  var trigger = function(name) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
    document.dispatchEvent(event);
  }
  var titleEl = document.querySelector('[data-title]');

  titleEl.innerHTML = template.render({
    name: name
  });

  document.addEventListener('click', function() {
    console.log('click');
    trigger('change');
  });

  document.addEventListener('change', function() {
    console.log('change');
  });
}

module.exports = {
  render: render,
  // store: Store
}

},{"./templates/title.hogan":"/Users/keith/Work/Flux/fluxor/src/js/node_modules/helloworld/templates/title.hogan"}],"/Users/keith/Work/Flux/fluxor/src/js/node_modules/helloworld/templates/title.hogan":[function(require,module,exports){
var Hogan = require('hogan.js');
module.exports = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("Hello ");t.b(t.v(t.f("name",c,p,0)));t.b("!");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "Hello {{ name }}!\n", Hogan);
},{"hogan.js":"/Users/keith/Work/Flux/fluxor/node_modules/hogan.js/lib/hogan.js"}]},{},["/Users/keith/Work/Flux/fluxor/src/js/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmxpZ2h0anMvYnVpbGQvZmxpZ2h0LmpzIiwibm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcyIsIm5vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvaG9nYW4uanMiLCJub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL3RlbXBsYXRlLmpzIiwic3JjL2pzL2FwcC5qcyIsInNyYy9qcy9ub2RlX21vZHVsZXMvaGVsbG93b3JsZC9pbmRleC5qcyIsInNyYy9qcy9ub2RlX21vZHVsZXMvaGVsbG93b3JsZC90ZW1wbGF0ZXMvdGl0bGUuaG9nYW4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1NkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBGbGlnaHQgdjEuNS4wIHwgKGMpIFR3aXR0ZXIsIEluYy4gfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJmbGlnaHRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZmxpZ2h0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxuICAgIF9fd2VicGFja19yZXF1aXJlX18oMiksXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXygzKSxcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpLFxuICAgIF9fd2VicGFja19yZXF1aXJlX18oNSksXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg2KSxcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpXG4gIF0sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gZnVuY3Rpb24oYWR2aWNlLCBjb21wb25lbnQsIGNvbXBvc2UsIGRlYnVnLCBsb2dnZXIsIHJlZ2lzdHJ5LCB1dGlscykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiB7XG4gICAgICBhZHZpY2U6IGFkdmljZSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50LFxuICAgICAgY29tcG9zZTogY29tcG9zZSxcbiAgICAgIGRlYnVnOiBkZWJ1ZyxcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgcmVnaXN0cnk6IHJlZ2lzdHJ5LFxuICAgICAgdXRpbHM6IHV0aWxzXG4gICAgfTtcblxuICB9LmFwcGx5KGV4cG9ydHMsIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18pLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyAhPT0gdW5kZWZpbmVkICYmIChtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fKSk7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXywgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX187LyogQ29weXJpZ2h0IDIwMTMgVHdpdHRlciwgSW5jLiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2UuIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQgKi9cblxuIShfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fID0gW1xuICAgIF9fd2VicGFja19yZXF1aXJlX18oNylcbiAgXSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gPSBmdW5jdGlvbih1dGlscykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBhZHZpY2UgPSB7XG5cbiAgICAgIGFyb3VuZDogZnVuY3Rpb24oYmFzZSwgd3JhcHBlZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gY29tcG9zZWRBcm91bmQoKSB7XG4gICAgICAgICAgLy8gdW5wYWNraW5nIGFyZ3VtZW50cyBieSBoYW5kIGJlbmNobWFya2VkIGZhc3RlclxuICAgICAgICAgIHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkobCArIDEpO1xuICAgICAgICAgIGFyZ3NbMF0gPSBiYXNlLmJpbmQodGhpcyk7XG4gICAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSArIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gd3JhcHBlZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIGJlZm9yZTogZnVuY3Rpb24oYmFzZSwgYmVmb3JlKSB7XG4gICAgICAgIHZhciBiZWZvcmVGbiA9ICh0eXBlb2YgYmVmb3JlID09ICdmdW5jdGlvbicpID8gYmVmb3JlIDogYmVmb3JlLm9ialtiZWZvcmUuZm5OYW1lXTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvc2VkQmVmb3JlKCkge1xuICAgICAgICAgIGJlZm9yZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIGJhc2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIGFmdGVyOiBmdW5jdGlvbihiYXNlLCBhZnRlcikge1xuICAgICAgICB2YXIgYWZ0ZXJGbiA9ICh0eXBlb2YgYWZ0ZXIgPT0gJ2Z1bmN0aW9uJykgPyBhZnRlciA6IGFmdGVyLm9ialthZnRlci5mbk5hbWVdO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gY29tcG9zZWRBZnRlcigpIHtcbiAgICAgICAgICB2YXIgcmVzID0gKGJhc2UudW5ib3VuZCB8fCBiYXNlKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIGFmdGVyRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLy8gYSBtaXhpbiB0aGF0IGFsbG93cyBvdGhlciBtaXhpbnMgdG8gYXVnbWVudCBleGlzdGluZyBmdW5jdGlvbnMgYnkgYWRkaW5nIGFkZGl0aW9uYWxcbiAgICAgIC8vIGNvZGUgYmVmb3JlLCBhZnRlciBvciBhcm91bmQuXG4gICAgICB3aXRoQWR2aWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgWydiZWZvcmUnLCAnYWZ0ZXInLCAnYXJvdW5kJ10uZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICAgICAgdGhpc1ttXSA9IGZ1bmN0aW9uKG1ldGhvZCwgZm4pIHtcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gbWV0aG9kLnRyaW0oKS5zcGxpdCgnICcpO1xuXG4gICAgICAgICAgICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICB1dGlscy5tdXRhdGVQcm9wZXJ0eSh0aGlzLCBpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbaV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgdGhpc1tpXSA9IGFkdmljZVttXSh0aGlzW2ldLCBmbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBmbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tpXTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGFkdmljZTtcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxuICAgIF9fd2VicGFja19yZXF1aXJlX18oNyksXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXygzKSxcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDgpLFxuICAgIF9fd2VicGFja19yZXF1aXJlX18oNiksXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg1KSxcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpXG4gIF0sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gZnVuY3Rpb24oYWR2aWNlLCB1dGlscywgY29tcG9zZSwgd2l0aEJhc2UsIHJlZ2lzdHJ5LCB3aXRoTG9nZ2luZywgZGVidWcpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZnVuY3Rpb25OYW1lUmVnRXggPSAvZnVuY3Rpb24gKC4qPylcXHM/XFwoLztcbiAgICB2YXIgaWdub3JlZE1peGluID0ge1xuICAgICAgd2l0aEJhc2U6IHRydWUsXG4gICAgICB3aXRoTG9nZ2luZzogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyB0ZWFyZG93biBmb3IgYWxsIGluc3RhbmNlcyBvZiB0aGlzIGNvbnN0cnVjdG9yXG4gICAgZnVuY3Rpb24gdGVhcmRvd25BbGwoKSB7XG4gICAgICB2YXIgY29tcG9uZW50SW5mbyA9IHJlZ2lzdHJ5LmZpbmRDb21wb25lbnRJbmZvKHRoaXMpO1xuXG4gICAgICBjb21wb25lbnRJbmZvICYmIE9iamVjdC5rZXlzKGNvbXBvbmVudEluZm8uaW5zdGFuY2VzKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgdmFyIGluZm8gPSBjb21wb25lbnRJbmZvLmluc3RhbmNlc1trXTtcbiAgICAgICAgLy8gSXQncyBwb3NzaWJsZSB0aGF0IGEgcHJldmlvdXMgdGVhcmRvd24gY2F1c2VkIGFub3RoZXIgY29tcG9uZW50IHRvIHRlYXJkb3duLFxuICAgICAgICAvLyBzbyB3ZSBjYW4ndCBhc3N1bWUgdGhhdCB0aGUgaW5zdGFuY2VzIG9iamVjdCBpcyBhcyBpdCB3YXMuXG4gICAgICAgIGlmIChpbmZvICYmIGluZm8uaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbmZvLmluc3RhbmNlLnRlYXJkb3duKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGF0dGFjaFRvKHNlbGVjdG9yLyosIG9wdGlvbnMgYXJncyAqLykge1xuICAgICAgLy8gdW5wYWNraW5nIGFyZ3VtZW50cyBieSBoYW5kIGJlbmNobWFya2VkIGZhc3RlclxuICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICB9XG5cbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbmVlZHMgdG8gYmUgYXR0YWNoVG9cXCdkIGEgalF1ZXJ5IG9iamVjdCwgbmF0aXZlIG5vZGUgb3Igc2VsZWN0b3Igc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gdXRpbHMubWVyZ2UuYXBwbHkodXRpbHMsIGFyZ3MpO1xuICAgICAgdmFyIGNvbXBvbmVudEluZm8gPSByZWdpc3RyeS5maW5kQ29tcG9uZW50SW5mbyh0aGlzKTtcblxuICAgICAgJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbihpLCBub2RlKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRJbmZvICYmIGNvbXBvbmVudEluZm8uaXNBdHRhY2hlZFRvKG5vZGUpKSB7XG4gICAgICAgICAgLy8gYWxyZWFkeSBhdHRhY2hlZFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIChuZXcgdGhpcykuaW5pdGlhbGl6ZShub2RlLCBvcHRpb25zKTtcbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldHR5UHJpbnRNaXhpbnMoKSB7XG4gICAgICAvL2NvdWxkIGJlIGNhbGxlZCBmcm9tIGNvbnN0cnVjdG9yIG9yIGNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgdmFyIG1peGVkSW4gPSB0aGlzLm1peGVkSW4gfHwgdGhpcy5wcm90b3R5cGUubWl4ZWRJbiB8fCBbXTtcbiAgICAgIHJldHVybiBtaXhlZEluLm1hcChmdW5jdGlvbihtaXhpbikge1xuICAgICAgICBpZiAobWl4aW4ubmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgLy8gZnVuY3Rpb24gbmFtZSBwcm9wZXJ0eSBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3NlciwgdXNlIHJlZ2V4XG4gICAgICAgICAgdmFyIG0gPSBtaXhpbi50b1N0cmluZygpLm1hdGNoKGZ1bmN0aW9uTmFtZVJlZ0V4KTtcbiAgICAgICAgICByZXR1cm4gKG0gJiYgbVsxXSkgPyBtWzFdIDogJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICghaWdub3JlZE1peGluW21peGluLm5hbWVdID8gbWl4aW4ubmFtZSA6ICcnKTtcbiAgICAgIH0pLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpO1xuICAgIH07XG5cblxuICAgIC8vIGRlZmluZSB0aGUgY29uc3RydWN0b3IgZm9yIGEgY3VzdG9tIGNvbXBvbmVudCB0eXBlXG4gICAgLy8gdGFrZXMgYW4gdW5saW1pdGVkIG51bWJlciBvZiBtaXhpbiBmdW5jdGlvbnMgYXMgYXJndW1lbnRzXG4gICAgLy8gdHlwaWNhbCBhcGkgY2FsbCB3aXRoIDMgbWl4aW5zOiBkZWZpbmUodGltZWxpbmUsIHdpdGhUd2VldENhcGFiaWxpdHksIHdpdGhTY3JvbGxDYXBhYmlsaXR5KTtcbiAgICBmdW5jdGlvbiBkZWZpbmUoLyptaXhpbnMqLykge1xuICAgICAgLy8gdW5wYWNraW5nIGFyZ3VtZW50cyBieSBoYW5kIGJlbmNobWFya2VkIGZhc3RlclxuICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIG1peGlucyA9IG5ldyBBcnJheShsKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIG1peGluc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIH1cblxuICAgICAgdmFyIENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgIENvbXBvbmVudC50b1N0cmluZyA9IENvbXBvbmVudC5wcm90b3R5cGUudG9TdHJpbmcgPSBwcmV0dHlQcmludE1peGlucztcbiAgICAgIGlmIChkZWJ1Zy5lbmFibGVkKSB7XG4gICAgICAgIENvbXBvbmVudC5kZXNjcmliZSA9IENvbXBvbmVudC5wcm90b3R5cGUuZGVzY3JpYmUgPSBDb21wb25lbnQudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgLy8gJ29wdGlvbnMnIGlzIG9wdGlvbmFsIGhhc2ggdG8gYmUgbWVyZ2VkIHdpdGggJ2RlZmF1bHRzJyBpbiB0aGUgY29tcG9uZW50IGRlZmluaXRpb25cbiAgICAgIENvbXBvbmVudC5hdHRhY2hUbyA9IGF0dGFjaFRvO1xuICAgICAgLy8gZW5hYmxlcyBleHRlbnNpb24gb2YgZXhpc3RpbmcgXCJiYXNlXCIgQ29tcG9uZW50c1xuICAgICAgQ29tcG9uZW50Lm1peGluID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuZXdDb21wb25lbnQgPSBkZWZpbmUoKTsgLy9UT0RPOiBmaXggcHJldHR5IHByaW50XG4gICAgICAgIHZhciBuZXdQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudC5wcm90b3R5cGUpO1xuICAgICAgICBuZXdQcm90b3R5cGUubWl4ZWRJbiA9IFtdLmNvbmNhdChDb21wb25lbnQucHJvdG90eXBlLm1peGVkSW4pO1xuICAgICAgICBuZXdQcm90b3R5cGUuZGVmYXVsdHMgPSB1dGlscy5tZXJnZShDb21wb25lbnQucHJvdG90eXBlLmRlZmF1bHRzKTtcbiAgICAgICAgbmV3UHJvdG90eXBlLmF0dHJEZWYgPSBDb21wb25lbnQucHJvdG90eXBlLmF0dHJEZWY7XG4gICAgICAgIGNvbXBvc2UubWl4aW4obmV3UHJvdG90eXBlLCBhcmd1bWVudHMpO1xuICAgICAgICBuZXdDb21wb25lbnQucHJvdG90eXBlID0gbmV3UHJvdG90eXBlO1xuICAgICAgICBuZXdDb21wb25lbnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbmV3Q29tcG9uZW50O1xuICAgICAgICByZXR1cm4gbmV3Q29tcG9uZW50O1xuICAgICAgfTtcbiAgICAgIENvbXBvbmVudC50ZWFyZG93bkFsbCA9IHRlYXJkb3duQWxsO1xuXG4gICAgICAvLyBwcmVwZW5kIGNvbW1vbiBtaXhpbnMgdG8gc3VwcGxpZWQgbGlzdCwgdGhlbiBtaXhpbiBhbGwgZmxhdm9yc1xuICAgICAgaWYgKGRlYnVnLmVuYWJsZWQpIHtcbiAgICAgICAgbWl4aW5zLnVuc2hpZnQod2l0aExvZ2dpbmcpO1xuICAgICAgfVxuICAgICAgbWl4aW5zLnVuc2hpZnQod2l0aEJhc2UsIGFkdmljZS53aXRoQWR2aWNlLCByZWdpc3RyeS53aXRoUmVnaXN0cmF0aW9uKTtcbiAgICAgIGNvbXBvc2UubWl4aW4oQ29tcG9uZW50LnByb3RvdHlwZSwgbWl4aW5zKTtcblxuICAgICAgcmV0dXJuIENvbXBvbmVudDtcbiAgICB9XG5cbiAgICBkZWZpbmUudGVhcmRvd25BbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlZ2lzdHJ5LmNvbXBvbmVudHMuc2xpY2UoKS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgYy5jb21wb25lbnQudGVhcmRvd25BbGwoKTtcbiAgICAgIH0pO1xuICAgICAgcmVnaXN0cnkucmVzZXQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmluZTtcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiAzICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpXG4gIF0sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gZnVuY3Rpb24odXRpbHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9udExvY2sgPSBbJ21peGVkSW4nLCAnYXR0ckRlZiddO1xuXG4gICAgZnVuY3Rpb24gc2V0V3JpdGFiaWxpdHkob2JqLCB3cml0YWJsZSkge1xuICAgICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGRvbnRMb2NrLmluZGV4T2Yoa2V5KSA8IDApIHtcbiAgICAgICAgICB1dGlscy5wcm9wZXJ0eVdyaXRhYmlsaXR5KG9iaiwga2V5LCB3cml0YWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1peGluKGJhc2UsIG1peGlucykge1xuICAgICAgYmFzZS5taXhlZEluID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGJhc2UsICdtaXhlZEluJykgPyBiYXNlLm1peGVkSW4gOiBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaXhpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJhc2UubWl4ZWRJbi5pbmRleE9mKG1peGluc1tpXSkgPT0gLTEpIHtcbiAgICAgICAgICBzZXRXcml0YWJpbGl0eShiYXNlLCBmYWxzZSk7XG4gICAgICAgICAgbWl4aW5zW2ldLmNhbGwoYmFzZSk7XG4gICAgICAgICAgYmFzZS5taXhlZEluLnB1c2gobWl4aW5zW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZXRXcml0YWJpbGl0eShiYXNlLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWl4aW46IG1peGluXG4gICAgfTtcblxuICB9LmFwcGx5KGV4cG9ydHMsIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18pLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyAhPT0gdW5kZWZpbmVkICYmIChtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fKSk7XG5cblxuLyoqKi8gfSxcbi8qIDQgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXywgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX187LyogQ29weXJpZ2h0IDIwMTMgVHdpdHRlciwgSW5jLiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2UuIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQgKi9cblxuIShfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fID0gW19fd2VicGFja19yZXF1aXJlX18oNildLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyA9IGZ1bmN0aW9uKHJlZ2lzdHJ5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU2VhcmNoIG9iamVjdCBtb2RlbFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gdHJhdmVyc2UodXRpbCwgc2VhcmNoVGVybSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgb2JqID0gb3B0aW9ucy5vYmogfHwgd2luZG93O1xuICAgICAgdmFyIHBhdGggPSBvcHRpb25zLnBhdGggfHwgKChvYmogPT0gd2luZG93KSA/ICd3aW5kb3cnIDogJycpO1xuICAgICAgdmFyIHByb3BzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICBpZiAoKHRlc3RzW3V0aWxdIHx8IHV0aWwpKHNlYXJjaFRlcm0sIG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhbcGF0aCwgJy4nLCBwcm9wXS5qb2luKCcnKSwgJy0+JywgWycoJywgdHlwZW9mIG9ialtwcm9wXSwgJyknXS5qb2luKCcnKSwgb2JqW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9ialtwcm9wXSkgPT0gJ1tvYmplY3QgT2JqZWN0XScgJiYgKG9ialtwcm9wXSAhPSBvYmopICYmIHBhdGguc3BsaXQoJy4nKS5pbmRleE9mKHByb3ApID09IC0xKSB7XG4gICAgICAgICAgdHJhdmVyc2UodXRpbCwgc2VhcmNoVGVybSwge29iajogb2JqW3Byb3BdLCBwYXRoOiBbcGF0aCxwcm9wXS5qb2luKCcuJyl9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VhcmNoKHV0aWwsIGV4cGVjdGVkLCBzZWFyY2hUZXJtLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIWV4cGVjdGVkIHx8IHR5cGVvZiBzZWFyY2hUZXJtID09IGV4cGVjdGVkKSB7XG4gICAgICAgIHRyYXZlcnNlKHV0aWwsIHNlYXJjaFRlcm0sIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihbc2VhcmNoVGVybSwgJ211c3QgYmUnLCBleHBlY3RlZF0uam9pbignICcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdGVzdHMgPSB7XG4gICAgICAnbmFtZSc6IGZ1bmN0aW9uKHNlYXJjaFRlcm0sIG9iaiwgcHJvcCkge3JldHVybiBzZWFyY2hUZXJtID09IHByb3A7fSxcbiAgICAgICduYW1lQ29udGFpbnMnOiBmdW5jdGlvbihzZWFyY2hUZXJtLCBvYmosIHByb3ApIHtyZXR1cm4gcHJvcC5pbmRleE9mKHNlYXJjaFRlcm0pID4gLTE7fSxcbiAgICAgICd0eXBlJzogZnVuY3Rpb24oc2VhcmNoVGVybSwgb2JqLCBwcm9wKSB7cmV0dXJuIG9ialtwcm9wXSBpbnN0YW5jZW9mIHNlYXJjaFRlcm07fSxcbiAgICAgICd2YWx1ZSc6IGZ1bmN0aW9uKHNlYXJjaFRlcm0sIG9iaiwgcHJvcCkge3JldHVybiBvYmpbcHJvcF0gPT09IHNlYXJjaFRlcm07fSxcbiAgICAgICd2YWx1ZUNvZXJjZWQnOiBmdW5jdGlvbihzZWFyY2hUZXJtLCBvYmosIHByb3ApIHtyZXR1cm4gb2JqW3Byb3BdID09IHNlYXJjaFRlcm07fVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBieU5hbWUoc2VhcmNoVGVybSwgb3B0aW9ucykge3NlYXJjaCgnbmFtZScsICdzdHJpbmcnLCBzZWFyY2hUZXJtLCBvcHRpb25zKTt9XG4gICAgZnVuY3Rpb24gYnlOYW1lQ29udGFpbnMoc2VhcmNoVGVybSwgb3B0aW9ucykge3NlYXJjaCgnbmFtZUNvbnRhaW5zJywgJ3N0cmluZycsIHNlYXJjaFRlcm0sIG9wdGlvbnMpO31cbiAgICBmdW5jdGlvbiBieVR5cGUoc2VhcmNoVGVybSwgb3B0aW9ucykge3NlYXJjaCgndHlwZScsICdmdW5jdGlvbicsIHNlYXJjaFRlcm0sIG9wdGlvbnMpO31cbiAgICBmdW5jdGlvbiBieVZhbHVlKHNlYXJjaFRlcm0sIG9wdGlvbnMpIHtzZWFyY2goJ3ZhbHVlJywgbnVsbCwgc2VhcmNoVGVybSwgb3B0aW9ucyk7fVxuICAgIGZ1bmN0aW9uIGJ5VmFsdWVDb2VyY2VkKHNlYXJjaFRlcm0sIG9wdGlvbnMpIHtzZWFyY2goJ3ZhbHVlQ29lcmNlZCcsIG51bGwsIHNlYXJjaFRlcm0sIG9wdGlvbnMpO31cbiAgICBmdW5jdGlvbiBjdXN0b20oZm4sIG9wdGlvbnMpIHt0cmF2ZXJzZShmbiwgbnVsbCwgb3B0aW9ucyk7fVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gRXZlbnQgbG9nZ2luZ1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFyIEFMTCA9ICdhbGwnOyAvL25vIGZpbHRlclxuXG4gICAgLy9sb2cgbm90aGluZyBieSBkZWZhdWx0XG4gICAgdmFyIGxvZ0ZpbHRlciA9IHtcbiAgICAgIGV2ZW50TmFtZXM6IFtdLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJFdmVudExvZ3NCeUFjdGlvbigvKmFjdGlvbnMqLykge1xuICAgICAgdmFyIGFjdGlvbnMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIGxvZ0ZpbHRlci5ldmVudE5hbWVzLmxlbmd0aCB8fCAobG9nRmlsdGVyLmV2ZW50TmFtZXMgPSBBTEwpO1xuICAgICAgbG9nRmlsdGVyLmFjdGlvbnMgPSBhY3Rpb25zLmxlbmd0aCA/IGFjdGlvbnMgOiBBTEw7XG4gICAgICBzYXZlTG9nRmlsdGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyRXZlbnRMb2dzQnlOYW1lKC8qZXZlbnROYW1lcyovKSB7XG4gICAgICB2YXIgZXZlbnROYW1lcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgbG9nRmlsdGVyLmFjdGlvbnMubGVuZ3RoIHx8IChsb2dGaWx0ZXIuYWN0aW9ucyA9IEFMTCk7XG4gICAgICBsb2dGaWx0ZXIuZXZlbnROYW1lcyA9IGV2ZW50TmFtZXMubGVuZ3RoID8gZXZlbnROYW1lcyA6IEFMTDtcbiAgICAgIHNhdmVMb2dGaWx0ZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlQWxsRXZlbnRMb2dzKCkge1xuICAgICAgbG9nRmlsdGVyLmFjdGlvbnMgPSBbXTtcbiAgICAgIGxvZ0ZpbHRlci5ldmVudE5hbWVzID0gW107XG4gICAgICBzYXZlTG9nRmlsdGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0FsbEV2ZW50TG9ncygpIHtcbiAgICAgIGxvZ0ZpbHRlci5hY3Rpb25zID0gQUxMO1xuICAgICAgbG9nRmlsdGVyLmV2ZW50TmFtZXMgPSBBTEw7XG4gICAgICBzYXZlTG9nRmlsdGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZUxvZ0ZpbHRlcigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ0ZpbHRlcl9ldmVudE5hbWVzJywgbG9nRmlsdGVyLmV2ZW50TmFtZXMpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dGaWx0ZXJfYWN0aW9ucycsIGxvZ0ZpbHRlci5hY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoaWdub3JlZCkge307XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0cmlldmVMb2dGaWx0ZXIoKSB7XG4gICAgICB2YXIgZXZlbnROYW1lcywgYWN0aW9ucztcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2ZW50TmFtZXMgPSAod2luZG93LmxvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9nRmlsdGVyX2V2ZW50TmFtZXMnKSk7XG4gICAgICAgIGFjdGlvbnMgPSAod2luZG93LmxvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9nRmlsdGVyX2FjdGlvbnMnKSk7XG4gICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGV2ZW50TmFtZXMgJiYgKGxvZ0ZpbHRlci5ldmVudE5hbWVzID0gZXZlbnROYW1lcyk7XG4gICAgICBhY3Rpb25zICYmIChsb2dGaWx0ZXIuYWN0aW9ucyA9IGFjdGlvbnMpO1xuXG4gICAgICAvLyByZWNvbnN0aXR1dGUgYXJyYXlzIGluIHBsYWNlXG4gICAgICBPYmplY3Qua2V5cyhsb2dGaWx0ZXIpLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICB2YXIgdGhpc1Byb3AgPSBsb2dGaWx0ZXJba107XG4gICAgICAgIGlmICh0eXBlb2YgdGhpc1Byb3AgPT0gJ3N0cmluZycgJiYgdGhpc1Byb3AgIT09IEFMTCkge1xuICAgICAgICAgIGxvZ0ZpbHRlcltrXSA9IHRoaXNQcm9wID8gdGhpc1Byb3Auc3BsaXQoJywnKSA6IFtdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICBlbmFibGU6IGZ1bmN0aW9uKGVuYWJsZSkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSAhIWVuYWJsZTtcblxuICAgICAgICBpZiAoZW5hYmxlICYmIHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKCdCb290aW5nIGluIERFQlVHIG1vZGUnKTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ1lvdSBjYW4gY29uZmlndXJlIGV2ZW50IGxvZ2dpbmcgd2l0aCBERUJVRy5ldmVudHMubG9nQWxsKCkvbG9nTm9uZSgpL2xvZ0J5TmFtZSgpL2xvZ0J5QWN0aW9uKCknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHJpZXZlTG9nRmlsdGVyKCk7XG5cbiAgICAgICAgd2luZG93LkRFQlVHID0gdGhpcztcbiAgICAgIH0sXG5cbiAgICAgIHdhcm46IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIGlmICghd2luZG93LmNvbnNvbGUpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBmbiA9IChjb25zb2xlLndhcm4gfHwgY29uc29sZS5sb2cpO1xuICAgICAgICBmbi5jYWxsKGNvbnNvbGUsIHRoaXMudG9TdHJpbmcoKSArICc6ICcgKyBtZXNzYWdlKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlZ2lzdHJ5OiByZWdpc3RyeSxcblxuICAgICAgZmluZDoge1xuICAgICAgICBieU5hbWU6IGJ5TmFtZSxcbiAgICAgICAgYnlOYW1lQ29udGFpbnM6IGJ5TmFtZUNvbnRhaW5zLFxuICAgICAgICBieVR5cGU6IGJ5VHlwZSxcbiAgICAgICAgYnlWYWx1ZTogYnlWYWx1ZSxcbiAgICAgICAgYnlWYWx1ZUNvZXJjZWQ6IGJ5VmFsdWVDb2VyY2VkLFxuICAgICAgICBjdXN0b206IGN1c3RvbVxuICAgICAgfSxcblxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIGxvZ0ZpbHRlcjogbG9nRmlsdGVyLFxuXG4gICAgICAgIC8vIEFjY2VwdHMgYW55IG51bWJlciBvZiBhY3Rpb24gYXJnc1xuICAgICAgICAvLyBlLmcuIERFQlVHLmV2ZW50cy5sb2dCeUFjdGlvbihcIm9uXCIsIFwib2ZmXCIpXG4gICAgICAgIGxvZ0J5QWN0aW9uOiBmaWx0ZXJFdmVudExvZ3NCeUFjdGlvbixcblxuICAgICAgICAvLyBBY2NlcHRzIGFueSBudW1iZXIgb2YgZXZlbnQgbmFtZSBhcmdzIChpbmMuIHJlZ2V4IG9yIHdpbGRjYXJkcylcbiAgICAgICAgLy8gZS5nLiBERUJVRy5ldmVudHMubG9nQnlOYW1lKC91aS4qLywgXCIqVGhyZWFkKlwiKTtcbiAgICAgICAgbG9nQnlOYW1lOiBmaWx0ZXJFdmVudExvZ3NCeU5hbWUsXG5cbiAgICAgICAgbG9nQWxsOiBzaG93QWxsRXZlbnRMb2dzLFxuICAgICAgICBsb2dOb25lOiBoaWRlQWxsRXZlbnRMb2dzXG4gICAgICB9XG4gICAgfTtcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpXG4gIF0sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gZnVuY3Rpb24odXRpbHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYWN0aW9uU3ltYm9scyA9IHtcbiAgICAgIG9uOiAnPC0nLFxuICAgICAgdHJpZ2dlcjogJy0+JyxcbiAgICAgIG9mZjogJ3ggJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBlbGVtVG9TdHJpbmcoZWxlbSkge1xuICAgICAgdmFyIHRhZ1N0ciA9IGVsZW0udGFnTmFtZSA/IGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpIDogZWxlbS50b1N0cmluZygpO1xuICAgICAgdmFyIGNsYXNzU3RyID0gZWxlbS5jbGFzc05hbWUgPyAnLicgKyAoZWxlbS5jbGFzc05hbWUpIDogJyc7XG4gICAgICB2YXIgcmVzdWx0ID0gdGFnU3RyICsgY2xhc3NTdHI7XG4gICAgICByZXR1cm4gZWxlbS50YWdOYW1lID8gWydcXCcnLCAnXFwnJ10uam9pbihyZXN1bHQpIDogcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZyhhY3Rpb24sIGNvbXBvbmVudCwgZXZlbnRBcmdzKSB7XG4gICAgICBpZiAoIXdpbmRvdy5ERUJVRyB8fCAhd2luZG93LkRFQlVHLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG5hbWUsIGV2ZW50VHlwZSwgZWxlbSwgZm4sIHBheWxvYWQsIGxvZ0ZpbHRlciwgdG9SZWdFeHAsIGFjdGlvbkxvZ2dhYmxlLCBuYW1lTG9nZ2FibGUsIGluZm87XG5cbiAgICAgIGlmICh0eXBlb2YgZXZlbnRBcmdzW2V2ZW50QXJncy5sZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuID0gZXZlbnRBcmdzLnBvcCgpO1xuICAgICAgICBmbiA9IGZuLnVuYm91bmQgfHwgZm47IC8vIHVzZSB1bmJvdW5kIHZlcnNpb24gaWYgYW55IChiZXR0ZXIgaW5mbylcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50QXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICBlbGVtID0gY29tcG9uZW50LiRub2RlWzBdO1xuICAgICAgICBldmVudFR5cGUgPSBldmVudEFyZ3NbMF07XG4gICAgICB9IGVsc2UgaWYgKChldmVudEFyZ3MubGVuZ3RoID09IDIpICYmIHR5cGVvZiBldmVudEFyZ3NbMV0gPT0gJ29iamVjdCcgJiYgIWV2ZW50QXJnc1sxXS50eXBlKSB7XG4gICAgICAgIC8vMiBhcmdzLCBmaXJzdCBhcmcgaXMgbm90IGVsZW1cbiAgICAgICAgZWxlbSA9IGNvbXBvbmVudC4kbm9kZVswXTtcbiAgICAgICAgZXZlbnRUeXBlID0gZXZlbnRBcmdzWzBdO1xuICAgICAgICBpZiAoYWN0aW9uID09IFwidHJpZ2dlclwiKSB7XG4gICAgICAgICAgcGF5bG9hZCA9IGV2ZW50QXJnc1sxXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8yKyBhcmdzLCBmaXJzdCBhcmcgaXMgZWxlbVxuICAgICAgICBlbGVtID0gZXZlbnRBcmdzWzBdO1xuICAgICAgICBldmVudFR5cGUgPSBldmVudEFyZ3NbMV07XG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJ0cmlnZ2VyXCIpIHtcbiAgICAgICAgICBwYXlsb2FkID0gZXZlbnRBcmdzWzJdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5hbWUgPSB0eXBlb2YgZXZlbnRUeXBlID09ICdvYmplY3QnID8gZXZlbnRUeXBlLnR5cGUgOiBldmVudFR5cGU7XG5cbiAgICAgIGxvZ0ZpbHRlciA9IERFQlVHLmV2ZW50cy5sb2dGaWx0ZXI7XG5cbiAgICAgIC8vIG5vIHJlZ2V4IGZvciB5b3UsIGFjdGlvbnMuLi5cbiAgICAgIGFjdGlvbkxvZ2dhYmxlID0gbG9nRmlsdGVyLmFjdGlvbnMgPT0gJ2FsbCcgfHwgKGxvZ0ZpbHRlci5hY3Rpb25zLmluZGV4T2YoYWN0aW9uKSA+IC0xKTtcbiAgICAgIC8vIGV2ZW50IG5hbWUgZmlsdGVyIGFsbG93IHdpbGRjYXJkcyBvciByZWdleC4uLlxuICAgICAgdG9SZWdFeHAgPSBmdW5jdGlvbihleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLnRlc3QgPyBleHByIDogbmV3IFJlZ0V4cCgnXicgKyBleHByLnJlcGxhY2UoL1xcKi9nLCAnLionKSArICckJyk7XG4gICAgICB9O1xuICAgICAgbmFtZUxvZ2dhYmxlID1cbiAgICAgICAgbG9nRmlsdGVyLmV2ZW50TmFtZXMgPT0gJ2FsbCcgfHxcbiAgICAgICAgbG9nRmlsdGVyLmV2ZW50TmFtZXMuc29tZShmdW5jdGlvbihlKSB7cmV0dXJuIHRvUmVnRXhwKGUpLnRlc3QobmFtZSk7fSk7XG5cbiAgICAgIGlmIChhY3Rpb25Mb2dnYWJsZSAmJiBuYW1lTG9nZ2FibGUpIHtcbiAgICAgICAgaW5mbyA9IFthY3Rpb25TeW1ib2xzW2FjdGlvbl0sIGFjdGlvbiwgJ1snICsgbmFtZSArICddJ107XG4gICAgICAgIHBheWxvYWQgJiYgaW5mby5wdXNoKHBheWxvYWQpO1xuICAgICAgICBpbmZvLnB1c2goZWxlbVRvU3RyaW5nKGVsZW0pKTtcbiAgICAgICAgaW5mby5wdXNoKGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5kZXNjcmliZS5zcGxpdCgnICcpLnNsaWNlKDAsMykuam9pbignICcpKTtcbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCAmJiBhY3Rpb24gPT0gJ3RyaWdnZXInICYmIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoYWN0aW9uLCBuYW1lKTtcbiAgICAgICAgLy8gSUU5IGRvZXNuJ3QgZGVmaW5lIGBhcHBseWAgZm9yIGNvbnNvbGUgbWV0aG9kcywgYnV0IHRoaXMgd29ya3MgZXZlcnl3aGVyZTpcbiAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5pbmZvLCBjb25zb2xlLCBpbmZvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3aXRoTG9nZ2luZygpIHtcbiAgICAgIHRoaXMuYmVmb3JlKCd0cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvZygndHJpZ2dlcicsIHRoaXMsIHV0aWxzLnRvQXJyYXkoYXJndW1lbnRzKSk7XG4gICAgICB9KTtcbiAgICAgIGlmIChjb25zb2xlLmdyb3VwQ29sbGFwc2VkKSB7XG4gICAgICAgIHRoaXMuYWZ0ZXIoJ3RyaWdnZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5iZWZvcmUoJ29uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvZygnb24nLCB0aGlzLCB1dGlscy50b0FycmF5KGFyZ3VtZW50cykpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmJlZm9yZSgnb2ZmJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvZygnb2ZmJywgdGhpcywgdXRpbHMudG9BcnJheShhcmd1bWVudHMpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB3aXRoTG9nZ2luZztcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiA2ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtdLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyA9IGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIHBhcnNlRXZlbnRBcmdzKGluc3RhbmNlLCBhcmdzKSB7XG4gICAgICB2YXIgZWxlbWVudCwgdHlwZSwgY2FsbGJhY2s7XG4gICAgICB2YXIgZW5kID0gYXJncy5sZW5ndGg7XG5cbiAgICAgIGlmICh0eXBlb2YgYXJnc1tlbmQgLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVuZCAtPSAxO1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3NbZW5kXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBhcmdzW2VuZCAtIDFdID09ICdvYmplY3QnKSB7XG4gICAgICAgIGVuZCAtPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5kID09IDIpIHtcbiAgICAgICAgZWxlbWVudCA9IGFyZ3NbMF07XG4gICAgICAgIHR5cGUgPSBhcmdzWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudCA9IGluc3RhbmNlLm5vZGU7XG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2hFdmVudChhLCBiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAoYS5lbGVtZW50ID09IGIuZWxlbWVudCkgJiZcbiAgICAgICAgKGEudHlwZSA9PSBiLnR5cGUpICYmXG4gICAgICAgIChiLmNhbGxiYWNrID09IG51bGwgfHwgKGEuY2FsbGJhY2sgPT0gYi5jYWxsYmFjaykpXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJlZ2lzdHJ5KCkge1xuXG4gICAgICB2YXIgcmVnaXN0cnkgPSB0aGlzO1xuXG4gICAgICAodGhpcy5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxJbnN0YW5jZXMgPSB7fTtcbiAgICAgICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgICAgIH0pLmNhbGwodGhpcyk7XG5cbiAgICAgIGZ1bmN0aW9uIENvbXBvbmVudEluZm8oY29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICAgICAgICB0aGlzLmF0dGFjaGVkVG8gPSBbXTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSB7fTtcblxuICAgICAgICB0aGlzLmFkZEluc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2VJbmZvID0gbmV3IEluc3RhbmNlSW5mbyhpbnN0YW5jZSk7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZXNbaW5zdGFuY2UuaWRlbnRpdHldID0gaW5zdGFuY2VJbmZvO1xuICAgICAgICAgIHRoaXMuYXR0YWNoZWRUby5wdXNoKGluc3RhbmNlLm5vZGUpO1xuXG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlSW5mbztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlbW92ZUluc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5pbnN0YW5jZXNbaW5zdGFuY2UuaWRlbnRpdHldO1xuICAgICAgICAgIHZhciBpbmRleE9mTm9kZSA9IHRoaXMuYXR0YWNoZWRUby5pbmRleE9mKGluc3RhbmNlLm5vZGUpO1xuICAgICAgICAgIChpbmRleE9mTm9kZSA+IC0xKSAmJiB0aGlzLmF0dGFjaGVkVG8uc3BsaWNlKGluZGV4T2ZOb2RlLCAxKTtcblxuICAgICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5pbnN0YW5jZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgLy9pZiBJIGhvbGQgbm8gbW9yZSBpbnN0YW5jZXMgcmVtb3ZlIG1lIGZyb20gcmVnaXN0cnlcbiAgICAgICAgICAgIHJlZ2lzdHJ5LnJlbW92ZUNvbXBvbmVudEluZm8odGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBdHRhY2hlZFRvID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmF0dGFjaGVkVG8uaW5kZXhPZihub2RlKSA+IC0xO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBJbnN0YW5jZUluZm8oaW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWRkQmluZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5ldmVudHMucHVzaChldmVudCk7XG4gICAgICAgICAgcmVnaXN0cnkuZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQmluZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGU7IGUgPSB0aGlzLmV2ZW50c1tpXTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hFdmVudChlLCBldmVudCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hZGRJbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmZpbmRDb21wb25lbnRJbmZvKGluc3RhbmNlKTtcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRJbmZvKGluc3RhbmNlLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluc3QgPSBjb21wb25lbnQuYWRkSW5zdGFuY2UoaW5zdGFuY2UpO1xuXG4gICAgICAgIHRoaXMuYWxsSW5zdGFuY2VzW2luc3RhbmNlLmlkZW50aXR5XSA9IGluc3Q7XG5cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMucmVtb3ZlSW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAvL3JlbW92ZSBmcm9tIGNvbXBvbmVudCBpbmZvXG4gICAgICAgIHZhciBjb21wb25lbnRJbmZvID0gdGhpcy5maW5kQ29tcG9uZW50SW5mbyhpbnN0YW5jZSk7XG4gICAgICAgIGNvbXBvbmVudEluZm8gJiYgY29tcG9uZW50SW5mby5yZW1vdmVJbnN0YW5jZShpbnN0YW5jZSk7XG5cbiAgICAgICAgLy9yZW1vdmUgZnJvbSByZWdpc3RyeVxuICAgICAgICBkZWxldGUgdGhpcy5hbGxJbnN0YW5jZXNbaW5zdGFuY2UuaWRlbnRpdHldO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnRJbmZvID0gZnVuY3Rpb24oY29tcG9uZW50SW5mbykge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnRJbmZvKTtcbiAgICAgICAgKGluZGV4ID4gLTEpICYmIHRoaXMuY29tcG9uZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5maW5kQ29tcG9uZW50SW5mbyA9IGZ1bmN0aW9uKHdoaWNoKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSB3aGljaC5hdHRhY2hUbyA/IHdoaWNoIDogd2hpY2guY29uc3RydWN0b3I7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGM7IGMgPSB0aGlzLmNvbXBvbmVudHNbaV07IGkrKykge1xuICAgICAgICAgIGlmIChjLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZmluZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsbEluc3RhbmNlc1tpbnN0YW5jZS5pZGVudGl0eV0gfHwgbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZ2V0Qm91bmRFdmVudE5hbWVzID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluc3RhbmNlSW5mbyhpbnN0YW5jZSkuZXZlbnRzLm1hcChmdW5jdGlvbihldikge1xuICAgICAgICAgIHJldHVybiBldi50eXBlO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZmluZEluc3RhbmNlSW5mb0J5Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmFsbEluc3RhbmNlcykuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgdmFyIHRoaXNJbnN0YW5jZUluZm8gPSB0aGlzLmFsbEluc3RhbmNlc1trXTtcbiAgICAgICAgICBpZiAodGhpc0luc3RhbmNlSW5mby5pbnN0YW5jZS5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzSW5zdGFuY2VJbmZvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcblxuICAgICAgdGhpcy5vbiA9IGZ1bmN0aW9uKGNvbXBvbmVudE9uKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHJlZ2lzdHJ5LmZpbmRJbnN0YW5jZUluZm8odGhpcyksIGJvdW5kQ2FsbGJhY2s7XG5cbiAgICAgICAgLy8gdW5wYWNraW5nIGFyZ3VtZW50cyBieSBoYW5kIGJlbmNobWFya2VkIGZhc3RlclxuICAgICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGgsIGkgPSAxO1xuICAgICAgICB2YXIgb3RoZXJBcmdzID0gbmV3IEFycmF5KGwgLSAxKTtcbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBvdGhlckFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgYm91bmRDYWxsYmFjayA9IGNvbXBvbmVudE9uLmFwcGx5KG51bGwsIG90aGVyQXJncyk7XG4gICAgICAgICAgaWYgKGJvdW5kQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIG90aGVyQXJnc1tvdGhlckFyZ3MubGVuZ3RoIC0gMV0gPSBib3VuZENhbGxiYWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZXZlbnQgPSBwYXJzZUV2ZW50QXJncyh0aGlzLCBvdGhlckFyZ3MpO1xuICAgICAgICAgIGluc3RhbmNlLmFkZEJpbmQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLm9mZiA9IGZ1bmN0aW9uKC8qZWwsIHR5cGUsIGNhbGxiYWNrKi8pIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gcGFyc2VFdmVudEFyZ3ModGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgICAgIGluc3RhbmNlID0gcmVnaXN0cnkuZmluZEluc3RhbmNlSW5mbyh0aGlzKTtcblxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS5yZW1vdmVCaW5kKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcmVtb3ZlIGZyb20gZ2xvYmFsIGV2ZW50IHJlZ2lzdHJ5XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBlOyBlID0gcmVnaXN0cnkuZXZlbnRzW2ldOyBpKyspIHtcbiAgICAgICAgICBpZiAobWF0Y2hFdmVudChlLCBldmVudCkpIHtcbiAgICAgICAgICAgIHJlZ2lzdHJ5LmV2ZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBkZWJ1ZyB0b29scyBtYXkgd2FudCB0byBhZGQgYWR2aWNlIHRvIHRyaWdnZXJcbiAgICAgIHJlZ2lzdHJ5LnRyaWdnZXIgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgICB0aGlzLnRlYXJkb3duID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlZ2lzdHJ5LnJlbW92ZUluc3RhbmNlKHRoaXMpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53aXRoUmVnaXN0cmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWZ0ZXIoJ2luaXRpYWxpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZWdpc3RyeS5hZGRJbnN0YW5jZSh0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hcm91bmQoJ29uJywgcmVnaXN0cnkub24pO1xuICAgICAgICB0aGlzLmFmdGVyKCdvZmYnLCByZWdpc3RyeS5vZmYpO1xuICAgICAgICAvL2RlYnVnIHRvb2xzIG1heSB3YW50IHRvIGFkZCBhZHZpY2UgdG8gdHJpZ2dlclxuICAgICAgICB3aW5kb3cuREVCVUcgJiYgKGZhbHNlKS5lbmFibGVkICYmIHRoaXMuYWZ0ZXIoJ3RyaWdnZXInLCByZWdpc3RyeS50cmlnZ2VyKTtcbiAgICAgICAgdGhpcy5hZnRlcigndGVhcmRvd24nLCB7b2JqOiByZWdpc3RyeSwgZm5OYW1lOiAndGVhcmRvd24nfSk7XG4gICAgICB9O1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZWdpc3RyeTtcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiA3ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtfX3dlYnBhY2tfcmVxdWlyZV9fKDQpXSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gPSBmdW5jdGlvbihkZWJ1Zykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBERUZBVUxUX0lOVEVSVkFMID0gMTAwO1xuXG4gICAgZnVuY3Rpb24gY2FuV3JpdGVQcm90ZWN0KCkge1xuICAgICAgdmFyIHdyaXRlUHJvdGVjdFN1cHBvcnRlZCA9IGRlYnVnLmVuYWJsZWQgJiYgIU9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJyk7XG4gICAgICBpZiAod3JpdGVQcm90ZWN0U3VwcG9ydGVkKSB7XG4gICAgICAgIC8vSUU4IGdldE93blByb3BlcnR5RGVzY3JpcHRvciBpcyBidWlsdC1pbiBidXQgdGhyb3dzIGV4ZXB0aW9uIG9uIG5vbiBET00gb2JqZWN0c1xuICAgICAgICB0cnkge1xuICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LCAna2V5cycpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdyaXRlUHJvdGVjdFN1cHBvcnRlZDtcbiAgICB9XG5cbiAgICB2YXIgdXRpbHMgPSB7XG5cbiAgICAgIGlzRG9tT2JqOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICEhKG9iai5ub2RlVHlwZSB8fCAob2JqID09PSB3aW5kb3cpKTtcbiAgICAgIH0sXG5cbiAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uKG9iaiwgZnJvbSkge1xuICAgICAgICBmcm9tID0gZnJvbSB8fCAwO1xuICAgICAgICB2YXIgbGVuID0gb2JqLmxlbmd0aCwgYXJyID0gbmV3IEFycmF5KGxlbiAtIGZyb20pO1xuICAgICAgICBmb3IgKHZhciBpID0gZnJvbTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgYXJyW2kgLSBmcm9tXSA9IG9ialtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgfSxcblxuICAgICAgLy8gcmV0dXJucyBuZXcgb2JqZWN0IHJlcHJlc2VudGluZyBtdWx0aXBsZSBvYmplY3RzIG1lcmdlZCB0b2dldGhlclxuICAgICAgLy8gb3B0aW9uYWwgZmluYWwgYXJndW1lbnQgaXMgYm9vbGVhbiB3aGljaCBzcGVjaWZpZXMgaWYgbWVyZ2UgaXMgcmVjdXJzaXZlXG4gICAgICAvLyBvcmlnaW5hbCBvYmplY3RzIGFyZSB1bm1vZGlmaWVkXG4gICAgICAvL1xuICAgICAgLy8gdXNhZ2U6XG4gICAgICAvLyAgIHZhciBiYXNlID0ge2E6MiwgYjo2fTtcbiAgICAgIC8vICAgdmFyIGV4dHJhID0ge2I6MywgYzo0fTtcbiAgICAgIC8vICAgbWVyZ2UoYmFzZSwgZXh0cmEpOyAvL3thOjIsIGI6MywgYzo0fVxuICAgICAgLy8gICBiYXNlOyAvL3thOjIsIGI6Nn1cbiAgICAgIC8vXG4gICAgICAvLyAgIHZhciBiYXNlID0ge2E6MiwgYjo2fTtcbiAgICAgIC8vICAgdmFyIGV4dHJhID0ge2I6MywgYzo0fTtcbiAgICAgIC8vICAgdmFyIGV4dHJhRXh0cmEgPSB7YTo0LCBkOjl9O1xuICAgICAgLy8gICBtZXJnZShiYXNlLCBleHRyYSwgZXh0cmFFeHRyYSk7IC8ve2E6NCwgYjozLCBjOjQuIGQ6IDl9XG4gICAgICAvLyAgIGJhc2U7IC8ve2E6MiwgYjo2fVxuICAgICAgLy9cbiAgICAgIC8vICAgdmFyIGJhc2UgPSB7YToyLCBiOntiYjo0LCBjYzo1fX07XG4gICAgICAvLyAgIHZhciBleHRyYSA9IHthOjQsIGI6e2NjOjcsIGRkOjF9fTtcbiAgICAgIC8vICAgbWVyZ2UoYmFzZSwgZXh0cmEsIHRydWUpOyAvL3thOjQsIGI6e2JiOjQsIGNjOjcsIGRkOjF9fVxuICAgICAgLy8gICBiYXNlOyAvL3thOjIsIGI6e2JiOjQsIGNjOjV9fTtcblxuICAgICAgbWVyZ2U6IGZ1bmN0aW9uKC8qb2JqMSwgb2JqMiwuLi4uZGVlcENvcHkqLykge1xuICAgICAgICAvLyB1bnBhY2tpbmcgYXJndW1lbnRzIGJ5IGhhbmQgYmVuY2htYXJrZWQgZmFzdGVyXG4gICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobCArIDEpO1xuXG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2kgKyAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc3RhcnQgd2l0aCBlbXB0eSBvYmplY3Qgc28gYSBjb3B5IGlzIGNyZWF0ZWRcbiAgICAgICAgYXJnc1swXSA9IHt9O1xuXG4gICAgICAgIGlmIChhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09IHRydWUpIHtcbiAgICAgICAgICAvL2pxdWVyeSBleHRlbmQgcmVxdWlyZXMgZGVlcCBjb3B5IGFzIGZpcnN0IGFyZ1xuICAgICAgICAgIGFyZ3MucG9wKCk7XG4gICAgICAgICAgYXJncy51bnNoaWZ0KHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICB9LFxuXG4gICAgICAvLyB1cGRhdGVzIGJhc2UgaW4gcGxhY2UgYnkgY29weWluZyBwcm9wZXJ0aWVzIG9mIGV4dHJhIHRvIGl0XG4gICAgICAvLyBvcHRpb25hbGx5IGNsb2JiZXIgcHJvdGVjdGVkXG4gICAgICAvLyB1c2FnZTpcbiAgICAgIC8vICAgdmFyIGJhc2UgPSB7YToyLCBiOjZ9O1xuICAgICAgLy8gICB2YXIgZXh0cmEgPSB7Yzo0fTtcbiAgICAgIC8vICAgcHVzaChiYXNlLCBleHRyYSk7IC8ve2E6MiwgYjo2LCBjOjR9XG4gICAgICAvLyAgIGJhc2U7IC8ve2E6MiwgYjo2LCBjOjR9XG4gICAgICAvL1xuICAgICAgLy8gICB2YXIgYmFzZSA9IHthOjIsIGI6Nn07XG4gICAgICAvLyAgIHZhciBleHRyYSA9IHtiOiA0IGM6NH07XG4gICAgICAvLyAgIHB1c2goYmFzZSwgZXh0cmEsIHRydWUpOyAvL0Vycm9yIChcInV0aWxzLnB1c2ggYXR0ZW1wdGVkIHRvIG92ZXJ3cml0ZSAnYicgd2hpbGUgcnVubmluZyBpbiBwcm90ZWN0ZWQgbW9kZVwiKVxuICAgICAgLy8gICBiYXNlOyAvL3thOjIsIGI6Nn1cbiAgICAgIC8vXG4gICAgICAvLyBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5IHdpbGwgbWVyZ2UgcmVjdXJzaXZlbHkgd2hlbiBwcm90ZWN0IGlzIGZhbHNlXG4gICAgICAvLyBlZzpcbiAgICAgIC8vIHZhciBiYXNlID0ge2E6MTYsIGI6e2JiOjQsIGNjOjEwfX07XG4gICAgICAvLyB2YXIgZXh0cmEgPSB7Yjp7Y2M6MjUsIGRkOjE5fSwgYzo1fTtcbiAgICAgIC8vIHB1c2goYmFzZSwgZXh0cmEpOyAvL3thOjE2LCB7YmI6NCwgY2M6MjUsIGRkOjE5fSwgYzo1fVxuICAgICAgLy9cbiAgICAgIHB1c2g6IGZ1bmN0aW9uKGJhc2UsIGV4dHJhLCBwcm90ZWN0KSB7XG4gICAgICAgIGlmIChiYXNlKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoZXh0cmEgfHwge30pLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAoYmFzZVtrZXldICYmIHByb3RlY3QpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1dGlscy5wdXNoIGF0dGVtcHRlZCB0byBvdmVyd3JpdGUgXCInICsga2V5ICsgJ1wiIHdoaWxlIHJ1bm5pbmcgaW4gcHJvdGVjdGVkIG1vZGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBiYXNlW2tleV0gPT0gJ29iamVjdCcgJiYgdHlwZW9mIGV4dHJhW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICAgICAgICB0aGlzLnB1c2goYmFzZVtrZXldLCBleHRyYVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIG5vIHByb3RlY3QsIHNvIGV4dHJhIHdpbnNcbiAgICAgICAgICAgICAgYmFzZVtrZXldID0gZXh0cmFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiYXNlO1xuICAgICAgfSxcblxuICAgICAgLy8gSWYgb2JqLmtleSBwb2ludHMgdG8gYW4gZW51bWVyYWJsZSBwcm9wZXJ0eSwgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgLy8gSWYgb2JqLmtleSBwb2ludHMgdG8gYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSwgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgZ2V0RW51bWVyYWJsZVByb3BlcnR5OiBmdW5jdGlvbihvYmosIGtleSkge1xuICAgICAgICByZXR1cm4gb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSkgPyBvYmpba2V5XSA6IHVuZGVmaW5lZDtcbiAgICAgIH0sXG5cbiAgICAgIC8vIGJ1aWxkIGEgZnVuY3Rpb24gZnJvbSBvdGhlciBmdW5jdGlvbihzKVxuICAgICAgLy8gdXRpbHMuY29tcG9zZShhLGIsYykgLT4gYShiKGMoKSkpO1xuICAgICAgLy8gaW1wbGVtZW50YXRpb24gbGlmdGVkIGZyb20gdW5kZXJzY29yZS5qcyAoYykgMjAwOS0yMDEyIEplcmVteSBBc2hrZW5hc1xuICAgICAgY29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gZnVuY3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLy8gQ2FuIG9ubHkgdW5pcXVlIGFycmF5cyBvZiBob21vZ2VuZW91cyBwcmltaXRpdmVzLCBlLmcuIGFuIGFycmF5IG9mIG9ubHkgc3RyaW5ncywgYW4gYXJyYXkgb2Ygb25seSBib29sZWFucywgb3IgYW4gYXJyYXkgb2Ygb25seSBudW1lcmljc1xuICAgICAgdW5pcXVlQXJyYXk6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICAgIHZhciB1ID0ge30sIGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgIGlmICh1Lmhhc093blByb3BlcnR5KGFycmF5W2ldKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYS5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICB1W2FycmF5W2ldXSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH0sXG5cbiAgICAgIGRlYm91bmNlOiBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3YWl0ICE9ICdudW1iZXInKSB7XG4gICAgICAgICAgd2FpdCA9IERFRkFVTFRfSU5URVJWQUw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGltZW91dCwgcmVzdWx0O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblxuICAgICAgICAgIHRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblxuICAgICAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICB0aHJvdHRsZTogZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgICAgICBpZiAodHlwZW9mIHdhaXQgIT0gJ251bWJlcicpIHtcbiAgICAgICAgICB3YWl0ID0gREVGQVVMVF9JTlRFUlZBTDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb250ZXh0LCBhcmdzLCB0aW1lb3V0LCB0aHJvdHRsaW5nLCBtb3JlLCByZXN1bHQ7XG4gICAgICAgIHZhciB3aGVuRG9uZSA9IHRoaXMuZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbW9yZSA9IHRocm90dGxpbmcgPSBmYWxzZTtcbiAgICAgICAgfSwgd2FpdCk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnRleHQgPSB0aGlzOyBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAobW9yZSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hlbkRvbmUoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRocm90dGxpbmcpIHtcbiAgICAgICAgICAgIG1vcmUgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdHRsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgd2hlbkRvbmUoKTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgY291bnRUaGVuOiBmdW5jdGlvbihudW0sIGJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1udW0pIHsgcmV0dXJuIGJhc2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgZGVsZWdhdGU6IGZ1bmN0aW9uKHJ1bGVzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlLCBkYXRhKSB7XG4gICAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpLCBwYXJlbnQ7XG5cbiAgICAgICAgICBPYmplY3Qua2V5cyhydWxlcykuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAgICAgaWYgKCFlLmlzUHJvcGFnYXRpb25TdG9wcGVkKCkgJiYgKHBhcmVudCA9IHRhcmdldC5jbG9zZXN0KHNlbGVjdG9yKSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQgPSBkYXRhLmVsID0gcGFyZW50WzBdO1xuICAgICAgICAgICAgICByZXR1cm4gcnVsZXNbc2VsZWN0b3JdLmFwcGx5KHRoaXMsIFtlLCBkYXRhXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICAvLyBlbnN1cmVzIHRoYXQgYSBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgY2FsbGVkIG9uY2UuXG4gICAgICAvLyB1c2FnZTpcbiAgICAgIC8vIHdpbGwgb25seSBjcmVhdGUgdGhlIGFwcGxpY2F0aW9uIG9uY2VcbiAgICAgIC8vICAgdmFyIGluaXRpYWxpemUgPSB1dGlscy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKVxuICAgICAgLy8gICAgIGluaXRpYWxpemUoKTtcbiAgICAgIC8vICAgICBpbml0aWFsaXplKCk7XG4gICAgICAvL1xuICAgICAgLy8gd2lsbCBvbmx5IGRlbGV0ZSBhIHJlY29yZCBvbmNlXG4gICAgICAvLyAgIHZhciBteUhhbmxkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgICAgJC5hamF4KHt0eXBlOiAnREVMRVRFJywgdXJsOiAnc29tZXVybC5jb20nLCBkYXRhOiB7aWQ6IDF9fSk7XG4gICAgICAvLyAgIH07XG4gICAgICAvLyAgIHRoaXMub24oJ2NsaWNrJywgdXRpbHMub25jZShteUhhbmRsZXIpKTtcbiAgICAgIC8vXG4gICAgICBvbmNlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgIHZhciByYW4sIHJlc3VsdDtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHJhbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByYW4gPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICBwcm9wZXJ0eVdyaXRhYmlsaXR5OiBmdW5jdGlvbihvYmosIHByb3AsIHdyaXRhYmxlKSB7XG4gICAgICAgIGlmIChjYW5Xcml0ZVByb3RlY3QoKSAmJiBvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7IHdyaXRhYmxlOiB3cml0YWJsZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gUHJvcGVydHkgbG9ja2luZy91bmxvY2tpbmdcbiAgICAgIG11dGF0ZVByb3BlcnR5OiBmdW5jdGlvbihvYmosIHByb3AsIG9wKSB7XG4gICAgICAgIHZhciB3cml0YWJsZTtcblxuICAgICAgICBpZiAoIWNhbldyaXRlUHJvdGVjdCgpIHx8ICFvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBvcC5jYWxsKG9iaik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd3JpdGFibGUgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCkud3JpdGFibGU7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgeyB3cml0YWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgb3AuY2FsbChvYmopO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7IHdyaXRhYmxlOiB3cml0YWJsZSB9KTtcblxuICAgICAgfVxuXG4gICAgfTtcblxuICAgIHJldHVybiB1dGlscztcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH0sXG4vKiA4ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIENvcHlyaWdodCAyMDEzIFR3aXR0ZXIsIEluYy4gTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUICovXG5cbiEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpLFxuICAgIF9fd2VicGFja19yZXF1aXJlX18oNiksXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxuICBdLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyA9IGZ1bmN0aW9uKHV0aWxzLCByZWdpc3RyeSwgZGVidWcpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBjb21tb24gbWl4aW4gYWxsb2NhdGVzIGJhc2ljIGZ1bmN0aW9uYWxpdHkgLSB1c2VkIGJ5IGFsbCBjb21wb25lbnQgcHJvdG90eXBlc1xuICAgIC8vIGNhbGxiYWNrIGNvbnRleHQgaXMgYm91bmQgdG8gY29tcG9uZW50XG4gICAgdmFyIGNvbXBvbmVudElkID0gMDtcblxuICAgIGZ1bmN0aW9uIHRlYXJkb3duSW5zdGFuY2UoaW5zdGFuY2VJbmZvKSB7XG4gICAgICBpbnN0YW5jZUluZm8uZXZlbnRzLnNsaWNlKCkuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgYXJncyA9IFtldmVudC50eXBlXTtcblxuICAgICAgICBldmVudC5lbGVtZW50ICYmIGFyZ3MudW5zaGlmdChldmVudC5lbGVtZW50KTtcbiAgICAgICAgKHR5cGVvZiBldmVudC5jYWxsYmFjayA9PSAnZnVuY3Rpb24nKSAmJiBhcmdzLnB1c2goZXZlbnQuY2FsbGJhY2spO1xuXG4gICAgICAgIHRoaXMub2ZmLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfSwgaW5zdGFuY2VJbmZvLmluc3RhbmNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1NlcmlhbGl6YWJsZSh0eXBlLCBkYXRhKSB7XG4gICAgICB0cnkge1xuICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoZGF0YSwgJyonKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVidWcud2Fybi5jYWxsKHRoaXMsIFtcbiAgICAgICAgICAnRXZlbnQgXCInLCB0eXBlLCAnXCIgd2FzIHRyaWdnZXJlZCB3aXRoIG5vbi1zZXJpYWxpemFibGUgZGF0YS4gJyxcbiAgICAgICAgICAnRmxpZ2h0IHJlY29tbWVuZHMgeW91IGF2b2lkIHBhc3Npbmcgbm9uLXNlcmlhbGl6YWJsZSBkYXRhIGluIGV2ZW50cy4nXG4gICAgICAgIF0uam9pbignJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm5BYm91dFJlZmVyZW5jZVR5cGUoa2V5KSB7XG4gICAgICBkZWJ1Zy53YXJuLmNhbGwodGhpcywgW1xuICAgICAgICAnQXR0cmlidXRlIFwiJywga2V5LCAnXCIgZGVmYXVsdHMgdG8gYW4gYXJyYXkgb3Igb2JqZWN0LiAnLFxuICAgICAgICAnRW5jbG9zZSB0aGlzIGluIGEgZnVuY3Rpb24gdG8gYXZvaWQgc2hhcmluZyBiZXR3ZWVuIGNvbXBvbmVudCBpbnN0YW5jZXMuJ1xuICAgICAgXS5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdEF0dHJpYnV0ZXMoYXR0cnMpIHtcbiAgICAgIHZhciBkZWZpbmVkS2V5cyA9IFtdLCBpbmNvbWluZ0tleXM7XG5cbiAgICAgIHRoaXMuYXR0ciA9IG5ldyB0aGlzLmF0dHJEZWY7XG5cbiAgICAgIGlmIChkZWJ1Zy5lbmFibGVkICYmIHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmF0dHJEZWYucHJvdG90eXBlKSB7XG4gICAgICAgICAgZGVmaW5lZEtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGluY29taW5nS2V5cyA9IE9iamVjdC5rZXlzKGF0dHJzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gaW5jb21pbmdLZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGRlZmluZWRLZXlzLmluZGV4T2YoaW5jb21pbmdLZXlzW2ldKSA9PSAtMSkge1xuICAgICAgICAgICAgZGVidWcud2Fybi5jYWxsKHRoaXMsICdQYXNzZWQgdW51c2VkIGF0dHJpYnV0ZSBcIicgKyBpbmNvbWluZ0tleXNbaV0gKyAnXCIuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuYXR0ckRlZi5wcm90b3R5cGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyc1trZXldID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYXR0cltrZXldID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIGF0dHJpYnV0ZSBcIicgKyBrZXkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdcIiBub3Qgc3BlY2lmaWVkIGluIGF0dGFjaFRvIGZvciBjb21wb25lbnQgXCInICsgdGhpcy50b1N0cmluZygpICsgJ1wiLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBXYXJuIGFib3V0IHJlZmVyZW5jZSB0eXBlcyBpbiBhdHRyaWJ1dGVzXG4gICAgICAgICAgaWYgKGRlYnVnLmVuYWJsZWQgJiYgdHlwZW9mIHRoaXMuYXR0cltrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgd2FybkFib3V0UmVmZXJlbmNlVHlwZS5jYWxsKHRoaXMsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXR0cltrZXldID0gYXR0cnNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hdHRyW2tleV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuYXR0cltrZXldID0gdGhpcy5hdHRyW2tleV0uY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdERlcHJlY2F0ZWRBdHRyaWJ1dGVzKGF0dHJzKSB7XG4gICAgICAvLyBtZXJnZSBkZWZhdWx0cyB3aXRoIHN1cHBsaWVkIG9wdGlvbnNcbiAgICAgIC8vIHB1dCBvcHRpb25zIGluIGF0dHIuX19wcm90b19fIHRvIGF2b2lkIG1lcmdlIG92ZXJoZWFkXG4gICAgICB2YXIgYXR0ciA9IE9iamVjdC5jcmVhdGUoYXR0cnMpO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5kZWZhdWx0cykge1xuICAgICAgICBpZiAoIWF0dHJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBhdHRyW2tleV0gPSB0aGlzLmRlZmF1bHRzW2tleV07XG4gICAgICAgICAgLy8gV2FybiBhYm91dCByZWZlcmVuY2UgdHlwZXMgaW4gZGVmYXVsdEF0dHJzXG4gICAgICAgICAgaWYgKGRlYnVnLmVuYWJsZWQgJiYgdHlwZW9mIHRoaXMuZGVmYXVsdHNba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHdhcm5BYm91dFJlZmVyZW5jZVR5cGUuY2FsbCh0aGlzLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dHIgPSBhdHRyO1xuXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzIHx8IHt9KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAodGhpcy5kZWZhdWx0c1trZXldID09PSBudWxsICYmIHRoaXMuYXR0cltrZXldID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCBhdHRyaWJ1dGUgXCInICsga2V5ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiIG5vdCBzcGVjaWZpZWQgaW4gYXR0YWNoVG8gZm9yIGNvbXBvbmVudCBcIicgKyB0aGlzLnRvU3RyaW5nKCkgKyAnXCIuJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb3h5RXZlbnRUbyh0YXJnZXRFdmVudCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUsIGRhdGEpIHtcbiAgICAgICAgJChlLnRhcmdldCkudHJpZ2dlcih0YXJnZXRFdmVudCwgZGF0YSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdpdGhCYXNlKCkge1xuXG4gICAgICAvLyBkZWxlZ2F0ZSB0cmlnZ2VyLCBiaW5kIGFuZCB1bmJpbmQgdG8gYW4gZWxlbWVudFxuICAgICAgLy8gaWYgJGVsZW1lbnQgbm90IHN1cHBsaWVkLCB1c2UgY29tcG9uZW50J3Mgbm9kZVxuICAgICAgLy8gb3RoZXIgYXJndW1lbnRzIGFyZSBwYXNzZWQgb25cbiAgICAgIC8vIGV2ZW50IGNhbiBiZSBlaXRoZXIgYSBzdHJpbmcgc3BlY2lmeWluZyB0aGUgdHlwZVxuICAgICAgLy8gb2YgdGhlIGV2ZW50LCBvciBhIGhhc2ggc3BlY2lmeWluZyBib3RoIHRoZSB0eXBlXG4gICAgICAvLyBhbmQgYSBkZWZhdWx0IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZC5cbiAgICAgIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQsIHR5cGUsIGRhdGEsIGV2ZW50LCBkZWZhdWx0Rm47XG4gICAgICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMSwgbGFzdEFyZyA9IGFyZ3VtZW50c1tsYXN0SW5kZXhdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbGFzdEFyZyAhPSAnc3RyaW5nJyAmJiAhKGxhc3RBcmcgJiYgbGFzdEFyZy5kZWZhdWx0QmVoYXZpb3IpKSB7XG4gICAgICAgICAgbGFzdEluZGV4LS07XG4gICAgICAgICAgZGF0YSA9IGxhc3RBcmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFzdEluZGV4ID09IDEpIHtcbiAgICAgICAgICAkZWxlbWVudCA9ICQoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBldmVudCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkZWxlbWVudCA9IHRoaXMuJG5vZGU7XG4gICAgICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdEJlaGF2aW9yKSB7XG4gICAgICAgICAgZGVmYXVsdEZuID0gZXZlbnQuZGVmYXVsdEJlaGF2aW9yO1xuICAgICAgICAgIGV2ZW50ID0gJC5FdmVudChldmVudC50eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSBldmVudC50eXBlIHx8IGV2ZW50O1xuXG4gICAgICAgIGlmIChkZWJ1Zy5lbmFibGVkICYmIHdpbmRvdy5wb3N0TWVzc2FnZSkge1xuICAgICAgICAgIGNoZWNrU2VyaWFsaXphYmxlLmNhbGwodGhpcywgdHlwZSwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXR0ci5ldmVudERhdGEgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBkYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuYXR0ci5ldmVudERhdGEsIGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW1lbnQudHJpZ2dlcigoZXZlbnQgfHwgdHlwZSksIGRhdGEpO1xuXG4gICAgICAgIGlmIChkZWZhdWx0Rm4gJiYgIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgKHRoaXNbZGVmYXVsdEZuXSB8fCBkZWZhdWx0Rm4pLmNhbGwodGhpcywgZXZlbnQsIGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRlbGVtZW50O1xuICAgICAgfTtcblxuXG4gICAgICB0aGlzLm9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkZWxlbWVudCwgdHlwZSwgY2FsbGJhY2ssIG9yaWdpbmFsQ2I7XG4gICAgICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMSwgb3JpZ2luID0gYXJndW1lbnRzW2xhc3RJbmRleF07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW4gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvL2RlbGVnYXRlIGNhbGxiYWNrXG4gICAgICAgICAgb3JpZ2luYWxDYiA9IHV0aWxzLmRlbGVnYXRlKFxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlRGVsZWdhdGVSdWxlcyhvcmlnaW4pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3JpZ2luID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgb3JpZ2luYWxDYiA9IHByb3h5RXZlbnRUbyhvcmlnaW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9yaWdpbmFsQ2IgPSBvcmlnaW47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFzdEluZGV4ID09IDIpIHtcbiAgICAgICAgICAkZWxlbWVudCA9ICQoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB0eXBlID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRlbGVtZW50ID0gdGhpcy4kbm9kZTtcbiAgICAgICAgICB0eXBlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbENiICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9yaWdpbmFsQ2IgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBiaW5kIHRvIFwiJyArIHR5cGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnXCIgYmVjYXVzZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24gb3IgYW4gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayA9IG9yaWdpbmFsQ2IuYmluZCh0aGlzKTtcbiAgICAgICAgY2FsbGJhY2sudGFyZ2V0ID0gb3JpZ2luYWxDYjtcbiAgICAgICAgY2FsbGJhY2suY29udGV4dCA9IHRoaXM7XG5cbiAgICAgICAgJGVsZW1lbnQub24odHlwZSwgY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIHN0b3JlIGV2ZXJ5IGJvdW5kIHZlcnNpb24gb2YgdGhlIGNhbGxiYWNrXG4gICAgICAgIG9yaWdpbmFsQ2IuYm91bmQgfHwgKG9yaWdpbmFsQ2IuYm91bmQgPSBbXSk7XG4gICAgICAgIG9yaWdpbmFsQ2IuYm91bmQucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5vZmYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRlbGVtZW50LCB0eXBlLCBjYWxsYmFjaztcbiAgICAgICAgdmFyIGxhc3RJbmRleCA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2xhc3RJbmRleF0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2xhc3RJbmRleF07XG4gICAgICAgICAgbGFzdEluZGV4IC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFzdEluZGV4ID09IDEpIHtcbiAgICAgICAgICAkZWxlbWVudCA9ICQoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB0eXBlID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRlbGVtZW50ID0gdGhpcy4kbm9kZTtcbiAgICAgICAgICB0eXBlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgLy90aGlzIGNhbGxiYWNrIG1heSBiZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gb3IgYSBib3VuZCB2ZXJzaW9uXG4gICAgICAgICAgdmFyIGJvdW5kRnVuY3Rpb25zID0gY2FsbGJhY2sudGFyZ2V0ID8gY2FsbGJhY2sudGFyZ2V0LmJvdW5kIDogY2FsbGJhY2suYm91bmQgfHwgW107XG4gICAgICAgICAgLy9zZXQgY2FsbGJhY2sgdG8gdmVyc2lvbiBib3VuZCBhZ2FpbnN0IHRoaXMgaW5zdGFuY2VcbiAgICAgICAgICBib3VuZEZ1bmN0aW9ucyAmJiBib3VuZEZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuLCBpLCBhcnIpIHtcbiAgICAgICAgICAgIGlmIChmbi5jb250ZXh0ICYmICh0aGlzLmlkZW50aXR5ID09IGZuLmNvbnRleHQuaWRlbnRpdHkpKSB7XG4gICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrID0gZm47XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICRlbGVtZW50Lm9mZih0eXBlLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBldmVudHMgb2YgYHRoaXNgIGluc3RhbmNlXG4gICAgICAgICAgLy8gYW5kIHVuYmluZCB1c2luZyB0aGUgY2FsbGJhY2tcbiAgICAgICAgICByZWdpc3RyeS5maW5kSW5zdGFuY2VJbmZvKHRoaXMpLmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAkZWxlbWVudC5vZmYodHlwZSwgZXZlbnQuY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRlbGVtZW50O1xuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNvbHZlRGVsZWdhdGVSdWxlcyA9IGZ1bmN0aW9uKHJ1bGVJbmZvKSB7XG4gICAgICAgIHZhciBydWxlcyA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHJ1bGVJbmZvKS5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICBpZiAoIShyIGluIHRoaXMuYXR0cikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IFwiJyArIHRoaXMudG9TdHJpbmcoKSArICdcIiB3YW50cyB0byBsaXN0ZW4gb24gXCInICsgciArICdcIiBidXQgbm8gc3VjaCBhdHRyaWJ1dGUgd2FzIGRlZmluZWQuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJ1bGVzW3RoaXMuYXR0cltyXV0gPSAodHlwZW9mIHJ1bGVJbmZvW3JdID09ICdzdHJpbmcnKSA/IHByb3h5RXZlbnRUbyhydWxlSW5mb1tyXSkgOiBydWxlSW5mb1tyXTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHJ1bGVzO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5zZWxlY3QgPSBmdW5jdGlvbihhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJG5vZGUuZmluZCh0aGlzLmF0dHJbYXR0cmlidXRlS2V5XSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBOZXctc3R5bGUgYXR0cmlidXRlc1xuXG4gICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBmdW5jdGlvbihhdHRycykge1xuXG4gICAgICAgIHZhciBBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgICBpZiAodGhpcy5hdHRyRGVmKSB7XG4gICAgICAgICAgQXR0cmlidXRlcy5wcm90b3R5cGUgPSBuZXcgdGhpcy5hdHRyRGVmO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIEF0dHJpYnV0ZXMucHJvdG90eXBlW25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF0dHJEZWYgPSBBdHRyaWJ1dGVzO1xuICAgICAgfTtcblxuICAgICAgLy8gRGVwcmVjYXRlZCBhdHRyaWJ1dGVzXG5cbiAgICAgIHRoaXMuZGVmYXVsdEF0dHJzID0gZnVuY3Rpb24oZGVmYXVsdHMpIHtcbiAgICAgICAgdXRpbHMucHVzaCh0aGlzLmRlZmF1bHRzLCBkZWZhdWx0cywgdHJ1ZSkgfHwgKHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmluaXRpYWxpemUgPSBmdW5jdGlvbihub2RlLCBhdHRycykge1xuICAgICAgICBhdHRycyA9IGF0dHJzIHx8IHt9O1xuICAgICAgICB0aGlzLmlkZW50aXR5IHx8ICh0aGlzLmlkZW50aXR5ID0gY29tcG9uZW50SWQrKyk7XG5cbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbmVlZHMgYSBub2RlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZS5qcXVlcnkpIHtcbiAgICAgICAgICB0aGlzLm5vZGUgPSBub2RlWzBdO1xuICAgICAgICAgIHRoaXMuJG5vZGUgPSBub2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgICAgdGhpcy4kbm9kZSA9ICQobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdHRyRGVmKSB7XG4gICAgICAgICAgaW5pdEF0dHJpYnV0ZXMuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5pdERlcHJlY2F0ZWRBdHRyaWJ1dGVzLmNhbGwodGhpcywgYXR0cnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnRlYXJkb3duID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRlYXJkb3duSW5zdGFuY2UocmVnaXN0cnkuZmluZEluc3RhbmNlSW5mbyh0aGlzKSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB3aXRoQmFzZTtcbiAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpO1xuXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICAvLyBTZXR1cCByZWdleCAgYXNzaWdubWVudHNcbiAgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgYWNjb3JkaW5nIHRvIE11c3RhY2hlIHNwZWNcbiAgdmFyIHJJc1doaXRlc3BhY2UgPSAvXFxTLyxcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcbiAgICAgIHJOZXdsaW5lID0gIC9cXG4vZyxcbiAgICAgIHJDciA9IC9cXHIvZyxcbiAgICAgIHJTbGFzaCA9IC9cXFxcL2csXG4gICAgICByTGluZVNlcCA9IC9cXHUyMDI4LyxcbiAgICAgIHJQYXJhZ3JhcGhTZXAgPSAvXFx1MjAyOS87XG5cbiAgSG9nYW4udGFncyA9IHtcbiAgICAnIyc6IDEsICdeJzogMiwgJzwnOiAzLCAnJCc6IDQsXG4gICAgJy8nOiA1LCAnISc6IDYsICc+JzogNywgJz0nOiA4LCAnX3YnOiA5LFxuICAgICd7JzogMTAsICcmJzogMTEsICdfdCc6IDEyXG4gIH07XG5cbiAgSG9nYW4uc2NhbiA9IGZ1bmN0aW9uIHNjYW4odGV4dCwgZGVsaW1pdGVycykge1xuICAgIHZhciBsZW4gPSB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgSU5fVEVYVCA9IDAsXG4gICAgICAgIElOX1RBR19UWVBFID0gMSxcbiAgICAgICAgSU5fVEFHID0gMixcbiAgICAgICAgc3RhdGUgPSBJTl9URVhULFxuICAgICAgICB0YWdUeXBlID0gbnVsbCxcbiAgICAgICAgdGFnID0gbnVsbCxcbiAgICAgICAgYnVmID0gJycsXG4gICAgICAgIHRva2VucyA9IFtdLFxuICAgICAgICBzZWVuVGFnID0gZmFsc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsaW5lU3RhcnQgPSAwLFxuICAgICAgICBvdGFnID0gJ3t7JyxcbiAgICAgICAgY3RhZyA9ICd9fSc7XG5cbiAgICBmdW5jdGlvbiBhZGRCdWYoKSB7XG4gICAgICBpZiAoYnVmLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogJ190JywgdGV4dDogbmV3IFN0cmluZyhidWYpfSk7XG4gICAgICAgIGJ1ZiA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVJc1doaXRlc3BhY2UoKSB7XG4gICAgICB2YXIgaXNBbGxXaGl0ZXNwYWNlID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGogPSBsaW5lU3RhcnQ7IGogPCB0b2tlbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaXNBbGxXaGl0ZXNwYWNlID1cbiAgICAgICAgICAoSG9nYW4udGFnc1t0b2tlbnNbal0udGFnXSA8IEhvZ2FuLnRhZ3NbJ192J10pIHx8XG4gICAgICAgICAgKHRva2Vuc1tqXS50YWcgPT0gJ190JyAmJiB0b2tlbnNbal0udGV4dC5tYXRjaChySXNXaGl0ZXNwYWNlKSA9PT0gbnVsbCk7XG4gICAgICAgIGlmICghaXNBbGxXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0FsbFdoaXRlc3BhY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyTGluZShoYXZlU2VlblRhZywgbm9OZXdMaW5lKSB7XG4gICAgICBhZGRCdWYoKTtcblxuICAgICAgaWYgKGhhdmVTZWVuVGFnICYmIGxpbmVJc1doaXRlc3BhY2UoKSkge1xuICAgICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0LCBuZXh0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKHRva2Vuc1tqXS50ZXh0KSB7XG4gICAgICAgICAgICBpZiAoKG5leHQgPSB0b2tlbnNbaisxXSkgJiYgbmV4dC50YWcgPT0gJz4nKSB7XG4gICAgICAgICAgICAgIC8vIHNldCBpbmRlbnQgdG8gdG9rZW4gdmFsdWVcbiAgICAgICAgICAgICAgbmV4dC5pbmRlbnQgPSB0b2tlbnNbal0udGV4dC50b1N0cmluZygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghbm9OZXdMaW5lKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6J1xcbid9KTtcbiAgICAgIH1cblxuICAgICAgc2VlblRhZyA9IGZhbHNlO1xuICAgICAgbGluZVN0YXJ0ID0gdG9rZW5zLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VEZWxpbWl0ZXJzKHRleHQsIGluZGV4KSB7XG4gICAgICB2YXIgY2xvc2UgPSAnPScgKyBjdGFnLFxuICAgICAgICAgIGNsb3NlSW5kZXggPSB0ZXh0LmluZGV4T2YoY2xvc2UsIGluZGV4KSxcbiAgICAgICAgICBkZWxpbWl0ZXJzID0gdHJpbShcbiAgICAgICAgICAgIHRleHQuc3Vic3RyaW5nKHRleHQuaW5kZXhPZignPScsIGluZGV4KSArIDEsIGNsb3NlSW5kZXgpXG4gICAgICAgICAgKS5zcGxpdCgnICcpO1xuXG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzW2RlbGltaXRlcnMubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiBjbG9zZUluZGV4ICsgY2xvc2UubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGVsaW1pdGVycykge1xuICAgICAgZGVsaW1pdGVycyA9IGRlbGltaXRlcnMuc3BsaXQoJyAnKTtcbiAgICAgIG90YWcgPSBkZWxpbWl0ZXJzWzBdO1xuICAgICAgY3RhZyA9IGRlbGltaXRlcnNbMV07XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoc3RhdGUgPT0gSU5fVEVYVCkge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKG90YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgLS1pO1xuICAgICAgICAgIGFkZEJ1ZigpO1xuICAgICAgICAgIHN0YXRlID0gSU5fVEFHX1RZUEU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRleHQuY2hhckF0KGkpID09ICdcXG4nKSB7XG4gICAgICAgICAgICBmaWx0ZXJMaW5lKHNlZW5UYWcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09IElOX1RBR19UWVBFKSB7XG4gICAgICAgIGkgKz0gb3RhZy5sZW5ndGggLSAxO1xuICAgICAgICB0YWcgPSBIb2dhbi50YWdzW3RleHQuY2hhckF0KGkgKyAxKV07XG4gICAgICAgIHRhZ1R5cGUgPSB0YWcgPyB0ZXh0LmNoYXJBdChpICsgMSkgOiAnX3YnO1xuICAgICAgICBpZiAodGFnVHlwZSA9PSAnPScpIHtcbiAgICAgICAgICBpID0gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZSA9IElOX1RBRztcbiAgICAgICAgfVxuICAgICAgICBzZWVuVGFnID0gaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YWdDaGFuZ2UoY3RhZywgdGV4dCwgaSkpIHtcbiAgICAgICAgICB0b2tlbnMucHVzaCh7dGFnOiB0YWdUeXBlLCBuOiB0cmltKGJ1ZiksIG90YWc6IG90YWcsIGN0YWc6IGN0YWcsXG4gICAgICAgICAgICAgICAgICAgICAgIGk6ICh0YWdUeXBlID09ICcvJykgPyBzZWVuVGFnIC0gb3RhZy5sZW5ndGggOiBpICsgY3RhZy5sZW5ndGh9KTtcbiAgICAgICAgICBidWYgPSAnJztcbiAgICAgICAgICBpICs9IGN0YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJ3snKSB7XG4gICAgICAgICAgICBpZiAoY3RhZyA9PSAnfX0nKSB7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNsZWFuVHJpcGxlU3RhY2hlKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJMaW5lKHNlZW5UYWcsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuVHJpcGxlU3RhY2hlKHRva2VuKSB7XG4gICAgaWYgKHRva2VuLm4uc3Vic3RyKHRva2VuLm4ubGVuZ3RoIC0gMSkgPT09ICd9Jykge1xuICAgICAgdG9rZW4ubiA9IHRva2VuLm4uc3Vic3RyaW5nKDAsIHRva2VuLm4ubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgaWYgKHMudHJpbSkge1xuICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRhZ0NoYW5nZSh0YWcsIHRleHQsIGluZGV4KSB7XG4gICAgaWYgKHRleHQuY2hhckF0KGluZGV4KSAhPSB0YWcuY2hhckF0KDApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSB0YWcubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGV4dC5jaGFyQXQoaW5kZXggKyBpKSAhPSB0YWcuY2hhckF0KGkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHRoZSB0YWdzIGFsbG93ZWQgaW5zaWRlIHN1cGVyIHRlbXBsYXRlc1xuICB2YXIgYWxsb3dlZEluU3VwZXIgPSB7J190JzogdHJ1ZSwgJ1xcbic6IHRydWUsICckJzogdHJ1ZSwgJy8nOiB0cnVlfTtcblxuICBmdW5jdGlvbiBidWlsZFRyZWUodG9rZW5zLCBraW5kLCBzdGFjaywgY3VzdG9tVGFncykge1xuICAgIHZhciBpbnN0cnVjdGlvbnMgPSBbXSxcbiAgICAgICAgb3BlbmVyID0gbnVsbCxcbiAgICAgICAgdGFpbCA9IG51bGwsXG4gICAgICAgIHRva2VuID0gbnVsbDtcblxuICAgIHRhaWwgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblxuICAgICAgaWYgKHRhaWwgJiYgdGFpbC50YWcgPT0gJzwnICYmICEodG9rZW4udGFnIGluIGFsbG93ZWRJblN1cGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgY29udGVudCBpbiA8IHN1cGVyIHRhZy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEhvZ2FuLnRhZ3NbdG9rZW4udGFnXSA8PSBIb2dhbi50YWdzWyckJ10gfHwgaXNPcGVuZXIodG9rZW4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICB0b2tlbi5ub2RlcyA9IGJ1aWxkVHJlZSh0b2tlbnMsIHRva2VuLnRhZywgc3RhY2ssIGN1c3RvbVRhZ3MpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJy8nKSB7XG4gICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nsb3NpbmcgdGFnIHdpdGhvdXQgb3BlbmVyOiAvJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lciA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAodG9rZW4ubiAhPSBvcGVuZXIubiAmJiAhaXNDbG9zZXIodG9rZW4ubiwgb3BlbmVyLm4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0aW5nIGVycm9yOiAnICsgb3BlbmVyLm4gKyAnIHZzLiAnICsgdG9rZW4ubik7XG4gICAgICAgIH1cbiAgICAgICAgb3BlbmVyLmVuZCA9IHRva2VuLmk7XG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gICAgICB9IGVsc2UgaWYgKHRva2VuLnRhZyA9PSAnXFxuJykge1xuICAgICAgICB0b2tlbi5sYXN0ID0gKHRva2Vucy5sZW5ndGggPT0gMCkgfHwgKHRva2Vuc1swXS50YWcgPT0gJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICBpbnN0cnVjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgfVxuXG4gICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyBjbG9zaW5nIHRhZzogJyArIHN0YWNrLnBvcCgpLm4pO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gIH1cblxuICBmdW5jdGlvbiBpc09wZW5lcih0b2tlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLm8gPT0gdG9rZW4ubikge1xuICAgICAgICB0b2tlbi50YWcgPSAnIyc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ2xvc2VyKGNsb3NlLCBvcGVuLCB0YWdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0YWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRhZ3NbaV0uYyA9PSBjbG9zZSAmJiB0YWdzW2ldLm8gPT0gb3Blbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKG9iaikge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGl0ZW1zLnB1c2goJ1wiJyArIGVzYyhrZXkpICsgJ1wiOiBmdW5jdGlvbihjLHAsdCxpKSB7JyArIG9ialtrZXldICsgJ30nKTtcbiAgICB9XG4gICAgcmV0dXJuIFwieyBcIiArIGl0ZW1zLmpvaW4oXCIsXCIpICsgXCIgfVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikge1xuICAgIHZhciBwYXJ0aWFscyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBjb2RlT2JqLnBhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFscy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjp7bmFtZTpcIicgKyBlc2MoY29kZU9iai5wYXJ0aWFsc1trZXldLm5hbWUpICsgJ1wiLCAnICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iai5wYXJ0aWFsc1trZXldKSArIFwifVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIFwicGFydGlhbHM6IHtcIiArIHBhcnRpYWxzLmpvaW4oXCIsXCIpICsgXCJ9LCBzdWJzOiBcIiArIHN0cmluZ2lmeVN1YnN0aXR1dGlvbnMoY29kZU9iai5zdWJzKTtcbiAgfVxuXG4gIEhvZ2FuLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKGNvZGVPYmosIHRleHQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gXCJ7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IFwiICsgSG9nYW4ud3JhcE1haW4oY29kZU9iai5jb2RlKSArIFwiIH0sXCIgKyBzdHJpbmdpZnlQYXJ0aWFscyhjb2RlT2JqKSArICBcIn1cIjtcbiAgfVxuXG4gIHZhciBzZXJpYWxObyA9IDA7XG4gIEhvZ2FuLmdlbmVyYXRlID0gZnVuY3Rpb24odHJlZSwgdGV4dCwgb3B0aW9ucykge1xuICAgIHNlcmlhbE5vID0gMDtcbiAgICB2YXIgY29udGV4dCA9IHsgY29kZTogJycsIHN1YnM6IHt9LCBwYXJ0aWFsczoge30gfTtcbiAgICBIb2dhbi53YWxrKHRyZWUsIGNvbnRleHQpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXNTdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeShjb250ZXh0LCB0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlVGVtcGxhdGUoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi53cmFwTWFpbiA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gJ3ZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7JyArIGNvZGUgKyAncmV0dXJuIHQuZmwoKTsnO1xuICB9XG5cbiAgSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcblxuICBIb2dhbi5tYWtlVGVtcGxhdGUgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5tYWtlUGFydGlhbHMoY29kZU9iaik7XG4gICAgdGVtcGxhdGUuY29kZSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ2knLCB0aGlzLndyYXBNYWluKGNvZGVPYmouY29kZSkpO1xuICAgIHJldHVybiBuZXcgdGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZSwgdGV4dCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi5tYWtlUGFydGlhbHMgPSBmdW5jdGlvbihjb2RlT2JqKSB7XG4gICAgdmFyIGtleSwgdGVtcGxhdGUgPSB7c3Viczoge30sIHBhcnRpYWxzOiBjb2RlT2JqLnBhcnRpYWxzLCBuYW1lOiBjb2RlT2JqLm5hbWV9O1xuICAgIGZvciAoa2V5IGluIHRlbXBsYXRlLnBhcnRpYWxzKSB7XG4gICAgICB0ZW1wbGF0ZS5wYXJ0aWFsc1trZXldID0gdGhpcy5tYWtlUGFydGlhbHModGVtcGxhdGUucGFydGlhbHNba2V5XSk7XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGNvZGVPYmouc3Vicykge1xuICAgICAgdGVtcGxhdGUuc3Vic1trZXldID0gbmV3IEZ1bmN0aW9uKCdjJywgJ3AnLCAndCcsICdpJywgY29kZU9iai5zdWJzW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBlc2Mocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoclNsYXNoLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoclF1b3QsICdcXFxcXFxcIicpXG4gICAgICAgICAgICAucmVwbGFjZShyTmV3bGluZSwgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJDciwgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJMaW5lU2VwLCAnXFxcXHUyMDI4JylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJQYXJhZ3JhcGhTZXAsICdcXFxcdTIwMjknKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNob29zZU1ldGhvZChzKSB7XG4gICAgcmV0dXJuICh+cy5pbmRleE9mKCcuJykpID8gJ2QnIDogJ2YnO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGFydGlhbChub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIHByZWZpeCA9IFwiPFwiICsgKGNvbnRleHQucHJlZml4IHx8IFwiXCIpO1xuICAgIHZhciBzeW0gPSBwcmVmaXggKyBub2RlLm4gKyBzZXJpYWxObysrO1xuICAgIGNvbnRleHQucGFydGlhbHNbc3ltXSA9IHtuYW1lOiBub2RlLm4sIHBhcnRpYWxzOiB7fX07XG4gICAgY29udGV4dC5jb2RlICs9ICd0LmIodC5ycChcIicgKyAgZXNjKHN5bSkgKyAnXCIsYyxwLFwiJyArIChub2RlLmluZGVudCB8fCAnJykgKyAnXCIpKTsnO1xuICAgIHJldHVybiBzeW07XG4gIH1cblxuICBIb2dhbi5jb2RlZ2VuID0ge1xuICAgICcjJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZih0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAnYyxwLDAsJyArIG5vZGUuaSArICcsJyArIG5vZGUuZW5kICsgJyxcIicgKyBub2RlLm90YWcgKyBcIiBcIiArIG5vZGUuY3RhZyArICdcIikpeycgK1xuICAgICAgICAgICAgICAgICAgICAgICd0LnJzKGMscCwnICsgJ2Z1bmN0aW9uKGMscCx0KXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfSk7Yy5wb3AoKTt9JztcbiAgICB9LFxuXG4gICAgJ14nOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ2lmKCF0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSxjLHAsMSwwLDAsXCJcIikpeyc7XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGNvbnRleHQpO1xuICAgICAgY29udGV4dC5jb2RlICs9ICd9Oyc7XG4gICAgfSxcblxuICAgICc+JzogY3JlYXRlUGFydGlhbCxcbiAgICAnPCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7cGFydGlhbHM6IHt9LCBjb2RlOiAnJywgc3Viczoge30sIGluUGFydGlhbDogdHJ1ZX07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBjb250ZXh0LnBhcnRpYWxzW2NyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCldO1xuICAgICAgdGVtcGxhdGUuc3VicyA9IGN0eC5zdWJzO1xuICAgICAgdGVtcGxhdGUucGFydGlhbHMgPSBjdHgucGFydGlhbHM7XG4gICAgfSxcblxuICAgICckJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgdmFyIGN0eCA9IHtzdWJzOiB7fSwgY29kZTogJycsIHBhcnRpYWxzOiBjb250ZXh0LnBhcnRpYWxzLCBwcmVmaXg6IG5vZGUubn07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICBjb250ZXh0LnN1YnNbbm9kZS5uXSA9IGN0eC5jb2RlO1xuICAgICAgaWYgKCFjb250ZXh0LmluUGFydGlhbCkge1xuICAgICAgICBjb250ZXh0LmNvZGUgKz0gJ3Quc3ViKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCxpKTsnO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnXFxuJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIlxcXFxuXCInICsgKG5vZGUubGFzdCA/ICcnIDogJyArIGknKSk7XG4gICAgfSxcblxuICAgICdfdic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudih0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgICB9LFxuXG4gICAgJ190JzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIicgKyBlc2Mobm9kZS50ZXh0KSArICdcIicpO1xuICAgIH0sXG5cbiAgICAneyc6IHRyaXBsZVN0YWNoZSxcblxuICAgICcmJzogdHJpcGxlU3RhY2hlXG4gIH1cblxuICBmdW5jdGlvbiB0cmlwbGVTdGFjaGUobm9kZSwgY29udGV4dCkge1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudCh0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlKHMpIHtcbiAgICByZXR1cm4gJ3QuYignICsgcyArICcpOyc7XG4gIH1cblxuICBIb2dhbi53YWxrID0gZnVuY3Rpb24obm9kZWxpc3QsIGNvbnRleHQpIHtcbiAgICB2YXIgZnVuYztcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZnVuYyA9IEhvZ2FuLmNvZGVnZW5bbm9kZWxpc3RbaV0udGFnXTtcbiAgICAgIGZ1bmMgJiYgZnVuYyhub2RlbGlzdFtpXSwgY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgSG9nYW4ucGFyc2UgPSBmdW5jdGlvbih0b2tlbnMsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4gYnVpbGRUcmVlKHRva2VucywgJycsIFtdLCBvcHRpb25zLnNlY3Rpb25UYWdzIHx8IFtdKTtcbiAgfVxuXG4gIEhvZ2FuLmNhY2hlID0ge307XG5cbiAgSG9nYW4uY2FjaGVLZXkgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFt0ZXh0LCAhIW9wdGlvbnMuYXNTdHJpbmcsICEhb3B0aW9ucy5kaXNhYmxlTGFtYmRhLCBvcHRpb25zLmRlbGltaXRlcnMsICEhb3B0aW9ucy5tb2RlbEdldF0uam9pbignfHwnKTtcbiAgfVxuXG4gIEhvZ2FuLmNvbXBpbGUgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGtleSA9IEhvZ2FuLmNhY2hlS2V5KHRleHQsIG9wdGlvbnMpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuY2FjaGVba2V5XTtcblxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgdmFyIHBhcnRpYWxzID0gdGVtcGxhdGUucGFydGlhbHM7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHBhcnRpYWxzKSB7XG4gICAgICAgIGRlbGV0ZSBwYXJ0aWFsc1tuYW1lXS5pbnN0YW5jZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSA9IHRoaXMuZ2VuZXJhdGUodGhpcy5wYXJzZSh0aGlzLnNjYW4odGV4dCwgb3B0aW9ucy5kZWxpbWl0ZXJzKSwgdGV4dCwgb3B0aW9ucyksIHRleHQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmNhY2hlW2tleV0gPSB0ZW1wbGF0ZTtcbiAgfVxufSkodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IEhvZ2FuKTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8gVGhpcyBmaWxlIGlzIGZvciB1c2Ugd2l0aCBOb2RlLmpzLiBTZWUgZGlzdC8gZm9yIGJyb3dzZXIgZmlsZXMuXG5cbnZhciBIb2dhbiA9IHJlcXVpcmUoJy4vY29tcGlsZXInKTtcbkhvZ2FuLlRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpLlRlbXBsYXRlO1xuSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcbm1vZHVsZS5leHBvcnRzID0gSG9nYW47XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbnZhciBIb2dhbiA9IHt9O1xuXG4oZnVuY3Rpb24gKEhvZ2FuKSB7XG4gIEhvZ2FuLlRlbXBsYXRlID0gZnVuY3Rpb24gKGNvZGVPYmosIHRleHQsIGNvbXBpbGVyLCBvcHRpb25zKSB7XG4gICAgY29kZU9iaiA9IGNvZGVPYmogfHwge307XG4gICAgdGhpcy5yID0gY29kZU9iai5jb2RlIHx8IHRoaXMucjtcbiAgICB0aGlzLmMgPSBjb21waWxlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudGV4dCA9IHRleHQgfHwgJyc7XG4gICAgdGhpcy5wYXJ0aWFscyA9IGNvZGVPYmoucGFydGlhbHMgfHwge307XG4gICAgdGhpcy5zdWJzID0gY29kZU9iai5zdWJzIHx8IHt9O1xuICAgIHRoaXMuYnVmID0gJyc7XG4gIH1cblxuICBIb2dhbi5UZW1wbGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgLy8gcmVuZGVyOiByZXBsYWNlZCBieSBnZW5lcmF0ZWQgY29kZS5cbiAgICByOiBmdW5jdGlvbiAoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkgeyByZXR1cm4gJyc7IH0sXG5cbiAgICAvLyB2YXJpYWJsZSBlc2NhcGluZ1xuICAgIHY6IGhvZ2FuRXNjYXBlLFxuXG4gICAgLy8gdHJpcGxlIHN0YWNoZVxuICAgIHQ6IGNvZXJjZVRvU3RyaW5nLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmkoW2NvbnRleHRdLCBwYXJ0aWFscyB8fCB7fSwgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGludGVybmFsIC0tIGEgaG9vayBmb3Igb3ZlcnJpZGVzIHRoYXQgY2F0Y2hlcyBwYXJ0aWFscyB0b29cbiAgICByaTogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIGVuc3VyZVBhcnRpYWxcbiAgICBlcDogZnVuY3Rpb24oc3ltYm9sLCBwYXJ0aWFscykge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLnBhcnRpYWxzW3N5bWJvbF07XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSB0aGF0IGlmIHdlJ3ZlIGluc3RhbnRpYXRlZCB0aGlzIHBhcnRpYWwgYmVmb3JlXG4gICAgICB2YXIgdGVtcGxhdGUgPSBwYXJ0aWFsc1twYXJ0aWFsLm5hbWVdO1xuICAgICAgaWYgKHBhcnRpYWwuaW5zdGFuY2UgJiYgcGFydGlhbC5iYXNlID09IHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBwYXJ0aWFsLmluc3RhbmNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICghdGhpcy5jKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gY29tcGlsZXIgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuYy5jb21waWxlKHRlbXBsYXRlLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UgdGhpcyB0byBjaGVjayB3aGV0aGVyIHRoZSBwYXJ0aWFscyBkaWN0aW9uYXJ5IGhhcyBjaGFuZ2VkXG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uYmFzZSA9IHRlbXBsYXRlO1xuXG4gICAgICBpZiAocGFydGlhbC5zdWJzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjb25zaWRlciBwYXJlbnQgdGVtcGxhdGUgbm93XG4gICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0KSBwYXJ0aWFscy5zdGFja1RleHQgPSB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gcGFydGlhbC5zdWJzKSB7XG4gICAgICAgICAgaWYgKCFwYXJ0aWFscy5zdGFja1RleHRba2V5XSkge1xuICAgICAgICAgICAgcGFydGlhbHMuc3RhY2tUZXh0W2tleV0gPSAodGhpcy5hY3RpdmVTdWIgIT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHBhcnRpYWxzLnN0YWNrVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlID0gY3JlYXRlU3BlY2lhbGl6ZWRQYXJ0aWFsKHRlbXBsYXRlLCBwYXJ0aWFsLnN1YnMsIHBhcnRpYWwucGFydGlhbHMsXG4gICAgICAgICAgdGhpcy5zdGFja1N1YnMsIHRoaXMuc3RhY2tQYXJ0aWFscywgcGFydGlhbHMuc3RhY2tUZXh0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbc3ltYm9sXS5pbnN0YW5jZSA9IHRlbXBsYXRlO1xuXG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfSxcblxuICAgIC8vIHRyaWVzIHRvIGZpbmQgYSBwYXJ0aWFsIGluIHRoZSBjdXJyZW50IHNjb3BlIGFuZCByZW5kZXIgaXRcbiAgICBycDogZnVuY3Rpb24oc3ltYm9sLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgcGFydGlhbCA9IHRoaXMuZXAoc3ltYm9sLCBwYXJ0aWFscyk7XG4gICAgICBpZiAoIXBhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydGlhbC5yaShjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGEgc2VjdGlvblxuICAgIHJzOiBmdW5jdGlvbihjb250ZXh0LCBwYXJ0aWFscywgc2VjdGlvbikge1xuICAgICAgdmFyIHRhaWwgPSBjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWlsKSkge1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhaWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29udGV4dC5wdXNoKHRhaWxbaV0pO1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgY29udGV4dC5wb3AoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gbWF5YmUgc3RhcnQgYSBzZWN0aW9uXG4gICAgczogZnVuY3Rpb24odmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHBhc3M7XG5cbiAgICAgIGlmIChpc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gdGhpcy5tcyh2YWwsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKTtcbiAgICAgIH1cblxuICAgICAgcGFzcyA9ICEhdmFsO1xuXG4gICAgICBpZiAoIWludmVydGVkICYmIHBhc3MgJiYgY3R4KSB7XG4gICAgICAgIGN0eC5wdXNoKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSA/IHZhbCA6IGN0eFtjdHgubGVuZ3RoIC0gMV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFzcztcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBkb3R0ZWQgbmFtZXNcbiAgICBkOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgZm91bmQsXG4gICAgICAgICAgbmFtZXMgPSBrZXkuc3BsaXQoJy4nKSxcbiAgICAgICAgICB2YWwgPSB0aGlzLmYobmFtZXNbMF0sIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0LFxuICAgICAgICAgIGN4ID0gbnVsbDtcblxuICAgICAgaWYgKGtleSA9PT0gJy4nICYmIGlzQXJyYXkoY3R4W2N0eC5sZW5ndGggLSAyXSkpIHtcbiAgICAgICAgdmFsID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3VuZCA9IGZpbmRJblNjb3BlKG5hbWVzW2ldLCB2YWwsIGRvTW9kZWxHZXQpO1xuICAgICAgICAgIGlmIChmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjeCA9IHZhbDtcbiAgICAgICAgICAgIHZhbCA9IGZvdW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJldHVybkZvdW5kICYmICF2YWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjdHgucHVzaChjeCk7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgICAgY3R4LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0sXG5cbiAgICAvLyBmaW5kIHZhbHVlcyB3aXRoIG5vcm1hbCBuYW1lc1xuICAgIGY6IGZ1bmN0aW9uKGtleSwgY3R4LCBwYXJ0aWFscywgcmV0dXJuRm91bmQpIHtcbiAgICAgIHZhciB2YWwgPSBmYWxzZSxcbiAgICAgICAgICB2ID0gbnVsbCxcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlLFxuICAgICAgICAgIGRvTW9kZWxHZXQgPSB0aGlzLm9wdGlvbnMubW9kZWxHZXQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSBjdHgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdiA9IGN0eFtpXTtcbiAgICAgICAgdmFsID0gZmluZEluU2NvcGUoa2V5LCB2LCBkb01vZGVsR2V0KTtcbiAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIChyZXR1cm5Gb3VuZCkgPyBmYWxzZSA6IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0dXJuRm91bmQgJiYgdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gaGlnaGVyIG9yZGVyIHRlbXBsYXRlc1xuICAgIGxzOiBmdW5jdGlvbihmdW5jLCBjeCwgcGFydGlhbHMsIHRleHQsIHRhZ3MpIHtcbiAgICAgIHZhciBvbGRUYWdzID0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnM7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gdGFncztcbiAgICAgIHRoaXMuYih0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKGZ1bmMuY2FsbChjeCwgdGV4dCkpLCBjeCwgcGFydGlhbHMpKTtcbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gb2xkVGFncztcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBjb21waWxlIHRleHRcbiAgICBjdDogZnVuY3Rpb24odGV4dCwgY3gsIHBhcnRpYWxzKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVMYW1iZGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYW1iZGEgZmVhdHVyZXMgZGlzYWJsZWQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jLmNvbXBpbGUodGV4dCwgdGhpcy5vcHRpb25zKS5yZW5kZXIoY3gsIHBhcnRpYWxzKTtcbiAgICB9LFxuXG4gICAgLy8gdGVtcGxhdGUgcmVzdWx0IGJ1ZmZlcmluZ1xuICAgIGI6IGZ1bmN0aW9uKHMpIHsgdGhpcy5idWYgKz0gczsgfSxcblxuICAgIGZsOiBmdW5jdGlvbigpIHsgdmFyIHIgPSB0aGlzLmJ1ZjsgdGhpcy5idWYgPSAnJzsgcmV0dXJuIHI7IH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSBzZWN0aW9uXG4gICAgbXM6IGZ1bmN0aW9uKGZ1bmMsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKSB7XG4gICAgICB2YXIgdGV4dFNvdXJjZSxcbiAgICAgICAgICBjeCA9IGN0eFtjdHgubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5jYWxsKGN4KTtcblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoaW52ZXJ0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0U291cmNlID0gKHRoaXMuYWN0aXZlU3ViICYmIHRoaXMuc3Vic1RleHQgJiYgdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0pID8gdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubHMocmVzdWx0LCBjeCwgcGFydGlhbHMsIHRleHRTb3VyY2Uuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCB0YWdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSB2YXJpYWJsZVxuICAgIG12OiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzKSB7XG4gICAgICB2YXIgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3QoY29lcmNlVG9TdHJpbmcocmVzdWx0LmNhbGwoY3gpKSwgY3gsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgc3ViOiBmdW5jdGlvbihuYW1lLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgZiA9IHRoaXMuc3Vic1tuYW1lXTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gbmFtZTtcbiAgICAgICAgZihjb250ZXh0LCBwYXJ0aWFscywgdGhpcywgaW5kZW50KTtcbiAgICAgICAgdGhpcy5hY3RpdmVTdWIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICAvL0ZpbmQgYSBrZXkgaW4gYW4gb2JqZWN0XG4gIGZ1bmN0aW9uIGZpbmRJblNjb3BlKGtleSwgc2NvcGUsIGRvTW9kZWxHZXQpIHtcbiAgICB2YXIgdmFsO1xuXG4gICAgaWYgKHNjb3BlICYmIHR5cGVvZiBzY29wZSA9PSAnb2JqZWN0Jykge1xuXG4gICAgICBpZiAoc2NvcGVba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlW2tleV07XG5cbiAgICAgIC8vIHRyeSBsb29rdXAgd2l0aCBnZXQgZm9yIGJhY2tib25lIG9yIHNpbWlsYXIgbW9kZWwgZGF0YVxuICAgICAgfSBlbHNlIGlmIChkb01vZGVsR2V0ICYmIHNjb3BlLmdldCAmJiB0eXBlb2Ygc2NvcGUuZ2V0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gc2NvcGUuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbChpbnN0YW5jZSwgc3VicywgcGFydGlhbHMsIHN0YWNrU3Vicywgc3RhY2tQYXJ0aWFscywgc3RhY2tUZXh0KSB7XG4gICAgZnVuY3Rpb24gUGFydGlhbFRlbXBsYXRlKCkge307XG4gICAgUGFydGlhbFRlbXBsYXRlLnByb3RvdHlwZSA9IGluc3RhbmNlO1xuICAgIGZ1bmN0aW9uIFN1YnN0aXR1dGlvbnMoKSB7fTtcbiAgICBTdWJzdGl0dXRpb25zLnByb3RvdHlwZSA9IGluc3RhbmNlLnN1YnM7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgcGFydGlhbCA9IG5ldyBQYXJ0aWFsVGVtcGxhdGUoKTtcbiAgICBwYXJ0aWFsLnN1YnMgPSBuZXcgU3Vic3RpdHV0aW9ucygpO1xuICAgIHBhcnRpYWwuc3Vic1RleHQgPSB7fTsgIC8vaGVoZS4gc3Vic3RleHQuXG4gICAgcGFydGlhbC5idWYgPSAnJztcblxuICAgIHN0YWNrU3VicyA9IHN0YWNrU3VicyB8fCB7fTtcbiAgICBwYXJ0aWFsLnN0YWNrU3VicyA9IHN0YWNrU3VicztcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0gc3RhY2tUZXh0O1xuICAgIGZvciAoa2V5IGluIHN1YnMpIHtcbiAgICAgIGlmICghc3RhY2tTdWJzW2tleV0pIHN0YWNrU3Vic1trZXldID0gc3Vic1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1N1YnMpIHtcbiAgICAgIHBhcnRpYWwuc3Vic1trZXldID0gc3RhY2tTdWJzW2tleV07XG4gICAgfVxuXG4gICAgc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1BhcnRpYWxzID0gc3RhY2tQYXJ0aWFscztcbiAgICBmb3IgKGtleSBpbiBwYXJ0aWFscykge1xuICAgICAgaWYgKCFzdGFja1BhcnRpYWxzW2tleV0pIHN0YWNrUGFydGlhbHNba2V5XSA9IHBhcnRpYWxzW2tleV07XG4gICAgfVxuICAgIGZvciAoa2V5IGluIHN0YWNrUGFydGlhbHMpIHtcbiAgICAgIHBhcnRpYWwucGFydGlhbHNba2V5XSA9IHN0YWNrUGFydGlhbHNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydGlhbDtcbiAgfVxuXG4gIHZhciByQW1wID0gLyYvZyxcbiAgICAgIHJMdCA9IC88L2csXG4gICAgICByR3QgPSAvPi9nLFxuICAgICAgckFwb3MgPSAvXFwnL2csXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICBoQ2hhcnMgPSAvWyY8PlxcXCJcXCddLztcblxuICBmdW5jdGlvbiBjb2VyY2VUb1N0cmluZyh2YWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKCh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpID8gJycgOiB2YWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gaG9nYW5Fc2NhcGUoc3RyKSB7XG4gICAgc3RyID0gY29lcmNlVG9TdHJpbmcoc3RyKTtcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XG4gICAgICBzdHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKHJHdCwgJyZndDsnKVxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XG4gICAgICBzdHI7XG4gIH1cblxuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCJ2YXIgRmxpZ2h0anMgPSByZXF1aXJlKCdmbGlnaHRqcycpO1xudmFyIGhlbGxvID0gcmVxdWlyZSgnaGVsbG93b3JsZCcpO1xuXG52YXIgc3RhcnQgPSArbmV3IERhdGUoKTtcblxuaGVsbG8ucmVuZGVyKCdNYXJzJyk7XG5jb25zb2xlLmxvZygrbmV3IERhdGUoKSAtIHN0YXJ0KTtcblxud2luZG93LkZsaWdodGpzID0gRmxpZ2h0anM7XG4iLCIvLyBUZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3RpdGxlLmhvZ2FuJyk7XG5cbi8vIHZhciBTdG9yZSA9IGZ1bmN0aW9uKCkge1xuLy8gICB0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4vLyAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuLy8gICAgIGV2ZW50LmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlKTtcbi8vICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuLy8gICB9XG4vL1xuLy8gICB0aGlzLmFkZCA9IGZ1bmN0aW9uKCkge1xuLy8gICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG4vLyAgIH07XG4vL1xuLy8gICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKSB7XG4vLyAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbi8vICAgfVxuLy8gfVxuXG52YXIgcmVuZGVyID0gZnVuY3Rpb24obmFtZSkge1xuXG4gIHZhciB0cmlnZ2VyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgZXZlbnQuaW5pdEV2ZW50KG5hbWUsIHRydWUsIHRydWUpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG4gIHZhciB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGl0bGVdJyk7XG5cbiAgdGl0bGVFbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5yZW5kZXIoe1xuICAgIG5hbWU6IG5hbWVcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICB0cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2NoYW5nZScpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlbmRlcjogcmVuZGVyLFxuICAvLyBzdG9yZTogU3RvcmVcbn1cbiIsInZhciBIb2dhbiA9IHJlcXVpcmUoJ2hvZ2FuLmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBIb2dhbi5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiSGVsbG8gXCIpO3QuYih0LnYodC5mKFwibmFtZVwiLGMscCwwKSkpO3QuYihcIiFcIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCJIZWxsbyB7eyBuYW1lIH19IVxcblwiLCBIb2dhbik7Il19
