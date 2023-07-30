import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../routes/paths";

function Root() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link to={Paths.gymbox["typing-game"]}>typing game</Link>
      <Link to={Paths.gymbox["particle-text"]}>particle-text</Link>
    </div>
  );
}

Root.displayName = "Root";

export default Root;
