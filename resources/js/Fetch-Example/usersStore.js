import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import axios from 'axios';

class UsersStore {
    users = [];

    constructor() {
        makeObservable(this, {
            users: observable,
            addUser: action,
            fetchUser: action,
            deleteUser: action,
            clearUsers: action,
            total: computed,
        });
        makePersistable(this, {
            name: 'UsersStore',
            properties: ['users'],
            storage: window.localStorage,
        });
    }

    addUser = action((name) => {
        const newUser = {
            id:
                this.users.length > 0
                    ? this.users[this.users.length - 1].id + 1
                    : 1,
            name,
        };
        runInAction(() => {
            this.users.push(newUser);
        });
    });

    fetchUser = async (id) => {
        try {
            const response = await axios.get(
                `https://jsonplaceholder.typicode.com/users/${id}`
            );
            const userData = response.data;

            const newUser = {
                id:
                    this.users.length > 0
                        ? this.users[this.users.length - 1].id + 1
                        : 1,
                name: userData.name,
            };

            runInAction(() => {
                this.users.push(newUser);
            });
        } catch (error) {
            console.error('Failed to fetch user', error);
        }
    };

    clearUsers = action(() => {
        this.users = [];
    });

    deleteUser = action((index) => {
        this.users.splice(index, 1);
    });

    // addUser = (name) => {
    //   setTimeout(
    //     action(() => {
    //       const newUser = {
    //         id: this.users.length + 1,
    //         name,
    //       };
    //       this.users.push(newUser);
    //     }),
    //     10
    //   );
    // };

    get total() {
        return this.users.length;
    }
}

export const usersStore = new UsersStore();
