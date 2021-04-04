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

function translateX(el: Element, val: string) {
  (el as HTMLElement).style.transform = `translateX(${val})`;
}

export function slideAnimation(prev: Game, game: Game) {
  if(document?.body && prev?.state === GameState.ACTIVE && prev.level !== game.level) {
    let anims = [] as Array<Fn>;
    const { clientWidth } = document.body;
    (["lives", "stars"] as Array<"lives" | "stars">).forEach(key => {
      if(key === "stars" && prev.stars + game.stars === 1) {
        const star = (getSlide(key, game[key], "img") || [])[0];
        if(game.stars > prev.stars) {
          star?.classList.add("faded");
          anims.push(() => star?.classList.remove("faded"));
        } else {
          star?.classList.remove("faded");
          anims.push(() => star?.classList.add("faded"));
        }
      } else if(prev[key] !== game[key]) {
        const diff = game[key] - prev[key];
        const images = getSlide(key, game[key], ".images > div");
        let img: HTMLElement | null = null;
        images?.forEach((el, n) => {
          if(diff < 0 && n === 0) img = el.firstChild as HTMLElement;
          if(n < game[key] - diff) {
            translateX(el, `${50*diff}%`);
            anims.push(() => translateX(el, "0px"));
          } else {
            translateX(el, `${clientWidth/2}px`);
            anims.push(() => translateX(el, `0px`));
          }
        });
        if(diff < 0) {
          const slide = (getSlide(key, game[key]) || [])[0];
          slide && img && [...Array(0-diff)].forEach((_, n) => {
            const tempImg = img?.cloneNode() as HTMLElement;
            tempImg.classList.add("temp");
            tempImg.style.left = `${(clientWidth/2)+((game[key]-1)*45)+(n*90)}px`;
            translateX(tempImg, "0px");
            slide.appendChild(tempImg);
            anims.push(() => translateX(tempImg, `${clientWidth/2}px`));
          });
        }
      }
      if(anims.length) {
        document.body.classList.add("no-transition");
        setTimeout(() => {
          document.body.classList.remove("no-transition");
          anims.forEach(x => x());
        }, 0);
      }
    });
  }
}
