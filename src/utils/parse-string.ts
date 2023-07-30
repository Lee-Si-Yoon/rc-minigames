function findDifferingSubstring(
  str1: string,
  str2: string
): [string, string] | null {
  let diffIndex = 0;
  let i = 0;

  while (
    i < str2.length &&
    diffIndex < str1.length &&
    str1[diffIndex] === str2[i]
  ) {
    diffIndex++;
    i++;
  }

  if (diffIndex === 0) {
    return null;
  }

  const commonSubstring1 = str1.substring(0, diffIndex);
  const commonSubstring2 = str1.substring(diffIndex);

  return [commonSubstring1, commonSubstring2];
}

export { findDifferingSubstring };
