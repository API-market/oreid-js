import Helpers from './helpers'
import StorageHandler from './storage'
import { OreIdOptions, User } from './types'

// avoid Helpers.isNullOrEmpty, use isNullOrEmpty()
const { isNullOrEmpty } = Helpers

export default class LocalState {
  constructor(options: OreIdOptions) {
    this.options = options
    this.cachedUser = null
    this.storage = new StorageHandler()
  }

  options: OreIdOptions

  storage: StorageHandler

  cachedUser: User

  userKey() {
    return `oreid.${this.options.appId}.user`
  }

  saveUser(user: User) {
    this.cachedUser = user

    if (!isNullOrEmpty(this.cachedUser)) {
      const serialized = JSON.stringify(this.cachedUser)
      this.storage.setItem(this.userKey(), serialized)
    }
  }

  accountName() {
    if (this.user()) {
      return this.user().accountName
    }

    return null
  }

  user() {
    if (!this.cachedUser) {
      this.loadUser()
    }

    return this.cachedUser
  }

  loadUser() {
    this.cachedUser = null
    const serialized = this.storage.getItem(this.userKey())

    if (!isNullOrEmpty(serialized)) {
      this.cachedUser = JSON.parse(serialized)
    }
  }

  clear() {
    this.storage.removeItem(this.userKey())
  }
}
