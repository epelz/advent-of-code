import main from "../../lib/main";
import {
    Direction,
    moveCoordinate,
    safeGetFromMatrix,
    uniqCoordinates,
    type Coordinate,
} from "../../lib/lists";
import { sum } from "../../lib/math";
import { CharSchema, MatrixSchema } from "../../lib/schemas";
import assert from "assert";

interface Schema {
    grid: Grid;
    regions: ReadonlyArray<Region>;
}
type Grid = ReadonlyArray<ReadonlyArray<string>>;
interface Region {
    type: string;
    plots: Coordinate[];
}

const hasCoord = (region: Region, [x, y]: Coordinate) =>
    region.plots.some(([x1, y1]) => x1 === x && y1 === y);
const isNeighbor = (region: Region, [x, y]: Coordinate) => {
    return (["N", "E", "S", "W"] as Direction[]).some((dir) =>
        hasCoord(region, moveCoordinate([x, y], dir)),
    );
};
const Schema = MatrixSchema(CharSchema, "").transform((input) => {
    let regions: Region[] = [];

    input.forEach((row, rowIdx) => {
        row.forEach((col, colIdx) => {
            const adjoiningRegions = regions.filter(
                (region) =>
                    region.type === col && isNeighbor(region, [rowIdx, colIdx]),
            );

            if (adjoiningRegions.length === 1) {
                adjoiningRegions[0].plots.push([rowIdx, colIdx]);
            } else if (adjoiningRegions.length === 0) {
                regions.push({ type: col, plots: [[rowIdx, colIdx]] });
            } else {
                // Non-unique adjoining regions
                regions.push({
                    type: col,
                    plots: [
                        ...adjoiningRegions.flatMap((r) => r.plots),
                        [rowIdx, colIdx],
                    ],
                });
                regions = regions.filter((r) => !adjoiningRegions.includes(r));
            }
        });
    });

    return { grid: input, regions };
});

const parse = (input: string): Schema => Schema.parse(input);

const prettyPrint = (map: Grid): void => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(""));
    }
    console.log();
};

const regionArea = (region: Region): number => region.plots.length;
const regionPerimeter = (region: Region): number => {
    return sum(
        region.plots.map(([x, y]) => {
            return (["N", "E", "S", "W"] as Direction[]).filter(
                (dir) => !hasCoord(region, moveCoordinate([x, y], dir)),
            ).length;
        }),
    );
};

const part1 = ({ grid, regions }: Schema): number => {
    return regions
        .map((region) => regionArea(region) * regionPerimeter(region))
        .reduce((acc, val) => acc + val, 0);
};

const regionSides = (region: Region): number => {
    return sum(
        region.plots.map(([x, y]) => {
            let total = 0;
            const [N, E, S, W, NE, NW, SE, SW] = (
                ["N", "E", "S", "W", "NE", "NW", "SE", "SW"] as Direction[]
            ).map((dir) => moveCoordinate([x, y], dir));

            if (!hasCoord(region, W) && !hasCoord(region, N)) total++;
            if (!hasCoord(region, N) && !hasCoord(region, E)) total++;
            if (!hasCoord(region, E) && !hasCoord(region, S)) total++;
            if (!hasCoord(region, S) && !hasCoord(region, W)) total++;

            if (
                hasCoord(region, W) &&
                hasCoord(region, S) &&
                !hasCoord(region, SW)
            )
                total++;
            if (
                hasCoord(region, W) &&
                hasCoord(region, N) &&
                !hasCoord(region, NW)
            )
                total++;
            if (
                hasCoord(region, E) &&
                hasCoord(region, S) &&
                !hasCoord(region, SE)
            )
                total++;
            if (
                hasCoord(region, E) &&
                hasCoord(region, N) &&
                !hasCoord(region, NE)
            )
                total++;

            return total;
        }),
    );
};

const part2 = ({ grid, regions }: Schema): number => {
    return regions
        .map((region) => regionArea(region) * regionSides(region))
        .reduce((acc, val) => acc + val, 0);
};

main(module, parse, part1, part2);
