import M from "materialize-css";

import reveal from "./reveal";
/**
 * Initialize Materialize Elements
 */
export default function initializePage(firstRun = false) {
  if (firstRun === true) {
    window.scrollTo(0, 0);
    // Sidenav initialization
    const elem3 = document.querySelector(".sidenav");
    M.Sidenav.init(elem3);

    // Dropdown initialization
    const elem4 = document.querySelectorAll(".dropdown-trigger");
    elem4.forEach(element => {
      M.Dropdown.init(element, { hover: true });
    });

    const collapsibleElem = document.querySelector(".collapsible");
    M.Collapsible.init(collapsibleElem);

    M.updateTextFields();

    reveal();
  } else {
    const options2 = {};
    // Parallax initialization
    const parallaxElements = document.querySelectorAll(".parallax");
    parallaxElements.forEach(element => {
      M.Parallax.init(element, options2);
    });
    reveal();
  }
}
