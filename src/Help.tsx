import React from "react";
import clsx  from "clsx";

import { Game, GameState } from "./types";

function Help(args: Partial<Game>) {
  const [active, setActive] = React.useState(false);
  const lnk = { target: "_blank", rel: "noreferrer" };
  const pnd = "https://pandasaurusgames.com/products/";
  return <>
    <button
      id="helpButton"
      className={clsx(args.state === GameState.PRE && "visible", active && "active")}
      onClick={() => setActive(!active)}
    ><span className="q">?</span></button>
    <div
      id="helpOverlay"
      className={clsx(active && "visible")}
      onClick={() => setActive(false)}
    ></div>
    <div
      id="help"
      className={clsx(active && "visible")}
    >
      <p>
        <a href={`${pnd}the-mind`} {...lnk}>The Mind</a> is a cooperative card game for
        2-4 players (you'll need a copy to play).
      </p>
      <p>
        Your goal is to play all your cards in order, without communicating directly.
      </p>
      <p>
        To use this app to track your level, lives, and stars, swipe each left or right.
      </p>
      <p>
        For <a href={`${pnd}the-mind-extreme`} {...lnk}>The Mind Extreme</a>,
        choose <em>Extreme Mode</em>. (If you don't know what this is, leave it off.)</p>
      <p>
        Good luck!
      </p>
      <p>
        <a className="rules" href="/rules.pdf">Full Rules PDF</a>
      </p>
      <p>
        <a className="src" href="https://github.com/lukifer/TheMindLife">
          View Source
        </a>
      </p>
    </div>
  </>;
}

export default Help;
