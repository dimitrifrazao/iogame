"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadtreeNode = void 0;
const transform_1 = require("./transform");
const vector_1 = require("../../shared/vector");
const unitType_1 = require("../../shared/enums/unitType");
const color_1 = require("../../shared/color");
class QuadtreeNode extends transform_1.Transform {
    constructor(pos = new vector_1.Vector(0, 0), size = new vector_1.Vector(1, 1), depth = 0) {
        super(pos, size);
        this.depth = depth;
        this.transforms = [];
        this.children = [];
        //console.log("quad data", pos, size, depth);
    }
    Clear() {
        let size = this.children.length;
        for (let i = 0; i < size; i++) {
            this.children[i].Clear();
        }
        this.transforms.length = 0;
        this.children.length = 0;
    }
    Retrieve(transform) {
        let neighbours = new Set();
        this.RetrieveRec(transform, neighbours);
        return neighbours;
    }
    RetrieveRec(transform, neighbours) {
        if (!this.CheckCollision(transform))
            return;
        this.children.forEach((child) => {
            child.RetrieveRec(transform, neighbours);
        });
        this.transforms.forEach((transform) => {
            neighbours.add(transform);
        });
    }
    Insert(transform) {
        if (this.children.length > 0) {
            this.children.forEach((child) => {
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
            this.transforms.forEach((transform) => {
                this.Insert(transform);
            });
            this.transforms.length = 0;
        }
    }
    // Subdivide the node into four children quadrants
    subdivide() {
        let center = this.GetPos();
        let size = this.GetSize();
        let halfSize = size.newScaleBy(0.5);
        let quarterSize = size.newScaleBy(0.25);
        let flipped = quarterSize.Copy();
        flipped.x *= -1.0;
        let newDepth = this.depth + 1;
        this.children.push(new QuadtreeNode(center.newSub(quarterSize), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newAdd(quarterSize), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newSub(flipped), halfSize, newDepth));
        this.children.push(new QuadtreeNode(center.newAdd(flipped), halfSize, newDepth));
    }
    AddDataPacks(packs) {
        let p = super.GetDataPack();
        p.unitType = unitType_1.UnitType.QuadTree;
        p.SetColor(color_1.Color.Green);
        packs.push(p);
        this.children.forEach((child) => {
            child.AddDataPacks(packs);
        });
    }
}
exports.QuadtreeNode = QuadtreeNode;
