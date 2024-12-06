import main from "../../lib/main";
import {
    type Direction,
    moveCoordinate,
    safeGetFromMatrix,
} from "../../lib/lists";
import { CharSchema, MatrixSchema } from "../../lib/schemas";

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
};

const GUARD_TO_DIRECTION = {
    "^": "N" as Direction,
    v: "S" as Direction,
    "<": "W" as Direction,
    ">": "E" as Direction,
};

const GUARD_TO_POSITION = {
    "^": "|",
    v: "|",
    "<": "-",
    ">": "-",
    MULTI: "+",
};

const GUARD_TO_ANTI_POSITION = {
    "^": "-",
    v: "-",
    "<": "|",
    ">": "|",
    MULTI: "+",
};

const ROTATE_GUARD = {
    "^": ">",
    ">": "v",
    v: "<",
    "<": "^",
};

const moveGuard = (
    map: string[][],
    guardLocation: [number, number],
    forceLeaveBehindSymbol?: string,
): {
    shouldLeaveMultiNext: boolean;
    newMap: string[][];
    newGuardLocation: [number, number];
    state: "OK" | "OUT_OF_BOUNDS" | "ROTATED";
} => {
    const [oldGuardX, oldGuardY] = guardLocation;
    const guard = map[oldGuardX][oldGuardY] as Guard;

    const [newGuardX, newGuardY] = moveCoordinate(
        guardLocation,
        GUARD_TO_DIRECTION[guard],
    );

    const valueAtNewGuard = safeGetFromMatrix(
        map,
        newGuardX,
        newGuardY,
        undefined,
    );
    const leaveBehindSymbol =
        forceLeaveBehindSymbol ?? GUARD_TO_POSITION[guard];

    if (valueAtNewGuard === undefined) {
        map[oldGuardX][oldGuardY] = leaveBehindSymbol;
        return {
            newMap: map,
            newGuardLocation: [-1, -1],
            state: "OUT_OF_BOUNDS",
            shouldLeaveMultiNext: false,
        };
    } else if (valueAtNewGuard === "#" || valueAtNewGuard === "O") {
        map[oldGuardX][oldGuardY] = ROTATE_GUARD[guard];
        return {
            newMap: map,
            newGuardLocation: [oldGuardX, oldGuardY],
            state: "ROTATED",
            shouldLeaveMultiNext: true,
        };
    }

    const shouldLeaveMultiNext =
        valueAtNewGuard === GUARD_TO_ANTI_POSITION[guard];
    map[oldGuardX][oldGuardY] = leaveBehindSymbol;
    map[newGuardX][newGuardY] = guard;
    return {
        newMap: map,
        newGuardLocation: [newGuardX, newGuardY],
        state: "OK",
        shouldLeaveMultiNext,
    };
};

const prettyPrint = (map: MapSchema): void => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(""));
    }
    console.log();
};

const part1 = (map: MapSchema): number => {
    let guardLocation = findGuard(map);
    let curMap = map.map((row) => row.slice());

    while (true) {
        const { newMap, newGuardLocation, state } = moveGuard(
            curMap,
            guardLocation,
            "X",
        );
        curMap = newMap;

        if (state === "OUT_OF_BOUNDS") {
            break;
        }
        guardLocation = newGuardLocation;
    }

    return curMap
        .map((row) => row.filter((cell) => cell === "X").length)
        .reduce((acc, cur) => acc + cur, 0);
};

const hasLoop = (map: string[][]): boolean => {
    let guardLocation = findGuard(map);

    const visitRecord = new Map<string, boolean>(); // Used for loop detection
    let shouldLeaveMulti = false; // Used to correctly draw `+`
    while (true) {
        const { newGuardLocation, state, shouldLeaveMultiNext } = moveGuard(
            map,
            guardLocation,
            shouldLeaveMulti ? "+" : undefined,
        );

        if (state === "OUT_OF_BOUNDS") {
            break;
        }

        const key = `${newGuardLocation[0]}.${newGuardLocation[1]}.${map[newGuardLocation[0]][newGuardLocation[1]]}`;
        if (visitRecord.get(key)) {
            return true;
        }
        visitRecord.set(key, true);

        shouldLeaveMulti = shouldLeaveMultiNext;

        guardLocation = newGuardLocation;
    }

    return false;
};

const part2 = (map: MapSchema): number => {
    let numLoops = 0;

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            if (map[x][y] === ".") {
                const curMap = map.map((row) => row.slice());
                curMap[x][y] = "O";
                if (hasLoop(curMap)) {
                    numLoops++;
                }
            }
        }
    }

    return numLoops;
};

main(module, parse, part1, part2);
