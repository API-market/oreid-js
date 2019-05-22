/*

Handles storage to local storage, or cookies, whatever is available to the client

Mostly copied originally copied from Auth0.js but modifed to use a class
https://github.com/auth0/auth0.js/tree/master/src/helper/storage

*/

import Cookie from 'js-cookie';
import Helpers from './helpers';

class CookieStorage {
  getItem(key) {
    return Cookie.get(key);
  }

  removeItem(key) {
    Cookie.remove(key);
  }

  setItem(key, value, options) {
    const params = {
      expires: 1, // 1 day
      ...options
    };
    Cookie.set(key, value, params);
  }
}
class LocalStorage {
  constructor() {
    if (window) {
      // some browsers throw an error when trying to access localStorage
      // when localStorage is disabled.
      this.storage = window.localStorage;
    } else {
      Helpers.log('Not running in Browser. Using CookieStorage instead.');
    }
  }

  getItem(key) {
    if (this.storage) {
      return this.storage.getItem(key);
    }
  }

  removeItem(key) {
    if (this.storage) {
      return this.storage.removeItem(key);
    }
  }

  setItem(key, value, options) {
    if (this.storage) {
      return this.storage.setItem(key, value, options);
    }
  }
}

class DummyStorage {
  getItem(key) {
    return null;
  }

  removeItem(key) {
    // empty
  }

  setItem(key, value, options) {
    // empty
  }
}

class StorageHandler {
  constructor(options = { tryLocalStorageFirst: true }) {
    this.triedLocalStorage = false;
    this.triedCookieStorage = false;

    if (options.tryLocalStorageFirst === true) {
      this.triedLocalStorage = true;

      try {
        // designed to work on browser or server, so window might not exist
        const localStorage = new LocalStorage();

        if (localStorage && localStorage.storage) {
          this.storage = localStorage;
        }
      } catch (e) {
        Helpers.log("Can't use localStorage. Using CookieStorage instead.", options);
      }
    }

    if (!this.storage) {
      this.storage = new CookieStorage();
      this.triedCookieStorage = true;
    }
  }

  failover() {
    if (this.storage instanceof DummyStorage) {
      return;
    }

    let didSet = false;

    if (this.storage instanceof LocalStorage) {
      if (!this.triedCookieStorage) {
        this.storage = new CookieStorage();
        this.triedCookieStorage = true;
        didSet = true;
      }
    } else if (this.storage instanceof CookieStorage) {
      if (!this.triedLocalStorage) {
        this.storage = new LocalStorage();
        this.triedLocalStorage = true;
        didSet = true;
      }
    }

    if (!didSet) {
      this.storage = new DummyStorage();
    }
  }

  getItem(key) {
    try {
      return this.storage.getItem(key);
    } catch (e) {
      Helpers.log("Can't getItem in storage.", e);
      this.failover();
      return this.storage.getItem(key);
    }
  }

  removeItem(key) {
    try {
      return this.storage.removeItem(key);
    } catch (e) {
      Helpers.log("Can't removeItem in storage.", e);
      this.failover();
      return this.storage.removeItem(key);
    }
  }

  setItem(key, value, options) {
    try {
      return this.storage.setItem(key, value, options);
    } catch (e) {
      Helpers.log("Can't setItem in storage.", e);
      this.failover();
      return this.storage.setItem(key, value, options);
    }
  }
}

export default StorageHandler;
