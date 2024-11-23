import { makeAutoObservable } from "mobx";

class AuthStore {
    authenticated = false;
    user = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeAuth();
    }

    initializeAuth() {
        if (typeof window !== 'undefined' && window.initialAuth) {
            this.setAuth(!!window.initialAuth.user);
            this.setUser(window.initialAuth.user);
        }
    }

    setAuth(status) {
        this.authenticated = status;
    }

    setUser(user) {
        this.user = user;
    }
}

export const authStore = new AuthStore();
