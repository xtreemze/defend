import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent, within } from "storybook/test";

type Capability = {
  label: string;
  supported: boolean;
  detail: string;
};

function supportsWebGl2(): boolean {
  const canvas = document.createElement("canvas");
  return canvas.getContext("webgl2") !== null;
}

function collectCapabilities(): Capability[] {
  return [
    {
      label: "AudioWorklet",
      supported: "AudioWorkletNode" in window,
      detail: "Low-latency custom procedural DSP"
    },
    {
      label: "Dedicated Worker",
      supported: "Worker" in window,
      detail: "Event aggregation and planning off the gameplay thread"
    },
    {
      label: "OffscreenCanvas",
      supported: "OffscreenCanvas" in window,
      detail: "Optional worker-side diagnostics and sound visualization"
    },
    {
      label: "WebGL2",
      supported: supportsWebGl2(),
      detail: "Wide-support accelerated presentation baseline"
    },
    {
      label: "WebGPU",
      supported: "gpu" in navigator,
      detail: "Optional experimental presentation path"
    },
    {
      label: "SharedArrayBuffer",
      supported: typeof SharedArrayBuffer !== "undefined",
      detail: "Optional shared-memory control path"
    },
    {
      label: "Cross-origin isolated",
      supported: self.crossOriginIsolated === true,
      detail: "Required before relying on SharedArrayBuffer"
    }
  ];
}

function capabilityMarkup(capability: Capability): string {
  const state = capability.supported ? "available" : "unavailable";
  return `
    <li class="capability capability--${state}">
      <span class="capability__state" aria-hidden="true"></span>
      <span>
        <strong>${capability.label}</strong>
        <small>${capability.detail}</small>
      </span>
      <span class="capability__value">${state}</span>
    </li>
  `;
}

function renderCapabilityList(target: HTMLElement): void {
  target.innerHTML = collectCapabilities().map(capabilityMarkup).join("");
}

const meta = {
  title: "Diagnostics/Capability Matrix",
  tags: ["test", "visual"],
  render: () => {
    const root = document.createElement("main");
    root.className = "lab";
    root.innerHTML = `
      <style>
        .lab {
          min-height: 100vh;
          box-sizing: border-box;
          padding: clamp(24px, 5vw, 72px);
          color: #f4edf7;
          background:
            radial-gradient(circle at 50% 35%, rgba(173, 97, 26, 0.14), transparent 28%),
            #1c0530;
          font: 14px/1.45 system-ui, sans-serif;
        }
        .lab__frame {
          width: min(900px, 100%);
          margin: 0 auto;
        }
        .lab__eyebrow {
          margin: 0 0 8px;
          color: #d7a46c;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 11px;
        }
        h1 {
          margin: 0;
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 540;
          letter-spacing: -0.035em;
        }
        .lab__intro {
          max-width: 720px;
          margin: 16px 0 32px;
          color: rgba(244, 237, 247, 0.68);
          font-size: 16px;
        }
        .lab__visual {
          display: grid;
          place-items: center;
          min-height: 210px;
          margin: 28px 0;
          border: 1px solid rgba(215, 164, 108, 0.2);
          background: rgba(10, 2, 18, 0.34);
        }
        .lab__visual svg {
          width: min(340px, 72vw);
          overflow: visible;
        }
        .lab__visual polygon,
        .lab__visual circle {
          fill: none;
          stroke: #d7a46c;
          vector-effect: non-scaling-stroke;
        }
        .lab__visual polygon { opacity: 0.9; }
        .lab__visual circle { opacity: 0.22; }
        .capabilities {
          display: grid;
          gap: 1px;
          padding: 0;
          margin: 0;
          list-style: none;
          background: rgba(215, 164, 108, 0.12);
          border: 1px solid rgba(215, 164, 108, 0.12);
        }
        .capability {
          display: grid;
          grid-template-columns: 10px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 13px 15px;
          background: rgba(18, 4, 31, 0.92);
        }
        .capability__state {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }
        .capability--available { color: #e4b980; }
        .capability--unavailable { color: rgba(244, 237, 247, 0.38); }
        .capability strong,
        .capability small {
          display: block;
        }
        .capability small {
          margin-top: 2px;
          color: rgba(244, 237, 247, 0.54);
        }
        .capability__value {
          color: rgba(244, 237, 247, 0.5);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lab__actions {
          margin-top: 18px;
        }
        button {
          appearance: none;
          border: 1px solid rgba(215, 164, 108, 0.45);
          border-radius: 0;
          padding: 10px 14px;
          color: #f4edf7;
          background: rgba(173, 97, 26, 0.12);
          font: inherit;
          cursor: pointer;
        }
        button:focus-visible {
          outline: 2px solid #e4b980;
          outline-offset: 3px;
        }
      </style>
      <section class="lab__frame">
        <p class="lab__eyebrow">Diagnostics / Browser laboratory</p>
        <h1>Defend Storybook Lab</h1>
        <p class="lab__intro">
          A separate modern browser workshop for deterministic gameplay, spatial audio,
          vector presentation, camera, and interaction experiments. Production remains
          on the historical application toolchain until migration is explicitly certified.
        </p>
        <div class="lab__visual" aria-hidden="true">
          <svg viewBox="-120 -120 240 240">
            <circle r="96" />
            <circle r="68" />
            <circle r="40" />
            <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" />
          </svg>
        </div>
        <ul class="capabilities" data-capabilities></ul>
        <div class="lab__actions">
          <button type="button" data-recheck data-check-count="0">Recheck capabilities</button>
        </div>
      </section>
    `;

    const list = root.querySelector<HTMLElement>("[data-capabilities]");
    const button = root.querySelector<HTMLButtonElement>("[data-recheck]");

    if (list) {
      renderCapabilityList(list);
    }

    button?.addEventListener("click", () => {
      if (list) {
        renderCapabilityList(list);
      }
      const checks = Number(button.dataset.checkCount || "0") + 1;
      button.dataset.checkCount = String(checks);
    });

    return root;
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrowserCapabilities: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Defend Storybook Lab" })
    ).toBeVisible();

    const recheck = canvas.getByRole("button", { name: "Recheck capabilities" });
    await userEvent.click(recheck);
    await expect(recheck).toHaveAttribute("data-check-count", "1");
  }
};
