import { assert } from "console";
import main from "../../lib/main";
import { CharSchema, IntSchema, LinesSchema } from "../../lib/schemas";

import z from "zod";

type DiskMap = (File | Space)[];
interface File {
    type: "file";
    id: number;
    blocks: number;
}
interface Space {
    type: "space";
    blocks: number;
}

const Schema = z
    .string()
    .transform((input) => {
        let type: "file" | "space" = "file";
        let fileId = -1;
        return input.split("").map((blocks) => {
            if (type === "file") {
                type = "space";
                fileId++;
                return { type: "file", id: fileId, blocks: parseInt(blocks) };
            } else {
                type = "file";
                return { type: "space", blocks: parseInt(blocks) };
            }
        });
    })
    .transform((input) => {
        return input.filter((item) => item.blocks > 0);
    })
    .pipe(
        z.array(
            z.discriminatedUnion("type", [
                z.object({
                    type: z.literal("file"),
                    id: IntSchema,
                    blocks: IntSchema,
                }),
                z.object({
                    type: z.literal("space"),
                    blocks: IntSchema,
                }),
            ]),
        ),
    );

const parse = (input: string): DiskMap => Schema.parse(input);

const hasGap = (diskMap: DiskMap): boolean =>
    diskMap.findLastIndex((item) => item.type === "file") + 1 !==
    diskMap.findIndex((item) => item.type === "space");
const lastFileIdx = (diskMap: DiskMap): number =>
    diskMap.findLastIndex((item) => item.type === "file");
const firstSpaceIdx = (diskMap: DiskMap): number =>
    diskMap.findIndex((item) => item.type === "space");

const prettyPrint = (diskMap: DiskMap): void => {
    diskMap.forEach((item) => {
        for (let i = 0; i < item.blocks; i++) {
            console.log(item.type === "file" ? item.id.toString() : ".");
            // process.stdout.write(item.type === "file" ? item.id.toString() : ".");
        }
    });
    // console.log();
};

const checkSum = (diskMap: DiskMap): number => {
    return diskMap
        .filter((item) => item.blocks > 0)
        .flatMap((item) =>
            Array(item.blocks).fill(item.type === "file" ? item.id : 0),
        )
        .reduce((acc, itemIdOrZero, idx) => acc + itemIdOrZero * idx, 0);
};

const part1 = (diskMap: DiskMap): number => {
    // Make a copy
    const map = diskMap.map((item) => ({ ...item }));

    while (hasGap(map)) {
        let sourceFileIdx = lastFileIdx(map);
        const sourceFile = map[sourceFileIdx] as File;
        const targetSpaceIdx = firstSpaceIdx(map);
        const targetSpace = map[targetSpaceIdx] as Space;

        // Add the file block to the space
        const prev = map[targetSpaceIdx - 1] as File;
        if (prev.id !== sourceFile.id) {
            map.splice(
                targetSpaceIdx,
                1,
                { type: "file", id: sourceFile.id, blocks: 1 },
                ...(targetSpace.blocks === 1
                    ? []
                    : [
                          {
                              type: "space" as "space",
                              blocks: targetSpace.blocks - 1,
                          },
                      ]),
            );
        } else {
            map.splice(
                targetSpaceIdx - 1,
                2,
                { type: "file", id: sourceFile.id, blocks: prev.blocks + 1 },
                ...(targetSpace.blocks === 1
                    ? []
                    : [
                          {
                              type: "space" as "space",
                              blocks: targetSpace.blocks - 1,
                          },
                      ]),
            );
        }

        // Remove file block from its source
        sourceFileIdx = lastFileIdx(map);
        if (sourceFile.blocks === 1) {
            map.splice(sourceFileIdx, 1);
        } else {
            map.splice(sourceFileIdx, 1, {
                type: "file",
                id: sourceFile.id,
                blocks: sourceFile.blocks - 1,
            });
        }

        // Add space at the end
        if (map[map.length - 1].type === "file") {
            map.push({ type: "space", blocks: 1 });
        } else {
            map.splice(map.length - 1, 1, {
                type: "space",
                blocks: map[map.length - 1].blocks + 1,
            });
        }
    }

    return checkSum(map);
};

const part2 = (diskMap: DiskMap): number => {
    // Make a copy
    const map = diskMap.map((item) => ({ ...item }));

    const maxId = Math.max(
        ...map.filter((item) => item.type === "file").map((item) => item.id),
    );

    for (let id = maxId; id >= 0; id--) {
        let sourceFileIdx = map.findIndex(
            (item) => item.type === "file" && item.id === id,
        );
        const sourceFile = map[sourceFileIdx] as File;
        // Only consider free spaces to the left of the current file
        const targetSpaceIdx = map
            .slice(0, sourceFileIdx)
            .findIndex(
                (item) =>
                    item.type === "space" && item.blocks >= sourceFile.blocks,
            );
        const targetSpace = map[targetSpaceIdx] as Space;
        if (targetSpaceIdx === -1) {
            continue;
        }

        // Remove file block from its source
        map.splice(sourceFileIdx, 1, {
            type: "space",
            blocks: sourceFile.blocks,
        });

        // Add the file block to the space
        map.splice(targetSpaceIdx, 1, sourceFile, {
            type: "space" as "space",
            blocks: targetSpace.blocks - sourceFile.blocks,
        });
    }

    return checkSum(map);
};

main(module, parse, part1, part2);
