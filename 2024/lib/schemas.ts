import { z, ZodTypeAny } from "zod";

// https://github.com/pspeter3/advent-of-code/blob/main/src/utils/schemas.ts
export const IntSchema = z.coerce.number().int();
export const CharSchema = z.coerce.string().length(1);
export const LinesSchema = <T extends ZodTypeAny>(schema: T) =>
    z
        .string()
        .transform((input) => input.trim().split("\n"))
        .pipe(z.array(schema));

export const MatrixSchema = <T extends ZodTypeAny>(schema: T, delimiter=" ") =>
    LinesSchema(
        z
            .string()
            // NB: Ignore whitespace, which may break some challenges later...
            .transform((line) => {
                return line.split(delimiter).filter((v) => v.trim() !== "");
            })
            .pipe(z.array(schema)),
    );
