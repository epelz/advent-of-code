import main from "../../lib/main";
import { CharSchema, IntSchema, LinesSchema, MatrixSchema } from "../../lib/schemas";
import { findAllIndexMatrix, matrixSubsetFromIdx, type Direction } from "../../lib/lists";

import z from "zod";

interface ParsedSchema {
    readonly original: string[][];
}

const Schema = MatrixSchema(CharSchema,"").transform((original) => {
    return { original };
});

const parse = (input: string): ParsedSchema => Schema.parse(input);

const substrings = (input: string[][]): string[] => {
    return findAllIndexMatrix(input, "X")
        .flatMap(([row, col]) => (
            ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as Direction[]).map((direction) => matrixSubsetFromIdx(input, row, col, direction, 4))
        )
        .filter(subset => subset !== undefined)
        .map(subset => subset.join(""))
    }

const part1 = ({ original }: ParsedSchema): number => {
    return substrings(original).filter(substring => substring === "XMAS").length;
};


main(module, parse, part1);
