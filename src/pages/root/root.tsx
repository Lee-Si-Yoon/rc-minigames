import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../routes/paths";

function Root() {
  return (
    <div>
      <Link to={Paths.gymbox["typing-game"]}>typing game</Link>
    </div>
  );
}

Root.displayName = "Root";

export default Root;
