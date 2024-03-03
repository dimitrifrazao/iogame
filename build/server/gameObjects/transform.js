"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
const world_1 = require("../mainGame/world");
const vector_1 = require("../../shared/vector");
const color_1 = require("../../shared/color");
const playerInput_1 = require("../../shared/enums/playerInput");
const gameObject_1 = require("./gameObject");
const boundingBox_1 = require("../../shared/boundingBox");
const unitType_1 = require("../../shared/enums/unitType");
const data_1 = require("../../shared/data");
class Transform extends gameObject_1.GameObject {
    constructor(pos = new vector_1.Vector(), size = new vector_1.Vector(1, 1)) {
        super();
        this.pos = pos;
        this.size = size;
        this.id = -1;
        this.unitType = unitType_1.UnitType.None;
        this.color = color_1.Color.DarkGrey;
        this.previousPos = new vector_1.Vector();
    }
    GetId() {
        return this.id;
    }
    GetUnitType() {
        return this.unitType;
    }
    SetPos(pos) {
        this.SetPosValues(pos.x, pos.y);
    }
    SetPosValues(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    GetPos() {
        return this.pos.Copy();
    }
    AddPos(pos) {
        this.pos.add(pos);
    }
    SetPreviousPos(pos) {
        this.previousPos.x = pos.x;
        this.previousPos.y = pos.y;
    }
    AddPreviousPos(pos) {
        this.previousPos.add(pos);
    }
    GetPreviousPos() {
        return this.previousPos.Copy();
    }
    SetSize(size) {
        this.SetSizeValues(size.x, size.y);
    }
    SetSizeValues(x, y) {
        this.size.x = x;
        this.size.y = y;
    }
    GetSize() {
        return this.size.Copy();
    }
    SetColor(color) {
        this.color = color.Copy();
    }
    GetColor() {
        return this.color.Copy();
    }
    GetBoundingBox() {
        return new boundingBox_1.BoundingBox(this.GetTopLeftPos(), this.GetBotRightPos());
    }
    GetOldBoundingBox() {
        return boundingBox_1.BoundingBox.MakeFromPosAndSize(this.GetPreviousPos(), this.GetSize());
    }
    GetCombinedBoundingBox() {
        return boundingBox_1.BoundingBox.Add(this.GetBoundingBox(), this.GetOldBoundingBox());
    }
    GetDataPack() {
        let dPack = new data_1.DataPack();
        dPack.SetPos(this.GetTopLeftPos());
        dPack.SetSize(this.GetSize());
        dPack.SetColor(this.GetColor());
        dPack.id = this.GetId();
        dPack.unitType = this.GetUnitType();
        return dPack;
    }
    CheckCollision(trans) {
        return (Math.abs(this.pos.x - trans.pos.x) < (this.size.x + trans.size.x) / 2 &&
            Math.abs(this.pos.y - trans.pos.y) < (this.size.y + trans.size.y) / 2);
    }
    CheckBBCollision(bb) {
        return this.CheckCollision(Transform.MakeFromBoundingBox(bb));
    }
    GetOverlap(trans) {
        let bb1 = this.GetBoundingBox();
        let bb2 = trans.GetBoundingBox();
        let bb3 = boundingBox_1.BoundingBox.Sub(bb1, bb2);
        return Transform.MakeFromBoundingBox(bb3);
    }
    ApplyBulletOverlapPush(bulletStretch, overlap) {
        if (bulletStretch.size.x > bulletStretch.size.y) {
            this.pos.x -= overlap.size.x;
        }
        else {
            this.pos.x -= overlap.size.y;
        }
    }
    GetTopLeftPos() {
        return this.pos.newSub(this.size.newScaleBy(0.5));
    }
    GetBotRightPos() {
        return this.pos.newAdd(this.size.newScaleBy(0.5));
    }
    GetArea() {
        return this.size.x * this.size.y;
    }
    CheckWorldWrap() {
        world_1.World.inst.WorldWrapTransform(this);
    }
    static GetMirrorDir(dir) {
        switch (dir) {
            case playerInput_1.DirEnum.Left:
                return playerInput_1.DirEnum.Right;
            case playerInput_1.DirEnum.Right:
                return playerInput_1.DirEnum.Left;
            case playerInput_1.DirEnum.Up:
                return playerInput_1.DirEnum.Down;
            case playerInput_1.DirEnum.Down:
                return playerInput_1.DirEnum.Up;
            case playerInput_1.DirEnum.UpLeft:
                return playerInput_1.DirEnum.DownRight;
            case playerInput_1.DirEnum.UpRight:
                return playerInput_1.DirEnum.DownLeft;
        }
        return playerInput_1.DirEnum.None;
    }
    static MakeFromBoundingBox(bb) {
        return new Transform(bb.GetCenterPoint(), bb.GetSize());
    }
}
exports.Transform = Transform;
