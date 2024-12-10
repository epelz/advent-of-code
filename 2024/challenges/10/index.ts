import main from "../../lib/main";
import {
    moveCoordinate,
    safeGetFromMatrix,
    uniqCoordinates,
    type Coordinate,
} from "../../lib/lists";
import { sum } from "../../lib/math";
import { CharSchema, MatrixSchema } from "../../lib/schemas";

interface MapSchema {
    map: Grid;
    trailheads: ReadonlyArray<Coordinate>;
}
type Grid = ReadonlyArray<ReadonlyArray<number>>;

const Schema = MatrixSchema(CharSchema, "").transform((input) => {
    const trailheads: Coordinate[] = [];
    const map = input.map((row, rowIdx) =>
        row.map((col, colIdx) => {
            if (col === "0") trailheads.push([rowIdx, colIdx]);
            return parseInt(col);
        }),
    );
    return { map, trailheads };
});

const parse = (input: string): MapSchema => Schema.parse(input);

const prettyPrint = (map: Grid): void => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(""));
    }
    console.log();
};

const findTrailEndPositions = (map: Grid, [x, y]: Coordinate): Coordinate[] => {
    const height = map[x][y];

    if (height === 9) return [[x, y]];

    const nextCoords = [
        moveCoordinate([x, y], "N"),
        moveCoordinate([x, y], "S"),
        moveCoordinate([x, y], "E"),
        moveCoordinate([x, y], "W"),
    ];
    // NB: Don't filter unique tuples here, as we want to be able to count total paths.
    return nextCoords
        .filter(
            ([x, y]) => safeGetFromMatrix(map, x, y, undefined) === height + 1,
        )
        .flatMap((coord) => findTrailEndPositions(map, coord));
};

const part1 = ({ map, trailheads }: MapSchema): number => {
    return sum(
        trailheads.map(
            (trailhead) =>
                uniqCoordinates(findTrailEndPositions(map, trailhead)).length,
        ),
    );
};

const part2 = ({ map, trailheads }: MapSchema): number => {
    return sum(
        trailheads.map(
            (trailhead) => findTrailEndPositions(map, trailhead).length,
        ),
    );
};

main(module, parse, part1, part2);
