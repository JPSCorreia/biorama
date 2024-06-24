import { action, makeObservable, observable } from 'mobx';
// import { computed } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class AppStore {
    themeType = 'light';

    constructor() {
        makeObservable(this, {
            themeType: observable,
            changeThemeType: action,
            // currentThemeType: computed,
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

    // Não estamos a usar, boa prática usar
    //   get currentThemeType() {
    //     return this.themeType;
    // }
}

export const appStore = new AppStore();
