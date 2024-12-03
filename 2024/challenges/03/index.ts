import main from "../../lib/main";
import { IntSchema } from "../../lib/schemas";

import z from "zod";

type ParsedSchema = ReadonlyArray<
    DoExpression | DontExpression | MulExpression
>;

interface DoExpression {
    readonly type: "do";
}

interface DontExpression {
    readonly type: "don't";
}

interface MulExpression {
    readonly type: "mul";
    readonly left: number;
    readonly right: number;
}

const Schema = z
    .string()
    .transform((input) => {
        let expressions: (MulExpression | DoExpression | DontExpression)[] = [];
        const matches = input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g);
        for (const match of matches) {
            if (match[0] === "do()") {
                expressions.push({ type: "do" });
            } else if (match[0] === "don't()") {
                expressions.push({ type: "don't" });
            } else if (match[0].startsWith("mul")) {
                expressions.push({
                    type: "mul",
                    left: parseInt(match[1]),
                    right: parseInt(match[2]),
                });
            }
        }
        return expressions;
    })
    .pipe(
        z.array(
            z.discriminatedUnion("type", [
                z.object({
                    type: z.literal("do"),
                }),
                z.object({
                    type: z.literal("don't"),
                }),
                z.object({
                    type: z.literal("mul"),
                    left: IntSchema,
                    right: IntSchema,
                }),
            ]),
        ),
    );

const parse = (input: string): ParsedSchema => Schema.parse(input);

const part1 = (expressions: ParsedSchema): number => {
    return expressions
        .filter((exp): exp is MulExpression => exp.type === "mul")
        .map(({ left, right }) => {
            return left * right;
        })
        .reduce((acc, val) => acc + val, 0);
};

const part2 = (expressions: ParsedSchema): number => {
    let isEnabled = true;
    let curSum = 0;
    for (let expression of expressions) {
        if (expression.type === "do") {
            isEnabled = true;
        } else if (expression.type === "don't") {
            isEnabled = false;
        } else if (expression.type === "mul") {
            if (isEnabled) {
                curSum += expression.left * expression.right;
            }
        }
    }
    return curSum;
};

main(module, parse, part1, part2);
