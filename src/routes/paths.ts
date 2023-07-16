const defaultPaths = (base: string) => ({
  default: `${base}`,
  pattern: `${base}/*`,
  getMenuPattern: `${base}/:current/*`,
});

const gymboxPaths = (base: string) => ({
  ...defaultPaths(base),
  "typing-game": `${base}/typing-game`,
});

const Paths = {
  ...defaultPaths(`/`),

  gymbox: gymboxPaths(`/gymbox`),
};

export { Paths };
