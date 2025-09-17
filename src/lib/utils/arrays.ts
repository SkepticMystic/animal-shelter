export const Arrays = {
  sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),

  toggle: <T>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
};
