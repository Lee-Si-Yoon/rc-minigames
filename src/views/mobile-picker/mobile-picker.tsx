import React, { useState, useEffect } from "react";
import classes from "./mobile-picker.module.scss";
import { useRafState } from "../../utils/hooks/use-raf-state";

interface PickerColumnProps {
  options: string[];
  value: string;
  itemHeight: number;
  columnHeight: number;
  onChange: (value: string) => void;
}

function PickerColumn(props: PickerColumnProps) {
  const { options, itemHeight, columnHeight, value, onChange } = props;

  const [isMoving, setIsMoving] = useState(false);

  const [startTouchY, setStartTouchY] = useState(0);
  const [startScrollerTranslate, setStartScrollerTranslate] = useState(0);

  const [scrollerTranslate, setScrollerTranslate] = useRafState(0);
  const [scrollTimer, setScrollTimer] = useState<number>(Date.now());

  const minTranslate =
    columnHeight / 2 - itemHeight * options.length + itemHeight / 2;
  const maxTranslate = columnHeight / 2 - itemHeight / 2;

  useEffect(() => {
    const selectedIndex = options.indexOf(value);

    setScrollerTranslate(
      columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight
    );
  }, [options, value]);

  const postMove = () => {
    let activeIndex;
    if (scrollerTranslate > maxTranslate) {
      activeIndex = 0;
    } else if (scrollerTranslate < minTranslate) {
      activeIndex = options.length - 1;
    } else {
      activeIndex = -Math.floor(
        (scrollerTranslate - maxTranslate) / itemHeight
      );
    }

    onChange(options[activeIndex]);
  };

  const postWheel = () => {
    setTimeout(() => {
      if (scrollTimer > Date.now() - 250) {
        postWheel();
        return;
      }
      postMove();
    }, 250);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMoving) setIsMoving(true);

    const touchY = event.targetTouches[0].pageY;
    setStartTouchY(touchY);
    setStartScrollerTranslate(scrollerTranslate);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMoving) return;

    const touchY = event.targetTouches[0].pageY;

    let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
    if (nextScrollerTranslate < minTranslate) {
      nextScrollerTranslate =
        minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
    } else if (nextScrollerTranslate > maxTranslate) {
      nextScrollerTranslate =
        maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
    }

    setScrollerTranslate(nextScrollerTranslate);
  };

  const handleTouchEnd = () => {
    if (!isMoving) return;

    setIsMoving(false);
    setStartTouchY(0);
    setStartScrollerTranslate(0);

    postMove();
  };

  const handleTouchCancel = () => {
    if (!isMoving) return;

    setIsMoving(false);
    setStartTouchY(0);
    setStartScrollerTranslate(scrollerTranslate);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const newTranslate = Math.max(
      minTranslate,
      Math.min(maxTranslate, scrollerTranslate + Math.round(event.deltaY ?? 0))
    );

    postWheel();

    setScrollerTranslate(newTranslate);
    setScrollTimer(Date.now());
  };

  const handleItemClick = (option: string) => {
    if (option === value) return;
    onChange(option);
  };

  return (
    <div className={classes.PickerColumn}>
      <div
        style={{
          transform: `translate3d(0, ${scrollerTranslate}px, 0)`,
          transition: isMoving ? "0ms" : "transform 300ms ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onWheel={handleWheel}
      >
        {options.map((option, index) => (
          <div
            key={`${index + 1}`}
            className={`${classes.PickerItem} ${
              option === value ? `${classes.Selected}` : ""
            }`}
            style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }}
            onClick={() => handleItemClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MobilePickerProps {
  height?: number;
  width?: number;
  itemHeight?: number;
  itemLength?: number;
  getValue: React.Dispatch<React.SetStateAction<string | number>>;
}

// https://github.com/dsmalicsi/react-mobile-picker-scroll/blob/master/src/index.js
function MobilePicker(props: MobilePickerProps) {
  const {
    itemHeight = 50,
    height = 300,
    width = 200,
    itemLength = 60,
    getValue,
  } = props;

  const options = Array.from({ length: itemLength }).map((_, index) =>
    String(index)
  );
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    getValue(index);
  }, [index]);

  return (
    <div
      className={classes.PickerContainer}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className={classes.PickerInner}>
        <PickerColumn
          options={options}
          value={options[index]}
          itemHeight={itemHeight}
          columnHeight={height}
          onChange={(e) => setIndex(+e)}
        />
        <div
          className={classes.PickerHighLight}
          style={{
            height: `${itemHeight}px`,
            marginTop: `-${itemHeight / 2}px`,
          }}
        />
      </div>
    </div>
  );
}

export default MobilePicker;
