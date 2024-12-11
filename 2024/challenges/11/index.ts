import main from "../../lib/main";
import { IntSchema } from "../../lib/schemas";
import { sum } from "../../lib/math";

import z from "zod";

type Stones = ReadonlyArray<number>;

const Schema = z
    .string()
    .transform((input) => {
        return input.split(" ").map((stone) => parseInt(stone, 10));
    })
    .pipe(z.array(IntSchema));

const parse = (input: string): Stones => Schema.parse(input);

const runRule = (stone: number): number[] => {
    const stoneStr = stone.toString();

    if (stone === 0) return [1];
    else if (stoneStr.length % 2 === 0) {
        const half = stoneStr.length / 2;
        return [
            parseInt(stoneStr.slice(0, half), 10),
            parseInt(stoneStr.slice(half), 10),
        ];
    } else {
        return [stone * 2024];
    }
};

const part1 = (stones: Stones): number => {
    for (let i = 0; i < 25; i++) {
        stones = stones.flatMap(runRule);
    }
    return stones.length;
};

const incrementMapValue = (
    map: Map<number, number>,
    key: number,
    increment: number,
): void => {
    map.set(key, (map.get(key) || 0) + increment);
};

const efficientRunRule = (map: Map<number, number>): Map<number, number> => {
    const newMap = new Map<number, number>();

    map.entries().forEach(([stone, frequency]) => {
        const stoneStr = stone.toString();

        if (stone === 0) {
            incrementMapValue(newMap, 1, frequency);
        } else if (stoneStr.length % 2 === 0) {
            const half = stoneStr.length / 2;
            incrementMapValue(
                newMap,
                parseInt(stoneStr.slice(0, half), 10),
                frequency,
            );
            incrementMapValue(
                newMap,
                parseInt(stoneStr.slice(half), 10),
                frequency,
            );
        } else {
            incrementMapValue(newMap, stone * 2024, frequency);
        }
    });

    return newMap;
};

const part2 = (stones: Stones): number => {
    let map = new Map<number, number>();
    stones.forEach((stone) => incrementMapValue(map, stone, 1));

    for (let i = 0; i < 75; i++) {
        map = efficientRunRule(map);
    }

    return sum(Array.from(map.values()));
};

main(module, parse, part1, part2);
