export function sum(input: number[]): number {
    return input.reduce((prev, curr) => prev + curr, 0);
}
