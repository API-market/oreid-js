/*

Handles storage to local storage, or cookies, whatever is available to the client

Mostly copied directly from Auth0.js
https://github.com/auth0/auth0.js/tree/master/src/helper/storage

*/

import Cookie from 'js-cookie'
import Helpers from './helpers'

class CookieStorage {
  static getItem(key) {
    return Cookie.get(key)
  }
  static removeItem(key) {
    Cookie.remove(key)
  }
  static setItem(key, value, options) {
    const params = {
      expires: 1, // 1 day
      ...options
    }
    Cookie.set(key, value, params)
  }
}

class DummyStorage {
  static getItem() {
    return null
  }
  static removeItem() {
    // empty
  }
  static setItem() {
    // empty
  }
}

function StorageHandler(options = { tryLocalStorageFirst: true }) {
  this.storage = new CookieStorage()
  if (options.tryLocalStorageFirst !== true) {
    return
  }
  try {
    // designed to work on browser or server, so window might not exist
    if (window) {
      // some browsers throw an error when trying to access localStorage
      // when localStorage is disabled.
      const localStorage = window.localStorage
      if (localStorage) {
        this.storage = localStorage
      }
    } else {
      Helpers.log(
        'Not running in Browser. Using CookieStorage instead.',
        options
      )
    }
  } catch (e) {
    Helpers.log("Can't use localStorage. Using CookieStorage instead.", options)
  }
}

StorageHandler.prototype.failover = function() {
  if (this.storage instanceof DummyStorage) {
    return
  } else if (this.storage instanceof CookieStorage) {
    this.storage = new DummyStorage()
  } else {
    this.storage = new CookieStorage()
  }
}

StorageHandler.prototype.getItem = function(key) {
  try {
    return this.storage.getItem(key)
  } catch (e) {
    Helpers.log("Can't getItem in storage.", e)
    this.failover()
    return this.getItem(key)
  }
}

StorageHandler.prototype.removeItem = function(key) {
  try {
    return this.storage.removeItem(key)
  } catch (e) {
    Helpers.log("Can't removeItem in storage.", e)
    this.failover()
    return this.removeItem(key)
  }
}

StorageHandler.prototype.setItem = function(key, value, options) {
  try {
    return this.storage.setItem(key, value, options)
  } catch (e) {
    Helpers.log("Can't setItem in storage.", e)
    this.failover()
    return this.setItem(key, value, options)
  }
}

export default StorageHandler
