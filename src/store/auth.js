import { observable, decorate, toJS, action } from "mobx";

class AuthStore {
  auth = "";
  username = "";
  email = "";

  setUsername(name) {
    this.username = name;
  }

  setEmail(email) {
    this.email = email;
  }
}

decorate(AuthStore, {
  username: observable,
  email: observable,
  groups: observable,
  setUsername: action,
  setEmail: action,
  getUser: action,
});

export const authStore = new AuthStore();
