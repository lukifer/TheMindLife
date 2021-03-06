import {
  Fn,
  Game,
  GameState,
  SwipeName,
} from "./types";

function getSlide(name: SwipeName, pos: number, sel: string = "") {
  const id = `${name}SwipeWrap`;
  const selector = `[data-index='${pos}']${sel && " " + sel}`;
  return document.getElementById(id)?.querySelectorAll(selector);
}

function translateX(el: Element, x: number) {
  (el as HTMLElement).style.transform = `translateX(${x}px)`;
}

// Calculate the x-axis positions for a row of icons, for animating between states
export function xOffsets(containerWidth: number, itemWidth: number, count: number) {
  const adjustedWidth = Math.min(containerWidth / count, itemWidth);
  const offset = adjustedWidth === itemWidth
    ?  0.5 * (containerWidth - (count * itemWidth))
    : -0.5 * (itemWidth - adjustedWidth)
    ;
  return [...Array(count)].map((_, n) => offset + (n * adjustedWidth));
}

// Apply a transition effect after a change in icon count. We do this by applying offsets
// in reverse; ie, when changing from 4 icons to 3 icons, we apply a translateX on the
// remaining 3, to position them back to their "4" state, then animate back to translateX(0)
export function slideAnimation(prev: Game, game: Game) {
  if(document?.body && prev?.state === GameState.ACTIVE && prev.level !== game.level) {
    let anims = [] as Array<Fn>;
    const { clientWidth } = document.body;
    (["lives", "stars"] as Array<"lives" | "stars">).forEach(key => {
      // Transition between 0 and 1 stars: fade rather than slide
      if(key === "stars" && prev.stars + game.stars === 1) {
        const star = (getSlide(key, game[key], "img") || [])[0];
        if(game.stars > prev.stars) {
          star?.classList.add("faded");
          anims.push(() => star?.classList.remove("faded"));
        } else {
          star?.classList.remove("faded");
          anims.push(() => star?.classList.add("faded"));
        }
      }
      // Everything else: slide stars/bunnies in and out
      else if(prev[key] !== game[key]) {
        const diff = game[key] - prev[key];
        const images = getSlide(key, game[key], ".images > div");
        let img: HTMLElement | null = null;
        const from = xOffsets(clientWidth - (24 * 2), 90, prev[key]);
        const to   = xOffsets(clientWidth - (24 * 2), 90, game[key]);
        images?.forEach((el, n) => {
          if(diff < 0 && !img) img = el.firstElementChild as HTMLElement;
          // Previously existing icons slide into position; new icons fly in from offscreen
          const isPreExistingIcon = n < game[key] - diff;
          translateX(el, isPreExistingIcon ? from[n] - to[n] : clientWidth/2);
          anims.push(() => translateX(el, 0));
        });
        // If going backwards, add temp image(s), which will be animated away
        if(diff < 0) {
          const slide = (getSlide(key, game[key]) || [])[0];
          slide && img && [...Array(0-diff)].forEach((_, n) => {
            const tempImg = img?.cloneNode() as HTMLElement;
            tempImg.classList.add("temp");
            tempImg.style.left = `${(clientWidth/2)+((game[key]-1)*45)+(n*90)}px`;
            translateX(tempImg, 0);
            slide.appendChild(tempImg);
            anims.push(() => translateX(tempImg, clientWidth/2));
          });
        }
      }
      if(anims.length) {
        // Trick for one-way CSS transitions
        document.body.classList.add("no-transition");
        setTimeout(() => {
          document.body.classList.remove("no-transition");
          anims.forEach(x => x());
        }, 0);
      }
    });
  }
}
