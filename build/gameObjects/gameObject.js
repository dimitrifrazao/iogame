"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingBox = exports.GameObject = void 0;
var vector_1 = require("../gameObjects/vector");
var GameObject = /** @class */ (function () {
    function GameObject() {
        this.state = true;
    }
    GameObject.prototype.Init = function () { };
    GameObject.prototype.Update = function (dt) { };
    GameObject.prototype.SetUpdateTo = function (state) {
        if (state !== this.state) {
            if (state) {
                GameObject.updatables.push(this);
            }
            else {
                var i = GameObject.updatables.indexOf(this);
                delete GameObject.updatables[i];
                GameObject.updatables.splice(i, 1);
            }
            this.state = state;
        }
    };
    GameObject.UpdateAll = function (dt) {
        for (var _i = 0, _a = GameObject.updatables; _i < _a.length; _i++) {
            var gameObject = _a[_i];
            gameObject.Update(dt);
        }
    };
    GameObject.updatables = [];
    return GameObject;
}());
exports.GameObject = GameObject;
var BoundingBox = /** @class */ (function () {
    function BoundingBox() {
        this.topLeft = new vector_1.Vector();
        this.botRight = new vector_1.Vector();
    }
    return BoundingBox;
}());
exports.BoundingBox = BoundingBox;
