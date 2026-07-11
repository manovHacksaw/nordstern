/** Number formatting — mirrors the design prototype's `fmt`/`parse`/`money`. */

/** Group with commas, fixed decimals. `fmt(4208.55)` → "4,208.55". */
export function fmt(n: number, dp = 2): string {
  return (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/** Parse a comma-formatted string to a number. `parse('5,000')` → 5000. */
export function parse(s: string | number): number {
  return parseFloat(String(s).replace(/,/g, '')) || 0;
}

/** USD money string. */
export function money(n: number): string {
  return '$' + fmt(n, 2);
}
