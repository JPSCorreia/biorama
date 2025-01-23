import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class AlertStore {
    // Observable state properties
    show = false; // Controls alert visibility
    message = ""; // Current alert message content
    severity = "success"; // Alert type: 'success', 'error', 'warning', 'info'
    lastMessage = null; // Tracks last message to prevent duplicate alerts
    timers = []; // Array of setTimeout IDs for auto-dismissal

    /**
     * Initializes the AlertStore with MobX observables and persistence
     */
    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: "AlertStore",
            properties: ["show", "message", "severity", "lastMessage"],
            storage: window.sessionStorage,
        });
    }

    /**
     * Displays a new alert if it's different from the last one
     * @param {string} message - The alert message to display
     * @param {string} severity - The alert severity type
     */
    setAlert(message, severity) {
        if (message !== this.lastMessage) {
            this.show = true;
            this.message = message;
            this.severity = severity;
            this.lastMessage = message;
        }
    }

    /**
     * Hides the alert without clearing its content
     */
    hideAlert() {
        this.show = false;
    }

    /**
     * Completely resets the alert state to default values
     */
    clearAlert() {
        this.show = false;
        this.message = "";
        this.severity = "success";
        this.lastMessage = null;
    }

    /**
     * Clears all active timeout timers
     */
    clearTimers() {
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers = [];
    }

    /**
     * Adds a new timer ID to the timers array
     * @param {number} timer - The setTimeout ID to track
     */
    addTimer(timer) {
        this.timers.push(timer);
    }

    /**
     * Completely resets the alert state and clears all timers
     */
    reset() {
        this.clearTimers();
        this.clearAlert();
    }
}

export const alertStore = new AlertStore();
