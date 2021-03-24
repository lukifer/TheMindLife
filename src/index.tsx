import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from "./App";

if(!("ontouchstart" in document.documentElement)) {
  document.body.className = "notouch";
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
