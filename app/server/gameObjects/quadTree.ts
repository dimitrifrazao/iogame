import { Transform } from "./transform";
import { Vector } from "../../shared/vector";
import { UnitType } from "../../shared/enums/unitType";
import { DataPack } from "../../shared/data";
import { Color } from "../../shared/color";

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
    let size = this.children.length;
    for (let i = 0; i < size; i++) {
      this.children[i].Clear();
    }
    this.transforms.length = 0;
    this.children.length = 0;
  }

  Retrieve(transform: Transform): Set<Transform> {
    let neighbours = new Set<Transform>();
    this.RetrieveRec(transform, neighbours);
    return neighbours;
  }

  private RetrieveRec(transform: Transform, neighbours: Set<Transform>) {
    if (!this.CheckCollision(transform)) return;
    this.children.forEach((child) => {
      child.RetrieveRec(transform, neighbours);
    });
    this.transforms.forEach((transform) => {
      neighbours.add(transform);
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
    let center = this.GetPos();
    let size = this.GetSize();
    let halfSize = size.newScaleBy(0.5);
    let quarterSize = size.newScaleBy(0.25);
    let flipped = quarterSize.Copy();
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

  AddDataPacks(packs: DataPack[]) {
    let p = super.GetDataPack();
    p.unitType = UnitType.QuadTree;
    p.SetColor(Color.Green);
    packs.push(p);
    this.children.forEach((child) => {
      child.AddDataPacks(packs);
    });
  }
}
