import { makeAutoObservable } from "mobx";

class HoverStore {
    hoveredStoreId = null;

    constructor() {
        makeAutoObservable(this);
    }

    setHoveredStore(id) {
        this.hoveredStoreId = id;
    }
}

export const hoverStore = new HoverStore();
