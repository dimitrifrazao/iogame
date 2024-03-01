"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadtreeNode = void 0;
var transform_1 = require("./transform");
var vector_1 = require("./vector");
var QuadtreeNode = /** @class */ (function (_super) {
    __extends(QuadtreeNode, _super);
    function QuadtreeNode(pos, size, depth) {
        if (pos === void 0) { pos = new vector_1.Vector(0, 0); }
        if (size === void 0) { size = new vector_1.Vector(1, 1); }
        if (depth === void 0) { depth = 0; }
        var _this = _super.call(this, pos, size) || this;
        _this.depth = depth;
        _this.transforms = [];
        _this.children = [];
        return _this;
        //console.log("quad data", pos, size, depth);
    }
    QuadtreeNode.prototype.Clear = function () {
        this.transforms.length = 0;
        var size = this.children.length;
        for (var i = 0; i < size; i++) {
            this.children[i].Clear();
        }
        this.children.length = 0;
    };
    QuadtreeNode.prototype.Retrieve = function (transform) {
        var neighbours = [];
        this.RetrieveRec(transform, neighbours);
        return neighbours;
    };
    QuadtreeNode.prototype.RetrieveRec = function (transform, neighbours) {
        if (!this.CheckCollision(transform))
            return;
        if (this.children.length > 0) {
            this.children.forEach(function (child) {
                child.RetrieveRec(transform, neighbours);
            });
        }
        this.transforms.forEach(function (transform) {
            neighbours.push(transform);
        });
    };
    QuadtreeNode.prototype.Insert = function (transform) {
        var _this = this;
        if (this.children.length > 0) {
            this.children.forEach(function (child) {
                if (child.CheckCollision(transform)) {
                    child.Insert(transform);
                }
            });
            return;
        }
        this.transforms.push(transform);
        if (this.depth < QuadtreeNode.depthLimit &&
            this.transforms.length > QuadtreeNode.capacity) {
            this.subdivide();
            this.transforms.forEach(function (transform) {
                _this.Insert(transform);
            });
            this.transforms.length = 0;
        }
    };
    // Subdivide the node into four children quadrants
    QuadtreeNode.prototype.subdivide = function () {
        var center = this.GetPos();
        var size = this.GetSize();
        var halfSize = size.newScaleBy(0.5);
        var quarterSize = size.newScaleBy(0.25);
        var flipped = quarterSize.copy();
        flipped.x *= -1.0;
        var newDepth = this.depth + 1;
        this.children.push(new QuadtreeNode(center.newSub(quarterSize), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newAdd(quarterSize), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newSub(flipped), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newAdd(flipped), halfSize, newDepth));
    };
    QuadtreeNode.prototype.AddDataPacks = function (packs) {
        var p = _super.prototype.GetDataPack.call(this);
        p.type = transform_1.UnitType.QT;
        packs.push(p);
        this.children.forEach(function (child) {
            child.AddDataPacks(packs);
        });
    };
    return QuadtreeNode;
}(transform_1.Transform));
exports.QuadtreeNode = QuadtreeNode;
