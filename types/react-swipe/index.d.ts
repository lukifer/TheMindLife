declare module "react-swipe" {

  import * as React from "react";

  interface SwipeOptions {
    startSlide?: number;
    speed?: number;
    auto?: number;
    continuous?: boolean;
    disableScroll?: boolean;
    stopPropagation?: boolean;
    swiping: (pos: number) => void,
    callback?: (index: number, elem: HTMLElement) => void;
    transitionEnd?: (index: number, elem: HTMLElement) => void;
  }

  interface Style {
    container: React.CSSProperties;
    wrapper: React.CSSProperties;
    child: React.CSSProperties;
  }

  interface SwipeProps {
    id?: string;
    swipeOptions?: SwipeOptions;
    childCount?: number;
    style?: Style;
    className?: string;
  }

  declare class ReactSwipe extends React.Component<SwipeProps> {
    prev(): void;
    next(): void;
    getPos(): number;
    getNumSlides(): number;
    slide(index: number, duration: number): void;
  }

  export = ReactSwipe;
}
