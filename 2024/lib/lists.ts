/**
 * Given a nxm array, return a transposed nxm array
 * where row i becomes column i.
 */
export function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, idx) => {
        return matrix.map((row) => row[idx]);
    });
}

export function findAllIndex<T>(arr: T[], target: T): number[] {
    const indices: number[] = [];
    arr.forEach((value, idx) => {
        if (value === target) {
            indices.push(idx);
        }
    });
    return indices;
}

export function findAllIndexMatrix<T>(
    matrix: T[][],
    target: T,
): [number, number][] {
    const indexes: [number, number][] = [];
    matrix.forEach((row, rowIdx) => {
        const found = findAllIndex(row, target);
        found.forEach((col) => {
            indexes.push([rowIdx, col]);
        });
    });
    return indexes;
}

function get<T>(
    input: ReadonlyArray<ReadonlyArray<T>>,
    row: number,
    col: number,
    defaultBoundaryCase: T,
): T {
    if (row < 0 || row >= input.length) {
        return defaultBoundaryCase;
    }
    if (col < 0 || col >= input[row].length) {
        return defaultBoundaryCase;
    }
    return input[row][col];
}

export type Direction = "N" | "E" | "S" | "W" | "NE" | "NW" | "SE" | "SW";
export function matrixSubsetFromIdx<T>(
    matrix: T[][],
    rowIdx: number,
    colIdx: number,
    direction: Direction,
    length: number,
): T[] | undefined {
    const subset: T[] = [];
    for (let i = 0; i < length; i++) {
        let row = rowIdx;
        let col = colIdx;
        if (direction.includes("N")) {
            row -= i;
        }
        if (direction.includes("S")) {
            row += i;
        }
        if (direction.includes("E")) {
            col += i;
        }
        if (direction.includes("W")) {
            col -= i;
        }
        const item = get(matrix, row, col, undefined);
        if (item === undefined) {
            return undefined;
        }
        subset.push(item);
    }
    return subset;
}
