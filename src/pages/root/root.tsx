import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../routes/paths";

function Root() {
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      {/* <Link to={Paths.gymboxx["typing-game"]}>typing game</Link> */}
      {/* <Link to={Paths.gymboxx["particle-text"]}>particle game</Link> */}
      <Link to={Paths.gymboxx.playground}>playground</Link>
      <Link to={Paths.gymboxx.timer}>timer</Link>
    </div>
  );
}

Root.displayName = "Root";

export default Root;
