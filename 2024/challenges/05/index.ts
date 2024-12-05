import main from "../../lib/main";
import { IntSchema, LinesSchema } from "../../lib/schemas";

import z from "zod";

type ParsedSchema = {
    rules: ReadonlyArray<Rule>;
    updates: ReadonlyArray<Update>;
};

interface Rule {
    before: number;
    after: number;
}

type Update = number[];

const RulesSchema = LinesSchema(z.string()).transform((input) => {
    return input.map((line) => {
        const [before, after] = line.split("|");
        return { before, after };
    })
}).pipe(z.array(z.object({ before: IntSchema, after: IntSchema })));

const UpdatesSchema = LinesSchema(z.string()).transform((input) => {
    return input.map((line) => {
        return line.split(",");
    });
}).pipe(z.array(z.array(IntSchema)));

const Schema = z
    .string()
    .transform((input) => {
        const [rules, updates] = input.trim().split("\n\n");
        return { rules, updates };
    }).pipe(z.object({ rules: RulesSchema, updates: UpdatesSchema }));

const parse = (input: string): ParsedSchema => Schema.parse(input);

const part1 = ({ updates, rules }: ParsedSchema): number => {
    // Make a lookup table in case the input is very large.
    const rulesLookup = new Map<number, number[]>();
    rules.forEach(({ before, after }) => {
        if (!rulesLookup.has(before)) {
            rulesLookup.set(before, []);
        }
        rulesLookup.get(before)?.push(after);
    });

    const correctUpdates = updates.filter((update) => {
        // Get the rules that both pages are in the update.
        const relevantRules: Rule[] = [];
        update.forEach((page, idx) => {
            relevantRules.push(...(rulesLookup.get(page) ?? []).filter(pg => update.indexOf(pg) !== -1).map(pg => ({ before: page, after: pg })));
        });
        // Now, make sure every page appears in the right order.
        return relevantRules.every(({ before, after }) => update.indexOf(before) < update.indexOf(after));
    });
    
    const middlePages = correctUpdates.map((update) => update[(update.length - 1) / 2]);
    return middlePages.reduce((acc, page) => acc + page, 0);
};

main(module, parse, part1);
