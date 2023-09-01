const punctRE =
  /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;
const spaceRE = /\s+/g;

const removeAllPunctuations = (word: string) =>
  word && word.replace(punctRE, "");
const removeAllWhiteSpaces = (word: string) =>
  word && word.replace(spaceRE, "");

export { removeAllPunctuations, removeAllWhiteSpaces };
