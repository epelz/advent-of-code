import main from "../../lib/main";
import { IntSchema } from "../../lib/schemas";

import z from "zod";

interface XY {
    x: number;
    y: number;
}
interface ClawMachine {
    AButton: XY;
    BButton: XY;
    Prize: XY;
}

const ClawMachineSchema = z
    .string()
    .transform((input) => {
        const [, ...AButton] =
            input
                .match(/Button A\: X\+(\d+), Y\+(\d+)/)
                ?.map((val) => parseInt(val)) ?? [];
        const [, ...BButton] =
            input
                .match(/Button B\: X\+(\d+), Y\+(\d+)/)
                ?.map((val) => parseInt(val)) ?? [];
        const [, ...Prize] =
            input
                .match(/Prize\: X=(\d+), Y=(\d+)/)
                ?.map((val) => parseInt(val)) ?? [];

        return {
            AButton: { x: AButton[0], y: AButton[1] },
            BButton: { x: BButton[0], y: BButton[1] },
            Prize: { x: Prize[0], y: Prize[1] },
        };
    })
    .pipe(
        z.object({
            AButton: z.object({ x: IntSchema, y: IntSchema }),
            BButton: z.object({ x: IntSchema, y: IntSchema }),
            Prize: z.object({ x: IntSchema, y: IntSchema }),
        }),
    );

const Schema = z
    .string()
    .transform((input) => {
        return input.trim().split("\n\n");
    })
    .pipe(z.array(ClawMachineSchema));

const parse = (input: string): ClawMachine[] => Schema.parse(input);

const value = (machine: ClawMachine, num_a: number, num_b: number): XY => {
    return {
        x: machine.AButton.x * num_a + machine.BButton.x * num_b,
        y: machine.AButton.y * num_a + machine.BButton.y * num_b,
    };
};
const cost = (num_a: number, num_b: number): number => num_a * 3 + num_b * 1;
const part1 = (machines: ClawMachine[]): number => {
    let total_cost = 0;
    for (const machine of machines) {
        let [min_num_a, min_num_b] = [101, 101];
        for (let num_a = 0; num_a < 100; num_a++) {
            for (let num_b = 0; num_b < 100; num_b++) {
                const { x: a, y: b } = value(machine, num_a, num_b);
                if (a === machine.Prize.x && b === machine.Prize.y) {
                    if (cost(num_a, num_b) < cost(min_num_a, min_num_b)) {
                        [min_num_a, min_num_b] = [num_a, num_b];
                    }
                }
            }
        }
        if (min_num_a !== 101 && min_num_b !== 101)
            total_cost += cost(min_num_a, min_num_b);
    }
    return total_cost;
};

const part2 = (machines: ClawMachine[]): number => {
    let total_cost = 0;
    for (const part1_machine of machines) {
        // Update the prize amounts
        let machine: ClawMachine = {
            ...part1_machine,
            Prize: {
                x: part1_machine.Prize.x + 10000000000000,
                y: part1_machine.Prize.y + 10000000000000,
            },
        };

        /**
         *
         * Use equation to calculate num_a, num_b, derived by:
         *
         * Ax * Na + Bx * Nb = Px
         * Ay * Na + By * Nb = Py
         *
         * Multiply by Ay and Ax, respectively:
         *
         * AyAxNa + AyBxNb = AyPx
         * AxAyNa + AxByNb = AxPy
         *
         * Subtract the two equations:
         *
         * AyBxNb - AxByNb = AyPx - AxPy
         * Nb(AyBx - AxBy) = AyPx - AxPy
         * Nb = (AyPx - AxPy) / (AyBx - AxBy)
         */

        const num_b =
            (machine.AButton.y * machine.Prize.x -
                machine.AButton.x * machine.Prize.y) /
            (machine.AButton.y * machine.BButton.x -
                machine.AButton.x * machine.BButton.y);
        const num_a =
            (machine.Prize.x - num_b * machine.BButton.x) / machine.AButton.x;

        // Make sure they are valid positive integers
        if (
            Number.isInteger(num_a) &&
            Number.isInteger(num_b) &&
            num_a >= 0 &&
            num_b >= 0
        ) {
            total_cost += cost(num_a, num_b);
        }
    }
    return total_cost;
};

main(module, parse, part1, part2);
