import main from "../../lib/main";
import { CharSchema, MatrixSchema } from "../../lib/schemas";
import {
    findAllIndexMatrix,
    matrixSubsetFromIdx,
    type Direction,
} from "../../lib/lists";

import z from "zod";

interface ParsedSchema {
    readonly original: string[][];
}

const Schema = MatrixSchema(CharSchema, "").transform((original) => {
    return { original };
});

const parse = (input: string): ParsedSchema => Schema.parse(input);

const part1 = ({ original }: ParsedSchema): number => {
    const substrings = findAllIndexMatrix(original, "X")
        .flatMap(([row, col]) =>
            (["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as Direction[]).map(
                (direction) =>
                    matrixSubsetFromIdx(original, row, col, direction, 4),
            ),
        )
        .filter((subset) => subset !== undefined)
        .map((subset) => subset.join(""));

    return substrings.filter((substring) => substring === "XMAS").length;
};

const part2 = ({ original }: ParsedSchema): number => {
    const matches = findAllIndexMatrix(original, "A").filter(([row, col]) => {
        // Get the item after the "A" in each diagonal direction
        const NE = matrixSubsetFromIdx(original, row, col, "NE", 2)?.[1];
        const SE = matrixSubsetFromIdx(original, row, col, "SE", 2)?.[1];
        const NW = matrixSubsetFromIdx(original, row, col, "NW", 2)?.[1];
        const SW = matrixSubsetFromIdx(original, row, col, "SW", 2)?.[1];

        return (
            ((NE === "S" && SW === "M") || (NE === "M" && SW === "S")) &&
            ((NW === "S" && SE === "M") || (NW === "M" && SE === "S"))
        );
    });
    return matches.length;
};

main(module, parse, part1, part2);
