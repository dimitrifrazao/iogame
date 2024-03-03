"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
class GameObject {
    constructor() {
        this.state = true;
    }
    Init() { }
    Update(dt) { }
    SetUpdateTo(state) {
        if (state !== this.state) {
            if (state) {
                GameObject.updatables.push(this);
            }
            else {
                let i = GameObject.updatables.indexOf(this);
                delete GameObject.updatables[i];
                GameObject.updatables.splice(i, 1);
            }
            this.state = state;
        }
    }
    static UpdateAll(dt) {
        for (let gameObject of GameObject.updatables) {
            gameObject.Update(dt);
        }
    }
}
exports.GameObject = GameObject;
GameObject.updatables = [];
