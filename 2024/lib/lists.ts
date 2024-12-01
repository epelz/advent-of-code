/**
 * Given a nxm array, return a transposed nxm array
 * where row i becomes column i.
 */
export function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, idx) => {
        return matrix.map((row) => row[idx]);
    });
}
