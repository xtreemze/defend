import toObject from "./toObject";
import initializePage from "./parallax";
import menuContentGenerator from "./menuContent";

import p1ContentGenerator from "./p1HTML";

import footerContentGenerator from "./footerContent";

const e = "e";

const footerContent = require(`./foot${e}r.json`);

// Get DOM elements to be populated with content
const header = document.getElementById("header");

(async () => {
  // Populate header, main and footer with content
  header.innerHTML = menuContentGenerator();
  switch (window.location.search.substring(1)) {
    case "":
    case "Lequinox":
    case "p1":
      {
        const loader = document.getElementById("loader");
        loader.classList.add("slideUp");
        const main = document.getElementById("main");
        // For Loading Screen to display and animate
        // fade out the Loading Screen
        main.innerHTML = p1ContentGenerator();
        initializePage(true);
      }
      break;

    default:
      initializePage(true);
      break;
  }
})();

window.sessionStorage.clear();

history.replaceState("p1", "p1");

const footer = document.getElementById("footer");
footer.innerHTML = footerContentGenerator(toObject(footerContent));
