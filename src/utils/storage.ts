/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
/*

Handles storage to local storage, or cookies, whatever is available to the client

Mostly copied originally copied from Auth0.js but modifed to use a class
https://github.com/auth0/auth0.js/tree/master/src/helper/storage

*/

import * as Cookie from 'js-cookie'
import { JSONObject } from '../models'
import IStorage from '../core/IStorage'
import Helpers from './helpers'

class CookieStorage implements IStorage {
  getItem(key: string): string {
    return Cookie.get(key)
  }

  removeItem(key: string) {
    Cookie.remove(key)
  }

  setItem(key: string, value: string | object, options?: Cookie.CookieAttributes): string {
    const params = {
      expires: 1, // 1 day
      ...options,
    }
    return Cookie.set(key, value, params)
  }
}

class LocalStorage implements IStorage {
  constructor() {
    if (window) {
      // some browsers throw an error when trying to access localStorage
      // when localStorage is disabled.
      this.storage = window.localStorage
    } else {
      Helpers.log('Not running in Browser. Using CookieStorage instead.')
    }
  }

  storage: Storage

  getItem(key: string): string {
    if (this.storage) {
      return this.storage.getItem(key)
    }
    return null
  }

  removeItem(key: string) {
    if (this.storage) {
      this.storage.removeItem(key)
    }
  }

  setItem(key: string, value: string, options?: any) {
    if (this.storage) {
      this.storage.setItem(key, value)
    }
  }
}

/** does not store or retrieve any values - allows 'disabling' of storage */
export class DummyStorage implements IStorage {
  getItem(key: any): any {
    return null
  }

  removeItem(key: any) {
    // empty
  }

  setItem(key: any, value: any, options?: any) {
    // empty
  }
}

/** stores items in memory - does not persist across instances */
export class MemoryStorage implements IStorage {
  memoryCache: JSONObject = {}

  getItem(key: any): any {
    if (key in this.memoryCache) return this.memoryCache[key]
    return null
  }

  removeItem(key: any): void {
    if (!this.getItem(key)) return
    delete this.memoryCache[key]
  }

  setItem(key: any, value: any, options?: any) {
    this.memoryCache[key] = value
  }
}

class StorageHandler implements IStorage {
  constructor(options = { tryLocalStorageFirst: true }) {
    this.triedLocalStorage = false
    this.triedCookieStorage = false

    if (options.tryLocalStorageFirst === true) {
      this.triedLocalStorage = true

      try {
        // designed to work on browser or server, so window might not exist
        const localStorage = new LocalStorage()

        if (localStorage && localStorage.storage) {
          this.storage = localStorage
        }
      } catch (e) {
        Helpers.log('Cant use localStorage. Using CookieStorage instead.', options)
      }
    }

    if (!this.storage) {
      this.storage = new CookieStorage()
      this.triedCookieStorage = true
    }
  }

  storage: LocalStorage | CookieStorage | DummyStorage | IStorage

  triedLocalStorage: boolean

  triedCookieStorage: boolean

  failover() {
    if (this.storage instanceof DummyStorage) {
      return
    }

    let didSet = false

    if (this.storage instanceof LocalStorage) {
      if (!this.triedCookieStorage) {
        this.storage = new CookieStorage()
        this.triedCookieStorage = true
        didSet = true
      }
    } else if (this.storage instanceof CookieStorage) {
      if (!this.triedLocalStorage) {
        this.storage = new LocalStorage()
        this.triedLocalStorage = true
        didSet = true
      }
    }

    if (!didSet) {
      this.storage = new DummyStorage()
    }
  }

  getItem(key: string): any {
    try {
      return this.storage.getItem(key)
    } catch (e) {
      Helpers.log('Cant getItem in storage.', e)
      this.failover()
      return this.storage.getItem(key)
    }
  }

  removeItem(key: string) {
    try {
      this.storage.removeItem(key)
      return
    } catch (e) {
      Helpers.log('Cant removeItem in storage.', e)
      this.failover()
      this.storage.removeItem(key)
    }
  }

  setItem(key: any, value: string | object, options?: any): string | void {
    try {
      return this.storage.setItem(key, value, options)
    } catch (e) {
      Helpers.log('Cant setItem in storage.', e)
      this.failover()
      return this.storage.setItem(key, value, options)
    }
  }
}

export default StorageHandler
