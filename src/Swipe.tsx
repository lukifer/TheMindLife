import React      from "react";
import ReactSwipe from "react-swipe";

import { SwipeArgs } from "./types";

function Swipe(args: SwipeArgs) {
  const {
    panes,
    startSlide,
    onSwipe,
    saveRef,
    className,
    leftButton,
    rightButton,
  } = args;

  // captured ReactSwipe object, used by left/right desktop buttons, and
  // optionally exposed to parent app via "saveRef" callback prop
  let swipeRef: ReactSwipe | null;

  // There is a timing bug with rapid swiping, so we need to capture the index
  // during the "callback" event, and then apply it on the "transitionEnd" event.
  // We use a ref rather than state, to not trigger a render while animation resolves.
  let swipeIndexRef = React.useRef(startSlide);

  return (
    <>
      { leftButton && <button className="arrow left"  onClick={() => swipeRef?.prev()}>&lt;</button>}
      {rightButton && <button className="arrow right" onClick={() => swipeRef?.next()}>&gt;</button>}
      <ReactSwipe
        ref={ref => (swipeRef = ref) && saveRef && saveRef(ref)}
        childCount={panes.length}
        className={className || ""}
        swipeOptions={{
          continuous: false,
          startSlide: startSlide,
          callback: idx => swipeIndexRef.current = idx,
          transitionEnd: () => onSwipe(swipeIndexRef.current),
        }}
      >
        {panes}
      </ReactSwipe>
    </>
  );
}

export default Swipe;
