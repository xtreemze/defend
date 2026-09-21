type PreviewRoute = {
  readonly file: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
};

const ROUTES: readonly PreviewRoute[] = [
  {
    file: "index.html",
    label: "Arena",
    title: "Deterministic Arena",
    description: "Babylon presentation driven by a fixed-step Bevy ECS/WASM simulation."
  },
  {
    file: "mothership.html",
    label: "Mothership",
    title: "Finite-Energy Mothership",
    description: "Hover, depletion, instability, impact, and persistent physical consequence."
  },
  {
    file: "navigation.html",
    label: "Raid",
    title: "Raid Navigation",
    description: "Choose a target sector and inspect physically constrained approach planning."
  },
  {
    file: "geothermal.html",
    label: "Energy",
    title: "Geothermal Energy",
    description: "Finite local sources, pressure, conduits, depletion, and eruption."
  },
  {
    file: "routing.html",
    label: "Routing",
    title: "Surface Routing",
    description: "Shared geometry changes both raider movement and recoverable-energy drainage."
  },
  {
    file: "tower-terrain.html",
    label: "Towers",
    title: "Towers & Terrain",
    description: "Deployment, drilling, finite slew, missed shots, and shared terrain deformation."
  }
];

function currentRoute(): PreviewRoute {
  const lastSegment = location.pathname.split("/").filter(Boolean).at(-1);
  const file = lastSegment?.endsWith(".html") ? lastSegment : "index.html";
  return ROUTES.find((route) => route.file === file) ?? ROUTES[0];
}

function button(label: string, className = "preview-action"): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  return element;
}

function setExpanded(
  trigger: HTMLButtonElement,
  panel: HTMLElement,
  expanded: boolean
): void {
  trigger.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
}

function panelHeading(title: string): HTMLDivElement {
  const heading = document.createElement("div");
  heading.className = "preview-panel__heading";
  heading.textContent = title;
  return heading;
}

function buildShell(): void {
  const route = currentRoute();
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const controls = document.querySelector<HTMLElement>("#controls");
  const hint =
    document.querySelector<HTMLElement>("#hint") ??
    document.querySelector<HTMLElement>("#caption");

  document.title = `Defend — ${route.title}`;
  document.body.dataset.previewRoute = route.file;

  if (canvas) {
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", `${route.title} interactive 3D scene`);
    if (hint?.id) canvas.setAttribute("aria-describedby", hint.id);
  }

  const shell = document.createElement("div");
  shell.className = "preview-shell";
  shell.dataset.previewShell = "";
  shell.setAttribute("aria-label", "Defend preview interface");

  const header = document.createElement("header");
  header.className = "preview-header";

  const brand = document.createElement("a");
  brand.className = "preview-brand";
  brand.href = "./";
  brand.setAttribute("aria-label", "Defend preview home");
  brand.innerHTML = `
    <span class="preview-brand__mark" aria-hidden="true"><span></span></span>
    <span class="preview-brand__word">DEFEND</span>
  `;

  const sceneMeta = document.createElement("div");
  sceneMeta.className = "preview-scene-meta";
  const eyebrow = document.createElement("span");
  eyebrow.className = "preview-scene-meta__eyebrow";
  eyebrow.textContent = "Modern preview";
  const title = document.createElement("strong");
  title.className = "preview-scene-meta__title";
  title.textContent = route.title;
  const description = document.createElement("span");
  description.className = "preview-scene-meta__description";
  description.textContent = route.description;
  sceneMeta.append(eyebrow, title, description);

  const actions = document.createElement("div");
  actions.className = "preview-actions";

  const controlsToggle = button("Controls");
  controlsToggle.setAttribute("aria-controls", "preview-controls-panel");

  const diagnosticsToggle = button("Diagnostics");
  diagnosticsToggle.setAttribute("aria-controls", "preview-diagnostics-panel");

  const helpToggle = button("Help");
  helpToggle.setAttribute("aria-controls", "preview-help-panel");

  const fullscreenToggle = button("Fullscreen");
  fullscreenToggle.setAttribute("aria-label", "Enter fullscreen");

  if (controls) actions.append(controlsToggle);
  if (metrics) actions.append(diagnosticsToggle);
  actions.append(helpToggle, fullscreenToggle);
  header.append(brand, sceneMeta, actions);

  const nav = document.createElement("nav");
  nav.className = "preview-nav";
  nav.dataset.previewNav = "";
  nav.setAttribute("aria-label", "Preview scenes");
  for (const item of ROUTES) {
    const link = document.createElement("a");
    link.href = item.file === "index.html" ? "./" : `./${item.file}`;
    link.textContent = item.label;
    link.title = item.title;
    if (item.file === route.file) link.setAttribute("aria-current", "page");
    nav.append(link);
  }

  shell.append(header, nav);
  document.body.append(shell);

  let controlsPanel: HTMLElement | undefined;
  if (controls) {
    controls.setAttribute(
      "aria-label",
      controls.getAttribute("aria-label") ?? `${route.title} controls`
    );
    controls.classList.add("preview-control-list");

    controlsPanel = document.createElement("section");
    controlsPanel.id = "preview-controls-panel";
    controlsPanel.className = "preview-panel preview-panel--controls";
    controlsPanel.setAttribute("aria-label", "Scene controls");
    controlsPanel.append(panelHeading("Scene controls"), controls);
    document.body.append(controlsPanel);

    const initiallyExpanded = !matchMedia("(max-width: 760px)").matches;
    setExpanded(controlsToggle, controlsPanel, initiallyExpanded);
    controlsToggle.addEventListener("click", () => {
      setExpanded(
        controlsToggle,
        controlsPanel as HTMLElement,
        controlsToggle.getAttribute("aria-expanded") !== "true"
      );
    });
  }

  let diagnosticsPanel: HTMLElement | undefined;
  if (metrics) {
    metrics.classList.add("preview-metrics");
    metrics.setAttribute("aria-label", "Scene diagnostics");
    metrics.setAttribute("aria-live", "off");

    diagnosticsPanel = document.createElement("section");
    diagnosticsPanel.id = "preview-diagnostics-panel";
    diagnosticsPanel.className = "preview-panel preview-panel--diagnostics";
    diagnosticsPanel.setAttribute("aria-label", "Diagnostics");
    diagnosticsPanel.append(panelHeading("Diagnostics"), metrics);
    document.body.append(diagnosticsPanel);

    setExpanded(diagnosticsToggle, diagnosticsPanel, false);
    diagnosticsToggle.addEventListener("click", () => {
      setExpanded(
        diagnosticsToggle,
        diagnosticsPanel as HTMLElement,
        diagnosticsToggle.getAttribute("aria-expanded") !== "true"
      );
    });
  }

  if (hint) {
    hint.classList.add("preview-hint");
    hint.setAttribute("role", "note");
  }

  const helpPanel = document.createElement("section");
  helpPanel.id = "preview-help-panel";
  helpPanel.className = "preview-panel preview-panel--help";
  helpPanel.setAttribute("aria-label", "Preview help");
  helpPanel.innerHTML = `
    <div class="preview-panel__heading">How to explore</div>
    <p><strong>${route.title}</strong></p>
    <p>${route.description}</p>
    <ul>
      <li>Drag the scene to orbit the camera where supported.</li>
      <li>Use wheel or pinch gestures to zoom.</li>
      <li>Scene controls expose keyboard shortcuts in their labels.</li>
      <li>Diagnostics remain available without occupying the default view.</li>
    </ul>
    <p class="preview-help__note">This public build is an active systems preview. Individual scenes expose working pieces of the final game architecture.</p>
  `;
  document.body.append(helpPanel);
  setExpanded(helpToggle, helpPanel, false);
  helpToggle.addEventListener("click", () => {
    setExpanded(
      helpToggle,
      helpPanel,
      helpToggle.getAttribute("aria-expanded") !== "true"
    );
  });

  const loading = document.createElement("div");
  loading.className = "preview-loading";
  loading.setAttribute("role", "status");
  loading.setAttribute("aria-live", "polite");
  loading.innerHTML = `
    <span class="preview-loading__mark" aria-hidden="true"></span>
    <span>Starting ${route.title}…</span>
  `;
  document.body.append(loading);

  const errorPanel = document.createElement("div");
  errorPanel.className = "preview-error";
  errorPanel.hidden = true;
  errorPanel.setAttribute("role", "alert");
  document.body.append(errorPanel);

  let ready = false;
  const markReady = (): void => {
    if (ready) return;
    ready = true;
    document.body.dataset.previewReady = "true";
    loading.hidden = true;
  };

  if (metrics) {
    const initialText = metrics.textContent?.trim() ?? "";
    if (initialText && initialText !== "initializing…") {
      markReady();
    } else {
      const observer = new MutationObserver(() => {
        const text = metrics.textContent?.trim() ?? "";
        if (text && text !== "initializing…") {
          observer.disconnect();
          markReady();
        }
      });
      observer.observe(metrics, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  } else {
    requestAnimationFrame(markReady);
  }

  const showFailure = (message: string): void => {
    loading.hidden = true;
    errorPanel.hidden = false;
    errorPanel.textContent = `Scene failed to start: ${message}`;
  };

  window.addEventListener("error", (event) => {
    showFailure(event.message || "unknown browser error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason =
      event.reason instanceof Error ? event.reason.message : String(event.reason);
    showFailure(reason || "unhandled promise rejection");
  });

  const updateFullscreenLabel = (): void => {
    const fullscreen = document.fullscreenElement !== null;
    fullscreenToggle.textContent = fullscreen ? "Exit fullscreen" : "Fullscreen";
    fullscreenToggle.setAttribute(
      "aria-label",
      fullscreen ? "Exit fullscreen" : "Enter fullscreen"
    );
  };

  fullscreenToggle.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      showFailure(error instanceof Error ? error.message : String(error));
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenLabel);

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (helpToggle.getAttribute("aria-expanded") === "true") {
      setExpanded(helpToggle, helpPanel, false);
    }
    if (
      diagnosticsPanel &&
      diagnosticsToggle.getAttribute("aria-expanded") === "true"
    ) {
      setExpanded(diagnosticsToggle, diagnosticsPanel, false);
    }
  });

  document.body.classList.add("preview-shell-ready");
}

buildShell();
