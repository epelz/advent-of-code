import main from "../../lib/main";
import { sum } from "../../lib/math";
import { type Direction, moveCoordinate, safeGetFromMatrix } from "../../lib/lists";
import { CharSchema, MatrixSchema } from "../../lib/schemas";

import z, { map } from "zod";

type MapSchema = ReadonlyArray<ReadonlyArray<string>>;
type Guard = "<" | ">" | "^" | "v";

const Schema = MatrixSchema(CharSchema, "").transform((input) => {
    return input;
});

const parse = (input: string): MapSchema => Schema.parse(input);

const findGuard = (map: MapSchema): [number, number] => {
    const guardSymbols = new Set(["<", ">", "^", "v"]);
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            if (guardSymbols.has(map[x][y])) {
                return [x, y];
            }
        }
    }
    throw new Error("No guard found");
}

const GUARD_TO_DIRECTION = {
    "^": "N" as Direction,
    "v": "S" as Direction,
    "<": "W" as Direction,
    ">": "E" as Direction,
};

const moveGuard = (map: string[][], guardLocation: [number, number]): { newMap: string[][], newGuardLocation: [number, number], state: "OK"|"OUT_OF_BOUNDS"|"ROTATED" } => {
    const [oldGuardX, oldGuardY] = guardLocation;
    const guard = map[oldGuardX][oldGuardY] as Guard;

    const [newGuardX, newGuardY] = moveCoordinate(guardLocation, GUARD_TO_DIRECTION[guard]);

    const valueAtNewGuard = safeGetFromMatrix(map, newGuardX, newGuardY, undefined);
    if (valueAtNewGuard === undefined) {
        map[oldGuardX][oldGuardY] = "X";
        return { newMap: map, newGuardLocation: [-1, -1], state: "OUT_OF_BOUNDS" };    
    } else if (valueAtNewGuard === "#") {
        const newGuardSymbol = guard === "^" ? ">" : guard === ">" ? "v" : guard === "v" ? "<" : "^";
        map[oldGuardX][oldGuardY] = newGuardSymbol;
        return { newMap: map, newGuardLocation: [oldGuardX, oldGuardY], state: "ROTATED" };
    }

    map[oldGuardX][oldGuardY] = "X";
    map[newGuardX][newGuardY] = guard;
    return { newMap: map, newGuardLocation: [newGuardX, newGuardY], state: "OK" };
}

const prettyPrint = (map: MapSchema): void => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(""));
    }
    console.log();
}

const part1 = (map: MapSchema): number => {
    let guardLocation = findGuard(map);
    let curMap = map.map(row => row.slice());

    // prettyPrint(curMap);
    while (true) {
        const { newMap, newGuardLocation, state } = moveGuard(curMap, guardLocation);
        curMap = newMap;
        // prettyPrint(curMap);

        if (state === "OUT_OF_BOUNDS") {
            break;
        }
        guardLocation = newGuardLocation;
    }

    return curMap.map((row) => row.filter((cell) => cell === "X").length).reduce((acc, cur) => acc+cur, 0);
};

main(module, parse, part1);
