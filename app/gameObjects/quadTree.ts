import { Transform, UnitType } from "./transform";
import { Vector } from "./vector";

export class QuadtreeNode extends Transform {
  static root: QuadtreeNode;
  static depthLimit: number;
  static capacity: number;
  protected transforms: Transform[] = [];
  protected children: QuadtreeNode[] = [];

  constructor(
    pos: Vector = new Vector(0, 0),
    size: Vector = new Vector(1, 1),
    protected depth: number = 0
  ) {
    super(pos, size);
    //console.log("quad data", pos, size, depth);
  }

  Clear() {
    this.transforms.length = 0;
    let size = this.children.length;
    for (let i = 0; i < size; i++) {
      this.children[i].Clear();
    }
    this.children.length = 0;
  }

  Retrieve(transform: Transform): Transform[] {
    let neighbours: Transform[] = [];
    this.RetrieveRec(transform, neighbours);
    return neighbours;
  }

  private RetrieveRec(transform: Transform, neighbours: Transform[]) {
    if (!this.CheckCollision(transform)) return;
    if (this.children.length > 0) {
      this.children.forEach((child) => {
        child.RetrieveRec(transform, neighbours);
      });
    }
    this.transforms.forEach((transform) => {
      neighbours.push(transform);
    });
  }

  Insert(transform: Transform) {
    if (this.children.length > 0) {
      this.children.forEach((child) => {
        if (child.CheckCollision(transform)) {
          child.Insert(transform);
        }
      });
      return;
    }
    this.transforms.push(transform);
    if (
      this.depth < QuadtreeNode.depthLimit &&
      this.transforms.length > QuadtreeNode.capacity
    ) {
      this.subdivide();
      this.transforms.forEach((transform) => {
        this.Insert(transform);
      });
      this.transforms.length = 0;
    }
  }

  // Subdivide the node into four children quadrants
  subdivide() {
    const center = this.GetPos();
    const size = this.GetSize();
    const halfSize = size.newScaleBy(0.5);
    const quarterSize = size.newScaleBy(0.25);
    const flipped = quarterSize.copy();
    flipped.x *= -1.0;
    let newDepth = this.depth + 1;

    this.children.push(
      new QuadtreeNode(center.newSub(quarterSize), halfSize, newDepth)
    );
    this.children.push(
      new QuadtreeNode(center.newAdd(quarterSize), halfSize, newDepth)
    );
    this.children.push(
      new QuadtreeNode(center.newSub(flipped), halfSize, newDepth)
    );
    this.children.push(
      new QuadtreeNode(center.newAdd(flipped), halfSize, newDepth)
    );
  }

  AddDataPacks(packs: object[]) {
    let p = super.GetDataPack();
    p.type = UnitType.QT;
    packs.push(p);
    this.children.forEach((child) => {
      child.AddDataPacks(packs);
    });
  }
}
