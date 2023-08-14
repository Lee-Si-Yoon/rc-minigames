import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../routes/paths";

function Root() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.addEventListener("snapchanged", (e) => {
      console.log(e);
    });
  }, [containerRef]);
  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Link to={Paths.gymboxx["typing-game"]}>typing game</Link>
      <Link to={Paths.gymboxx.playground}>playground</Link>
      <Link to={Paths.gymboxx.timer}>timer</Link>
      <Link to={Paths.gymboxx.timers}>timers</Link>
    </div>
  );
}

Root.displayName = "Root";

export default Root;
