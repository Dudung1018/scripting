export function formatNumber(number: number, precision: number = 10) {
  if (number < precision) return number.toString();

  const superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

  const power = Math.floor(Math.log10(number));
  const exponentStr = power
    .toString()
    .split("")
    .map((d) => superscripts[parseInt(d)])
    .join("");

  return `10${exponentStr}`;
}
