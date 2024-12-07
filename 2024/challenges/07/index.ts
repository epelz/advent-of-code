import main from "../../lib/main";
import { IntSchema, LinesSchema } from "../../lib/schemas";

import z from "zod";

type ParsedSchema = ReadonlyArray<ParsedEquation>;
type ParsedEquation = {
    total: number;
    nums: ReadonlyArray<number>;
};

const Schema = LinesSchema(z.string())
    .transform((input) => {
        return input.map((line) => {
            const [total, nums_str] = line.split(":");
            return { total, nums: nums_str.trim().split(" ") };
        });
    })
    .pipe(z.array(z.object({ total: IntSchema, nums: z.array(IntSchema) })));

const parse = (input: string): ParsedSchema => Schema.parse(input);

type Modulator = (a: number, b: number) => number[];
const _solveEquation = (
    nums: number[],
    results: number[],
    modulator: Modulator,
): number[] => {
    if (nums.length === 0) {
        return results;
    }

    if (results.length === 0) {
        return _solveEquation(
            nums.slice(2),
            modulator(nums[0], nums[1]),
            modulator,
        );
    }
    return _solveEquation(
        nums.slice(1),
        results.flatMap((result) => modulator(result, nums[0])),
        modulator,
    );
};

const solveEquation = ({
    total,
    nums,
    modulator,
}: {
    total: number;
    nums: ReadonlyArray<number>;
    modulator: Modulator;
}): boolean => {
    return _solveEquation(nums.slice(), [], modulator).some(
        (result) => result === total,
    );
};

const ONE = (a: number, b: number): number[] => [a + b, a * b];
const part1 = (equations: ParsedSchema): number => {
    return equations
        .filter((eq) => solveEquation({ ...eq, modulator: ONE }))
        .map(({ total }) => total)
        .reduce((a, b) => a + b, 0);
};

const TWO = (a: number, b: number): number[] => [
    ...ONE(a, b),
    parseInt([a, b].join(""), 10),
];
const part2 = (equations: ParsedSchema): number => {
    return equations
        .filter((eq) => solveEquation({ ...eq, modulator: TWO }))
        .map(({ total }) => total)
        .reduce((a, b) => a + b, 0);
};

main(module, parse, part1, part2);
