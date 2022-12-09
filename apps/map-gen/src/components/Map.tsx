import { createMemo, createSignal, For, onMount } from "solid-js";
import {
  Extents,
  improvePoints,
  Point,
  randomPoints,
  triangulate,
} from "../lib/random-points";

const POINTS_COUNT = 10000;

const Map = () => {
  let svgRef: SVGSVGElement;

  const [svgExtents, setSvgExtents] = createSignal<Extents>(null);

  onMount(() => {
    setSvgExtents({ width: svgRef.clientWidth, height: svgRef.clientHeight });
  });

  const points = createMemo((): Point[] => {
    const extents = svgExtents();
    if (extents === null) return [];

    const { width, height } = extents;

    const points: Point[] = randomPoints(POINTS_COUNT, {
      width: width,
      height: height,
    });

    return improvePoints(points, extents);
  });

  const triangles = createMemo(() => {
    const extents = svgExtents();
    if (extents === null) return [];

    return triangulate(points(), extents);
  });

  return (
    <div class="h-full mx-auto aspect-square">
      <svg
        ref={svgRef}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full  bg-gray-100 dark:bg-gray-900"
      >
        <For each={points()}>
          {([x, y]) => <circle cx={x} cy={y} r={1} fill="white" />}
        </For>

        <For each={triangles()}>
          {(triangle) => (
            <polygon
              points={triangle.join(" ")}
              fill="none"
              stroke="white"
              stroke-width={0.5}
            />
          )}
        </For>
      </svg>
    </div>
  );
};

export default Map;
