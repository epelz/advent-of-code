import main from "../../lib/main";
import { sum } from "../../lib/math";
import { transpose } from "../../lib/lists";
import { IntSchema, LinesSchema, MatrixSchema } from "../../lib/schemas";

import z from "zod";

type ParsedSchema = ReadonlyArray<MulExpression>;

interface MulExpression {
    readonly left: number;
    readonly right: number;
}

const Schema = z.string().transform((input) => { 
    let expressions: MulExpression[] = [];
    const matches = input.matchAll(/mul\((\d+),(\d+)\)/g);
    for (const match of matches) {
        expressions.push({ left: parseInt(match[1]), right: parseInt(match[2]) });
    }
    return expressions;
}).pipe(z.array(z.object({
    left: IntSchema,
    right: IntSchema,
})));

const parse = (input: string): ParsedSchema => Schema.parse(input);

const part1 = (expressions: ParsedSchema): number => {
    return expressions.map(({ left, right }) => {
        return left * right;
    }).reduce((acc, val) => acc + val, 0);
};


main(module, parse, part1);
