import React from "react";

function Score() {
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  return <div>score</div>;
}

Score.displayName = "Score";

export default Score;
