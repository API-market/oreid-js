import Helpers from './helpers';
import StorageHandler from './storage';

// avoid Helpers.isNullOrEmpty, use isNullOrEmpty()
const { isNullOrEmpty } = Helpers;

export default class LocalState {
  constructor(options) {
    this.options = options;
    this.user = null;
    this.storage = new StorageHandler();
  }

  userKey() {
    return `oreid.${this.options.appId}.user`;
  }

  saveUser(user) {
    this.user = user;

    if (!isNullOrEmpty(this.user)) {
      const serialized = JSON.stringify(this.user);
      this.storage.setItem(this.userKey(), serialized);
    }
  }

  getAccountName() {
    const user = this.getUser();

    if (user) {
      return user.accountName;
    }

    return null;
  }


  getUser() {
    if (!this.user) {
      this.loadUser();
    }

    return this.user;
  }

  loadUser() {
    this.user = null;
    const serialized = this.storage.getItem(this.userKey());

    if (!isNullOrEmpty(serialized)) {
      this.user = JSON.parse(serialized);
    }
  }

  clear() {
    this.storage.removeItem(this.userKey());
  }
}
