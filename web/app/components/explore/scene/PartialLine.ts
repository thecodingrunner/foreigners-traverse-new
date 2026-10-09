import type { InterleavedBufferAttribute } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import type { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { RoutePoint } from "./routeMath";

/**
 * A thick route line that can be drawn up to any point along it, without
 * rebuilding its geometry: we draw fewer segments, and move the end of the
 * last one to the exact point.
 */
export class PartialLine {
  readonly line: Line2;
  private readonly source: number[];
  private readonly segmentCount: number;
  private patched = -1;

  constructor(positions: number[], material: LineMaterial) {
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    this.line = new Line2(geometry, material);
    this.line.computeLineDistances();
    this.line.frustumCulled = false;
    this.source = positions;
    this.segmentCount = positions.length / 3 - 1;
  }

  /** Each segment is stored as [startX, startY, startZ, endX, endY, endZ]. */
  private get buffer() {
    return (
      this.line.geometry.attributes.instanceStart as InterleavedBufferAttribute
    ).data;
  }

  private writeEnd(segment: number, x: number, y: number, z: number) {
    const array = this.buffer.array as Float32Array;
    array[segment * 6 + 3] = x;
    array[segment * 6 + 4] = y;
    array[segment * 6 + 5] = z;
    this.buffer.needsUpdate = true;
  }

  /** Put back the segment end we moved last time. */
  private restore() {
    if (this.patched < 0) return;
    const i = (this.patched + 1) * 3;
    this.writeEnd(
      this.patched,
      this.source[i],
      this.source[i + 1],
      this.source[i + 2],
    );
    this.patched = -1;
  }

  showAll() {
    this.restore();
    this.line.geometry.instanceCount = this.segmentCount;
    this.line.visible = true;
  }

  hide() {
    this.restore();
    this.line.visible = false;
  }

  showUpTo(point: RoutePoint) {
    this.restore();
    this.writeEnd(point.segment, point.x, point.y, point.z);
    this.patched = point.segment;
    this.line.geometry.instanceCount = point.segment + 1;
    this.line.visible = true;
  }

  dispose() {
    this.line.geometry.dispose();
  }
}
