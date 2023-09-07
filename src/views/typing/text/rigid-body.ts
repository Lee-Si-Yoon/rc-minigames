import { Coord } from "../../../utils/types";

abstract class RigidBody {
  public position: Coord = { x: 0, y: 0 };
  public velocity: Coord = { x: 0, y: 0 };
  public collideVelocity: Coord = { x: 0, y: 0 };
  public dimension: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  public mass: number = 1;
  public corFactor: number = 1.2;

  /**
   * @url http://programmerart.weebly.com/separating-axis-theorem.html
   * @url https://blog.naver.com/PostView.naver?blogId=skz1024&logNo=222758566138
   * @url https://github.com/DongChyeon/JS-Toy-Projects/blob/master/AirHockey/game.js#L22C28-L22C28
   * @url https://velog.io/@dongchyeon/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EC%97%90%EC%96%B4-%ED%95%98%ED%82%A4-%EA%B2%8C%EC%9E%84%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90
   */
  getVelocityAfterCollision(collidedText: RigidBody): Coord {
    const velocity = {
      x:
        ((this.mass - collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          this.velocity.x +
        ((collidedText.mass + collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          collidedText.velocity.x,
      y:
        ((this.mass - collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          this.velocity.y +
        ((collidedText.mass + collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          collidedText.velocity.y,
    };
    return velocity;
  }

  getIsCollided(collidedText: RigidBody): boolean {
    return (
      this.position.x + this.dimension.width >= collidedText.position.x &&
      this.position.x <=
        collidedText.position.x + collidedText.dimension.width &&
      this.position.y + this.dimension.height >= collidedText.position.y &&
      this.position.y <= collidedText.position.y + collidedText.dimension.height
    );
  }

  getPosition(): Coord {
    return this.position;
  }

  getDimension(): { width: number; height: number } {
    return this.dimension;
  }

  getVelocity(): Coord {
    return this.velocity;
  }

  setPosition(position: Coord) {
    this.position = position;
  }

  setVelocity(velocity: Coord) {
    this.velocity = velocity;
  }

  setCollideVelocity(velocity: Coord) {
    this.collideVelocity = velocity;
  }

  protected abstract update(): void;
  protected abstract render(): void;
}

export default RigidBody;
