import { css, html, LitElement, nothing } from "lit";

export type DefendOperationalState = "stable" | "strained" | "critical";

export interface DefendStatusViewModel {
  readonly energy: number;
  readonly energyCapacity: number;
  readonly activeThreats: number;
  readonly state: DefendOperationalState;
  readonly headline: string;
  readonly detail?: string;
}

const DEFAULT_MODEL: DefendStatusViewModel = Object.freeze({
  energy: 0,
  energyCapacity: 1,
  activeThreats: 0,
  state: "stable",
  headline: "Stronghold status"
});

function finiteNonnegative(value: number, fallback = 0): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function operationalState(value: DefendOperationalState): DefendOperationalState {
  return value === "strained" || value === "critical" ? value : "stable";
}

export class DefendStatusPanel extends LitElement {
  static properties = {
    model: { attribute: false }
  };

  declare model: DefendStatusViewModel;

  constructor() {
    super();
    this.model = DEFAULT_MODEL;
  }

  static styles = css`
    :host {
      --defend-ui-surface: color-mix(in srgb, #150222 88%, transparent);
      --defend-ui-border: color-mix(in srgb, #d7a46c 34%, transparent);
      --defend-ui-text: #f4edf7;
      --defend-ui-muted: color-mix(in srgb, #f4edf7 62%, transparent);
      --defend-ui-accent: #e4b980;
      display: block;
      color: var(--defend-ui-text);
      container-type: inline-size;
      font: 500 0.875rem/1.4 system-ui, sans-serif;
    }

    .panel {
      display: grid;
      gap: 0.875rem;
      padding: 1rem;
      border: 1px solid var(--defend-ui-border);
      background: var(--defend-ui-surface);
      backdrop-filter: blur(12px);
    }

    header,
    .energy-label,
    .threats {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 0.95rem;
      font-weight: 620;
      letter-spacing: -0.015em;
    }

    .state {
      color: var(--defend-ui-accent);
      font-size: 0.68rem;
      font-weight: 720;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }

    .state[data-state="critical"] {
      text-decoration: underline 0.14em;
      text-underline-offset: 0.22em;
    }

    .energy-label,
    .threats,
    .detail {
      color: var(--defend-ui-muted);
    }

    .energy-label strong,
    .threats strong {
      color: var(--defend-ui-text);
      font-variant-numeric: tabular-nums;
    }

    progress {
      width: 100%;
      height: 0.5rem;
      border: 0;
      background: color-mix(in srgb, #f4edf7 12%, transparent);
      accent-color: var(--defend-ui-accent);
    }

    progress::-webkit-progress-bar {
      background: color-mix(in srgb, #f4edf7 12%, transparent);
    }

    progress::-webkit-progress-value {
      background: var(--defend-ui-accent);
    }

    .detail {
      max-width: 62ch;
      font-size: 0.8rem;
    }

    @container (max-width: 22rem) {
      header,
      .energy-label,
      .threats {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        scroll-behavior: auto !important;
      }
    }

    @media (prefers-contrast: more) {
      .panel {
        border-width: 2px;
        backdrop-filter: none;
      }
    }
  `;

  render() {
    const capacity = Math.max(1, finiteNonnegative(this.model.energyCapacity, 1));
    const energy = Math.min(capacity, finiteNonnegative(this.model.energy));
    const threats = Math.floor(finiteNonnegative(this.model.activeThreats));
    const state = operationalState(this.model.state);
    const detail = this.model.detail?.trim();

    return html`
      <section class="panel" aria-labelledby="defend-status-headline">
        <header>
          <h2 id="defend-status-headline">${this.model.headline}</h2>
          <span class="state" data-state=${state}>${state}</span>
        </header>

        <div>
          <div class="energy-label">
            <span>Energy reserve</span>
            <strong>${Math.round(energy).toLocaleString()} / ${Math.round(capacity).toLocaleString()}</strong>
          </div>
          <progress aria-label="Energy reserve" value=${energy} max=${capacity}></progress>
        </div>

        <p class="threats">
          <span>Active threats</span>
          <strong>${threats}</strong>
        </p>

        ${detail ? html`<p class="detail">${detail}</p>` : nothing}
      </section>
    `;
  }
}

if (!customElements.get("defend-status-panel")) {
  customElements.define("defend-status-panel", DefendStatusPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "defend-status-panel": DefendStatusPanel;
  }
}
