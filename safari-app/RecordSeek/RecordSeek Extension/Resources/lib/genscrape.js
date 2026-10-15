/*! genscrape v1.5.2 (rootsdev/genscrape@2a1205ace3c89c9f2da3f49ac4ea72458f47cbd8) | MIT (c) Justin York | https://github.com/rootsdev/genscrape
 * Patched: innerHTML writes on detached nodes replaced with DOMParser (inert parsing).
 * Unminified build: npm install --omit=dev && npx esbuild@0.24.0 src/main.js --bundle --format=iife --global-name=genscrape --platform=browser --target=es2017 --legal-comments=inline */
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
        if ("string" == typeof val) return parse(val);
        return options.long ? long(val) : short(val);
      };
      function parse(str) {
        str = "" + str;
        if (str.length > 1e4) return;
        var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
        if (!match) return;
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
        }
      }
      function short(ms) {
        if (ms >= d) return Math.round(ms / d) + "d";
        if (ms >= h) return Math.round(ms / h) + "h";
        if (ms >= m) return Math.round(ms / m) + "m";
        if (ms >= s) return Math.round(ms / s) + "s";
        return ms + "ms";
      }
      function long(ms) {
        return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
      }
      function plural(ms, n, name) {
        if (ms < n) return;
        if (ms < n * 1.5) return Math.floor(ms / n) + " " + name;
        return Math.ceil(ms / n) + " " + name + "s";
      }
    }
  });

  // node_modules/debug/debug.js
  var require_debug = __commonJS({
    "node_modules/debug/debug.js"(exports, module) {
      exports = module.exports = debug;
      exports.coerce = coerce;
      exports.disable = disable;
      exports.enable = enable;
      exports.enabled = enabled;
      exports.humanize = require_ms();
      exports.names = [];
      exports.skips = [];
      exports.formatters = {};
      var prevColor = 0;
      var prevTime;
      function selectColor() {
        return exports.colors[prevColor++ % exports.colors.length];
      }
      function debug(namespace) {
        function disabled() {
        }
        disabled.enabled = false;
        function enabled2() {
          var self = enabled2;
          var curr = +/* @__PURE__ */ new Date();
          var ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          if (null == self.useColors) self.useColors = exports.useColors();
          if (null == self.color && self.useColors) self.color = selectColor();
          var args = Array.prototype.slice.call(arguments);
          args[0] = exports.coerce(args[0]);
          if ("string" !== typeof args[0]) {
            args = ["%o"].concat(args);
          }
          var index = 0;
          args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
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
          if ("function" === typeof exports.formatArgs) {
            args = exports.formatArgs.apply(self, args);
          }
          var logFn = enabled2.log || exports.log || console.log.bind(console);
          logFn.apply(self, args);
        }
        enabled2.enabled = true;
        var fn = exports.enabled(namespace) ? enabled2 : disabled;
        fn.namespace = namespace;
        return fn;
      }
      function enable(namespaces) {
        exports.save(namespaces);
        var split = (namespaces || "").split(/[\s,]+/);
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

  // node_modules/debug/browser.js
  var require_browser = __commonJS({
    "node_modules/debug/browser.js"(exports, module) {
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
        return "WebkitAppearance" in document.documentElement.style || // is firebug? http://stackoverflow.com/a/398120/376773
        window.console && (console.firebug || console.exception && console.table) || // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
      }
      exports.formatters.j = function(v) {
        return JSON.stringify(v);
      };
      function formatArgs() {
        var args = arguments;
        var useColors2 = this.useColors;
        args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
        if (!useColors2) return args;
        var c = "color: " + this.color;
        args = [args[0], c, "color: inherit"].concat(Array.prototype.slice.call(args, 1));
        var index = 0;
        var lastC = 0;
        args[0].replace(/%[a-z%]/g, function(match) {
          if ("%%" === match) return;
          index++;
          if ("%c" === match) {
            lastC = index;
          }
        });
        args.splice(lastC, 0, c);
        return args;
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
        if (typeof define === "function" && define.amd) {
          define(function() {
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
            process(emitter, parseHTML(json.html.body));
          }
        });
      }
      function process(emitter, $dom) {
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
                if (ark && ark === url.replace("www.", "")) {
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
                process(emitter, treeId, personId, parseHTML(pageHtml), parseHTML(eventHtml));
              }
            });
          }
        });
      }
      function process(emitter, treeId, personId, $page, $event) {
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

  // src/main.js
  var require_main = __commonJS({
    "src/main.js"(exports, module) {
      var debug = require_browser()("genscrape:main");
      var EventEmitter2 = require_eventemitter2().EventEmitter2;
      var genscrape = function() {
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
            emitter.emit("noMatch");
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
    }
  });
  return require_main();
})();
