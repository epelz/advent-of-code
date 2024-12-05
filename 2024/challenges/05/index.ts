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

const RulesSchema = LinesSchema(z.string())
    .transform((input) => {
        return input.map((line) => {
            const [before, after] = line.split("|");
            return { before, after };
        });
    })
    .pipe(z.array(z.object({ before: IntSchema, after: IntSchema })));

const UpdatesSchema = LinesSchema(z.string())
    .transform((input) => {
        return input.map((line) => {
            return line.split(",");
        });
    })
    .pipe(z.array(z.array(IntSchema)));

const Schema = z
    .string()
    .transform((input) => {
        const [rules, updates] = input.trim().split("\n\n");
        return { rules, updates };
    })
    .pipe(z.object({ rules: RulesSchema, updates: UpdatesSchema }));

const parse = (input: string): ParsedSchema => Schema.parse(input);

const filterRulesWithValues = ({
    update,
    rules,
}: {
    update: Update;
    rules: ReadonlyArray<Rule>;
}) => {
    // Make a lookup table in case the input is very large.
    const rulesLookup = new Map<number, number[]>();
    rules.forEach(({ before, after }) => {
        if (!rulesLookup.has(before)) {
            rulesLookup.set(before, []);
        }
        rulesLookup.get(before)?.push(after);
    });

    // Get the rules that both pages are in the update.
    const relevantRules: Rule[] = [];
    update.forEach((page, idx) => {
        relevantRules.push(
            ...(rulesLookup.get(page) ?? [])
                .filter((pg) => update.indexOf(pg) !== -1)
                .map((pg) => ({ before: page, after: pg })),
        );
    });
    return relevantRules;
};

const validateUpdates = ({
    updates,
    rules,
}: ParsedSchema): { valid: Update[]; invalid: Update[] } => {
    return updates.reduce<{ valid: Update[]; invalid: Update[] }>(
        (prevVal, update) => {
            const relevantRules = filterRulesWithValues({
                update,
                rules: rules,
            });
            // Now, make sure every page appears in the right order.
            const isValid = relevantRules.every(
                ({ before, after }) =>
                    update.indexOf(before) < update.indexOf(after),
            );
            if (isValid) {
                return {
                    valid: [...prevVal.valid, update],
                    invalid: prevVal.invalid,
                };
            } else {
                return {
                    valid: prevVal.valid,
                    invalid: [...prevVal.invalid, update],
                };
            }
        },
        { valid: [], invalid: [] },
    );
};

const topoSort = (rules: Rule[]): Update => {
    const allNodes = new Set<number>();
    const rulesLookup = new Map<number, Set<number>>();
    rules.forEach(({ before, after }) => {
        allNodes.add(before);
        allNodes.add(after);

        if (!rulesLookup.has(before)) {
            rulesLookup.set(before, new Set<number>());
        }
        rulesLookup.get(before)?.add(after);
    });

    const update: Update = [];

    while (true) {
        let endNode = Array.from(allNodes.values()).filter((beforeNode) => {
            return (
                rulesLookup.get(beforeNode) === undefined ||
                rulesLookup.get(beforeNode)?.size === 0
            );
        })[0];

        if (endNode === undefined) {
            break;
        }

        update.unshift(endNode);
        allNodes.delete(endNode);
        allNodes.forEach((n) => {
            rulesLookup.get(n)?.delete(endNode);
        });
    }
    return update;
};

const part1 = ({ updates, rules }: ParsedSchema): number => {
    const { valid } = validateUpdates({ updates, rules });

    const middlePages = valid.map((update) => update[(update.length - 1) / 2]);
    return middlePages.reduce((acc, page) => acc + page, 0);
};

const part2 = ({ updates, rules }: ParsedSchema): number => {
    const { invalid } = validateUpdates({ updates, rules });

    const nowValid = invalid.map((update) =>
        topoSort(filterRulesWithValues({ update, rules })),
    );
    const middlePages = nowValid.map(
        (update) => update[(update.length - 1) / 2],
    );
    return middlePages.reduce((acc, page) => acc + page, 0);
};

main(module, parse, part1, part2);
