import { makeAutoObservable } from "mobx";
import { makePersistable } from 'mobx-persist-store';

class AlertStore {
    show = false;
    message = '';
    severity = 'success';
    lastMessage = null;
    timers = [];

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'AlertStore',
            properties: ['show', 'message', 'severity', 'lastMessage'],
            storage: window.localStorage
        });
    }

    setAlert(message, severity) {
        if (message !== this.lastMessage) {
            this.show = true;
            this.message = message;
            this.severity = severity;
            this.lastMessage = message;
        }
    }

    hideAlert() {
        this.show = false;
    }

    clearAlert() {
        this.show = false;
        this.message = '';
        this.severity = 'success';
        this.lastMessage = null;
    }

    clearTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }

    addTimer(timer) {
        this.timers.push(timer);
    }

    reset() {
        this.clearTimers();
        this.clearAlert();
    }
}

export const alertStore = new AlertStore();