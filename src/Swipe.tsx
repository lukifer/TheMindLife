import React      from "react";
import ReactSwipe from "react-swipe";

import { SwipeProps } from "./types";

function Swipe(props: SwipeProps) {
  const {
    panes,
    startSlide,
    onSwipe,
    className,
    leftButton,
    rightButton,
  } = props;

  // captured ReactSwipe object, used by left/right desktop buttons
  let swipeRef: ReactSwipe | null;

  let tempImagesRemoved = false;

  return (
    <>
      { leftButton && <button className="arrow left"  onClick={() => swipeRef?.prev()}>&lt;</button>}
      {rightButton && <button className="arrow right" onClick={() => swipeRef?.next()}>&gt;</button>}
      <ReactSwipe
        ref={ref => (swipeRef = ref)}
        childCount={panes.length}
        className={className || ""}
        swipeOptions={{
          continuous: false,
          startSlide: startSlide,
          swiping: () => {
            if(!tempImagesRemoved) {
              document.querySelectorAll(".temp").forEach(x => x.remove());
              tempImagesRemoved = true;
            }
          },
          transitionEnd: num => onSwipe(num),
        }}
      >
        {panes}
      </ReactSwipe>
    </>
  );
}

export default Swipe;
