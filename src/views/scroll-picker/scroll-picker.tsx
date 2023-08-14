import React from "react";
import classes from "./scroll-picker.module.scss";

const visibleItemCount = 3;

interface ScrollPickerProps {
  item: number[];
  itemHeight?: number;
  itemWidth?: number;
  fontStyle?: React.CSSProperties;
  getValue: React.Dispatch<React.SetStateAction<number>>;
}

function ScrollPicker(props: ScrollPickerProps) {
  const {
    item,
    itemHeight = 100,
    itemWidth = 100,
    getValue,
    fontStyle,
  } = props;

  if (visibleItemCount % 2 === 0)
    throw new Error("visible count should be odd");

  const [listValue, setListValue] = React.useState<number>(0);
  const refs = React.useRef<HTMLDivElement[]>([]);
  const [list, setList] = React.useState<HTMLDivElement[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!refs.current) return;

    const observer = new IntersectionObserver((el) => {
      el.forEach((div) => {
        const el = div.target as HTMLDivElement;

        if (div.isIntersecting) {
          setList((prevState) =>
            [...prevState, el].sort(
              (a, b) => Number(a.textContent) - Number(b.textContent)
            )
          );
        } else if (!div.isIntersecting) {
          setList((prevState) => prevState.filter((s) => s !== el));
        }
      });
    });

    refs.current.forEach((el) => observer.observe(el));

    return () => refs.current.forEach((el) => observer.unobserve(el));
  }, [refs.current]);

  React.useEffect(() => {
    if (list.length !== visibleItemCount || !containerRef.current) return;

    const middleIndex = Math.floor(list.length / 2);

    // console.log(
    //   list.map((l) => l.textContent),
    //   list[middleIndex].textContent
    // );
    // console.log(
    //   // middleIndex,
    //   // list.length,
    //   list.map((l) => l.textContent),
    //   list[middleIndex - 1].textContent
    // );

    setListValue(Number(list[middleIndex].textContent));

    const onClickHandler = (index: number) => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: 0,
          top: list[index].offsetTop - itemHeight,
          behavior: "smooth",
        });
      }
    };

    list.forEach((l, index) => {
      if (index === middleIndex) return;
      l.addEventListener("click", () => onClickHandler(index));
    });

    return () => {
      list.forEach((l, index) => {
        if (index === middleIndex) return;
        l.removeEventListener("click", () => onClickHandler(index));
      });
    };
  }, [list, containerRef.current]);

  React.useEffect(() => {
    getValue(listValue);
  }, [listValue]);

  return (
    <div
      className={classes.Wrapper}
      style={{
        position: "relative",
        height: itemHeight * visibleItemCount,
        width: itemWidth,
      }}
    >
      <div
        ref={containerRef}
        className={classes.Container}
        style={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          overflowX: "clip",
          scrollSnapType: "y proximity",
          position: "absolute",
          padding: "1rem 0",
        }}
      >
        {[-1, ...item, item[item.length - 1] + 1].map((i, index) => (
          <div
            key={`${i}-${index}`}
            ref={(el) => el && refs.current.push(el)}
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              width: "100%",
              height: itemHeight,
              margin: "1px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                textAlign: "center",
                ...fontStyle,
                color:
                  index === item.length + 1 || index === 0
                    ? "transparent"
                    : fontStyle?.color,
              }}
            >
              {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

ScrollPicker.displayName = "ScrollPicker";

export default ScrollPicker;
