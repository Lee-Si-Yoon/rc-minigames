const defaultPaths = (base: string) => {
  return {
    default: `${base}`,
    pattern: `${base}/*`,
    getMenuPattern: `${base}/:current/*`,
  };
};

const gymboxPaths = (base: string) => {
  return {
    ...defaultPaths(base),
    'typing-game': `${base}/typing-game`,
    'particle-text': `${base}/particle-text`,
    playground: `${base}/playground`,
    timer: `${base}/timer`,
    score: `${base}/score`,
  };
};

const Paths = {
  ...defaultPaths(`/`),

  gymboxx: gymboxPaths(`/gymboxx`),
};

export { Paths };
