import type { CSSProperties } from 'react';
import React from 'react';
import { useScroll } from '../../utils/hooks/use-scroll';

interface VirtualScrollProps {
  itemWidth: CSSProperties['width'];
  itemHeight: CSSProperties['height'];
  children: React.ReactNode[];
  renderAhead: number;
  columnGap: number;
}

const containerHeight = 300;

function VirtualScroll(props: VirtualScrollProps) {
  const {
    itemHeight = props.itemHeight || 0,
    itemWidth = props.itemWidth || 0,
    renderAhead = props.renderAhead || 0,
    columnGap = props.columnGap || 0,
    children,
  } = props;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { y } = useScroll(scrollRef);
  const [viewportY, setViewportY] = React.useState<number>(0);

  React.useEffect(() => {
    setViewportY(scrollRef.current?.offsetTop ?? 0);
  }, []);

  const relativeY = y - viewportY;
  const startIndex = Math.max(
    Math.floor(relativeY / (+itemHeight + columnGap)) - renderAhead,
    0
  );
  const endIndex = Math.min(
    containerHeight / +itemHeight + startIndex + renderAhead,
    children.length
  );

  const visibleItem = children.slice(
    Math.max(startIndex, 0),
    Math.min(endIndex + 1, children.length)
  );

  const translateY = Math.max(
    (+itemHeight + columnGap) * startIndex,
    columnGap
  );

  return (
    <div
      style={{
        width: itemWidth,
        height: containerHeight,
        overflowY: 'auto',
        overflowX: 'clip',
      }}
      ref={scrollRef}
    >
      <div
        style={{
          height: +itemHeight * children.length,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {visibleItem}
      </div>
    </div>
  );
}

VirtualScroll.displayName = 'VirtualScroll';

export default VirtualScroll;
