import { isDifferenceLessThan } from './math';

describe('isDifferenceLessThan', () => {
  test.each([
    [5, 10, 5, false],
    [5, 1, 5, true],
    [1, 5, 5, true],
  ])('should %p %p', (a, b, c, result) => {
    expect(isDifferenceLessThan(a, b, c)).toBe(result);
  });
});
