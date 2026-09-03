import type { Meta } from "@storybook/html-vite";

export const labBaseCss = `
  .lab {
    min-height: 100vh;
    box-sizing: border-box;
    padding: clamp(20px, 4vw, 56px);
    color: #f4edf7;
    background:
      radial-gradient(circle at 50% 28%, rgba(173, 97, 26, 0.12), transparent 32%),
      #1c0530;
    font: 14px/1.45 system-ui, sans-serif;
  }
  .lab * { box-sizing: border-box; }
  .lab__frame { width: min(1120px, 100%); margin: 0 auto; }
  .lab__eyebrow {
    margin: 0 0 8px;
    color: #d7a46c;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
  }
  .lab h1 {
    margin: 0;
    font-size: clamp(26px, 4vw, 48px);
    font-weight: 560;
    letter-spacing: -0.035em;
  }
  .lab__intro {
    max-width: 760px;
    margin: 12px 0 24px;
    color: rgba(244, 237, 247, 0.68);
    font-size: 15px;
  }
  .lab__grid { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 18px; }
  .lab__panel {
    min-width: 0;
    border: 1px solid rgba(215, 164, 108, 0.18);
    background: rgba(10, 2, 18, 0.38);
  }
  .lab__panel--padded { padding: 16px; }
  .lab__stage { min-height: 480px; display: grid; place-items: center; overflow: hidden; }
  .lab__stage svg { width: 100%; height: min(68vh, 660px); display: block; }
  .lab__metrics { display: grid; gap: 1px; margin: 0; background: rgba(215, 164, 108, 0.12); }
  .lab__metric {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(18, 4, 31, 0.94);
  }
  .lab__metric dt { color: rgba(244, 237, 247, 0.58); }
  .lab__metric dd { margin: 0; color: #e4b980; font-variant-numeric: tabular-nums; }
  .lab__section-title {
    margin: 0 0 10px;
    color: rgba(244, 237, 247, 0.82);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }
  .lab button {
    appearance: none;
    border: 1px solid rgba(215, 164, 108, 0.42);
    border-radius: 0;
    padding: 9px 12px;
    color: #f4edf7;
    background: rgba(173, 97, 26, 0.12);
    font: inherit;
    cursor: pointer;
  }
  .lab button:hover { background: rgba(173, 97, 26, 0.2); }
  .lab button:focus-visible,
  .lab [role="button"]:focus-visible {
    outline: 2px solid #e4b980;
    outline-offset: 3px;
  }
  .lab table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .lab th, .lab td { padding: 7px 8px; border-bottom: 1px solid rgba(215, 164, 108, 0.1); text-align: left; }
  .lab th { color: rgba(244, 237, 247, 0.48); font-weight: 500; }
  .lab td { color: rgba(244, 237, 247, 0.78); font-variant-numeric: tabular-nums; }
  @media (max-width: 780px) {
    .lab__grid { grid-template-columns: 1fr; }
    .lab__stage { min-height: 360px; }
    .lab__stage svg { height: min(58vh, 520px); }
  }
`;

type LabShell = {
  root: HTMLElement;
  frame: HTMLElement;
};

export function createLabShell(eyebrow: string, title: string, intro: string): LabShell {
  const root = document.createElement("main");
  root.className = "lab";
  root.innerHTML = `
    <style>${labBaseCss}</style>
    <section class="lab__frame">
      <p class="lab__eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="lab__intro">${intro}</p>
      <div data-lab-content></div>
    </section>
  `;

  const frame = root.querySelector<HTMLElement>("[data-lab-content]");
  if (!frame) {
    throw new Error("Defend lab shell failed to create its content frame");
  }

  return { root, frame };
}

export type LabMeta<TArgs extends Record<string, unknown>> = Meta<TArgs>;
