import { UserInfo } from '../user/models'
import { IStorage } from '../core'

export default class LocalState {
  constructor(appId: string, storage: IStorage) {
    this.appId = appId
    this.cachedaccessToken = null
    this.cachedUser = null
    this.storage = storage
  }

  appId: string

  cachedaccessToken: string

  cachedUser: UserInfo

  storage: IStorage

  accessTokenKey() {
    return `oreid.${this.appId}.accessToken`
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

  clearAccessToken() {
    this.cachedaccessToken = null
    this.storage.removeItem(this.accessTokenKey())
  }

  clear() {
    this.clearAccessToken()
  }
}
