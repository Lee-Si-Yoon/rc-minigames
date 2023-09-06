interface Level {
  LevelState: LevelState;
  value: number;

  increase: VoidFunction;
  decrease: VoidFunction;
}

/** @url https://www.youtube.com/watch?v=gMyRtqwxr10 */
class LevelState {
  public Easy: Level;
  public Normal: Level;
  public Hard: Level;

  public currentLevel: Level;

  constructor() {
    this.Easy = new Easy(this);
    this.Normal = new Normal(this);
    this.Hard = new Hard(this);

    this.currentLevel = this.Easy;
    this.setLevel(this.Easy);
  }

  public setLevel(level: Level) {
    this.currentLevel = level;
  }

  public getLevel(): Level {
    return this.currentLevel;
  }

  public getLevelName(): string {
    return this.currentLevel.constructor.name;
  }
}

class Easy implements Level {
  public LevelState: LevelState;
  readonly value: number = 0;

  constructor(LevelState: LevelState) {
    this.LevelState = LevelState;
  }

  public increase() {
    this.LevelState.setLevel(this.LevelState.Normal);
  }
  public decrease() {
    throw new Error(`${this.LevelState.getLevelName()} is minimum level`);
  }
}

class Normal implements Level {
  public LevelState: LevelState;
  readonly value: number = 1;

  constructor(LevelState: LevelState) {
    this.LevelState = LevelState;
  }

  public increase() {
    this.LevelState.setLevel(this.LevelState.Hard);
  }
  public decrease() {
    this.LevelState.setLevel(this.LevelState.Easy);
  }
}

class Hard implements Level {
  public LevelState: LevelState;
  readonly value: number = 2;

  constructor(LevelState: LevelState) {
    this.LevelState = LevelState;
  }

  public increase() {
    throw new Error(`${this.LevelState.getLevelName()} is maximum level`);
  }
  public decrease() {
    this.LevelState.setLevel(this.LevelState.Normal);
  }
}

const con = new LevelState();
con.getLevel().increase();
con.setLevel(new Hard(con));

console.log(`Level : ${con.getLevelName()}`);

export type { Level };

export default LevelState;
