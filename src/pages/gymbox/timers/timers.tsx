import React, { useState } from "react";
import MobilePicker from "../../../views/mobile-picker/mobile-picker";
import ScrollPicker from "../../../views/scroll-picker/scroll-picker";

const Minutes = (length: number) =>
  Array.from({ length }).map((_, i) => Number(i));

function Timers() {
  const [mobileValue, setMobileValue] = useState<string | number>(0);
  const [minutes, setMinutes] = React.useState<number>(0);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        columnGap: "5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "2rem",
        }}
      >
        <div style={{ border: "1px solid black" }}>
          <MobilePicker
            itemHeight={100}
            height={400}
            getValue={setMobileValue}
          />
        </div>
        <i>value:{mobileValue}</i>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "2rem",
        }}
      >
        <div style={{ border: "1px solid black" }}>
          <ScrollPicker item={Minutes(60)} getValue={setMinutes} />
        </div>
        <i>value:{minutes}</i>
      </div>
    </div>
  );
}

export default Timers;
