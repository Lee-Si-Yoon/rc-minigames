const defaultPaths = (base: string) => ({
  default: `${base}`,
  pattern: `${base}/*`,
  getMenuPattern: `${base}/:current/*`,
});

const gymboxPaths = (base: string) => ({
  ...defaultPaths(base),
  "typing-game": `${base}/typing-game`,
  "particle-text": `${base}/particle-text`,
  playground: `${base}/playground`,
  timer: `${base}/timer`,
});

const Paths = {
  ...defaultPaths(`/`),

  gymboxx: gymboxPaths(`/gymboxx`),
};

export { Paths };
