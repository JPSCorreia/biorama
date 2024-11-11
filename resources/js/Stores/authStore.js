import { action, makeObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class AuthStore {
    authenticated = false;

    constructor() {
        makeObservable(this, {
            authenticated: observable,
            login: action,
            logout: action,
        });
        makePersistable(this, {
            name: 'AuthStore',
            properties: ['authenticated'],
            storage: window.localStorage,
        });
    }

    login = action(() => {
        this.authenticated = true;
    });

    logout = action(() => {
        this.authenticated = false;
    });
}

export const authStore = new AuthStore();
