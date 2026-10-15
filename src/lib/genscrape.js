/*! genscrape v1.6.1 (rootsdev/genscrape@316cccd4703c437b727a69c6f5c597b102e529f0) | MIT (c) Justin York | https://github.com/rootsdev/genscrape
 * Patched: innerHTML writes on detached nodes replaced with DOMParser (inert parsing); AMD detection disabled so a page-level define() cannot capture dependencies.
 * Unminified build: npm install --omit=dev && npx esbuild@0.24.0 src/main.js --bundle --format=iife --global-name=genscrape --platform=browser --target=es2017 --legal-comments=inline --define:define=undefined */
var genscrape = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/ms/index.js
  var require_ms = __commonJS({
    "node_modules/ms/index.js"(exports, module) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var y = d * 365.25;
      module.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse(val);
        } else if (type === "number" && isNaN(val) === false) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
        );
      };
      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
          str
        );
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        if (ms >= d) {
          return Math.round(ms / d) + "d";
        }
        if (ms >= h) {
          return Math.round(ms / h) + "h";
        }
        if (ms >= m) {
          return Math.round(ms / m) + "m";
        }
        if (ms >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
      }
      function plural(ms, n, name) {
        if (ms < n) {
          return;
        }
        if (ms < n * 1.5) {
          return Math.floor(ms / n) + " " + name;
        }
        return Math.ceil(ms / n) + " " + name + "s";
      }
    }
  });

  // node_modules/debug/src/debug.js
  var require_debug = __commonJS({
    "node_modules/debug/src/debug.js"(exports, module) {
      exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
      exports.coerce = coerce;
      exports.disable = disable;
      exports.enable = enable;
      exports.enabled = enabled;
      exports.humanize = require_ms();
      exports.names = [];
      exports.skips = [];
      exports.formatters = {};
      var prevTime;
      function selectColor(namespace) {
        var hash = 0, i;
        for (i in namespace) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return exports.colors[Math.abs(hash) % exports.colors.length];
      }
      function createDebug(namespace) {
        function debug() {
          if (!debug.enabled) return;
          var self = debug;
          var curr = +/* @__PURE__ */ new Date();
          var ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          args[0] = exports.coerce(args[0]);
          if ("string" !== typeof args[0]) {
            args.unshift("%O");
          }
          var index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
            if (match === "%%") return match;
            index++;
            var formatter = exports.formatters[format];
            if ("function" === typeof formatter) {
              var val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          exports.formatArgs.call(self, args);
          var logFn = debug.log || exports.log || console.log.bind(console);
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.enabled = exports.enabled(namespace);
        debug.useColors = exports.useColors();
        debug.color = selectColor(namespace);
        if ("function" === typeof exports.init) {
          exports.init(debug);
        }
        return debug;
      }
      function enable(namespaces) {
        exports.save(namespaces);
        exports.names = [];
        exports.skips = [];
        var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        var len = split.length;
        for (var i = 0; i < len; i++) {
          if (!split[i]) continue;
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            exports.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        exports.enable("");
      }
      function enabled(name) {
        var i, len;
        for (i = 0, len = exports.skips.length; i < len; i++) {
          if (exports.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = exports.names.length; i < len; i++) {
          if (exports.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;
        return val;
      }
    }
  });

  // node_modules/debug/src/browser.js
  var require_browser = __commonJS({
    "node_modules/debug/src/browser.js"(exports, module) {
      exports = module.exports = require_debug();
      exports.log = log;
      exports.formatArgs = formatArgs;
      exports.save = save;
      exports.load = load;
      exports.useColors = useColors;
      exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
      exports.colors = [
        "lightseagreen",
        "forestgreen",
        "goldenrod",
        "dodgerblue",
        "darkorchid",
        "crimson"
      ];
      function useColors() {
        if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
          return true;
        }
        return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
        typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
        typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
      }
      exports.formatters.j = function(v) {
        try {
          return JSON.stringify(v);
        } catch (err) {
          return "[UnexpectedJSONParseError]: " + err.message;
        }
      };
      function formatArgs(args) {
        var useColors2 = this.useColors;
        args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
        if (!useColors2) return;
        var c = "color: " + this.color;
        args.splice(1, 0, c, "color: inherit");
        var index = 0;
        var lastC = 0;
        args[0].replace(/%[a-zA-Z%]/g, function(match) {
          if ("%%" === match) return;
          index++;
          if ("%c" === match) {
            lastC = index;
          }
        });
        args.splice(lastC, 0, c);
      }
      function log() {
        return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
      }
      function save(namespaces) {
        try {
          if (null == namespaces) {
            exports.storage.removeItem("debug");
          } else {
            exports.storage.debug = namespaces;
          }
        } catch (e) {
        }
      }
      function load() {
        var r;
        try {
          r = exports.storage.debug;
        } catch (e) {
        }
        if (!r && typeof process !== "undefined" && "env" in process) {
          r = process.env.DEBUG;
        }
        return r;
      }
      exports.enable(load());
      function localstorage() {
        try {
          return window.localStorage;
        } catch (e) {
        }
      }
    }
  });

  // node_modules/eventemitter2/lib/eventemitter2.js
  var require_eventemitter2 = __commonJS({
    "node_modules/eventemitter2/lib/eventemitter2.js"(exports, module) {
      /*!
       * EventEmitter2
       * https://github.com/hij1nx/EventEmitter2
       *
       * Copyright (c) 2013 hij1nx
       * Licensed under the MIT license.
       */
      !function(undefined2) {
        var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
        var defaultMaxListeners = 10;
        function init() {
          this._events = {};
          if (this._conf) {
            configure.call(this, this._conf);
          }
        }
        function configure(conf) {
          if (conf) {
            this._conf = conf;
            conf.delimiter && (this.delimiter = conf.delimiter);
            conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
            conf.wildcard && (this.wildcard = conf.wildcard);
            conf.newListener && (this.newListener = conf.newListener);
            if (this.wildcard) {
              this.listenerTree = {};
            }
          }
        }
        function EventEmitter(conf) {
          this._events = {};
          this.newListener = false;
          configure.call(this, conf);
        }
        EventEmitter.EventEmitter2 = EventEmitter;
        function searchListenerTree(handlers, type, tree, i) {
          if (!tree) {
            return [];
          }
          var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];
          if (i === typeLength && tree._listeners) {
            if (typeof tree._listeners === "function") {
              handlers && handlers.push(tree._listeners);
              return [tree];
            } else {
              for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
                handlers && handlers.push(tree._listeners[leaf]);
              }
              return [tree];
            }
          }
          if (currentType === "*" || currentType === "**" || tree[currentType]) {
            if (currentType === "*") {
              for (branch in tree) {
                if (branch !== "_listeners" && tree.hasOwnProperty(branch)) {
                  listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 1));
                }
              }
              return listeners;
            } else if (currentType === "**") {
              endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === "*";
              if (endReached && tree._listeners) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
              }
              for (branch in tree) {
                if (branch !== "_listeners" && tree.hasOwnProperty(branch)) {
                  if (branch === "*" || branch === "**") {
                    if (tree[branch]._listeners && !endReached) {
                      listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
                    }
                    listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
                  } else if (branch === nextType) {
                    listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 2));
                  } else {
                    listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
                  }
                }
              }
              return listeners;
            }
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i + 1));
          }
          xTree = tree["*"];
          if (xTree) {
            searchListenerTree(handlers, type, xTree, i + 1);
          }
          xxTree = tree["**"];
          if (xxTree) {
            if (i < typeLength) {
              if (xxTree._listeners) {
                searchListenerTree(handlers, type, xxTree, typeLength);
              }
              for (branch in xxTree) {
                if (branch !== "_listeners" && xxTree.hasOwnProperty(branch)) {
                  if (branch === nextType) {
                    searchListenerTree(handlers, type, xxTree[branch], i + 2);
                  } else if (branch === currentType) {
                    searchListenerTree(handlers, type, xxTree[branch], i + 1);
                  } else {
                    isolatedBranch = {};
                    isolatedBranch[branch] = xxTree[branch];
                    searchListenerTree(handlers, type, { "**": isolatedBranch }, i + 1);
                  }
                }
              }
            } else if (xxTree._listeners) {
              searchListenerTree(handlers, type, xxTree, typeLength);
            } else if (xxTree["*"] && xxTree["*"]._listeners) {
              searchListenerTree(handlers, type, xxTree["*"], typeLength);
            }
          }
          return listeners;
        }
        function growListenerTree(type, listener) {
          type = typeof type === "string" ? type.split(this.delimiter) : type.slice();
          for (var i = 0, len = type.length; i + 1 < len; i++) {
            if (type[i] === "**" && type[i + 1] === "**") {
              return;
            }
          }
          var tree = this.listenerTree;
          var name = type.shift();
          while (name) {
            if (!tree[name]) {
              tree[name] = {};
            }
            tree = tree[name];
            if (type.length === 0) {
              if (!tree._listeners) {
                tree._listeners = listener;
              } else if (typeof tree._listeners === "function") {
                tree._listeners = [tree._listeners, listener];
              } else if (isArray(tree._listeners)) {
                tree._listeners.push(listener);
                if (!tree._listeners.warned) {
                  var m = defaultMaxListeners;
                  if (typeof this._events.maxListeners !== "undefined") {
                    m = this._events.maxListeners;
                  }
                  if (m > 0 && tree._listeners.length > m) {
                    tree._listeners.warned = true;
                    console.error(
                      "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                      tree._listeners.length
                    );
                    if (console.trace) {
                      console.trace();
                    }
                  }
                }
              }
              return true;
            }
            name = type.shift();
          }
          return true;
        }
        EventEmitter.prototype.delimiter = ".";
        EventEmitter.prototype.setMaxListeners = function(n) {
          this._events || init.call(this);
          this._events.maxListeners = n;
          if (!this._conf) this._conf = {};
          this._conf.maxListeners = n;
        };
        EventEmitter.prototype.event = "";
        EventEmitter.prototype.once = function(event, fn) {
          this.many(event, 1, fn);
          return this;
        };
        EventEmitter.prototype.many = function(event, ttl, fn) {
          var self = this;
          if (typeof fn !== "function") {
            throw new Error("many only accepts instances of Function");
          }
          function listener() {
            if (--ttl === 0) {
              self.off(event, listener);
            }
            fn.apply(this, arguments);
          }
          listener._origin = fn;
          this.on(event, listener);
          return self;
        };
        EventEmitter.prototype.emit = function() {
          this._events || init.call(this);
          var type = arguments[0];
          if (type === "newListener" && !this.newListener) {
            if (!this._events.newListener) {
              return false;
            }
          }
          var al = arguments.length;
          var args, l, i, j;
          var handler;
          if (this._all && this._all.length) {
            handler = this._all.slice();
            if (al > 3) {
              args = new Array(al);
              for (j = 1; j < al; j++) args[j] = arguments[j];
            }
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  handler[i].call(this, type);
                  break;
                case 2:
                  handler[i].call(this, type, arguments[1]);
                  break;
                case 3:
                  handler[i].call(this, type, arguments[1], arguments[2]);
                  break;
                default:
                  handler[i].apply(this, args);
              }
            }
          }
          if (this.wildcard) {
            handler = [];
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
          } else {
            handler = this._events[type];
            if (typeof handler === "function") {
              this.event = type;
              switch (al) {
                case 1:
                  handler.call(this);
                  break;
                case 2:
                  handler.call(this, arguments[1]);
                  break;
                case 3:
                  handler.call(this, arguments[1], arguments[2]);
                  break;
                default:
                  args = new Array(al - 1);
                  for (j = 1; j < al; j++) args[j - 1] = arguments[j];
                  handler.apply(this, args);
              }
              return true;
            } else if (handler) {
              handler = handler.slice();
            }
          }
          if (handler && handler.length) {
            if (al > 3) {
              args = new Array(al - 1);
              for (j = 1; j < al; j++) args[j - 1] = arguments[j];
            }
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  handler[i].call(this);
                  break;
                case 2:
                  handler[i].call(this, arguments[1]);
                  break;
                case 3:
                  handler[i].call(this, arguments[1], arguments[2]);
                  break;
                default:
                  handler[i].apply(this, args);
              }
            }
            return true;
          } else if (!this._all && type === "error") {
            if (arguments[1] instanceof Error) {
              throw arguments[1];
            } else {
              throw new Error("Uncaught, unspecified 'error' event.");
            }
            return false;
          }
          return !!this._all;
        };
        EventEmitter.prototype.emitAsync = function() {
          this._events || init.call(this);
          var type = arguments[0];
          if (type === "newListener" && !this.newListener) {
            if (!this._events.newListener) {
              return Promise.resolve([false]);
            }
          }
          var promises = [];
          var al = arguments.length;
          var args, l, i, j;
          var handler;
          if (this._all) {
            if (al > 3) {
              args = new Array(al);
              for (j = 1; j < al; j++) args[j] = arguments[j];
            }
            for (i = 0, l = this._all.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  promises.push(this._all[i].call(this, type));
                  break;
                case 2:
                  promises.push(this._all[i].call(this, type, arguments[1]));
                  break;
                case 3:
                  promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
                  break;
                default:
                  promises.push(this._all[i].apply(this, args));
              }
            }
          }
          if (this.wildcard) {
            handler = [];
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
          } else {
            handler = this._events[type];
          }
          if (typeof handler === "function") {
            this.event = type;
            switch (al) {
              case 1:
                promises.push(handler.call(this));
                break;
              case 2:
                promises.push(handler.call(this, arguments[1]));
                break;
              case 3:
                promises.push(handler.call(this, arguments[1], arguments[2]));
                break;
              default:
                args = new Array(al - 1);
                for (j = 1; j < al; j++) args[j - 1] = arguments[j];
                promises.push(handler.apply(this, args));
            }
          } else if (handler && handler.length) {
            if (al > 3) {
              args = new Array(al - 1);
              for (j = 1; j < al; j++) args[j - 1] = arguments[j];
            }
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  promises.push(handler[i].call(this));
                  break;
                case 2:
                  promises.push(handler[i].call(this, arguments[1]));
                  break;
                case 3:
                  promises.push(handler[i].call(this, arguments[1], arguments[2]));
                  break;
                default:
                  promises.push(handler[i].apply(this, args));
              }
            }
          } else if (!this._all && type === "error") {
            if (arguments[1] instanceof Error) {
              return Promise.reject(arguments[1]);
            } else {
              return Promise.reject("Uncaught, unspecified 'error' event.");
            }
          }
          return Promise.all(promises);
        };
        EventEmitter.prototype.on = function(type, listener) {
          if (typeof type === "function") {
            this.onAny(type);
            return this;
          }
          if (typeof listener !== "function") {
            throw new Error("on only accepts instances of Function");
          }
          this._events || init.call(this);
          this.emit("newListener", type, listener);
          if (this.wildcard) {
            growListenerTree.call(this, type, listener);
            return this;
          }
          if (!this._events[type]) {
            this._events[type] = listener;
          } else if (typeof this._events[type] === "function") {
            this._events[type] = [this._events[type], listener];
          } else if (isArray(this._events[type])) {
            this._events[type].push(listener);
            if (!this._events[type].warned) {
              var m = defaultMaxListeners;
              if (typeof this._events.maxListeners !== "undefined") {
                m = this._events.maxListeners;
              }
              if (m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error(
                  "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                  this._events[type].length
                );
                if (console.trace) {
                  console.trace();
                }
              }
            }
          }
          return this;
        };
        EventEmitter.prototype.onAny = function(fn) {
          if (typeof fn !== "function") {
            throw new Error("onAny only accepts instances of Function");
          }
          if (!this._all) {
            this._all = [];
          }
          this._all.push(fn);
          return this;
        };
        EventEmitter.prototype.addListener = EventEmitter.prototype.on;
        EventEmitter.prototype.off = function(type, listener) {
          if (typeof listener !== "function") {
            throw new Error("removeListener only takes instances of Function");
          }
          var handlers, leafs = [];
          if (this.wildcard) {
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
          } else {
            if (!this._events[type]) return this;
            handlers = this._events[type];
            leafs.push({ _listeners: handlers });
          }
          for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
            var leaf = leafs[iLeaf];
            handlers = leaf._listeners;
            if (isArray(handlers)) {
              var position = -1;
              for (var i = 0, length = handlers.length; i < length; i++) {
                if (handlers[i] === listener || handlers[i].listener && handlers[i].listener === listener || handlers[i]._origin && handlers[i]._origin === listener) {
                  position = i;
                  break;
                }
              }
              if (position < 0) {
                continue;
              }
              if (this.wildcard) {
                leaf._listeners.splice(position, 1);
              } else {
                this._events[type].splice(position, 1);
              }
              if (handlers.length === 0) {
                if (this.wildcard) {
                  delete leaf._listeners;
                } else {
                  delete this._events[type];
                }
              }
              this.emit("removeListener", type, listener);
              return this;
            } else if (handlers === listener || handlers.listener && handlers.listener === listener || handlers._origin && handlers._origin === listener) {
              if (this.wildcard) {
                delete leaf._listeners;
              } else {
                delete this._events[type];
              }
              this.emit("removeListener", type, listener);
            }
          }
          function recursivelyGarbageCollect(root) {
            if (root === undefined2) {
              return;
            }
            var keys = Object.keys(root);
            for (var i2 in keys) {
              var key = keys[i2];
              var obj = root[key];
              if (obj instanceof Function || typeof obj !== "object")
                continue;
              if (Object.keys(obj).length > 0) {
                recursivelyGarbageCollect(root[key]);
              }
              if (Object.keys(obj).length === 0) {
                delete root[key];
              }
            }
          }
          recursivelyGarbageCollect(this.listenerTree);
          return this;
        };
        EventEmitter.prototype.offAny = function(fn) {
          var i = 0, l = 0, fns;
          if (fn && this._all && this._all.length > 0) {
            fns = this._all;
            for (i = 0, l = fns.length; i < l; i++) {
              if (fn === fns[i]) {
                fns.splice(i, 1);
                this.emit("removeListenerAny", fn);
                return this;
              }
            }
          } else {
            fns = this._all;
            for (i = 0, l = fns.length; i < l; i++)
              this.emit("removeListenerAny", fns[i]);
            this._all = [];
          }
          return this;
        };
        EventEmitter.prototype.removeListener = EventEmitter.prototype.off;
        EventEmitter.prototype.removeAllListeners = function(type) {
          if (arguments.length === 0) {
            !this._events || init.call(this);
            return this;
          }
          if (this.wildcard) {
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
            for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
              var leaf = leafs[iLeaf];
              leaf._listeners = null;
            }
          } else {
            if (!this._events || !this._events[type]) return this;
            this._events[type] = null;
          }
          return this;
        };
        EventEmitter.prototype.listeners = function(type) {
          if (this.wildcard) {
            var handlers = [];
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
            return handlers;
          }
          this._events || init.call(this);
          if (!this._events[type]) this._events[type] = [];
          if (!isArray(this._events[type])) {
            this._events[type] = [this._events[type]];
          }
          return this._events[type];
        };
        EventEmitter.prototype.listenersAny = function() {
          if (this._all) {
            return this._all;
          } else {
            return [];
          }
        };
        if (false) {
          (void 0)(function() {
            return EventEmitter;
          });
        } else if (typeof exports === "object") {
          module.exports = EventEmitter;
        } else {
          window.EventEmitter2 = EventEmitter;
        }
      }();
    }
  });

  // node_modules/gedcomx-js/src/utils.js
  var require_utils = __commonJS({
    "node_modules/gedcomx-js/src/utils.js"(exports, module) {
      var utils = module.exports = {
        /**
         * Check whether the given object is an instance of the specified class.
         * The necessity for this is discussed in PR #13: https://github.com/rootsdev/gedcomx-js/pull/13
         * 
         * We put this functionality in a method to be DRY, even though it's short.
         * This could easily change in the future for correction and performance.
         * 
         * It could be handy to expose this on GedcomX somewhere so that users of the
         * library can use it too. But then we would need to add a way for them to
         * easily get the _gedxClass property without being tied to that private
         * property name. In other words, a static method such as Person.getClass()
         * 
         * @param {Object} obj
         * @param {String} className
         * @returns {Boolean}
         */
        isInstance: function(obj, className) {
          return obj && Object.getPrototypeOf(obj) !== Object.prototype && obj._gedxClass === className;
        },
        /**
         * Returns a copy of the object with undefined attributes removed.
         * 
         * @param {Object} object
         * @return {Object}
         */
        removeEmpty: function(object) {
          var dest = {};
          for (var a in object) {
            if (object.hasOwnProperty(a) && object[a] !== void 0) {
              dest[a] = object[a];
            }
          }
          return dest;
        },
        /**
         * Returns an object containing the properties from the source object
         * 
         * @param {Object} obj
         * @param {String[]} properties
         * @return {Object}
         */
        pick: function(object, properties) {
          var dest = {}, attr;
          for (var i = 0; i < properties.length; i++) {
            attr = properties[i];
            if (object.hasOwnProperty(attr)) {
              dest[attr] = object[attr];
            }
          }
          return dest;
        },
        /**
         * Merge multiple objects
         * 
         * Inspired by http://stackoverflow.com/a/16178864
         * 
         * @param {Object} destination
         * @param {Object} source
         * @param {Object=} source
         */
        merge: function() {
          var args = [].splice.call(arguments, 0), dest = args.shift(), src, attr;
          while (args.length > 0) {
            src = args.shift();
            if (typeof src === "object") {
              for (attr in src) {
                if (src.hasOwnProperty(attr)) {
                  if (typeof src[attr] === "object" && !Array.isArray(src[attr])) {
                    dest[attr] = utils.merge(dest[attr] || {}, src[attr]);
                  } else {
                    dest[attr] = src[attr];
                  }
                }
              }
            }
          }
          return dest;
        },
        /**
         * Recursively calls .toJSON() on values in an object that have the .toJSON()
         * method defined.
         * 
         * @param {Object} object
         * @return {Object}
         */
        toJSON: function(object) {
          if (Array.isArray(object)) {
            return object.map(function(o) {
              return utils.toJSON(o);
            });
          }
          if (typeof object !== "object") {
            return object;
          }
          var dest = {}, value;
          for (var a in object) {
            if (object.hasOwnProperty(a)) {
              value = object[a];
              if (typeof value === "undefined") {
                continue;
              } else if (typeof value.getTime === "function") {
                dest[a] = value.getTime();
              } else if (typeof value.toJSON === "function") {
                dest[a] = value.toJSON();
              } else {
                dest[a] = utils.toJSON(value);
              }
            }
          }
          return dest;
        }
      };
    }
  });

  // node_modules/gedcomx-js/src/Base.js
  var require_Base = __commonJS({
    "node_modules/gedcomx-js/src/Base.js"(exports, module) {
      var utils = require_utils();
      var Base = function(json) {
        if (!(this instanceof Base)) {
          return new Base(json);
        }
        if (Base.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Base._gedxClass = Base.prototype._gedxClass = "GedcomX.Base";
      Base.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Base.prototype.init = function(json) {
        return this;
      };
      Base.prototype._setArray = function(array, prop, addMethod) {
        if (Array.isArray(array)) {
          this[prop] = [];
          var self = this;
          array.forEach(function(n) {
            self[addMethod](n);
          });
        }
        return this;
      };
      Base.prototype._arrayPush = function(data, prop, constructor) {
        if (data) {
          if (constructor) {
            data = constructor(data);
          }
          if (!Array.isArray(this[prop])) {
            this[prop] = [];
          }
          this[prop].push(data);
        }
        return this;
      };
      Base.prototype._toJSON = function(parent, properties) {
        return utils.removeEmpty(
          // toJSON MUST be called on all data before merging otherwise the merge method
          // will reaching into the class instances and extract data you might not want
          // to be serialized. The data will come out as a plain object and you will lose
          // the ability to detect that it hasn't been properly serialized.
          utils.merge(
            parent.prototype.toJSON.call(this),
            utils.toJSON(utils.pick(this, properties))
          )
        );
      };
      Base.prototype.toJSON = function() {
        return {};
      };
      module.exports = Base;
    }
  });

  // node_modules/gedcomx-js/src/core/ExtensibleData.js
  var require_ExtensibleData = __commonJS({
    "node_modules/gedcomx-js/src/core/ExtensibleData.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var ExtensibleData = function(json) {
        if (!(this instanceof ExtensibleData)) {
          return new ExtensibleData(json);
        }
        if (ExtensibleData.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      ExtensibleData.prototype = Object.create(Base.prototype);
      ExtensibleData._gedxClass = ExtensibleData.prototype._gedxClass = "GedcomX.ExtensibleData";
      ExtensibleData.jsonProps = ["id"];
      ExtensibleData.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      ExtensibleData.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        if (json) {
          this.setId(json.id);
        }
        return this;
      };
      ExtensibleData.prototype.getId = function() {
        return this.id;
      };
      ExtensibleData.prototype.setId = function(id) {
        this.id = id;
        return this;
      };
      ExtensibleData.prototype.toJSON = function() {
        return this._toJSON(Base, ExtensibleData.jsonProps);
      };
      module.exports = ExtensibleData;
    }
  });

  // node_modules/gedcomx-js/src/core/Conclusion.js
  var require_Conclusion = __commonJS({
    "node_modules/gedcomx-js/src/core/Conclusion.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Conclusion = function(json) {
        if (!(this instanceof Conclusion)) {
          return new Conclusion(json);
        }
        if (Conclusion.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Conclusion.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Conclusion._gedxClass = Conclusion.prototype._gedxClass = "GedcomX.Conclusion";
      Conclusion.jsonProps = [
        "lang",
        "confidence",
        "analysis",
        "attribution",
        "sources",
        "notes"
      ];
      Conclusion.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Conclusion.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setAttribution(json.attribution);
          this.setAnalysis(json.analysis);
          this.setConfidence(json.confidence);
          this.setLang(json.lang);
          this.setNotes(json.notes);
          this.setSources(json.sources);
        }
        return this;
      };
      Conclusion.prototype.getAttribution = function() {
        return this.attribution;
      };
      Conclusion.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = new GedcomX.Attribution(attribution);
        }
        return this;
      };
      Conclusion.prototype.getAnalysis = function() {
        return this.analysis;
      };
      Conclusion.prototype.setAnalysis = function(analysis) {
        if (analysis) {
          this.analysis = new GedcomX.ResourceReference(analysis);
        }
        return this;
      };
      Conclusion.prototype.getConfidence = function() {
        return this.confidence;
      };
      Conclusion.prototype.setConfidence = function(confidence) {
        this.confidence = confidence;
        return this;
      };
      Conclusion.prototype.getLang = function() {
        return this.lang;
      };
      Conclusion.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      Conclusion.prototype.getNotes = function() {
        return this.notes || [];
      };
      Conclusion.prototype.setNotes = function(notes) {
        return this._setArray(notes, "notes", "addNote");
      };
      Conclusion.prototype.addNote = function(note) {
        return this._arrayPush(note, "notes", GedcomX.Note);
      };
      Conclusion.prototype.getSources = function() {
        return this.sources || [];
      };
      Conclusion.prototype.setSources = function(sources) {
        return this._setArray(sources, "sources", "addSource");
      };
      Conclusion.prototype.addSource = function(source) {
        return this._arrayPush(source, "sources", GedcomX.SourceReference);
      };
      Conclusion.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Conclusion.jsonProps);
      };
      module.exports = Conclusion;
    }
  });

  // node_modules/gedcomx-js/src/core/Subject.js
  var require_Subject = __commonJS({
    "node_modules/gedcomx-js/src/core/Subject.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Subject = function(json) {
        if (!(this instanceof Subject)) {
          return new Subject(json);
        }
        if (Subject.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Subject.prototype = Object.create(GedcomX.Conclusion.prototype);
      Subject._gedxClass = Subject.prototype._gedxClass = "GedcomX.Subject";
      Subject.jsonProps = [
        "extracted",
        "evidence",
        "identifiers",
        "media"
      ];
      Subject.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Subject.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          if (typeof json.extracted !== "undefined") {
            this.setExtracted(json.extracted);
          }
          this.setEvidence(json.evidence);
          this.setIdentifiers(json.identifiers);
          this.setMedia(json.media);
        }
        return this;
      };
      Subject.prototype.isExtracted = function() {
        return !!this.isExtracted;
      };
      Subject.prototype.setExtracted = function(extracted) {
        this.extracted = !!extracted;
        return this;
      };
      Subject.prototype.getEvidence = function() {
        return this.evidence || [];
      };
      Subject.prototype.setEvidence = function(evidence) {
        return this._setArray(evidence, "evidence", "addEvidence");
      };
      Subject.prototype.addEvidence = function(evidence) {
        return this._arrayPush(evidence, "evidence", GedcomX.EvidenceReference);
      };
      Subject.prototype.getIdentifiers = function() {
        return this.identifiers;
      };
      Subject.prototype.setIdentifiers = function(identifiers) {
        if (identifiers) {
          this.identifiers = GedcomX.Identifiers(identifiers);
        }
        return this;
      };
      Subject.prototype.getMedia = function() {
        return this.media || [];
      };
      Subject.prototype.setMedia = function(media) {
        return this._setArray(media, "media", "addMedia");
      };
      Subject.prototype.addMedia = function(media) {
        return this._arrayPush(media, "media", GedcomX.SourceReference);
      };
      Subject.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, Subject.jsonProps);
      };
      module.exports = Subject;
    }
  });

  // node_modules/gedcomx-js/src/core/ResourceReference.js
  var require_ResourceReference = __commonJS({
    "node_modules/gedcomx-js/src/core/ResourceReference.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var ResourceReference = function(json) {
        if (!(this instanceof ResourceReference)) {
          return new ResourceReference(json);
        }
        if (ResourceReference.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      ResourceReference.prototype = Object.create(Base.prototype);
      ResourceReference._gedxClass = ResourceReference.prototype._gedxClass = "GedcomX.ResourceReference";
      ResourceReference.jsonProps = ["resource"];
      ResourceReference.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      ResourceReference.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        if (json) {
          this.setResource(json.resource);
        }
        return this;
      };
      ResourceReference.prototype.getResource = function() {
        return this.resource;
      };
      ResourceReference.prototype.setResource = function(uri) {
        this.resource = uri;
        return this;
      };
      ResourceReference.prototype.matches = function(resource) {
        if (resource === void 0) {
          return false;
        }
        var id = "#" + (typeof resource === "string" ? resource : resource.getId());
        return this.resource === id;
      };
      ResourceReference.prototype.toJSON = function() {
        return this._toJSON(Base, ResourceReference.jsonProps);
      };
      module.exports = ResourceReference;
    }
  });

  // node_modules/gedcomx-js/src/core/Address.js
  var require_Address = __commonJS({
    "node_modules/gedcomx-js/src/core/Address.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Address = function(json) {
        if (!(this instanceof Address)) {
          return new Address(json);
        }
        if (Address.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Address.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Address._gedxClass = Address.prototype._gedxClass = "GedcomX.Address";
      Address.jsonProps = [
        "value",
        "city",
        "country",
        "postalCode",
        "stateOrProvince",
        "street",
        "street2",
        "street3",
        "street4",
        "street5",
        "street6"
      ];
      Address.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Address.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setValue(json.value);
          this.setCity(json.city);
          this.setCountry(json.country);
          this.setPostalCode(json.postalCode);
          this.setStateOrProvince(json.stateOrProvince);
          this.setStreet(json.street);
          this.setStreet2(json.street2);
          this.setStreet3(json.street3);
          this.setStreet4(json.street4);
          this.setStreet5(json.street5);
          this.setStreet6(json.street6);
        }
        return this;
      };
      Address.prototype.getValue = function() {
        return this.value;
      };
      Address.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      Address.prototype.getCity = function() {
        return this.city;
      };
      Address.prototype.setCity = function(city) {
        this.city = city;
        return this;
      };
      Address.prototype.getCountry = function() {
        return this.country;
      };
      Address.prototype.setCountry = function(country) {
        this.country = country;
        return this;
      };
      Address.prototype.getPostalCode = function() {
        return this.postalCode;
      };
      Address.prototype.setPostalCode = function(postalCode) {
        this.postalCode = postalCode;
        return this;
      };
      Address.prototype.getStateOrProvince = function() {
        return this.stateOrProvince;
      };
      Address.prototype.setStateOrProvince = function(stateOrProvince) {
        this.stateOrProvince = stateOrProvince;
        return this;
      };
      Address.prototype.getStreet = function() {
        return this.street;
      };
      Address.prototype.setStreet = function(street) {
        this.street = street;
        return this;
      };
      Address.prototype.getStreet2 = function() {
        return this.street2;
      };
      Address.prototype.setStreet2 = function(street2) {
        this.street2 = street2;
        return this;
      };
      Address.prototype.getStreet3 = function() {
        return this.street3;
      };
      Address.prototype.setStreet3 = function(street3) {
        this.street3 = street3;
        return this;
      };
      Address.prototype.getStreet4 = function() {
        return this.street4;
      };
      Address.prototype.setStreet4 = function(street4) {
        this.street4 = street4;
        return this;
      };
      Address.prototype.getStreet5 = function() {
        return this.street5;
      };
      Address.prototype.setStreet5 = function(street5) {
        this.street5 = street5;
        return this;
      };
      Address.prototype.getStreet6 = function() {
        return this.street6;
      };
      Address.prototype.setStreet6 = function(street6) {
        this.street6 = street6;
        return this;
      };
      Address.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Address.jsonProps);
      };
      module.exports = Address;
    }
  });

  // node_modules/gedcomx-js/src/core/Agent.js
  var require_Agent = __commonJS({
    "node_modules/gedcomx-js/src/core/Agent.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Agent = function(json) {
        if (!(this instanceof Agent)) {
          return new Agent(json);
        }
        if (Agent.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Agent.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Agent._gedxClass = Agent.prototype._gedxClass = "GedcomX.Agent";
      Agent.jsonProps = [
        "identifiers",
        "names",
        "homepage",
        "openid",
        "accounts",
        "emails",
        "phones",
        "addresses",
        "person"
      ];
      Agent.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Agent.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setIdentifiers(json.identifiers);
          this.setNames(json.names);
          this.setHomepage(json.homepage);
          this.setOpenid(json.openid);
          this.setAccounts(json.accounts);
          this.setEmails(json.emails);
          this.setPhones(json.phones);
          this.setAddresses(json.addresses);
          this.setPerson(json.person);
        }
        return this;
      };
      Agent.prototype.getIdentifiers = function() {
        return this.identifiers;
      };
      Agent.prototype.setIdentifiers = function(identifiers) {
        if (identifiers) {
          this.identifiers = GedcomX.Identifiers(identifiers);
        }
        return this;
      };
      Agent.prototype.getNames = function() {
        return this.names || [];
      };
      Agent.prototype.setNames = function(names) {
        return this._setArray(names, "names", "addName");
      };
      Agent.prototype.addName = function(name) {
        return this._arrayPush(name, "names", GedcomX.TextValue);
      };
      Agent.prototype.getHomepage = function() {
        return this.homepage;
      };
      Agent.prototype.setHomepage = function(homepage) {
        if (homepage) {
          this.homepage = GedcomX.ResourceReference(homepage);
        }
        return this;
      };
      Agent.prototype.getOpenid = function() {
        return this.openid;
      };
      Agent.prototype.setOpenid = function(openid) {
        if (openid) {
          this.openid = GedcomX.ResourceReference(openid);
        }
        return this;
      };
      Agent.prototype.getAccounts = function() {
        return this.accounts || [];
      };
      Agent.prototype.setAccounts = function(accounts) {
        return this._setArray(accounts, "accounts", "addAccount");
      };
      Agent.prototype.addAccount = function(account) {
        return this._arrayPush(account, "accounts", GedcomX.OnlineAccount);
      };
      Agent.prototype.getEmails = function() {
        return this.emails || [];
      };
      Agent.prototype.setEmails = function(emails) {
        return this._setArray(emails, "emails", "addEmail");
      };
      Agent.prototype.addEmail = function(email) {
        return this._arrayPush(email, "emails", GedcomX.ResourceReference);
      };
      Agent.prototype.getPhones = function() {
        return this.phones || [];
      };
      Agent.prototype.setPhones = function(phones) {
        return this._setArray(phones, "phones", "addPhone");
      };
      Agent.prototype.addPhone = function(phone) {
        return this._arrayPush(phone, "phones", GedcomX.ResourceReference);
      };
      Agent.prototype.getAddresses = function() {
        return this.addresses || [];
      };
      Agent.prototype.setAddresses = function(addresses) {
        return this._setArray(addresses, "addresses", "addAddress");
      };
      Agent.prototype.addAddress = function(address) {
        return this._arrayPush(address, "addresses", GedcomX.Address);
      };
      Agent.prototype.getPerson = function() {
        return this.person;
      };
      Agent.prototype.setPerson = function(person) {
        if (person) {
          this.person = GedcomX.ResourceReference(person);
        }
        return this;
      };
      Agent.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Agent.jsonProps);
      };
      module.exports = Agent;
    }
  });

  // node_modules/gedcomx-js/src/core/Attribution.js
  var require_Attribution = __commonJS({
    "node_modules/gedcomx-js/src/core/Attribution.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Attribution = function(json) {
        if (!(this instanceof Attribution)) {
          return new Attribution(json);
        }
        if (Attribution.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Attribution.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Attribution._gedxClass = Attribution.prototype._gedxClass = "GedcomX.Attribution";
      Attribution.jsonProps = [
        "changeMessage",
        "contributor",
        "created",
        "creator",
        "modified"
      ];
      Attribution.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Attribution.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setChangeMessage(json.changeMessage);
          this.setContributor(json.contributor);
          this.setCreated(json.created);
          this.setCreator(json.creator);
          this.setModified(json.modified);
        }
        return this;
      };
      Attribution.prototype.getChangeMessage = function() {
        return this.changeMessage;
      };
      Attribution.prototype.setChangeMessage = function(changeMessage) {
        this.changeMessage = changeMessage;
        return this;
      };
      Attribution.prototype.getContributor = function() {
        return this.contributor;
      };
      Attribution.prototype.setContributor = function(contributor) {
        if (contributor) {
          this.contributor = GedcomX.ResourceReference(contributor);
        }
        return this;
      };
      Attribution.prototype.getCreated = function() {
        return this.created;
      };
      Attribution.prototype.setCreated = function(date) {
        if (date) {
          this.created = new Date(date);
        }
        return this;
      };
      Attribution.prototype.getCreator = function() {
        return this.creator;
      };
      Attribution.prototype.setCreator = function(creator) {
        if (creator) {
          this.creator = new GedcomX.ResourceReference(creator);
        }
        return this;
      };
      Attribution.prototype.getModified = function() {
        return this.modified;
      };
      Attribution.prototype.setModified = function(date) {
        if (date) {
          this.modified = new Date(date);
        }
        return this;
      };
      Attribution.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Attribution.jsonProps);
      };
      module.exports = Attribution;
    }
  });

  // node_modules/gedcomx-js/src/core/Coverage.js
  var require_Coverage = __commonJS({
    "node_modules/gedcomx-js/src/core/Coverage.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Coverage = function(json) {
        if (!(this instanceof Coverage)) {
          return new Coverage(json);
        }
        if (Coverage.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Coverage.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Coverage._gedxClass = Coverage.prototype._gedxClass = "GedcomX.Coverage";
      Coverage.jsonProps = [
        "spatial",
        "temporal"
      ];
      Coverage.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Coverage.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setSpatial(json.spatial);
          this.setTemporal(json.temporal);
        }
        return this;
      };
      Coverage.prototype.getSpatial = function() {
        return this.spatial;
      };
      Coverage.prototype.setSpatial = function(spatial) {
        if (spatial) {
          this.spatial = GedcomX.PlaceReference(spatial);
        }
        return this;
      };
      Coverage.prototype.getTemporal = function() {
        return this.temporal;
      };
      Coverage.prototype.setTemporal = function(temporal) {
        if (temporal) {
          this.temporal = GedcomX.Date(temporal);
        }
        return this;
      };
      Coverage.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Coverage.jsonProps);
      };
      module.exports = Coverage;
    }
  });

  // node_modules/gedcomx-js/src/core/Date.js
  var require_Date = __commonJS({
    "node_modules/gedcomx-js/src/core/Date.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var GDate = function(json) {
        if (!(this instanceof GDate)) {
          return new GDate(json);
        }
        if (GDate.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      GDate.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      GDate._gedxClass = GDate.prototype._gedxClass = "GedcomX.Date";
      GDate.jsonProps = [
        "original",
        "formal"
      ];
      GDate.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      GDate.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setOriginal(json.original);
          this.setFormal(json.formal);
        }
        return this;
      };
      GDate.prototype.getOriginal = function() {
        return this.original;
      };
      GDate.prototype.setOriginal = function(original) {
        this.original = original;
        return this;
      };
      GDate.prototype.getFormal = function() {
        return this.formal;
      };
      GDate.prototype.setFormal = function(formal) {
        this.formal = formal;
        return this;
      };
      GDate.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, GDate.jsonProps);
      };
      module.exports = GDate;
    }
  });

  // node_modules/gedcomx-js/src/core/Document.js
  var require_Document = __commonJS({
    "node_modules/gedcomx-js/src/core/Document.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Document = function(json) {
        if (!(this instanceof Document)) {
          return new Document(json);
        }
        if (Document.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Document.prototype = Object.create(GedcomX.Conclusion.prototype);
      Document._gedxClass = Document.prototype._gedxClass = "GedcomX.Document";
      Document.jsonProps = [
        "type",
        "extracted",
        "textType",
        "text",
        "attribution"
      ];
      Document.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Document.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setExtracted(json.extracted);
          this.setTextType(json.textType);
          this.setText(json.text);
          this.setAttribution(json.attribution);
        }
        return this;
      };
      Document.prototype.getType = function() {
        return this.type;
      };
      Document.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      Document.prototype.getExtracted = function() {
        return !!this.extracted;
      };
      Document.prototype.setExtracted = function(extracted) {
        this.extracted = !!extracted;
        return this;
      };
      Document.prototype.getTextType = function() {
        return this.textType;
      };
      Document.prototype.setTextType = function(textType) {
        this.textType = textType;
        return this;
      };
      Document.prototype.getText = function() {
        return this.text;
      };
      Document.prototype.setText = function(text) {
        this.text = text;
        return this;
      };
      Document.prototype.getAttribution = function() {
        return this.attribution;
      };
      Document.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = GedcomX.Attribution(attribution);
        }
        return this;
      };
      Document.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, Document.jsonProps);
      };
      module.exports = Document;
    }
  });

  // node_modules/gedcomx-js/src/core/Event.js
  var require_Event = __commonJS({
    "node_modules/gedcomx-js/src/core/Event.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Event = function(json) {
        if (!(this instanceof Event)) {
          return new Event(json);
        }
        if (Event.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Event.prototype = Object.create(GedcomX.Subject.prototype);
      Event._gedxClass = Event.prototype._gedxClass = "GedcomX.Event";
      Event.jsonProps = [
        "type",
        "date",
        "place",
        "roles"
      ];
      Event.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Event.prototype.init = function(json) {
        GedcomX.Subject.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setDate(json.date);
          this.setPlace(json.place);
          this.setRoles(json.roles);
        }
        return this;
      };
      Event.prototype.getType = function() {
        return this.type;
      };
      Event.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      Event.prototype.getDate = function() {
        return this.date;
      };
      Event.prototype.setDate = function(date) {
        if (date) {
          this.date = GedcomX.Date(date);
        }
        return this;
      };
      Event.prototype.getPlace = function() {
        return this.place;
      };
      Event.prototype.setPlace = function(place) {
        if (place) {
          this.place = GedcomX.PlaceReference(place);
        }
        return this;
      };
      Event.prototype.getRoles = function() {
        return this.roles || [];
      };
      Event.prototype.setRoles = function(roles) {
        return this._setArray(roles, "roles", "addRole");
      };
      Event.prototype.addRole = function(role) {
        return this._arrayPush(role, "roles", GedcomX.EventRole);
      };
      Event.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Subject, Event.jsonProps);
      };
      module.exports = Event;
    }
  });

  // node_modules/gedcomx-js/src/core/EventRole.js
  var require_EventRole = __commonJS({
    "node_modules/gedcomx-js/src/core/EventRole.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var EventRole = function(json) {
        if (!(this instanceof EventRole)) {
          return new EventRole(json);
        }
        if (GedcomX.Conclusion.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      EventRole.prototype = Object.create(GedcomX.Conclusion.prototype);
      EventRole._gedxClass = EventRole.prototype._gedxClass = "GedcomX.Conclusion";
      EventRole.jsonProps = [
        "person",
        "type",
        "details"
      ];
      EventRole.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      EventRole.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          this.setPerson(json.person);
          this.setType(json.type);
          this.setDetails(json.details);
        }
        return this;
      };
      EventRole.prototype.getPerson = function() {
        return this.person;
      };
      EventRole.prototype.setPerson = function(person) {
        if (person) {
          this.person = GedcomX.ResourceReference(person);
        }
        return this;
      };
      EventRole.prototype.getType = function() {
        return this.type;
      };
      EventRole.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      EventRole.prototype.getDetails = function() {
        return this.details;
      };
      EventRole.prototype.setDetails = function(details) {
        this.details = details;
        return this;
      };
      EventRole.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, EventRole.jsonProps);
      };
      module.exports = EventRole;
    }
  });

  // node_modules/gedcomx-js/src/core/EvidenceReference.js
  var require_EvidenceReference = __commonJS({
    "node_modules/gedcomx-js/src/core/EvidenceReference.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var EvidenceReference = function(json) {
        if (!(this instanceof EvidenceReference)) {
          return new EvidenceReference(json);
        }
        if (GedcomX.ResourceReference.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      EvidenceReference.prototype = Object.create(GedcomX.ResourceReference.prototype);
      EvidenceReference._gedxClass = EvidenceReference.prototype._gedxClass = "GedcomX.ResourceReference";
      EvidenceReference.jsonProps = [
        "attribution"
      ];
      EvidenceReference.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      EvidenceReference.prototype.init = function(json) {
        GedcomX.ResourceReference.prototype.init.call(this, json);
        if (json) {
          this.setAttribution(json.attribution);
        }
        return this;
      };
      EvidenceReference.prototype.getAttribution = function() {
        return this.attribution;
      };
      EvidenceReference.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = new GedcomX.Attribution(attribution);
        }
        return this;
      };
      EvidenceReference.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ResourceReference, EvidenceReference.jsonProps);
      };
      module.exports = EvidenceReference;
    }
  });

  // node_modules/gedcomx-js/src/core/Fact.js
  var require_Fact = __commonJS({
    "node_modules/gedcomx-js/src/core/Fact.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Fact = function(json) {
        if (!(this instanceof Fact)) {
          return new Fact(json);
        }
        if (Fact.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Fact.prototype = Object.create(GedcomX.Conclusion.prototype);
      Fact._gedxClass = Fact.prototype._gedxClass = "GedcomX.Fact";
      Fact.jsonProps = [
        "type",
        "date",
        "place",
        "value",
        "qualifiers"
      ];
      Fact.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Fact.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setDate(json.date);
          this.setPlace(json.place);
          this.setValue(json.value);
          this.setQualifiers(json.qualifiers);
        }
        return this;
      };
      Fact.prototype.getType = function() {
        return this.type;
      };
      Fact.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      Fact.prototype.getDate = function() {
        return this.date;
      };
      Fact.prototype.setDate = function(date) {
        if (date) {
          this.date = GedcomX.Date(date);
        }
        return this;
      };
      Fact.prototype.getPlace = function() {
        return this.place;
      };
      Fact.prototype.setPlace = function(place) {
        if (place) {
          this.place = GedcomX.PlaceReference(place);
        }
        return this;
      };
      Fact.prototype.getValue = function() {
        return this.value;
      };
      Fact.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      Fact.prototype.getQualifiers = function() {
        return this.qualifiers || [];
      };
      Fact.prototype.setQualifiers = function(qualifiers) {
        return this._setArray(qualifiers, "qualifiers", "addQualifier");
      };
      Fact.prototype.addQualifier = function(qualifier) {
        return this._arrayPush(qualifier, "qualifiers", GedcomX.Qualifier);
      };
      Fact.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, Fact.jsonProps);
      };
      module.exports = Fact;
    }
  });

  // node_modules/gedcomx-js/src/core/Gender.js
  var require_Gender = __commonJS({
    "node_modules/gedcomx-js/src/core/Gender.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Gender = function(json) {
        if (!(this instanceof Gender)) {
          return new Gender(json);
        }
        if (Gender.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Gender.prototype = Object.create(GedcomX.Conclusion.prototype);
      Gender._gedxClass = Gender.prototype._gedxClass = "GedcomX.Gender";
      Gender.jsonProps = ["type"];
      Gender.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Gender.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
        }
        return this;
      };
      Gender.prototype.getType = function() {
        return this.type;
      };
      Gender.prototype.setType = function(gender) {
        this.type = gender;
        return this;
      };
      Gender.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, Gender.jsonProps);
      };
      module.exports = Gender;
    }
  });

  // node_modules/gedcomx-js/src/core/Identifiers.js
  var require_Identifiers = __commonJS({
    "node_modules/gedcomx-js/src/core/Identifiers.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var Identifiers = function(json) {
        if (!(this instanceof Identifiers)) {
          return new Identifiers(json);
        }
        if (Identifiers.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Base.prototype = Object.create(Base.prototype);
      Identifiers._gedxClass = Identifiers.prototype._gedxClass = "GedcomX.Identifiers";
      Identifiers.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Identifiers.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        this.identifiers = {};
        if (json) {
          this.identifiers = json;
          for (var a in this.identifiers) {
            if (this.identifiers.hasOwnProperty(a) && !Array.isArray(this.identifiers[a])) {
              this.identifiers[a] = [this.identifiers[a]];
            }
          }
        }
        return this;
      };
      Identifiers.prototype.getValues = function(type) {
        if (typeof type === "undefined") {
          type = "$";
        }
        return this.identifiers[type] || [];
      };
      Identifiers.prototype.setValues = function(values, type) {
        if (typeof type === "undefined") {
          type = "$";
        }
        if (Array.isArray(values)) {
          this.identifiers[type] = values;
        }
        return this;
      };
      Identifiers.prototype.addValue = function(value, type) {
        if (typeof type === "undefined") {
          type = "$";
        }
        if (!Array.isArray(this.identifiers[type])) {
          this.identifiers[type] = [];
        }
        this.identifiers[type].push(value);
        return this;
      };
      Identifiers.prototype.toJSON = function() {
        return this.identifiers;
      };
      module.exports = Identifiers;
    }
  });

  // node_modules/gedcomx-js/src/core/Name.js
  var require_Name = __commonJS({
    "node_modules/gedcomx-js/src/core/Name.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Name = function(json) {
        if (!(this instanceof Name)) {
          return new Name(json);
        }
        if (Name.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Name.prototype = Object.create(GedcomX.Conclusion.prototype);
      Name._gedxClass = Name.prototype._gedxClass = "GedcomX.Name";
      Name.jsonProps = [
        "type",
        "date",
        "nameForms"
      ];
      Name.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Name.prototype.init = function(json) {
        GedcomX.Conclusion.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setDate(json.date);
          this.setNameForms(json.nameForms);
        }
        return this;
      };
      Name.prototype.getType = function() {
        return this.type;
      };
      Name.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      Name.prototype.getDate = function() {
        return this.date;
      };
      Name.prototype.setDate = function(date) {
        if (date) {
          this.date = GedcomX.Date(date);
        }
        return this;
      };
      Name.prototype.getNameForms = function() {
        return this.nameForms || [];
      };
      Name.prototype.setNameForms = function(nameForms) {
        return this._setArray(nameForms, "nameForms", "addNameForm");
      };
      Name.prototype.addNameForm = function(nameForm) {
        return this._arrayPush(nameForm, "nameForms", GedcomX.NameForm);
      };
      Name.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Conclusion, Name.jsonProps);
      };
      module.exports = Name;
    }
  });

  // node_modules/gedcomx-js/src/core/NameForm.js
  var require_NameForm = __commonJS({
    "node_modules/gedcomx-js/src/core/NameForm.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var NameForm = function(json) {
        if (!(this instanceof NameForm)) {
          return new NameForm(json);
        }
        if (NameForm.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      NameForm.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      NameForm._gedxClass = NameForm.prototype._gedxClass = "GedcomX.NameForm";
      NameForm.jsonProps = [
        "lang",
        "fullText",
        "parts"
      ];
      NameForm.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      NameForm.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setLang(json.lang);
          this.setFullText(json.fullText);
          this.setParts(json.parts);
        }
        return this;
      };
      NameForm.prototype.getLang = function() {
        return this.lang;
      };
      NameForm.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      NameForm.prototype.getFullText = function() {
        return this.fullText;
      };
      NameForm.prototype.setFullText = function(fullText) {
        this.fullText = fullText;
        return this;
      };
      NameForm.prototype.getParts = function() {
        return this.parts || [];
      };
      NameForm.prototype.setParts = function(parts) {
        return this._setArray(parts, "parts", "addPart");
      };
      NameForm.prototype.addPart = function(part) {
        return this._arrayPush(part, "parts", GedcomX.NamePart);
      };
      NameForm.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, NameForm.jsonProps);
      };
      module.exports = NameForm;
    }
  });

  // node_modules/gedcomx-js/src/core/NamePart.js
  var require_NamePart = __commonJS({
    "node_modules/gedcomx-js/src/core/NamePart.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var NamePart = function(json) {
        if (!(this instanceof NamePart)) {
          return new NamePart(json);
        }
        if (NamePart.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      NamePart.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      NamePart._gedxClass = NamePart.prototype._gedxClass = "GedcomX.NamePart";
      NamePart.jsonProps = [
        "type",
        "value",
        "qualifiers"
      ];
      NamePart.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      NamePart.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setValue(json.value);
          this.setType(json.type);
          this.setQualifiers(json.qualifiers);
        }
        return this;
      };
      NamePart.prototype.getType = function() {
        return this.type;
      };
      NamePart.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      NamePart.prototype.getValue = function() {
        return this.value;
      };
      NamePart.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      NamePart.prototype.getQualifiers = function() {
        return this.qualifiers || [];
      };
      NamePart.prototype.setQualifiers = function(qualifiers) {
        return this._setArray(qualifiers, "qualifiers", "addQualifier");
      };
      NamePart.prototype.addQualifier = function(qualifier) {
        return this._arrayPush(qualifier, "qualifiers", GedcomX.Qualifier);
      };
      NamePart.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, NamePart.jsonProps);
      };
      module.exports = NamePart;
    }
  });

  // node_modules/gedcomx-js/src/core/Note.js
  var require_Note = __commonJS({
    "node_modules/gedcomx-js/src/core/Note.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Note = function(json) {
        if (!(this instanceof Note)) {
          return new Note(json);
        }
        if (Note.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Note.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Note._gedxClass = Note.prototype._gedxClass = "GedcomX.Note";
      Note.jsonProps = [
        "lang",
        "subject",
        "text",
        "attribution"
      ];
      Note.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Note.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setLang(json.lang);
          this.setSubject(json.subject);
          this.setText(json.text);
          this.setAttribution(json.attribution);
        }
        return this;
      };
      Note.prototype.getLang = function() {
        return this.lang;
      };
      Note.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      Note.prototype.getSubject = function() {
        return this.subject;
      };
      Note.prototype.setSubject = function(subject) {
        this.subject = subject;
        return this;
      };
      Note.prototype.getText = function() {
        return this.text;
      };
      Note.prototype.setText = function(text) {
        this.text = text;
        return this;
      };
      Note.prototype.getAttribution = function() {
        return this.attribution;
      };
      Note.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = new GedcomX.Attribution(attribution);
        }
        return this;
      };
      Note.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Note.jsonProps);
      };
      module.exports = Note;
    }
  });

  // node_modules/gedcomx-js/src/core/OnlineAccount.js
  var require_OnlineAccount = __commonJS({
    "node_modules/gedcomx-js/src/core/OnlineAccount.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var OnlineAccount = function(json) {
        if (!(this instanceof OnlineAccount)) {
          return new OnlineAccount(json);
        }
        if (OnlineAccount.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      OnlineAccount.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      OnlineAccount._gedxClass = OnlineAccount.prototype._gedxClass = "GedcomX.OnlineAccount";
      OnlineAccount.jsonProps = [
        "serviceHomepage",
        "accountName"
      ];
      OnlineAccount.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      OnlineAccount.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setAccountName(json.accountName);
          this.setServiceHomepage(json.serviceHomepage);
        }
        return this;
      };
      OnlineAccount.prototype.getServiceHomepage = function() {
        return this.serviceHomepage;
      };
      OnlineAccount.prototype.setServiceHomepage = function(serviceHomepage) {
        if (serviceHomepage) {
          this.serviceHomepage = GedcomX.ResourceReference(serviceHomepage);
        }
        return this;
      };
      OnlineAccount.prototype.getAccountName = function() {
        return this.accountName;
      };
      OnlineAccount.prototype.setAccountName = function(accountName) {
        this.accountName = accountName;
        return this;
      };
      OnlineAccount.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, OnlineAccount.jsonProps);
      };
      module.exports = OnlineAccount;
    }
  });

  // node_modules/gedcomx-js/src/core/Person.js
  var require_Person = __commonJS({
    "node_modules/gedcomx-js/src/core/Person.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Person = function(json) {
        if (!(this instanceof Person)) {
          return new Person(json);
        }
        if (Person.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Person.prototype = Object.create(GedcomX.Subject.prototype);
      Person._gedxClass = Person.prototype._gedxClass = "GedcomX.Person";
      Person.jsonProps = [
        "private",
        "gender",
        "names",
        "facts"
      ];
      Person.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Person.prototype.init = function(json) {
        GedcomX.Subject.prototype.init.call(this, json);
        if (json) {
          this.setPrivate(json.private);
          this.setGender(json.gender);
          this.setNames(json.names);
          this.setFacts(json.facts);
        }
        return this;
      };
      Person.prototype.getPrivate = function() {
        return this.private;
      };
      Person.prototype.setPrivate = function(isPrivate) {
        this.private = isPrivate;
        return this;
      };
      Person.prototype.getGender = function() {
        return this.gender;
      };
      Person.prototype.setGender = function(gender) {
        if (gender) {
          this.gender = GedcomX.Gender(gender);
        }
        return this;
      };
      Person.prototype.isMale = function() {
        return this.gender && this.gender.getType() === "http://gedcomx.org/Male";
      };
      Person.prototype.isFemale = function() {
        return this.gender && this.gender.getType() === "http://gedcomx.org/Female";
      };
      Person.prototype.getNames = function() {
        return this.names || [];
      };
      Person.prototype.setNames = function(names) {
        return this._setArray(names, "names", "addName");
      };
      Person.prototype.addName = function(name) {
        return this._arrayPush(name, "names", GedcomX.Name);
      };
      Person.prototype.getFacts = function() {
        return this.facts || [];
      };
      Person.prototype.setFacts = function(facts) {
        return this._setArray(facts, "facts", "addFact");
      };
      Person.prototype.getFactsByType = function(type) {
        return this.getFacts().filter(function(f) {
          return f.getType() === type;
        });
      };
      Person.prototype.addFact = function(fact) {
        return this._arrayPush(fact, "facts", GedcomX.Fact);
      };
      Person.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Subject, Person.jsonProps);
      };
      module.exports = Person;
    }
  });

  // node_modules/gedcomx-js/src/core/PlaceDescription.js
  var require_PlaceDescription = __commonJS({
    "node_modules/gedcomx-js/src/core/PlaceDescription.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var PlaceDescription = function(json) {
        if (!(this instanceof PlaceDescription)) {
          return new PlaceDescription(json);
        }
        if (PlaceDescription.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      PlaceDescription.prototype = Object.create(GedcomX.Subject.prototype);
      PlaceDescription._gedxClass = PlaceDescription.prototype._gedxClass = "GedcomX.PlaceDescription";
      PlaceDescription.jsonProps = [
        "type",
        "names",
        "place",
        "jurisdiction",
        "latitude",
        "longitude",
        "temporalDescription",
        "spatialDescription"
      ];
      PlaceDescription.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      PlaceDescription.prototype.init = function(json) {
        GedcomX.Subject.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setNames(json.names);
          this.setPlace(json.place);
          this.setJurisdiction(json.jurisdiction);
          this.setTemporalDescription(json.temporalDescription);
          this.setSpatialDescription(json.spatialDescription);
          this.setLatitude(json.latitude);
          this.setLongitude(json.longitude);
        }
        return this;
      };
      PlaceDescription.prototype.getType = function() {
        return this.type;
      };
      PlaceDescription.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      PlaceDescription.prototype.getNames = function() {
        return this.names || [];
      };
      PlaceDescription.prototype.setNames = function(names) {
        return this._setArray(names, "names", "addName");
      };
      PlaceDescription.prototype.addName = function(name) {
        return this._arrayPush(name, "names", GedcomX.TextValue);
      };
      PlaceDescription.prototype.getPlace = function() {
        return this.place;
      };
      PlaceDescription.prototype.setPlace = function(place) {
        if (place) {
          this.place = GedcomX.ResourceReference(place);
        }
        return this;
      };
      PlaceDescription.prototype.getJurisdiction = function() {
        return this.jurisdiction;
      };
      PlaceDescription.prototype.setJurisdiction = function(jurisdiction) {
        if (jurisdiction) {
          this.jurisdiction = GedcomX.ResourceReference(jurisdiction);
        }
        return this;
      };
      PlaceDescription.prototype.getLatitude = function() {
        return this.latitude;
      };
      PlaceDescription.prototype.setLatitude = function(latitude) {
        this.latitude = latitude;
        return this;
      };
      PlaceDescription.prototype.getLongitude = function() {
        return this.longitude;
      };
      PlaceDescription.prototype.setLongitude = function(longitude) {
        this.longitude = longitude;
        return this;
      };
      PlaceDescription.prototype.getTemporalDescription = function() {
        return this.temporalDescription;
      };
      PlaceDescription.prototype.setTemporalDescription = function(date) {
        if (date) {
          this.temporalDescription = GedcomX.Date(date);
        }
        return this;
      };
      PlaceDescription.prototype.getSpatialDescription = function() {
        return this.spatialDescription;
      };
      PlaceDescription.prototype.setSpatialDescription = function(spatial) {
        if (spatial) {
          this.spatialDescription = GedcomX.ResourceReference(spatial);
        }
        return this;
      };
      PlaceDescription.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Subject, PlaceDescription.jsonProps);
      };
      module.exports = PlaceDescription;
    }
  });

  // node_modules/gedcomx-js/src/core/PlaceReference.js
  var require_PlaceReference = __commonJS({
    "node_modules/gedcomx-js/src/core/PlaceReference.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var PlaceReference = function(json) {
        if (!(this instanceof PlaceReference)) {
          return new PlaceReference(json);
        }
        if (GedcomX.ExtensibleData.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      PlaceReference.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      PlaceReference._gedxClass = PlaceReference.prototype._gedxClass = "GedcomX.ExtensibleData";
      PlaceReference.jsonProps = [
        "original",
        "description"
      ];
      PlaceReference.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      PlaceReference.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setOriginal(json.original);
          this.setDescription(json.description);
        }
        return this;
      };
      PlaceReference.prototype.getOriginal = function() {
        return this.original;
      };
      PlaceReference.prototype.setOriginal = function(original) {
        this.original = original;
        return this;
      };
      PlaceReference.prototype.getDescription = function() {
        return this.description;
      };
      PlaceReference.prototype.setDescription = function(description) {
        this.description = description;
        return this;
      };
      PlaceReference.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, PlaceReference.jsonProps);
      };
      module.exports = PlaceReference;
    }
  });

  // node_modules/gedcomx-js/src/core/Qualifier.js
  var require_Qualifier = __commonJS({
    "node_modules/gedcomx-js/src/core/Qualifier.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var Qualifier = function(json) {
        if (!(this instanceof Qualifier)) {
          return new Qualifier(json);
        }
        if (Qualifier.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Qualifier.prototype = Object.create(Base.prototype);
      Qualifier._gedxClass = Qualifier.prototype._gedxClass = "GedcomX.Qualifier";
      Qualifier.jsonProps = [
        "name",
        "value"
      ];
      Qualifier.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Qualifier.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        if (json) {
          this.setName(json.name);
          this.setValue(json.value);
        }
        return this;
      };
      Qualifier.prototype.getName = function() {
        return this.name;
      };
      Qualifier.prototype.setName = function(name) {
        this.name = name;
        return this;
      };
      Qualifier.prototype.getValue = function() {
        return this.value;
      };
      Qualifier.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      Qualifier.prototype.toJSON = function() {
        return this._toJSON(Base, Qualifier.jsonProps);
      };
      module.exports = Qualifier;
    }
  });

  // node_modules/gedcomx-js/src/core/Relationship.js
  var require_Relationship = __commonJS({
    "node_modules/gedcomx-js/src/core/Relationship.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var Relationship = function(json) {
        if (!(this instanceof Relationship)) {
          return new Relationship(json);
        }
        if (Relationship.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Relationship.prototype = Object.create(GedcomX.Subject.prototype);
      Relationship._gedxClass = Relationship.prototype._gedxClass = "GedcomX.Relationship";
      Relationship.jsonProps = [
        "type",
        "person1",
        "person2",
        "facts"
      ];
      Relationship.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Relationship.prototype.init = function(json) {
        GedcomX.Subject.prototype.init.call(this, json);
        if (json) {
          this.setType(json.type);
          this.setPerson1(json.person1);
          this.setPerson2(json.person2);
          this.setFacts(json.facts);
        }
        return this;
      };
      Relationship.prototype.getType = function() {
        return this.type;
      };
      Relationship.prototype.setType = function(type) {
        this.type = type;
        return this;
      };
      Relationship.prototype.getPerson1 = function() {
        return this.person1;
      };
      Relationship.prototype.setPerson1 = function(person1) {
        if (person1) {
          this.person1 = GedcomX.ResourceReference(person1);
        }
        return this;
      };
      Relationship.prototype.getPerson2 = function() {
        return this.person2;
      };
      Relationship.prototype.setPerson2 = function(person2) {
        if (person2) {
          this.person2 = GedcomX.ResourceReference(person2);
        }
        return this;
      };
      Relationship.prototype.involvesPerson = function(person) {
        if (person === void 0) {
          return false;
        } else if (this.person1 && this.person2) {
          return this.person1.matches(person) || this.person2.matches(person);
        } else if (this.person1) {
          return this.person1.matches(person);
        } else if (this.person2) {
          return this.person2.matches(person);
        } else {
          return false;
        }
      };
      Relationship.prototype.getOtherPerson = function(person) {
        return this.person1 && this.person1.matches(person) ? this.person2 : this.person1;
      };
      Relationship.prototype.getFacts = function() {
        return this.facts || [];
      };
      Relationship.prototype.setFacts = function(facts) {
        return this._setArray(facts, "facts", "addFact");
      };
      Relationship.prototype.addFact = function(fact) {
        return this._arrayPush(fact, "facts", GedcomX.Fact);
      };
      Relationship.prototype.toJSON = function() {
        return this._toJSON(GedcomX.Subject, Relationship.jsonProps);
      };
      module.exports = Relationship;
    }
  });

  // node_modules/gedcomx-js/src/core/Root.js
  var require_Root = __commonJS({
    "node_modules/gedcomx-js/src/core/Root.js"(exports, module) {
      var utils = require_utils();
      var GedcomX = require_src();
      var Root = function(json) {
        if (!(this instanceof Root)) {
          return new Root(json);
        }
        if (Root.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      Root.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      Root._gedxClass = Root.prototype._gedxClass = "Root";
      Root.jsonProps = [
        "lang",
        "description",
        "persons",
        "relationships",
        "sourceDescriptions",
        "agents",
        "events",
        "documents",
        "places",
        "attribution"
      ];
      Root.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      Root.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setLang(json.lang);
          this.setPersons(json.persons);
          this.setRelationships(json.relationships);
          this.setSourceDescriptions(json.sourceDescriptions);
          this.setAgents(json.agents);
          this.setEvents(json.events);
          this.setDocuments(json.documents);
          this.setPlaces(json.places);
          this.setAttribution(json.attribution);
          this.setDescription(json.description);
        }
        return this;
      };
      Root.prototype.getLang = function() {
        return this.lang;
      };
      Root.prototype.setLang = function(lang) {
        if (lang) {
          this.lang = lang;
        }
        return this;
      };
      Root.prototype.getDescription = function() {
        return this.description;
      };
      Root.prototype.setDescription = function(description) {
        if (description) {
          this.description = description;
        }
        return this;
      };
      Root.prototype.getPersons = function() {
        return this.persons || [];
      };
      Root.prototype.setPersons = function(persons) {
        return this._setArray(persons, "persons", "addPerson");
      };
      Root.prototype.addPerson = function(person) {
        return this._arrayPush(person, "persons", GedcomX.Person);
      };
      Root.prototype.getPersonById = function(id) {
        return this.getPersons().find(function(p) {
          return p.getId() === id;
        });
      };
      Root.prototype.getRelationships = function() {
        return this.relationships || [];
      };
      Root.prototype.getPersonsRelationships = function(person) {
        return this.getRelationships().filter(function(rel) {
          return rel.involvesPerson(person);
        });
      };
      Root.prototype.getPersonsParentRelationships = function(person) {
        return this.getPersonsRelationships(person).filter(function(rel) {
          return rel.getType() === "http://gedcomx.org/ParentChild" && rel.getPerson2().matches(person);
        });
      };
      Root.prototype.getPersonsParents = function(person) {
        var root = this;
        return this.getPersonsParentRelationships(person).map(function(rel) {
          return root.getPersonById(rel.getPerson1().getResource().substring(1));
        }).filter(Boolean);
      };
      Root.prototype.getPersonsCoupleRelationships = function(person) {
        return this.getPersonsRelationships(person).filter(function(rel) {
          return rel.getType() === "http://gedcomx.org/Couple";
        });
      };
      Root.prototype.getPersonsSpouses = function(person) {
        var root = this;
        return this.getPersonsCoupleRelationships(person).map(function(rel) {
          return root.getPersonById(rel.getOtherPerson(person).getResource().substring(1));
        }).filter(Boolean);
      };
      Root.prototype.getPersonsChildRelationships = function(person) {
        return this.getPersonsRelationships(person).filter(function(rel) {
          return rel.getType() === "http://gedcomx.org/ParentChild" && rel.getPerson1().matches(person);
        });
      };
      Root.prototype.getPersonsChildren = function(person) {
        var root = this;
        return this.getPersonsChildRelationships(person).map(function(rel) {
          return root.getPersonById(rel.getPerson2().getResource().substring(1));
        }).filter(Boolean);
      };
      Root.prototype.setRelationships = function(relationships) {
        return this._setArray(relationships, "relationships", "addRelationship");
      };
      Root.prototype.addRelationship = function(relationship) {
        return this._arrayPush(relationship, "relationships", GedcomX.Relationship);
      };
      Root.prototype.getSourceDescriptions = function() {
        return this.sourceDescriptions || [];
      };
      Root.prototype.setSourceDescriptions = function(sourceDescriptions) {
        return this._setArray(sourceDescriptions, "sourceDescriptions", "addSourceDescription");
      };
      Root.prototype.addSourceDescription = function(sourceDescription) {
        return this._arrayPush(sourceDescription, "sourceDescriptions", GedcomX.SourceDescription);
      };
      Root.prototype.getAgents = function() {
        return this.agents || [];
      };
      Root.prototype.setAgents = function(agents) {
        return this._setArray(agents, "agents", "addAgent");
      };
      Root.prototype.addAgent = function(agent) {
        return this._arrayPush(agent, "agents", GedcomX.Agent);
      };
      Root.prototype.getEvents = function() {
        return this.events || [];
      };
      Root.prototype.setEvents = function(events) {
        return this._setArray(events, "events", "addEvent");
      };
      Root.prototype.addEvent = function(event) {
        return this._arrayPush(event, "events", GedcomX.Event);
      };
      Root.prototype.getDocuments = function() {
        return this.documents || [];
      };
      Root.prototype.setDocuments = function(documents) {
        return this._setArray(documents, "documents", "addDocument");
      };
      Root.prototype.addDocument = function(doc) {
        return this._arrayPush(doc, "documents", GedcomX.Document);
      };
      Root.prototype.getPlaces = function() {
        return this.places || [];
      };
      Root.prototype.setPlaces = function(places) {
        return this._setArray(places, "places", "addPlace");
      };
      Root.prototype.addPlace = function(place) {
        return this._arrayPush(place, "places", GedcomX.PlaceDescription);
      };
      Root.prototype.getAttribution = function() {
        return this.attribution;
      };
      Root.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = GedcomX.Attribution(attribution);
        }
        return this;
      };
      Root.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, Root.jsonProps);
      };
      module.exports = Root;
    }
  });

  // node_modules/gedcomx-js/src/core/SourceCitation.js
  var require_SourceCitation = __commonJS({
    "node_modules/gedcomx-js/src/core/SourceCitation.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var SourceCitation = function(json) {
        if (!(this instanceof SourceCitation)) {
          return new SourceCitation(json);
        }
        if (SourceCitation.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      SourceCitation.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      SourceCitation._gedxClass = SourceCitation.prototype._gedxClass = "GedcomX.SourceCitation";
      SourceCitation.jsonProps = [
        "lang",
        "value"
      ];
      SourceCitation.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      SourceCitation.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setLang(json.lang);
          this.setValue(json.value);
        }
        return this;
      };
      SourceCitation.prototype.getLang = function() {
        return this.lang;
      };
      SourceCitation.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      SourceCitation.prototype.getValue = function() {
        return this.value;
      };
      SourceCitation.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      SourceCitation.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, SourceCitation.jsonProps);
      };
      module.exports = SourceCitation;
    }
  });

  // node_modules/gedcomx-js/src/core/SourceDescription.js
  var require_SourceDescription = __commonJS({
    "node_modules/gedcomx-js/src/core/SourceDescription.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var SourceDescription = function(json) {
        if (!(this instanceof SourceDescription)) {
          return new SourceDescription(json);
        }
        if (SourceDescription.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      SourceDescription.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      SourceDescription._gedxClass = SourceDescription.prototype._gedxClass = "GedcomX.SourceDescription";
      SourceDescription.jsonProps = [
        "resourceType",
        "citations",
        "mediaType",
        "about",
        "mediator",
        "sources",
        "analysis",
        "componentOf",
        "titles",
        "notes",
        "attribution",
        "rights",
        "coverage",
        "descriptions",
        "identifiers",
        "created",
        "modified",
        "repository"
      ];
      SourceDescription.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      SourceDescription.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setResourceType(json.resourceType);
          this.setCitations(json.citations);
          this.setMediaType(json.mediaType);
          this.setAbout(json.about);
          this.setMediator(json.mediator);
          this.setSources(json.sources);
          this.setAnalysis(json.analysis);
          this.setComponentOf(json.componentOf);
          this.setTitles(json.titles);
          this.setNotes(json.notes);
          this.setAttribution(json.attribution);
          this.setRights(json.rights);
          this.setCoverage(json.coverage);
          this.setDescriptions(json.descriptions);
          this.setIdentifiers(json.identifiers);
          this.setCreated(json.created);
          this.setModified(json.modified);
          this.setRepository(json.repository);
        }
        return this;
      };
      SourceDescription.prototype.getResourceType = function() {
        return this.resourceType;
      };
      SourceDescription.prototype.setResourceType = function(resourceType) {
        this.resourceType = resourceType;
        return this;
      };
      SourceDescription.prototype.getCitations = function() {
        return this.citations || [];
      };
      SourceDescription.prototype.setCitations = function(citations) {
        return this._setArray(citations, "citations", "addCitation");
      };
      SourceDescription.prototype.addCitation = function(citation) {
        return this._arrayPush(citation, "citations", GedcomX.SourceCitation);
      };
      SourceDescription.prototype.getMediaType = function() {
        return this.mediaType;
      };
      SourceDescription.prototype.setMediaType = function(mediaType) {
        this.mediaType = mediaType;
        return this;
      };
      SourceDescription.prototype.getAbout = function() {
        return this.about;
      };
      SourceDescription.prototype.setAbout = function(about) {
        this.about = about;
        return this;
      };
      SourceDescription.prototype.getMediator = function() {
        return this.mediator;
      };
      SourceDescription.prototype.setMediator = function(mediator) {
        if (mediator) {
          this.mediator = GedcomX.ResourceReference(mediator);
        }
        return this;
      };
      SourceDescription.prototype.getSources = function() {
        return this.sources || [];
      };
      SourceDescription.prototype.setSources = function(sources) {
        return this._setArray(sources, "sources", "addSource");
      };
      SourceDescription.prototype.addSource = function(source) {
        return this._arrayPush(source, "sources", GedcomX.SourceReference);
      };
      SourceDescription.prototype.getAnalysis = function() {
        return this.analysis;
      };
      SourceDescription.prototype.setAnalysis = function(analysis) {
        if (analysis) {
          this.analysis = GedcomX.ResourceReference(analysis);
        }
        return this;
      };
      SourceDescription.prototype.getComponentOf = function() {
        return this.componentOf;
      };
      SourceDescription.prototype.setComponentOf = function(componentOf) {
        if (componentOf) {
          this.componentOf = GedcomX.SourceReference(componentOf);
        }
        return this;
      };
      SourceDescription.prototype.getTitles = function() {
        return this.titles || [];
      };
      SourceDescription.prototype.setTitles = function(titles) {
        return this._setArray(titles, "titles", "addTitle");
      };
      SourceDescription.prototype.addTitle = function(title) {
        return this._arrayPush(title, "titles", GedcomX.TextValue);
      };
      SourceDescription.prototype.getNotes = function() {
        return this.notes || [];
      };
      SourceDescription.prototype.setNotes = function(notes) {
        return this._setArray(notes, "notes", "addNote");
      };
      SourceDescription.prototype.addNote = function(note) {
        return this._arrayPush(note, "notes", GedcomX.Note);
      };
      SourceDescription.prototype.getAttribution = function() {
        return this.attribution;
      };
      SourceDescription.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = GedcomX.Attribution(attribution);
        }
        return this;
      };
      SourceDescription.prototype.getRights = function() {
        return this.rights || [];
      };
      SourceDescription.prototype.setRights = function(rights) {
        return this._setArray(rights, "rights", "addRight");
      };
      SourceDescription.prototype.addRight = function(right) {
        return this._arrayPush(right, "rights", GedcomX.ResourceReference);
      };
      SourceDescription.prototype.getCoverage = function() {
        return this.coverage || [];
      };
      SourceDescription.prototype.setCoverage = function(coverage) {
        return this._setArray(coverage, "coverage", "addCoverage");
      };
      SourceDescription.prototype.addCoverage = function(coverage) {
        return this._arrayPush(coverage, "coverage", GedcomX.Coverage);
      };
      SourceDescription.prototype.getDescriptions = function() {
        return this.descriptions || [];
      };
      SourceDescription.prototype.setDescriptions = function(descriptions) {
        return this._setArray(descriptions, "descriptions", "addDescription");
      };
      SourceDescription.prototype.addDescription = function(description) {
        return this._arrayPush(description, "descriptions", GedcomX.TextValue);
      };
      SourceDescription.prototype.getIdentifiers = function() {
        return this.identifiers;
      };
      SourceDescription.prototype.setIdentifiers = function(identifiers) {
        if (identifiers) {
          this.identifiers = GedcomX.Identifiers(identifiers);
        }
        return this;
      };
      SourceDescription.prototype.getCreated = function() {
        return this.created;
      };
      SourceDescription.prototype.setCreated = function(created) {
        this.created = created;
        return this;
      };
      SourceDescription.prototype.getModified = function() {
        return this.modified;
      };
      SourceDescription.prototype.setModified = function(modified) {
        this.modified = modified;
        return this;
      };
      SourceDescription.prototype.getRepository = function() {
        return this.repository;
      };
      SourceDescription.prototype.setRepository = function(repository) {
        if (repository) {
          this.repository = GedcomX.ResourceReference(repository);
        }
        return this;
      };
      SourceDescription.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, SourceDescription.jsonProps);
      };
      module.exports = SourceDescription;
    }
  });

  // node_modules/gedcomx-js/src/core/SourceReference.js
  var require_SourceReference = __commonJS({
    "node_modules/gedcomx-js/src/core/SourceReference.js"(exports, module) {
      var GedcomX = require_src();
      var utils = require_utils();
      var SourceReference = function(json) {
        if (!(this instanceof SourceReference)) {
          return new SourceReference(json);
        }
        if (SourceReference.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      SourceReference.prototype = Object.create(GedcomX.ExtensibleData.prototype);
      SourceReference._gedxClass = SourceReference.prototype._gedxClass = "GedcomX.SourceReference";
      SourceReference.jsonProps = [
        "description",
        "descriptionId",
        "attribution"
      ];
      SourceReference.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      SourceReference.prototype.init = function(json) {
        GedcomX.ExtensibleData.prototype.init.call(this, json);
        if (json) {
          this.setDescription(json.description);
          this.setDescriptionId(json.descriptionId);
          this.setAttribution(json.attribution);
        }
        return this;
      };
      SourceReference.prototype.getDescription = function() {
        return this.description;
      };
      SourceReference.prototype.setDescription = function(description) {
        this.description = description;
        return this;
      };
      SourceReference.prototype.getDescriptionId = function() {
        return this.descriptionId;
      };
      SourceReference.prototype.setDescriptionId = function(descriptionId) {
        this.descriptionId = descriptionId;
        return this;
      };
      SourceReference.prototype.getAttribution = function() {
        return this.attribution;
      };
      SourceReference.prototype.setAttribution = function(attribution) {
        if (attribution) {
          this.attribution = new GedcomX.Attribution(attribution);
        }
        return this;
      };
      SourceReference.prototype.toJSON = function() {
        return this._toJSON(GedcomX.ExtensibleData, SourceReference.jsonProps);
      };
      module.exports = SourceReference;
    }
  });

  // node_modules/gedcomx-js/src/core/TextValue.js
  var require_TextValue = __commonJS({
    "node_modules/gedcomx-js/src/core/TextValue.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var TextValue = function(json) {
        if (!(this instanceof TextValue)) {
          return new TextValue(json);
        }
        if (TextValue.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      TextValue.prototype = Object.create(Base.prototype);
      TextValue._gedxClass = TextValue.prototype._gedxClass = "GedcomX.TextValue";
      TextValue.jsonProps = [
        "lang",
        "value"
      ];
      TextValue.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      TextValue.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        if (json) {
          this.setLang(json.lang);
          this.setValue(json.value);
        }
        return this;
      };
      TextValue.prototype.getLang = function() {
        return this.lang;
      };
      TextValue.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      TextValue.prototype.getValue = function() {
        return this.value;
      };
      TextValue.prototype.setValue = function(value) {
        this.value = value;
        return this;
      };
      TextValue.prototype.toJSON = function() {
        return this._toJSON(Base, TextValue.jsonProps);
      };
      module.exports = TextValue;
    }
  });

  // node_modules/gedcomx-js/src/rs/Link.js
  var require_Link = __commonJS({
    "node_modules/gedcomx-js/src/rs/Link.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), Base = require_Base();
        var Link = function(json) {
          if (!(this instanceof Link)) {
            return new Link(json);
          }
          if (Link.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        Link.prototype = Object.create(Base.prototype);
        Link._gedxClass = Link.prototype._gedxClass = "GedcomX.Link";
        Link.jsonProps = [
          "rel",
          "href",
          "template",
          "type",
          "accept",
          "allow",
          "hreflang",
          "title"
        ];
        Link.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        Link.prototype.init = function(json) {
          Base.prototype.init.call(this, json);
          if (json) {
            this.setRel(json.rel);
            this.setHref(json.href);
            this.setTemplate(json.template);
            this.setType(json.type);
            this.setAccept(json.accept);
            this.setAllow(json.allow);
            this.setHrefLang(json.hreflang);
            this.setTitle(json.title);
          }
          return this;
        };
        Link.prototype.getRel = function() {
          return this.rel;
        };
        Link.prototype.setRel = function(rel) {
          if (rel) {
            this.rel = rel;
          }
          return this;
        };
        Link.prototype.getHref = function() {
          return this.href;
        };
        Link.prototype.setHref = function(href) {
          if (href) {
            this.href = href;
          }
          return this;
        };
        Link.prototype.getTemplate = function() {
          return this.template;
        };
        Link.prototype.setTemplate = function(template) {
          if (template) {
            this.template = template;
          }
          return this;
        };
        Link.prototype.getType = function() {
          return this.type;
        };
        Link.prototype.setType = function(type) {
          if (type) {
            this.type = type;
          }
          return this;
        };
        Link.prototype.getAccept = function() {
          return this.accept;
        };
        Link.prototype.setAccept = function(accept) {
          if (accept) {
            this.accept = accept;
          }
          return this;
        };
        Link.prototype.getAllow = function() {
          return this.allow;
        };
        Link.prototype.setAllow = function(allow) {
          if (allow) {
            this.allow = allow;
          }
          return this;
        };
        Link.prototype.getHrefLang = function() {
          return this.hreflang;
        };
        Link.prototype.setHrefLang = function(hreflang) {
          if (hreflang) {
            this.hreflang = hreflang;
          }
          return this;
        };
        Link.prototype.getTitle = function() {
          return this.title;
        };
        Link.prototype.setTitle = function(title) {
          if (title) {
            this.title = title;
          }
          return this;
        };
        Link.prototype.toJSON = function() {
          return this._toJSON(Base, Link.jsonProps);
        };
        GedcomX.Link = Link;
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/Links.js
  var require_Links = __commonJS({
    "node_modules/gedcomx-js/src/rs/Links.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), Base = require_Base();
        var Links = function(json) {
          if (!(this instanceof Links)) {
            return new Links(json);
          }
          if (Links.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        Links.prototype = Object.create(Base.prototype);
        Links._gedxClass = Links.prototype._gedxClass = "GedcomX.Links";
        Links.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        Links.prototype.init = function(json) {
          Base.prototype.init.call(this, json);
          this.links = [];
          if (json) {
            this.setLinks(json);
          }
          return this;
        };
        Links.prototype.getLinks = function() {
          return this.links;
        };
        Links.prototype.getLink = function(rel) {
          return this.links.find(function(link) {
            return link.getRel() === rel;
          });
        };
        Links.prototype.addLink = function(link) {
          this.links.push(GedcomX.Link(link));
          return this;
        };
        Links.prototype.setLinks = function(links) {
          this.links = [];
          if (links) {
            if (Array.isArray(links)) {
              for (var i = 0; i < links.length; i++) {
                this.addLink(links[i]);
              }
            } else {
              for (var rel in links) {
                this.addLink(new GedcomX.Link(links[rel]).setRel(rel));
              }
            }
          }
          return this;
        };
        Links.prototype.toJSON = function() {
          var links = this.getLinks(), json = {}, linkJson, rel;
          for (var i = 0; i < links.length; i++) {
            linkJson = utils.toJSON(links[i]);
            rel = linkJson.rel;
            if (rel) {
              delete linkJson.rel;
              json[rel] = linkJson;
            }
          }
          return json;
        };
        GedcomX.Links = Links;
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/FamilyView.js
  var require_FamilyView = __commonJS({
    "node_modules/gedcomx-js/src/rs/FamilyView.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), Base = require_Base();
        var FamilyView = function(json) {
          if (!(this instanceof FamilyView)) {
            return new FamilyView(json);
          }
          if (FamilyView.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        FamilyView.prototype = Object.create(Base.prototype);
        FamilyView._gedxClass = FamilyView.prototype._gedxClass = "GedcomX.FamilyView";
        FamilyView.jsonProps = [
          "parent1",
          "parent2",
          "children"
        ];
        FamilyView.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        FamilyView.prototype.init = function(json) {
          Base.prototype.init.call(this, json);
          if (json) {
            this.setParent1(json.parent1);
            this.setParent2(json.parent2);
            this.setChildren(json.children);
          }
          return this;
        };
        FamilyView.prototype.setParent1 = function(parent1) {
          if (parent1) {
            this.parent1 = GedcomX.ResourceReference(parent1);
          }
          return this;
        };
        FamilyView.prototype.getParent1 = function() {
          return this.parent1;
        };
        FamilyView.prototype.setParent2 = function(parent2) {
          if (parent2) {
            this.parent2 = GedcomX.ResourceReference(parent2);
          }
          return this;
        };
        FamilyView.prototype.getParent2 = function() {
          return this.parent2;
        };
        FamilyView.prototype.getChildren = function() {
          return this.children || [];
        };
        FamilyView.prototype.setChildren = function(children) {
          return this._setArray(children, "children", "addChild");
        };
        FamilyView.prototype.addChild = function(child) {
          return this._arrayPush(child, "children", GedcomX.ResourceReference);
        };
        FamilyView.prototype.toJSON = function() {
          return this._toJSON(Base, FamilyView.jsonProps);
        };
        GedcomX.FamilyView = FamilyView;
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/DisplayProperties.js
  var require_DisplayProperties = __commonJS({
    "node_modules/gedcomx-js/src/rs/DisplayProperties.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), Base = require_Base();
        var DisplayProperties = function(json) {
          if (!(this instanceof DisplayProperties)) {
            return new DisplayProperties(json);
          }
          if (DisplayProperties.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        DisplayProperties.prototype = Object.create(Base.prototype);
        DisplayProperties._gedxClass = DisplayProperties.prototype._gedxClass = "GedcomX.DisplayProperties";
        DisplayProperties.jsonProps = [
          "name",
          "gender",
          "lifespan",
          "birthDate",
          "birthPlace",
          "deathDate",
          "deathPlace",
          "marriageDate",
          "marriagePlace",
          "ascendancyNumber",
          "descendancyNumber",
          "familiesAsParent",
          "familiesAsChild"
        ];
        DisplayProperties.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        DisplayProperties.prototype.init = function(json) {
          Base.prototype.init.call(this, json);
          if (json) {
            this.setName(json.name);
            this.setGender(json.gender);
            this.setLifespan(json.lifespan);
            this.setBirthDate(json.birthDate);
            this.setBirthPlace(json.birthPlace);
            this.setDeathDate(json.deathDate);
            this.setDeathPlace(json.deathPlace);
            this.setMarriageDate(json.marriageDate);
            this.setMarriagePlace(json.marriagePlace);
            this.setAscendancyNumber(json.ascendancyNumber);
            this.setDescendancyNumber(json.descendancyNumber);
            this.setFamiliesAsParent(json.familiesAsParent);
            this.setFamiliesAsChild(json.familiesAsChild);
          }
          return this;
        };
        DisplayProperties.prototype.setName = function(name) {
          this.name = name;
          return this;
        };
        DisplayProperties.prototype.getName = function() {
          return this.name;
        };
        DisplayProperties.prototype.setGender = function(gender) {
          this.gender = gender;
          return this;
        };
        DisplayProperties.prototype.getGender = function() {
          return this.gender;
        };
        DisplayProperties.prototype.setLifespan = function(lifespan) {
          this.lifespan = lifespan;
          return this;
        };
        DisplayProperties.prototype.getLifespan = function() {
          return this.lifespan;
        };
        DisplayProperties.prototype.setBirthDate = function(birthDate) {
          this.birthDate = birthDate;
          return this;
        };
        DisplayProperties.prototype.getBirthDate = function() {
          return this.birthDate;
        };
        DisplayProperties.prototype.setBirthPlace = function(birthPlace) {
          this.birthPlace = birthPlace;
          return this;
        };
        DisplayProperties.prototype.getBirthPlace = function() {
          return this.birthPlace;
        };
        DisplayProperties.prototype.setDeathDate = function(deathDate) {
          this.deathDate = deathDate;
          return this;
        };
        DisplayProperties.prototype.getDeathDate = function() {
          return this.deathDate;
        };
        DisplayProperties.prototype.setDeathPlace = function(deathPlace) {
          this.deathPlace = deathPlace;
          return this;
        };
        DisplayProperties.prototype.getDeathPlace = function() {
          return this.deathPlace;
        };
        DisplayProperties.prototype.setMarriageDate = function(marriageDate) {
          this.marriageDate = marriageDate;
          return this;
        };
        DisplayProperties.prototype.getMarriageDate = function() {
          return this.marriageDate;
        };
        DisplayProperties.prototype.setMarriagePlace = function(marriagePlace) {
          this.marriagePlace = marriagePlace;
          return this;
        };
        DisplayProperties.prototype.getMarriagePlace = function() {
          return this.marriagePlace;
        };
        DisplayProperties.prototype.setAscendancyNumber = function(ascendancyNumber) {
          this.ascendancyNumber = ascendancyNumber;
          return this;
        };
        DisplayProperties.prototype.getAscendancyNumber = function() {
          return this.ascendancyNumber;
        };
        DisplayProperties.prototype.setDescendancyNumber = function(descendancyNumber) {
          this.descendancyNumber = descendancyNumber;
          return this;
        };
        DisplayProperties.prototype.getDescendancyNumber = function() {
          return this.descendancyNumber;
        };
        DisplayProperties.prototype.setFamiliesAsParent = function(families) {
          return this._setArray(families, "familiesAsParent", "addFamilyAsParent");
        };
        DisplayProperties.prototype.addFamilyAsParent = function(family) {
          return this._arrayPush(family, "familiesAsParent", GedcomX.FamilyView);
        };
        DisplayProperties.prototype.getFamiliesAsParent = function() {
          return this.familiesAsParent || [];
        };
        DisplayProperties.prototype.setFamiliesAsChild = function(families) {
          return this._setArray(families, "familiesAsChild", "addFamilyAsChild");
        };
        DisplayProperties.prototype.addFamilyAsChild = function(family) {
          return this._arrayPush(family, "familiesAsChild", GedcomX.FamilyView);
        };
        DisplayProperties.prototype.getFamiliesAsChild = function() {
          return this.familiesAsChild || [];
        };
        DisplayProperties.prototype.toJSON = function() {
          return this._toJSON(Base, DisplayProperties.jsonProps);
        };
        GedcomX.DisplayProperties = DisplayProperties;
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/PlaceDisplayProperties.js
  var require_PlaceDisplayProperties = __commonJS({
    "node_modules/gedcomx-js/src/rs/PlaceDisplayProperties.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), Base = require_Base();
        var PlaceDisplayProperties = function(json) {
          if (!(this instanceof PlaceDisplayProperties)) {
            return new PlaceDisplayProperties(json);
          }
          if (PlaceDisplayProperties.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        PlaceDisplayProperties.prototype = Object.create(Base.prototype);
        PlaceDisplayProperties._gedxClass = PlaceDisplayProperties.prototype._gedxClass = "GedcomX.PlaceDisplayProperties";
        PlaceDisplayProperties.jsonProps = [
          "name",
          "fullName",
          "type"
        ];
        PlaceDisplayProperties.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        PlaceDisplayProperties.prototype.init = function(json) {
          Base.prototype.init.call(this, json);
          if (json) {
            this.setName(json.name);
            this.setFullName(json.fullName);
            this.setType(json.type);
          }
          return this;
        };
        PlaceDisplayProperties.prototype.setName = function(name) {
          this.name = name;
          return this;
        };
        PlaceDisplayProperties.prototype.getName = function() {
          return this.name;
        };
        PlaceDisplayProperties.prototype.setFullName = function(fullName) {
          this.fullName = fullName;
          return this;
        };
        PlaceDisplayProperties.prototype.getFullName = function() {
          return this.fullName;
        };
        PlaceDisplayProperties.prototype.setType = function(type) {
          this.type = type;
          return this;
        };
        PlaceDisplayProperties.prototype.getType = function() {
          return this.type;
        };
        PlaceDisplayProperties.prototype.toJSON = function() {
          return this._toJSON(Base, PlaceDisplayProperties.jsonProps);
        };
        GedcomX.PlaceDisplayProperties = PlaceDisplayProperties;
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/ExtensibleData.js
  var require_ExtensibleData2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/ExtensibleData.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.ExtensibleData.jsonProps.push("links");
        var oldExtensibleDataInit = GedcomX.ExtensibleData.prototype.init;
        GedcomX.ExtensibleData.prototype.init = function(json) {
          oldExtensibleDataInit.call(this, json);
          if (json) {
            this.setLinks(json.links);
          }
        };
        GedcomX.ExtensibleData.prototype.setLinks = function(links) {
          if (links) {
            this.links = GedcomX.Links(links);
          }
          return this;
        };
        GedcomX.ExtensibleData.prototype.addLink = function(link) {
          if (link) {
            if (!this.links) {
              this.links = GedcomX.Links();
            }
            this.links.addLink(link);
          }
          return this;
        };
        GedcomX.ExtensibleData.prototype.getLinks = function() {
          return this.links ? this.links.getLinks() : [];
        };
        GedcomX.ExtensibleData.prototype.getLink = function(rel) {
          if (this.links) {
            return this.links.getLink(rel);
          }
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/Date.js
  var require_Date2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/Date.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Date.jsonProps.push("normalized");
        var oldInit = GedcomX.Date.prototype.init;
        GedcomX.Date.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setNormalized(json.normalized);
          }
        };
        GedcomX.Date.prototype.setNormalized = function(normalized) {
          return this._setArray(normalized, "normalized", "addNormalized");
        };
        GedcomX.Date.prototype.addNormalized = function(normalized) {
          return this._arrayPush(normalized, "normalized", GedcomX.TextValue);
        };
        GedcomX.Date.prototype.getNormalized = function() {
          return this.normalized || [];
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/PlaceReference.js
  var require_PlaceReference2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/PlaceReference.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.PlaceReference.jsonProps.push("normalized");
        var oldInit = GedcomX.PlaceReference.prototype.init;
        GedcomX.PlaceReference.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setNormalized(json.normalized);
          }
        };
        GedcomX.PlaceReference.prototype.setNormalized = function(normalized) {
          return this._setArray(normalized, "normalized", "addNormalized");
        };
        GedcomX.PlaceReference.prototype.addNormalized = function(normalized) {
          return this._arrayPush(normalized, "normalized", GedcomX.TextValue);
        };
        GedcomX.PlaceReference.prototype.getNormalized = function() {
          return this.normalized || [];
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/Name.js
  var require_Name2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/Name.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Name.jsonProps.push("preferred");
        var oldInit = GedcomX.Name.prototype.init;
        GedcomX.Name.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setPreferred(json.preferred);
          }
        };
        GedcomX.Name.prototype.setPreferred = function(preferred) {
          this.preferred = preferred;
          return this;
        };
        GedcomX.Name.prototype.getPreferred = function() {
          return this.preferred;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/Person.js
  var require_Person2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/Person.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Person.jsonProps.push("living", "display");
        var oldInit = GedcomX.Person.prototype.init;
        GedcomX.Person.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setLiving(json.living);
            this.setDisplay(json.display);
          }
        };
        GedcomX.Person.prototype.setLiving = function(living) {
          this.living = living;
          return this;
        };
        GedcomX.Person.prototype.getLiving = function() {
          return this.living;
        };
        GedcomX.Person.prototype.setDisplay = function(display) {
          if (display) {
            this.display = GedcomX.DisplayProperties(display);
          }
          return this;
        };
        GedcomX.Person.prototype.getDisplay = function() {
          return this.display;
        };
        GedcomX.Person.prototype.getPreferredName = function() {
          return this.getNames().find(function(n) {
            return n.getPreferred();
          });
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/ResourceReference.js
  var require_ResourceReference2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/ResourceReference.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.ResourceReference.jsonProps.push("resourceId");
        var oldInit = GedcomX.ResourceReference.prototype.init;
        GedcomX.ResourceReference.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setResourceId(json.resourceId);
          }
        };
        GedcomX.ResourceReference.prototype.setResourceId = function(resourceId) {
          this.resourceId = resourceId;
          return this;
        };
        GedcomX.ResourceReference.prototype.getResourceId = function() {
          return this.resourceId;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/Conclusion.js
  var require_Conclusion2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/Conclusion.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Conclusion.jsonProps.push("sortKey");
        var oldInit = GedcomX.Conclusion.prototype.init;
        GedcomX.Conclusion.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setSortKey(json.sortKey);
          }
        };
        GedcomX.Conclusion.prototype.setSortKey = function(sortKey) {
          this.sortKey = sortKey;
          return this;
        };
        GedcomX.Conclusion.prototype.getSortKey = function() {
          return this.sortKey;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/SourceDescription.js
  var require_SourceDescription2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/SourceDescription.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.SourceDescription.jsonProps.push("sortKey", "version");
        var oldInit = GedcomX.SourceDescription.prototype.init;
        GedcomX.SourceDescription.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setSortKey(json.sortKey);
            this.setVersion(json.version);
          }
        };
        GedcomX.SourceDescription.prototype.setSortKey = function(sortKey) {
          this.sortKey = sortKey;
          return this;
        };
        GedcomX.SourceDescription.prototype.getSortKey = function() {
          return this.sortKey;
        };
        GedcomX.SourceDescription.prototype.setVersion = function(version) {
          this.version = version;
          return this;
        };
        GedcomX.SourceDescription.prototype.getVersion = function() {
          return this.version;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/PlaceDescription.js
  var require_PlaceDescription2 = __commonJS({
    "node_modules/gedcomx-js/src/rs/PlaceDescription.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.PlaceDescription.jsonProps.push("display");
        var oldInit = GedcomX.PlaceDescription.prototype.init;
        GedcomX.PlaceDescription.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setDisplay(json.display);
          }
        };
        GedcomX.PlaceDescription.prototype.setDisplay = function(display) {
          if (display) {
            this.display = GedcomX.PlaceDisplayProperties(display);
          }
          return this;
        };
        GedcomX.PlaceDescription.prototype.getDisplay = function() {
          return this.display;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/rs/index.js
  var require_rs = __commonJS({
    "node_modules/gedcomx-js/src/rs/index.js"(exports, module) {
      module.exports = function(GedcomX) {
        require_Link()(GedcomX);
        require_Links()(GedcomX);
        require_FamilyView()(GedcomX);
        require_DisplayProperties()(GedcomX);
        require_PlaceDisplayProperties()(GedcomX);
        require_ExtensibleData2()(GedcomX);
        require_Date2()(GedcomX);
        require_PlaceReference2()(GedcomX);
        require_Name2()(GedcomX);
        require_Person2()(GedcomX);
        require_ResourceReference2()(GedcomX);
        require_Conclusion2()(GedcomX);
        require_SourceDescription2()(GedcomX);
        require_PlaceDescription2()(GedcomX);
      };
    }
  });

  // node_modules/gedcomx-js/src/records/FieldValueDescriptor.js
  var require_FieldValueDescriptor = __commonJS({
    "node_modules/gedcomx-js/src/records/FieldValueDescriptor.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var FieldValueDescriptor = function(json) {
          if (!(this instanceof FieldValueDescriptor)) {
            return new FieldValueDescriptor(json);
          }
          if (FieldValueDescriptor.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        FieldValueDescriptor.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        FieldValueDescriptor._gedxClass = FieldValueDescriptor.prototype._gedxClass = "GedcomX.FieldValueDescriptor";
        FieldValueDescriptor.jsonProps = [
          "type",
          "labelId",
          "optional",
          "displayLabels"
        ];
        FieldValueDescriptor.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        FieldValueDescriptor.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setOptional(json.optional);
            this.setType(json.type);
            this.setLabelId(json.labelId);
            this.setDisplayLabels(json.displayLabels);
          }
          return this;
        };
        FieldValueDescriptor.prototype.setOptional = function(optional) {
          this.optional = optional;
          return this;
        };
        FieldValueDescriptor.prototype.getOptional = function() {
          return this.optional;
        };
        FieldValueDescriptor.prototype.setType = function(type) {
          this.type = type;
          return this;
        };
        FieldValueDescriptor.prototype.getType = function() {
          return this.type;
        };
        FieldValueDescriptor.prototype.setLabelId = function(labelId) {
          this.labelId = labelId;
          return this;
        };
        FieldValueDescriptor.prototype.getLabelId = function() {
          return this.labelId;
        };
        FieldValueDescriptor.prototype.setDisplayLabels = function(labels) {
          return this._setArray(labels, "displayLabels", "addDisplayLabel");
        };
        FieldValueDescriptor.prototype.addDisplayLabel = function(label) {
          return this._arrayPush(label, "displayLabels", GedcomX.TextValue);
        };
        FieldValueDescriptor.prototype.getDisplayLabels = function() {
          return this.displayLabels || [];
        };
        FieldValueDescriptor.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, FieldValueDescriptor.jsonProps);
        };
        GedcomX.FieldValueDescriptor = FieldValueDescriptor;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/FieldDescriptor.js
  var require_FieldDescriptor = __commonJS({
    "node_modules/gedcomx-js/src/records/FieldDescriptor.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var FieldDescriptor = function(json) {
          if (!(this instanceof FieldDescriptor)) {
            return new FieldDescriptor(json);
          }
          if (FieldDescriptor.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        FieldDescriptor.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        FieldDescriptor._gedxClass = FieldDescriptor.prototype._gedxClass = "GedcomX.FieldDescriptor";
        FieldDescriptor.jsonProps = [
          "originalLabel",
          "descriptions",
          "values"
        ];
        FieldDescriptor.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        FieldDescriptor.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setOriginalLabel(json.originalLabel);
            this.setDescriptions(json.descriptions);
            this.setValues(json.values);
          }
          return this;
        };
        FieldDescriptor.prototype.setOriginalLabel = function(originalLabel) {
          this.originalLabel = originalLabel;
          return this;
        };
        FieldDescriptor.prototype.getOriginalLabel = function() {
          return this.originalLabel;
        };
        FieldDescriptor.prototype.setDescriptions = function(descriptions) {
          return this._setArray(descriptions, "descriptions", "addDescription");
        };
        FieldDescriptor.prototype.addDescription = function(description) {
          return this._arrayPush(description, "descriptions", GedcomX.TextValue);
        };
        FieldDescriptor.prototype.getDescriptions = function() {
          return this.descriptions || [];
        };
        FieldDescriptor.prototype.setValues = function(values) {
          return this._setArray(values, "values", "addValue");
        };
        FieldDescriptor.prototype.addValue = function(value) {
          return this._arrayPush(value, "values", GedcomX.FieldValueDescriptor);
        };
        FieldDescriptor.prototype.getValues = function() {
          return this.values || [];
        };
        FieldDescriptor.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, FieldDescriptor.jsonProps);
        };
        GedcomX.FieldDescriptor = FieldDescriptor;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/RecordDescriptor.js
  var require_RecordDescriptor = __commonJS({
    "node_modules/gedcomx-js/src/records/RecordDescriptor.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var RecordDescriptor = function(json) {
          if (!(this instanceof RecordDescriptor)) {
            return new RecordDescriptor(json);
          }
          if (RecordDescriptor.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        RecordDescriptor.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        RecordDescriptor._gedxClass = RecordDescriptor.prototype._gedxClass = "GedcomX.RecordDescriptor";
        RecordDescriptor.jsonProps = [
          "lang",
          "fields"
        ];
        RecordDescriptor.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        RecordDescriptor.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setLang(json.lang);
            this.setFields(json.fields);
          }
          return this;
        };
        RecordDescriptor.prototype.setLang = function(lang) {
          this.lang = lang;
          return this;
        };
        RecordDescriptor.prototype.getLang = function() {
          return this.lang;
        };
        RecordDescriptor.prototype.setFields = function(fields) {
          return this._setArray(fields, "fields", "addField");
        };
        RecordDescriptor.prototype.addField = function(field) {
          return this._arrayPush(field, "fields", GedcomX.FieldDescriptor);
        };
        RecordDescriptor.prototype.getFields = function() {
          return this.fields || [];
        };
        RecordDescriptor.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, RecordDescriptor.jsonProps);
        };
        GedcomX.RecordDescriptor = RecordDescriptor;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/FieldValue.js
  var require_FieldValue = __commonJS({
    "node_modules/gedcomx-js/src/records/FieldValue.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var FieldValue = function(json) {
          if (!(this instanceof FieldValue)) {
            return new FieldValue(json);
          }
          if (FieldValue.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        FieldValue.prototype = Object.create(GedcomX.Conclusion.prototype);
        FieldValue._gedxClass = FieldValue.prototype._gedxClass = "GedcomX.FieldValue";
        FieldValue.jsonProps = [
          "type",
          "labelId",
          "text",
          "datatype",
          "resource"
        ];
        FieldValue.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        FieldValue.prototype.init = function(json) {
          GedcomX.Conclusion.prototype.init.call(this, json);
          if (json) {
            this.setType(json.type);
            this.setLabelId(json.labelId);
            this.setText(json.text);
            this.setDataType(json.datatype);
            this.setResource(json.resource);
          }
          return this;
        };
        FieldValue.prototype.setType = function(type) {
          this.type = type;
          return this;
        };
        FieldValue.prototype.getType = function() {
          return this.type;
        };
        FieldValue.prototype.setLabelId = function(labelId) {
          this.labelId = labelId;
          return this;
        };
        FieldValue.prototype.getLabelId = function() {
          return this.labelId;
        };
        FieldValue.prototype.setText = function(text) {
          this.text = text;
          return this;
        };
        FieldValue.prototype.getText = function() {
          return this.text;
        };
        FieldValue.prototype.setDataType = function(datatype) {
          this.datatype = datatype;
          return this;
        };
        FieldValue.prototype.getDataType = function() {
          return this.datatype;
        };
        FieldValue.prototype.setResource = function(resource) {
          this.resource = resource;
          return this;
        };
        FieldValue.prototype.getResource = function() {
          return this.resource;
        };
        FieldValue.prototype.toJSON = function() {
          return this._toJSON(GedcomX.Conclusion, FieldValue.jsonProps);
        };
        GedcomX.FieldValue = FieldValue;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Field.js
  var require_Field = __commonJS({
    "node_modules/gedcomx-js/src/records/Field.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var Field = function(json) {
          if (!(this instanceof Field)) {
            return new Field(json);
          }
          if (Field.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        Field.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        Field._gedxClass = Field.prototype._gedxClass = "GedcomX.Field";
        Field.jsonProps = [
          "type",
          "values"
        ];
        Field.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        Field.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setType(json.type);
            this.setValues(json.values);
          }
          return this;
        };
        Field.prototype.setType = function(type) {
          this.type = type;
          return this;
        };
        Field.prototype.getType = function() {
          return this.type;
        };
        Field.prototype.setValues = function(values) {
          return this._setArray(values, "values", "addValue");
        };
        Field.prototype.addValue = function(value) {
          return this._arrayPush(value, "values", GedcomX.FieldValue);
        };
        Field.prototype.getValues = function() {
          return this.values || [];
        };
        Field.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, Field.jsonProps);
        };
        GedcomX.Field = Field;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/CollectionContent.js
  var require_CollectionContent = __commonJS({
    "node_modules/gedcomx-js/src/records/CollectionContent.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var CollectionContent = function(json) {
          if (!(this instanceof CollectionContent)) {
            return new CollectionContent(json);
          }
          if (CollectionContent.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        CollectionContent.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        CollectionContent._gedxClass = CollectionContent.prototype._gedxClass = "GedcomX.CollectionContent";
        CollectionContent.jsonProps = [
          "resourceType",
          "count",
          "completeness"
        ];
        CollectionContent.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        CollectionContent.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setResourceType(json.resourceType);
            this.setCount(json.count);
            this.setCompleteness(json.completeness);
          }
          return this;
        };
        CollectionContent.prototype.setResourceType = function(resourceType) {
          this.resourceType = resourceType;
          return this;
        };
        CollectionContent.prototype.getResourceType = function() {
          return this.resourceType;
        };
        CollectionContent.prototype.setCount = function(count) {
          this.count = count;
          return this;
        };
        CollectionContent.prototype.getCount = function() {
          return this.count;
        };
        CollectionContent.prototype.setCompleteness = function(completeness) {
          this.completeness = completeness;
          return this;
        };
        CollectionContent.prototype.getCompleteness = function() {
          return this.completeness;
        };
        CollectionContent.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, CollectionContent.jsonProps);
        };
        GedcomX.CollectionContent = CollectionContent;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Collection.js
  var require_Collection = __commonJS({
    "node_modules/gedcomx-js/src/records/Collection.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils();
        var Collection = function(json) {
          if (!(this instanceof Collection)) {
            return new Collection(json);
          }
          if (Collection.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        Collection.prototype = Object.create(GedcomX.ExtensibleData.prototype);
        Collection._gedxClass = Collection.prototype._gedxClass = "GedcomX.Collection";
        Collection.jsonProps = [
          "lang",
          "content",
          "title",
          "size",
          "attribution"
        ];
        Collection.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        Collection.prototype.init = function(json) {
          GedcomX.ExtensibleData.prototype.init.call(this, json);
          if (json) {
            this.setLang(json.lang);
            this.setContent(json.content);
            this.setTitle(json.title);
            this.setSize(json.size);
            this.setAttribution(json.attribution);
          }
          return this;
        };
        Collection.prototype.setLang = function(lang) {
          this.lang = lang;
          return this;
        };
        Collection.prototype.getLang = function() {
          return this.lang;
        };
        Collection.prototype.setContent = function(content) {
          return this._setArray(content, "content", "addContent");
        };
        Collection.prototype.addContent = function(content) {
          return this._arrayPush(content, "content", GedcomX.CollectionContent);
        };
        Collection.prototype.getContent = function() {
          return this.content || [];
        };
        Collection.prototype.setTitle = function(title) {
          this.title = title;
          return this;
        };
        Collection.prototype.getTitle = function() {
          return this.title;
        };
        Collection.prototype.setSize = function(size) {
          this.size = size;
          return this;
        };
        Collection.prototype.getSize = function() {
          return this.size;
        };
        Collection.prototype.setAttribution = function(attribution) {
          if (attribution) {
            this.attribution = GedcomX.Attribution(attribution);
          }
          return this;
        };
        Collection.prototype.getAttribution = function() {
          return this.attribution;
        };
        Collection.prototype.toJSON = function() {
          return this._toJSON(GedcomX.ExtensibleData, Collection.jsonProps);
        };
        GedcomX.Collection = Collection;
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Root.js
  var require_Root2 = __commonJS({
    "node_modules/gedcomx-js/src/records/Root.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Root.jsonProps.push("recordDescriptors", "collections");
        var oldInit = GedcomX.Root.prototype.init;
        GedcomX.Root.prototype.init = function(json) {
          oldInit.call(this, json);
          if (json) {
            this.setRecordDescriptors(json.recordDescriptors);
            this.setCollections(json.collections);
          }
        };
        GedcomX.Root.prototype.setRecordDescriptors = function(recordDescriptors) {
          return this._setArray(recordDescriptors, "recordDescriptors", "addRecordDescriptor");
        };
        GedcomX.Root.prototype.addRecordDescriptor = function(recordDescriptor) {
          return this._arrayPush(recordDescriptor, "recordDescriptors", GedcomX.RecordDescriptor);
        };
        GedcomX.Root.prototype.getRecordDescriptors = function() {
          return this.recordDescriptors || [];
        };
        GedcomX.Root.prototype.setCollections = function(collections) {
          return this._setArray(collections, "collections", "addCollection");
        };
        GedcomX.Root.prototype.addCollection = function(collection) {
          return this._arrayPush(collection, "collections", GedcomX.Collection);
        };
        GedcomX.Root.prototype.getCollections = function() {
          return this.collections || [];
        };
        GedcomX.Root.prototype.getPrincipalPerson = function() {
          return this.getPersons().find(function(p) {
            return p.getPrincipal();
          });
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/ExtensibleData.js
  var require_ExtensibleData3 = __commonJS({
    "node_modules/gedcomx-js/src/records/ExtensibleData.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.ExtensibleData.jsonProps.push("fields");
        var oldExtensibleDataInit = GedcomX.ExtensibleData.prototype.init;
        GedcomX.ExtensibleData.prototype.init = function(json) {
          oldExtensibleDataInit.call(this, json);
          if (json) {
            this.setFields(json.fields);
          }
        };
        GedcomX.ExtensibleData.prototype.setFields = function(fields) {
          return this._setArray(fields, "fields", "addField");
        };
        GedcomX.ExtensibleData.prototype.addField = function(field) {
          return this._arrayPush(field, "fields", GedcomX.Field);
        };
        GedcomX.ExtensibleData.prototype.getFields = function() {
          return this.fields || [];
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Fact.js
  var require_Fact2 = __commonJS({
    "node_modules/gedcomx-js/src/records/Fact.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Fact.jsonProps.push("primary");
        var oldFactInit = GedcomX.Fact.prototype.init;
        GedcomX.Fact.prototype.init = function(json) {
          oldFactInit.call(this, json);
          if (json) {
            this.setPrimary(json.primary);
          }
        };
        GedcomX.Fact.prototype.setPrimary = function(primary) {
          this.primary = primary;
          return this;
        };
        GedcomX.Fact.prototype.getPrimary = function() {
          return this.primary;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Person.js
  var require_Person3 = __commonJS({
    "node_modules/gedcomx-js/src/records/Person.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Person.jsonProps.push("principal");
        var oldPersonInit = GedcomX.Person.prototype.init;
        GedcomX.Person.prototype.init = function(json) {
          oldPersonInit.call(this, json);
          if (json) {
            this.setPrincipal(json.principal);
          }
        };
        GedcomX.Person.prototype.setPrincipal = function(principal) {
          this.principal = principal;
          return this;
        };
        GedcomX.Person.prototype.getPrincipal = function() {
          return this.principal;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/SourceDescription.js
  var require_SourceDescription3 = __commonJS({
    "node_modules/gedcomx-js/src/records/SourceDescription.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.SourceDescription.jsonProps.push("titleLabel", "sortKey", "descriptorRef");
        var oldSourceDescriptionInit = GedcomX.SourceDescription.prototype.init;
        GedcomX.SourceDescription.prototype.init = function(json) {
          oldSourceDescriptionInit.call(this, json);
          if (json) {
            this.setTitleLabel(json.titleLabel);
            this.setSortKey(json.sortKey);
            this.setDescriptorRef(json.descriptorRef);
          }
        };
        GedcomX.SourceDescription.prototype.setTitleLabel = function(titleLabel) {
          this.titleLabel = titleLabel;
          return this;
        };
        GedcomX.SourceDescription.prototype.getTitleLabel = function() {
          return this.titleLabel;
        };
        GedcomX.SourceDescription.prototype.setSortKey = function(sortKey) {
          this.sortKey = sortKey;
          return this;
        };
        GedcomX.SourceDescription.prototype.getSortKey = function() {
          return this.sortKey;
        };
        GedcomX.SourceDescription.prototype.setDescriptorRef = function(descriptorRef) {
          this.descriptorRef = descriptorRef;
          return this;
        };
        GedcomX.SourceDescription.prototype.getDescriptorRef = function() {
          return this.descriptorRef;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/SourceReference.js
  var require_SourceReference2 = __commonJS({
    "node_modules/gedcomx-js/src/records/SourceReference.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.SourceReference.jsonProps.push("qualifiers");
        var oldSourceReferenceInit = GedcomX.SourceReference.prototype.init;
        GedcomX.SourceReference.prototype.init = function(json) {
          oldSourceReferenceInit.call(this, json);
          if (json) {
            this.setQualifiers(json.qualifiers);
          }
        };
        GedcomX.SourceReference.prototype.setQualifiers = function(qualifiers) {
          return this._setArray(qualifiers, "qualifiers", "addQualifier");
        };
        GedcomX.SourceReference.prototype.addQualifier = function(qualifier) {
          return this._arrayPush(qualifier, "qualifiers", GedcomX.Qualifier);
        };
        GedcomX.SourceReference.prototype.getQualifiers = function() {
          return this.qualifiers || [];
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/Coverage.js
  var require_Coverage2 = __commonJS({
    "node_modules/gedcomx-js/src/records/Coverage.js"(exports, module) {
      module.exports = function(GedcomX) {
        GedcomX.Coverage.jsonProps.push("recordType");
        var oldCoverageInit = GedcomX.Coverage.prototype.init;
        GedcomX.Coverage.prototype.init = function(json) {
          oldCoverageInit.call(this, json);
          if (json) {
            this.setRecordType(json.recordType);
          }
        };
        GedcomX.Coverage.prototype.setRecordType = function(recordType) {
          this.recordType = recordType;
          return this;
        };
        GedcomX.Coverage.prototype.getRecordType = function() {
          return this.recordType;
        };
      };
    }
  });

  // node_modules/gedcomx-js/src/records/index.js
  var require_records = __commonJS({
    "node_modules/gedcomx-js/src/records/index.js"(exports, module) {
      module.exports = function(GedcomX) {
        require_FieldValueDescriptor()(GedcomX);
        require_FieldDescriptor()(GedcomX);
        require_RecordDescriptor()(GedcomX);
        require_FieldValue()(GedcomX);
        require_Field()(GedcomX);
        require_CollectionContent()(GedcomX);
        require_Collection()(GedcomX);
        require_Root2()(GedcomX);
        require_ExtensibleData3()(GedcomX);
        require_Fact2()(GedcomX);
        require_Person3()(GedcomX);
        require_SourceDescription3()(GedcomX);
        require_SourceReference2()(GedcomX);
        require_Coverage2()(GedcomX);
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomCommon.js
  var require_AtomCommon = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomCommon.js"(exports, module) {
      var utils = require_utils();
      var Base = require_Base();
      var AtomCommon = function(json) {
        if (!(this instanceof AtomCommon)) {
          return new AtomCommon(json);
        }
        if (AtomCommon.isInstance(json)) {
          return json;
        }
        this.init(json);
      };
      AtomCommon.prototype = Object.create(Base.prototype);
      AtomCommon._gedxClass = AtomCommon.prototype._gedxClass = "GedcomX.AtomCommon";
      AtomCommon.jsonProps = [
        "base",
        "lang"
      ];
      AtomCommon.isInstance = function(obj) {
        return utils.isInstance(obj, this._gedxClass);
      };
      AtomCommon.prototype.init = function(json) {
        Base.prototype.init.call(this, json);
        if (json) {
          this.setBase(json.base);
          this.setLang(json.lang);
        }
        return this;
      };
      AtomCommon.prototype.setBase = function(base) {
        this.base = base;
        return this;
      };
      AtomCommon.prototype.getBase = function(base) {
        return this.base;
      };
      AtomCommon.prototype.setLang = function(lang) {
        this.lang = lang;
        return this;
      };
      AtomCommon.prototype.getLang = function(lang) {
        return this.lang;
      };
      AtomCommon.prototype.toJSON = function() {
        return this._toJSON(Base, AtomCommon.jsonProps);
      };
      module.exports = AtomCommon;
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomCategory.js
  var require_AtomCategory = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomCategory.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomCategory = function(json) {
          if (!(this instanceof AtomCategory)) {
            return new AtomCategory(json);
          }
          if (AtomCategory.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomCategory.prototype = Object.create(AtomCommon.prototype);
        AtomCategory._gedxClass = AtomCategory.prototype._gedxClass = "GedcomX.AtomCategory";
        AtomCategory.jsonProps = [
          "scheme",
          "term",
          "label"
        ];
        AtomCategory.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomCategory.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setScheme(json.scheme);
            this.setTerm(json.term);
            this.setLabel(json.label);
          }
          return this;
        };
        AtomCategory.prototype.setScheme = function(scheme) {
          this.scheme = scheme;
          return this;
        };
        AtomCategory.prototype.getScheme = function() {
          return this.scheme;
        };
        AtomCategory.prototype.setTerm = function(term) {
          this.term = term;
          return this;
        };
        AtomCategory.prototype.getTerm = function() {
          return this.term;
        };
        AtomCategory.prototype.setLabel = function(label) {
          this.label = label;
          return this;
        };
        AtomCategory.prototype.getLabel = function() {
          return this.label;
        };
        AtomCategory.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomCategory.jsonProps);
        };
        GedcomX.AtomCategory = AtomCategory;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomContent.js
  var require_AtomContent = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomContent.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomContent = function(json) {
          if (!(this instanceof AtomContent)) {
            return new AtomContent(json);
          }
          if (AtomContent.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomContent.prototype = Object.create(AtomCommon.prototype);
        AtomContent._gedxClass = AtomContent.prototype._gedxClass = "GedcomX.AtomContent";
        AtomContent.jsonProps = [
          "gedcomx"
        ];
        AtomContent.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomContent.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setGedcomX(json.gedcomx);
          }
          return this;
        };
        AtomContent.prototype.setGedcomX = function(gedcomx) {
          if (gedcomx) {
            this.gedcomx = GedcomX(gedcomx);
          }
          return this;
        };
        AtomContent.prototype.getGedcomX = function() {
          return this.gedcomx;
        };
        AtomContent.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomContent.jsonProps);
        };
        GedcomX.AtomContent = AtomContent;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomFeed.js
  var require_AtomFeed = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomFeed.js"(exports, module) {
      module.exports = function(GedcomX) {
        var AtomCommon = require_AtomCommon();
        var AtomFeed = function(json) {
          if (!(this instanceof AtomFeed)) {
            return new AtomFeed(json);
          }
          if (AtomFeed.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomFeed.prototype = Object.create(AtomCommon.prototype);
        AtomFeed._gedxClass = AtomFeed.prototype._gedxClass = "GedcomX.AtomFeed";
        AtomFeed.jsonProps = [
          "authors",
          "contributors",
          "categories",
          "generator",
          "icon",
          "id",
          "results",
          "index",
          "links",
          "logo",
          "rights",
          "subtitle",
          "title",
          "updated",
          "entries",
          "facets",
          "searchInfo"
        ];
        AtomFeed.isInstance = function(obj) {
          return GedcomX.utils.isInstance(obj, this._gedxClass);
        };
        AtomFeed.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setAuthors(json.authors);
            this.setContributors(json.contributors);
            this.setCategories(json.categories);
            this.setGenerator(json.generator);
            this.setIcon(json.icon);
            this.setId(json.id);
            this.setResults(json.results);
            this.setIndex(json.index);
            this.setLinks(json.links);
            this.setLogo(json.logo);
            this.setRights(json.rights);
            this.setSubtitle(json.subtitle);
            this.setTitle(json.title);
            this.setUpdated(json.updated);
            this.setEntries(json.entries);
            this.setFacets(json.facets);
            this.setSearchInfo(json.searchInfo);
          }
          return this;
        };
        AtomFeed.prototype.getAuthors = function() {
          return this.authors || [];
        };
        AtomFeed.prototype.setAuthors = function(authors) {
          return this._setArray(authors, "authors", "addAuthor");
        };
        AtomFeed.prototype.addAuthor = function(author) {
          return this._arrayPush(author, "authors", GedcomX.AtomPerson);
        };
        AtomFeed.prototype.getContributors = function() {
          return this.contributors || [];
        };
        AtomFeed.prototype.setContributors = function(contributors) {
          return this._setArray(contributors, "contributors", "addContributor");
        };
        AtomFeed.prototype.addContributor = function(contributor) {
          return this._arrayPush(contributor, "contributors", GedcomX.AtomPerson);
        };
        AtomFeed.prototype.getCategories = function() {
          return this.categories || [];
        };
        AtomFeed.prototype.setCategories = function(categories) {
          return this._setArray(categories, "categories", "addCategorie");
        };
        AtomFeed.prototype.addCategorie = function(categorie) {
          return this._arrayPush(categorie, "categories", GedcomX.AtomCategory);
        };
        AtomFeed.prototype.getGenerator = function() {
          return this.generator;
        };
        AtomFeed.prototype.setGenerator = function(generator) {
          if (generator) {
            this.generator = GedcomX.AtomGenerator(generator);
          }
          return this;
        };
        AtomFeed.prototype.getIcon = function() {
          return this.icon;
        };
        AtomFeed.prototype.setIcon = function(icon) {
          this.icon = icon;
          return this;
        };
        AtomFeed.prototype.getId = function() {
          return this.id;
        };
        AtomFeed.prototype.setId = function(id) {
          this.id = id;
          return this;
        };
        AtomFeed.prototype.getResults = function() {
          return this.results;
        };
        AtomFeed.prototype.setResults = function(results) {
          this.results = results;
          return this;
        };
        AtomFeed.prototype.getIndex = function() {
          return this.index;
        };
        AtomFeed.prototype.setIndex = function(index) {
          this.index = index;
          return this;
        };
        AtomFeed.prototype.setLinks = function(links) {
          if (links) {
            this.links = GedcomX.Links(links);
          }
          return this;
        };
        AtomFeed.prototype.addLink = function(link) {
          if (link) {
            if (!this.links) {
              this.links = GedcomX.Links();
            }
            this.links.addLink(link);
          }
          return this;
        };
        AtomFeed.prototype.getLinks = function() {
          return this.links ? this.links.getLinks() : [];
        };
        AtomFeed.prototype.getLink = function(rel) {
          if (this.links) {
            return this.links.getLink(rel);
          }
        };
        AtomFeed.prototype.getLogo = function() {
          return this.logo;
        };
        AtomFeed.prototype.setLogo = function(logo) {
          this.logo = logo;
          return this;
        };
        AtomFeed.prototype.getRights = function() {
          return this.rights;
        };
        AtomFeed.prototype.setRights = function(rights) {
          this.rights = rights;
          return this;
        };
        AtomFeed.prototype.getSubtitle = function() {
          return this.subtitle;
        };
        AtomFeed.prototype.setSubtitle = function(subtitle) {
          this.subtitle = subtitle;
          return this;
        };
        AtomFeed.prototype.getTitle = function() {
          return this.title;
        };
        AtomFeed.prototype.setTitle = function(title) {
          this.title = title;
          return this;
        };
        AtomFeed.prototype.getUpdated = function() {
          return this.updated;
        };
        AtomFeed.prototype.setUpdated = function(updated) {
          if (updated) {
            this.updated = new Date(updated);
          }
          return this;
        };
        AtomFeed.prototype.getEntries = function() {
          return this.entries || [];
        };
        AtomFeed.prototype.setEntries = function(entries) {
          return this._setArray(entries, "entries", "addEntry");
        };
        AtomFeed.prototype.addEntry = function(entry) {
          return this._arrayPush(entry, "entries", GedcomX.AtomEntry);
        };
        AtomFeed.prototype.getFacets = function() {
          return this.facets || [];
        };
        AtomFeed.prototype.setFacets = function(facets) {
          return this._setArray(facets, "facets", "addFacet");
        };
        AtomFeed.prototype.addFacet = function(facet) {
          return this._arrayPush(facet, "facets", GedcomX.Field);
        };
        AtomFeed.prototype.getSearchInfo = function() {
          return this.searchInfo || [];
        };
        AtomFeed.prototype.setSearchInfo = function(searchInfo) {
          return this._setArray(searchInfo, "searchInfo", "addSearchInfo");
        };
        AtomFeed.prototype.addSearchInfo = function(searchInfo) {
          return this._arrayPush(searchInfo, "searchInfo", GedcomX.SearchInfo);
        };
        AtomFeed.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomFeed.jsonProps);
        };
        GedcomX.AtomFeed = AtomFeed;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomGenerator.js
  var require_AtomGenerator = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomGenerator.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomGenerator = function(json) {
          if (!(this instanceof AtomGenerator)) {
            return new AtomGenerator(json);
          }
          if (AtomGenerator.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomGenerator.prototype = Object.create(AtomCommon.prototype);
        AtomGenerator._gedxClass = AtomGenerator.prototype._gedxClass = "GedcomX.AtomGenerator";
        AtomGenerator.jsonProps = [
          "uri",
          "version",
          "value"
        ];
        AtomGenerator.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomGenerator.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setUri(json.uri);
            this.setVersion(json.version);
            this.setValue(json.value);
          }
          return this;
        };
        AtomGenerator.prototype.setUri = function(uri) {
          this.uri = uri;
          return this;
        };
        AtomGenerator.prototype.getUri = function() {
          return this.uri;
        };
        AtomGenerator.prototype.setVersion = function(version) {
          this.version = version;
          return this;
        };
        AtomGenerator.prototype.getVersion = function() {
          return this.version;
        };
        AtomGenerator.prototype.setValue = function(value) {
          this.value = value;
          return this;
        };
        AtomGenerator.prototype.getValue = function() {
          return this.value;
        };
        AtomGenerator.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomGenerator.jsonProps);
        };
        GedcomX.AtomGenerator = AtomGenerator;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomPerson.js
  var require_AtomPerson = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomPerson.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomPerson = function(json) {
          if (!(this instanceof AtomPerson)) {
            return new AtomPerson(json);
          }
          if (AtomPerson.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomPerson.prototype = Object.create(AtomCommon.prototype);
        AtomPerson._gedxClass = AtomPerson.prototype._gedxClass = "GedcomX.AtomPerson";
        AtomPerson.jsonProps = [
          "uri",
          "name",
          "email"
        ];
        AtomPerson.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomPerson.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setUri(json.uri);
            this.setName(json.name);
            this.setEmail(json.email);
          }
          return this;
        };
        AtomPerson.prototype.setUri = function(uri) {
          this.uri = uri;
          return this;
        };
        AtomPerson.prototype.getUri = function() {
          return this.uri;
        };
        AtomPerson.prototype.setName = function(name) {
          this.name = name;
          return this;
        };
        AtomPerson.prototype.getName = function() {
          return this.name;
        };
        AtomPerson.prototype.setEmail = function(email) {
          this.email = email;
          return this;
        };
        AtomPerson.prototype.getEmail = function() {
          return this.email;
        };
        AtomPerson.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomPerson.jsonProps);
        };
        GedcomX.AtomPerson = AtomPerson;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomSource.js
  var require_AtomSource = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomSource.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomSource = function(json) {
          if (!(this instanceof AtomSource)) {
            return new AtomSource(json);
          }
          if (AtomSource.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomSource.prototype = Object.create(AtomCommon.prototype);
        AtomSource._gedxClass = AtomSource.prototype._gedxClass = "GedcomX.AtomSource";
        AtomSource.jsonProps = [
          "authors",
          "contributors",
          "categories",
          "generator",
          "icon",
          "id",
          "links",
          "logo",
          "rights",
          "subtitle",
          "title",
          "updated"
        ];
        AtomSource.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomSource.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setAuthors(json.authors);
            this.setContributors(json.contributors);
            this.setCategories(json.categories);
            this.setGenerator(json.generator);
            this.setIcon(json.icon);
            this.setId(json.id);
            this.setLinks(json.links);
            this.setLogo(json.logo);
            this.setRights(json.rights);
            this.setSubtitle(json.subtitle);
            this.setTitle(json.title);
            this.setUpdated(json.updated);
          }
          return this;
        };
        AtomSource.prototype.setAuthors = function(authors) {
          return this._setArray(authors, "authors", "addAuthor");
        };
        AtomSource.prototype.addAuthor = function(author) {
          return this._arrayPush(author, "authors", GedcomX.AtomPerson);
        };
        AtomSource.prototype.getAuthors = function() {
          return this.authors || [];
        };
        AtomSource.prototype.setContributors = function(contributors) {
          return this._setArray(contributors, "contributors", "addContributor");
        };
        AtomSource.prototype.addContributor = function(contributor) {
          return this._arrayPush(contributor, "contributors", GedcomX.AtomPerson);
        };
        AtomSource.prototype.getContributors = function() {
          return this.contributors || [];
        };
        AtomSource.prototype.setCategories = function(categories) {
          return this._setArray(categories, "categories", "addCategory");
        };
        AtomSource.prototype.addCategory = function(category) {
          return this._arrayPush(category, "categories", GedcomX.AtomCategory);
        };
        AtomSource.prototype.getCategories = function() {
          return this.categories || [];
        };
        AtomSource.prototype.setGenerator = function(generator) {
          if (generator) {
            this.generator = GedcomX.AtomGenerator(generator);
          }
          return this;
        };
        AtomSource.prototype.getGenerator = function() {
          return this.generator;
        };
        AtomSource.prototype.setIcon = function(icon) {
          this.icon = icon;
          return this;
        };
        AtomSource.prototype.getIcon = function() {
          return this.icon;
        };
        AtomSource.prototype.setId = function(id) {
          this.id = id;
          return this;
        };
        AtomSource.prototype.getId = function() {
          return this.id;
        };
        AtomSource.prototype.setLinks = function(links) {
          if (links) {
            this.links = GedcomX.Links(links);
          }
          return this;
        };
        AtomSource.prototype.addLink = function(link) {
          if (link) {
            if (!this.links) {
              this.links = GedcomX.Links();
            }
            this.links.addLink(link);
          }
          return this;
        };
        AtomSource.prototype.getLinks = function() {
          return this.links ? this.links.getLinks() : [];
        };
        AtomSource.prototype.getLink = function(rel) {
          if (this.links) {
            return this.links.getLink(rel);
          }
        };
        AtomSource.prototype.setLogo = function(logo) {
          this.logo = logo;
          return this;
        };
        AtomSource.prototype.getLogo = function() {
          return this.logo;
        };
        AtomSource.prototype.setRights = function(rights) {
          this.rights = rights;
          return this;
        };
        AtomSource.prototype.getRights = function() {
          return this.rights;
        };
        AtomSource.prototype.setSubtitle = function(subtitle) {
          this.subtitle = subtitle;
          return this;
        };
        AtomSource.prototype.getSubtitle = function() {
          return this.subtitle;
        };
        AtomSource.prototype.setTitle = function(title) {
          this.title = title;
          return this;
        };
        AtomSource.prototype.getTitle = function() {
          return this.title;
        };
        AtomSource.prototype.getUpdated = function() {
          return this.updated;
        };
        AtomSource.prototype.setUpdated = function(date) {
          if (date) {
            this.updated = new Date(date);
          }
          return this;
        };
        AtomSource.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomSource.jsonProps);
        };
        GedcomX.AtomSource = AtomSource;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/AtomEntry.js
  var require_AtomEntry = __commonJS({
    "node_modules/gedcomx-js/src/atom/AtomEntry.js"(exports, module) {
      module.exports = function(GedcomX) {
        var utils = require_utils(), AtomCommon = require_AtomCommon();
        var AtomEntry = function(json) {
          if (!(this instanceof AtomEntry)) {
            return new AtomEntry(json);
          }
          if (AtomEntry.isInstance(json)) {
            return json;
          }
          this.init(json);
        };
        AtomEntry.prototype = Object.create(AtomCommon.prototype);
        AtomEntry._gedxClass = AtomEntry.prototype._gedxClass = "GedcomX.AtomEntry";
        AtomEntry.jsonProps = [
          "authors",
          "contributors",
          "categories",
          "generator",
          "icon",
          "id",
          "links",
          "logo",
          "rights",
          "subtitle",
          "title",
          "updated",
          "content",
          "confidence",
          "published",
          "source",
          "summary",
          "score"
        ];
        AtomEntry.isInstance = function(obj) {
          return utils.isInstance(obj, this._gedxClass);
        };
        AtomEntry.prototype.init = function(json) {
          AtomCommon.prototype.init.call(this, json);
          if (json) {
            this.setAuthors(json.authors);
            this.setContributors(json.contributors);
            this.setCategories(json.categories);
            this.setGenerator(json.generator);
            this.setIcon(json.icon);
            this.setId(json.id);
            this.setLinks(json.links);
            this.setLogo(json.logo);
            this.setRights(json.rights);
            this.setSubtitle(json.subtitle);
            this.setTitle(json.title);
            this.setUpdated(json.updated);
            this.setContent(json.content);
            this.setConfidence(json.confidence);
            this.setPublished(json.published);
            this.setSource(json.source);
            this.setSummary(json.summary);
            this.setScore(json.score);
          }
          return this;
        };
        AtomEntry.prototype.setAuthors = function(authors) {
          return this._setArray(authors, "authors", "addAuthor");
        };
        AtomEntry.prototype.addAuthor = function(author) {
          return this._arrayPush(author, "authors", GedcomX.AtomPerson);
        };
        AtomEntry.prototype.getAuthors = function() {
          return this.authors || [];
        };
        AtomEntry.prototype.setContributors = function(contributors) {
          return this._setArray(contributors, "contributors", "addContributor");
        };
        AtomEntry.prototype.addContributor = function(contributor) {
          return this._arrayPush(contributor, "contributors", GedcomX.AtomPerson);
        };
        AtomEntry.prototype.getContributors = function() {
          return this.contributors || [];
        };
        AtomEntry.prototype.setCategories = function(categories) {
          return this._setArray(categories, "categories", "addCategory");
        };
        AtomEntry.prototype.addCategory = function(category) {
          return this._arrayPush(category, "categories", GedcomX.AtomCategory);
        };
        AtomEntry.prototype.getCategories = function() {
          return this.categories || [];
        };
        AtomEntry.prototype.setGenerator = function(generator) {
          if (generator) {
            this.generator = GedcomX.AtomGenerator(generator);
          }
          return this;
        };
        AtomEntry.prototype.getGenerator = function() {
          return this.generator;
        };
        AtomEntry.prototype.setIcon = function(icon) {
          this.icon = icon;
          return this;
        };
        AtomEntry.prototype.getIcon = function() {
          return this.icon;
        };
        AtomEntry.prototype.setId = function(id) {
          this.id = id;
          return this;
        };
        AtomEntry.prototype.getId = function() {
          return this.id;
        };
        AtomEntry.prototype.setLinks = function(links) {
          if (links) {
            this.links = GedcomX.Links(links);
          }
          return this;
        };
        AtomEntry.prototype.addLink = function(link) {
          if (link) {
            if (!this.links) {
              this.links = GedcomX.Links();
            }
            this.links.addLink(link);
          }
          return this;
        };
        AtomEntry.prototype.getLinks = function() {
          return this.links ? this.links.getLinks() : [];
        };
        AtomEntry.prototype.getLink = function(rel) {
          if (this.links) {
            return this.links.getLink(rel);
          }
        };
        AtomEntry.prototype.setLogo = function(logo) {
          this.logo = logo;
          return this;
        };
        AtomEntry.prototype.getLogo = function() {
          return this.logo;
        };
        AtomEntry.prototype.setRights = function(rights) {
          this.rights = rights;
          return this;
        };
        AtomEntry.prototype.getRights = function() {
          return this.rights;
        };
        AtomEntry.prototype.setSubtitle = function(subtitle) {
          this.subtitle = subtitle;
          return this;
        };
        AtomEntry.prototype.getSubtitle = function() {
          return this.subtitle;
        };
        AtomEntry.prototype.setTitle = function(title) {
          this.title = title;
          return this;
        };
        AtomEntry.prototype.getTitle = function() {
          return this.title;
        };
        AtomEntry.prototype.getUpdated = function() {
          return this.updated;
        };
        AtomEntry.prototype.setUpdated = function(date) {
          if (date) {
            this.updated = new Date(date);
          }
          return this;
        };
        AtomEntry.prototype.setContent = function(content) {
          if (content) {
            this.content = GedcomX.AtomContent(content);
          }
          return this;
        };
        AtomEntry.prototype.getContent = function() {
          return this.content;
        };
        AtomEntry.prototype.setConfidence = function(confidence) {
          this.confidence = confidence;
          return this;
        };
        AtomEntry.prototype.getConfidence = function() {
          return this.confidence;
        };
        AtomEntry.prototype.getPublished = function() {
          return this.published;
        };
        AtomEntry.prototype.setPublished = function(date) {
          if (date) {
            this.published = new Date(date);
          }
          return this;
        };
        AtomEntry.prototype.setSource = function(source) {
          if (source) {
            this.source = GedcomX.AtomSource(source);
          }
          return this;
        };
        AtomEntry.prototype.getSource = function() {
          return this.source;
        };
        AtomEntry.prototype.setSummary = function(summary) {
          this.summary = summary;
          return this;
        };
        AtomEntry.prototype.getSummary = function() {
          return this.summary;
        };
        AtomEntry.prototype.setScore = function(score) {
          this.score = score;
          return this;
        };
        AtomEntry.prototype.getScore = function() {
          return this.score;
        };
        AtomEntry.prototype.toJSON = function() {
          return this._toJSON(AtomCommon, AtomEntry.jsonProps);
        };
        GedcomX.AtomEntry = AtomEntry;
      };
    }
  });

  // node_modules/gedcomx-js/src/atom/index.js
  var require_atom = __commonJS({
    "node_modules/gedcomx-js/src/atom/index.js"(exports, module) {
      module.exports = function(GedcomX) {
        require_AtomCategory()(GedcomX);
        require_AtomContent()(GedcomX);
        require_AtomFeed()(GedcomX);
        require_AtomGenerator()(GedcomX);
        require_AtomPerson()(GedcomX);
        require_AtomSource()(GedcomX);
        require_AtomEntry()(GedcomX);
      };
    }
  });

  // node_modules/gedcomx-js/src/index.js
  var require_src = __commonJS({
    "node_modules/gedcomx-js/src/index.js"(exports, module) {
      var GedcomX = function(json) {
        return new GedcomX.Root(json);
      };
      module.exports = GedcomX;
      GedcomX.utils = require_utils();
      GedcomX.Base = require_Base();
      GedcomX.ExtensibleData = require_ExtensibleData();
      GedcomX.Conclusion = require_Conclusion();
      GedcomX.Subject = require_Subject();
      GedcomX.ResourceReference = require_ResourceReference();
      GedcomX.Address = require_Address();
      GedcomX.Agent = require_Agent();
      GedcomX.Attribution = require_Attribution();
      GedcomX.Coverage = require_Coverage();
      GedcomX.Date = require_Date();
      GedcomX.Document = require_Document();
      GedcomX.Event = require_Event();
      GedcomX.EventRole = require_EventRole();
      GedcomX.EvidenceReference = require_EvidenceReference();
      GedcomX.Fact = require_Fact();
      GedcomX.Gender = require_Gender();
      GedcomX.Identifiers = require_Identifiers();
      GedcomX.Name = require_Name();
      GedcomX.NameForm = require_NameForm();
      GedcomX.NamePart = require_NamePart();
      GedcomX.Note = require_Note();
      GedcomX.OnlineAccount = require_OnlineAccount();
      GedcomX.Person = require_Person();
      GedcomX.PlaceDescription = require_PlaceDescription();
      GedcomX.PlaceReference = require_PlaceReference();
      GedcomX.Qualifier = require_Qualifier();
      GedcomX.Relationship = require_Relationship();
      GedcomX.Root = require_Root();
      GedcomX.SourceCitation = require_SourceCitation();
      GedcomX.SourceDescription = require_SourceDescription();
      GedcomX.SourceReference = require_SourceReference();
      GedcomX.TextValue = require_TextValue();
      GedcomX.addExtensions = function(extensions) {
        if (typeof extensions === "function") {
          extensions(this);
        }
      };
      GedcomX.enableRsExtensions = function() {
        this.addExtensions(require_rs());
      };
      GedcomX.enableRecordsExtensions = function() {
        this.addExtensions(require_records());
      };
      GedcomX.enableAtomExtensions = function() {
        this.enableRsExtensions();
        this.enableRecordsExtensions();
        this.addExtensions(require_atom());
      };
    }
  });

  // src/utils.js
  var require_utils2 = __commonJS({
    "src/utils.js"(exports, module) {
      var debug = require_browser()("genscrape:utils");
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var utils = {};
      utils.getDateString = function() {
        var date = /* @__PURE__ */ new Date();
        return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
      };
      utils.splitName = function(name) {
        if (typeof name === "string" && name) {
          return name.split(/\s+(?=\S*$)/);
        } else {
          return ["", ""];
        }
      };
      utils.urlPatternToRegex = function(pattern) {
        pattern = pattern.replace(/\//g, "/");
        pattern = pattern.replace(/\./g, ".");
        pattern = pattern.replace(/\-/g, "-");
        pattern = pattern.replace(/\*/g, ".*");
        return new RegExp(pattern);
      };
      utils.getHashParts = function() {
        var hashParts = {};
        if (window.location.hash) {
          window.location.hash.substring(1).split("&").forEach(function(part) {
            var partPieces = part.split("=");
            hashParts[partPieces[0]] = partPieces[1];
          });
        }
        return hashParts;
      };
      utils.getQueryParams = function(url) {
        var query = url ? url.split("?")[1] : window.location.search.substr(1);
        var paramArray = query.split("&");
        var params = {};
        for (var i = 0; i < paramArray.length; i++) {
          if (paramArray[i]) {
            var tempArray = paramArray[i].split("=");
            params[tempArray[0]] = tempArray[1];
          }
        }
        return params;
      };
      utils.maybe = function(value) {
        return value != null ? value : {};
      };
      utils.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
      utils.find = function(list, matcher) {
        for (var i = 0; i < list.length; i++) {
          if (matcher(list[i])) {
            return list[i];
          }
        }
      };
      utils.getDomain = function() {
        return "." + document.location.host.split(".").slice(2).join(".");
      };
      utils.getJSON = function(url, headers, callback) {
        if (typeof headers === "function" && typeof callback === "undefined") {
          callback = headers;
          headers = [];
        }
        debug("getJSON: " + url);
        var request = new window.XMLHttpRequest();
        request.open("GET", url);
        for (var header in headers) {
          request.setRequestHeader(header, headers[header]);
        }
        if (headers["Accept"] === void 0) {
          request.setRequestHeader("Accept", "application/json");
        }
        request.onload = function() {
          debug("getJSON:onload");
          if (request.status >= 200 && request.status < 400) {
            debug("getJSON:success");
            try {
              callback(void 0, JSON.parse(request.responseText));
            } catch (e) {
              callback(e);
            }
          } else {
            debug("getJSON:http error");
            callback(new Error(request.statusText));
          }
        };
        request.onerror = function(e) {
          debug("getJSON:onerror");
          callback(new Error("Network error"));
        };
        request.send();
      };
      utils.getHTML = function(url, headers, callback) {
        if (typeof headers === "function" && typeof callback === "undefined") {
          callback = headers;
          headers = [];
        }
        debug("getHTML: " + url);
        var request = new window.XMLHttpRequest();
        request.open("GET", url);
        for (var header in headers) {
          request.setRequestHeader(header, headers[header]);
        }
        if (headers["Accept"] === void 0) {
          request.setRequestHeader("Accept", "text/html");
        }
        request.onload = function() {
          debug("getHTML:onload");
          if (request.status >= 200 && request.status < 400) {
            debug("getHTML:success");
            try {
              callback(void 0, request.responseText);
            } catch (e) {
              callback(e);
            }
          } else {
            debug("getHTML:http error");
            callback(new Error(request.statusText));
          }
        };
        request.onerror = function(e) {
          debug("getHTML:onerror");
          callback(new Error("Network error"));
        };
        request.send();
      };
      module.exports = utils;
    }
  });

  // src/generic/structured.js
  var require_structured = __commonJS({
    "src/generic/structured.js"(exports, module) {
      var debug = require_browser()("genscrape:generic:structured");
      function isPersonType(type) {
        if (!type) return false;
        var types = Array.isArray(type) ? type : [type];
        return types.some(function(t) {
          return /(^|\/)Person$/i.test(String(t));
        });
      }
      function first(v) {
        return Array.isArray(v) ? v[0] : v;
      }
      function asArray(v) {
        if (v === void 0 || v === null || v === "") return [];
        return Array.isArray(v) ? v : [v];
      }
      function text(v) {
        v = first(v);
        if (v === void 0 || v === null) return "";
        if (typeof v === "object") return text(v.name || v["@value"] || v.value || "");
        return String(v).replace(/\s+/g, " ").trim();
      }
      function placeText(v) {
        v = first(v);
        if (!v) return "";
        if (typeof v !== "object") return text(v);
        if (v.name) return text(v.name);
        var addr = first(v.address);
        if (addr && typeof addr === "object") {
          return ["streetAddress", "addressLocality", "addressRegion", "addressCountry"].map(function(k) {
            return text(addr[k]);
          }).filter(Boolean).join(", ");
        }
        return text(addr);
      }
      function collectJsonLd(document2) {
        var nodes = [];
        var scripts = document2.querySelectorAll('script[type="application/ld+json"]');
        Array.prototype.forEach.call(scripts, function(s) {
          try {
            walk(JSON.parse(s.textContent));
          } catch (e) {
            debug("bad json-ld", e.message);
          }
        });
        function walk(node) {
          if (Array.isArray(node)) {
            node.forEach(walk);
            return;
          }
          if (!node || typeof node !== "object") return;
          nodes.push(node);
          Object.keys(node).forEach(function(k) {
            if (k !== "@context") walk(node[k]);
          });
        }
        return nodes;
      }
      function microdataValue(el) {
        var tag = el.tagName.toLowerCase();
        if (el.hasAttribute("content")) return el.getAttribute("content");
        if (tag === "meta") return el.getAttribute("content") || "";
        if (/^(a|link|area)$/.test(tag)) return el.getAttribute("href") || "";
        if (/^(img|audio|video|source|iframe|embed)$/.test(tag)) return el.getAttribute("src") || "";
        if (tag === "time" && el.hasAttribute("datetime")) return el.getAttribute("datetime");
        return (el.textContent || "").replace(/\s+/g, " ").trim();
      }
      function microdataItem(scope) {
        var item = { "@type": scope.getAttribute("itemtype") || "" };
        (function walk(parent) {
          Array.prototype.forEach.call(parent.children, function(child) {
            var props = child.getAttribute("itemprop");
            var isScope = child.hasAttribute("itemscope");
            if (props) {
              var value = isScope ? microdataItem(child) : microdataValue(child);
              props.trim().split(/\s+/).forEach(function(p) {
                item[p] = item[p] === void 0 ? value : asArray(item[p]).concat([value]);
              });
            }
            if (!isScope) walk(child);
          });
        })(scope);
        return item;
      }
      function collectMicrodata(document2) {
        var nodes = [];
        Array.prototype.forEach.call(document2.querySelectorAll("[itemscope]"), function(el) {
          if (isPersonType(el.getAttribute("itemtype"))) {
            var item = microdataItem(el);
            item._topLevel = !el.hasAttribute("itemprop");
            nodes.push(item);
          }
        });
        return nodes;
      }
      function personToRecord(p, byId) {
        function resolve(v) {
          if (v && typeof v === "object" && v["@id"] && byId[v["@id"]]) return byId[v["@id"]];
          return v;
        }
        var rec = {
          name: {
            full: text(p.name),
            given: text(p.givenName),
            surname: text(p.familyName)
          },
          gender: null,
          events: {},
          relatives: []
        };
        var g = text(p.gender).toLowerCase();
        if (/female|woman|^f$/.test(g)) rec.gender = "Female";
        else if (/male|man|^m$/.test(g)) rec.gender = "Male";
        [["Birth", "birth"], ["Death", "death"]].forEach(function(e) {
          var date = text(p[e[1] + "Date"]), place = placeText(p[e[1] + "Place"]);
          if (date || place) rec.events[e[0]] = { date, place };
        });
        var home = placeText(p.homeLocation);
        if (home) rec.events.Residence = { date: "", place: home };
        var job = text(p.jobTitle);
        if (job) rec.events.Occupation = { value: job };
        [["parent", "parent"], ["parent", "parents"], ["spouse", "spouse"], ["child", "children"]].forEach(function(r) {
          asArray(p[r[1]]).forEach(function(rel) {
            rel = resolve(rel);
            var name = typeof rel === "object" ? text(rel.name) || [text(rel.givenName), text(rel.familyName)].join(" ").trim() : text(rel);
            if (name && !/^https?:/.test(name)) {
              rec.relatives.push({ role: r[0], name, gender: rel && typeof rel === "object" ? personToRecord(rel, byId).gender : null });
            }
          });
        });
        return rec;
      }
      function score(p) {
        return Object.keys(p).length + (p._topLevel ? 100 : 0) + (p.mainEntityOfPage ? 50 : 0);
      }
      function extract(document2, url, root) {
        var jsonld = collectJsonLd(document2);
        var byId = {};
        jsonld.forEach(function(n) {
          if (n["@id"]) byId[n["@id"]] = n;
        });
        var mainIds = jsonld.map(function(n) {
          return n.mainEntity && n.mainEntity["@id"];
        }).filter(Boolean);
        var people = jsonld.filter(function(n) {
          return isPersonType(n["@type"]) && (n.name || n.givenName || n.familyName);
        });
        var strategy = "jsonld";
        if (!people.length) {
          people = collectMicrodata(document2);
          strategy = "microdata";
        }
        if (!people.length) return null;
        var principal = people.filter(function(p) {
          return mainIds.indexOf(p["@id"]) !== -1;
        })[0] || people.slice().sort(function(a, b) {
          return score(b) - score(a);
        })[0];
        var record = personToRecord(principal, byId);
        if (!record.name.full && !record.name.given && !record.name.surname) return null;
        return { record, strategy };
      }
      module.exports = { extract };
    }
  });

  // src/generic/dates.js
  var require_dates = __commonJS({
    "src/generic/dates.js"(exports, module) {
      var MONTHS = [
        // en, fr, de, nl, no/da, sv, es (full and common abbreviations)
        ["january", "jan", "janvier", "janv", "januar", "januari", "enero", "ene", "j\xE4nner"],
        ["february", "feb", "febr", "fevrier", "fev", "februar", "februari", "febrero"],
        ["march", "mar", "mars", "marz", "maart", "mrt", "marzo"],
        ["april", "apr", "avril", "avr", "abril", "abr"],
        ["may", "mai", "mei", "maj", "mayo"],
        ["june", "jun", "juin", "juni", "junio"],
        ["july", "jul", "juillet", "juil", "juli", "julio"],
        ["august", "aug", "aout", "augustus", "agosto", "ago"],
        ["september", "sep", "sept", "septembre", "septiembre"],
        ["october", "oct", "octobre", "oktober", "okt", "octubre"],
        ["november", "nov", "novembre", "noviembre"],
        ["december", "dec", "decembre", "dezember", "dez", "desember", "diciembre", "dic"]
      ];
      var monthIndex = {};
      MONTHS.forEach(function(names, i) {
        names.forEach(function(n) {
          monthIndex[n] = i + 1;
        });
      });
      var MONTH_RE = "(?:" + Object.keys(monthIndex).sort(function(a, b) {
        return b.length - a.length;
      }).join("|") + ")\\.?";
      var QUAL_RE = "(?:(?:abt|about|circa|ca|c|bef|before|aft|after|est|estimated|vers|rond|omstreeks|um|ca|between|bet|le|on|den|der|am)\\.?\\s+)?";
      var DAY_RE = "(?:[0-3]?\\d)(?:st|nd|rd|th|er|e|\\.)?";
      var YEAR_RE = "(?:1[0-9]{3}|20[0-9]{2})";
      var DATE_PATTERNS = [
        // 12 January 1850 / 12. Januar 1850 / 12 jan. 1850
        DAY_RE + "\\s+" + MONTH_RE + ",?\\s+" + YEAR_RE,
        // January 12, 1850
        MONTH_RE + "\\s+" + DAY_RE + ",?\\s+" + YEAR_RE,
        // 1850-01-12
        YEAR_RE + "-[01]?\\d-[0-3]?\\d",
        // 12/01/1850, 12.01.1850, 12-01-1850
        "[0-3]?\\d[\\/.\\-][01]?\\d[\\/.\\-]" + YEAR_RE,
        // Quarter style (FreeBMD etc.): Mar 1850 / Q1 1850
        "(?:q[1-4]|" + MONTH_RE + ")\\s+(?:quarter\\s+)?" + YEAR_RE,
        // 1850
        YEAR_RE
      ];
      var DATE_RE = new RegExp("(?:^|[^\\w])(" + QUAL_RE + "(?:" + DATE_PATTERNS.join("|") + "))(?![\\w])", "i");
      function stripAccents(s) {
        return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
      }
      function findDate(text) {
        if (!text) return null;
        var m = DATE_RE.exec(stripAccents(text));
        if (!m) return null;
        var start = m.index + m[0].indexOf(m[1]);
        return { text: text.substr(start, m[1].length).trim(), index: start };
      }
      var PLACE_LEAD = /^[\s,;:\-–—]*(?:(?:in|at|a|à|te|i|en|zu|im|au|aux|bei|near)\s+)?/i;
      function cleanPlace(s) {
        if (!s) return "";
        s = s.replace(PLACE_LEAD, "").replace(/[\s,;:\-–—]+$/, "").trim();
        return /[a-z]/i.test(s) ? s : "";
      }
      function splitDatePlace(text) {
        text = (text || "").replace(/\s+/g, " ").trim();
        var d = findDate(text);
        if (!d) {
          return { date: "", place: cleanPlace(text) };
        }
        var before = text.substr(0, d.index), after = text.substr(d.index + d.text.length);
        return {
          date: d.text,
          place: cleanPlace(after) || cleanPlace(before)
        };
      }
      function parseDateParts(text) {
        text = stripAccents((text || "").toLowerCase());
        var years = text.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || [];
        var month = null, day = null, m;
        var words = text.match(/[a-z]+/g) || [];
        for (var i = 0; i < words.length; i++) {
          if (monthIndex[words[i]] && words[i] !== "c") {
            month = monthIndex[words[i]];
            break;
          }
        }
        if (m = /\b(1[0-9]{3}|20[0-9]{2})-([01]?\d)-([0-3]?\d)\b/.exec(text)) {
          month = +m[2];
          day = +m[3];
        } else if (m = /\b([0-3]?\d)[\/.\-]([01]?\d)[\/.\-](1[0-9]{3}|20[0-9]{2})\b/.exec(text)) {
          day = +m[1];
          month = +m[2];
        } else if ((m = /\b([0-3]?\d)(?:st|nd|rd|th|er|e|\.)?\s+[a-z]/.exec(text)) && month) {
          day = +m[1];
        } else if ((m = /[a-z]\.?\s+([0-3]?\d)(?:st|nd|rd|th)?,?\s+\d{4}/.exec(text)) && month) {
          day = +m[1];
        }
        return { years, month, day };
      }
      module.exports = {
        findDate,
        splitDatePlace,
        parseDateParts,
        stripAccents
      };
    }
  });

  // src/generic/labels.js
  var require_labels = __commonJS({
    "src/generic/labels.js"(exports, module) {
      var stripAccents = require_dates().stripAccents;
      var FIELDS = [
        // Relatives (must come before the plain name/given/surname rules)
        ["groomGiven", /^(groom|bridegroom|bruidegom) (forenames?|first names?|given names?|christian names?|voornaam)$/],
        ["groomSurname", /^(groom|bridegroom|bruidegom) (surname|last name|family name|achternaam)$/],
        ["groom", /^(groom|bridegroom|bruidegom|epoux|brautigam|brudgom)( name)?$/],
        ["brideGiven", /^(bride|bruid) (forenames?|first names?|given names?|christian names?|voornaam)$/],
        ["brideSurname", /^(bride|bruid) (surname|last name|family name|maiden name|achternaam)$/],
        ["bride", /^(bride|bruid|epouse|braut|brud)( name)?$/],
        ["fatherGiven", /^father (forenames?|first names?|given names?|christian names?|voornaam|prenoms?)$/],
        ["fatherSurname", /^father (surname|last name|family name|achternaam)$/],
        ["motherMaiden", /^mother (maiden (name|surname)|nee)$|^maiden name$/],
        ["motherGiven", /^mother (forenames?|first names?|given names?|christian names?|voornaam|prenoms?)$/],
        ["motherSurname", /^mother (surname|last name|family name|achternaam)$/],
        ["father", /^(father|father (full )?name|name of father|vader|pere|vater|far|fader|padre|son of)$/],
        ["mother", /^(mother|mother (full )?name|name of mother|moeder|mere|mutter|mor|moder|madre)$/],
        ["relationToHead", /^(relationship|relation|relation to head|relationship to head|rel to head|family position|position in family|familiestilling|stilling i familien|stellung)$/],
        ["parents", /^(parents?|ouders|eltern|foreldre|foraldrar|forældre|padres|child of|son daughter of)$/],
        ["spouse", /^(spouses?|husband|wife|partner|spouse name|married to|echtgeno(o|te)|partner|epoux|epouse|conjoint|ehemann|ehefrau|ehepartner|ektefelle|aegtefaelle|make|maka|hustru|esposo|esposa|conyuge)$/],
        ["children", /^(children|child|kinderen|kind|enfants?|kinder|barn|hijos)$/],
        // Principal identity
        ["given", /^(given names?|givennames?|first names?|firstname|forenames?|christian names?|voornamen?|prenoms?|vornamen?|fornavn|fornamn|nombres?)$/],
        ["surname", /^(surnames?|last names?|family names?|lastname|familyname|achternaam|nom de famille|nom|nachname|familienname|etternavn|efternamn|apellidos?)$/],
        ["name", /^(full name|fullname|name|naam|navn|namn|nombre|person|person name|nom complet)$/],
        ["gender", /^(sex|gender|geslacht|sexe|geschlecht|kjonn|kon|kjoenn|sexo)$/],
        ["age", /^(age|age at death|age at burial|leeftijd|alder|alter|edad)$/],
        ["occupation", /^(occupation|profession|beroep|metier|beruf|yrke|stilling|ocupacion|trade)$/],
        ["residence", /^(residence|abode|address|woonplaats|domicile|wohnort|bosted|bustad|hometown|home town|place of residence|place of association|lives in|residence place)$/],
        ["maritalStatus", /^(marital status|condition|civil status|burgerlijke staat|etat civil|situation familiale|familienstand|sivilstand|civilstand|estado civil)$/],
        ["religion", /^(religion|godsdienst|religion|konfession|tro)$/],
        // Birth
        ["birthDate", /^(date of birth|birth date|birthdate|year of birth|birth year|born year|born on|dob|geboortedatum|date de naissance|geburtsdatum|fodselsdato|fodselsdag|fecha de nacimiento|fodelsedatum)$/],
        ["birthPlace", /^(place of birth|birth place|birthplace|birth location|born in|where born|birth (county|parish|town|country|state|province|city)|geboorteplaats|lieu de naissance|geburtsort|fodested|fodested|fodselssted|lugar de nacimiento|fodelseort)$/],
        ["birth", /^(born|birth|geboren|geboorte|naissance|ne|nee|fodt|fodd|nacimiento|geburt)$/],
        // Baptism
        ["baptismDate", /^(baptism date|year of baptism|baptism year|date of baptism|christening date|baptised on|doopdatum|date de bapteme|taufdatum|dapsdato|fecha de bautismo)$/],
        ["baptismPlace", /^(baptism place|place of baptism|christening place|doopplaats|lieu de bapteme|taufort|dapssted)$/],
        ["baptism", /^(baptism|baptised|baptized|christening|christened|gedoopt|doop|bapteme|baptise|taufe|getauft|dap|dopt|dopte|daab|bautismo)$/],
        // Death
        ["deathDate", /^(date of death|death date|deathdate|year of death|death year|died on|overlijdensdatum|date de deces|sterbedatum|todesdatum|dodsdato|dodsdag|fecha de defuncion|dodsdatum)$/],
        ["deathPlace", /^(place of death|death place|deathplace|death location|died in|overlijdensplaats|lieu de deces|sterbeort|dodssted|dodsort|lugar de defuncion)$/],
        ["death", /^(died|death|deceased|overleden|overlijden|deces|decede|decedee|gestorben|tod|dod|dode|dodd|fallecimiento|defuncion)$/],
        ["deathCause", /^(cause of death|doodsoorzaak|cause du deces|todesursache|dodsarsak)$/],
        // Burial
        ["burialDate", /^(burial date|burialdate|year of burial|burial year|date of burial|buried on|interment date|begraafdatum|date d inhumation|begrabnisdatum|begravelsesdato)$/],
        ["cemetery", /^(cemetery|cemetery name|burial place|place of burial|grave|cemetery or memorial|memorial|begraafplaats|cimetiere|friedhof|kirkegard|kyrkogard|cementerio|buried at|buried or commemorated at|commemorated|commemorated at|burial location|interment)$/],
        ["burial", /^(burial|buried|begraven|begrafenis|inhumation|inhume|beerdigt|begraben|beerdigung|begravd|begravet|gravlagt|entierro)$/],
        // Marriage
        ["marriageDate", /^(marriage date|year of marriage|marriage year|date of marriage|married on|huwelijksdatum|trouwdatum|date de mariage|heiratsdatum|vigseldatum|vielsesdato|fecha de matrimonio)$/],
        ["marriagePlace", /^(marriage place|place of marriage|married in|huwelijksplaats|lieu de mariage|heiratsort|vigselort)$/],
        ["marriage", /^(married|marriage|huwelijk|getrouwd|mariage|marie|mariee|heirat|verheiratet|hochzeit|gift|vigsel|viet|matrimonio)$/],
        // Military
        ["serviceNumber", /^(service (number|no)|regimental (number|no)|serial (number|no)|service id|army number)$/],
        ["rank", /^(rank|grade|dienstgrad|grad|rang)$/],
        ["unit", /^(unit|regiment|battalion|regiment service|unit name|regiment or unit|service branch|branch of service|branch|division|corps|ship)$/],
        ["conflict", /^(conflict|war|campaign|conflict period)$/],
        // Generic record event (record sites: "Record type", "Date", "Place")
        ["censusYear", /^(census|census year|year of census|folketelling|volkstelling|recensement|volkszahlung)$/],
        ["eventType", /^(record type|event type|event|type|type of record|soort akte|soort registratie|aktetype|type d acte|kildetype|kirkebokstype|registration type)$/],
        ["date", /^(date|datum|dato|fecha|event date|registration date|year)$/],
        ["place", /^(place|plaats|lieu|ort|sted|lugar|location|event place|parish|church|church name|registration district|registration area|reg area|sr district reg area|district|county|country|state|province|town|city|village|municipality|gemeente|commune|gemeinde|kommune|kirkesogn|prestegjeld)$/]
      ];
      var EVENT_WORDS = [
        ["Baptism", /bapt|christen|doop|dap|taufe|bautis/],
        ["Birth", /birth|geboort|naissance|fodsel|fodt|geburt|nacim/],
        ["Marriage", /marri|huwelijk|mariage|heirat|vigsel|viels|matrimon|banns/],
        ["Burial", /burial|begra|inhum|beerd|gravl|entierr/],
        ["Death", /death|overlijd|deces|sterbe|dod|defunc/],
        ["Census", /census|volkstelling|recensement|volkszahl|folketelling|folkrakning|censo/]
      ];
      function normalizeLabel(label) {
        return stripAccents((label || "").toLowerCase()).replace(/\(.*$/, "").replace(/['’]s\b/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/^(burial|baptism|marriage|birth|death|christening) (person|deceased|child) (?=\w)/, "").replace(/^(person|principal|child|deceased|individual|subject|the) (?=\w)/, "").trim();
      }
      function fieldForLabel(label) {
        var norm = normalizeLabel(label);
        if (!norm || norm.length > 40) return null;
        for (var i = 0; i < FIELDS.length; i++) {
          if (FIELDS[i][1].test(norm)) return FIELDS[i][0];
        }
        return null;
      }
      function eventTypeForText(text) {
        var norm = normalizeLabel(text);
        for (var i = 0; i < EVENT_WORDS.length; i++) {
          if (EVENT_WORDS[i][1].test(norm)) return EVENT_WORDS[i][0];
        }
        return null;
      }
      var NULLISH = /^(null|none|n a|na|unknown|not stated|not known|not available|not recorded|\?|-|–|—|0|unk)$/;
      function isNullish(value) {
        return NULLISH.test(normalizeLabel(value) || (value || "").trim());
      }
      function genderForText(text) {
        var norm = normalizeLabel(text);
        if (/^(m|male|man|mann|mand|homme|masculin|mannlich|maennlich|hombre|masculino|man|manlig|mannlig|jongen|son|boy)$/.test(norm)) return "Male";
        if (/^(f|v|w|k|female|woman|vrouw|femme|feminin|weiblich|kvinne|kvinna|kvinde|mujer|femenino|kvinnlig|meisje|daughter|girl)$/.test(norm)) return "Female";
        return null;
      }
      module.exports = {
        fieldForLabel,
        eventTypeForText,
        genderForText,
        isNullish,
        normalizeLabel
      };
    }
  });

  // src/generic/labelvalue.js
  var require_labelvalue = __commonJS({
    "src/generic/labelvalue.js"(exports, module) {
      var debug = require_browser()("genscrape:generic:labelvalue");
      var labels = require_labels();
      var dates = require_dates();
      var SKIP = "script,style,noscript,template,nav,footer,form,select,option,input,textarea,button,svg,iframe";
      var BLOCK = /^(address|article|aside|blockquote|dd|div|dl|dt|fieldset|figure|h[1-6]|header|hr|li|main|ol|p|pre|section|table|tbody|thead|tfoot|tr|td|th|ul|caption)$/;
      function getText(el) {
        var out = "";
        (function walk(node) {
          if (node.nodeType === 3) {
            out += node.data;
            return;
          }
          if (node.nodeType !== 1) return;
          var tag = node.tagName.toLowerCase();
          if (tag === "br") {
            out += "\n";
            return;
          }
          if (matches(node, SKIP)) return;
          var block = BLOCK.test(tag);
          if (block) out += "\n";
          for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
          if (block) out += "\n";
        })(el);
        return out.replace(/[ \t ]+/g, " ").replace(/ *\n[\s]*/g, "\n").trim();
      }
      function oneLine(s) {
        return (s || "").replace(/\s+/g, " ").trim();
      }
      function matches(el, selector) {
        var fn = el.matches || el.webkitMatchesSelector || el.msMatchesSelector;
        return !!(fn && fn.call(el, selector));
      }
      function closest(el, selector) {
        for (; el && el.nodeType === 1; el = el.parentNode) {
          if (matches(el, selector)) return el;
        }
        return null;
      }
      function skipped(el) {
        return !!closest(el, SKIP);
      }
      function hasBlockChild(el) {
        for (var i = 0; i < el.children.length; i++) {
          if (BLOCK.test(el.children[i].tagName.toLowerCase())) return true;
        }
        return false;
      }
      function collectPairs(document2, root) {
        var pairs = [], order = 0;
        root = root || document2.body || document2.documentElement;
        pairs.household = [];
        function add(label, value, priority) {
          label = oneLine(label).replace(/[:：]\s*$/, "");
          value = (value || "").trim();
          if (!label || !value || label.length > 50 || value.length > 600 || labels.isNullish(value)) return;
          if (value.length < 40 && labels.fieldForLabel(value)) return;
          var field = labels.fieldForLabel(label);
          if (field) pairs.push({ field, label, value, priority, order: order++ });
        }
        Array.prototype.forEach.call(root.querySelectorAll("table"), function(table) {
          if (skipped(table)) return;
          var headerCells = Array.prototype.slice.call(table.querySelectorAll("thead th, thead td"));
          var rows = Array.prototype.filter.call(table.querySelectorAll("tr"), function(tr) {
            return !closest(tr, "thead");
          });
          if (!headerCells.length && rows.length > 1) {
            var firstCells = Array.prototype.filter.call(rows[0].children, function(c) {
              return /^(td|th)$/i.test(c.tagName);
            });
            if (firstCells.length > 2 && firstCells.every(function(c) {
              return c.tagName.toLowerCase() === "th";
            })) {
              headerCells = firstCells;
              rows = rows.slice(1);
            }
          }
          var headers = headerCells.map(function(c) {
            return oneLine(getText(c));
          });
          var mapped = headers.filter(function(h) {
            return labels.fieldForLabel(h);
          }).length;
          if (headers.length < 3 || mapped < 2) return;
          var data = rows.map(function(tr) {
            return Array.prototype.filter.call(tr.children, function(c) {
              return /^(td|th)$/i.test(c.tagName);
            });
          }).filter(function(cells) {
            return Math.abs(cells.length - headers.length) <= 1;
          });
          if (!data.length) return;
          var marked = data.filter(function(cells) {
            var html = cells.map(function(c) {
              return (c.getAttribute("class") || "") + " " + c.innerHTML;
            }).join(" ").toLowerCase();
            return /bold|semibold|highlight|selected|current|principal|primary|found in your search|<strong|<b>/.test(html);
          });
          var principal = marked.length === 1 ? marked[0] : data[0];
          var cellText = function(c) {
            var clone = c.cloneNode(true);
            Array.prototype.forEach.call(clone.querySelectorAll(".accessibility,.sr-only,.visually-hidden"), function(x) {
              x.parentNode.removeChild(x);
            });
            return oneLine(getText(clone));
          };
          headers.forEach(function(h, i) {
            if (principal[i]) add(h, cellText(principal[i]), 0);
          });
          if (data.length > 1) {
            data.forEach(function(cells) {
              if (cells === principal) return;
              var member = {};
              headers.forEach(function(h, i) {
                var f = labels.fieldForLabel(h);
                if (f && cells[i] && member[f] === void 0) member[f] = cellText(cells[i]);
              });
              pairs.household.push(member);
            });
          }
        });
        Array.prototype.forEach.call(root.querySelectorAll("tr"), function(tr) {
          if (skipped(tr)) return;
          var cells = Array.prototype.filter.call(tr.children, function(c) {
            return /^(td|th)$/i.test(c.tagName);
          });
          if (cells.length >= 2) {
            add(getText(cells[0]), cells.slice(1).map(getText).filter(Boolean).join("\n"), 1);
          }
        });
        Array.prototype.forEach.call(root.querySelectorAll("dt"), function(dt) {
          if (skipped(dt)) return;
          var values = [], sib = dt.nextElementSibling;
          while (sib && sib.tagName.toLowerCase() === "dd") {
            values.push(getText(sib));
            sib = sib.nextElementSibling;
          }
          add(getText(dt), values.join("\n"), 1);
        });
        Array.prototype.forEach.call(root.querySelectorAll("[class]"), function(el) {
          if (skipped(el)) return;
          var cls = " " + (el.getAttribute("class") || "").toLowerCase().replace(/[-_]/g, " ") + " ";
          if (/ (label|key|term|field label|data label|fact label|title) /.test(cls) && el.nextElementSibling && !hasBlockChild(el)) {
            add(getText(el), getText(el.nextElementSibling), 2);
          }
        });
        Array.prototype.forEach.call(root.querySelectorAll("p,li,div,span,td,dd"), function(el) {
          if (skipped(el) || hasBlockChild(el)) return;
          getText(el).split("\n").forEach(function(line) {
            var m = /^\s*([^:\n]{2,40}?)\s*[:：]\s*(\S[^\n]*)$/.exec(line);
            if (m) add(m[1], m[2], 3);
          });
        });
        Array.prototype.forEach.call(root.querySelectorAll("b,strong,em,span,label,h2,h3,h4,h5,h6,dt,th,div"), function(el) {
          if (skipped(el) || el.children.length > 1) return;
          var t = oneLine(el.textContent);
          if (!t || t.length > 40) return;
          var sib = el.nextElementSibling, value = "";
          if (sib) {
            value = getText(sib);
          } else if (el.nextSibling && el.nextSibling.nodeType === 3) {
            value = el.nextSibling.data;
          }
          if (value && value.length < 300) add(t, value, 4);
        });
        var lines = getText(root).split("\n").map(oneLine).filter(Boolean);
        lines.forEach(function(line, i) {
          var label = line.replace(/\s*[:：]$/, "").replace(/^(children|child|parents|spouses?)\s+(of|with|by)\s+.*$/i, "$1");
          if (label.length > 40 || /\d/.test(label)) return;
          var field = labels.fieldForLabel(label);
          if (!field || !lines[i + 1]) return;
          if (LIST_FIELDS.test(field)) {
            var values = [];
            for (var j = i + 1; j < lines.length && j <= i + 15 && !isSectionLine(lines[j]); j++) values.push(lines[j]);
            add(label, values.join("\n"), 4);
          } else if (!isSectionLine(lines[i + 1])) {
            add(label, lines[i + 1], 4);
          }
        });
        lines.forEach(function(line) {
          var m = EVENT_LINE.exec(line);
          if (m && dates.findDate(m[2])) {
            var word = m[1].toLowerCase().replace(/\.$/, "");
            add(ABBREV[word] || word, m[2], 5);
          }
        });
        lines.forEach(function(line) {
          var d = dates.findDate(line);
          if (!d || d.index > 3) return;
          var m = /^\s*([^\d:]{3,30}?)\s*[:\-–]\s*(.*)$/.exec(line.substr(d.index + d.text.length));
          if (!m || /^(son|daughter|spouse|wife|husband|father|mother|sibling|brother|sister)\b/i.test(m[1])) return;
          var place = m[2].split(/,?\s*[♂♀]|\s+(?:with|to|and)\s+[A-Z]/)[0];
          var who = /[♂♀]\s*(.+)$/.exec(m[2]);
          if (/^child (birth|born)/i.test(m[1])) {
            if (who) add("children", who[1], 5);
            return;
          }
          add(m[1], d.text + " " + place, 5);
          if (who && labels.fieldForLabel(m[1]) === "marriage") add("spouse", who[1], 5);
        });
        return pairs;
      }
      var HEAD = /^(head|hoofd|chef|hf|husfar|husbonde|husmor|hm)/;
      var SPOUSE = /^(wife|husband|spouse|w|hu|echtgeno|epouse|epoux|kone|hustru|mann|ehefrau|ehemann)/;
      var CHILD = /^(son|dau|daughter|child|s|d|sonn|datter|zoon|dochter|fils|fille|sohn|tochter|barn)/;
      var PARENT = /^(father|mother|fader|moder|far|mor|vader|moeder)/;
      function householdRole(mine, theirs) {
        var meHead = !mine || HEAD.test(mine);
        if (meHead) {
          if (SPOUSE.test(theirs)) return "spouse";
          if (CHILD.test(theirs)) return "child";
          if (PARENT.test(theirs)) return "parent";
          return null;
        }
        if (SPOUSE.test(mine)) {
          if (HEAD.test(theirs)) return "spouse";
          if (CHILD.test(theirs)) return "child";
          return null;
        }
        if (CHILD.test(mine)) {
          if (HEAD.test(theirs) || SPOUSE.test(theirs)) return "parent";
        }
        return null;
      }
      var LIST_FIELDS = /^(parents|spouse|children|father|mother)$/;
      var SECTION_WORDS = /^(siblings?|half[ -]siblings?|brothers?|sisters?|brothers and sisters|grand ?parents|paternal|maternal|notes?|sources?|citations?|events?|timeline|biography|photos?|media|family|family members|relationships|research|comments|memorials?|flowers|see also|references|share|print|godson|goddaughter|neighbors|household|freres et soeurs|geschwister|broers en zussen|sosken|syskon)\b/i;
      function isSectionLine(line) {
        if (line.length > 40 || /\d/.test(line)) return false;
        var label = line.replace(/\s*[:：]$/, "");
        return SECTION_WORDS.test(label) || !!labels.fieldForLabel(label);
      }
      var EVENT_LINE = /^(born|birth|b\.|baptized|baptised|christened|bap\.|chr\.|died|deceased|death|d\.|buried|burial|bur\.|married|m\.|geboren|gestorben|gest\.|geb\.|ne|née|né|nee|decede|décédé|décédée|overleden|begraven|gedoopt|fodt|født|død|dod)\s+(.+)$/i;
      var ABBREV = { "b": "born", "d": "died", "bap": "baptism", "chr": "baptism", "bur": "buried", "m": "married", "geb": "geboren", "gest": "gestorben" };
      function bestPairs(pairs) {
        var best = {};
        pairs.forEach(function(p) {
          var cur = best[p.field];
          if (!cur || p.priority < cur.priority || p.priority === cur.priority && p.order < cur.order) {
            best[p.field] = p;
          }
        });
        return best;
      }
      var NAME_JUNK = /\s*(\(|\[|\b(b|d|born|died|geb|gest|ne|nee)\.?\s+\d|\s[-–—]\s|\s\d{3,4}\b|,\s*(born|died|b\.|d\.)).*$/i;
      var PARTICLES = /^(van|von|de|der|den|du|la|le|da|di|del|della|dos|das|of|y|zu|ten|ter|vom|zum|and|et|und|en|af|av|bin|ibn|al|el|st|ste|mc|mac)$/i;
      function looksLikeName(s, minWords) {
        if (!s || labels.fieldForLabel(s)) return false;
        if ((s.match(/,/g) || []).length > 1) return false;
        var words = s.replace(/[,()"“”]/g, " ").split(/\s+/).filter(Boolean);
        if (words.length < (minWords || 1) || words.length > 8) return false;
        return words.every(function(w) {
          return /^[A-ZÀ-ÞĀ-Ž]/.test(w) || PARTICLES.test(w.replace(/\.$/, "")) || /^[IVX]+$/.test(w);
        }) && !words.some(function(w) {
          return labels.fieldForLabel(w);
        });
      }
      var NOT_A_NAME = /\b(record|records|register|search|results?|archives?|genealogy|family tree|database|view|index|transcriptions?|login|home|page|relationship|forenames?|marital|status|occupation|unknown|null)\b/i;
      function cleanName(s) {
        s = oneLine(s).replace(/^[A-Z][\w ]{1,20}:\s*(?=\S)/, "").replace(/^.*?\b(?:record|entry|profile|memorial) (?:for|of)\s+/i, "").replace(/^(?:married|mariee?|marie|x)\b.*?\b(?:to|with|avec|met|mit)\s+/i, "").replace(/^\d+\s+/, "").replace(NAME_JUNK, "").replace(/,\s*(?=[a-z]).*$/, "").replace(/\s+(?:ca|abt|about|circa|c|bef|aft)\.?$/i, "").replace(/([a-z.])[*+]?\d{1,2}\b/gi, "$1").replace(/[*+†✝]+/g, "").replace(/^[\s•·*\-–—♂♀⚭]+|[\s,;:•·*\-–—]+$/g, "");
        return /[a-z]/i.test(s) && s.length <= 80 && !NOT_A_NAME.test(s) ? s : "";
      }
      function splitList(value) {
        return value.split(/\n|;|\s+(?:and|&|og|en|et|und|och|y)\s+/i).map(cleanName).filter(function(n) {
          return looksLikeName(n, 2);
        });
      }
      function headingName(document2, url, root) {
        var candidates = [];
        var scoped = root && root !== document2.body && root.querySelector("h1,h2,h3");
        if (scoped) candidates.push(oneLine(getText(scoped)));
        var firstHeading = function(tag) {
          return Array.prototype.filter.call(document2.querySelectorAll(tag), function(h) {
            return !skipped(h);
          })[0];
        };
        var h1 = firstHeading("h1");
        if (h1) candidates.push(oneLine(getText(h1)));
        var og = document2.querySelector('meta[property="og:title"]');
        if (og) candidates.push(og.getAttribute("content") || "");
        candidates.push((document2.title || "").split(/\s+[|\-–—:]\s+/)[0]);
        var h2 = firstHeading("h2");
        if (h2) candidates.push(oneLine(getText(h2)));
        var site = (url || "").replace(/^https?:\/\/(www\.)?/, "").split(/[./]/)[0].toLowerCase();
        for (var i = 0; i < candidates.length; i++) {
          var n = cleanName(candidates[i]);
          if (n && n.split(" ").length <= 8 && (!site || n.toLowerCase().replace(/\W/g, "").indexOf(site) === -1)) return n;
        }
        return "";
      }
      function event(rec, type) {
        return rec.events[type] = rec.events[type] || { date: "", place: "" };
      }
      function setDatePlace(rec, type, combined, date, place) {
        if (!combined && !date && !place) return;
        var e = event(rec, type);
        if (combined && !dates.findDate(combined) && (labels.genderForText(combined) || labels.fieldForLabel(combined) || /\b(relation|head|status|single|married|widow|unknown|yes|no)\b/i.test(combined))) {
          combined = "";
        }
        if (combined) {
          var split = dates.splitDatePlace(combined);
          e.date = e.date || split.date;
          e.place = e.place || split.place;
        }
        if (date) e.date = dates.findDate(date) ? oneLine(date) : e.date;
        if (place) e.place = oneLine(place);
      }
      var PLACE_RANK = [
        /church|parish|kirke|sogn|prestegjeld/,
        /place|location|town|city|village|municipality|gemeente|commune|gemeinde|kommune|lieu|plaats|ort|sted|lugar/,
        /district|area/,
        /county|state|province/,
        /country/
      ];
      function placeRank(label) {
        var n = labels.normalizeLabel(label);
        for (var i = 0; i < PLACE_RANK.length; i++) if (PLACE_RANK[i].test(n)) return i;
        return 1;
      }
      function joinValues(pairs, field, priority, sep) {
        var seen = {};
        return pairs.filter(function(p) {
          return p.field === field && p.priority === priority;
        }).sort(function(a, b) {
          return sep === ", " ? placeRank(a.label) - placeRank(b.label) || a.order - b.order : a.order - b.order;
        }).map(function(p) {
          return sep === ", " ? oneLine(p.value) : p.value;
        }).filter(function(v) {
          var k = v.toLowerCase();
          if (seen[k]) return false;
          seen[k] = true;
          return true;
        }).join(sep);
      }
      function extract(document2, url, root) {
        var pairs = collectPairs(document2, root);
        var best = bestPairs(pairs);
        ["place", "birthPlace", "deathPlace", "baptismPlace", "marriagePlace"].forEach(function(f) {
          if (best[f]) best[f].value = joinValues(pairs, f, best[f].priority, ", ");
        });
        ["children", "spouse"].forEach(function(f) {
          if (best[f]) best[f].value = joinValues(pairs, f, best[f].priority, "\n");
        });
        var v = function(f) {
          return best[f] ? best[f].value : "";
        };
        var fields = Object.keys(best);
        debug("fields", fields.join(","));
        var rec = { name: {}, gender: null, events: {}, relatives: [] };
        rec.name.given = oneLine(v("given"));
        rec.name.surname = oneLine(v("surname"));
        var groom = oneLine(v("groom")) || oneLine([v("groomGiven"), v("groomSurname")].join(" "));
        var bride = oneLine(v("bride")) || oneLine([v("brideGiven"), v("brideSurname")].join(" "));
        if (groom && !rec.name.given && !rec.name.surname && !v("name")) {
          if (v("groomGiven") || v("groomSurname")) {
            rec.name.given = oneLine(v("groomGiven"));
            rec.name.surname = oneLine(v("groomSurname"));
          } else {
            rec.name.full = cleanName(groom);
          }
          rec.gender = "Male";
        }
        rec.name.full = cleanName(v("name")) || (rec.name.given || rec.name.surname ? "" : headingName(document2, url, root));
        rec.gender = labels.genderForText(oneLine(v("gender"))) || rec.gender;
        if (v("maritalStatus")) rec.events.MaritalStatus = { value: oneLine(v("maritalStatus")) };
        setDatePlace(rec, "Birth", v("birth"), v("birthDate"), v("birthPlace"));
        setDatePlace(rec, "Baptism", v("baptism"), v("baptismDate"), v("baptismPlace"));
        setDatePlace(rec, "Death", v("death"), v("deathDate"), v("deathPlace"));
        setDatePlace(rec, "Burial", v("burial"), v("burialDate"), v("cemetery"));
        setDatePlace(rec, "Marriage", v("marriage"), v("marriageDate"), v("marriagePlace"));
        if (v("residence")) event(rec, "Residence").place = oneLine(v("residence"));
        if (v("occupation")) rec.events.Occupation = { value: oneLine(v("occupation")) };
        if (v("deathCause") && rec.events.Death) rec.events.Death.value = oneLine(v("deathCause"));
        var service = ["rank", "unit", "serviceNumber", "conflict"].map(v).map(oneLine).filter(Boolean);
        if (service.length) rec.events.MilitaryService = { value: service.join(", ") };
        var generic = labels.eventTypeForText(v("eventType"));
        if (!generic && (v("date") || v("place"))) {
          var found = Object.keys(rec.events).filter(function(k) {
            return /Birth|Baptism|Death|Burial|Marriage/.test(k);
          });
          generic = found.length === 1 ? found[0] : null;
        }
        if (generic) {
          var e = event(rec, generic);
          if (!e.date && v("date")) e.date = (dates.findDate(v("date")) || {}).text || "";
          if (!e.place && v("place")) e.place = oneLine(v("place"));
        }
        var father = cleanName(v("father")) || oneLine([v("fatherGiven"), v("fatherSurname") || (v("fatherGiven") ? rec.name.surname : "")].join(" "));
        var mother = cleanName(v("mother")) || oneLine([v("motherGiven"), v("motherSurname") || v("motherMaiden")].join(" "));
        if (rec.name.given && !rec.name.surname && !rec.name.full && v("fatherSurname")) rec.name.surname = oneLine(v("fatherSurname"));
        if (father) rec.relatives.push({ role: "parent", name: father, gender: "Male" });
        if (mother) rec.relatives.push({ role: "parent", name: mother, gender: "Female" });
        if (!father && !mother && v("parents")) {
          splitList(v("parents")).slice(0, 2).forEach(function(n) {
            rec.relatives.push({ role: "parent", name: n });
          });
        }
        if (groom && bride) rec.relatives.push({ role: "spouse", name: cleanName(bride) || bride, gender: "Female" });
        splitList(v("spouse")).forEach(function(n) {
          rec.relatives.push({ role: "spouse", name: n });
        });
        splitList(v("children")).forEach(function(n) {
          rec.relatives.push({ role: "child", name: n });
        });
        if (v("censusYear") || generic === "Census") {
          var c = event(rec, "Census");
          c.date = c.date || ((dates.findDate(v("censusYear")) || {}).text || "");
          c.place = c.place || oneLine(v("place"));
        }
        var age = parseInt(oneLine(v("age")), 10);
        var dated = ["Census", "Death", "Burial"].map(function(k) {
          return rec.events[k];
        }).filter(function(e2) {
          return e2 && e2.date;
        })[0];
        if (age >= 0 && age < 120 && dated && !(rec.events.Birth && rec.events.Birth.date)) {
          var year = (dates.parseDateParts(dated.date).years || [])[0];
          if (year) event(rec, "Birth").date = "about " + (year - age);
        }
        var myRel = labels.normalizeLabel(v("relationToHead"));
        pairs.household.forEach(function(m) {
          var name = oneLine([m.given, m.surname].join(" ")) || cleanName(m.name || "");
          var rel = labels.normalizeLabel(m.relationToHead || "");
          if (!name || !rel) return;
          var role = householdRole(myRel, rel);
          if (role) rec.relatives.push({ role, name, gender: labels.genderForText(m.gender || "") });
        });
        Object.keys(rec.events).forEach(function(k) {
          var e2 = rec.events[k];
          if (!e2.date && !e2.place && !e2.value) delete rec.events[k];
        });
        var hasName = rec.name.full || rec.name.given || rec.name.surname;
        var substance = Object.keys(rec.events).length + rec.relatives.length + (rec.gender ? 1 : 0);
        if (!hasName || substance === 0) return null;
        return { record: rec, strategy: "labels", fields: fields.length };
      }
      module.exports = { extract, collectPairs, getText };
    }
  });

  // src/generic/embedded-json.js
  var require_embedded_json = __commonJS({
    "src/generic/embedded-json.js"(exports, module) {
      var labels = require_labels();
      var dates = require_dates();
      var STATE_RE = /(?:window\.)?(?:__[A-Z_]+__|__NEXT_DATA__|initialState|INITIAL_STATE)\s*=\s*(\{[\s\S]*?\});?\s*(?:<\/script>|$|\n)/;
      function keyToLabel(key) {
        return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-]+/g, " ");
      }
      function parseScripts(document2) {
        var roots = [];
        Array.prototype.forEach.call(document2.querySelectorAll("script"), function(s) {
          var type = (s.getAttribute("type") || "").toLowerCase();
          var txt = s.textContent || "";
          if (type === "application/ld+json") return;
          try {
            if (type === "application/json") {
              txt = txt.trim();
              if (/^[A-Za-z0-9+\/=\s]{40,}$/.test(txt) && txt.charAt(0) !== "{") {
                var win = document2.defaultView || {};
                txt = decodeURIComponent(escape((win.atob || atob)(txt.replace(/\s+/g, ""))));
              }
              roots.push(JSON.parse(txt));
              return;
            }
            var m = STATE_RE.exec(txt);
            if (m) roots.push(JSON.parse(m[1]));
          } catch (e) {
          }
        });
        return roots;
      }
      function scalar(v) {
        if (v === null || v === void 0) return "";
        if (typeof v === "object") {
          if (v.year) return [v.day, v.month, v.year].filter(Boolean).join(" ");
          return scalar(v.text || v.name || v.value || v.display || v.original || "");
        }
        return String(v).replace(/\s+/g, " ").trim();
      }
      function mapObject(obj) {
        var out = {};
        Object.keys(obj).forEach(function(k) {
          var v = obj[k];
          if (v === null || v === "" || typeof v === "string" && labels.normalizeLabel(v) === labels.normalizeLabel(k)) return;
          if (typeof v === "string" && labels.isNullish(v)) return;
          var f = labels.fieldForLabel(keyToLabel(k));
          if (!f) return;
          if (out[f] === void 0 || typeof v !== "object" && scalar(v).length > scalar(out[f]).length) {
            out[f] = v;
            out["_key_" + f] = k;
          }
        });
        return out;
      }
      function nameOf(obj) {
        var m = mapObject(obj);
        var full = scalar(m.name);
        var parts = [scalar(m.given), scalar(m.surname)].join(" ").trim();
        return parts || full;
      }
      function withRegion(obj, key, place) {
        if (!key || !place) return place;
        var prefix = key.replace(/([_\-]?(name|place|location))$/i, "");
        if (prefix === key) return place;
        var parts = [place];
        ["city", "town", "county", "state", "province", "region", "country"].forEach(function(s) {
          Object.keys(obj).forEach(function(k) {
            if (k.toLowerCase().replace(/[_\-]/g, "") === (prefix + s).toLowerCase().replace(/[_\-]/g, "")) {
              var v = scalar(obj[k]);
              if (v && parts.indexOf(v) === -1) parts.push(v);
            }
          });
        });
        return parts.join(", ");
      }
      function extract(document2, url, root) {
        var best = null, bestScore = 2;
        var seen = 0;
        function walk(node, depth) {
          if (!node || typeof node !== "object" || depth > 25 || seen++ > 5e4) return;
          if (Array.isArray(node)) {
            node.forEach(function(n) {
              walk(n, depth + 1);
            });
            return;
          }
          var m2 = mapObject(node);
          var hasName = m2.name !== void 0 || m2.given !== void 0 || m2.surname !== void 0;
          var score = Object.keys(m2).length;
          if (hasName && score > bestScore && nameOf(node)) {
            best = node;
            bestScore = score;
          }
          Object.keys(node).forEach(function(k) {
            walk(node[k], depth + 1);
          });
        }
        parseScripts(document2).forEach(function(r) {
          walk(r, 0);
        });
        if (!best) return null;
        var m = mapObject(best);
        var rec = {
          name: { given: scalar(m.given), surname: scalar(m.surname), full: scalar(m.name) },
          gender: labels.genderForText(scalar(m.gender)),
          events: {},
          relatives: []
        };
        if (rec.name.given || rec.name.surname) rec.name.full = "";
        [
          ["Birth", "birth", "birthDate", "birthPlace"],
          ["Baptism", "baptism", "baptismDate", "baptismPlace"],
          ["Death", "death", "deathDate", "deathPlace"],
          ["Burial", "burial", "burialDate", "cemetery"],
          ["Marriage", "marriage", "marriageDate", "marriagePlace"]
        ].forEach(function(e) {
          var combined = scalar(m[e[1]]), date = scalar(m[e[2]]), place = withRegion(best, m["_key_" + e[3]], scalar(m[e[3]]));
          if (combined && !date && !place) {
            var split = dates.splitDatePlace(combined);
            date = split.date;
            place = split.place;
          }
          if (date || place) rec.events[e[0]] = { date, place };
        });
        [["parent", "parents"], ["parent", "father"], ["parent", "mother"], ["spouse", "spouse"], ["child", "children"]].forEach(function(r) {
          var v = m[r[1]];
          (Array.isArray(v) ? v : v ? [v] : []).forEach(function(rel) {
            var n = typeof rel === "object" ? nameOf(rel) : scalar(rel);
            if (n) rec.relatives.push({ role: r[0], name: n });
          });
        });
        return { record: rec, strategy: "json" };
      }
      module.exports = { extract };
    }
  });

  // src/generic/narrative.js
  var require_narrative = __commonJS({
    "src/generic/narrative.js"(exports, module) {
      var dates = require_dates();
      var NAME = "([A-Z][\\w'\u2019.\\-]*(?:\\s+(?:(?:van|von|de|der|den|du|la|le|da|di|of|y|zu|ten|ter)\\s+)*[A-Z][\\w'\u2019.\\-]*){0,6})";
      var EVENTS = [
        ["Birth", /\b(?:was born|born|b\.|né|née|geboren|ble født|föddes)\s+/i],
        ["Baptism", /\b(?:was (?:baptized|baptised|christened)|baptized|baptised|christened|bap\.|chr\.|gedoopt|getauft)\s+/i],
        ["Death", /\b(?:died|d\.|décédée?|gestorben|overleden|døde|dog)\s+/i],
        ["Burial", /\b(?:was buried|buried|bur\.|inhumée?|begraben|begraven)\s+/i]
      ];
      function firstSentenceMatch(text, re) {
        var m = re.exec(text);
        if (!m) return null;
        var rest = text.substr(m.index + m[0].length, 160).split(/(?:\.\s+(?=[A-Z])|;|\n|\.$)/)[0];
        rest = rest.split(/,\s*(?:b|d|bap|chr|bur|m)\.\s/)[0];
        return rest;
      }
      function extract(document2, text) {
        var rec = { name: {}, gender: null, events: {}, relatives: [] };
        text = text.replace(/\[\d+\]/g, "").replace(/([a-zA-Z.])\d{1,2}(?=\s|$)/gm, "$1");
        EVENTS.forEach(function(e) {
          var rest = firstSentenceMatch(text, e[1]);
          if (!rest) return;
          var split = dates.splitDatePlace(rest);
          if (split.date) {
            rec.events[e[0]] = { date: split.date, place: split.place.split(/\s+(?:to|and|with|by|son|daughter)\s+/)[0] };
          }
        });
        var m;
        var parents = new RegExp("\\b([Ss]on|[Dd]aughter|[Cc]hild|[Ff]ils|[Ff]ille|[Ss]ohn|[Tt]ochter|[Zz]oon|[Dd]ochter)\\s+(?:of|de|du|von|van)\\s+" + NAME + "(?:\\s+(?:and|et|und|en|&)\\s+" + NAME + ")?").exec(text);
        if (parents) {
          rec.gender = /son|fils|sohn|zoon/i.test(parents[1]) ? "Male" : "Female";
          var father = parents[2], mother = parents[3];
          if (mother && father.split(/\s+/).length === 1 && mother.split(/\s+/).length > 1) {
            father += " " + mother.split(/\s+/).pop();
          }
          rec.relatives.push({ role: "parent", name: father, gender: "Male" });
          if (mother) rec.relatives.push({ role: "parent", name: mother, gender: "Female" });
        }
        if (m = new RegExp("\\b([Hh]usband|[Ww]ife|[Ww]idow|[Ww]idower|\xE9pou(?:x|se)|ehemann|ehefrau|echtgeno(?:ot|te))\\s+of\\s+" + NAME).exec(text)) {
          rec.relatives.push({ role: "spouse", name: m[2] });
          rec.gender = rec.gender || (/husband|widower|époux|ehemann|echtgenoot/i.test(m[1]) ? "Male" : "Female");
        } else {
          var marriedRe = new RegExp("\\b(?:He|She)\\s+married\\s+" + NAME + "([^.;\\n]{0,120})", "g");
          while (m = marriedRe.exec(text)) {
            rec.relatives.push({ role: "spouse", name: m[1] });
            var md = dates.splitDatePlace((m[2] || "").replace(/^,[^,]*,/, ""));
            if (md.date && !rec.events.Marriage) rec.events.Marriage = { date: md.date, place: md.place.replace(/^.*?\b(?:at|in)\s+/, "") };
          }
        }
        if (m = /\b(?:[Ff]ather|[Mm]other|[Pp]arent|[Pp]ère|[Mm]ère|[Vv]ater|[Mm]utter|[Vv]ader|[Mm]oeder)\s+(?:of|de|von|van)\s+([^\n]+)/.exec(text)) {
          m[1].split(/;|\s+and\s+|\s+et\s+|\s+und\s+|\s+en\s+/).forEach(function(n) {
            n = n.replace(/,.*$/, "").trim();
            var nm = new RegExp("^" + NAME + "$").exec(n);
            if (nm) rec.relatives.push({ role: "child", name: nm[1] });
          });
          rec.gender = rec.gender || (/^[FPVfpv]/.test(m[0]) && !/^[Pp]arent/.test(m[0]) ? "Male" : "Female");
        }
        if (!rec.gender) {
          var he = (text.match(/\b(He|His|Him)\b/g) || []).length, she = (text.match(/\b(She|Her|Hers)\b/g) || []).length;
          if (he >= 2 && he > she * 2) rec.gender = "Male";
          else if (she >= 2 && she > he * 2) rec.gender = "Female";
        }
        var substance = Object.keys(rec.events).length + rec.relatives.length;
        return substance ? { record: rec, strategy: "narrative" } : null;
      }
      module.exports = { extract };
    }
  });

  // src/gedx-extensions.js
  var require_gedx_extensions = __commonJS({
    "src/gedx-extensions.js"() {
      var GedcomX = require_src();
      var utils = require_utils2();
      GedcomX.enableRsExtensions();
      GedcomX.enableRecordsExtensions();
      var fieldsIndex = GedcomX.ExtensibleData.jsonProps.indexOf("fields");
      if (fieldsIndex > -1) {
        GedcomX.ExtensibleData.jsonProps.splice(fieldsIndex, 1);
      }
      var linksIndex = GedcomX.ExtensibleData.jsonProps.indexOf("links");
      if (linksIndex > -1) {
        GedcomX.ExtensibleData.jsonProps.splice(linksIndex, 1);
      }
      GedcomX.Person.prototype.addSimpleName = function(name) {
        if (name) {
          this.addName(GedcomX.Name.createFromString(name));
        }
        return this;
      };
      GedcomX.Person.prototype.addNameFromParts = function(nameParts) {
        var nameForm = GedcomX.NameForm();
        for (var type in nameParts) {
          if (nameParts[type]) {
            nameForm.addPart({
              type,
              value: nameParts[type]
            });
          }
        }
        this.addName(GedcomX.Name().addNameForm(nameForm));
        return this;
      };
      GedcomX.Name.createFromString = function(name) {
        if (name) {
          var parts = utils.splitName(name), nameForm = GedcomX.NameForm();
          nameForm.setFullText(name);
          nameForm.addPart(GedcomX.NamePart({
            type: "http://gedcomx.org/Given",
            value: parts[0]
          }));
          if (parts[1]) {
            nameForm.addPart(GedcomX.NamePart({
              type: "http://gedcomx.org/Surname",
              value: parts[1]
            }));
          }
          return GedcomX.Name().addNameForm(nameForm);
        }
      };
      GedcomX.Root.prototype.findPersonByName = function(name) {
        for (var i = 0; i < this.persons.length; i++) {
          if (this.persons[i].hasName(name)) {
            return this.persons[i];
          }
        }
      };
      GedcomX.Person.prototype.hasName = function(name) {
        for (var i = 0; i < this.names.length; i++) {
          if (this.names[i].matches(name)) {
            return true;
          }
        }
        return false;
      };
      GedcomX.Name.prototype.matches = function(name) {
        for (var i = 0; i < this.nameForms.length; i++) {
          if (name.hasNameForm(this.nameForms[i])) {
            return true;
          }
        }
        return false;
      };
      GedcomX.Name.prototype.hasNameForm = function(nameForm) {
        for (var i = 0; i < this.nameForms.length; i++) {
          if (this.nameForms[i].equals(nameForm)) {
            return true;
          }
        }
        return false;
      };
      GedcomX.NameForm.prototype.equals = function(nameForm) {
        if (this.getLang() !== nameForm.getLang()) {
          return false;
        }
        if (this.getFullText().toLowerCase() !== nameForm.getFullText().toLowerCase()) {
          return false;
        }
        if (this.getParts().length !== nameForm.getParts().length) {
          return false;
        }
        for (var i = 0; i < this.parts.length; i++) {
          if (!nameForm.hasNamePart(this.parts[i])) {
            return false;
          }
        }
        return true;
      };
      GedcomX.NameForm.prototype.hasNamePart = function(namePart) {
        for (var i = 0; i < this.parts.length; i++) {
          if (this.parts[i].equals(namePart)) {
            return true;
          }
        }
        return false;
      };
      GedcomX.NamePart.prototype.equals = function(namePart) {
        if (this.getType() !== namePart.getType()) {
          return false;
        }
        if (this.getValue().toLowerCase() !== namePart.getValue().toLowerCase()) {
          return false;
        }
        return true;
      };
      GedcomX.NameForm.prototype.getFullText = function() {
        if (this.fullText) {
          return this.fullText;
        } else {
          var parts = [], nameForm = this;
          ["Prefix", "Given", "Surname", "Suffix"].forEach(function(type) {
            var part = nameForm.getPart("http://gedcomx.org/" + type);
            if (part) {
              parts.push(part.value);
            }
          });
          return parts.join(" ");
        }
      };
      GedcomX.NameForm.prototype.getPart = function(type) {
        for (var i = 0; i < this.parts.length; i++) {
          if (this.parts[i].getType() === type) {
            return this.parts[i];
          }
        }
      };
      GedcomX.Root.prototype.generateId = function() {
        if (typeof this._nextId === "undefined") {
          this._nextId = 0;
        }
        return ++this._nextId + "";
      };
      var originalSetPerson1 = GedcomX.Relationship.prototype.setPerson1;
      GedcomX.Relationship.prototype.setPerson1 = function(reference) {
        if (GedcomX.Person.isInstance(reference)) {
          reference = {
            resource: "#" + reference.getId()
          };
        }
        originalSetPerson1.call(this, reference);
      };
      var originalSetPerson2 = GedcomX.Relationship.prototype.setPerson2;
      GedcomX.Relationship.prototype.setPerson2 = function(reference) {
        if (GedcomX.Person.isInstance(reference)) {
          reference = {
            resource: "#" + reference.getId()
          };
        }
        originalSetPerson2.call(this, reference);
      };
      GedcomX.Root.prototype.addRelativeFromName = function(person, name, relationshipType) {
        var relative = GedcomX.Person({
          id: this.generateId()
        }).addSimpleName(name);
        this.addPerson(relative);
        var relData;
        switch (relationshipType) {
          case "Couple":
            relData = {
              type: "http://gedcomx.org/Couple",
              person1: person,
              person2: relative
            };
            break;
          case "Parent":
            relData = {
              type: "http://gedcomx.org/ParentChild",
              person1: relative,
              person2: person
            };
            break;
          case "Child":
            relData = {
              type: "http://gedcomx.org/ParentChild",
              person1: person,
              person2: relative
            };
            break;
          default:
            throw new Error("Invalid relationship type: " + relationshipType);
        }
        this.addRelationship(relData);
        return relative;
      };
      var originalAddSourceDescription = GedcomX.Root.prototype.addSourceDescription;
      GedcomX.Root.prototype.addSourceDescription = function(sourceDescription) {
        sourceDescription = GedcomX.SourceDescription(sourceDescription);
        if (!sourceDescription.getId()) {
          sourceDescription.setId(this.generateId());
        }
        originalAddSourceDescription.call(this, sourceDescription);
        return this;
      };
      GedcomX.Root.prototype.addSourceDescriptionToAll = function(sourceDescription) {
        var descriptionUri;
        sourceDescription = GedcomX.SourceDescription(sourceDescription);
        this.addSourceDescription(sourceDescription);
        descriptionUri = "#" + sourceDescription.getId();
        this.setDescription(descriptionUri);
        this.getPersons().forEach(function(person) {
          person.addSource(GedcomX.SourceReference({
            description: descriptionUri
          }));
        });
        this.getRelationships().forEach(function(relationship) {
          relationship.addSource(GedcomX.SourceReference({
            description: descriptionUri
          }));
        });
        return this;
      };
      var originalAddPerson = GedcomX.Root.prototype.addPerson;
      GedcomX.Root.prototype.addPerson = function(person) {
        person = GedcomX.Person(person);
        if (person.getId() === void 0) {
          person.setId(this.generateId());
        }
        originalAddPerson.call(this, person);
      };
      GedcomX.Root.prototype.updatePersonsID = function(oldId, newId) {
        if (!oldId || oldId === newId) {
          return;
        }
        var person = this.getPersons().filter(function(p) {
          return p.getId() === oldId;
        })[0];
        if (person) {
          person.setId(newId);
          this.getRelationships().forEach(function(rel) {
            if (rel.getPerson1().matches(oldId)) {
              rel.setPerson1({
                resource: "#" + newId
              });
            }
            if (rel.getPerson2().matches(oldId)) {
              rel.setPerson2({
                resource: "#" + newId
              });
            }
          });
        }
      };
    }
  });

  // src/generic/index.js
  var require_generic = __commonJS({
    "src/generic/index.js"(exports, module) {
      var debug = require_browser()("genscrape:generic");
      var GedcomX = require_src();
      var utils = require_utils2();
      var structured = require_structured();
      var labelvalue = require_labelvalue();
      var embeddedJson = require_embedded_json();
      var narrative = require_narrative();
      var dates = require_dates();
      require_gedx_extensions();
      function merge(base, extra) {
        if (!base) return extra;
        ["full", "given", "surname"].forEach(function(k) {
          if (!base.name.full && !base.name.given && extra.name[k]) base.name[k] = extra.name[k];
        });
        base.gender = base.gender || extra.gender;
        Object.keys(extra.events).forEach(function(type) {
          var b = base.events[type], e = extra.events[type];
          if (!b) {
            base.events[type] = e;
            return;
          }
          b.date = precision(e.date) > precision(b.date) ? e.date : b.date;
          b.place = b.place || e.place;
          b.value = b.value || e.value;
        });
        var have = base.relatives.map(function(r) {
          return r.role + "|" + r.name.toLowerCase();
        });
        extra.relatives.forEach(function(r) {
          if (have.indexOf(r.role + "|" + r.name.toLowerCase()) === -1) base.relatives.push(r);
        });
        return base;
      }
      function precision(date) {
        if (!date || /u{2}/i.test(date)) return 0;
        var p = dates.parseDateParts(date);
        return (p.years.length ? 1 : 0) + (p.month ? 1 : 0) + (p.day ? 1 : 0);
      }
      function recordId(url) {
        var params = url.indexOf("?") === -1 ? {} : utils.getQueryParams(url.split("#")[0]);
        var id = params.id || params.record_id || params.pid || params.grave || params.p || params.i;
        if (id) return String(id);
        var path = url.split(/[?#]/)[0].split("/").filter(Boolean);
        for (var i = path.length - 1; i >= 0; i--) {
          if (/\d/.test(path[i])) return path[i].replace(/\.\w+$/, "");
        }
        return path.pop() || "unknown";
      }
      function makePerson(gedx, name, gender) {
        var person = GedcomX.Person({ id: gedx.generateId() });
        if (typeof name === "string") {
          person.addSimpleName(name);
        } else if (name.given || name.surname) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": name.given,
            "http://gedcomx.org/Surname": name.surname
          });
        } else {
          person.addSimpleName(name.full);
        }
        if (gender) person.setGender({ type: "http://gedcomx.org/" + gender });
        return person;
      }
      function toGedcomX(rec, document2, url) {
        var gedx = GedcomX(), host = url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, ""), id = recordId(url);
        var principal = makePerson(gedx, rec.name, rec.gender);
        principal.setId(id);
        principal.setPrincipal(true);
        principal.setIdentifiers({ genscrape: "genscrape://" + host + "/" + id });
        Object.keys(rec.events).forEach(function(type) {
          var e = rec.events[type];
          if (type === "Marriage" && rec.relatives.some(function(r) {
            return r.role === "spouse";
          })) return;
          var fact = GedcomX.Fact({ type: "http://gedcomx.org/" + type });
          if (e.date) fact.setDate({ original: e.date });
          if (e.place) fact.setPlace({ original: e.place });
          if (e.value) fact.setValue(e.value);
          principal.addFact(fact);
        });
        gedx.addPerson(principal);
        var spouseCount = 0;
        rec.relatives.forEach(function(r) {
          var rel = makePerson(gedx, r.name, r.gender);
          gedx.addPerson(rel);
          if (r.role === "spouse") {
            var couple = GedcomX.Relationship({ type: "http://gedcomx.org/Couple", person1: principal, person2: rel });
            if (rec.events.Marriage && spouseCount++ === 0) {
              couple.addFact(GedcomX.Fact({
                type: "http://gedcomx.org/Marriage",
                date: rec.events.Marriage.date ? { original: rec.events.Marriage.date } : void 0,
                place: rec.events.Marriage.place ? { original: rec.events.Marriage.place } : void 0
              }));
            }
            gedx.addRelationship(couple);
          } else {
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: r.role === "parent" ? rel : principal,
              person2: r.role === "parent" ? principal : rel
            });
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({ lang: "en", value: host }).setHomepage({ resource: url.split("/").slice(0, 3).join("/") }));
        gedx.addSourceDescriptionToAll({
          about: url,
          titles: [{ value: document2.title }],
          citations: [{ value: document2.title + " (" + url + " : accessed " + utils.getDateString() + ")" }],
          repository: { resource: "#agent" }
        });
        return gedx;
      }
      function anchorScope(document2, url) {
        var hash = (url.split("#")[1] || "").trim();
        if (!hash || !/\w/.test(hash)) return null;
        var anchor = document2.getElementById(hash) || document2.querySelector('a[name="' + hash.replace(/"/g, "") + '"]');
        if (!anchor) return null;
        var shape = new RegExp("^" + hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\d+/g, "\\d+") + "$");
        var isAnchor = function(el) {
          return el.nodeType === 1 && (el.id && shape.test(el.id) || el.getAttribute("name") && shape.test(el.getAttribute("name")));
        };
        var containsOther = function(el) {
          if (el.nodeType !== 1) return false;
          if (isAnchor(el) && el !== anchor) return true;
          return Array.prototype.some.call(el.querySelectorAll("[id],a[name]"), function(x) {
            return x !== anchor && isAnchor(x);
          });
        };
        var start = anchor;
        while (start.parentNode && start.parentNode.nodeType === 1 && !containsOther(start.parentNode)) start = start.parentNode;
        if (!start.parentNode || start.parentNode.nodeType !== 1) return null;
        var scope = document2.createElement("div");
        for (var n = start; n && !(n !== start && containsOther(n)); n = n.nextSibling) {
          scope.appendChild(n.cloneNode(true));
        }
        return scope;
      }
      function extract(document2, url) {
        var strategies = [];
        var record = null;
        var root = anchorScope(document2, url) || document2.body || document2.documentElement;
        var text = labelvalue.getText(root);
        [structured, embeddedJson, labelvalue, narrative].forEach(function(s) {
          var result = s === narrative ? s.extract(document2, text) : s.extract(document2, url, root);
          if (result) {
            strategies.push(result.strategy);
            record = merge(record, result.record);
          }
        });
        debug("strategies", strategies.join("+") || "none");
        if (!record) return null;
        return {
          gedx: toGedcomX(record, document2, url),
          strategy: strategies.join("+"),
          record
        };
      }
      function isUsable(record) {
        if (!record || !record.name) return false;
        var hasName = !!(record.name.full || record.name.given || record.name.surname);
        var events = Object.keys(record.events || {}).filter(function(k) {
          return record.events[k].date;
        });
        return hasName && (events.length > 0 || (record.relatives || []).length > 0);
      }
      module.exports = { extract, isUsable };
    }
  });

  // src/HorizontalTable.js
  var require_HorizontalTable = __commonJS({
    "src/HorizontalTable.js"(exports, module) {
      var HorizontalTable = function(table, options) {
        this.rows = {};
        this.processTable(table, options);
      };
      HorizontalTable.prototype.processTable = function(table, options) {
        if (!table || !(typeof table.querySelectorAll === "function")) {
          return;
        }
        options = options || {};
        if (options.labelMapper && !(typeof options.labelMapper === "function")) {
          throw new Error("labelMapper must be a function");
        }
        var rows = this.rows = {}, $trs = table.querySelectorAll(options.rowSelector || "tr"), row, label, value;
        for (var i = 0; i < $trs.length; i++) {
          row = $trs[i];
          label = row.children[0].textContent.trim();
          value = row.children[1];
          if (options.labelMapper) {
            label = options.labelMapper(label);
          }
          if (typeof rows[label] === "undefined") {
            rows[label] = [];
          }
          rows[label].push(value);
        }
      };
      HorizontalTable.prototype.getValues = function(label) {
        return this.rows[label] || [];
      };
      HorizontalTable.prototype.getValue = function(label) {
        return this.getValues(label)[0];
      };
      HorizontalTable.prototype.getText = function(label) {
        var value = this.getValue(label);
        return value ? value.textContent.trim() : "";
      };
      HorizontalTable.prototype.getLabels = function() {
        return Object.keys(this.rows);
      };
      HorizontalTable.prototype.getLabelsCount = function() {
        return this.getLabels().length;
      };
      HorizontalTable.prototype.getLabelsMatch = function(pattern) {
        return this.getLabels().filter(function(label) {
          return pattern.test(label);
        });
      };
      HorizontalTable.prototype.hasLabel = function(label) {
        return typeof this.rows[label] !== "undefined";
      };
      HorizontalTable.prototype.hasMatch = function(match) {
        return this.getLabelsMatch(match).length > 0;
      };
      HorizontalTable.prototype.getMatch = function(pattern) {
        var label = this.getLabelsMatch(pattern)[0];
        if (label) {
          return this.getValue(label);
        }
      };
      HorizontalTable.prototype.getMatchText = function(pattern) {
        var match = this.getMatch(pattern);
        return match ? match.textContent.trim() : "";
      };
      HorizontalTable.prototype.hasData = function() {
        return this.getLabelsCount() > 0;
      };
      HorizontalTable.prototype.getFirstText = function(labels) {
        var text;
        for (var i = 0; i < labels.length; i++) {
          text = this.getText(labels[i]);
          if (text) {
            return text;
          }
        }
      };
      module.exports = HorizontalTable;
    }
  });

  // src/VerticalTable.js
  var require_VerticalTable = __commonJS({
    "src/VerticalTable.js"(exports, module) {
      var VerticalTable = function(table, options) {
        this.rows = [];
        this.processTable(table, options);
      };
      VerticalTable.prototype.processTable = function(table, options) {
        if (!table || !(typeof table.querySelectorAll === "function")) {
          return;
        }
        options = options || {};
        if (options.labelMapper && !(typeof options.labelMapper === "function")) {
          throw new Error("labelMapper must be a function");
        }
        if (options.valueMapper && !(typeof options.valueMapper === "function")) {
          throw new Error("valueMapper must be a function");
        }
        var rows = this.rows = [], $trs = table.querySelectorAll(options.rowSelector || "tr"), headerRow = $trs[0], i, row, labels = [];
        if (headerRow) {
          for (i = 0; i < headerRow.children.length; i++) {
            labels.push(headerRow.children[i].textContent);
          }
          if (options.labelMapper) {
            labels = labels.map(function(l) {
              return options.labelMapper(l);
            });
          }
          for (i = 1; i < $trs.length; i++) {
            row = $trs[i];
            if (options.valueMapper) {
              rows.push(zip(labels, Array.from(row.children).map(function(child) {
                return options.valueMapper(child);
              })));
            } else {
              rows.push(zip(labels, row.children));
            }
          }
        }
      };
      VerticalTable.prototype.getRows = function() {
        return this.rows;
      };
      function zip(keys, values) {
        var obj = {};
        for (var i = 0; i < keys.length; i++) {
          obj[keys[i]] = values[i];
        }
        return obj;
      }
      module.exports = VerticalTable;
    }
  });

  // src/scrapers/ancestry-record.js
  var require_ancestry_record = __commonJS({
    "src/scrapers/ancestry-record.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:ancestry-record");
      var utils = require_utils2();
      var GedcomX = require_src();
      var HorizontalTable = require_HorizontalTable();
      var VerticalTable = require_VerticalTable();
      var urls = [
        utils.urlPatternToRegex("https://search.ancestry.(ca|co.uk|com|com.au)/cgi-bin/sse.dll*"),
        utils.urlPatternToRegex("https://search.ancestryinstitution.(ca|co.uk|com|com.au)/cgi-bin/sse.dll*"),
        utils.urlPatternToRegex("https://search.ancestrylibrary.(ca|com|com.au)/cgi-bin/sse.dll*"),
        utils.urlPatternToRegex("https://www.ancestry.com/discoveryui-content/view/*")
      ];
      var eventsConfig = [
        {
          type: "http://gedcomx.org/Birth",
          date: /^(birth year|birth date|born)$/,
          place: /^(birth ?place)$/
        },
        {
          type: "http://gedcomx.org/Death",
          date: /^(death date|died)$/,
          place: /^(death place)$/
        },
        {
          type: "http://gedcomx.org/Immigration",
          date: /^arrival date$/,
          place: /^port of arrival$/
        },
        {
          type: "http://gedcomx.org/Emigration",
          date: /^departure date$/,
          place: /^port of departure/
        }
      ];
      var factsConfig = [
        // TODO: change to use race; https://github.com/FamilySearch/gedcomx/issues/295
        {
          regex: /^(color or )race$/,
          type: "http://gedcomx.org/Ethnicity"
        },
        {
          regex: /^ethnicity\/ nationality$/,
          type: "http://gedcomx.org/Ethnicity"
        },
        {
          label: "marital status",
          type: "http://gedcomx.org/MaritalStatus"
        },
        {
          label: "ssn",
          type: "http://gedcomx.org/NationalId"
        }
      ];
      module.exports = function(register) {
        register(urls, setup);
      };
      function setup(emitter) {
        debug("run");
        var dataTable, householdTable;
        dataTable = new HorizontalTable(document.getElementById("recordData"), {
          rowSelector: ".tableHorizontal > tbody > tr",
          labelMapper: function(label) {
            return label.toLowerCase().replace(/:$/, "");
          }
        });
        if (!dataTable.hasData()) {
          debug("no data");
          emitter.emit("noData");
          return;
        }
        if (dataTable.hasLabel("household members")) {
          householdTable = new VerticalTable(dataTable.getValue("household members"), {
            labelMapper: function(label) {
              return label.toLowerCase();
            },
            valueMapper: function(cell) {
              var a = cell.querySelector("a");
              return {
                text: cell.textContent.trim(),
                href: a ? a.href : ""
              };
            }
          });
        }
        var recordYear = getRecordYear();
        var gedx = new GedcomX(), primaryPerson = new GedcomX.Person({
          id: getRecordId(document.location.href),
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(document.location.href)
          }
        });
        gedx.addPerson(primaryPerson);
        dataTable.getText("name").trim().split(/\[|\]/g).forEach(function(name) {
          primaryPerson.addSimpleName(name.trim());
        });
        var givenName = dataTable.getText("given name"), surname = dataTable.getText("surname");
        if (givenName || surname) {
          var nameForm = GedcomX.NameForm();
          if (givenName) {
            nameForm.addPart({
              type: "http://gedcomx.org/Given",
              value: givenName.trim()
            });
          }
          if (surname) {
            nameForm.addPart({
              type: "http://gedcomx.org/Surname",
              value: surname.trim()
            });
          }
          primaryPerson.addName(GedcomX.Name().addNameForm(nameForm));
        }
        if (dataTable.hasMatch(/gender|sex/)) {
          var genderType = getGender(dataTable.getMatchText(/gender|sex/));
          if (genderType) {
            primaryPerson.setGender({
              type: genderType
            });
          }
        }
        eventsConfig.forEach(function(config) {
          var date = dataTable.getMatchText(config.date);
          var place = dataTable.getMatchText(config.place);
          if (date || place) {
            var fact = GedcomX.Fact({
              type: config.type
            });
            if (date) {
              fact.setDate({
                original: date
              });
            }
            if (place) {
              fact.setPlace({
                original: place
              });
            }
            primaryPerson.addFact(fact);
          }
        });
        dataTable.getLabelsMatch(/^(home|residence) in \d{4}$/).forEach(function(homeLabel) {
          var year = homeLabel.replace(/^(home|residence) in /, "");
          primaryPerson.addFact({
            type: "http://gedcomx.org/Residence",
            date: {
              original: year,
              formal: "+" + year
            },
            place: {
              original: dataTable.getText(homeLabel)
            }
          });
        });
        factsConfig.forEach(function(config) {
          if (config.label && dataTable.hasLabel(config.label)) {
            primaryPerson.addFact({
              type: config.type,
              value: dataTable.getText(config.label)
            });
          } else if (config.regex && dataTable.hasMatch(config.regex)) {
            primaryPerson.addFact({
              type: config.type,
              value: dataTable.getMatchText(config.regex)
            });
          }
        });
        if (dataTable.hasMatch(/^father('s)?/)) {
          var fathersName = dataTable.getMatchText(/^father('s)?( name)?$/);
          if (fathersName) {
            var father = gedx.addRelativeFromName(primaryPerson, fathersName, "Parent");
            if (dataTable.hasMatch(/^father('s)? (birthplace|place of birth)$/)) {
              father.addFact({
                type: "http://gedcomx.org",
                place: {
                  original: dataTable.getMatchText(/^father('s)? (birthplace|place of birth)$/)
                }
              });
            }
          }
        }
        if (dataTable.hasMatch(/^mother('s)?/)) {
          var mothersName = dataTable.getMatchText(/^mother('s)?( name)?$/);
          if (mothersName) {
            var mother = gedx.addRelativeFromName(primaryPerson, mothersName, "Parent");
            if (dataTable.hasMatch(/^mother('s)? (birthplace|place of birth)$/)) {
              mother.addFact({
                type: "http://gedcomx.org",
                place: {
                  original: dataTable.getMatchText(/^mother('s)? (birthplace|place of birth)$/)
                }
              });
            }
          }
        }
        if (dataTable.hasMatch(/^spouse('s)?/)) {
          var spouse = GedcomX.Person({
            id: gedx.generateId()
          });
          if (dataTable.hasMatch(/^spouse('s)?( name)?$/)) {
            spouse.addSimpleName(dataTable.getMatchText(/^spouse('s)?( name)?$/).trim());
          }
          if (dataTable.hasLabel("spouse gender")) {
            var spouseGender = getGender(dataTable.getText("spouse gender"));
            if (spouseGender) {
              spouse.setGender({
                type: spouseGender
              });
            }
          }
          gedx.addPerson(spouse);
          var coupleRel = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: primaryPerson,
            person2: spouse
          });
          gedx.addRelationship(coupleRel);
          var marriageDate = dataTable.getText("marriage date");
          var marriagePlace = dataTable.getText("marriage place");
          if (marriageDate || marriagePlace) {
            var marriage = GedcomX.Fact({
              type: "http://gedcomx.org/Marriage"
            });
            if (marriageDate) {
              marriage.setDate({
                original: marriageDate
              });
            }
            if (marriagePlace) {
              marriage.setPlace({
                original: marriagePlace
              });
            }
            coupleRel.addFact(marriage);
          }
        }
        if (dataTable.hasLabel("children")) {
          dataTable.getText("children").split("; ").forEach(function(name) {
            gedx.addRelativeFromName(primaryPerson, name, "Child");
          });
        }
        if (householdTable) {
          var householdPerson;
          householdTable.getRows().forEach(function(rowData) {
            if (rowData.name) {
              var name = GedcomX.Name.createFromString(rowData.name.text), existingPerson = gedx.findPersonByName(name), personId = getRecordId(rowData.name.href), identifiers = {
                "genscrape": getRecordIdentifier(rowData.name.href)
              };
              if (existingPerson) {
                gedx.updatePersonsID(existingPerson.id, personId);
                existingPerson.setIdentifiers(identifiers);
              } else {
                householdPerson = GedcomX.Person({
                  id: personId,
                  identifiers
                });
                householdPerson.addSimpleName(rowData.name.text);
                gedx.addPerson(householdPerson);
                existingPerson = householdPerson;
              }
              if (existingPerson !== primaryPerson) {
                var age = parseInt(rowData.age.text, 10);
                if (!isNaN(age) && recordYear) {
                  var estimatedBirthYear = recordYear - age;
                  existingPerson.addFact({
                    type: "http://gedcomx.org",
                    date: {
                      original: "about " + estimatedBirthYear,
                      formal: "A+" + estimatedBirthYear
                    }
                  });
                }
              }
            }
          });
        }
        if (dataTable.hasLabel("event type")) {
          var otherEventType = eventType(dataTable.getText("event type")), otherEventDate = dataTable.getText("event date"), otherEventPlace = dataTable.getText("event place");
          if (otherEventType) {
            var otherEvent = GedcomX.Fact({
              type: otherEventType
            });
            if (otherEventDate) {
              otherEvent.setDate({
                original: otherEventDate
              });
            }
            if (otherEventPlace) {
              otherEvent.setPlace({
                original: otherEventPlace
              });
            }
            if (otherEventType === "http://gedcomx.org/Marriage" && coupleRel) {
              coupleRel.addFact(otherEvent);
            } else {
              primaryPerson.addFact(otherEvent);
            }
          }
        }
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Ancestry"
        }).setHomepage({
          resource: "http://www.ancestry" + utils.getDomain()
        });
        gedx.addAgent(agent);
        var source = getSourceDescription();
        source.setRepository({
          resource: "#agent"
        });
        gedx.addSourceDescriptionToAll(source);
        debug("data");
        emitter.emit("data", gedx);
      }
      function getSourceDescription() {
        var description = GedcomX.SourceDescription().setAbout(document.location.href).addTitle({ value: getTitle() }).addCitation(getCitation());
        return description;
      }
      function getCitation() {
        return { value: document.querySelector(".sourceText").textContent.replace(/\s/g, " ").trim() };
      }
      function getRecordYear() {
        var title = getTitle();
        var matches = title.match(/\d{4}/g);
        if (matches.length === 1) {
          return parseInt(matches[0], 10);
        }
      }
      function getTitle() {
        return document.querySelector("h1").textContent.replace(/\s/g, " ").trim() || document.title.trim();
      }
      function getGender(gender) {
        switch (gender) {
          case "M":
          case "M (Male)":
          case "Male":
            return "http://gedcomx.org/Male";
          case "F":
          case "F (Female)":
          case "Female":
            return "http://gedcomx.org/Female";
        }
      }
      function eventType(type) {
        switch (type) {
          case "Marriage":
            return "http://gedcomx.org/Marriage";
        }
        console.log("ancestry-record: unknown event type: " + type);
      }
      function getRecordId(url) {
        if (url.indexOf("discoveryui-content") !== -1) {
          return url.split("/").pop().split(":")[0];
        } else {
          var params = utils.getQueryParams(url);
          return (params.dbid || params.db) + ":" + params.h;
        }
      }
      function getRecordIdentifier(url) {
        return "genscrape://ancestry:record/" + getRecordId(url);
      }
    }
  });

  // src/scrapers/ancestry-person.js
  var require_ancestry_person = __commonJS({
    "src/scrapers/ancestry-person.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:ancestry-person");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.ancestry.(ca|co.uk|com|com.au)/family-tree/person/tree/*/person/*"),
        utils.urlPatternToRegex("https://www.ancestryinstitution.(ca|co.uk|com|com.au)/family-tree/person/tree/*/person/*"),
        utils.urlPatternToRegex("https://www.ancestrylibrary.(ca|com|com.au)/family-tree/person/tree/*/person/*")
      ];
      var eventConfig = [
        {
          label: "birth",
          type: "http://gedcomx.org/Birth"
        },
        {
          label: "christening",
          type: "http://gedcomx.org/Christening"
        },
        {
          label: "death",
          type: "http://gedcomx.org/Death"
        },
        {
          label: "arrival",
          type: "http://gedcomx.org/Immigration"
        },
        {
          label: "departure",
          type: "http://gedcomx.org/Emigration"
        },
        {
          label: "residence",
          type: "http://gedcomx.org/Residence"
        }
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var factsUrl = window.location.pathname.split("/").slice(0, 7).join("/") + "/content/factsbody";
        debug("url: " + factsUrl);
        utils.getJSON(factsUrl, function(error, json) {
          debug("response");
          if (error) {
            debug("error");
            emitter.emit("error", error);
          } else {
            if (json.HasError) {
              debug(json.ErrorMessage);
              debug(json.FailurePoint);
              emitter.emit("error", json.ErrorMessage);
              return;
            }
            if (!json.html.body) {
              debug("no html");
              emitter.emit("noData");
              return;
            }
            process2(emitter, parseHTML(json.html.body));
          }
        });
      }
      function process2(emitter, $dom) {
        debug("processing");
        var gedx = new GedcomX(), primaryPerson = new GedcomX.Person({
          id: getRecordId(window.location.href),
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(window.location.href)
          }
        }), facts = FactsList($dom);
        gedx.addPerson(primaryPerson);
        if (facts.hasFact("gender")) {
          switch (facts.getFirstText("gender")) {
            case "Female":
              primaryPerson.setGender({
                type: "http://gedcomx.org/Female"
              });
              break;
            case "Male":
              primaryPerson.setGender({
                type: "http://gedcomx.org/Male"
              });
              break;
            case "Unknown":
              primaryPerson.setGender({
                type: "http://gedcomx.org/Unknown"
              });
              break;
          }
        }
        facts.getCardTitles("name").forEach(function(nameText) {
          primaryPerson.addSimpleName(nameText);
        });
        eventConfig.forEach(function(config) {
          if (facts.hasFact(config.label)) {
            facts.getGedXFacts(config.label, config.type).forEach(function(fact) {
              primaryPerson.addFact(fact);
            });
          }
        });
        var relLists = getRelLists($dom);
        relLists.parents.forEach(function($parentsList) {
          var $parents = $parentsList.querySelectorAll(".card"), $father = $parents[0], $mother = $parents[1], father, mother;
          if (!$father.classList.contains("cardEmpty")) {
            father = getPersonFromCard(gedx, $father);
            gedx.addPerson(father);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: father,
              person2: primaryPerson
            });
          }
          if (!$mother.classList.contains("cardEmpty")) {
            mother = getPersonFromCard(gedx, $mother);
            gedx.addPerson(mother);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: mother,
              person2: primaryPerson
            });
          }
          if (father && mother) {
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: father,
              person2: mother
            });
          }
        });
        relLists.spouses.forEach(function($spouseList) {
          var $children = Array.from($spouseList.querySelectorAll(".card")), $spouse = $children.shift(), spouse;
          if (!$spouse.classList.contains("cardEmpty")) {
            spouse = getPersonFromCard(gedx, $spouse);
            gedx.addPerson(spouse);
            var relationship = GedcomX.Relationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: spouse
            });
            gedx.addRelationship(relationship);
            var spouseName = spouse.getNames()[0].getNameForms()[0].getFullText();
            facts.getCards("marriage").forEach(function($marriage) {
              var $spouseName = $marriage.querySelector(".userPerson");
              if ($spouseName && $spouseName.textContent === spouseName) {
                relationship.addFact(cardToFact($marriage, "http://gedcomx.org/Marriage"));
              }
            });
          }
          $children.forEach(function($childCard) {
            var child = getPersonFromCard(gedx, $childCard);
            gedx.addPerson(child);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: child
            });
            if (spouse) {
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: spouse,
                person2: child
              });
            }
          });
        });
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Ancestry"
        }).setHomepage({
          resource: "http://www.ancestry" + utils.getDomain()
        });
        gedx.addAgent(agent);
        var fullNameText = primaryPerson.getNames()[0].getNameForms()[0].getFullText();
        var sourceDescription = GedcomX.SourceDescription().setAbout(window.document.location.href).addTitle({
          value: fullNameText + " - Ancestry Public Member Trees"
        }).addCitation({
          value: '"Public Member Trees", database, Ancestry.com (' + window.document.location.href + " : accessed " + utils.getDateString() + "), profile for " + fullNameText + "."
        }).setRepository({
          resource: "#agent"
        });
        gedx.addSourceDescriptionToAll(sourceDescription);
        emitter.emit("data", gedx);
      }
      function parseHTML(html) {
        return new window.DOMParser().parseFromString(html, "text/html").body;
      }
      function getPersonFromCard(gedx, $card) {
        var person = GedcomX.Person({
          id: getRecordId($card.href),
          identifiers: {
            "genscrape": getRecordIdentifier($card.href)
          }
        }).addSimpleName(getPersonName($card));
        var $lifespan = $card.querySelector(".userCardSubTitle");
        if ($lifespan) {
          var lifespanParts = $lifespan.textContent.trim().split("\u2013"), birthYear = lifespanParts[0], deathYear = lifespanParts[1];
          if (birthYear) {
            person.addFact({
              type: "http://gedcomx.org/Birth",
              date: {
                original: birthYear,
                formal: "+" + birthYear
              }
            });
          }
          if (deathYear) {
            person.addFact({
              type: "http://gedcomx.org/Death",
              date: {
                original: deathYear,
                formal: "+" + deathYear
              }
            });
          }
        }
        return person;
      }
      function getPersonName(card) {
        return firstChildText(card.querySelector(".userCardTitle"));
      }
      function firstChildText($element) {
        for (var i = 0; i < $element.childNodes.length; i++) {
          var curNode = $element.childNodes[i];
          if (curNode.nodeName === "#text") {
            return curNode.nodeValue.trim();
          }
        }
      }
      function cardToFact($card, factType) {
        var $date = $card.querySelector(".factItemDate"), date = $date ? utils.toTitleCase($date.textContent.trim()) : null, $place = $card.querySelector(".factItemLocation"), place = $place ? $place.textContent.trim() : null, fact = GedcomX.Fact({
          type: factType
        });
        if (date) {
          fact.setDate({
            original: date
          });
        }
        if (place) {
          fact.setPlace({
            original: place
          });
        }
        return fact;
      }
      function getRelLists($dom) {
        var lists = {
          // Right now Ancestry only shows one set of parents. We assume multiple
          // in case that changes in the future (it really should).
          "parents": [],
          // Since we only have one set of parents we also only have one set of siblings
          "siblings": [],
          // I don't know that we can do anything with half siblings
          "halfsiblings": [],
          // Spouses lists include children
          "spouses": []
        };
        var $familySection = $dom.querySelector("#familySection"), familyNodes = $familySection.querySelectorAll(".factsSubtitle, .researchList, .toggleSiblingsButton"), currentNode, listType = "parents";
        for (var i = 0; i < familyNodes.length; i++) {
          currentNode = familyNodes[i];
          if (currentNode.classList.contains("factsSubtitle")) {
            switch (currentNode.textContent.toLowerCase()) {
              case "parents":
                listType = "parents";
                break;
              case "half siblings":
                listType = "halfsiblings";
                break;
              case "spouse":
              case "spouse & children":
                listType = "spouses";
                break;
            }
          } else if (currentNode.classList.contains("toggleSiblingsButton")) {
            listType = "siblings";
          } else if (currentNode.classList.contains("researchList")) {
            lists[listType].push(currentNode);
          }
        }
        return lists;
      }
      function FactsList($dom) {
        var facts = {};
        Array.from($dom.querySelectorAll("#factsSection .LifeEvent")).forEach(function(card) {
          var name = firstChildText(card.querySelector(".userCardTitle")).trim().toLowerCase();
          if (typeof facts[name] === "undefined") {
            facts[name] = [];
          }
          facts[name].push(card);
        });
        return {
          /**
           * Get the DOM elements that represent the fact card for the given fact.
           * 
           * @param {String} factType
           * @returns {HTMLElement[]}
           */
          getCards: function(factType) {
            return facts[factType] || [];
          },
          /**
           * Get the titles of fact cards.
           * 
           * @param {String} factType
           * @returns {String[]}
           */
          getCardTitles: function(factType) {
            return this.getCards(factType).map(function(card) {
              return card.querySelector("h4.textWrap").textContent.trim();
            });
          },
          /**
           * Get text value of first matching card
           * 
           * @param {String} factType
           * @returns {String}
           */
          getFirstText: function(factType) {
            var card = this.getFirstCard(factType);
            if (card) {
              return card.querySelector("h4.textWrap").textContent.trim();
            }
          },
          /**
           * Get first matching card
           * 
           * @param {String} factType
           * @returns {HTMLElement}
           */
          getFirstCard: function(factType) {
            if (facts[factType]) {
              return facts[factType][0];
            }
          },
          /**
           * Check whether we have data for a given fact
           * 
           * @param {String} factType
           * @returns {Boolean}
           */
          hasFact: function(factType) {
            return typeof facts[factType] !== "undefined";
          },
          /**
           * Get GEDCOM X facts of the given type
           * 
           * @param {String} factType
           * @param {String} gedxType
           * @param {GedcomX.Fact[]}
           */
          getGedXFacts: function(factType, gedxType) {
            return this.getCards(factType).map(function(card) {
              return cardToFact(card, gedxType);
            });
          }
        };
      }
      function getRecordId(url) {
        var parts = url.split("/");
        return parts[6] + ":" + parts[8];
      }
      function getRecordIdentifier(url) {
        return "genscrape://ancestry:tree/person:" + getRecordId(url);
      }
    }
  });

  // src/scrapers/billiongraves.js
  var require_billiongraves = __commonJS({
    "src/scrapers/billiongraves.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:billiongraves");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://billiongraves.com/grave/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var json;
        try {
          json = JSON.parse(window.atob(document.getElementById("props").textContent));
        } catch (error) {
          debug("error parsing base64 encoded json");
          debug(error);
          emitter.emit("error", error);
          return;
        }
        var record = json.record, gedx = new GedcomX(), primaryPerson = GedcomX.Person({
          principal: true,
          id: record.record_id,
          identifiers: {
            "genscrape": getRecordIdentifier(record.record_id)
          }
        });
        gedx.addPerson(primaryPerson);
        primaryPerson.addSimpleName(record.fullname);
        if (dateAvailable(record.birth_date)) {
          primaryPerson.addFact({
            type: "http://gedcomx.org/Birth",
            date: {
              original: record.birth_date
            }
          });
        }
        if (dateAvailable(record.marriage_date)) {
          primaryPerson.addFact({
            type: "http://gedcomx.org/Marriage",
            date: {
              original: record.marriage_date
            }
          });
        }
        if (dateAvailable(record.death_date)) {
          var formalDeathDate;
          if (record.death_year) {
            formalDeathDate = "+" + record.death_year;
            if (record.death_month) {
              formalDeathDate += "-" + record.death_month;
              if (record.death_day) {
                formalDeathDate += "-" + record.death_day;
              }
            }
          }
          primaryPerson.addFact({
            type: "http://gedcomx.org/Death",
            date: {
              original: record.death_date,
              formal: formalDeathDate
            }
          });
        }
        if (json.cemetery) {
          var cemetery = json.cemetery;
          primaryPerson.addFact({
            type: "http://gedcomx.org/Burial",
            place: {
              // Construct a list of place name parts, filter empty values, and concatenate
              original: [
                cemetery.cemetery_name,
                cemetery.cemetery_city,
                cemetery.cemetery_county,
                cemetery.cemetery_state,
                cemetery.cemetery_country
              ].filter(function(part) {
                return !!part;
              }).join(", ")
            }
          });
        }
        record.relationships.forEach(function(relation) {
          var person = GedcomX.Person({
            id: relation.record_id,
            identifiers: {
              "genscrape": getRecordIdentifier(relation.record_id)
            }
          });
          person.addSimpleName(relation.fullname);
          if (dateAvailable(relation.birth_date)) {
            person.addFact({
              type: "http://gedcomx.org/Birth",
              date: {
                original: relation.birth_date
              }
            });
          }
          if (dateAvailable(relation.death_date)) {
            person.addFact({
              type: "http://gedcomx.org/Death",
              date: {
                original: relation.death_date
              }
            });
          }
          gedx.addPerson(person);
        });
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "BillionGraves"
        }).setHomepage({
          resource: "https://billiongraves.com"
        });
        gedx.addAgent(agent);
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: document.title + " (" + window.document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        debug("data", gedx);
        emitter.emit("data", gedx);
      }
      function dateAvailable(date) {
        return date !== "Not Available";
      }
      function getRecordIdentifier(recordId) {
        return "genscrape://billiongraves/" + recordId;
      }
    }
  });

  // src/scrapers/familysearch-record.js
  var require_familysearch_record = __commonJS({
    "src/scrapers/familysearch-record.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:familysearch-record");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.familysearch.org/pal:/MM9.1.1/*"),
        utils.urlPatternToRegex("https://www.familysearch.org/ark:/61903/1:1:*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("running");
        utils.getJSON(window.location.href, { Accept: "application/x-fs-v1+json" }, function(error, json) {
          if (error) {
            debug("error");
            emitter.emit("error", error);
          } else {
            debug("data");
            var gedx = GedcomX(json);
            var url = document.location.origin + document.location.pathname;
            if (/\/pal:\//.test(url)) {
              url = url.replace("/pal:/MM9.1.1/", "/ark:/61903/1:1:");
            }
            gedx.getPersons().forEach(function(person) {
              var identifiers = person.getIdentifiers();
              identifiers.addValue("genscrape://familysearch:record/" + person.getId(), "genscrape");
            });
            gedx.addAgent(GedcomX.Agent().setId("agent").addName({
              lang: "en",
              value: "FamilySearch"
            }).setHomepage({
              resource: "http://familysearch.org"
            }));
            gedx.getPersons().forEach(function(person) {
              var identifiers = person.getIdentifiers(), ark;
              if (identifiers) {
                ark = identifiers.getValues("http://gedcomx.org/Persistent")[0];
                if (ark && normalizeArk(ark) === normalizeArk(url)) {
                  person.setPrincipal(true);
                } else {
                  person.setPrincipal();
                }
                if (ark) {
                  gedx.getSourceDescriptions().forEach(function(sourceDescription) {
                    if (sourceDescription.getAbout() === ark) {
                      person.addSource({
                        description: "#" + sourceDescription.getId()
                      });
                      sourceDescription.setRepository({
                        resource: "#agent"
                      });
                    }
                  });
                }
              }
            });
            emitter.emit("data", gedx);
          }
        });
      }
      function normalizeArk(url) {
        return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[?#].*$/, "");
      }
    }
  });

  // src/scrapers/familysearch-ancestor.js
  var require_familysearch_ancestor = __commonJS({
    "src/scrapers/familysearch-ancestor.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:familysearch-ancestor");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.familysearch.org/tree/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var path = window.location.pathname;
        window.setInterval(function() {
          debug("polling");
          if (window.location.pathname !== path) {
            path = window.location.pathname;
            debug("new path " + path);
            processUrl(emitter);
          }
        }, 100);
        processUrl(emitter);
      }
      function processUrl(emitter) {
        debug("processUrl");
        if (window.location.pathname.indexOf("/tree/person/") === 0) {
          var personId = window.location.pathname.split("/")[4];
          if (personId) {
            debug("personId", personId);
            getPersonAndRelationships(personId, function(error, json) {
              if (error) {
                debug("error");
                emitter.emit("error", error);
              } else {
                debug("data");
                var gedx = GedcomX(json), descriptionRef = gedx.getDescription();
                if (descriptionRef) {
                  gedx.getPersons().forEach(function(person) {
                    if (person.getId() === personId) {
                      person.addSource({
                        description: descriptionRef
                      });
                      person.setPrincipal(true);
                    }
                  });
                }
                gedx.getPersons().forEach(function(person) {
                  var identifiers = person.getIdentifiers();
                  identifiers.addValue("genscrape://familysearch:tree/person:" + person.getId(), "genscrape");
                });
                var agent = GedcomX.Agent({
                  id: "agent",
                  names: [{
                    lang: "en",
                    value: "FamilySearch Family Tree"
                  }],
                  homepage: {
                    resource: "https://familysearch.org/tree"
                  }
                });
                gedx.addAgent(agent);
                var description = gedx.getSourceDescriptions().filter(function(d) {
                  return d.getId() === descriptionRef.substring(1);
                })[0];
                if (description) {
                  description.setRepository({
                    resource: "#agent"
                  });
                }
                emitter.emit("data", gedx);
              }
            });
          } else {
            emitter.emit("noData");
            debug("no personId");
          }
        } else {
          emitter.emit("noData");
          debug("not in person view");
        }
      }
      function getPersonAndRelationships(personId, callback) {
        debug("getPersonAndRelationships: " + personId);
        utils.getJSON("https://www.familysearch.org/platform/tree/persons/" + personId + "?relatives", {
          "X-FS-Feature-Tag": "consolidate-redundant-resources"
        }, callback);
      }
    }
  });

  // src/scrapers/findagrave.js
  var require_findagrave = __commonJS({
    "src/scrapers/findagrave.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:findagrave");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.findagrave.com/cgi-bin/fg.cgi*"),
        utils.urlPatternToRegex("https://findagrave.com/cgi-bin/fg.cgi*")
      ];
      module.exports = function(register) {
        register(urls, function(emitter) {
          var page = utils.getQueryParams()["page"];
          if (page === "gr" || page === "sh") {
            run(emitter);
          } else {
            emitter.emit("noMatch");
          }
        });
      };
      function run(emitter) {
        debug("run");
        var gedx = GedcomX(), primaryPerson = GedcomX.Person({
          principal: true,
          id: getMemorialId(document.location.href),
          identifiers: {
            "genscrape": getMemorialIdentifier(document.location.href)
          }
        });
        gedx.addPerson(primaryPerson);
        primaryPerson.addName(getName());
        primaryPerson.addFact(getFact("http://gedcomx.org/Birth", 1, 2));
        primaryPerson.addFact(getFact("http://gedcomx.org/Death", 2, 2));
        primaryPerson.addFact(burialFact());
        var family = getFamilyLinks();
        family.parents.forEach(function(parent) {
          gedx.addPerson(parent);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: parent,
            person2: primaryPerson
          });
        });
        family.spouses.forEach(function(spouse) {
          gedx.addPerson(spouse);
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: primaryPerson,
            person2: spouse
          });
        });
        family.children.forEach(function(child) {
          gedx.addPerson(child);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: primaryPerson,
            person2: child
          });
        });
        family.siblings.forEach(function(sibling) {
          gedx.addPerson(sibling);
        });
        var agent = GedcomX.Agent({
          id: "agent",
          names: [{
            lang: "en",
            value: "Find A Grave"
          }],
          homepage: {
            resource: "https://www.findagrave.com"
          }
        });
        gedx.addAgent(agent);
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: "Find A Grave, database and images (http://findagrave.com : accessed " + utils.getDateString() + "), memorial #" + getMemorialId(document.location.href) + " for " + document.title + "."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        debug("data");
        emitter.emit("data", gedx);
      }
      function getName() {
        var result = xpath([
          "/html/body/table/tbody/tr/td[3]/table/tbody/tr[1]/td/font",
          "/html/body/table/tbody/tr/td[2]/table/tbody/tr[1]/td/font"
        ]);
        if (result) {
          var nameText = result.textContent.replace("[Edit]");
          var suffix, parts = nameText.split(",");
          if (parts.length > 1) {
            suffix = parts[1];
            nameText = parts[0];
          }
          parts = utils.splitName(nameText);
          var nameForm = {
            parts: [
              {
                type: "http://gedcomx.org/Given",
                value: parts[0]
              },
              {
                type: "http://gedcomx.org/Surname",
                value: parts[1]
              }
            ]
          };
          if (suffix) {
            nameForm.parts.push({
              type: "http://gedcomx.org/Suffix",
              value: suffix
            });
          }
          return GedcomX.Name().addNameForm(nameForm);
        }
      }
      function getFact(type, row, cell) {
        var $cell = bodyXpath(row, cell), parts, date, place, fact;
        if ($cell) {
          parts = $cell.innerHTML.replace(/<a.+<\/a>/, "").trim().split("<br>");
          if (parts.length === 1) {
            if (/\d{4}/.test(parts[0])) {
              date = parts[0];
            }
          } else if (parts.length >= 2) {
            date = parts.shift();
            place = parts.join(", ");
          }
          if (date || place) {
            fact = {
              type
            };
            if (date) {
              fact.date = {
                original: date
              };
            }
            if (place) {
              fact.place = {
                original: place
              };
            }
            return GedcomX.Fact(fact);
          }
        }
      }
      function getFamilyLinks() {
        var family = {
          parents: [],
          spouses: [],
          siblings: [],
          children: []
        }, bioCell = bodyXpath(3, 1), familyLinks = false, relType, currentNode, currentText, currentNodeName;
        for (var i = 0; i < bioCell.childNodes.length; i++) {
          currentNode = bioCell.childNodes[i];
          currentText = currentNode.textContent.trim();
          if (!currentText) {
            continue;
          }
          if (familyLinks) {
            if (currentText === "[Edit]") {
              continue;
            } else if (currentText === "Parents:") {
              relType = "parents";
              continue;
            } else if (currentText === "Spouse:" || currentText === "Spouses:") {
              relType = "spouses";
              continue;
            } else if (currentText === "Children:") {
              relType = "children";
              continue;
            } else if (currentText === "Sibling:") {
              relType = "siblings";
              continue;
            }
            if (currentText === "*Calculated relationship") {
              break;
            }
            currentNodeName = currentNode.nodeName;
            if (currentNodeName === "A" || currentNodeName === "FONT") {
              family[relType].push(processFamilyLink(currentText, currentNode.href));
            }
          } else if (currentText.indexOf("Family links:") === 0) {
            familyLinks = true;
          }
        }
        return family;
      }
      function processFamilyLink(linkText, url) {
        var matches = linkText.match(/^([\w\s\.]+)( \((\w{4}) - (\w{4})\))?$/);
        if (matches) {
          var data = {
            name: matches[1],
            birthYear: matches[3],
            deathYear: matches[4]
          };
          return GedcomX.Person().addSimpleName(data.name).setId(getMemorialId(url)).setIdentifiers({
            "genscrape": getMemorialIdentifier(url)
          }).addFact(familyLinkFact("http://gedcomx.org/Birth", data.birthYear)).addFact(familyLinkFact("http://gedcomx.org/Death", data.deathYear));
        } else {
          console.error("Find A Grave: Unable to parse family link: " + linkText);
        }
      }
      function familyLinkFact(type, date) {
        if (parseInt(date, 10)) {
          return {
            type,
            date: {
              original: date,
              formal: "+" + date
            }
          };
        }
      }
      function burialFact() {
        var burialCell = bodyXpath(5, 1), burialParts = [], text;
        if (burialCell) {
          Array.from(burialCell.childNodes).forEach(function(node, i) {
            text = node.textContent.trim();
            if (text.indexOf("Plot:") !== -1) {
              return;
            }
            if (text) {
              switch (text) {
                case "Burial:":
                case "[Edit]":
                case "[Add Plot]":
                case "[Edit Plot]":
                  break;
                default:
                  burialParts.push(text);
              }
            }
          });
        }
        if (burialParts.length) {
          return new GedcomX.Fact({
            type: "http://gedcomx.org/Burial",
            place: {
              original: burialParts.join(", ").trim()
            }
          });
        }
      }
      function bodyXpath(row, cell) {
        return xpath([
          "/html/body/table/tbody/tr/td[3]/table/tbody/tr[3]/td[1]/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[" + row + "]/td[" + cell + "]",
          "/html/body/table/tbody/tr/td[3]/table/tbody/tr[4]/td[1]/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[" + row + "]/td[" + cell + "]",
          "/html/body/table/tbody/tr/td[3]/table/tbody/tr[5]/td[1]/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[" + row + "]/td[" + cell + "]"
        ]);
      }
      function xpath(paths) {
        var result;
        for (var i = 0; i < paths.length; i++) {
          result = document.evaluate(paths[i], document, null, window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          if (result.snapshotLength) {
            return result.snapshotItem(0);
          }
        }
      }
      function getMemorialId(url) {
        return utils.getQueryParams(url).GRid;
      }
      function getMemorialIdentifier(url) {
        return "genscrape://findagrave/memorial:" + getMemorialId(url);
      }
    }
  });

  // src/scrapers/findagrave-new.js
  var require_findagrave_new = __commonJS({
    "src/scrapers/findagrave-new.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:findagrave-new");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://new.findagrave.com/memorial/*"),
        utils.urlPatternToRegex("https://new.findagrave.com/cemetery/online/*"),
        // The new site isn't live yet. We're just assuming this will be the URL
        // when it goes live. Trying to be proactive so that we don't have to rollout
        // a quick fix when the new site does finally go live. The two new.findagrave
        // URLs above can be removed after the new site is live. - 31 Oct 2017
        utils.urlPatternToRegex("https://www.findagrave.com/memorial/*"),
        utils.urlPatternToRegex("https://www.findagrave.com/cemetery/online/*")
      ];
      module.exports = function(register) {
        register(urls, function(emitter) {
          run(emitter);
        });
      };
      function run(emitter) {
        debug("run");
        var gedx = GedcomX(), primaryPerson = GedcomX.Person({
          principal: true,
          id: getMemorialId(document.location.href),
          identifiers: {
            "genscrape": getMemorialIdentifier(document.location.href)
          }
        });
        gedx.addPerson(primaryPerson);
        primaryPerson.addName(getName());
        primaryPerson.addFact(getBirthFact());
        primaryPerson.addFact(getDeathFact());
        primaryPerson.addFact(getBurialFact());
        var family = getRelativeGroups();
        if (family.parents) {
          family.parents.forEach(function(parent) {
            gedx.addPerson(parent);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: parent,
              person2: primaryPerson
            });
          });
        }
        if (family.spouse) {
          family.spouse.forEach(function(spouse) {
            gedx.addPerson(spouse);
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: spouse
            });
          });
        }
        if (family.spouses) {
          family.spouses.forEach(function(spouse) {
            gedx.addPerson(spouse);
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: spouse
            });
          });
        }
        if (family.children) {
          family.children.forEach(function(child) {
            gedx.addPerson(child);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: child
            });
          });
        }
        if (family.siblings) {
          family.siblings.forEach(function(sibling) {
            gedx.addPerson(sibling);
          });
        }
        if (family["half siblings"]) {
          family["half siblings"].forEach(function(sibling) {
            gedx.addPerson(sibling);
          });
        }
        var agent = GedcomX.Agent({
          id: "agent",
          names: [{
            lang: "en",
            value: "Find A Grave"
          }],
          homepage: {
            resource: "https://www.findagrave.com"
          }
        });
        gedx.addAgent(agent);
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: collapseWhitespace(document.getElementById("citationInfo").textContent)
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        debug("data");
        emitter.emit("data", gedx);
      }
      function getName() {
        var h1 = document.getElementById("bio-name");
        if (h1) {
          var nameText = h1.textContent.trim();
          var suffix, parts = nameText.split(",");
          if (parts.length > 1) {
            suffix = parts[1];
            nameText = parts[0];
          }
          parts = utils.splitName(nameText);
          var nameForm = {
            parts: [
              {
                type: "http://gedcomx.org/Given",
                value: parts[0]
              },
              {
                type: "http://gedcomx.org/Surname",
                value: parts[1]
              }
            ]
          };
          if (suffix) {
            nameForm.parts.push({
              type: "http://gedcomx.org/Suffix",
              value: suffix
            });
          }
          return GedcomX.Name().addNameForm(nameForm);
        }
      }
      function getBirthFact() {
        var date = document.getElementById("birthDateLabel"), place = document.getElementById("birthLocationLabel");
        if (date || place & date.textContent !== "unknown") {
          var birth = {
            type: "http://gedcomx.org/Birth"
          };
          if (date) {
            birth.date = {
              original: date.textContent.trim()
            };
          }
          if (place) {
            birth.place = {
              original: place.textContent.trim()
            };
          }
          return birth;
        }
      }
      function getDeathFact() {
        var date = document.getElementById("deathDateLabel"), place = document.getElementById("deathLocationLabel");
        if (date || place & date.textContent !== "unknown") {
          var death = {
            type: "http://gedcomx.org/Death"
          };
          if (date) {
            death.date = {
              original: date.textContent.trim()
            };
          }
          if (place) {
            death.place = {
              original: place.textContent.trim()
            };
          }
          return death;
        }
      }
      function getBurialFact() {
        var burialRow = document.querySelector('[itemtype="https://schema.org/Cemetery"]'), cemeteryName = burialRow.querySelector(".info"), placeName = burialRow.querySelector(".place");
        if (placeName || cemeteryName) {
          var burialParts = [];
          if (cemeteryName) {
            burialParts.push(cemeteryName.textContent);
          }
          if (placeName) {
            burialParts.push(placeName.textContent);
          }
          return new GedcomX.Fact({
            type: "http://gedcomx.org/Burial",
            place: {
              original: collapseWhitespace(burialParts.join(", "))
            }
          });
        }
      }
      function getRelativeGroups() {
        return Array.from(document.querySelectorAll(".data-family .data-filled-user.row .col-sm-6")).reduce(function(groups, column) {
          Array.from(column.querySelectorAll("b.label-relation")).forEach(function(label) {
            var labelText = label.textContent;
            var list = label.nextElementSibling;
            if (list) {
              groups[labelText.toLowerCase()] = Array.from(list.querySelectorAll("li")).map(processRelative);
            }
          });
          return groups;
        }, {});
      }
      function processRelative(item) {
        var name = item.querySelector("#familyNameLabel").textContent.replace("*", "").trim();
        var url = item.querySelector("a").href;
        var birthLabel = item.querySelector("#familyBirthLabel");
        var deathLabel = item.querySelector("#familyDeathLabel");
        return GedcomX.Person().addSimpleName(name).setId(getMemorialId(url)).setIdentifiers({
          "genscrape": getMemorialIdentifier(url)
        }).addFact(relativeFact("http://gedcomx.org/Birth", birthLabel ? birthLabel.textContent : null)).addFact(relativeFact("http://gedcomx.org/Death", deathLabel ? deathLabel.textContent : null));
      }
      function relativeFact(type, date) {
        if (parseInt(date, 10)) {
          return {
            type,
            date: {
              original: date,
              formal: "+" + date
            }
          };
        }
      }
      function getMemorialId(url) {
        return url.match(/\d+/)[0];
      }
      function getMemorialIdentifier(url) {
        return "genscrape://findagrave/memorial:" + getMemorialId(url);
      }
      function collapseWhitespace(text) {
        if (text) {
          return text.trim().replace(/\s\s+/g, " ");
        }
      }
    }
  });

  // src/scrapers/findmypast-record.js
  var require_findmypast_record = __commonJS({
    "src/scrapers/findmypast-record.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:findmypast-record");
      var utils = require_utils2();
      var GedcomX = require_src();
      var HorizontalTable = require_HorizontalTable();
      var VerticalTable = require_VerticalTable();
      var urls = [
        /^http:\/\/search\.findmypast\.(co\.uk|com|ie|com\.au)\/record/
      ];
      var simpleFacts = [
        {
          type: "http://gedcomx.org/MaritalStatus",
          label: "marital status"
        },
        {
          type: "http://gedcomx.org/Occupation",
          label: "occupation"
        },
        {
          type: "http://gedcomx.org/Residence",
          label: "residence"
        },
        {
          type: "http://gedcomx.org/Nationality",
          label: "nationality"
        }
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        var transcriptionDisplayTable = document.getElementById("transcriptionDisplayTable");
        if (!transcriptionDisplayTable) {
          debug("no data table");
          emitter.emit("noData");
          return;
        }
        var gedx = GedcomX(), primaryPerson = GedcomX.Person({
          principal: true,
          id: getRecordId(document.location.href),
          identifiers: {
            "genscrape": getRecordIdentifier(document.location.href)
          }
        }), dataFields = new HorizontalTable(transcriptionDisplayTable, {
          labelMapper: function(label) {
            return label.toLowerCase();
          }
        });
        gedx.addPerson(primaryPerson);
        primaryPerson.addNameFromParts({
          "http://gedcomx.org/Given": processName(dataFields.getText("first name(s)")),
          "http://gedcomx.org/Surname": processName(dataFields.getText("last name"))
        });
        primaryPerson.setGender(getGender(dataFields.getFirstText(["sex", "gender"])));
        simpleFacts.forEach(function(config) {
          var text = dataFields.getText(config.label);
          if (text && text !== "-") {
            primaryPerson.addFact({
              type: config.type,
              value: dataFields.getText(config.label)
            });
          }
        });
        primaryPerson.addFact(getBirth(dataFields));
        primaryPerson.addFact(getDeath(dataFields));
        primaryPerson.addFact(getBurial(dataFields));
        primaryPerson.addFact(getBaptism(dataFields));
        primaryPerson.addFact(getEmigration(dataFields));
        primaryPerson.addFact(getImmigration(dataFields));
        var individualsTable = document.getElementById("individuals"), primaryRelationship = dataFields.getText("relationship"), siblings = [], head, headsWife, householdData;
        if (individualsTable) {
          householdData = new VerticalTable(individualsTable, {
            rowSelector: "tr:not(.highlight-individual)",
            // Skip primary person
            labelMapper: function(label) {
              return label.toLowerCase().trim();
            },
            valueMapper: function(cell) {
              var link = cell.querySelector("a");
              var text = cell.textContent;
              if (link) {
                return link.href;
              } else {
                return text && text !== "-" ? text : void 0;
              }
            }
          });
          householdData.getRows().forEach(function(row) {
            var householdPerson = getHouseholdPerson(row);
            gedx.addPerson(householdPerson);
            if (row["relationship"] === "Self") {
              row["relationship"] = "Head";
            }
            switch (primaryRelationship + ":" + row["relationship"]) {
              case "Head:Wife":
              case "Wife:Head":
                gedx.addRelationship({
                  type: "http://gedcomx.org/Couple",
                  person1: primaryPerson,
                  person2: householdPerson
                });
                break;
              case "Head:Daughter":
              case "Head:Son":
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: primaryPerson,
                  person2: householdPerson
                });
                break;
              case "Daughter:Head":
              case "Son:Head":
                head = householdPerson;
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: householdPerson,
                  person2: primaryPerson
                });
                break;
              case "Son:Son":
              case "Son:Daughter":
              case "Daughter:Son":
              case "Daughter:Daughter":
                siblings.push(householdPerson);
                break;
              case "Son:Wife":
              case "Daughter:Wife":
                headsWife = householdPerson;
                break;
            }
          });
          if (head) {
            siblings.forEach(function(sibling) {
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: head,
                person2: sibling
              });
            });
          }
          if (head && headsWife) {
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: head,
              person2: headsWife
            });
          }
        } else {
          var father = getFather(dataFields);
          if (father) {
            gedx.addPerson(father);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: father,
              person2: primaryPerson
            });
          }
          var mother = getMother(dataFields);
          if (mother) {
            gedx.addPerson(mother);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: mother,
              person2: primaryPerson
            });
          }
          var spouse = getSpouse(dataFields), coupleRel;
          if (spouse) {
            gedx.addPerson(spouse);
            coupleRel = GedcomX.Relationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: spouse
            });
            gedx.addRelationship(coupleRel);
            var spousesFather = getSpousesFather(dataFields), spousesMother = getSpousesMother(dataFields);
            if (spousesFather) {
              gedx.addPerson(spousesFather);
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: spousesFather,
                person2: spouse
              });
            }
            if (spousesMother) {
              gedx.addPerson(spousesMother);
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: spousesMother,
                person2: spouse
              });
            }
          }
          var marriage = getMarriage(dataFields);
          if (marriage) {
            if (spouse) {
              coupleRel.addFact(marriage);
            } else {
              primaryPerson.addFact(marriage);
            }
          }
        }
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "findmypast"
        }).setHomepage({
          resource: "http://www.findmypast" + utils.getDomain()
        });
        gedx.addAgent(agent);
        var fullNameText = primaryPerson.getNames()[0].getNameForms()[0].getFullText(), collectionTitle = dataFields.getText("record set");
        var sourceDescription = GedcomX.SourceDescription().setAbout(window.document.location.href).addTitle({
          value: fullNameText + " in " + collectionTitle
        }).addCitation({
          value: collectionTitle + ", database, findmypast (" + window.document.location.href + " : accessed " + utils.getDateString() + "), entry for " + fullNameText + "."
        }).setRepository({
          resource: "#agent"
        });
        gedx.addSourceDescriptionToAll(sourceDescription);
        debug("data", gedx);
        emitter.emit("data", gedx);
      }
      function getBirth(data) {
        return getFact(data, "http://gedcomx.org/Birth", getBirthDate, getBirthPlace);
      }
      function getBaptism(data) {
        var baptism = getFact(data, "http://gedcomx.org/Baptism", getBaptismDate, getBaptismPlace);
        if (baptism && baptism.getDate()) {
          return baptism;
        }
      }
      function getDeath(data) {
        return getFact(data, "http://gedcomx.org/Death", getDeathDate, getDeathPlace);
      }
      function getBurial(data) {
        return getFact(data, "http://gedcomx.org/Burial", getBurialDate, function(data2) {
        });
      }
      function getMarriage(data) {
        return getFact(data, "http://gedcomx.org/Marriage", getMarriageDate, getMarriagePlace);
      }
      function getEmigration(data) {
        return getFact(data, "http://gedcomx.org/Emigration", getEmigrationDate, getEmigrationPlace);
      }
      function getImmigration(data) {
        return getFact(data, "http://gedcomx.org/Immigration", getImmigrationDate, getImmigrationPlace);
      }
      function getFact(data, type, dateFunc, placeFunc) {
        var date = dateFunc(data), place = placeFunc(data), fact;
        if (date === "-") {
          date = void 0;
        }
        if (place === "-") {
          place = void 0;
        }
        if (date || place) {
          fact = GedcomX.Fact({
            type
          });
          if (date) {
            fact.setDate({
              original: date
            });
          }
          if (place) {
            fact.setPlace({
              original: place
            });
          }
          return fact;
        }
      }
      function getBirthDate(data) {
        var year = data.getText("birth year"), month = data.getText("birth month"), day = data.getText("birth day");
        return processDate(year, month, day);
      }
      function getBirthPlace(data) {
        var simple = data.getFirstText(["birth place", "birth state", "birth county"]);
        if (simple) {
          return simple;
        }
        if (data.getText("subcategory") === "Births & baptisms") {
          return getPlace(data);
        }
      }
      function getBaptismDate(data) {
        return processDate(
          data.getText("baptism year"),
          data.getText("baptism month"),
          data.getText("baptism day")
        );
      }
      function getBaptismPlace(data) {
        var simple = data.getText("baptism place");
        if (simple) {
          return simple;
        }
        if (data.getText("subcategory") === "Births & baptisms") {
          return getPlace(data);
        }
      }
      function getDeathDate(data) {
        var year = data.getText("death year"), month = data.getText("death month"), day = data.getText("death day");
        return processDate(year, month, day);
      }
      function getDeathPlace(data) {
        var simple = data.getFirstText(["death place", "death state"]);
        if (simple) {
          return simple;
        }
        if (data.getText("subcategory") === "Deaths & burials") {
          return getPlace(data);
        }
      }
      function getBurialDate(data) {
        return processDate(
          data.getText("burial year"),
          data.getText("burial month"),
          data.getText("burial day")
        );
      }
      function getMarriageDate(data) {
        var year = data.getText("marriage year"), month = data.getText("marriage month"), day = data.getText("marriage day");
        return processDate(year, month, day);
      }
      function getMarriagePlace(data) {
        var simple = data.getFirstText(["marriage place", "marriage state"]);
        if (simple) {
          return simple;
        }
        if (data.getText("subcategory") === "Marriages & divorces") {
          return getPlace(data);
        }
      }
      function getEmigrationDate(data) {
        return processDate(
          data.getText("departure year"),
          data.getText("departure month"),
          data.getText("departure day")
        );
      }
      function getEmigrationPlace(data) {
        return data.getText("departure port");
      }
      function getImmigrationDate(data) {
        return data.getText("arrival year");
      }
      function getImmigrationPlace(data) {
        return data.getFirstText([
          "arrival place",
          "destination",
          "destination port",
          "destination country"
        ]);
      }
      function getFather(data) {
        return getPerson(data, "father's first name(s)", "father's last name") || getPerson(data, "groom's father's first name(s)", "groom's father's last name");
      }
      function getMother(data) {
        return getPerson(data, "mother's first name(s)", "mother's last name");
      }
      function getSpouse(data) {
        var spouse = getPerson(data, "spouse's first name(s)", "spouse's last name");
        if (data.hasLabel("spouse's sex")) {
          spouse.setGender(getGender(data.getText("spouse's sex")));
        }
        return spouse;
      }
      function getSpousesFather(data) {
        return getPerson(data, "spouse's father's first name(s)", "spouse's father's last name") || getPerson(data, "bride's father's first name(s)", "bride's father's last name");
      }
      function getSpousesMother(data) {
        return getPerson(data, "spouse's mother's first name(s)", "spouse's mother's last name");
      }
      function getPerson(data, givenNameLabel, surnameLabel) {
        var givenName = processName(data.getText(givenNameLabel)), surname = processName(data.getText(surnameLabel));
        if (givenName || surname) {
          return GedcomX.Person().addNameFromParts({
            "http://gedcomx.org/Given": givenName,
            "http://gedcomx.org/Surname": surname
          });
        }
      }
      function getGender(genderText) {
        var genderType;
        switch (genderText) {
          case "Male":
            genderType = "http://gedcomx.org/Male";
            break;
          case "Female":
            genderType = "http://gedcomx.org/Female";
            break;
        }
        if (genderType) {
          return GedcomX.Gender({
            type: genderType
          });
        }
      }
      function getHouseholdPerson(data) {
        var person = GedcomX.Person({
          id: getRecordId(data[""]),
          identifiers: {
            "genscrape": getRecordIdentifier(data[""])
          }
        });
        person.addNameFromParts({
          "http://gedcomx.org/Given": data["first name(s)"],
          "http://gedcomx.org/Surname": data["last name"]
        });
        person.setGender(getGender(data["sex"] || data["gender"]));
        if (data["birth year"] || data["birth place"]) {
          var birth = GedcomX.Fact({
            type: "http://gedcomx.org/Birth"
          });
          if (data["birth year"]) {
            birth.setDate({
              original: data["birth year"]
            });
          }
          if (data["birth place"]) {
            birth.setPlace({
              original: data["birth place"]
            });
          }
        }
        if (data["occupation"]) {
          person.addFact({
            type: "http://gedcomx.org/Occupation",
            value: data["occupation"]
          });
        }
        if (data["marital status"]) {
          person.addFact({
            type: "http://gedcomx.org/MaritalStatus",
            value: data["marital status"]
          });
        }
        return person;
      }
      function getPlace(data) {
        var town = data.getFirstText(["place", "district", "town", "residence town", "parish"]), county = data.getText("county"), state = data.getFirstText(["state", "residence state"]), country = data.getText("country");
        return [town, state, county, country].filter(function(a) {
          return !!a && a !== "-";
        }).map(function(a) {
          return utils.toTitleCase(a);
        }).join(", ");
      }
      function processDate(year, month, day) {
        if (year === "-") {
          year = void 0;
        }
        if (month === "-") {
          month = void 0;
        }
        if (day === "-") {
          day = void 0;
        }
        if (year) {
          if (month && day) {
            return day + " " + month + " " + year;
          } else {
            return year;
          }
        }
      }
      function processName(name) {
        debug("processName:" + name);
        if (!name || name === "-") {
          return;
        } else {
          return utils.toTitleCase(name);
        }
      }
      function getRecordId(url) {
        return decodeURIComponent(utils.getQueryParams(url).id).replace(/\//g, ":");
      }
      function getRecordIdentifier(url) {
        return "genscrape://findmypast:record/" + getRecordId(url);
      }
    }
  });

  // src/scrapers/findmypast-tree.js
  var require_findmypast_tree = __commonJS({
    "src/scrapers/findmypast-tree.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:findmypast-tree");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^http:\/\/tree\.findmypast\.(co\.uk|com|ie|com\.au)/
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        window.onhashchange = function() {
          processHash(emitter);
        };
        processHash(emitter);
      }
      function processHash(emitter) {
        debug("processHash");
        var urlParts = window.location.hash.split("/"), treeId = urlParts[2], personId = parseInt(urlParts[3], 10);
        debug("hash: " + window.location.hash);
        debug("treeId: " + treeId);
        debug("personId: " + personId);
        if (personId) {
          getRelations(treeId, personId, function(error, data) {
            if (error) {
              emitter.emit("error", error);
            } else if (data && data.Object) {
              debug("relations data");
              emitter.emit("data", processData(treeId, personId, data.Object));
            } else {
              emitter.emit("noData");
              debug("no relation Object");
            }
          });
        } else {
          emitter.emit("noData");
          debug("not focused on a person");
        }
      }
      function processData(treeId, personId, data) {
        var relations = new Relations(data, treeId), gedx = new GedcomX(), primaryPerson = relations.getGedxPerson(personId);
        primaryPerson.setPrincipal(true);
        gedx.addPerson(primaryPerson);
        relations.getFamilies(personId).forEach(function(family) {
          var spouseId = family.FatherId === personId ? family.MotherId : family.FatherId, spouse = relations.getGedxPerson(spouseId);
          gedx.addPerson(spouse);
          var relationship = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: primaryPerson,
            person2: spouse
          });
          if (family.MarriageDate || family.MarriagePlace) {
            var marriage = GedcomX.Fact({
              type: "http://gedcomx.org/Marriage"
            }).setDate(gedxDate(family.MarriageDate));
            if (family.MarriagePlace) {
              marriage.setPlace({
                original: family.MarriagePlace
              });
            }
            relationship.addFact(marriage);
          }
          gedx.addRelationship(relationship);
          relations.getChildren(family.Id).forEach(function(childRef) {
            var child = relations.getGedxPerson(childRef.ChildId);
            gedx.addPerson(child);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: child
            });
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: spouse,
              person2: child
            });
          });
        });
        relations.getChildRefs(personId).map(function(childRef) {
          return relations.getFamily(childRef.FamilyId);
        }).forEach(function(family) {
          var father = relations.getGedxPerson(family.FatherId), mother = relations.getGedxPerson(family.MotherId);
          gedx.addPerson(father);
          gedx.addPerson(mother);
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: father,
            person2: mother
          });
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: father,
            person2: primaryPerson
          });
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: mother,
            person2: primaryPerson
          });
          relations.getChildren(family.Id).forEach(function(childRef) {
            if (childRef.ChildId === personId) {
              return;
            }
            var child = relations.getGedxPerson(childRef.ChildId);
            gedx.addPerson(child);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: father,
              person2: child
            });
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: mother,
              person2: child
            });
          });
        });
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "findmypast"
        }).setHomepage({
          resource: "http://www.findmypast" + utils.getDomain()
        });
        gedx.addAgent(agent);
        var fullNameText = primaryPerson.getNames()[0].getNameForms()[0].getFullText();
        var sourceDescription = GedcomX.SourceDescription().setAbout(window.document.location.href).addTitle({
          value: fullNameText + " - " + data.Title + " - findmypast Family Tree"
        }).addCitation({
          value: '"' + data.Title + ' - findmypast Family Tree" (' + window.document.location.href + " : accessed " + utils.getDateString() + "), profile for " + fullNameText + "."
        }).setRepository({
          resource: "#agent"
        });
        gedx.addSourceDescriptionToAll(sourceDescription);
        return gedx;
      }
      function processPerson(person, treeId) {
        var gedxPerson = GedcomX.Person().setId(person.Id + "").setIdentifiers({
          "genscrape": "genscrape://findmypast:tree/" + treeId + ":person:" + person.Id
        }).setGender({
          type: person.Gender === 1 ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female"
        }).addNameFromParts({
          "http://gedcomx.org/Given": person.GivenNames,
          "http://gedcomx.org/Surname": person.Surnames
        });
        if (person.BirthDate || person.BirthPlace) {
          var birth = GedcomX.Fact({
            type: "http://gedcomx.org/Birth"
          }).setDate(gedxDate(person.BirthDate));
          if (person.BirthPlace) {
            birth.setPlace({
              original: person.BirthPlace
            });
          }
          gedxPerson.addFact(birth);
        }
        if (person.DeathDate || person.DeathPlace) {
          var death = GedcomX.Fact({
            type: "http://gedcomx.org/Death"
          }).setDate(gedxDate(person.DeathDate));
          if (person.DeathPlace) {
            death.setPlace({
              original: person.DeathPlace
            });
          }
          gedxPerson.addFact(death);
        }
        return gedxPerson;
      }
      function getRelations(treeId, personId, callback) {
        return api(treeId, "api/familytree/getfamilytree?familytreeview=ProfileRelations&personId=" + personId, callback);
      }
      function api(treeId, url, callback) {
        debug("api request: " + url);
        utils.getJSON("/api/proxy/get?url=" + encodeURIComponent(url), {
          "Family-Tree-Ref": treeId
        }, callback);
      }
      function convertDate(dateInt) {
        if (dateInt) {
          var dateString = "" + dateInt, year = dateString.substr(0, 4), month = dateString.substr(4, 2), day = dateString.substr(6, 2);
          if (month === "00" || day === "00") {
            return year;
          } else {
            return year + "-" + month + "-" + day;
          }
        }
      }
      function gedxDate(dateInt) {
        if (dateInt) {
          var dateString = convertDate(dateInt);
          return GedcomX.Date({
            original: dateString,
            formal: "+" + dateString
          });
        }
      }
      var Relations = function(data, treeId) {
        this.data = data;
        this.treeId = treeId;
        this.gedxPersons = {};
      };
      Relations.prototype.getPerson = function(personId) {
        return utils.find(this.data.Persons, function(person) {
          return person.Id === personId;
        });
      };
      Relations.prototype.getGedxPerson = function(personId) {
        if (!this.gedxPersons[personId]) {
          var personData = this.getPerson(personId), person = processPerson(personData, this.treeId);
          this.gedxPersons[personId] = person;
        }
        return this.gedxPersons[personId];
      };
      Relations.prototype.getFamily = function(familyId) {
        return utils.find(this.data.Familys, function(family) {
          return family.Id === familyId;
        });
      };
      Relations.prototype.getFamilies = function(personId) {
        return this.data.Familys.filter(function(family) {
          return family.FatherId === personId || family.MotherId === personId;
        });
      };
      Relations.prototype.getChildren = function(familyId) {
        return this.data.Childs.filter(function(child) {
          return child.FamilyId === familyId;
        });
      };
      Relations.prototype.getChildRefs = function(personId) {
        return this.data.Childs.filter(function(child) {
          return child.ChildId === personId;
        });
      };
    }
  });

  // src/schema.js
  var require_schema = __commonJS({
    "src/schema.js"(exports, module) {
      var schema = module.exports = {};
      schema.queryPropContent = function($element, name) {
        var $prop = schema.queryProp($element, name);
        return $prop ? $prop.content : "";
      };
      schema.queryPropContentDeep = function($element, name) {
        var $prop = schema.queryPropDeep($element, name);
        return $prop ? $prop.content : "";
      };
      schema.queryPropDeep = function($element, name) {
        if ($element && Array.isArray(name)) {
          var i = 0;
          do {
            $element = schema.queryProp($element, name[i]);
          } while (++i < name.length && $element);
          return $element;
        }
      };
      schema.queryProp = function($element, name) {
        if ($element) {
          return $element.querySelector('[itemprop="' + name + '"]');
        }
      };
      schema.queryPropAll = function($element, name) {
        return Array.from($element.querySelectorAll('[itemprop="' + name + '"]'));
      };
      schema.queryItem = function($element, type) {
        return $element.querySelector('[itemtype="' + type + '"]');
      };
      schema.queryItemAll = function($element, type) {
        return $element.querySelectorAll('[itemtype="' + type + '"]');
      };
    }
  });

  // src/scrapers/genealogieonline.js
  var require_genealogieonline = __commonJS({
    "src/scrapers/genealogieonline.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:genealogieonline");
      var utils = require_utils2();
      var GedcomX = require_src();
      var schema = require_schema();
      var urls = [
        utils.urlPatternToRegex("https://www.genealogieonline.nl/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $schemaPerson = document.querySelector('[itemtype="http://schema.org/Person"]');
        if ($schemaPerson) {
          debug("schema person");
          var gedx = new GedcomX(), primaryPerson = queryPerson($schemaPerson);
          primaryPerson.setPrincipal(true);
          primaryPerson.setId(getRecordId(document.location.href));
          primaryPerson.setIdentifiers({
            "genscrape": getRecordIdentifier(document.location.href)
          });
          gedx.addPerson(primaryPerson);
          schema.queryPropAll($schemaPerson, "spouse").map(queryPerson).forEach(function(spouse) {
            gedx.addPerson(spouse);
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: spouse
            });
          });
          schema.queryPropAll($schemaPerson, "parent").map(queryPerson).forEach(function(parent) {
            gedx.addPerson(parent);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: parent,
              person2: primaryPerson
            });
          });
          schema.queryPropAll($schemaPerson, "children").map(queryPerson).forEach(function(child) {
            gedx.addPerson(child);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: child
            });
          });
          gedx.addAgent(GedcomX.Agent().setId("agent").addName({
            lang: "en",
            value: "Genealogie Online"
          }).setHomepage({
            resource: "https://www.genealogieonline.nl"
          }));
          gedx.addSourceDescriptionToAll({
            about: document.location.href,
            titles: [
              {
                value: document.title
              }
            ],
            citations: [
              {
                value: document.title + " (" + window.document.location.href + " : accessed " + utils.getDateString() + ")"
              }
            ],
            repository: {
              resource: "#agent"
            }
          });
          emitter.emit("data", gedx);
        } else {
          emitter.emit("noData");
        }
      }
      function queryPerson($element) {
        var url = schema.queryPropContent($element, "url"), givenName = schema.queryPropContent($element, "givenName"), familyName = schema.queryPropContent($element, "familyName"), person = GedcomX.Person({
          id: getRecordId(url),
          identifiers: {
            "genscrape": getRecordIdentifier(url)
          }
        });
        if (givenName || familyName) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": givenName,
            "http://gedcomx.org/Surname": familyName
          });
        } else {
          person.addSimpleName(schema.queryPropContent($element, "name"));
        }
        var gender = schema.queryPropContent($element, "gender");
        switch (gender) {
          case "male":
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            break;
          case "female":
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            break;
        }
        person.addFact(queryEvent($element, "birth", "http://gedcomx.org/Birth"));
        person.addFact(queryEvent($element, "death", "http://gedcomx.org/Death"));
        return person;
      }
      function queryEvent($element, event, type) {
        var birthPlace = schema.queryPropContentDeep($element, [event + "Place", "address", "addressLocality"]);
        var birthDate = schema.queryPropContent($element, event + "Date");
        if (birthPlace || birthDate) {
          var birth = GedcomX.Fact({
            type
          });
          if (birthPlace) {
            birth.setPlace({
              original: birthPlace
            });
          }
          if (birthDate) {
            birth.setDate({
              original: birthDate
            });
          }
          return birth;
        }
      }
      function getRecordId(url) {
        return url.split("/").pop().split(".")[0];
      }
      function getRecordIdentifier(url) {
        return "genscrape://genealogieonline/" + getRecordId(url);
      }
    }
  });

  // src/scrapers/openarch.js
  var require_openarch = __commonJS({
    "src/scrapers/openarch.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:openarch");
      var utils = require_utils2();
      var GedcomX = require_src();
      var schema = require_schema();
      var urls = [
        utils.urlPatternToRegex("https://www.openarch.nl/show*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        var $record = schema.queryItem(document, "http://historical-data.org/HistoricalRecord"), $schemaPersons = Array.from(schema.queryItemAll(document, "http://schema.org/Person"));
        debug("persons: " + $schemaPersons.length);
        if ($record && $schemaPersons.length) {
          var gedx = new GedcomX();
          var recordType = schema.queryPropContent($record, "type");
          debug("recordType: " + recordType);
          switch (recordType) {
            // Marriage (2 persons, possible both with parents)
            case "BS Huwelijk":
            case "DTB Trouwen":
              processCoupleEvent(gedx, $record, $schemaPersons);
              break;
            // Baptism, Birth, Burial, Death (1 person, possible with parents)
            case "DTB Dopen":
            case "BS Geboorte":
            case "DTB Begraven":
            case "BS Overlijden":
              processPersonEvent(gedx, $record, $schemaPersons);
              break;
            // Just process the first person
            default:
              var primaryPerson = queryPerson(gedx, $schemaPersons[0]);
              primaryPerson.setPrincipal(true);
              gedx.addPerson(primaryPerson);
              break;
          }
          gedx.addAgent(GedcomX.Agent().setId("agent").addName({
            lang: "en",
            value: "Open Archives"
          }).setHomepage({
            resource: "https://www.openarch.nl"
          }));
          var title = schema.queryPropContent($record, "name");
          gedx.addSourceDescriptionToAll({
            about: document.location.href,
            titles: [
              {
                value: title
              }
            ],
            citations: [
              {
                value: title + " (" + window.document.location.href + " : accessed " + utils.getDateString() + ")"
              }
            ],
            repository: {
              resource: "#agent"
            }
          });
          emitter.emit("data", gedx);
        } else {
          emitter.emit("noData");
        }
      }
      function processCoupleEvent(gedx, $record, $schemaPersons) {
        var groomsFather, groomsMother, groom, bride, bridesFather, bridesMother;
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          groomsFather = queryPerson(gedx, $schemaPersons.shift());
        }
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          groomsMother = queryPerson(gedx, $schemaPersons.shift());
        }
        groom = queryPerson(gedx, $schemaPersons.shift());
        bride = queryPerson(gedx, $schemaPersons.shift());
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          bridesFather = queryPerson(gedx, $schemaPersons.shift());
        }
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          bridesMother = queryPerson(gedx, $schemaPersons.shift());
        }
        gedx.addPerson(groom);
        if (groomsFather) {
          gedx.addPerson(groomsFather);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: groomsFather,
            person2: groom
          });
        }
        if (groomsMother) {
          gedx.addPerson(groomsMother);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: groomsMother,
            person2: groom
          });
        }
        gedx.addPerson(bride);
        var couple = GedcomX.Relationship({
          type: "http://gedcomx.org/Couple",
          person1: groom,
          person2: bride
        });
        var marriageDate = schema.queryPropContent($record, "date");
        if (marriageDate) {
          couple.addFact({
            type: "http://gedcomx.org/Marriage",
            date: {
              original: marriageDate
            }
          });
        }
        gedx.addRelationship(couple);
        if (bridesFather) {
          gedx.addPerson(bridesFather);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: bridesFather,
            person2: groom
          });
        }
        if (bridesMother) {
          gedx.addPerson(bridesMother);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: bridesMother,
            person2: groom
          });
        }
      }
      function processPersonEvent(gedx, $record, $schemaPersons) {
        var father, mother, child;
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          father = queryPerson(gedx, $schemaPersons.shift());
        }
        if ($schemaPersons[0].getAttribute("itemprop") === "parent") {
          mother = queryPerson(gedx, $schemaPersons.shift());
        }
        child = queryPerson(gedx, $schemaPersons.shift());
        child.setPrincipal(true);
        gedx.addPerson(child);
        if (father) {
          gedx.addPerson(father);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: father,
            person2: child
          });
        }
        if (mother) {
          gedx.addPerson(mother);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: mother,
            person2: child
          });
        }
      }
      function queryPerson(gedx, $element) {
        var person = GedcomX.Person({
          id: getRecordId(gedx, document.location.href)
        });
        person.setIdentifiers({
          "genscrape": getRecordIdentifier(person.getId())
        });
        var givenName = schema.queryPropContent($element, "givenName"), familyName = schema.queryPropContent($element, "familyName");
        if (givenName || familyName) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": givenName,
            "http://gedcomx.org/Surname": familyName
          });
        } else {
          person.addSimpleName(schema.queryPropContent($element, "name"));
        }
        var gender = schema.queryPropContent($element, "gender");
        switch (gender) {
          case "male":
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            break;
          case "female":
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            break;
        }
        person.addFact(queryEvent($element, "birth", "http://gedcomx.org/Birth"));
        person.addFact(queryEvent($element, "death", "http://gedcomx.org/Death"));
        return person;
      }
      function queryEvent($element, event, type) {
        var birthPlace = schema.queryPropContent($element, event + "Place");
        var birthDate = schema.queryPropContent($element, event + "Date");
        if (birthPlace || birthDate) {
          var birth = GedcomX.Fact({
            type
          });
          if (birthPlace) {
            birth.setPlace({
              original: birthPlace
            });
          }
          if (birthDate) {
            birth.setDate({
              original: birthDate
            });
          }
          return birth;
        }
      }
      function getRecordId(gedx, url) {
        var params = utils.getQueryParams(url);
        return params.archive + ":" + params.identifier + ":" + gedx.generateId();
      }
      function getRecordIdentifier(id) {
        return "genscrape://openarch/" + id;
      }
    }
  });

  // src/scrapers/werelate.js
  var require_werelate = __commonJS({
    "src/scrapers/werelate.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:werela");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.werelate.org/wiki/Person:*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var factTypes = {
        "Unknown": "http://werelate.org/Unknown",
        "Birth": "http://gedcomx.org/Birth",
        "Alt Birth": "http://gedcomx.org/Birth",
        "Burial": "http://gedcomx.org/Burial",
        "Alt Burial": "http://gedcomx.org/Burial",
        "Christening": "http://gedcomx.org/Christening",
        "Alt Christening": "http://gedcomx.org/Christening",
        "Death": "http://gedcomx.org/Death",
        "Alt Death": "http://gedcomx.org/Death",
        "Adoption": "http://gedcomx.org/Adoption",
        "Ancestral File Number": "http://werelate.org/AncestralFileNumber",
        "Baptism": "http://gedcomx.org/Baptism",
        "Bar Mitzvah": "http://gedcomx.org/BarMitzvah",
        "Bat Mitzvah": "http://gedcomx.org/BatMitzvah",
        "Blessing": "http://gedcomx.org/Blessing",
        "Caste": "http://gedcomx.org/Caste",
        "Cause of Death": "http://werelate.org/CauseOfDeath",
        "Census": "http://gedcomx.org/Census",
        "Citizenship": "http://werelate.org/Citizenship",
        "Confirmation": "http://gedcomx.org/Confirmation",
        "Cremation": "http://gedcomx.org/Cremation",
        "Degree": "http://gedcomx.org/Education",
        "DNA": "http://werelate.org/DNA",
        "Education": "http://gedcomx.org/Education",
        "Emigration": "http://gedcomx.org/Emigration",
        "Employment": "http://gedcomx.org/Occupation",
        "Excommunication": "http://gedcomx.org/Excommunication",
        "First Communion": "http://gedcomx.org/FirstCommunion",
        "Funeral": "http://gedcomx.org/Funeral",
        "Graduation": "http://gedcomx.org/Education",
        "Illness": "http://werelate.org/Illness",
        "Immigration": "http://gedcomx.org/Immigration",
        "Living": "http://gedcomx.org/Living",
        "Medical": "http://gedcomx.org/Medical",
        "Military": "http://gedcomx.org/MilitaryService",
        "Mission": "http://gedcomx.org/Mission",
        "Namesake": "http://gedcomx.org/Namesake",
        "Nationality": "http://gedcomx.org/Nationality",
        "Naturalization": "http://gedcomx.org/Naturalization",
        "Obituary": "http://werelate.org/Obituary",
        "Occupation": "http://gedcomx.org/Occupation",
        "Ordination": "http://gedcomx.org/Ordination",
        "Pension": "http://werelate.org/Pension",
        "Physical Description": "http://gedcomx.org/PhysicalDescription",
        "Probate": "http://gedcomx.org/Probate",
        "Property": "http://gedcomx.org/Property",
        "Reference Number": "http://werelate.org/ReferenceNumber",
        "Religion": "http://gedcomx.org/Religion",
        "Residence": "http://gedcomx.org/Residence",
        "Retirement": "http://gedcomx.org/Retirement",
        "Soc Sec No": "http://gedcomx.org/NationalId",
        "Stillborn": "http://gedcomx.org/Stillbirth",
        "Title (nobility)": "http://werelate.org/TitleOfNobility",
        "Will": "http://gedcomx.org/Will",
        "Distribution List": "http://werelate.org/AfricanAmerican/Distribution List",
        "Emancipation": "http://werelate.org/AfricanAmerican/Emancipation",
        "Escape or Runaway": "http://werelate.org/AfricanAmerican/Escape or Runaway",
        "Estate Inventory": "http://werelate.org/AfricanAmerican/Estate Inventory",
        "Estate Settlement": "http://werelate.org/AfricanAmerican/Estate Settlement",
        "First Appearance": "http://werelate.org/AfricanAmerican/First Appearance",
        "Freedmen's Bureau": "http://werelate.org/AfricanAmerican/Freedmen's Bureau",
        "Hired Away": "http://werelate.org/AfricanAmerican/Hired Away",
        "Homestead": "http://werelate.org/AfricanAmerican/Homestead",
        "Household List": "http://werelate.org/AfricanAmerican/Household List",
        "Plantation Journal": "http://werelate.org/AfricanAmerican/Plantation Journal",
        "Purchase": "http://werelate.org/AfricanAmerican/Purchase",
        "Recapture": "http://werelate.org/AfricanAmerican/Recapture",
        "Relocation": "http://werelate.org/AfricanAmerican/Relocation",
        "Sale": "http://werelate.org/AfricanAmerican/Sale",
        "Slave List": "http://werelate.org/AfricanAmerican/Slave List",
        "Other": "http://werelate.org/Other"
      };
      function run(emitter) {
        debug("run");
        var gedx = GedcomX(), primaryPerson = GedcomX.Person({
          principal: true,
          id: getRecordId(document.location.href),
          identifiers: {
            "genscrape": getRecordIdentifier(document.location.href)
          }
        });
        gedx.addPerson(primaryPerson);
        var facts = [];
        Array.from(document.querySelectorAll(".wr-infotable-factsevents tr")).forEach(function(row) {
          var label = utils.maybe(row.querySelector("span.wr-infotable-type")).textContent;
          if (label) {
            facts.push({
              label: label.trim(),
              row
            });
          }
        });
        facts.forEach(function(factInfo) {
          var row = factInfo.row, label = factInfo.label, dateCell = row.children[1], placeCell = row.children[2];
          switch (label) {
            case "Name":
              primaryPerson.addSimpleName(dateCell.textContent.trim());
              break;
            case "Gender":
              switch (dateCell.textContent.trim()) {
                case "Male":
                  primaryPerson.setGender({
                    type: "http://gedcomx.org/Male"
                  });
                  break;
                case "Female":
                  primaryPerson.setGender({
                    type: "http://gedcomx.org/Female"
                  });
                  break;
              }
              break;
            // Most facts will have a date and a place
            default:
              if (row.children.length === 3) {
                var type = factTypes[label], date = dateCell.textContent, place = utils.maybe(placeCell.querySelector("span.wr-infotable-place")).textContent, value = utils.maybe(placeCell.querySelector("span.wr-infotable-desc")).textContent;
                if (type) {
                  var fact = GedcomX.Fact({
                    type
                  });
                  if (date) {
                    fact.setDate({
                      original: date
                    });
                  }
                  if (place) {
                    fact.setPlace({
                      original: place
                    });
                  }
                  if (value) {
                    fact.setValue(value);
                  }
                  primaryPerson.addFact(fact);
                }
              }
          }
        });
        Array.from(document.querySelectorAll(".wr-infobox-parentssiblings")).forEach(function(family) {
          var parents = family.querySelector("ul"), children = family.querySelector("ol"), marriage = family.querySelector(".wr-infobox-event"), parent1Label = parentLabel(parents.children[0]), mother, father;
          if (parent1Label === "F") {
            father = processPerson(parents.children[0], "http://gedcomx.org/Male");
            mother = processPerson(parents.children[1], "http://gedcomx.org/Female");
          } else {
            father = processPerson(parents.children[1], "http://gedcomx.org/Male");
            mother = processPerson(parents.children[0], "http://gedcomx.org/Female");
          }
          if (father) {
            gedx.addPerson(father);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: father,
              person2: primaryPerson
            });
          }
          if (mother) {
            gedx.addPerson(mother);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: mother,
              person2: primaryPerson
            });
          }
          if (father && mother) {
            var couple = GedcomX.Relationship({
              type: "http://gedcomx.org/Couple",
              person1: father,
              person2: mother
            });
            if (marriage) {
              couple.addFact({
                type: "http://gedcomx.org/Marriage",
                date: {
                  original: utils.maybe(marriage.querySelector(".wr-infobox-date")).textContent
                }
              });
            }
            gedx.addRelationship(couple);
          }
          Array.from(children.children).forEach(function(child) {
            if (child.querySelector(".selflink")) {
              return;
            }
            child = processPerson(child);
            gedx.addPerson(child);
            if (father) {
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: father,
                person2: child
              });
            }
            if (mother) {
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: mother,
                person2: child
              });
            }
          });
        });
        Array.from(document.querySelectorAll(".wr-infobox-spousechildren")).forEach(function(family) {
          var parents = family.querySelector("ul"), children = family.querySelector("ol"), marriage = family.querySelector(".wr-infobox-event"), parent1Label = parentLabel(parents.children[0]), parent2Label = parentLabel(parents.children[1]), spouse, spouseLabel, couple;
          if (parents.children[0].querySelector(".selflink")) {
            spouse = processPerson(parents.children[1]);
            spouseLabel = parent2Label;
          } else {
            spouse = processPerson(parents.children[0]);
            spouseLabel = parent1Label;
          }
          spouse.setGender({
            type: spouseLabel === "H" ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female"
          });
          gedx.addPerson(spouse);
          couple = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: primaryPerson,
            person2: spouse
          });
          if (marriage) {
            couple.addFact({
              type: "http://gedcomx.org/Marriage",
              date: {
                original: utils.maybe(marriage.querySelector(".wr-infobox-date")).textContent
              }
            });
          }
          gedx.addRelationship(couple);
          if (children) {
            Array.from(children.children).forEach(function(child) {
              child = processPerson(child);
              gedx.addPerson(child);
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: primaryPerson,
                person2: child
              });
              gedx.addRelationship({
                type: "http://gedcomx.org/ParentChild",
                person1: spouse,
                person2: child
              });
            });
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "WeRelate"
        }).setHomepage({
          resource: "https://www.werelate.org"
        }));
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: document.title + ", WeRelate.org (" + window.document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function parentLabel(parent) {
        if (parent) {
          return utils.maybe(parent.querySelector(".wr-infobox-label")).textContent;
        }
      }
      function processPerson(element, gender) {
        if (element) {
          var a = element.querySelector("a"), href = a ? a.href : "", person = GedcomX.Person({
            id: getRecordId(href),
            identifiers: {
              "genscrape": getRecordIdentifier(href)
            }
          }).addSimpleName(element.querySelector(".wr-infobox-fullname a").textContent), yearRange = utils.maybe(element.querySelector(".wr-infobox-yearrange")).textContent || " - ", yearRangeParts = yearRange.split(" - ");
          if (yearRangeParts[0]) {
            person.addFact({
              type: "http://gedcomx.org/Birth",
              date: {
                original: yearRangeParts[0]
              }
            });
          }
          if (yearRangeParts[1]) {
            person.addFact({
              type: "http://gedcomx.org/Death",
              date: {
                original: yearRangeParts[1]
              }
            });
          }
          if (gender) {
            person.setGender({
              type: gender
            });
          }
          return person;
        }
      }
      function getRecordId(url) {
        return decodeURIComponent(url.split("/").pop().split(":")[1]).replace(/\(|\)/g, "");
      }
      function getRecordIdentifier(url) {
        return "genscrape://werelate/person:" + url.split("/").pop().split(":")[1];
      }
    }
  });

  // src/scrapers/wikitree.js
  var require_wikitree = __commonJS({
    "src/scrapers/wikitree.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:wikitree");
      var utils = require_utils2();
      var GedcomX = require_src();
      var schema = require_schema();
      var urls = [
        utils.urlPatternToRegex("https://www.wikitree.com/wiki/*-*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var prefixes = [
        "dr",
        "dr.",
        "president",
        "general"
      ];
      var suffixes = [
        "jr",
        "jr.",
        "sr",
        "sr.",
        "iii"
      ];
      function run(emitter) {
        debug("run");
        var $schemaPersons = Array.from(schema.queryItemAll(document, "http://schema.org/Person"));
        debug("persons: " + $schemaPersons.length);
        if ($schemaPersons.length) {
          var gedx = GedcomX(), primaryPerson = processPrimaryPerson($schemaPersons.shift());
          primaryPerson.setPrincipal(true);
          primaryPerson.setId(getRecordId(document.location.href));
          primaryPerson.setIdentifiers({
            "genscrape": getRecordIdentifier(document.location.href)
          });
          gedx.addPerson(primaryPerson);
          $schemaPersons.forEach(function($relative) {
            var relative = processPerson($relative);
            if (relative) {
              gedx.addPerson(relative);
              switch ($relative.getAttribute("itemprop")) {
                case "parent":
                  gedx.addRelationship({
                    type: "http://gedcomx.org/ParentChild",
                    person1: relative,
                    person2: primaryPerson
                  });
                  break;
                case "spouse":
                  gedx.addRelationship({
                    type: "http://gedcomx.org/Couple",
                    person1: primaryPerson,
                    person2: relative
                  });
                  break;
                case "children":
                  gedx.addRelationship({
                    type: "http://gedcomx.org/ParentChild",
                    person1: primaryPerson,
                    person2: relative
                  });
                  break;
              }
            }
          });
          gedx.addAgent(GedcomX.Agent().setId("agent").addName({
            lang: "en",
            value: "WikiTree"
          }).setHomepage({
            resource: "https://www.wikitree.com"
          }));
          gedx.addSourceDescriptionToAll({
            about: document.location.href,
            titles: [
              {
                value: document.title
              }
            ],
            citations: [
              {
                value: document.title + " (" + window.document.location.href + " : accessed " + utils.getDateString() + ")"
              }
            ],
            repository: {
              resource: "#agent"
            }
          });
          emitter.emit("data", gedx);
        } else {
          emitter.emit("noData");
        }
      }
      function processPrimaryPerson($person) {
        var person = GedcomX.Person().addNameFromParts({
          "http://gedcomx.org/Prefix": utils.maybe(schema.queryProp($person, "honorificPrefix")).textContent,
          "http://gedcomx.org/Given": utils.maybe(schema.queryProp($person, "givenName")).textContent,
          "http://gedcomx.org/Surname": schema.queryPropContent($person, "familyName"),
          "http://gedcomx.org/Suffix": utils.maybe(schema.queryProp($person, "honorificSuffix")).textContent
        });
        var gender = schema.queryPropContent($person, "gender");
        switch (gender) {
          case "male":
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            break;
          case "female":
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            break;
        }
        person.addFact(processEvent($person, "birth", "http://gedcomx.org/Birth"));
        person.addFact(processEvent($person, "death", "http://gedcomx.org/Death"));
        return person;
      }
      function processPerson($person) {
        var $name = schema.queryProp($person, "name"), name = $name ? $name.textContent : null, url = $person.querySelector("a").href;
        if (name) {
          var person = GedcomX.Person({
            id: getRecordId(url),
            identifiers: {
              "genscrape": getRecordIdentifier(url)
            }
          });
          processName(person, name);
          return person;
        }
      }
      function processEvent($element, event, type) {
        var $birthPlace = schema.queryProp($element, event + "Place");
        var $birthAddress = $birthPlace ? schema.queryProp($birthPlace, "address") : null;
        var $birthDate = schema.queryProp($element, event + "Date");
        if ($birthAddress || $birthDate) {
          var birth = GedcomX.Fact({
            type
          });
          if ($birthAddress) {
            birth.setPlace({
              original: $birthAddress.textContent
            });
          }
          if ($birthDate) {
            birth.setDate({
              original: $birthDate.textContent
            });
          }
          return birth;
        }
      }
      function processName(person, name) {
        var partsList = name.split(" "), prefix, potentialPrefix, suffix, potentialSuffix, givenName, familyName, maidenName, i;
        potentialPrefix = partsList[0].toLowerCase();
        for (i = 0; i < prefixes.length; i++) {
          if (prefixes[i] === potentialPrefix) {
            prefix = partsList.shift();
            break;
          }
        }
        potentialSuffix = partsList[partsList.length - 1].toLowerCase();
        for (i = 0; i < suffixes.length; i++) {
          if (suffixes[i] === potentialSuffix) {
            suffix = partsList.pop();
            break;
          }
        }
        for (i = 0; i < partsList.length; i++) {
          if (/^\([^)]+\)$/.test(partsList[i])) {
            maidenName = partsList[i].slice(1, -1);
            partsList.splice(i, 1);
            break;
          }
        }
        if (partsList.length === 0) {
        } else if (partsList.length === 1) {
          givenName = partsList[0];
        } else {
          familyName = partsList.pop();
          givenName = partsList.join(" ");
        }
        if (maidenName) {
          person.addNameFromParts({
            "http://gedcomx.org/Prefix": prefix,
            "http://gedcomx.org/Given": givenName,
            "http://gedcomx.org/Surname": maidenName,
            "http://gedcomx.org/Suffix": suffix
          });
        }
        person.addNameFromParts({
          "http://gedcomx.org/Prefix": prefix,
          "http://gedcomx.org/Given": givenName,
          "http://gedcomx.org/Surname": familyName,
          "http://gedcomx.org/Suffix": suffix
        });
      }
      function getRecordId(url) {
        return url.split("/").pop();
      }
      function getRecordIdentifier(url) {
        return "genscrape://wikitree/person:" + getRecordId(url);
      }
    }
  });

  // src/scrapers/myheritage-record.js
  var require_myheritage_record = __commonJS({
    "src/scrapers/myheritage-record.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:myheritage-record");
      var utils = require_utils2();
      var GedcomX = require_src();
      var HorizontalTable = require_HorizontalTable();
      var VerticalTable = require_VerticalTable();
      var urls = [
        utils.urlPatternToRegex("https://www.myheritage.com/research/record-*")
      ];
      var events = [
        {
          regex: /^birth$/,
          type: "http://gedcomx.org/Birth"
        },
        {
          regex: /^christening$/,
          type: "http://gedcomx.org/Christening"
        },
        {
          regex: /^marriage$/,
          type: "http://gedcomx.org/Marriage"
        },
        {
          regex: /^immigration$/,
          type: "http://gedcomx.org/Immigration"
        },
        {
          regex: /^residence$/,
          type: "http://gedcomx.org/Residence"
        },
        {
          regex: /^death$/,
          type: "http://gedcomx.org/Death"
        },
        {
          regex: /^burial$/,
          type: "http://gedcomx.org/Burial"
        }
      ];
      var facts = [
        {
          regex: /^race$/,
          type: "http://gedcomx.org/Race"
        },
        {
          regex: /^marital status$/,
          type: "http://gedcomx.org/MaritalStatus"
        },
        {
          regex: /^ethnicity$/,
          type: "http://gedcomx.org/Ethnicity"
        },
        {
          regex: /^occupation$/,
          type: "http://gedcomx.org/Occupation"
        },
        {
          regex: /^arrival place$/,
          type: "http://gedcomx.org/Immigration"
        }
      ];
      var censusDate = null;
      var isMarriage = false;
      module.exports = function(register) {
        register(urls, setup);
      };
      function setup(emitter) {
        debug("run");
        var gedx = new GedcomX();
        var primaryPerson = new GedcomX.Person({
          id: getRecordId(document.location.href),
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(document.location.href)
          }
        });
        gedx.addPerson(primaryPerson);
        var names = document.querySelector(".recordTitle").textContent.split("&");
        if (names.length > 1) {
          isMarriage = true;
        }
        for (var i = 0; i < names.length; i++) {
          if (i == 0) {
            primaryPerson.addSimpleName(names[i].trim());
          } else {
            var person = new GedcomX.Person({});
            person.addSimpleName(names[i].trim());
            gedx.addPerson(person);
          }
        }
        var rows = document.querySelectorAll(".recordFieldsTable > tbody > tr");
        var inScopePerson = primaryPerson;
        var indented = false;
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var tds = row.querySelectorAll("td");
          var label = tds[0].textContent.toLowerCase().replace(/:$/, "");
          var value = tds[1];
          indented = tds[0].querySelector("div") !== null;
          if (!indented) {
            inScopePerson = primaryPerson;
          }
          if (/^gender/.test(label)) {
            var genderType = getGender(value.textContent);
            if (genderType) {
              inScopePerson.setGender({
                type: genderType
              });
            }
          }
          if (/birth names/.test(label)) {
            var rawNames = value.innerHTML;
            var names = rawNames.split(/<br ?\/?>/);
            for (var str of names) {
              var name = GedcomX.Name.createFromString(str);
              if (!inScopePerson.hasName(name)) {
                inScopePerson.addName(name);
              }
            }
          }
          events.forEach(function(event) {
            if (event.regex.test(label)) {
              var cell = value;
              var place = cell.querySelector(".event_place .map_callout_link");
              if (!place) {
                place = cell.querySelector(".event_place");
              }
              var date = cell.querySelector(".event_date");
              if (place || date) {
                var fact = GedcomX.Fact({
                  type: event.type
                });
                if (date) {
                  fact.setDate({
                    original: date.textContent.trim()
                  });
                }
                if (place) {
                  fact.setPlace({
                    original: place.textContent.trim()
                  });
                }
                inScopePerson.addFact(fact);
              }
            }
          });
          facts.forEach(function(fact) {
            if (fact.regex.test(label)) {
              inScopePerson.addFact(GedcomX.Fact({
                type: fact.type,
                value: value.textContent.trim()
              }));
            }
          });
          if (/^(mother|mother \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person = gedx.addRelativeFromName(inScopePerson, name, "Parent");
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(father|father \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person = gedx.addRelativeFromName(inScopePerson, name, "Parent");
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(husband|husband \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person;
            if (isMarriage) {
              person = gedx.findPersonByName(GedcomX.Name.createFromString(name));
              if (person && person.id != primaryPerson.id) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/Couple",
                  person1: primaryPerson,
                  person2: person
                });
              }
            }
            if (!person) {
              person = gedx.addRelativeFromName(inScopePerson, name, "Couple");
            }
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(wife|wife \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person;
            if (isMarriage) {
              person = gedx.findPersonByName(GedcomX.Name.createFromString(name));
              if (person && person.id != primaryPerson.id) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/Couple",
                  person1: primaryPerson,
                  person2: person
                });
              }
            }
            if (!person) {
              person = gedx.addRelativeFromName(inScopePerson, name, "Couple");
            }
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(daughter|daughter \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person = gedx.addRelativeFromName(inScopePerson, name, "Child");
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(son|son \(implied\))$/.test(label)) {
            var name = value.textContent.trim();
            var person = gedx.addRelativeFromName(inScopePerson, name, "Child");
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            if (!indented) {
              inScopePerson = person;
            }
          }
          if (/^(children|children \(implied\))$/.test(label)) {
            var rawNames = value.innerHTML;
            var names = rawNames.split(/<br ?\/?>/);
            for (var str of names) {
              var name = new DOMParser().parseFromString(str, "text/html").body.textContent.trim();
              gedx.addRelativeFromName(inScopePerson, name, "Child");
            }
          }
          if (/^(siblings|siblings \(implied\))$/.test(label)) {
            var parents = gedx.getPersonsParents(inScopePerson);
            var rawNames = value.innerHTML;
            var names = rawNames.split(/<br ?\/?>/);
            for (var str of names) {
              var name = new DOMParser().parseFromString(str, "text/html").body.textContent.trim();
              var person = new GedcomX.Person({
                identifiers: {
                  "genscrape": getRecordIdentifier(document.location.href)
                }
              });
              person.addSimpleName(name.trim());
              gedx.addPerson(person);
              for (var parent of parents) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: parent,
                  person2: person
                });
              }
            }
          }
        }
        var tables = document.querySelectorAll(".recordFieldsTable");
        for (var i = 0; i < tables.length; i++) {
          if (i == 0) continue;
          var additionalTable = tables[i];
          var title = additionalTable.querySelector(".recordSectionTitle");
          if (title && title.textContent.toLowerCase() == "relatives") {
            var relatives = new VerticalTable(additionalTable.querySelector("table"), {
              labelMapper: function(label2) {
                return label2.toLowerCase().trim();
              },
              valueMapper: function(cell) {
                var a = cell.querySelector("a");
                return {
                  text: cell.textContent.trim(),
                  href: a ? a.href : ""
                };
              }
            });
            relatives.getRows().forEach(function(row2) {
              if (!row2.relation.text.trim()) return;
              var name2 = GedcomX.Name.createFromString(row2.name.text);
              var person2 = gedx.findPersonByName(name2);
              var personId = getRecordId(row2.name.href);
              var identifiers = {
                "genscrape": getRecordIdentifier(row2.name.href)
              };
              if (person2) {
                gedx.updatePersonsID(person2.id, personId);
                person2.setIdentifiers(identifiers);
              } else {
                person2 = new GedcomX.Person({
                  id: getRecordId(row2.name.href),
                  identifiers
                });
                person2.addSimpleName(row2.name.text);
                gedx.addPerson(person2);
              }
              if (row2.birth && row2.birth.text) {
                person2.addFact(GedcomX.Fact({
                  type: "http://gedcomx.org/Birth",
                  date: {
                    original: row2.birth.text.trim()
                  }
                }));
              }
              if (row2.death && row2.death.text) {
                person2.addFact(GedcomX.Fact({
                  type: "http://gedcomx.org/Death",
                  date: {
                    original: row2.death.text.trim()
                  }
                }));
              }
              if (/^(husband|wife)/.test(row2.relation.text.toLowerCase())) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/Couple",
                  person1: primaryPerson,
                  person2
                });
              }
              if (/^(son|daughter)/.test(row2.relation.text.toLowerCase())) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: primaryPerson,
                  person2
                });
              }
              if (/^(mother|father)/.test(row2.relation.text.toLowerCase())) {
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: person2,
                  person2: primaryPerson
                });
              }
            });
          }
          if (title && title.textContent.toLowerCase() == "census") {
            var census = new HorizontalTable(additionalTable.querySelector("table"), {
              // rowSelector: 'tbody > tr',
              labelMapper: function(label2) {
                return label2.toLowerCase().replace(/:$/, "");
              }
            });
            if (census.hasMatch(/date/)) {
              censusDate = census.getMatchText(/date/).trim();
            }
          }
        }
        var household = document.querySelector(".recordSection .groupTable");
        if (household !== null) {
          var householdMembers = new VerticalTable(household, {
            labelMapper: function(label2) {
              return label2.toLowerCase().trim();
            },
            valueMapper: function(cell) {
              var a = cell.querySelector("a");
              return {
                text: cell.textContent.trim(),
                href: a ? a.href : ""
              };
            }
          });
          householdMembers.getRows().forEach(function(row2) {
            var personId = getRecordId(row2.name.href);
            var name2 = GedcomX.Name.createFromString(row2.name.text);
            var person2 = gedx.getPersonById(personId);
            if (person2 === void 0) {
              person2 = gedx.findPersonByName(name2);
            }
            var identifiers = {
              "genscrape": getRecordIdentifier(row2.name.href)
            };
            if (person2) {
              gedx.updatePersonsID(person2.id, personId);
              person2.setIdentifiers(identifiers);
            } else {
              person2 = new GedcomX.Person({
                id: getRecordId(row2.name.href),
                identifiers
              });
              person2.addSimpleName(row2.name.text);
              gedx.addPerson(person2);
            }
            if (censusDate && row2.age) {
              if (person2.getFactsByType("http://gedcomx.org/Birth").length === 0) {
                var rawAge = row2.age.text.trim();
                var year = rawAge.split(/ +/)[0];
                var age = censusDate - year;
                person2.addFact(GedcomX.Fact({
                  type: "http://gedcomx.org/Birth",
                  date: {
                    original: "About " + age
                  }
                }));
              }
            }
            if (person2.id == primaryPerson.id) return;
            var relation = row2["relation to head"].text.toLowerCase();
            if (/^(wife|daughter|mother|aunt)/.test(relation)) {
              person2.setGender({
                type: "http://gedcomx.org/Female"
              });
            }
            if (/^(husband|son|father|uncle)/.test(relation)) {
              person2.setGender({
                type: "http://gedcomx.org/Male"
              });
            }
          });
        }
        var idIncrementer = 1;
        for (var person of gedx.getPersons()) {
          if (!person.getIdentifiers()) {
            var newId = getRecordId(document.location.href) + ":" + idIncrementer++;
            gedx.updatePersonsID(person.id, newId);
            person.setIdentifiers({
              "genscrape": "genscrape://myheritage:record/" + newId
            });
          }
        }
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "MyHeritage"
        }).setHomepage({
          resource: "https://www.myheritage.com"
        });
        gedx.addAgent(agent);
        var source = GedcomX.SourceDescription().setAbout(document.location.href).addTitle({
          value: document.querySelector(".collection_title").textContent.trim()
        }).addCitation({
          value: "MyHeritage, database and images (https://www.myheritage.com : accessed " + utils.getDateString() + "), Record #" + getRecordId(document.location.href) + " for " + document.title + "."
        }).setRepository({ resource: "#agent" });
        gedx.addSourceDescriptionToAll(source);
        debug("data");
        emitter.emit("data", gedx);
      }
      function getRecordId(url) {
        var parts = url.match(/\/record-(\d+)-([^\/]+)\//);
        return parts[1] + ":" + parts[2];
      }
      function getRecordIdentifier(url) {
        return "genscrape://myheritage:record/" + getRecordId(url);
      }
      function getGender(raw) {
        var gender = raw.length > 0 ? raw.toLowerCase()[0] : "";
        switch (gender) {
          case "m":
            return "http://gedcomx.org/Male";
          case "f":
            return "http://gedcomx.org/Female";
        }
      }
    }
  });

  // src/scrapers/myheritage-person.js
  var require_myheritage_person = __commonJS({
    "src/scrapers/myheritage-person.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:ancestry-person");
      var utils = require_utils2();
      var GedcomX = require_src();
      var eventMappings = [
        {
          regex: /^birth$/,
          type: "http://gedcomx.org/Birth"
        },
        {
          regex: /^christening$/,
          type: "http://gedcomx.org/Christening"
        },
        {
          regex: /^marriage to/,
          type: "http://gedcomx.org/Marriage"
        },
        {
          regex: /^immigration$/,
          type: "http://gedcomx.org/Immigration"
        },
        {
          regex: /^residence$/,
          type: "http://gedcomx.org/Residence"
        },
        {
          regex: /^death$/,
          type: "http://gedcomx.org/Death"
        },
        {
          regex: /^burial$/,
          type: "http://gedcomx.org/Burial"
        }
      ];
      module.exports = function(register) {
        register([
          utils.urlPatternToRegex("https://www.myheritage.com/person-*")
        ], runPerson);
        register([
          utils.urlPatternToRegex("https://www.myheritage.com/site-family-tree-*")
        ], runSite);
      };
      function runPerson(emitter) {
        debug("run person");
        var matches = window.location.pathname.match(/\/person-([0-9]+)_([0-9]+)_([0-9]+)\//);
        var personId = matches[1];
        var treeId = matches[2];
        run(emitter, treeId, personId);
      }
      function runSite(emitter) {
        debug("run site");
        var treeMatches = window.location.pathname.match(/\/site-family-tree-([0-9]+)\//);
        var treeId = treeMatches[1];
        var personMatches = window.location.hash.match(/profile-([0-9]+)-info/);
        var personId = personMatches[1];
        window.addEventListener("hashchange", function() {
          var matches = window.location.hash.match(/profile-([0-9]+)-info/);
          run(emitter, treeId, matches[1]);
        });
        run(emitter, treeId, personId);
      }
      function run(emitter, treeId, personId) {
        debug("run");
        var pageUrl = `/FP/API/Profile/get-profile-tab-content.php?s=${treeId}&siteID=${treeId}&indID=${personId}&show=info&inCanvas=1&getPart=main`;
        var eventUrl = `/FP/API/Profile/get-profile-tab-content.php?s=${treeId}&siteID=${treeId}&indID=${personId}&show=events&inCanvas=0&getPart=tab`;
        debug(`page url: ${pageUrl}`);
        debug(`event url: ${eventUrl}`);
        utils.getHTML(pageUrl, function(error, pageHtml) {
          debug("pageUrl response");
          if (error) {
            debug("error");
            emitter.emit("error", error);
          } else {
            utils.getHTML(eventUrl, function(error2, eventHtml) {
              if (error2) {
                debug("error");
                emitter.emit("error", error2);
              } else {
                process2(emitter, treeId, personId, parseHTML(pageHtml), parseHTML(eventHtml));
              }
            });
          }
        });
      }
      function process2(emitter, treeId, personId, $page, $event) {
        debug("processing");
        var gedx = new GedcomX();
        var primaryPerson = new GedcomX.Person({
          id: treeId + ":" + personId,
          principal: true,
          identifiers: {
            "genscrape": "genscrape://myheritage:tree/person:" + treeId + ":" + personId
          }
        });
        var name = $page.querySelector("#BreadcrumbsFinalText").textContent;
        primaryPerson.addSimpleName(name);
        gedx.addPerson(primaryPerson);
        var events = $event.querySelectorAll(".EventRow");
        for (var i = 0; i < events.length; i++) {
          var event = events[i].querySelector(".EventsText");
          var parts = event.querySelectorAll(".FL_Label");
          var type = parts[0];
          var place = null;
          var date = null;
          if (parts.length == 2) {
            place = parts[1].textContent;
          }
          if (parts.length == 3) {
            place = parts[1].textContent;
            date = parts[2].textContent;
          }
          eventMappings.forEach(function(mapping) {
            if (type.textContent.toLowerCase().match(mapping.regex)) {
              var fact = GedcomX.Fact({
                type: mapping.type
              });
              if (date) {
                fact.setDate({
                  original: date.trim()
                });
              }
              if (place) {
                fact.setPlace({
                  original: place.trim()
                });
              }
              primaryPerson.addFact(fact);
            }
          });
          if (type.textContent.toLowerCase().match(/^marriage to/)) {
            var aTag = type.querySelector("a");
            var person = new GedcomX.Person({
              id: getRecordId(aTag.href),
              identifiers: {
                "genscrape": getRecordIdentifier(aTag.href)
              }
            });
            person.addSimpleName(aTag.textContent.trim());
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: primaryPerson,
              person2: person
            });
          }
          if (type.textContent.toLowerCase().match(/^birth of daughter/)) {
            var aTag = type.querySelector("a");
            var person = new GedcomX.Person({
              id: getRecordId(aTag.href),
              identifiers: {
                "genscrape": getRecordIdentifier(aTag.href)
              }
            });
            person.addSimpleName(aTag.textContent.trim());
            person.setGender({
              type: "http://gedcomx.org/Female"
            });
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: person
            });
          }
          if (type.textContent.toLowerCase().match(/^birth of son/)) {
            var aTag = type.querySelector("a");
            var person = new GedcomX.Person({
              id: getRecordId(aTag.href),
              identifiers: {
                "genscrape": getRecordIdentifier(aTag.href)
              }
            });
            person.addSimpleName(aTag.textContent.trim());
            person.setGender({
              type: "http://gedcomx.org/Male"
            });
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primaryPerson,
              person2: person
            });
          }
        }
        var h2s = $page.querySelectorAll("h2");
        for (var i = 0; i < h2s.length; i++) {
          if (h2s[i].textContent.toLowerCase().trim() === "immediate family") {
            var table = h2s[i].nextSibling;
            var tds = table.querySelectorAll("td");
            for (var j = 0; j < tds.length; j++) {
              var td = tds[j];
              if (td.textContent.trim() === "") continue;
              var aTag = td.querySelector("a");
              var rel = td.querySelector("span").textContent.trim();
              if (rel.toLowerCase() == "his mother") {
                var person = new GedcomX.Person({
                  id: getRecordId(aTag.href),
                  identifiers: {
                    "genscrape": getRecordIdentifier(aTag.href)
                  }
                });
                person.addSimpleName(aTag.textContent.trim());
                person.setGender({
                  type: "http://gedcomx.org/Female"
                });
                gedx.addPerson(person);
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: person,
                  person2: primaryPerson
                });
              }
              if (rel.toLowerCase() == "his father") {
                var person = new GedcomX.Person({
                  id: getRecordId(aTag.href),
                  identifiers: {
                    "genscrape": getRecordIdentifier(aTag.href)
                  }
                });
                person.addSimpleName(aTag.textContent.trim());
                person.setGender({
                  type: "http://gedcomx.org/Male"
                });
                gedx.addPerson(person);
                gedx.addRelationship({
                  type: "http://gedcomx.org/ParentChild",
                  person1: person,
                  person2: primaryPerson
                });
              }
            }
          }
        }
        var agent = GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "MyHeritage"
        }).setHomepage({
          resource: "https://www.myheritage.com"
        });
        gedx.addAgent(agent);
        var source = GedcomX.SourceDescription().setAbout(document.location.href).addTitle({
          value: name + " - MyHeritage Tree"
        }).addCitation({
          value: "MyHeritage Family Trees (https://www.myheritage.com : accessed " + utils.getDateString() + "), Person #" + treeId + ":" + personId + " for " + name + "."
        }).setRepository({ resource: "#agent" });
        gedx.addSourceDescriptionToAll(source);
        emitter.emit("data", gedx);
      }
      function parseHTML(html) {
        return new window.DOMParser().parseFromString(html, "text/html").body;
      }
      function getRecordId(url) {
        var matches = url.match(/\/person-([0-9]+)_([0-9]+)_([0-9]+)\//);
        return matches[2] + ":" + matches[1];
      }
      function getRecordIdentifier(url) {
        return "genscrape://myheritage:tree/person:" + getRecordId(url);
      }
    }
  });

  // src/scrapers/fold3-memorial.js
  var require_fold3_memorial = __commonJS({
    "src/scrapers/fold3-memorial.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:fold3-memorial");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.fold3.com/memorial/*"),
        utils.urlPatternToRegex("https://fold3.com/memorial/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var eventTypes = {
        "birth": "http://gedcomx.org/Birth",
        "death": "http://gedcomx.org/Death",
        "burial": "http://gedcomx.org/Burial",
        "marriage": "http://gedcomx.org/Marriage",
        "divorce": "http://gedcomx.org/Divorce",
        "baptism": "http://gedcomx.org/Baptism",
        "christening": "http://gedcomx.org/Christening",
        "residence": "http://gedcomx.org/Residence",
        "immigration": "http://gedcomx.org/Immigration",
        "emigration": "http://gedcomx.org/Emigration",
        "naturalization": "http://gedcomx.org/Naturalization",
        "cremation": "http://gedcomx.org/Cremation",
        "census": "http://gedcomx.org/Census",
        "occupation": "http://gedcomx.org/Occupation",
        "education": "http://gedcomx.org/Education"
      };
      function run(emitter) {
        debug("run");
        var $name = document.querySelector("h1.page-title"), $events = document.querySelectorAll(".StoryPageEvent");
        if (!$name || !$events.length) {
          return emitter.emit("noData");
        }
        var id = getRecordId(document.location.href), gedx = new GedcomX(), person = GedcomX.Person({
          id,
          principal: true,
          identifiers: {
            "genscrape": "genscrape://fold3-memorial/" + id
          }
        }), names = [], relatives = [], servicePieces = {}, awards = [];
        var primaryName = text($name);
        person.addSimpleName(primaryName);
        names.push(primaryName);
        var $timeline = document.querySelector(".StoryPageEventsSection");
        Array.prototype.forEach.call($events, function($event) {
          var inTimeline = $timeline && $timeline.contains($event);
          if (inTimeline) {
            if ($event.classList.contains("military-service-event")) {
              readMilitary($event, servicePieces, awards);
            } else {
              readTimelineEvent($event, person);
            }
          } else {
            readOtherFacts($event, person, names, relatives);
          }
        });
        var service = buildMilitaryService(servicePieces);
        if (service) {
          person.addFact(service);
        }
        awards.forEach(function(award) {
          person.addFact({
            type: "http://gedcomx.org/MilitaryAward",
            value: award
          });
        });
        gedx.addPerson(person);
        relatives.forEach(function(rel) {
          gedx.addRelativeFromName(person, rel.name, rel.type);
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Fold3"
        }).setHomepage({
          resource: "https://www.fold3.com"
        }));
        var title = document.title.replace(/\s*-\s*Fold3\s*$/, "") + " - Fold3 Memorial";
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: 'Fold3, "' + primaryName + '" (' + document.location.href + " : accessed " + utils.getDateString() + "), memorial page."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function text($el) {
        return $el ? $el.textContent.replace(/\s+/g, " ").trim() : "";
      }
      function readFact($fact) {
        var $value = $fact.querySelector(".fact-value");
        if (!$value) {
          return null;
        }
        var $inlineLabel = null, $children = $value.children;
        if ($children.length >= 2 && $children[0].classList.contains("text-uppercase") && $children[0].tagName === "DIV") {
          return {
            label: text($children[0]),
            value: text($children[1])
          };
        }
        if ($children.length && $children[0].tagName === "SPAN" && $children[0].classList.contains("text-uppercase")) {
          var date = $children[1] ? text($children[1].querySelector("span") || $children[1]) : "";
          return {
            label: text($children[0]),
            date
          };
        }
        return {
          value: text($value)
        };
      }
      function readTimelineEvent($event, person) {
        var label, date, values = [], labeled = {};
        var $label = $event.querySelector("h3.event-label .text-uppercase");
        if ($label) {
          label = text($label);
        }
        Array.prototype.forEach.call($event.querySelectorAll(".StoryPageFact"), function($fact) {
          var fact2 = readFact($fact);
          if (!fact2) {
            return;
          }
          if (fact2.label && fact2.date !== void 0 && !label) {
            label = fact2.label;
            date = fact2.date;
          } else if (fact2.label) {
            labeled[fact2.label.toLowerCase()] = fact2.value;
          } else if (fact2.value) {
            values.push(fact2.value);
          }
        });
        var type = label && eventTypes[label.toLowerCase()];
        if (!type) {
          return;
        }
        var place;
        switch (type) {
          case "http://gedcomx.org/Burial":
            place = burialPlace(values);
            break;
          case "http://gedcomx.org/Death":
            place = choosePlace(values);
            break;
          default:
            place = values[0];
        }
        var fact = GedcomX.Fact({ type });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        if (date || place) {
          person.addFact(fact);
        }
      }
      function choosePlace(values) {
        for (var i = 0; i < values.length; i++) {
          if (values[i].indexOf(",") !== -1) {
            return values[i];
          }
        }
        return values[0];
      }
      function burialPlace(values) {
        var candidates = values.filter(function(v) {
          return !/^(Buried at:|Missing in Action)/i.test(v);
        });
        if (candidates.length <= 1) {
          return candidates[0] || values[0];
        }
        var locality = choosePlace(candidates), cemetery = candidates.filter(function(v) {
          return v !== locality;
        })[0];
        return cemetery + ", " + locality;
      }
      function readMilitary($event, pieces, awards) {
        var $start = $event.querySelector('[itemprop="startDate"]'), $end = $event.querySelector('[itemprop="endDate"]'), $war = $event.querySelector('h3 [itemprop="name"]');
        if ($start) {
          pieces.start = text($start);
        }
        if ($end) {
          pieces.end = text($end);
        }
        if ($war) {
          pieces.war = text($war);
        }
        Array.prototype.forEach.call($event.querySelectorAll(".StoryPageFact"), function($fact) {
          var fact = readFact($fact);
          if (!fact || !fact.label || !fact.value) {
            return;
          }
          var label = fact.label.toLowerCase();
          switch (label) {
            case "rank":
            case "regiment":
            case "unit":
            case "branch":
            case "service number":
            case "served for":
              if (!pieces[label]) {
                pieces[label] = fact.value;
              }
              break;
            case "award":
            case "awards":
              fact.value.split(/\s*,\s*(?=[A-Z])/).forEach(function(award) {
                if (award && awards.indexOf(award) === -1) {
                  awards.push(award);
                }
              });
              break;
          }
        });
      }
      function buildMilitaryService(pieces) {
        var parts = [];
        if (pieces.war) {
          parts.push(pieces.war);
        }
        if (pieces.rank) {
          parts.push(pieces.rank);
        }
        if (pieces.regiment || pieces.unit) {
          parts.push(pieces.regiment || pieces.unit);
        }
        if (pieces.branch) {
          parts.push(pieces.branch);
        }
        if (pieces["service number"]) {
          parts.push("Service number " + pieces["service number"]);
        }
        if (!parts.length && !pieces.war) {
          return null;
        }
        var fact = GedcomX.Fact({
          type: "http://gedcomx.org/MilitaryService",
          value: parts.join("; ")
        });
        var date = pieces.start && pieces.end ? pieces.start + " - " + pieces.end : pieces.start;
        if (date) {
          fact.setDate({ original: date });
        }
        return fact;
      }
      function readOtherFacts($event, person, names, relatives) {
        Array.prototype.forEach.call($event.querySelectorAll(".StoryPageFact"), function($fact) {
          var fact = readFact($fact);
          if (!fact || !fact.label || !fact.value) {
            return;
          }
          var value = fact.value;
          switch (fact.label.toLowerCase()) {
            case "full name":
            case "also known as":
            case "maiden name":
              if (names.indexOf(value) === -1) {
                names.push(value);
                person.addSimpleName(value);
              }
              break;
            case "gender":
              if (/^male$/i.test(value)) {
                person.setGender({ type: "http://gedcomx.org/Male" });
              } else if (/^female$/i.test(value)) {
                person.setGender({ type: "http://gedcomx.org/Female" });
              }
              break;
            case "father":
            case "mother":
              addRelative(relatives, value, "Parent");
              break;
            case "child":
            case "son":
            case "daughter":
              addRelative(relatives, value, "Child");
              break;
            case "spouse":
            case "husband":
            case "wife":
            case "partner":
              addRelative(relatives, value, "Couple");
              break;
            case "place of residence":
              person.addFact({
                type: "http://gedcomx.org/Residence",
                place: { original: value }
              });
              break;
            case "occupation":
              person.addFact({
                type: "http://gedcomx.org/Occupation",
                value
              });
              break;
            case "religion":
              person.addFact({
                type: "http://gedcomx.org/Religion",
                value
              });
              break;
            case "race or ethnicity":
              person.addFact({
                type: "http://gedcomx.org/Ethnicity",
                value
              });
              break;
          }
        });
      }
      function addRelative(relatives, name, type) {
        var exists = relatives.some(function(r) {
          return r.name === name && r.type === type;
        });
        if (!exists) {
          relatives.push({ name, type });
        }
      }
      function getRecordId(url) {
        var match = url.match(/\/memorial\/(\d+)/);
        return match ? match[1] : void 0;
      }
    }
  });

  // src/scrapers/abmc.js
  var require_abmc = __commonJS({
    "src/scrapers/abmc.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:abmc");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.abmc.gov/profile/*"),
        utils.urlPatternToRegex("https://abmc.gov/profile/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var rankWords = [
        "private",
        "first",
        "second",
        "class",
        "corporal",
        "sergeant",
        "staff",
        "technical",
        "master",
        "gunnery",
        "lance",
        "major",
        "colonel",
        "lieutenant",
        "captain",
        "general",
        "brigadier",
        "admiral",
        "rear",
        "vice",
        "commander",
        "ensign",
        "seaman",
        "apprentice",
        "petty",
        "officer",
        "chief",
        "warrant",
        "flight",
        "pilot",
        "airman",
        "specialist",
        "cadet",
        "chaplain",
        "junior",
        "grade",
        "senior",
        "fireman",
        "musician",
        "cook",
        "mechanic",
        "bugler",
        "wagoner",
        "saddler",
        "sergeant-major",
        "quartermaster",
        "machinist's",
        "mate",
        "coxswain",
        "yeoman",
        "radioman",
        "storekeeper",
        "surgeon",
        "of",
        "the",
        "and",
        "army",
        "fleet",
        "colonel",
        "second-class",
        "first-class"
      ];
      function run(emitter) {
        debug("run");
        var $heading = document.querySelector(".usa-card__heading");
        if (!$heading) {
          return emitter.emit("noData");
        }
        var slug = getRecordId(document.location.href), fullTitle = text($heading), nameParts = splitRank(fullTitle), gedx = new GedcomX(), person = GedcomX.Person({
          id: slug,
          principal: true,
          identifiers: {
            "genscrape": "genscrape://abmc/" + slug
          }
        });
        person.addSimpleName(nameParts.name);
        var categories = text(document.querySelector(".abmc-profile-card__categories")).split(/\s*,\s*/), cemetery, branch, war;
        categories.forEach(function(category) {
          if (/(Cemetery|Memorial)$/i.test(category) && !cemetery) {
            cemetery = category;
          } else if (/^U\.S\./.test(category) && !branch) {
            branch = category;
          } else if (/^(World War|Korean War|Vietnam War|Spanish)/i.test(category)) {
            war = category;
          }
        });
        var fields = {};
        Array.prototype.forEach.call(document.querySelectorAll(".usa-card__body li"), function($li) {
          var $label = $li.querySelector("strong");
          if ($label) {
            var label = text($label).replace(/:$/, "");
            fields[label] = text($li).substr(text($label).length).trim();
          }
        });
        addEvent(person, "http://gedcomx.org/Birth", fields["Date of Birth"]);
        addEvent(person, "http://gedcomx.org/Death", fields["Date of Death"], fields["Place of Death"]);
        var burialPlace = fields["Cemetery"] || cemetery;
        if (burialPlace) {
          person.addFact({
            type: "http://gedcomx.org/Burial",
            place: { original: burialPlace }
          });
        }
        if (fields["Hometown"]) {
          person.addFact({
            type: "http://gedcomx.org/Residence",
            place: { original: fields["Hometown"] }
          });
        }
        var service = [];
        if (nameParts.rank) {
          service.push(nameParts.rank);
        }
        if (fields["Unit"]) {
          service.push(fields["Unit"]);
        }
        if (branch) {
          service.push(branch);
        }
        if (war) {
          service.push(war);
        }
        if (service.length) {
          person.addFact({
            type: "http://gedcomx.org/MilitaryService",
            value: service.join("; ")
          });
        }
        if (fields["Awards"]) {
          fields["Awards"].split(/\s*,\s*/).forEach(function(award) {
            if (award) {
              person.addFact({
                type: "http://gedcomx.org/MilitaryAward",
                value: award
              });
            }
          });
        }
        gedx.addPerson(person);
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "American Battle Monuments Commission"
        }).setHomepage({
          resource: "https://www.abmc.gov"
        }));
        var title = document.title.replace(/\s*-\s*American Battle Monuments Commission.*$/, "");
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title + " - American Battle Monuments Commission"
            }
          ],
          citations: [
            {
              value: 'American Battle Monuments Commission, "' + title + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function text($el) {
        return $el ? $el.textContent.replace(/\s+/g, " ").trim() : "";
      }
      function addEvent(person, type, date, place) {
        if (date || place) {
          var fact = GedcomX.Fact({ type });
          if (date) {
            fact.setDate({ original: date });
          }
          if (place) {
            fact.setPlace({ original: place });
          }
          person.addFact(fact);
        }
      }
      function splitRank(title) {
        var words = title.split(" "), i = 0;
        while (i < words.length - 2 && rankWords.indexOf(words[i].toLowerCase()) !== -1) {
          i++;
        }
        return {
          rank: words.slice(0, i).join(" "),
          name: words.slice(i).join(" ")
        };
      }
      function getRecordId(url) {
        var match = url.match(/\/profile\/([^\/?#]+)/);
        return match ? match[1] : void 0;
      }
    }
  });

  // src/scrapers/cvwm.js
  var require_cvwm = __commonJS({
    "src/scrapers/cvwm.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:cvwm");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.veterans.gc.ca/eng/remembrance/memorials/canadian-virtual-war-memorial/detail/*"),
        utils.urlPatternToRegex("https://www.veterans.gc.ca/en/remembrance/memorials/canadian-virtual-war-memorial/detail/*"),
        utils.urlPatternToRegex("https://veterans.gc.ca/eng/remembrance/memorials/canadian-virtual-war-memorial/detail/*"),
        utils.urlPatternToRegex("https://veterans.gc.ca/en/remembrance/memorials/canadian-virtual-war-memorial/detail/*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $h1 = document.querySelector(".casualty h1, main h1"), $profile = document.querySelector(".casualty-profile");
        if (!$h1 || !$profile) {
          return emitter.emit("noData");
        }
        var id = getRecordId(document.location.href), fields = readFields(), fullTitle = text($h1), name = fullTitle, gedx = new GedcomX(), person = GedcomX.Person({
          id,
          principal: true,
          identifiers: {
            "genscrape": "genscrape://cvwm/" + id
          }
        });
        var rank = fields["Rank"];
        if (rank && fullTitle.indexOf(rank + " ") === 0) {
          name = fullTitle.substr(rank.length + 1);
        }
        person.addSimpleName(name);
        addEvent(person, "http://gedcomx.org/Birth", fields["Birth"]);
        addEvent(person, "http://gedcomx.org/Death", fields["Death"]);
        var $cemetery = document.querySelector('a[href="#cemetery"]');
        if ($cemetery) {
          var burial = GedcomX.Fact({
            type: "http://gedcomx.org/Burial",
            place: {
              original: utils.toTitleCase(text($cemetery).toLowerCase())
            }
          });
          if (fields["Grave reference"]) {
            burial.setValue(fields["Grave reference"].replace(/\.$/, ""));
          }
          person.addFact(burial);
        }
        var service = [];
        ["Rank", "Force", "Unit/Regiment", "Division"].forEach(function(key) {
          if (fields[key]) {
            service.push(fields[key]);
          }
        });
        if (fields["Service number"]) {
          service.push("Service number " + fields["Service number"]);
        }
        if (service.length) {
          var serviceFact = GedcomX.Fact({
            type: "http://gedcomx.org/MilitaryService",
            value: service.join("; ")
          });
          var enlistment = splitDatePlace(fields["Enlistment"]);
          if (enlistment.date) {
            serviceFact.setDate({ original: enlistment.date });
          }
          if (enlistment.place) {
            serviceFact.setPlace({ original: enlistment.place });
          }
          person.addFact(serviceFact);
        }
        var relatives = [];
        var $additional = document.querySelector(".field--name-field-additional-information .field--item");
        if ($additional) {
          relatives = parseAdditionalInfo(text($additional), person);
        }
        gedx.addPerson(person);
        relatives.forEach(function(rel) {
          var relative = gedx.addRelativeFromName(person, rel.name, rel.type);
          if (rel.gender) {
            relative.setGender({ type: rel.gender });
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Veterans Affairs Canada"
        }).setHomepage({
          resource: "https://www.veterans.gc.ca"
        }));
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: fullTitle + " - The Canadian Virtual War Memorial"
            }
          ],
          citations: [
            {
              value: 'Veterans Affairs Canada, "The Canadian Virtual War Memorial: ' + fullTitle + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function text($el) {
        return $el ? $el.textContent.replace(/\s+/g, " ").trim() : "";
      }
      function readFields() {
        var fields = {};
        Array.prototype.forEach.call(document.querySelectorAll(".profile-field"), function($field) {
          var $label = $field.querySelector(".views-label"), $value = $field.querySelector(".field-content");
          if ($label && $value) {
            fields[text($label).replace(/:$/, "")] = text($value);
          }
        });
        return fields;
      }
      function splitDatePlace(value) {
        if (!value) {
          return {};
        }
        var match = value.match(/^((?:[A-Z][a-z]+ )?(?:\d{1,2}, )?\d{4})\s*(.*)$/);
        if (match) {
          return { date: match[1], place: match[2] };
        }
        return { place: value };
      }
      function addEvent(person, type, value) {
        var parts = splitDatePlace(value);
        if (parts.date || parts.place) {
          var fact = GedcomX.Fact({ type });
          if (parts.date) {
            fact.setDate({ original: parts.date });
          }
          if (parts.place) {
            fact.setPlace({ original: parts.place });
          }
          person.addFact(fact);
        }
      }
      function parseAdditionalInfo(info, person) {
        var relatives = [];
        info.split(/;\s*/).forEach(function(clause) {
          var match = clause.match(/^(Son|Daughter|Husband|Wife) of (.+)$/i);
          if (!match) {
            return;
          }
          var kind = match[1].toLowerCase(), names = match[2].split(/,\s+of\s+/)[0].replace(/[\s.]+$/, "");
          switch (kind) {
            case "son":
            case "daughter":
              person.setGender({
                type: kind === "son" ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female"
              });
              splitParents(names).forEach(function(parent) {
                relatives.push({ name: parent, type: "Parent" });
              });
              break;
            case "husband":
            case "wife":
              person.setGender({
                type: kind === "husband" ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female"
              });
              relatives.push({
                name: names,
                type: "Couple",
                gender: kind === "husband" ? "http://gedcomx.org/Female" : "http://gedcomx.org/Male"
              });
              break;
          }
        });
        return relatives;
      }
      function splitParents(names) {
        var parts = names.split(/\s+and\s+/);
        if (parts.length === 2) {
          var second = parts[1].split(" ");
          if (parts[0].indexOf(" ") === -1 && second.length > 1) {
            parts[0] = parts[0] + " " + second[second.length - 1];
          }
        }
        return parts.filter(function(p) {
          return p;
        });
      }
      function getRecordId(url) {
        var match = url.match(/\/detail\/(\d+)/);
        return match ? match[1] : void 0;
      }
    }
  });

  // src/scrapers/awm.js
  var require_awm = __commonJS({
    "src/scrapers/awm.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:awm");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://www.awm.gov.au/collection/R*")
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $name = document.querySelector("h1.title__heading span"), fields = readFields();
        if (!$name || !fields["Date of Death"]) {
          return emitter.emit("noData");
        }
        var id = getRecordId(document.location.href), name = text($name), gedx = new GedcomX(), person = GedcomX.Person({
          id,
          principal: true,
          identifiers: {
            "genscrape": "genscrape://awm/" + id
          }
        });
        person.addSimpleName(name);
        var death = GedcomX.Fact({
          type: "http://gedcomx.org/Death",
          date: { original: fields["Date of Death"].replace(/^0/, "") }
        });
        if (fields["Place of Death"]) {
          death.setPlace({ original: fields["Place of Death"] });
        }
        if (fields["Cause of Death"]) {
          death.setValue(fields["Cause of Death"]);
        }
        person.addFact(death);
        if (fields["Cemetery or Memorial Details"]) {
          person.addFact({
            type: "http://gedcomx.org/Burial",
            place: { original: fields["Cemetery or Memorial Details"] }
          });
        }
        if (fields["Place of Association"]) {
          person.addFact({
            type: "http://gedcomx.org/Residence",
            place: { original: fields["Place of Association"] }
          });
        }
        var service = [];
        ["Conflict/Operation", "Rank", "Unit", "Service"].forEach(function(key) {
          if (fields[key]) {
            service.push(fields[key]);
          }
        });
        if (fields["Service number"]) {
          service.push("Service number " + fields["Service number"]);
        }
        if (fields["Age at Death"]) {
          service.push("Age at death " + fields["Age at Death"]);
        }
        if (service.length) {
          person.addFact({
            type: "http://gedcomx.org/MilitaryService",
            value: service.join("; ")
          });
        }
        gedx.addPerson(person);
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Australian War Memorial"
        }).setHomepage({
          resource: "https://www.awm.gov.au"
        }));
        var title = "Roll of Honour: " + name;
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title + " - Australian War Memorial"
            }
          ],
          citations: [
            {
              value: 'Australian War Memorial, "' + title + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function text($el) {
        return $el ? $el.textContent.replace(/\s+/g, " ").trim() : "";
      }
      function readFields() {
        var fields = {};
        Array.prototype.forEach.call(document.querySelectorAll(".entry-content table tr"), function($row) {
          var $th = $row.querySelector("th"), $td = $row.querySelector("td");
          if ($th && $td) {
            fields[text($th)] = text($td);
          }
        });
        return fields;
      }
      function getRecordId(url) {
        var match = url.match(/\/collection\/(R\d+)/);
        return match ? match[1] : void 0;
      }
    }
  });

  // src/scrapers/familysearch-ancestors-public.js
  var require_familysearch_ancestors_public = __commonJS({
    "src/scrapers/familysearch-ancestors-public.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:familysearch-ancestors-public");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://ancestors.familysearch.org/*/*-*/*")
      ];
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var data = getPersonData();
        if (!data) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), primary = queryPerson(data, getIdFromUrl() || data.identifier);
        primary.setPrincipal(true);
        gedx.addPerson(primary);
        asArray(data.parent).forEach(function(parent) {
          var person = queryPerson(parent);
          if (person) {
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: person,
              person2: primary
            });
          }
        });
        asArray(data.spouse).forEach(function(spouse) {
          var person = queryPerson(spouse);
          if (person) {
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: primary,
              person2: person
            });
          }
        });
        asArray(data.children).forEach(function(child) {
          var person = queryPerson(child);
          if (person) {
            gedx.addPerson(person);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: primary,
              person2: person
            });
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "FamilySearch Ancestors"
        }).setHomepage({
          resource: "https://ancestors.familysearch.org"
        }));
        var title = data.name + " - FamilySearch Ancestors";
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: '"' + title + '," FamilySearch Ancestors (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getPersonData() {
        var scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < scripts.length; i++) {
          try {
            var json = JSON.parse(scripts[i].textContent);
            if (json && json["@type"] === "Person" && json.name) {
              return json;
            }
          } catch (e) {
            debug("invalid json-ld");
          }
        }
      }
      function getIdFromUrl() {
        var match = document.location.pathname.match(/^\/[^\/]+\/([^\/]+)/);
        return match ? match[1] : null;
      }
      function asArray(value) {
        return Array.isArray(value) ? value : [];
      }
      function queryPerson(data, id) {
        if (!data || !data.name) {
          return null;
        }
        id = id || data.identifier;
        var person = GedcomX.Person();
        if (id) {
          person.setId(id);
          person.setIdentifiers({
            "genscrape": "genscrape://familysearch-ancestors-public/" + id
          });
        }
        person.addSimpleName(data.name);
        if (data.gender === "Male") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (data.gender === "Female") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        addFact(person, "http://gedcomx.org/Birth", data.birthDate, data.birthPlace);
        addFact(person, "http://gedcomx.org/Death", data.deathDate, data.deathPlace);
        return person;
      }
      function addFact(person, type, date, place) {
        date = formatDate(date);
        var placeText = place && (place.address || place.name);
        if (typeof placeText !== "string") {
          placeText = null;
        }
        if (date || placeText) {
          var fact = GedcomX.Fact({ type });
          if (date) {
            fact.setDate({ original: date });
          }
          if (placeText) {
            fact.setPlace({ original: placeText });
          }
          person.addFact(fact);
        }
      }
      function formatDate(value) {
        if (typeof value !== "string" || !value) {
          return null;
        }
        var parts = value.split("/");
        if (parts.length === 2) {
          if (parts[0] && !parts[1]) {
            return "After " + formatSingle(parts[0]);
          } else if (!parts[0] && parts[1]) {
            return "Before " + formatSingle(parts[1]);
          } else if (parts[0] && parts[1]) {
            return "From " + formatSingle(parts[0]) + " to " + formatSingle(parts[1]);
          }
          return null;
        }
        return formatSingle(value);
      }
      function formatSingle(value) {
        var m = value.replace(/^\+/, "").match(/^(-?\d+)(?:-(\d\d))?(?:-(\d\d))?/);
        if (!m) {
          return value;
        }
        var year = m[1].replace(/^-/, "").replace(/^0+(?=\d)/, "");
        var text = year;
        if (m[2]) {
          text = monthNames[parseInt(m[2], 10) - 1] + " " + year;
          if (m[3]) {
            text = parseInt(m[3], 10) + " " + text;
          }
        }
        return m[1][0] === "-" ? text + " BC" : text;
      }
    }
  });

  // src/scrapers/thepeerage.js
  var require_thepeerage = __commonJS({
    "src/scrapers/thepeerage.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:thepeerage");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(?:www\.)?thepeerage\.com\/p\d+\.htm/
      ];
      var MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";
      var DATE_REGEX = new RegExp("(?:(?:circa|c|before|after|say|between|about)\\.?\\s+)?(?:\\d{1,2}\\s+)?(?:(?:" + MONTHS + ")\\s+)?\\d{4}(?:\\s+and\\s+(?:\\d{1,2}\\s+)?(?:(?:" + MONTHS + ")\\s+)?\\d{4})?", "g");
      var NAME_CLASSES = {
        nt: "http://gedcomx.org/Prefix",
        ng: "http://gedcomx.org/Given",
        ns: "http://gedcomx.org/Surname",
        nu: "http://gedcomx.org/Suffix"
      };
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $person = getPrincipalElement();
        if (!$person) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), persons = {}, principalId = $person.id.replace(/^i/, ""), primary = GedcomX.Person({
          id: principalId,
          identifiers: {
            "genscrape": "genscrape://thepeerage/" + principalId
          }
        });
        primary.setPrincipal(true);
        persons[principalId] = primary;
        gedx.addPerson(primary);
        var $narr = $person.querySelector(".narr");
        var nameParts = {}, fullName = getHeadingText($person.querySelector("h2"));
        if ($narr) {
          for (var i = 0; i < $narr.children.length; i++) {
            var type = nameTypeOf($narr.children[i]);
            if (type) {
              nameParts[type] = (nameParts[type] ? nameParts[type] + " " : "") + $narr.children[i].textContent.trim();
            }
          }
        }
        addName(primary, nameParts, fullName);
        var $info = $person.querySelector(".sinfo"), info = $info ? $info.textContent.trim() : "", infoMatch = info.match(/^([MF]),/);
        if (infoMatch) {
          primary.setGender({
            type: infoMatch[1] === "M" ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female"
          });
        }
        var facts = {};
        var birthInfo = info.match(/\bb\. (.+?)(?:, d\. |$)/), deathInfo = info.match(/\bd\. (.+)$/);
        if ($narr) {
          var sentences = getSentences($narr);
          sentences.forEach(function(sentence, index) {
            debug("sentence", index, sentence);
            processSentence(sentence, primary, gedx, persons, facts, index === 0);
          });
        }
        if (birthInfo && !facts.birth) {
          primary.addFact(makeFact("http://gedcomx.org/Birth", birthInfo[1], null));
        }
        if (deathInfo && !facts.death) {
          primary.addFact(makeFact("http://gedcomx.org/Death", deathInfo[1], null));
        }
        var $families = $person.querySelectorAll(".fams");
        for (var f = 0; f < $families.length; f++) {
          var $heading = $families[f].querySelector("h3"), otherParent = null;
          if ($heading) {
            var $parentLink = $heading.querySelector("a");
            if ($parentLink) {
              otherParent = getRelative($parentLink, persons, gedx);
            }
          }
          var $items = $families[f].querySelectorAll("li");
          for (var c = 0; c < $items.length; c++) {
            var $childLink = $items[c].querySelector("a");
            if (!$childLink) {
              continue;
            }
            var child = getRelative($childLink, persons, gedx);
            if (!child) {
              continue;
            }
            addDatesFromListItem(child, $items[c].textContent);
            addParentChild(gedx, primary, child);
            if (otherParent) {
              addParentChild(gedx, otherParent, child);
              addCouple(gedx, primary, otherParent);
            }
          }
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "thePeerage.com"
        }).setHomepage({
          resource: "http://www.thepeerage.com"
        }));
        var title = fullName + " - thePeerage.com";
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: '"' + title + '," thePeerage.com (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getPrincipalElement() {
        var hash = document.location.hash;
        if (hash && hash.length > 1) {
          var $el = document.getElementById(hash.substring(1));
          if ($el && /(^|\s)itp(\s|$)/.test($el.className)) {
            return $el;
          }
        }
        return document.querySelector(".itp");
      }
      function nameTypeOf($el) {
        var classes = ($el.className || "").split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
          if (NAME_CLASSES[classes[i]]) {
            return NAME_CLASSES[classes[i]];
          }
        }
        return null;
      }
      function addName(person, nameParts, fullText) {
        var hasParts = Object.keys(nameParts).length > 0;
        if (!hasParts) {
          person.addSimpleName(fullText);
          return;
        }
        var nameForm = GedcomX.NameForm();
        var textParts = [];
        [
          "http://gedcomx.org/Prefix",
          "http://gedcomx.org/Given",
          "http://gedcomx.org/Surname",
          "http://gedcomx.org/Suffix"
        ].forEach(function(type) {
          if (nameParts[type]) {
            nameForm.addPart({ type, value: nameParts[type] });
            textParts.push(nameParts[type]);
          }
        });
        nameForm.setFullText(fullText || textParts.join(" "));
        person.addName(GedcomX.Name().addNameForm(nameForm));
      }
      function getRelative($link, persons, gedx) {
        var href = $link.getAttribute("href") || "", match = href.match(/#i(\d+)$/);
        if (!match) {
          return null;
        }
        var id = match[1];
        if (persons[id]) {
          return persons[id];
        }
        var person = GedcomX.Person({
          id,
          identifiers: {
            "genscrape": "genscrape://thepeerage/" + id
          }
        });
        var nameParts = {};
        for (var i = 0; i < $link.children.length; i++) {
          var type = nameTypeOf($link.children[i]);
          if (type) {
            var text = $link.children[i].textContent.trim();
            nameParts[type] = (nameParts[type] ? nameParts[type] + " " : "") + text;
          }
        }
        addName(person, nameParts, $link.textContent.replace(/\s+/g, " ").trim());
        persons[id] = person;
        gedx.addPerson(person);
        return person;
      }
      function addParentChild(gedx, parent, child) {
        gedx.addRelationship({
          type: "http://gedcomx.org/ParentChild",
          person1: parent,
          person2: child
        });
      }
      function addCouple(gedx, p1, p2) {
        if (gedx.getRelationships().some(function(r) {
          return r.getType() === "http://gedcomx.org/Couple" && (r.getPerson1().getResource() === "#" + p1.getId() && r.getPerson2().getResource() === "#" + p2.getId() || r.getPerson1().getResource() === "#" + p2.getId() && r.getPerson2().getResource() === "#" + p1.getId());
        })) {
          return null;
        }
        return gedx.addRelationship({
          type: "http://gedcomx.org/Couple",
          person1: p1,
          person2: p2
        });
      }
      function addDatesFromListItem(person, text) {
        text = text.replace(/\s+/g, " ");
        var b = text.match(/\bb\. (.+?)(?:, d\. |$)/), d = text.match(/\bd\. (.+)$/);
        if (b && !hasFact(person, "http://gedcomx.org/Birth")) {
          person.addFact(makeFact("http://gedcomx.org/Birth", b[1].trim(), null));
        }
        if (d && !hasFact(person, "http://gedcomx.org/Death")) {
          person.addFact(makeFact("http://gedcomx.org/Death", d[1].trim(), null));
        }
      }
      function hasFact(person, type) {
        return (person.getFacts() || []).some(function(fact) {
          return fact.getType() === type;
        });
      }
      function makeFact(type, date, place) {
        var fact = GedcomX.Fact({ type });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        return fact;
      }
      var linkElements = {};
      function getSentences($narr) {
        var out = "";
        function walk(node) {
          for (var n = node.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3) {
              out += n.nodeValue;
            } else if (n.nodeType === 1) {
              var tag = n.nodeName.toLowerCase(), cls = n.className || "";
              if (tag === "sup" || /(^|\s)pid(\s|$)/.test(cls)) {
                continue;
              }
              if (tag === "br") {
                out += " ";
              } else if (tag === "a") {
                var href = n.getAttribute("href") || "", text = n.textContent.replace(/\s+/g, " ").trim(), personMatch = href.match(/#i(\d+)$/);
                if (/^pd\d+\.htm/.test(href)) {
                  out += "[[" + text + "]]" + (/\.$/.test(text) ? "." : "");
                } else if (personMatch) {
                  linkElements[personMatch[1]] = linkElements[personMatch[1]] || n;
                  out += "<<" + personMatch[1] + "|" + text + ">>";
                } else {
                  out += text;
                }
              } else {
                walk(n);
              }
            }
          }
        }
        walk($narr);
        out = out.replace(/ /g, " ").replace(/\s+/g, " ").trim();
        out = out.replace(/(<<|\[\[)(.*?)(>>|\]\])/g, function(m) {
          return m.replace(/\./g, "");
        });
        return out.split(/\.(?:\s+|$)/).map(function(s) {
          return s.replace(/\u0001/g, ".").trim();
        }).filter(Boolean);
      }
      function stripTokens(s) {
        return s.replace(/<<\d+\|(.*?)>>/g, "$1").replace(/\[\[(.*?)\]\]/g, "$1");
      }
      function findDate(text) {
        var matches = text.match(DATE_REGEX);
        return matches ? matches[0] : null;
      }
      function findPlace(text) {
        var m = text.match(/\[\[(.+?)\]\]/);
        return m ? m[1] : null;
      }
      var EVENTS = [
        { regex: /\bwas born\b(.*)$/, type: "http://gedcomx.org/Birth", key: "birth" },
        { regex: /\bwas (?:baptised|baptized)\b(.*)$/, type: "http://gedcomx.org/Baptism" },
        { regex: /\bwas christened\b(.*)$/, type: "http://gedcomx.org/Christening" },
        { regex: /\bdied\b(.*)$/, type: "http://gedcomx.org/Death", key: "death" },
        { regex: /\bwas buried\b(.*)$/, type: "http://gedcomx.org/Burial" },
        { regex: /\bwas cremated\b(.*)$/, type: "http://gedcomx.org/Cremation" },
        { regex: /\bwas (?:christened|confirmed)\b(.*)$/, type: "http://gedcomx.org/Christening" },
        { regex: /\b(?:lived|resided)\b(.*)$/, type: "http://gedcomx.org/Residence" },
        { regex: /\bemigrated\b(.*)$/, type: "http://gedcomx.org/Emigration" },
        { regex: /\bimmigrated\b(.*)$/, type: "http://gedcomx.org/Immigration" }
      ];
      function processSentence(sentence, primary, gedx, persons, facts, isFirst) {
        var parentMatch = sentence.match(/\bwas the (?:son|daughter|child) of (.*)$/);
        if (parentMatch && (isFirst || /^(?:He|She) /.test(sentence))) {
          var parentRe = /<<(\d+)\|(.*?)>>/g, m;
          var chunkMatch = parentMatch[1].match(/^<<\d+\|.*?>>(?: and <<\d+\|.*?>>)?/), chunk = chunkMatch ? chunkMatch[0] : "";
          while (m = parentRe.exec(chunk)) {
            var parent = getRelative(makeLink(m[1], m[2]), persons, gedx);
            if (parent) {
              addParentChild(gedx, parent, primary);
            }
          }
          var ids = [], cm, re2 = /<<(\d+)\|/g;
          while (cm = re2.exec(chunk)) {
            ids.push(cm[1]);
          }
          if (ids.length === 2 && persons[ids[0]] && persons[ids[1]]) {
            addCouple(gedx, persons[ids[0]], persons[ids[1]]);
          }
          return;
        }
        var marriageMatch = !(isFirst || /^(?:He|She) /.test(sentence)) ? null : sentence.match(/\bmarried(?:,? (?:firstly|secondly|thirdly|fourthly|fifthly|sixthly|seventhly),?)? <<(\d+)\|(.*?)>>(.*)$/);
        if (marriageMatch) {
          var spouse = getRelative(makeLink(marriageMatch[1], marriageMatch[2]), persons, gedx);
          if (spouse) {
            addCouple(gedx, primary, spouse);
            var rest = marriageMatch[3];
            var cleaned = rest.replace(/<<\d+\|.*?>>/g, "");
            var date = findDate(cleaned), place = findPlace(rest);
            var marriage = makeFact("http://gedcomx.org/Marriage", date, place);
            if (date || place) {
              primary.addFact(marriage);
            }
          }
          return;
        }
        for (var i = 0; i < EVENTS.length; i++) {
          var ev = EVENTS[i], evMatch = sentence.match(ev.regex);
          if (evMatch && /^(?:He|She|[A-ZÀ-Þ])/.test(sentence)) {
            var restText = evMatch[1], evDate = findDate(stripTokens(restText)), evPlace = findPlace(restText);
            if (evDate || evPlace) {
              primary.addFact(makeFact(ev.type, evDate, evPlace));
              if (ev.key) {
                facts[ev.key] = true;
              }
            } else if (ev.key) {
            }
            return;
          }
        }
      }
      function makeLink(id, text) {
        if (linkElements[id]) {
          return linkElements[id];
        }
        var $a = document.createElement("a");
        $a.setAttribute("href", "p0.htm#i" + id);
        $a.textContent = text;
        return $a;
      }
      function getHeadingText($h2) {
        var text = "";
        if ($h2) {
          for (var n = $h2.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3) {
              text += n.nodeValue;
            } else if (n.nodeType === 1 && n.nodeName.toLowerCase() !== "sup" && n.nodeName.toLowerCase() !== "img") {
              text += n.textContent;
            }
          }
        }
        return text.replace(/\s+/g, " ").trim();
      }
    }
  });

  // src/scrapers/gedbas.js
  var require_gedbas = __commonJS({
    "src/scrapers/gedbas.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:gedbas");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/gedbas\.genealogy\.net\/person\/show\/\d+/
      ];
      var FACT_TYPES = {
        "birth": "http://gedcomx.org/Birth",
        "baptism": "http://gedcomx.org/Baptism",
        "christening": "http://gedcomx.org/Christening",
        "death": "http://gedcomx.org/Death",
        "burial": "http://gedcomx.org/Burial",
        "cremation": "http://gedcomx.org/Cremation",
        "marriage": "http://gedcomx.org/Marriage",
        "divorce": "http://gedcomx.org/Divorce",
        "emigration": "http://gedcomx.org/Emigration",
        "immigration": "http://gedcomx.org/Immigration",
        "residence": "http://gedcomx.org/Residence",
        "occupation": "http://gedcomx.org/Occupation",
        "education": "http://gedcomx.org/Education",
        "religion": "http://gedcomx.org/Religion",
        "nationality": "http://gedcomx.org/Nationality",
        "naturalization": "http://gedcomx.org/Naturalization",
        "census": "http://gedcomx.org/Census",
        "confirmation": "http://gedcomx.org/Confirmation"
      };
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $h1 = document.querySelector("#bodyContent h1");
        if (!$h1 || !$h1.textContent.trim()) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), persons = {}, id = getId(document.location.pathname), name = $h1.textContent.replace(/\s+/g, " ").trim(), primary = createPerson(id, name);
        primary.setPrincipal(true);
        persons[id] = primary;
        gedx.addPerson(primary);
        addFacts(primary, document.querySelectorAll("#characteristics tbody tr"), true);
        addFacts(primary, document.querySelectorAll("#events tbody tr"), false);
        var $parents = document.querySelectorAll('#parents a[href*="/person/show/"]');
        for (var i = 0; i < $parents.length; i++) {
          var parent = getRelative($parents[i], persons, gedx);
          if (parent) {
            addParentChild(gedx, parent, primary);
          }
        }
        if ($parents.length === 2) {
          var p1 = persons[getId($parents[0].getAttribute("href"))], p2 = persons[getId($parents[1].getAttribute("href"))];
          if (p1 && p2) {
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: p1,
              person2: p2
            });
          }
        }
        var $rows = document.querySelectorAll("#spouses-and-children tbody tr");
        for (var r = 0; r < $rows.length; r++) {
          var $cells = $rows[r].querySelectorAll("td");
          if ($cells.length < 3) {
            continue;
          }
          var $spouseLink = $cells[1].querySelector('a[href*="/person/show/"]'), spouse = $spouseLink ? getRelative($spouseLink, persons, gedx) : null;
          if (spouse) {
            var relationship = GedcomX.Relationship({
              type: "http://gedcomx.org/Couple",
              person1: primary,
              person2: spouse
            });
            var spans = $cells[0].querySelectorAll("span"), marriageDate = spans[0] ? cleanDate(spans[0].textContent) : null, marriagePlace = spans[1] ? spans[1].textContent.trim() : null;
            if (marriageDate || marriagePlace) {
              var marriage = GedcomX.Fact({ type: "http://gedcomx.org/Marriage" });
              if (marriageDate) {
                marriage.setDate({ original: marriageDate });
              }
              if (marriagePlace) {
                marriage.setPlace({ original: marriagePlace });
              }
              relationship.addFact(marriage);
            }
            gedx.addRelationship(relationship);
          }
          var $children = $cells[2].querySelectorAll("li");
          for (var c = 0; c < $children.length; c++) {
            var $childLink = $children[c].querySelector('a[href*="/person/show/"]');
            if (!$childLink) {
              continue;
            }
            var child = getRelative($childLink, persons, gedx);
            if (!child) {
              continue;
            }
            var $date = $children[c].querySelector("span"), birthDate = $date ? cleanDate($date.textContent) : null;
            if (birthDate && !(child.getFacts() || []).length) {
              child.addFact(GedcomX.Fact({
                type: "http://gedcomx.org/Birth",
                date: { original: birthDate }
              }));
            }
            addParentChild(gedx, primary, child);
            if (spouse) {
              addParentChild(gedx, spouse, child);
            }
          }
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "de",
          value: "GEDBAS"
        }).setHomepage({
          resource: "https://gedbas.genealogy.net"
        }));
        var title = document.title || "GEDBAS - " + name;
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: '"' + title + '," GEDBAS (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getId(url) {
        var match = (url || "").match(/\/person\/show\/(\d+)/);
        return match ? match[1] : null;
      }
      function createPerson(id, name) {
        var person = GedcomX.Person({
          id,
          identifiers: {
            "genscrape": "genscrape://gedbas/" + id
          }
        });
        var words = name.split(" "), surnameWords = [], givenWords = words.slice();
        while (givenWords.length > 1) {
          var last = givenWords[givenWords.length - 1];
          if (last === last.toUpperCase() && last !== last.toLowerCase()) {
            surnameWords.unshift(givenWords.pop());
          } else {
            break;
          }
        }
        if (surnameWords.length) {
          var nameForm = GedcomX.NameForm();
          nameForm.setFullText(name);
          nameForm.addPart({ type: "http://gedcomx.org/Given", value: givenWords.join(" ") });
          nameForm.addPart({ type: "http://gedcomx.org/Surname", value: surnameWords.join(" ") });
          person.addName(GedcomX.Name().addNameForm(nameForm));
        } else {
          person.addSimpleName(name);
        }
        return person;
      }
      function getRelative($link, persons, gedx) {
        var id = getId($link.getAttribute("href"));
        if (!id) {
          return null;
        }
        if (!persons[id]) {
          persons[id] = createPerson(id, $link.textContent.replace(/\s+/g, " ").trim());
          gedx.addPerson(persons[id]);
        }
        return persons[id];
      }
      function addParentChild(gedx, parent, child) {
        gedx.addRelationship({
          type: "http://gedcomx.org/ParentChild",
          person1: parent,
          person2: child
        });
      }
      function cleanDate(text) {
        return (text || "").replace(/\s+/g, " ").replace(/(^|\s)(\d{1,2})\./g, "$1$2").trim();
      }
      function addFacts(person, $rows, hasValue) {
        for (var i = 0; i < $rows.length; i++) {
          var $cells = $rows[i].querySelectorAll("td"), offset = hasValue ? 1 : 0;
          if ($cells.length < 3 + offset) {
            continue;
          }
          var typeName = $cells[0].textContent.trim().toLowerCase(), type = FACT_TYPES[typeName];
          if (!type) {
            continue;
          }
          var value = hasValue ? $cells[1].textContent.replace(/\s+/g, " ").trim() : null, $dateSpans = $cells[1 + offset].querySelectorAll("span"), date = cleanDate($dateSpans.length ? $dateSpans[$dateSpans.length - 1].textContent : $cells[1 + offset].textContent), $placeSpan = $cells[2 + offset].querySelector("span"), place = ($placeSpan ? $placeSpan.textContent : $cells[2 + offset].textContent).replace(/\s+/g, " ").trim();
          if (!date && !place && !value) {
            continue;
          }
          var fact = GedcomX.Fact({ type });
          if (date) {
            fact.setDate({ original: date });
          }
          if (place) {
            fact.setPlace({ original: place });
          }
          if (value) {
            fact.setValue(value);
          }
          person.addFact(fact);
        }
      }
    }
  });

  // src/scrapers/rodovid.js
  var require_rodovid = __commonJS({
    "src/scrapers/rodovid.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:rodovid");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        utils.urlPatternToRegex("https://*.rodovid.org/wk/Person:*"),
        utils.urlPatternToRegex("http://*.rodovid.org/wk/Person:*"),
        utils.urlPatternToRegex("https://rodovid.org/wk/Person:*")
      ];
      var factTypes = {
        "birth": "http://gedcomx.org/Birth",
        "death": "http://gedcomx.org/Death",
        "burial": "http://gedcomx.org/Burial",
        "baptism": "http://gedcomx.org/Baptism",
        "christening": "http://gedcomx.org/Christening",
        "cremation": "http://gedcomx.org/Cremation",
        "occupation": "http://gedcomx.org/Occupation",
        "residence": "http://gedcomx.org/Residence",
        "emigration": "http://gedcomx.org/Emigration",
        "immigration": "http://gedcomx.org/Immigration",
        "education": "http://gedcomx.org/Education",
        "religion": "http://gedcomx.org/Religion",
        "nationality": "http://gedcomx.org/Nationality"
      };
      var valueFactTypes = [
        "http://gedcomx.org/Occupation",
        "http://gedcomx.org/Education",
        "http://gedcomx.org/Religion",
        "http://gedcomx.org/Nationality"
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $content = document.getElementById("mw-content-text"), $table = document.querySelector("table.persondata"), id = getRecordId(document.location.href);
        if (!$content || !$table || !id) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), fields = getFields($table), person = GedcomX.Person({
          id,
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(id)
          }
        }), relatives = {};
        gedx.addPerson(person);
        var fullName = clean(fields["Full name (at birth)"]), lineage = clean(fields["Lineage"]);
        if (fullName) {
          if (lineage && lineage !== "?" && fullName.length > lineage.length + 1 && fullName.slice(-lineage.length - 1) === " " + lineage) {
            person.addNameFromParts({
              "http://gedcomx.org/Given": fullName.slice(0, -lineage.length - 1),
              "http://gedcomx.org/Surname": lineage
            });
          } else {
            person.addSimpleName(fullName);
          }
        }
        setGender(person, fields["Sex"]);
        var parentsCell = findParentsCell($table);
        if (parentsCell) {
          toArray(parentsCell.querySelectorAll("p.event")).forEach(function(p) {
            var parent = getRelative(gedx, relatives, p);
            if (parent) {
              addRelationship(gedx, "http://gedcomx.org/ParentChild", parent, person);
            }
          });
        }
        toArray($content.children).filter(function(el) {
          return el.tagName === "P" && el.classList.contains("event");
        }).forEach(function(p) {
          var event = parseEvent(p);
          if (!event) {
            return;
          }
          var type = event.type;
          if (type === "child birth") {
            var child = getRelative(gedx, relatives, p);
            if (child) {
              addRelationship(gedx, "http://gedcomx.org/ParentChild", person, child);
            }
          } else if (type === "marriage" || type === "divorce" || type === "partnership" || type === "engagement") {
            var spouse = getRelative(gedx, relatives, p), factType = type === "marriage" ? "http://gedcomx.org/Marriage" : type === "divorce" ? "http://gedcomx.org/Divorce" : null, fact = factType ? createFact(factType, event) : null;
            if (spouse) {
              var rel = addRelationship(gedx, "http://gedcomx.org/Couple", person, spouse);
              if (fact) {
                rel.addFact(fact);
              }
            }
            if (fact) {
              person.addFact(createFact(factType, event));
            }
          } else if (factTypes[type]) {
            var f = createFact(factTypes[type], event);
            if (f) {
              person.addFact(f);
            }
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Rodovid"
        }).setHomepage({
          resource: "https://rodovid.org"
        }));
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: document.title + " (" + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function toArray(list) {
        return Array.prototype.slice.call(list);
      }
      function clean(str) {
        return (str || "").replace(/\s+/g, " ").trim();
      }
      function getFields($table) {
        var fields = {};
        toArray($table.querySelectorAll("tr")).forEach(function(tr) {
          var $label = tr.querySelector("td.fld"), $value = $label && $label.nextElementSibling;
          if ($label && $value) {
            fields[clean($label.textContent)] = clean($value.textContent);
          }
        });
        return fields;
      }
      function findParentsCell($table) {
        var cells = toArray($table.querySelectorAll("td[colspan]"));
        for (var i = 0; i < cells.length; i++) {
          var b = cells[i].querySelector("b");
          if (b && clean(b.textContent) === "Parents") {
            return cells[i];
          }
        }
      }
      function setGender(person, sex) {
        switch ((sex || "").toLowerCase()) {
          case "male":
            person.setGender({ type: "http://gedcomx.org/Male" });
            break;
          case "female":
            person.setGender({ type: "http://gedcomx.org/Female" });
            break;
        }
      }
      function parseEvent(p) {
        var $date = p.querySelector("b"), text = clean(p.textContent), date = $date ? cleanDate($date.textContent) : "";
        if ($date) {
          text = clean(text.replace(clean($date.textContent), ""));
        }
        var colon = text.indexOf(":");
        if (colon === -1) {
          return null;
        }
        var type = text.slice(0, colon).trim().toLowerCase(), value = text.slice(colon + 1).trim(), places = toArray(p.querySelectorAll('a[href*="/wk/Place:"]')).map(function(a) {
          return clean(a.textContent);
        }).filter(function(s) {
          return s && s !== "?";
        });
        return {
          type,
          date,
          place: places.join(", "),
          value
        };
      }
      function cleanDate(str) {
        str = clean(str);
        if (/^(about|before|after|\?)?$/i.test(str)) {
          return "";
        }
        return str;
      }
      function createFact(type, event) {
        var fact = GedcomX.Fact({ type });
        if (event.date) {
          fact.setDate({ original: event.date });
        }
        if (event.place) {
          fact.setPlace({ original: event.place });
        }
        if (valueFactTypes.indexOf(type) !== -1 && event.value) {
          fact.setValue(event.value);
        }
        if (!event.date && !event.place && !fact.getValue()) {
          return;
        }
        return fact;
      }
      function getRelative(gedx, relatives, el) {
        var $link = el.querySelector('a[href*="/wk/Person:"]');
        if (!$link) {
          return;
        }
        var id = getRecordId($link.getAttribute("href"));
        if (!id) {
          return;
        }
        if (relatives[id]) {
          return relatives[id];
        }
        var relative = GedcomX.Person({
          id,
          identifiers: {
            "genscrape": getRecordIdentifier(id)
          }
        });
        var name = clean($link.textContent).replace(/\?/g, "").replace(/\(\s*\)/g, "");
        relative.addSimpleName(clean(name));
        var $gender = $link.previousElementSibling;
        if ($gender) {
          var symbol = clean($gender.textContent);
          setGender(relative, symbol === "\u2642" ? "male" : symbol === "\u2640" ? "female" : "");
        }
        var after = clean(getTextAfter($link)), born = after.match(/(?:^|\s)b\. (.*?)(?= d\. |$)/), died = after.match(/(?:^|\s)d\. (.*)$/);
        if (born && cleanDate(born[1])) {
          relative.addFact(GedcomX.Fact({
            type: "http://gedcomx.org/Birth",
            date: { original: cleanDate(born[1]) }
          }));
        }
        if (died && cleanDate(died[1])) {
          relative.addFact(GedcomX.Fact({
            type: "http://gedcomx.org/Death",
            date: { original: cleanDate(died[1]) }
          }));
        }
        gedx.addPerson(relative);
        relatives[id] = relative;
        return relative;
      }
      function getTextAfter($el) {
        var text = "", node = $el.nextSibling;
        while (node) {
          text += node.textContent;
          node = node.nextSibling;
        }
        return text;
      }
      function addRelationship(gedx, type, person1, person2) {
        var existing = gedx.getRelationships().filter(function(r) {
          return r.getType() === type && r.getPerson1().getResource() === "#" + person1.getId() && r.getPerson2().getResource() === "#" + person2.getId();
        })[0];
        if (existing) {
          return existing;
        }
        var rel = GedcomX.Relationship({
          type,
          person1,
          person2
        });
        gedx.addRelationship(rel);
        return rel;
      }
      function getRecordId(url) {
        var match = (url || "").match(/Person:(\d+)/);
        return match ? match[1] : void 0;
      }
      function getRecordIdentifier(id) {
        return "genscrape://rodovid/" + id;
      }
    }
  });

  // src/scrapers/geneanet.js
  var require_geneanet = __commonJS({
    "src/scrapers/geneanet.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:geneanet");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/gw\.geneanet\.org\/[^\/?#]+\?(?=[^#]*[?&]n=)(?=[^#]*[?&]p=)(?![^#]*[?&]m=)/
      ];
      var eventTypes = [
        [/^(Born|N[ée]e?)\b\s*/i, "http://gedcomx.org/Birth"],
        [/^(Baptized|Baptis[ée]e?)\b\s*/i, "http://gedcomx.org/Baptism"],
        [/^(Deceased|D[ée]c[ée]d[ée]e?)\b\s*/i, "http://gedcomx.org/Death"],
        [/^(Buried|Inhum[ée]e?)\b\s*/i, "http://gedcomx.org/Burial"],
        [/^(Cremated|Incin[ée]r[ée]e?)\b\s*/i, "http://gedcomx.org/Cremation"]
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var $perso = document.getElementById("perso"), $h1 = $perso && $perso.querySelector("h1.name"), info = parseLink(document.location.href);
        if (!$perso || !$h1 || !info) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), person = GedcomX.Person({
          id: info.id,
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(info.id)
          }
        }), relatives = {};
        gedx.addPerson(person);
        var given = "", surname = "";
        toArray($h1.querySelectorAll("a")).forEach(function(a) {
          var href = a.getAttribute("href") || "", text = clean(a.textContent);
          if (/[?&]m=P(&|$)/.test(href)) {
            given = text;
          } else if (/[?&]m=N(&|$)/.test(href)) {
            surname = text;
          }
        });
        if (given || surname) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": given,
            "http://gedcomx.org/Surname": surname
          });
        }
        var $sex = $h1.querySelector("img");
        if ($sex) {
          var src = $sex.getAttribute("src") || "";
          if (/female/.test(src)) {
            person.setGender({ type: "http://gedcomx.org/Female" });
          } else if (/male/.test(src)) {
            person.setGender({ type: "http://gedcomx.org/Male" });
          }
        }
        var $titleBlock = document.getElementById("person-title"), $events = $titleBlock && nextElement($titleBlock.parentNode.parentNode, "ul") || $perso.querySelector("ul");
        if ($events) {
          toArray($events.children).forEach(function(li) {
            var fact = parseEvent(clean(li.textContent));
            if (fact) {
              person.addFact(fact);
            }
          });
        }
        toArray($perso.querySelectorAll("h2")).forEach(function(h2) {
          var heading = clean(h2.textContent), $ul = nextElement(h2, "ul");
          if (!$ul) {
            return;
          }
          if (/^Parents$/i.test(heading)) {
            toArray($ul.children).forEach(function(li) {
              var parent = getRelative(gedx, relatives, directLink(li));
              if (parent) {
                addRelationship(gedx, "http://gedcomx.org/ParentChild", parent, person);
              }
            });
          } else if (/^(Spouses?|Conjoints?|Mariages?|Unions?|Marriages?)\b/i.test(heading)) {
            toArray($ul.children).forEach(function(li) {
              var spouse = getRelative(gedx, relatives, directLink(li));
              if (!spouse) {
                return;
              }
              var rel = addRelationship(gedx, "http://gedcomx.org/Couple", person, spouse), marriage = parseMarriage(li);
              if (marriage) {
                rel.addFact(marriage);
                person.addFact(parseMarriage(li));
              }
              var $children = li.querySelector("ul");
              if ($children) {
                toArray($children.children).forEach(function(childLi) {
                  var child = getRelative(gedx, relatives, directLink(childLi));
                  if (child) {
                    addRelationship(gedx, "http://gedcomx.org/ParentChild", person, child);
                    addRelationship(gedx, "http://gedcomx.org/ParentChild", spouse, child);
                  }
                });
              }
            });
          }
        });
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Geneanet"
        }).setHomepage({
          resource: "https://www.geneanet.org"
        }));
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: document.title + " (" + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function toArray(list) {
        return Array.prototype.slice.call(list);
      }
      function clean(str) {
        return (str || "").replace(/\s+/g, " ").trim();
      }
      function nextElement($el, tag) {
        var el = $el.nextElementSibling;
        while (el) {
          if (el.tagName.toLowerCase() === tag) {
            return el;
          }
          if (el.tagName === "H2") {
            return;
          }
          el = el.nextElementSibling;
        }
      }
      function directLink(li) {
        var children = toArray(li.children);
        for (var i = 0; i < children.length; i++) {
          if (children[i].tagName === "A") {
            return children[i];
          }
        }
      }
      function parseLink(href) {
        if (!href) {
          return;
        }
        var parts = href.replace(/#.*$/, "").split("?"), user = parts[0].split("/").pop(), query = {};
        (parts[1] || "").split("&").forEach(function(pair) {
          var kv = pair.split("=");
          try {
            query[kv[0]] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
          } catch (e) {
            query[kv[0]] = kv[1];
          }
        });
        if (!user || !query.n || !query.p) {
          return;
        }
        var id = [user, query.n, query.p];
        if (query.oc && query.oc !== "0") {
          id.push(query.oc);
        }
        return {
          id: id.join(".").replace(/\s+/g, "_"),
          n: query.n,
          p: query.p,
          oc: query.oc
        };
      }
      function cleanDate(date) {
        return clean(date).replace(/\s*\([^)]*\)/g, "").replace(/^(on|in|le|en|vers)\s+/i, "").trim();
      }
      function parseEvent(text) {
        for (var i = 0; i < eventTypes.length; i++) {
          if (eventTypes[i][0].test(text)) {
            var rest = text.replace(eventTypes[i][0], ""), dash = rest.indexOf(" - "), date = dash === -1 ? rest : rest.slice(0, dash), place = dash === -1 ? "" : rest.slice(dash + 3);
            place = place.replace(/,?\s*(aged|âgée?)\s.*$/i, "");
            if (dash === -1) {
              date = date.replace(/,?\s*(aged|âgée?)\s.*$/i, "");
            }
            date = cleanDate(date);
            place = clean(place);
            if (!date && !place) {
              return;
            }
            var fact = GedcomX.Fact({ type: eventTypes[i][1] });
            if (date) {
              fact.setDate({ original: date });
            }
            if (place) {
              fact.setPlace({ original: place });
            }
            return fact;
          }
        }
      }
      function parseMarriage(li) {
        var text = "", node = li.firstChild;
        while (node && node !== directLink(li)) {
          text += node.textContent;
          node = node.nextSibling;
        }
        text = clean(text);
        var match = text.match(/^(Married|Mari[ée]e?)\s*(.*?)\s*(?:to|à|avec)?$/i);
        if (!match) {
          return;
        }
        var rest = match[2].replace(/\s+(to|à|avec)$/i, ""), dash = rest.indexOf(" - "), date = cleanDate(dash === -1 ? rest : rest.slice(0, dash)), place = dash === -1 ? "" : clean(rest.slice(dash + 3));
        var fact = GedcomX.Fact({ type: "http://gedcomx.org/Marriage" });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        return fact;
      }
      function getRelative(gedx, relatives, $link) {
        if (!$link) {
          return;
        }
        var info = parseLink($link.getAttribute("href"));
        if (!info) {
          return;
        }
        if (relatives[info.id]) {
          return relatives[info.id];
        }
        var relative = GedcomX.Person({
          id: info.id,
          identifiers: {
            "genscrape": getRecordIdentifier(info.id)
          }
        });
        relative.addSimpleName(clean($link.textContent));
        var $bdo = $link.nextElementSibling;
        while ($bdo && $bdo.tagName !== "BDO") {
          if ($bdo.tagName === "A") {
            $bdo = null;
            break;
          }
          $bdo = $bdo.nextElementSibling;
        }
        if ($bdo) {
          var life = clean($bdo.textContent).split("-"), born = clean(life[0]), died = clean(life[1]);
          if (born) {
            relative.addFact(GedcomX.Fact({
              type: "http://gedcomx.org/Birth",
              date: { original: born }
            }));
          }
          if (died) {
            relative.addFact(GedcomX.Fact({
              type: "http://gedcomx.org/Death",
              date: { original: died }
            }));
          }
        }
        gedx.addPerson(relative);
        relatives[info.id] = relative;
        return relative;
      }
      function addRelationship(gedx, type, person1, person2) {
        var existing = gedx.getRelationships().filter(function(r) {
          return r.getType() === type && r.getPerson1().getResource() === "#" + person1.getId() && r.getPerson2().getResource() === "#" + person2.getId();
        })[0];
        if (existing) {
          return existing;
        }
        var rel = GedcomX.Relationship({
          type,
          person1,
          person2
        });
        gedx.addRelationship(rel);
        return rel;
      }
      function getRecordIdentifier(id) {
        return "genscrape://geneanet/" + id;
      }
    }
  });

  // src/scrapers/geni.js
  var require_geni = __commonJS({
    "src/scrapers/geni.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:geni");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(www\.)?geni\.com\/people\/[^\/?#]+\/\d+/
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var id = getRecordId(document.location.href), $birth = document.getElementById("birth_date"), $table = findTable($birth) || document.querySelector("table.data_table"), $name = document.querySelector('[itemprop="mainEntity"] > h1[itemprop="name"]') || document.querySelector('h1[itemprop="name"]');
        if (!id || !$table || !$name) {
          return emitter.emit("noData");
        }
        var gedx = new GedcomX(), person = GedcomX.Person({
          id,
          principal: true,
          identifiers: {
            "genscrape": getRecordIdentifier(id)
          }
        }), relatives = {}, rows = getRows($table);
        gedx.addPerson(person);
        person.addSimpleName(baseName($name.textContent));
        var birthDate = rows["Birthdate"] && clean(rows["Birthdate"].textContent), birthPlace = rows["Birthplace"] && clean(rows["Birthplace"].textContent);
        addFact(person, "http://gedcomx.org/Birth", birthDate, birthPlace);
        if (rows["Death"]) {
          var death = parseDeath(rows["Death"]);
          addFact(person, "http://gedcomx.org/Death", death.date, death.place);
        }
        if (rows["Place of Burial"]) {
          addFact(person, "http://gedcomx.org/Burial", null, clean(rows["Place of Burial"].textContent));
        }
        if (rows["Christening"] || rows["Baptism"]) {
          var $bap = rows["Christening"] || rows["Baptism"];
          addFact(
            person,
            $bap === rows["Christening"] ? "http://gedcomx.org/Christening" : "http://gedcomx.org/Baptism",
            null,
            clean($bap.textContent)
          );
        }
        if (rows["Occupation"]) {
          var occupation = clean(rows["Occupation"].textContent);
          if (occupation) {
            person.addFact({
              type: "http://gedcomx.org/Occupation",
              value: occupation
            });
          }
        }
        if (rows["Immediate Family"]) {
          parseFamily(gedx, person, relatives, rows["Immediate Family"]);
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Geni"
        }).setHomepage({
          resource: "https://www.geni.com"
        }));
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: document.title
            }
          ],
          citations: [
            {
              value: document.title + " (" + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function baseName(name) {
        name = clean(name);
        var base = name.split(",")[0].trim();
        return base.indexOf(" ") !== -1 ? base : name;
      }
      function findTable($el) {
        while ($el && $el.tagName !== "TABLE") {
          $el = $el.parentNode;
        }
        return $el || null;
      }
      function toArray(list) {
        return Array.prototype.slice.call(list);
      }
      function clean(str) {
        return (str || "").replace(/\s+/g, " ").trim();
      }
      function getRows($table) {
        var rows = {};
        toArray($table.querySelectorAll("tr")).forEach(function(tr) {
          var cells = toArray(tr.children).filter(function(c) {
            return c.tagName === "TD" || c.tagName === "TH";
          });
          if (cells.length === 2) {
            var label = clean(cells[0].textContent).replace(/:$/, "");
            if (label) {
              rows[label] = cells[1];
            }
          }
        });
        return rows;
      }
      function parseDeath($cell) {
        var $date = $cell.querySelector('[itemprop="deathDate"]'), date = $date ? clean($date.textContent) : "", place = "", parts = $cell.innerHTML.split(/<br\s*\/?>/i);
        if (parts.length > 1) {
          var tmp = new DOMParser().parseFromString(parts.slice(1).join(" "), "text/html").body;
          place = clean(tmp.textContent).replace(/\s*\([^()]*\)$/, "");
        } else if (!$date) {
          date = clean($cell.textContent).replace(/\s*\(\d+\)$/, "");
        }
        return { date, place };
      }
      function addFact(person, type, date, place) {
        if (!date && !place) {
          return;
        }
        var fact = GedcomX.Fact({ type });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        person.addFact(fact);
      }
      function parseFamily(gedx, person, relatives, $cell) {
        var lines = [[]];
        toArray($cell.querySelectorAll("p")).forEach(function($p) {
          toArray($p.childNodes).forEach(function(node) {
            if (node.nodeType === 1 && node.tagName === "BR") {
              lines.push([]);
            } else {
              lines[lines.length - 1].push(node);
            }
          });
        });
        lines.forEach(function(nodes) {
          var label = clean(nodes.filter(function(n) {
            return n.nodeType === 3;
          }).map(function(n) {
            return n.textContent;
          })[0] || "");
          var links = [];
          nodes.forEach(function(n) {
            if (n.nodeType !== 1) {
              return;
            }
            if (n.tagName === "A") {
              links.push(n);
            } else {
              toArray(n.querySelectorAll("a")).forEach(function(a) {
                links.push(a);
              });
            }
          });
          links = links.filter(function(a) {
            return /geni\.com\/people\/[^\/]+\/\d+/.test(a.getAttribute("href") || "");
          });
          if (!label || !links.length) {
            return;
          }
          var lower = label.toLowerCase().replace(/\s+of$/, "");
          if (/^(biological |adopted |foster |step)?(son|daughter|child)$/.test(lower)) {
            var parentType = /^biological/.test(lower) ? "http://gedcomx.org/BiologicalParent" : /^adopted/.test(lower) ? "http://gedcomx.org/AdoptiveParent" : /^foster/.test(lower) ? "http://gedcomx.org/FosterParent" : null;
            if (/^step/.test(lower)) {
              return;
            }
            if (/daughter/.test(lower)) {
              person.setGender({ type: "http://gedcomx.org/Female" });
            } else if (/son/.test(lower)) {
              person.setGender({ type: "http://gedcomx.org/Male" });
            }
            links.forEach(function(a) {
              var parent = getRelative(gedx, relatives, a);
              if (parent) {
                var rel = addRelationship(gedx, "http://gedcomx.org/ParentChild", parent, person);
                if (parentType && !rel.getFacts().length) {
                  rel.addFact({ type: parentType });
                }
              }
            });
          } else if (/^(husband|wife|partner|ex-husband|ex-wife|ex-partner)$/.test(lower)) {
            if (lower === "husband") {
              person.setGender({ type: "http://gedcomx.org/Male" });
            } else if (lower === "wife") {
              person.setGender({ type: "http://gedcomx.org/Female" });
            }
            links.forEach(function(a) {
              var spouse = getRelative(gedx, relatives, a);
              if (spouse) {
                addRelationship(gedx, "http://gedcomx.org/Couple", person, spouse);
              }
            });
          } else if (/^(father|mother|parent)$/.test(lower)) {
            if (lower === "father") {
              person.setGender({ type: "http://gedcomx.org/Male" });
            } else if (lower === "mother") {
              person.setGender({ type: "http://gedcomx.org/Female" });
            }
            links.forEach(function(a) {
              var child = getRelative(gedx, relatives, a);
              if (child) {
                addRelationship(gedx, "http://gedcomx.org/ParentChild", person, child);
              }
            });
          }
        });
      }
      function getRelative(gedx, relatives, $link) {
        var id = getRecordId($link.getAttribute("href"));
        if (!id) {
          return;
        }
        if (relatives[id]) {
          return relatives[id];
        }
        var relative = GedcomX.Person({
          id,
          identifiers: {
            "genscrape": getRecordIdentifier(id)
          }
        });
        relative.addSimpleName(baseName($link.textContent));
        gedx.addPerson(relative);
        relatives[id] = relative;
        return relative;
      }
      function addRelationship(gedx, type, person1, person2) {
        var existing = gedx.getRelationships().filter(function(r) {
          return r.getType() === type && r.getPerson1().getResource() === "#" + person1.getId() && r.getPerson2().getResource() === "#" + person2.getId();
        })[0];
        if (existing) {
          return existing;
        }
        var rel = GedcomX.Relationship({
          type,
          person1,
          person2
        });
        gedx.addRelationship(rel);
        return rel;
      }
      function getRecordId(url) {
        var match = (url || "").match(/geni\.com\/people\/[^\/?#]+\/(\d+)/);
        return match ? match[1] : void 0;
      }
      function getRecordIdentifier(id) {
        return "genscrape://geni/" + id;
      }
    }
  });

  // src/scrapers/digitalarkivet.js
  var require_digitalarkivet = __commonJS({
    "src/scrapers/digitalarkivet.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:digitalarkivet");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(?:www\.)?digitalarkivet\.no\/(?:[a-z]{2}\/)?(?:census\/person\/pf\d+|view\/\d+\/p[a-z]\d+)/
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var values = getLabeledValues(document.querySelector(".left-view-column") || document), recordId = getRecordId(), isCensus = /\/census\/person\//.test(document.location.href), recordPrefix = recordId.substr(0, 2), gedx = new GedcomX(), person = GedcomX.Person({
          principal: true,
          id: recordId,
          identifiers: {
            "genscrape": getRecordIdentifier(recordId)
          }
        }), sourceTitle;
        gedx.addPerson(person);
        var gender = clean(values["Gender"]);
        if (gender === "m") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (gender === "k") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        if (isCensus) {
          sourceTitle = processCensus(gedx, person, values);
        } else {
          sourceTitle = processChurchRecord(gedx, person, values, recordPrefix);
        }
        if (!person.getNames().length) {
          emitter.emit("noData");
          return;
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Digitalarkivet (The Digital Archive)"
        }).setHomepage({
          resource: "https://www.digitalarkivet.no"
        }));
        var name = person.getNames()[0].getNameForms()[0].getFullText() || "", title = name + (sourceTitle ? " - " + sourceTitle : "");
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: '"' + (sourceTitle || "Digitalarkivet") + '," database, Digitalarkivet, The National Archives of Norway (' + document.location.href + " : accessed " + utils.getDateString() + "), entry for " + name + "."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function processCensus(gedx, person, values) {
        var h1 = document.querySelector("h1"), fullName = h1 ? h1.textContent.replace(/^\s*Person:\s*/, "").replace(/^\s*\d+\s+/, "").replace(/\s+/g, " ").trim() : "", sourceLink = document.querySelector('.da-breadcrumb a[href*="/source/"]'), sourceTitle = sourceLink ? sourceLink.textContent.trim() : "", yearMatch = /(\d{4})/.exec(sourceTitle), municipalityMatch = /census for (.+)$/i.exec(sourceTitle), residenceLink = document.querySelector('.da-breadcrumb a[href*="residence/"]'), residence = residenceLink ? residenceLink.textContent.replace(/^\s*\d+\w*\s+/, "").trim() : "", place = [residence, municipalityMatch ? municipalityMatch[1].trim() : "", "Norway"].filter(Boolean).join(", ");
        person.addSimpleName(fullName);
        addFact(person, "http://gedcomx.org/Birth", clean(values["Date of birth"]), clean(values["Place of birth"]));
        if (yearMatch) {
          addFact(person, "http://gedcomx.org/Census", yearMatch[1], place);
          addFact(person, "http://gedcomx.org/Residence", yearMatch[1], place);
        }
        addFact(person, "http://gedcomx.org/Occupation", null, null, clean(values["Occupation"]));
        addFact(person, "http://gedcomx.org/MaritalStatus", null, null, clean(values["Marital status"]));
        var familyPosition = clean(values["Family position"]), members = [], parents = [], spouse, children = [];
        Array.from(document.querySelectorAll("#accordion-persons .data-item")).forEach(function(item) {
          var link = item.querySelector("h4 a");
          if (!link) {
            return;
          }
          var id = getRecordIdFromUrl(link.href);
          if (id === person.getId()) {
            return;
          }
          var itemValues = getLabeledValues(item);
          if (clean(itemValues["H.no."]) !== clean(values["Household no."])) {
            return;
          }
          var position = clean(itemValues["Family position"]), relative = GedcomX.Person({
            id,
            identifiers: {
              "genscrape": getRecordIdentifier(id)
            }
          }).addSimpleName(link.textContent.replace(/\s+/g, " ").replace(/^\s*\d+\s+/, "").trim()), born = clean(itemValues["Age/born"]);
          if (/^\d{4}(-\d\d-\d\d)?$/.test(born || "")) {
            addFact(relative, "http://gedcomx.org/Birth", born, clean(itemValues["Place of birth"]));
          }
          if (position === "hf" || position === "s") {
            relative.setGender({ type: "http://gedcomx.org/Male" });
          } else if (position === "hm" || position === "d") {
            relative.setGender({ type: "http://gedcomx.org/Female" });
          }
          members.push({ position, person: relative });
        });
        var heads = members.filter(function(m) {
          return m.position === "hf";
        }).length + (familyPosition === "hf" ? 1 : 0), mothers = members.filter(function(m) {
          return m.position === "hm";
        }).length + (familyPosition === "hm" ? 1 : 0);
        if (heads <= 1 && mothers <= 1) {
          members.forEach(function(member) {
            var position = member.position;
            if (familyPosition === "s" || familyPosition === "d") {
              if (position === "hf" || position === "hm") {
                parents.push(member.person);
              }
            } else if (familyPosition === "hf" && position === "hm" || familyPosition === "hm" && position === "hf") {
              spouse = member.person;
            } else if ((familyPosition === "hf" || familyPosition === "hm") && (position === "s" || position === "d")) {
              children.push(member.person);
            }
          });
        }
        parents.forEach(function(parent) {
          gedx.addPerson(parent);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: parent,
            person2: person
          });
        });
        if (parents.length === 2) {
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: parents[0],
            person2: parents[1]
          });
        }
        if (spouse) {
          gedx.addPerson(spouse);
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: person,
            person2: spouse
          });
        }
        children.forEach(function(child) {
          gedx.addPerson(child);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: person,
            person2: child
          });
          if (spouse) {
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: spouse,
              person2: child
            });
          }
        });
        return sourceTitle;
      }
      function processChurchRecord(gedx, person, values, prefix) {
        var infobox = document.querySelector(".infobox"), sourceTitle = infobox ? utils.maybe(infobox.querySelector("p.ssp-semibold")).textContent : "", infoValues = infobox ? getLabeledValues(infobox) : {}, eventLink = infobox ? infobox.querySelector(".parent p a") : null, eventDate = eventLink ? eventLink.textContent.trim() : "", role = clean(values["Role"]), givenName = cleanName(values["Given name"]), surname = cleanName(values["Last name"]);
        sourceTitle = sourceTitle ? sourceTitle.replace(/\s+/g, " ").trim() : "";
        if (givenName || surname) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": givenName,
            "http://gedcomx.org/Surname": surname
          });
          person.getNames()[0].getNameForms()[0].setFullText([givenName, surname].filter(Boolean).join(" "));
        } else {
          var h1 = document.querySelector("h1");
          if (h1) {
            person.addSimpleName(cleanName(h1.textContent.replace(/^\s*Person:\s*/, "")));
          }
        }
        var eventPlace = clean(values["Parish/Church"]) || clean(infoValues["Parish/Church"]) || firstGeographicArea(infobox);
        if (eventPlace) {
          eventPlace = [eventPlace, clean(infoValues["County"]), "Norway"].filter(Boolean).join(", ");
        }
        addFact(person, "http://gedcomx.org/Birth", combineDate(clean(values["Date of birth"]), clean(values["Birth year"])), clean(values["Birth place"]));
        addFact(person, "http://gedcomx.org/Residence", null, clean(values["Residence"]));
        switch (prefix) {
          // Births and baptisms
          case "pd":
            if (role === "barn") {
              addFact(person, "http://gedcomx.org/Baptism", eventDate || combineDate(clean(values["Baptism date"]), clean(values["Year"])), eventPlace);
              processFamily(gedx, person, "barn");
            } else if (role === "far" || role === "mor") {
              processFamily(gedx, person, role);
            }
            break;
          // Deaths and burials
          case "pg":
            addFact(person, "http://gedcomx.org/Death", combineDate(clean(values["Date of death"]), clean(values["Year of death"])), null);
            addFact(person, "http://gedcomx.org/Burial", eventDate || combineDate(clean(values["Burial date"]), clean(values["Year"])), eventPlace);
            break;
          // Confirmations
          case "pk":
            addFact(person, "http://gedcomx.org/Confirmation", eventDate, eventPlace);
            break;
          // Marriages
          case "pv":
            processMarriage(gedx, person, role, eventDate || combineDate(clean(values["Marriage date"]), clean(values["Year"])), eventPlace);
            break;
        }
        return sourceTitle;
      }
      function processFamily(gedx, person, role) {
        var father, mother, child;
        getInvolved().forEach(function(entry) {
          if (entry.current) {
            return;
          }
          if (entry.role === "far" && !father) {
            father = createInvolvedPerson(entry, "http://gedcomx.org/Male");
          } else if (entry.role === "mor" && !mother) {
            mother = createInvolvedPerson(entry, "http://gedcomx.org/Female");
          } else if (entry.role === "barn" && !child) {
            child = createInvolvedPerson(entry);
          }
        });
        if (role === "barn") {
          if (father) {
            gedx.addPerson(father);
            gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: father, person2: person });
          }
          if (mother) {
            gedx.addPerson(mother);
            gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: mother, person2: person });
          }
          if (father && mother) {
            gedx.addRelationship({ type: "http://gedcomx.org/Couple", person1: father, person2: mother });
          }
        } else {
          var other = role === "far" ? mother : father;
          if (other) {
            gedx.addPerson(other);
            gedx.addRelationship({ type: "http://gedcomx.org/Couple", person1: person, person2: other });
          }
          if (child) {
            gedx.addPerson(child);
            gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: person, person2: child });
            if (other) {
              gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: other, person2: child });
            }
          }
        }
      }
      function processMarriage(gedx, person, role, date, place) {
        var spouse;
        getInvolved().forEach(function(entry) {
          if (!spouse && !entry.current && (entry.role === "brudgom" || entry.role === "brur")) {
            spouse = createInvolvedPerson(entry, entry.role === "brudgom" ? "http://gedcomx.org/Male" : "http://gedcomx.org/Female");
          }
        });
        if (role === "brudgom") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (role === "brur") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        if (spouse) {
          gedx.addPerson(spouse);
          var couple = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: person,
            person2: spouse
          });
          var fact = createFact("http://gedcomx.org/Marriage", date, place);
          if (fact) {
            couple.addFact(fact);
          }
          gedx.addRelationship(couple);
        } else {
          addFact(person, "http://gedcomx.org/Marriage", date, place);
        }
      }
      function getInvolved() {
        var entries = [];
        Array.from(document.querySelectorAll(".left-view-column .data-item")).forEach(function(item) {
          var v = getLabeledValues(item), link = item.querySelector("h4 a");
          if (v["Role"] && v["Name"]) {
            entries.push({
              role: clean(v["Role"]),
              name: cleanName(v["Name"]),
              position: clean(v["Position"]),
              birthYear: clean(v["Birth year"]),
              birthPlace: clean(v["Birth place"]),
              residence: clean(v["Residence"]),
              id: link ? getRecordIdFromUrl(link.href) : null,
              current: (" " + item.className + " ").indexOf(" current ") !== -1
            });
          }
        });
        return entries;
      }
      function createInvolvedPerson(entry, gender) {
        if (!entry.name) {
          return;
        }
        var person = GedcomX.Person().addSimpleName(entry.name);
        if (entry.id) {
          person.setId(entry.id);
          person.setIdentifiers({ "genscrape": getRecordIdentifier(entry.id) });
        }
        if (gender) {
          person.setGender({ type: gender });
        }
        addFact(person, "http://gedcomx.org/Birth", entry.birthYear, entry.birthPlace);
        addFact(person, "http://gedcomx.org/Residence", null, entry.residence);
        return person;
      }
      function firstGeographicArea(infobox) {
        if (!infobox) {
          return "";
        }
        var rows = Array.from(infobox.querySelectorAll(".row"));
        for (var i = 0; i < rows.length; i++) {
          if (/^Geographic area/.test(rows[i].textContent.trim())) {
            var html = rows[i].children[1] ? rows[i].children[1].innerHTML : "", first = html.split(/<br\s*\/?>/i)[0].replace(/<[^>]+>/g, "").trim();
            return first.replace(/\s+parish$/i, "");
          }
        }
        return "";
      }
      function combineDate(date, year) {
        if (date && /^\d{4}/.test(date)) {
          return date;
        }
        if (year && date) {
          return year + "-" + date;
        }
        return year || void 0;
      }
      function createFact(type, date, place, value) {
        if (!date && !place && !value) {
          return;
        }
        var fact = GedcomX.Fact({ type });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        if (value) {
          fact.setValue(value);
        }
        return fact;
      }
      function addFact(person, type, date, place, value) {
        var fact = createFact(type, date, place, value);
        if (fact) {
          person.addFact(fact);
        }
      }
      function getLabeledValues(root) {
        var map = {};
        Array.from(root.querySelectorAll(".ssp-semibold")).forEach(function(valueEl) {
          var labelEl = valueEl.previousElementSibling;
          if (labelEl && labelEl.className.indexOf("ssp-semibold") === -1) {
            var label = labelEl.textContent.replace(/\s+/g, " ").trim().replace(/:$/, "");
            if (label && map[label] === void 0) {
              map[label] = valueEl.textContent.replace(/\s+/g, " ").trim();
            }
          }
        });
        return map;
      }
      function clean(value) {
        if (value === void 0 || value === null) {
          return void 0;
        }
        value = value.replace(/\s+/g, " ").trim();
        return value && value !== "-" ? value : void 0;
      }
      function cleanName(value) {
        value = clean(value);
        if (value) {
          value = value.replace(/!+/g, "").replace(/^[?\s]+/, "").replace(/\s+/g, " ").trim();
        }
        return value || void 0;
      }
      function getRecordId() {
        var id = getRecordIdFromUrl(document.location.href), permanent = document.getElementById("permanentId");
        if (permanent && permanent.textContent.trim()) {
          id = permanent.textContent.trim();
        }
        return id;
      }
      function getRecordIdFromUrl(url) {
        var match = /\/(p[a-z]\d+)(?:[\/?#]|$)/.exec(url || "");
        return match ? match[1] : "";
      }
      function getRecordIdentifier(id) {
        return "genscrape://digitalarkivet/" + id;
      }
    }
  });

  // src/scrapers/legacy.js
  var require_legacy = __commonJS({
    "src/scrapers/legacy.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:legacy");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(?:www\.)?legacy\.com\/(?:[a-z]{2}\/)?obituaries\/(?:[\w-]+\/)?name\/[^?#]*-obituary\?(?:[^#]*&)?id=\d+/
      ];
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var data = getJsonLd(), $person = data.Person, article = data.NewsArticle;
        if (!$person || !($person.name || $person.givenName || $person.familyName)) {
          return emitter.emit("noData");
        }
        var id = getRecordId(), gedx = new GedcomX(), person = GedcomX.Person({
          principal: true,
          id,
          identifiers: {
            "genscrape": "genscrape://legacy/" + id
          }
        });
        var given = [$person.givenName, $person.additionalName].filter(Boolean).join(" "), surname = $person.familyName, fullName = ($person.name || [given, surname].filter(Boolean).join(" ")).replace(/\s+/g, " ").trim();
        if (given || surname) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": given,
            "http://gedcomx.org/Surname": surname
          });
          person.getNames()[0].getNameForms()[0].setFullText(fullName);
        } else {
          person.addSimpleName(fullName);
        }
        var years = /\((\d{4}) - (\d{4})\)/.exec(article && article.headline || document.title || ""), birthDate = $person.birthDate ? formatDate($person.birthDate) : years ? years[1] : void 0, deathDate = $person.deathDate ? formatDate($person.deathDate) : years ? years[2] : void 0;
        if (birthDate) {
          person.addFact({
            type: "http://gedcomx.org/Birth",
            date: {
              original: birthDate
            }
          });
        }
        var deathPlace = formatPlace($person.deathPlace);
        if (deathDate || deathPlace) {
          var death = GedcomX.Fact({ type: "http://gedcomx.org/Death" });
          if (deathDate) {
            death.setDate({ original: deathDate });
          }
          if (deathPlace) {
            death.setPlace({ original: deathPlace });
          }
          person.addFact(death);
        }
        gedx.addPerson(person);
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "Legacy.com"
        }).setHomepage({
          resource: "https://www.legacy.com"
        }));
        var title = article && article.headline || document.title || fullName + " Obituary", published = article && article.datePublished ? " published " + formatDate(article.datePublished) : "";
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: '"' + title + '," obituary' + published + ", Legacy.com (" + document.location.href + " : accessed " + utils.getDateString() + ")."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getJsonLd() {
        var result = {};
        Array.from(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(script) {
          try {
            var json = JSON.parse(script.textContent);
            if (json && json["@type"] && !result[json["@type"]]) {
              result[json["@type"]] = json;
            }
          } catch (e) {
            debug("invalid json-ld");
          }
        });
        return result;
      }
      function formatDate(value) {
        var match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value || "");
        if (match && monthNames[parseInt(match[2], 10) - 1]) {
          return parseInt(match[3], 10) + " " + monthNames[parseInt(match[2], 10) - 1] + " " + match[1];
        }
        return value;
      }
      function formatPlace(place) {
        var address = place && place.address;
        if (!address) {
          return;
        }
        return [address.addressLocality, address.addressRegion, address.addressCountry].filter(Boolean).join(", ") || void 0;
      }
      function getRecordId() {
        var match = /[?&]id=(\d+)/.exec(document.location.search || document.location.href);
        return match ? match[1] : "";
      }
    }
  });

  // src/scrapers/archieven.js
  var require_archieven = __commonJS({
    "src/scrapers/archieven.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:archieven");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(?:www\.)?archieven\.nl\/(?:[a-z]{2}\/)?zoeken\?(?=[^#]*[?&]minr=\d+)(?=[^#]*[?&]micode=)/
      ];
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var MALE = "http://gedcomx.org/Male";
      var FEMALE = "http://gedcomx.org/Female";
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var attempts = 0, interval = setInterval(function() {
          attempts++;
          if (hasRecord()) {
            clearInterval(interval);
            process2(emitter);
          } else if (attempts >= 40) {
            clearInterval(interval);
            emitter.emit("noData");
          }
        }, 250);
        if (hasRecord()) {
          clearInterval(interval);
          process2(emitter);
        }
      }
      function hasRecord() {
        return !!document.querySelector(".mi_record .mi_detailstable .mi_list_item");
      }
      function process2(emitter) {
        var $record = document.querySelector(".mi_record"), rows = readRows($record), id = getRecordId(), gedx = new GedcomX(), principalRow, person;
        ["kind", "overledene", "bruidegom"].forEach(function(label) {
          if (!principalRow && rows[label]) {
            principalRow = label;
          }
        });
        if (!principalRow) {
          return emitter.emit("noData");
        }
        person = createPerson(rows[principalRow], principalRow === "bruidegom" ? MALE : void 0);
        if (!person) {
          return emitter.emit("noData");
        }
        person.setPrincipal(true);
        person.setId(id);
        person.setIdentifiers({
          "genscrape": "genscrape://archieven/" + getInstitution() + "/" + id
        });
        gedx.addPerson(person);
        var gender = rows[principalRow].sub["Geslacht"];
        if (gender === "Man") {
          person.setGender({ type: MALE });
        } else if (gender === "Vrouw") {
          person.setGender({ type: FEMALE });
        }
        switch (principalRow) {
          // Birth record
          case "kind":
            addFact(person, "http://gedcomx.org/Birth", rows["geboortedatum"], rows["geboorteplaats"]);
            addParents(gedx, person, rows["vader"], rows["moeder"]);
            break;
          // Death record
          case "overledene":
            addFact(person, "http://gedcomx.org/Birth", null, rows["overledene"].sub["Geboorteplaats"] ? { value: rows["overledene"].sub["Geboorteplaats"] } : null);
            addFact(person, "http://gedcomx.org/Death", rows["overlijdensdatum"], rows["overlijdensplaats"]);
            addParents(gedx, person, rows["vader"], rows["moeder"]);
            break;
          // Marriage record
          case "bruidegom":
            addFact(person, "http://gedcomx.org/Birth", null, rows["bruidegom"].sub["Geboorteplaats"] ? { value: rows["bruidegom"].sub["Geboorteplaats"] } : null);
            addOccupation(person, rows["bruidegom"]);
            addParents(gedx, person, rows["vader bruidegom"], rows["moeder bruidegom"]);
            var bride = createPerson(rows["bruid"], FEMALE);
            if (bride) {
              addFact(bride, "http://gedcomx.org/Birth", null, rows["bruid"].sub["Geboorteplaats"] ? { value: rows["bruid"].sub["Geboorteplaats"] } : null);
              addOccupation(bride, rows["bruid"]);
              gedx.addPerson(bride);
              addParents(gedx, bride, rows["vader bruid"], rows["moeder bruid"]);
              var couple = GedcomX.Relationship({
                type: "http://gedcomx.org/Couple",
                person1: person,
                person2: bride
              });
              var marriage = createFact("http://gedcomx.org/Marriage", rows["huwelijksdatum"], rows["huwelijksplaats"]);
              if (marriage) {
                couple.addFact(marriage);
              }
              gedx.addRelationship(couple);
            }
            break;
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "nl",
          value: "Archieven.nl"
        }).setHomepage({
          resource: "https://www.archieven.nl"
        }));
        var title = text($record.querySelector(".mi_titlepart")) || document.title, series = text($record.querySelector(".mi_comlinks .mi_unittitle")), org = /Beherende organisatie:\s*([^\n]*?)\s*(?:laatste wijziging|$)/.exec(text($record.querySelector(".mi_record_det")) || "");
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: title + (series ? ", " + series : "") + (org ? ", " + org[1] : "") + ", Archieven.nl (" + document.location.href + " : accessed " + utils.getDateString() + ")."
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function readRows($record) {
        var rows = {};
        Array.from($record.querySelectorAll(".mi_detailstable > .mi_list_item")).forEach(function(item) {
          var labelEl = item.querySelector(".mi_label"), valueEl = item.querySelector(".mi_flexvalue");
          if (!labelEl || !valueEl) {
            return;
          }
          var label = text(labelEl).replace(/:$/, "").toLowerCase(), sub = {};
          Array.from(item.querySelectorAll(".mi_det_items .mi_details")).forEach(function(detail) {
            var subLabel = detail.querySelector(".mi_label"), subValue = detail.querySelector(".mi_value");
            if (subLabel && subValue) {
              sub[text(subLabel).replace(/:$/, "")] = text(subValue);
            }
          });
          if (rows[label] === void 0) {
            rows[label] = {
              value: textWithoutLinks(valueEl),
              sub
            };
          }
        });
        return rows;
      }
      function createPerson(row, gender) {
        if (!row || !row.value) {
          return;
        }
        var person = GedcomX.Person(), given = row.sub["Voornaam"], surname = [row.sub["Tussenvoegsel"], row.sub["Achternaam"]].filter(Boolean).join(" ");
        if (given || surname) {
          person.addNameFromParts({
            "http://gedcomx.org/Given": given,
            "http://gedcomx.org/Surname": surname
          });
          person.getNames()[0].getNameForms()[0].setFullText(row.value);
        } else {
          person.addSimpleName(row.value);
        }
        if (gender) {
          person.setGender({ type: gender });
        }
        return person;
      }
      function addParents(gedx, child, fatherRow, motherRow) {
        var father = createPerson(fatherRow, MALE), mother = createPerson(motherRow, FEMALE);
        if (father) {
          addOccupation(father, fatherRow);
          gedx.addPerson(father);
          gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: father, person2: child });
        }
        if (mother) {
          addOccupation(mother, motherRow);
          gedx.addPerson(mother);
          gedx.addRelationship({ type: "http://gedcomx.org/ParentChild", person1: mother, person2: child });
        }
        if (father && mother) {
          gedx.addRelationship({ type: "http://gedcomx.org/Couple", person1: father, person2: mother });
        }
      }
      function addOccupation(person, row) {
        if (row && row.sub["Beroep"]) {
          person.addFact({
            type: "http://gedcomx.org/Occupation",
            value: row.sub["Beroep"]
          });
        }
      }
      function createFact(type, dateRow, placeRow) {
        var date = dateRow ? formatDate(dateRow.value) : null, place = placeRow ? placeRow.value : null;
        if (!date && !place) {
          return;
        }
        var fact = GedcomX.Fact({ type });
        if (date) {
          fact.setDate({ original: date });
        }
        if (place) {
          fact.setPlace({ original: place });
        }
        return fact;
      }
      function addFact(person, type, dateRow, placeRow) {
        var fact = createFact(type, dateRow, placeRow);
        if (fact) {
          person.addFact(fact);
        }
      }
      function formatDate(value) {
        var match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(value || "");
        if (match && monthNames[parseInt(match[2], 10) - 1]) {
          return parseInt(match[1], 10) + " " + monthNames[parseInt(match[2], 10) - 1] + " " + match[3];
        }
        return value || void 0;
      }
      function text(el) {
        return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
      }
      function textWithoutLinks(el) {
        var clone = el.cloneNode(true);
        Array.from(clone.querySelectorAll("a, svg")).forEach(function(node) {
          node.parentNode.removeChild(node);
        });
        return text(clone);
      }
      function getRecordId() {
        var match = /[?&]minr=(\d+)/.exec(document.location.href);
        return match ? match[1] : "";
      }
      function getInstitution() {
        var match = /[?&]miadt=(\d+)/.exec(document.location.href);
        return match ? match[1] : "0";
      }
    }
  });

  // src/scrapers/freereg.js
  var require_freereg = __commonJS({
    "src/scrapers/freereg.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:freereg");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/www\.freereg\.org\.uk\/search_records\/[0-9a-f]{24}(\/|\?|#|$)/
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var recordId;
      function run(emitter) {
        debug("run");
        var fields = getFields(), type = getRecordType();
        recordId = getRecordId(document.location.href);
        debug("type: " + type);
        if (!type || !recordId) {
          return emitter.emit("noData");
        }
        var gedx = GedcomX(), principal;
        switch (type) {
          case "Baptism":
            principal = processBaptism(gedx, fields);
            break;
          case "Marriage":
            principal = processMarriage(gedx, fields);
            break;
          case "Burial":
            principal = processBurial(gedx, fields);
            break;
        }
        if (!principal) {
          return emitter.emit("noData");
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "FreeREG"
        }).setHomepage({
          resource: "https://www.freereg.org.uk"
        }));
        var title = type + " of " + getPrincipalName(principal) + (fields["County"] ? ", " + fields["Place"] + ", " + fields["County"] : "");
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: 'FreeREG, "' + title + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getPrincipalName(person) {
        var name = person.getNames()[0];
        return name ? name.getNameForms()[0].getFullText() : "";
      }
      function getRecordId(url) {
        var match = url.match(/search_records\/([0-9a-f]{24})/);
        return match ? match[1] : null;
      }
      function getRecordType() {
        var $caption = document.querySelector("#results_detail_table caption");
        if ($caption) {
          var match = $caption.firstChild.textContent.match(/(Baptism|Marriage|Burial)/i);
          if (match) {
            return match[1].charAt(0).toUpperCase() + match[1].substring(1).toLowerCase();
          }
        }
      }
      function getFields() {
        var fields = {};
        Array.from(document.querySelectorAll("#results_detail_table tbody tr")).forEach(function($row) {
          var $cells = $row.querySelectorAll("td");
          if ($cells.length === 2) {
            var label = clean($cells[0].firstChild ? $cells[0].firstChild.textContent : $cells[0].textContent), value = clean($cells[1].textContent);
            if (label && value) {
              fields[label] = value;
            }
          }
        });
        return fields;
      }
      function clean(text) {
        return text.replace(/\s+/g, " ").trim();
      }
      function markPrincipal(person) {
        person.setPrincipal(true);
        person.setId(recordId);
        person.setIdentifiers({
          "genscrape": "genscrape://freereg/" + recordId
        });
      }
      function createPerson(forename, surname, sex) {
        if (!forename && !surname) {
          return;
        }
        var person = GedcomX.Person().addNameFromParts({
          "http://gedcomx.org/Given": forename,
          "http://gedcomx.org/Surname": surname
        });
        var fullText = [forename, surname].filter(Boolean).join(" ");
        person.getNames()[0].getNameForms()[0].setFullText(fullText);
        if (sex === "M") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (sex === "F") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        return person;
      }
      function getEventPlace(fields) {
        return [fields["Church name"], fields["Place"], fields["County"]].filter(Boolean).join(", ");
      }
      function addEventFact(person, type, date, place) {
        if (date || place) {
          var fact = GedcomX.Fact({ type });
          if (date) {
            fact.setDate({ original: date });
          }
          if (place) {
            fact.setPlace({ original: place });
          }
          person.addFact(fact);
        }
      }
      function addAbode(person, abode) {
        if (abode) {
          person.addFact({
            type: "http://gedcomx.org/Residence",
            place: { original: abode }
          });
        }
      }
      function addOccupation(person, occupation) {
        if (occupation) {
          person.addFact({
            type: "http://gedcomx.org/Occupation",
            value: occupation
          });
        }
      }
      function addParentChild(gedx, parent, child) {
        gedx.addPerson(parent);
        gedx.addRelationship({
          type: "http://gedcomx.org/ParentChild",
          person1: parent,
          person2: child
        });
      }
      function addParents(gedx, child, fields, prefix) {
        var father = createPerson(fields[prefix + "Father forename"], fields[prefix + "Father surname"], "M"), mother = createPerson(fields[prefix + "Mother forename"], fields[prefix + "Mother surname"], "F");
        if (father) {
          addOccupation(father, fields[prefix + "Father occupation"]);
          addAbode(father, fields[prefix + "Father abode"]);
          addParentChild(gedx, father, child);
        }
        if (mother) {
          addOccupation(mother, fields[prefix + "Mother occupation"]);
          addParentChild(gedx, mother, child);
        }
        if (father && mother) {
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: father,
            person2: mother
          });
        }
      }
      function processBaptism(gedx, fields) {
        var child = createPerson(fields["Person forename"], fields["Person surname"] || fields["Father surname"], fields["Person sex"]);
        if (!child) {
          return;
        }
        addEventFact(child, "http://gedcomx.org/Baptism", fields["Baptism date"], getEventPlace(fields));
        addAbode(child, fields["Person abode"]);
        markPrincipal(child);
        gedx.addPerson(child);
        addParents(gedx, child, fields, "");
        return child;
      }
      function processBurial(gedx, fields) {
        var person = createPerson(fields["Burial person forename"], fields["Burial person surname"], fields["Person sex"]);
        if (!person) {
          return;
        }
        addEventFact(person, "http://gedcomx.org/Burial", fields["Burial date"], getEventPlace(fields));
        addAbode(person, fields["Burial person abode"]);
        markPrincipal(person);
        gedx.addPerson(person);
        var relationship = (fields["Relationship"] || "").toLowerCase(), relatives = [
          createPerson(fields["Male relative forename"], fields["Relative surname"], "M"),
          createPerson(fields["Female relative forename"], fields["Relative surname"], "F")
        ];
        relatives.forEach(function(relative) {
          if (!relative) {
            return;
          }
          gedx.addPerson(relative);
          if (/^(son|daughter|child|infant)/.test(relationship)) {
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: relative,
              person2: person
            });
          } else if (/^(wife|husband|widow|wid)/.test(relationship)) {
            gedx.addRelationship({
              type: "http://gedcomx.org/Couple",
              person1: person,
              person2: relative
            });
          }
        });
        return person;
      }
      function processMarriage(gedx, fields) {
        var groom = createPerson(fields["Groom forename"], fields["Groom surname"], "M"), bride = createPerson(fields["Bride forename"], fields["Bride surname"], "F");
        if (!groom && !bride) {
          return;
        }
        markPrincipal(groom || bride);
        var date = fields["Marriage date"], place = getEventPlace(fields);
        [[groom, "Groom "], [bride, "Bride "]].forEach(function(pair) {
          var person = pair[0];
          if (person) {
            addAbode(person, fields[pair[1] + "abode"]);
            addOccupation(person, fields[pair[1] + "occupation"]);
            gedx.addPerson(person);
            addParents(gedx, person, fields, pair[1]);
          }
        });
        if (groom && bride) {
          var couple = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: groom,
            person2: bride
          });
          addEventFact(couple, "http://gedcomx.org/Marriage", date, place);
          gedx.addRelationship(couple);
        }
        Object.keys(fields).filter(function(label) {
          return /^Witness\d*$/.test(label);
        }).forEach(function(label) {
          gedx.addPerson(GedcomX.Person().addSimpleName(fields[label]));
        });
        return groom || bride;
      }
    }
  });

  // src/scrapers/freecen.js
  var require_freecen = __commonJS({
    "src/scrapers/freecen.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:freecen");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/www\.freecen\.org\.uk\/search_records\/[0-9a-f]{24}(\/|\?|#|$)/
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      function run(emitter) {
        debug("run");
        var recordId = getRecordId(document.location.href), location = getTableRows(findTable("location"))[0], people = getTableRows(findTable("each person"), true);
        debug("people: " + people.length);
        if (!recordId || !location || !people.length) {
          return emitter.emit("noData");
        }
        var gedx = GedcomX(), censusPlace = getCensusPlace(location), head, principal;
        var created = people.map(function(row) {
          row.person = createPerson(row, location["Census"], censusPlace);
          return row;
        });
        principal = (created.filter(function(row) {
          return row.isPrincipal && row.person;
        })[0] || created.filter(function(row) {
          return row.person;
        })[0] || {}).person;
        if (!principal) {
          return emitter.emit("noData");
        }
        principal.setPrincipal(true);
        principal.setId(recordId);
        principal.setIdentifiers({
          "genscrape": "genscrape://freecen/" + recordId
        });
        created.forEach(function(row) {
          var person = row.person;
          if (!person) {
            return;
          }
          gedx.addPerson(person);
          if (!head && /^head$/i.test(row["Relationship"])) {
            head = person;
          }
        });
        if (head) {
          people.forEach(function(row) {
            if (row.person && row.person !== head) {
              addRelationship(gedx, head, row.person, row["Relationship"]);
            }
          });
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "FreeCEN"
        }).setHomepage({
          resource: "https://www.freecen.org.uk"
        }));
        var name = principal.getNames()[0].getNameForms()[0].getFullText(), title = location["Census"] + " census, " + name + ", " + censusPlace;
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: title
            }
          ],
          citations: [
            {
              value: 'FreeCEN, "' + title + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getRecordId(url) {
        var match = url.match(/search_records\/([0-9a-f]{24})/);
        return match ? match[1] : null;
      }
      function clean(text) {
        return text.replace(/\s+/g, " ").trim();
      }
      function findTable(keyword) {
        var tables = Array.from(document.querySelectorAll("table")), result;
        tables.forEach(function($table) {
          var $caption = $table.querySelector("caption");
          if (!result && $caption && $caption.textContent.indexOf(keyword) !== -1) {
            result = $table;
          }
        });
        return result;
      }
      function getTableRows($table) {
        if (!$table) {
          return [];
        }
        var headers = Array.from($table.querySelectorAll("th")).map(function($th) {
          return clean($th.textContent);
        }).filter(Boolean);
        return Array.from($table.querySelectorAll("tbody tr")).map(function($tr) {
          var row = {}, $cells = $tr.querySelectorAll("td");
          if ($cells.length !== headers.length) {
            return null;
          }
          headers.forEach(function(header, i) {
            var $flag = $cells[i].querySelector(".accessibility");
            if ($flag) {
              row.isPrincipal = true;
              $flag.parentNode.removeChild($flag);
            }
            row[header] = clean($cells[i].textContent);
          });
          return row;
        }).filter(Boolean);
      }
      function getCensusPlace(location) {
        var parts = [location["House Number"], location["House or Street Name"]].filter(Boolean).join(" ");
        return [
          parts,
          location["Civil Parish"],
          location["District"],
          location["County"].replace(/\s*\([A-Z]+\)$/, "")
        ].filter(Boolean).filter(function(part, i, arr) {
          return arr.indexOf(part) === i;
        }).join(", ");
      }
      function createPerson(row, year, censusPlace) {
        var forenames = row["Forenames"], surname = row["Surname"];
        if (!forenames && !surname) {
          return;
        }
        var person = GedcomX.Person().addNameFromParts({
          "http://gedcomx.org/Given": forenames,
          "http://gedcomx.org/Surname": surname
        });
        person.getNames()[0].getNameForms()[0].setFullText([forenames, surname].filter(Boolean).join(" "));
        if (row["Sex"] === "M") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (row["Sex"] === "F") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        person.addFact({
          type: "http://gedcomx.org/Census",
          date: { original: year },
          place: { original: censusPlace }
        });
        var birthPlace = [row["Birth Place"], row["Birth County"]].filter(Boolean).join(", "), age = parseInt(row["Age"], 10), birthFact = GedcomX.Fact({ type: "http://gedcomx.org/Birth" });
        if (birthPlace) {
          birthFact.setPlace({ original: birthPlace });
        }
        if (!isNaN(age) && /^\d+$/.test(row["Age"]) && parseInt(year, 10)) {
          birthFact.setDate({ original: "about " + (parseInt(year, 10) - age) });
        }
        if (birthFact.getDate() || birthFact.getPlace()) {
          person.addFact(birthFact);
        }
        if (row["Occupation"]) {
          person.addFact({
            type: "http://gedcomx.org/Occupation",
            value: row["Occupation"]
          });
        }
        if (row["Marital Status"]) {
          person.addFact({
            type: "http://gedcomx.org/MaritalStatus",
            value: row["Marital Status"]
          });
        }
        return person;
      }
      function addRelationship(gedx, head, person, relationship) {
        relationship = (relationship || "").toLowerCase();
        if (/^(wife|wf|husband|hus|spouse)$/.test(relationship)) {
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: head,
            person2: person
          });
        } else if (/^(son|dau|daur|daughter|child|chd)$/.test(relationship)) {
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: head,
            person2: person
          });
        } else if (/^(father|fa|mother|mo)$/.test(relationship)) {
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: person,
            person2: head
          });
        }
      }
    }
  });

  // src/scrapers/irishgenealogy.js
  var require_irishgenealogy = __commonJS({
    "src/scrapers/irishgenealogy.js"(exports, module) {
      var debug = require_browser()("genscrape:scrapers:irishgenealogy");
      var utils = require_utils2();
      var GedcomX = require_src();
      var urls = [
        /^https?:\/\/(www\.)?irishgenealogy\.ie\/view\/?\?(.*&)?record_id=[^&#]+/
      ];
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      module.exports = function(register) {
        register(urls, run);
      };
      var recordId;
      function run(emitter) {
        debug("run");
        recordId = getRecordId(document.location.href);
        var $title = document.querySelector("h3"), title = $title ? clean($title.textContent) : "", typeMatch = title.match(/^(Birth|Death|Marriage|Baptism|Burial) record for/i);
        if (!recordId || !typeMatch) {
          return emitter.emit("noData");
        }
        var type = typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].substring(1).toLowerCase(), rows = getRows(), location = getLocation(), eventDate = getTitleDate(title), gedx = GedcomX(), principal;
        debug("type: " + type);
        switch (type) {
          case "Birth":
            principal = processCivilBirth(gedx, rows, location);
            break;
          case "Death":
            principal = processCivilDeath(gedx, rows, location);
            break;
          case "Baptism":
            principal = processBaptism(gedx, rows, location, eventDate);
            break;
          case "Burial":
            principal = processBurial(gedx, rows, location, eventDate);
            break;
          case "Marriage":
            if (rows["Party 1 Name"]) {
              principal = processCivilMarriage(gedx, rows, location);
            } else {
              principal = processChurchMarriage(gedx, rows, location, eventDate);
            }
            break;
        }
        if (!principal) {
          return emitter.emit("noData");
        }
        gedx.addAgent(GedcomX.Agent().setId("agent").addName({
          lang: "en",
          value: "IrishGenealogy.ie"
        }).setHomepage({
          resource: "https://www.irishgenealogy.ie"
        }));
        var sourceTitle = title.replace(/\s+/g, " ");
        gedx.addSourceDescriptionToAll({
          about: document.location.href,
          titles: [
            {
              value: sourceTitle
            }
          ],
          citations: [
            {
              value: 'IrishGenealogy.ie, "' + sourceTitle + '" (' + document.location.href + " : accessed " + utils.getDateString() + ")"
            }
          ],
          repository: {
            resource: "#agent"
          }
        });
        emitter.emit("data", gedx);
      }
      function getRecordId(url) {
        var match = url.match(/[?&]record_id=([^&#]+)/);
        return match ? decodeURIComponent(match[1]) : null;
      }
      function clean(text) {
        return text.replace(/\s+/g, " ").trim();
      }
      function value(text) {
        text = clean(text || "");
        if (/^(N\/?R|N\/?A|Null|NR NR|N\/R N\/R)$/i.test(text)) {
          return "";
        }
        return text;
      }
      function getRows() {
        var rows = {};
        Array.from(document.querySelectorAll("#result-details tr")).forEach(function($tr) {
          var $cells = $tr.querySelectorAll("td"), label;
          if ($cells.length === 2) {
            label = clean($cells[0].textContent).replace(/:$/, "");
            rows[label] = value($cells[1].textContent);
          } else if ($cells.length === 3) {
            label = clean($cells[0].textContent).replace(/:$/, "");
            if (label) {
              rows[label] = [value($cells[1].textContent), value($cells[2].textContent)];
            }
          }
        });
        return rows;
      }
      function getLocation() {
        var $span = document.querySelector("span.mb-0"), text = $span ? clean($span.textContent) : "", match = text.match(/^Area - (.*?), Parish\/Church\/Congregation - (.*)$/);
        if (match) {
          return match[2] + ", " + match[1];
        }
        return text.replace(/^\/\s*/, "");
      }
      function getTitleDate(title) {
        var match = title.match(/\s(?:on|in)\s+(\d.*)$/);
        return match ? clean(match[1]) : "";
      }
      function formatCivilDate(date) {
        var match = (date || "").match(/^(\d\d)\/(\d\d)\/(\d{4})$/);
        if (match && months[parseInt(match[2], 10) - 1]) {
          return parseInt(match[1], 10) + " " + months[parseInt(match[2], 10) - 1] + " " + match[3];
        }
        return date;
      }
      function createPerson(name, sex) {
        if (!name) {
          return;
        }
        var person = GedcomX.Person().addSimpleName(name);
        if (sex === "M") {
          person.setGender({ type: "http://gedcomx.org/Male" });
        } else if (sex === "F") {
          person.setGender({ type: "http://gedcomx.org/Female" });
        }
        return person;
      }
      function markPrincipal(person) {
        person.setPrincipal(true);
        person.setId(recordId);
        person.setIdentifiers({
          "genscrape": "genscrape://irishgenealogy/" + recordId
        });
      }
      function addFact(holder, type, date, place) {
        if (date || place) {
          var fact = GedcomX.Fact({ type });
          if (date) {
            fact.setDate({ original: date });
          }
          if (place) {
            fact.setPlace({ original: place });
          }
          holder.addFact(fact);
        }
      }
      function addResidence(person, address) {
        if (address) {
          person.addFact({
            type: "http://gedcomx.org/Residence",
            place: { original: address }
          });
        }
      }
      function addOccupation(person, occupation) {
        if (occupation) {
          person.addFact({
            type: "http://gedcomx.org/Occupation",
            value: occupation
          });
        }
      }
      function addParents(gedx, child, fatherName, motherName) {
        var father = createPerson(fatherName, "M"), mother = createPerson(motherName, "F");
        [father, mother].forEach(function(parent) {
          if (parent) {
            gedx.addPerson(parent);
            gedx.addRelationship({
              type: "http://gedcomx.org/ParentChild",
              person1: parent,
              person2: child
            });
          }
        });
        if (father && mother) {
          gedx.addRelationship({
            type: "http://gedcomx.org/Couple",
            person1: father,
            person2: mother
          });
        }
      }
      function addOthers(gedx, rows, labelPattern) {
        Object.keys(rows).filter(function(label) {
          return labelPattern.test(label) && typeof rows[label] === "string" && rows[label];
        }).forEach(function(label) {
          gedx.addPerson(createPerson(rows[label]));
        });
      }
      function birthYearFromAge(year, age) {
        var y = parseInt(year, 10), match = (age || "").match(/^(\d+)(\s*(yrs?|years?))?$/i);
        if (y && match) {
          return "about " + (y - parseInt(match[1], 10));
        }
      }
      function processCivilBirth(gedx, rows, location) {
        var person = createPerson(rows["Name"]);
        if (!person) {
          return;
        }
        addFact(person, "http://gedcomx.org/Birth", rows["Year of Birth"], location);
        markPrincipal(person);
        gedx.addPerson(person);
        var maidenName = rows["Mother's Birth Surname"];
        if (maidenName) {
          var mother = GedcomX.Person().addNameFromParts({
            "http://gedcomx.org/Surname": maidenName
          });
          mother.setGender({ type: "http://gedcomx.org/Female" });
          gedx.addPerson(mother);
          gedx.addRelationship({
            type: "http://gedcomx.org/ParentChild",
            person1: mother,
            person2: person
          });
        }
        return person;
      }
      function processCivilDeath(gedx, rows, location) {
        var person = createPerson(rows["Name"]);
        if (!person) {
          return;
        }
        var deathDate = rows["Date of Death"], age = rows["Deceased Age at Death"], birthDate = birthYearFromAge(deathDate, age);
        if (birthDate) {
          addFact(person, "http://gedcomx.org/Birth", birthDate);
        }
        addFact(person, "http://gedcomx.org/Death", deathDate, location);
        markPrincipal(person);
        gedx.addPerson(person);
        return person;
      }
      function processCivilMarriage(gedx, rows, location) {
        var party1 = createPerson(rows["Party 1 Name"]), party2 = createPerson(rows["Party 2 Name"]);
        if (!party1) {
          return;
        }
        markPrincipal(party1);
        gedx.addPerson(party1);
        if (party2) {
          gedx.addPerson(party2);
          var couple = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: party1,
            person2: party2
          });
          addFact(couple, "http://gedcomx.org/Marriage", formatCivilDate(rows["Date of Event"]), location);
          gedx.addRelationship(couple);
        }
        return party1;
      }
      function processBaptism(gedx, rows, location, date) {
        var person = createPerson(rows["Name"]);
        if (!person) {
          return;
        }
        addFact(person, "http://gedcomx.org/Baptism", date, location);
        addResidence(person, rows["Address"]);
        markPrincipal(person);
        gedx.addPerson(person);
        addParents(gedx, person, rows["Father"], rows["Mother"]);
        addOthers(gedx, rows, /^Sponsor \d+$/);
        return person;
      }
      function processBurial(gedx, rows, location, date) {
        var person = createPerson(rows["Name"]);
        if (!person) {
          return;
        }
        var deathDate = rows["Date of Death"], birthDate = birthYearFromAge((deathDate || date).match(/\d{4}/) ? (deathDate || date).match(/\d{4}/)[0] : "", rows["Age"]);
        if (birthDate) {
          addFact(person, "http://gedcomx.org/Birth", birthDate);
        }
        addFact(person, "http://gedcomx.org/Death", deathDate);
        addFact(person, "http://gedcomx.org/Burial", date, location);
        addResidence(person, rows["Address"]);
        addOccupation(person, rows["Occupation"]);
        markPrincipal(person);
        gedx.addPerson(person);
        return person;
      }
      function processChurchMarriage(gedx, rows, location, date) {
        var names = rows["Name"] || [], groom = createPerson(names[0], "M"), bride = createPerson(names[1], "F");
        if (!groom && !bride) {
          return;
        }
        markPrincipal(groom || bride);
        [groom, bride].forEach(function(person, i) {
          if (person) {
            addResidence(person, (rows["Address"] || [])[i]);
            addOccupation(person, (rows["Occupation"] || [])[i]);
            gedx.addPerson(person);
            addParents(gedx, person, (rows["Father"] || [])[i], (rows["Mother"] || [])[i]);
          }
        });
        if (groom && bride) {
          var couple = GedcomX.Relationship({
            type: "http://gedcomx.org/Couple",
            person1: groom,
            person2: bride
          });
          addFact(couple, "http://gedcomx.org/Marriage", date, location);
          gedx.addRelationship(couple);
        }
        addOthers(gedx, rows, /^Witness \d+$/);
        return groom || bride;
      }
    }
  });

  // src/main.js
  var require_main = __commonJS({
    "src/main.js"(exports, module) {
      var debug = require_browser()("genscrape:main");
      var EventEmitter2 = require_eventemitter2().EventEmitter2;
      var generic = require_generic();
      var genscrape = function(options) {
        options = options || {};
        var emitter = new EventEmitter2();
        var thisUrl = window.location.href;
        debug("url", thisUrl);
        var i, j, scraper, regex, match = false;
        for (i = 0; i < scrapers.length && !match; i++) {
          scraper = scrapers[i];
          for (j = 0; j < scraper.urls.length && !match; j++) {
            regex = scraper.urls[j];
            debug(regex);
            if (regex.test(thisUrl)) {
              debug("match");
              setTimeout(function() {
                scraper.scraper(emitter);
              });
              match = true;
            }
          }
        }
        if (!match) {
          debug("no match");
          setTimeout(function() {
            var result = null;
            if (options.generic !== false) {
              try {
                result = generic.extract(window.document, thisUrl);
              } catch (e) {
                debug("generic failed", e);
              }
            }
            if (result && generic.isUsable(result.record)) {
              debug("generic", result.strategy);
              emitter.emit("data", result.gedx, { generic: true, strategy: result.strategy });
            } else {
              emitter.emit("noMatch");
            }
          });
        }
        return emitter;
      };
      var scrapers = genscrape._scrapers = [];
      var register = genscrape.register = function(urls, scraper) {
        debug("register");
        if (Array.isArray(urls) && typeof scraper === "function") {
          scrapers.push({
            urls,
            scraper
          });
        }
      };
      module.exports = genscrape;
      require_gedx_extensions();
      require_ancestry_record()(register);
      require_ancestry_person()(register);
      require_billiongraves()(register);
      require_familysearch_record()(register);
      require_familysearch_ancestor()(register);
      require_findagrave()(register);
      require_findagrave_new()(register);
      require_findmypast_record()(register);
      require_findmypast_tree()(register);
      require_genealogieonline()(register);
      require_openarch()(register);
      require_werelate()(register);
      require_wikitree()(register);
      require_myheritage_record()(register);
      require_myheritage_person()(register);
      require_fold3_memorial()(register);
      require_abmc()(register);
      require_cvwm()(register);
      require_awm()(register);
      require_familysearch_ancestors_public()(register);
      require_thepeerage()(register);
      require_gedbas()(register);
      require_rodovid()(register);
      require_geneanet()(register);
      require_geni()(register);
      require_digitalarkivet()(register);
      require_legacy()(register);
      require_archieven()(register);
      require_freereg()(register);
      require_freecen()(register);
      require_irishgenealogy()(register);
    }
  });
  return require_main();
})();
