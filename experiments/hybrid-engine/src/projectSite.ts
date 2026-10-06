const PROJECT_SITE_KIT_URL =
  "https://xtreemze.github.io/timeline/project-site/xtreemze-project-site.js";

type ProjectTimelineElement = HTMLElement & {
  items: readonly {
    id: string;
    label: string;
    timeLabel: string;
    detail?: string;
    color?: string;
  }[];
  selectedId: string;
};

const HISTORY_ITEMS = [
  {
    id: "2018-05",
    timeLabel: "May 2018",
    label: "Repository begins",
    detail: "The first public commits establish the original browser game.",
    color: "#e2a769",
  },
  {
    id: "2018-07",
    timeLabel: "July 2018",
    label: "PWA work",
    detail: "Installable web delivery is explored while the game stays browser-first.",
    color: "#4bdad3",
  },
  {
    id: "2018-12",
    timeLabel: "December 2018",
    label: "Babylon.js community release",
    detail: "Defend is shared as a 3D tower-defense webgame and joins the community demos.",
    color: "#e2a769",
  },
  {
    id: "2026-09",
    timeLabel: "September 2026",
    label: "Modernization program",
    detail: "Design contracts, Rust/WASM semantics, and Babylon 9 experiments formalize the rebuild.",
    color: "#4bdad3",
  },
  {
    id: "2026-10",
    timeLabel: "Now",
    label: "Classic MVP remains the game",
    detail: "Modern systems remain inspectable experiments until gameplay parity is certified.",
    color: "#f3eadf",
  },
] as const;

async function enhanceHistoryTimeline(): Promise<void> {
  const history = document.querySelector<ProjectTimelineElement>("#defend-history-timeline");
  if (!history) return;

  try {
    await import(/* @vite-ignore */ PROJECT_SITE_KIT_URL);
    await customElements.whenDefined("xt-project-timeline");
    history.items = HISTORY_ITEMS;
    history.selectedId = HISTORY_ITEMS.at(-1)?.id ?? "";
    history.hidden = false;
  } catch {
    history.hidden = true;
  }
}

void enhanceHistoryTimeline();
