function isDifferenceLessThan(
  num1: number,
  num2: number,
  diff: number
): boolean {
  if (diff <= 0) throw new Error("diff should be bigger than 0");
  return Math.abs(num1 > num2 ? num1 - num2 : num2 - num1) < diff;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { isDifferenceLessThan, getRandomArbitrary };
