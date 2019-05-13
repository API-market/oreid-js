

/*

Handles storage to local storage, or cookies, whatever is available to the client

Mostly copied directly from Auth0.js
https://github.com/auth0/auth0.js/tree/master/src/helper/storage

*/
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (const p in s) { if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]; }
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, '__esModule', { value: true });
const js_cookie_1 = require('js-cookie');
const helpers_1 = require('./helpers');

function CookieStorage() { }
CookieStorage.prototype.getItem = function (key) {
  return js_cookie_1.default.get(key);
};
CookieStorage.prototype.removeItem = function (key) {
  js_cookie_1.default.remove(key);
};
CookieStorage.prototype.setItem = function (key, value, options) {
  const params = __assign({ expires: 1 }, options);
  js_cookie_1.default.set(key, value, params);
};
function DummyStorage() { }
DummyStorage.prototype.getItem = function () {
  return null;
};
DummyStorage.prototype.removeItem = function () { };
DummyStorage.prototype.setItem = function () { };
function StorageHandler(options) {
  if (options === void 0) { options = { tryLocalStorageFirst: true }; }
  this.storage = new CookieStorage();
  if (options.tryLocalStorageFirst !== true) {
    return;
  }
  try {
    // some browsers throw an error when trying to access localStorage
    // when localStorage is disabled.
    const { localStorage } = window;
    if (localStorage) {
      this.storage = localStorage;
    }
  } catch (e) {
    helpers_1.log("Can't use localStorage. Using CookieStorage instead.", options);
  }
}
StorageHandler.prototype.failover = function () {
  if (this.storage instanceof DummyStorage) {
    return;
  }
  if (this.storage instanceof CookieStorage) {
    this.storage = new DummyStorage();
  } else {
    this.storage = new CookieStorage();
  }
};
StorageHandler.prototype.getItem = function (key) {
  try {
    return this.storage.getItem(key);
  } catch (e) {
    helpers_1.log("Can't getItem in storage.", e);
    this.failover();
    return this.getItem(key);
  }
};
StorageHandler.prototype.removeItem = function (key) {
  try {
    return this.storage.removeItem(key);
  } catch (e) {
    helpers_1.log("Can't removeItem in storage.", e);
    this.failover();
    return this.removeItem(key);
  }
};
StorageHandler.prototype.setItem = function (key, value, options) {
  try {
    return this.storage.setItem(key, value, options);
  } catch (e) {
    helpers_1.log("Can't setItem in storage.", e);
    this.failover();
    return this.setItem(key, value, options);
  }
};
exports.default = StorageHandler;
// # sourceMappingURL=storage.js.map
