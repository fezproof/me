import { Delaunay } from "d3-delaunay";

export interface Extents {
  width: number;
  height: number;
}

export type Point = [x: number, y: number];
export type Triangle = [a: Point, b: Point, c: Point];

export const randomPoints = (count: number, { width, height }: Extents) => {
  const pts = Array.from<unknown, Point>({ length: count }, () => [
    Math.random() * width,
    Math.random() * height,
  ]);

  return pts;
};

const edgesOfTriangle = (t: number): [number, number, number] => {
  return [3 * t, 3 * t + 1, 3 * t + 2];
};

const pointsOfTriangle = (
  delaunay: Delaunay<Delaunay.Point>,
  t: number
): [number, number, number] => {
  const edges = edgesOfTriangle(t);

  return edges.map((e) => delaunay.triangles[e]) as [number, number, number];
};

const getTriangle = (
  points: Point[],
  delaunay: Delaunay<Delaunay.Point>,
  t: number
) => pointsOfTriangle(delaunay, t).map((p) => points[p]) as Triangle;

function getTriangles(points: Point[], delaunay: Delaunay<Delaunay.Point>) {
  const triangles: Triangle[] = [];
  for (let t = 0; t < delaunay.triangles.length / 3; t++) {
    const triangle = getTriangle(points, delaunay, t);

    triangles.push(triangle);
  }

  return triangles;
}

function centroid(pts: Point[]): Point {
  var x = 0;
  var y = 0;
  for (var i = 0; i < pts.length; i++) {
    x += pts[i][0];
    y += pts[i][1];
  }
  return [x / pts.length, y / pts.length];
}

const addExtents = (points: Point[], { width, height }: Extents): Point[] => {
  return [[0, 0], [width, 0], [0, height], [width, height], ...points];
};

export const improvePoints = (points: Point[], { width, height }: Extents) => {
  const delaunay = Delaunay.from(points);

  const voronoi = delaunay.voronoi([0, 0, width, height]);

  const relaxedPoints: Point[] = [];
  for (const polygon of voronoi.cellPolygons()) {
    relaxedPoints.push(centroid(polygon));
  }

  return relaxedPoints;
};

export const triangulate = (points: Point[], extents?: Extents) => {
  const extendedPoints = extents ? addExtents(points, extents) : points;

  const delaunay = Delaunay.from(extendedPoints);

  return getTriangles(extendedPoints, delaunay);
};
