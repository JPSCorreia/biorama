import { action, makeObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class AppStore {
    themeType = 'light';

    constructor() {
        makeObservable(this, {
            themeType: observable,
            changeThemeType: action,
        });
        makePersistable(this, {
            name: 'AppStore',
            properties: ['themeType'],
            storage: window.localStorage,
        });
    }

    changeThemeType = action(() => {
        this.themeType == 'light'
            ? (this.themeType = 'dark')
            : (this.themeType = 'light');
    });
}

export const appStore = new AppStore();
