import main from "../../lib/main";
import { safeGetFromMatrix } from "../../lib/lists";
import { CharSchema, MatrixSchema } from "../../lib/schemas";
import { close } from "fs";

interface MapSchema {
    map: Grid;
    nodes: ReadonlyMap<Frequency, Coordinate[]>;
}
type Grid = ReadonlyArray<ReadonlyArray<string>>;

type Frequency = string;
type Coordinate = [number, number];

const Schema = MatrixSchema(CharSchema, "").transform((input) => {
    const nodes = new Map<Frequency, Coordinate[]>();
    input.forEach((row, rowId) => {
        row.forEach((col, colId) => {
            if (col !== ".") {
                if (nodes.has(col)) {
                    nodes.get(col)!.push([rowId, colId]);
                } else {
                    nodes.set(col, [[rowId, colId]]);
                }
            }
        });
    });

    return { map: input, nodes };
});

const parse = (input: string): MapSchema => Schema.parse(input);

const prettyPrint = (map: Grid): void => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(""));
    }
    console.log();
};

const antinodePositions = (a: Coordinate, b: Coordinate): Coordinate[] => {
    const [x_distance, y_distance] = [a[0] - b[0], a[1] - b[1]];
    return [
        [a[0] + x_distance, a[1] + y_distance],
        [b[0] - x_distance, b[1] - y_distance],
    ];
};
const allAntinodePositions = (coordinates: Coordinate[]): Coordinate[] => {
    const current_antinodes: Coordinate[] = [];
    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
            current_antinodes.push(
                ...antinodePositions(coordinates[i], coordinates[j]),
            );
        }
    }
    return current_antinodes;
};

const part1 = ({ map, nodes }: MapSchema): number => {
    const antinodes = nodes
        .entries()
        .flatMap(([_, coordinates]) => allAntinodePositions(coordinates))
        .filter(
            (coord) =>
                safeGetFromMatrix(map, ...coord, undefined) !== undefined,
        );

    // NB: Can't customize set equality, so converting to a string.
    return new Set(antinodes.map((antinode) => antinode.join(","))).size;
};

main(module, parse, part1);
