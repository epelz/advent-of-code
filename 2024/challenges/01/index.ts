import main from "../../lib/main";
import { sum } from "../../lib/math";
import { transpose } from "../../lib/lists";
import { IntSchema, MatrixSchema } from "../../lib/schemas";

import z from "zod";

interface ParsedSchema {
    readonly loc1: ReadonlyArray<number>;
    readonly loc2: ReadonlyArray<number>;
}

const Schema = MatrixSchema(IntSchema).transform((input) => {
    const [unsortedLoc1, unsortedLoc2] = transpose(input);
    return { loc1: unsortedLoc1.sort(), loc2: unsortedLoc2.sort() };
});

const parse = (input: string): ParsedSchema => Schema.parse(input);

const part1 = ({ loc1, loc2 }: ParsedSchema): number => {
    const distances = loc1.map((_, idx) => {
        return Math.abs(loc1[idx] - loc2[idx]);
    });
    return sum(distances);
};

const part2 = ({ loc1, loc2 }: ParsedSchema): number => {
    const similarities = loc1.map((n) => {
        const numMatches = loc2.filter((val) => val === n).length;
        return n * numMatches;
    });
    return sum(similarities);
};

main(module, parse, part1, part2);
