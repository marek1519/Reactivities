import { makeAutoObservable, runInAction } from "mobx";
import { myHistory } from "../../features/history";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./Store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null) {
    this.user = user;
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: Partial<UserFormValues>) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      this.setUser(user);
      myHistory.push("/activities");
      store.modalStore.closeModal();
    } catch (e) {
      throw e;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.setUser(null);
    myHistory.push("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      //this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      await agent.Account.register(creds);
      myHistory.push(`/account/registerSuccess?email=${creds.email}`);
      store.modalStore.closeModal();
  } catch (error) {
      throw error;
  }
  };
}
