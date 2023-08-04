import React from "react";

import Fading, { FadingProp } from "../../../views/fading-text/fading";

const texts = ["나는", "날지", "않아", "그건", "유산소거든"];

function FadingPage() {
  const fadingProps: FadingProp = {
    width: "100vw",
    height: "100%",
    textColor: {
      R: 0,
      G: 0.1,
      B: 0.1,
    },
    backgroundColor: "whitesmoke",
    texts,
  };
  return <Fading {...fadingProps} />;
}

FadingPage.displayName = "FadingPage";

export default FadingPage;
