import main from "../../lib/main";
import { sum } from "../../lib/math";
import { transpose } from "../../lib/lists";
import { IntSchema, LinesSchema, MatrixSchema } from "../../lib/schemas";

import z from "zod";

interface ParsedSchema {
    readonly reports: ReadonlyArray<ReadonlyArray<number>>;
}

const Schema = MatrixSchema(IntSchema).transform((input) => {
    return { reports: input };
});

const parse = (input: string): ParsedSchema => Schema.parse(input);

const checkValidity = (report: ReadonlyArray<number>): boolean => {
    let direction: "increasing" | "decreasing" | undefined = undefined;
    for (let i = 1; i < report.length; i++) {
        const difference = report[i - 1] - report[i];
        if (difference === 0) {
            return false;
        } else if (difference > 0) {
            if (direction === "increasing" || difference > 3) {
                return false;
            }
            direction = "decreasing";
        } else if (difference < 0) {
            if (direction === "decreasing" || difference < -3) {
                return false;
            }
            direction = "increasing";
        }
    }
    return true;
};

const part1 = ({ reports }: ParsedSchema): number => {
    return reports.filter((report) => checkValidity(report)).length;
};

const part2 = ({ reports }: ParsedSchema): number => {
    return reports.filter((report) => {
        const validity = checkValidity(report);
        if (validity) {
            return true;
        }

        return reports.some((_, idx) =>
            checkValidity([...report.slice(0, idx), ...report.slice(idx + 1)]),
        );
    }).length;
};

main(module, parse, part1, part2);
