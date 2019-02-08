/*

Handles storage to local storage, or cookies, whatever is available to the client

Mostly copied directly from Auth0.js
https://github.com/auth0/auth0.js/tree/master/src/helper/storage

*/

import Cookie from 'js-cookie';
import { log } from './helpers';

function CookieStorage() {}
CookieStorage.prototype.getItem = function(key) {
  return Cookie.get(key);
};
CookieStorage.prototype.removeItem = function(key) {
  Cookie.remove(key);
};
CookieStorage.prototype.setItem = function(key, value, options) {
  var params = {
      expires: 1, // 1 day
      ...options
  };
  Cookie.set(key, value, params);
};


function DummyStorage() {}
DummyStorage.prototype.getItem = function() {
  return null;
};
DummyStorage.prototype.removeItem = function() {};
DummyStorage.prototype.setItem = function() {};


function StorageHandler(options = {tryLocalStorageFirst: true}) {
  this.storage = new CookieStorage();
  if (options.tryLocalStorageFirst !== true) {
    return;
  }
  try {
    // some browsers throw an error when trying to access localStorage
    // when localStorage is disabled.
    var localStorage = window.localStorage;
    if (localStorage) {
      this.storage = localStorage;
    }
  } catch (e) {
    log("Can't use localStorage. Using CookieStorage instead.", options);
  }
}

StorageHandler.prototype.failover = function() {
  if (this.storage instanceof DummyStorage) {
    return;
  } else if (this.storage instanceof CookieStorage) {
    this.storage = new DummyStorage();
  } else {
    this.storage = new CookieStorage();
  }
};

StorageHandler.prototype.getItem = function(key) {
  try {
    return this.storage.getItem(key);
  } catch (e) {
    log("Can't getItem in storage.", e);
    this.failover();
    return this.getItem(key);
  }
};

StorageHandler.prototype.removeItem = function(key) {
  try {
    return this.storage.removeItem(key);
  } catch (e) {
    log("Can't removeItem in storage.", e);
    this.failover();
    return this.removeItem(key);
  }
};

StorageHandler.prototype.setItem = function(key, value, options) {
  try {
    return this.storage.setItem(key, value, options);
  } catch (e) {
    log("Can't setItem in storage.", e);
    this.failover();
    return this.setItem(key, value, options);
  }
};

export default StorageHandler;
