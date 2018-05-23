import M from "materialize-css";

import toObject from "./toObject";

import p1ContentGenerator from "./p1HTML";
import p2ContentGenerator from "./p2HTML";
import p3ContentGenerator from "./p3HTML";
import p4ContentGenerator from "./p4HTML";
import p5ContentGenerator from "./p5HTML";
import p6ContentGenerator from "./p6HTML";
import p7ContentGenerator from "./p7HTML";
import p8ContentGenerator from "./p8HTML";
import p9ContentGenerator from "./p9HTML";
import p10ContentGenerator from "./p10HTML";
import portalContentGenerator from "./portalHTML";
import api from "../api";

import initializePage from "./parallax";

import version from "./version";
import charCounter from "./charCounter";

const emailLink = document.querySelectorAll(".emailLink");

emailLink.forEach(link => {
  link.addEventListener("click", async () => {
    const nameElement = document.getElementById("nameInput");
    const emailElement = document.getElementById("emailInput");
    const messageElement = document.getElementById("messageInput");
    if (
      nameElement.validity.valid &&
      emailElement.validity.valid &&
      messageElement.validity.valid
    ) {
      api.sendMail(nameElement.value, emailElement.value, messageElement.value);
    } else {
      M.Toast.dismissAll();
      M.toast({
        html: "Please fill all fields with valid information before sending."
      });
    }
  });
});

// || !!window.StyleMedia
if (/* @cc_on!@ */ false || !!document.documentMode) {
  const page = document.getElementById("body");
  page.innerHTML =
    "<div class='warnIE'><h2>Hi!</h2><p>We detected that you are using Internet Explorer and some of our functions require that you use a reliable, modern browser. Please update to the latest release of a browser such as Chrome, Edge, Safari or Firefox.</p></div>";
}

// Google Analytics tag
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "UA-11676430-10");

// A workaround to force Webpack to split the bundle
const p = "p";

// Get DOM elements to be populated with content

const main = document.getElementById("main");

// Gather JSON content from the rest of the pages 2-10

// const p1Content = require(`./${p}1.json`);
const p2Content = require(`./${p}2.json`);
const p3Content = require(`./${p}3.json`);
const p4Content = require(`./${p}4.json`);
const p5Content = require(`./${p}5.json`);
const p6Content = require(`./${p}6.json`);
const p7Content = require(`./${p}7.json`);
const p8Content = require(`./${p}8.json`);
const p9Content = require(`./${p}9.json`);
const p10Content = require(`./${p}10.json`);
const portalContent = require(`./${p}ortal.json`);

let p1Link = document.querySelectorAll(".p1Link");
let p2Link = document.querySelectorAll(".p2Link");
let p3Link = document.querySelectorAll(".p3Link");
let p4Link = document.querySelectorAll(".p4Link");
let p5Link = document.querySelectorAll(".p5Link");
let p6Link = document.querySelectorAll(".p6Link");
let p7Link = document.querySelectorAll(".p7Link");
let p8Link = document.querySelectorAll(".p8Link");
let p9Link = document.querySelectorAll(".p9Link");
let p10Link = document.querySelectorAll(".p10Link");
let portalLink = document.querySelectorAll(".portalLink");

/**
 * Assigns event listener functions to links based on their classname
 * @param {boolean} firstRun
 */
const populate = function populate(firstRun = true) {
  if (firstRun === false) {
    // Gather Links from navbar and mobile nav
    p1Link = main.querySelectorAll(".p1Link");
    p2Link = main.querySelectorAll(".p2Link");
    p3Link = main.querySelectorAll(".p3Link");
    p4Link = main.querySelectorAll(".p4Link");
    p5Link = main.querySelectorAll(".p5Link");
    p6Link = main.querySelectorAll(".p6Link");
    p7Link = main.querySelectorAll(".p7Link");
    p8Link = main.querySelectorAll(".p8Link");
    p9Link = main.querySelectorAll(".p9Link");
    p10Link = main.querySelectorAll(".p10Link");
    portalLink = main.querySelectorAll(".portalLink");
  }
  // Add event listeners to the navigation bar
  p1Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p1";
      const title = "Lequinox";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p1ContentGenerator();
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p2Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p2";
      const title = "Lequinox - Platform Overview";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p2ContentGenerator(toObject(p2Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p3Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p3";
      const title = "Lequinox - Platform Description";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p3ContentGenerator(toObject(p3Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p4Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p4";
      const title = "Lequinox - Applications Overview";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p4ContentGenerator(toObject(p4Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p5Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p5";
      const title = "Lequinox - Framework Apps";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p5ContentGenerator(toObject(p5Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p6Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p6";
      const title = "Lequinox - Partner Applications";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p6ContentGenerator(toObject(p6Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p7Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p7";
      const title = "Lequinox - Solution Overview";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p7ContentGenerator(toObject(p7Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p8Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p8";
      const title = "Lequinox - Empower Business";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p8ContentGenerator(toObject(p8Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p9Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p9";
      const title = "Lequinox - Empower Tech";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p9ContentGenerator(toObject(p9Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  p10Link.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "p10";
      const title = "Lequinox - Empower Compliance";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await p10ContentGenerator(toObject(p10Content));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
  portalLink.forEach(link => {
    link.addEventListener("click", async () => {
      const page = "portal";
      const title = "Lequinox - Customer Portal";
      const titleNoSpace = `?${title.replace(/\s+/g, "")}`;
      if (history.state !== page) {
        history.pushState(page, page, titleNoSpace);
      } else {
        history.replaceState(page, page, titleNoSpace);
      }
      document.title = title;
      main.innerHTML = await portalContentGenerator(toObject(portalContent));
      initializePage();
      populate(false);
      window.scrollTo(0, 0);
    });
  });
};

// Support URL Names
async function router() {
  switch (window.location.search.substring(1)) {
    case "Lequinox-PlatformOverview":
    case "p2":
      main.innerHTML = await p2ContentGenerator(toObject(p2Content));
      break;
    case "Lequinox-PlatformDescription":
    case "p3":
      main.innerHTML = await p3ContentGenerator(toObject(p3Content));
      break;
    case "Lequinox-ApplicationsOverview":
    case "p4":
      main.innerHTML = await p4ContentGenerator(toObject(p4Content));
      break;
    case "Lequinox-FrameworkApps":
    case "p5":
      main.innerHTML = await p5ContentGenerator(toObject(p5Content));
      break;
    case "Lequinox-PartnerApplications":
    case "p6":
      main.innerHTML = await p6ContentGenerator(toObject(p6Content));
      break;
    case "Lequinox-SolutionOverview":
    case "p7":
      main.innerHTML = await p7ContentGenerator(toObject(p7Content));
      break;
    case "Lequinox-EmpowerBusiness":
    case "p8":
      main.innerHTML = await p8ContentGenerator(toObject(p8Content));
      break;
    case "Lequinox-EmpowerTech":
    case "p9":
      main.innerHTML = await p9ContentGenerator(toObject(p9Content));
      break;
    case "Lequinox-EmpowerCompliance":
    case "p10":
      main.innerHTML = await p10ContentGenerator(toObject(p10Content));
      break;
    case "Lequinox-CustomerPortal":
    case "portal":
      main.innerHTML = await portalContentGenerator(toObject(portalContent));
      break;

    default:
      main.innerHTML = await p1ContentGenerator();
      break;
  }

  initializePage();
  populate(false);
}

populate(true);

switch (window.location.search.substring(1)) {
  case "":
  case "Lequinox":
  case "p1":
    break;

  default:
    {
      window.scrollTo(0, 0);
      router();
      // For Loading Screen to display and animate
      // fade out the Loading Screen
      const loader = document.getElementById("loader");
      loader.classList.add("slideUp");
    }
    break;
}

// History API for Back and Forward Nav buttons
window.addEventListener("popstate", async page => {
  switch (page.state) {
    case "p1":
    case "Lequinox":
      main.innerHTML = await p1ContentGenerator();
      break;
    case "Lequinox-PlatformOverview":
    case "p2":
      main.innerHTML = await p2ContentGenerator(toObject(p2Content));
      break;
    case "Lequinox-PlatformDescription":
    case "p3":
      main.innerHTML = await p3ContentGenerator(toObject(p3Content));
      break;
    case "Lequinox-ApplicationsOverview":
    case "p4":
      main.innerHTML = await p4ContentGenerator(toObject(p4Content));
      break;
    case "Lequinox-FrameworkApps":
    case "p5":
      main.innerHTML = await p5ContentGenerator(toObject(p5Content));
      break;
    case "Lequinox-PartnerApplications":
    case "p6":
      main.innerHTML = await p6ContentGenerator(toObject(p6Content));
      break;
    case "Lequinox-SolutionOverview":
    case "p7":
      main.innerHTML = await p7ContentGenerator(toObject(p7Content));
      break;
    case "Lequinox-EmpowerBusiness":
    case "p8":
      main.innerHTML = await p8ContentGenerator(toObject(p8Content));
      break;
    case "Lequinox-EmpowerTech":
    case "p9":
      main.innerHTML = await p9ContentGenerator(toObject(p9Content));
      break;
    case "Lequinox-EmpowerCompliance":
    case "p10":
      main.innerHTML = await p10ContentGenerator(toObject(p10Content));
      break;
    case "Lequinox-CustomerPortal":
    case "portal":
      main.innerHTML = await portalContentGenerator(toObject(portalContent));
      break;

    default:
      break;
  }
  initializePage();
  populate(false);
  window.scrollTo(0, 0);
});

version();

charCounter();
