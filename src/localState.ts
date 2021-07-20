import Helpers from './helpers'
import StorageHandler from './storage'
import { OreIdOptions, User } from './models'

// avoid Helpers.isNullOrEmpty, use isNullOrEmpty()
const { isNullOrEmpty } = Helpers

export default class LocalState {
  constructor(options: OreIdOptions) {
    this.options = options
    this.cachedaccessToken = null
    this.cachedUser = null
    this.storage = new StorageHandler()
  }

  cachedaccessToken: string

  cachedUser: User

  options: OreIdOptions

  storage: StorageHandler

  accessTokenKey() {
    return `oreid.${this.options.appId}.accessToken`
  }

  userKey() {
    return `oreid.${this.options.appId}.user`
  }

  get accessToken(): string {
    if (!this.cachedaccessToken) this.loadAccessToken()
    return this.cachedaccessToken
  }

  loadAccessToken() {
    this.cachedaccessToken = this.storage.getItem(this.accessTokenKey())
  }

  saveAccessToken(accessToken: string) {
    this.cachedaccessToken = accessToken
    this.storage.setItem(this.accessTokenKey(), accessToken)
  }

  get user() {
    if (!this.cachedUser) this.loadUser()
    return this.cachedUser
  }

  loadUser() {
    this.cachedUser = null
    const serialized = this.storage.getItem(this.userKey())
    if (!isNullOrEmpty(serialized)) this.cachedUser = JSON.parse(serialized)
  }

  saveUser(user: User) {
    this.cachedUser = user
    this.storage.setItem(this.userKey(), JSON.stringify(this.cachedUser))
  }

  accountName() {
    if (this.user) return this.user.accountName
    return null
  }

  clearAccessToken() {
    this.cachedaccessToken = null
    this.storage.removeItem(this.accessTokenKey())
  }

  clearUser() {
    this.cachedUser = null
    this.storage.removeItem(this.userKey())
  }

  clear() {
    this.clearUser()
    this.clearAccessToken()
  }
}
