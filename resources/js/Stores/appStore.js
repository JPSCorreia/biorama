import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class AppStore {
    // Observable state properties
    themeType = "light"; // Default theme type for the application

    /**
     * Initializes the AppStore with MobX observables and persistence
     */
    constructor() {
        makeObservable(this, {
            themeType: observable,
            changeThemeType: action,
        });
        makePersistable(this, {
            name: "AppStore",
            properties: ["themeType"],
            storage: window.localStorage,
        });
    }

    /**
     * Changes the theme type between "light" and "dark"
     */
    changeThemeType = action(() => {
        this.themeType == "light"
            ? (this.themeType = "dark")
            : (this.themeType = "light");
    });
}

export const appStore = new AppStore();
