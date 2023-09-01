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

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

const lerpRange = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
): number => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

const START = { x: 0.0, y: 0.0 };
const MID1 = { x: 5.0, y: 0.0 };
const MID2 = { x: 5.0, y: 0.0 };
const END = { x: 1.0, y: 1.0 };

/**
 * @url https://javascript.info/bezier-curve#maths
 */
const getPoint = (t: number) => {
  const x =
    (1 - t) ** 3 * START.x +
    3 * (1 - t) ** 2 * t * MID1.x +
    3 * (1 - t) * t ** 2 * MID2.x +
    t ** 3 * END.x;
  const y =
    (1 - t) ** 3 * START.y +
    3 * (1 - t) ** 2 * t * MID1.y +
    3 * (1 - t) * t ** 2 * MID2.y +
    t ** 3 * END.y;
  return { x, y };
};

export {
  isDifferenceLessThan,
  getRandomArbitrary,
  lerp,
  lerpRange,
  getPoint,
  // getCubicBezier,
};
