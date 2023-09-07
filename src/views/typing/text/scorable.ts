import { divideKOR, isKOR } from "../../../utils/parse-korean";
import Text from "./text";

interface Scorable {
  subject: Text;

  score: number;
  specialty: number;
}

class ScorableSubject implements Scorable {
  public subject: Text;
  public score: number = 0;
  public specialty: number = 1;

  constructor(text: Text, specialty: number) {
    this.subject = text;
    this.specialty = specialty;

    if (isKOR(this.subject.data)) {
      const splitedKOR = divideKOR(this.subject.data);
      this.score = splitedKOR.length * this.specialty;
    } else {
      this.score = this.subject.data.length * this.specialty;
    }
  }

  public getSpecialty() {
    return this.specialty;
  }

  public getScore() {
    return this.score;
  }
}

export default ScorableSubject;
