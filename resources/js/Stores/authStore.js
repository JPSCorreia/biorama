import { makeAutoObservable } from "mobx";

class AuthStore {
    user = null;
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
    }

    updateAuth(auth) {
        this.isAuthenticated = !!auth?.user;
        this.user = auth?.user || null;
    }

    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }
}

export const authStore = new AuthStore();
