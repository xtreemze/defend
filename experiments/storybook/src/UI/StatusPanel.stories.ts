import type { Meta, StoryObj } from "@storybook/web-components-vite";
import {
  DefendStatusPanel,
  type DefendOperationalState,
  type DefendStatusViewModel
} from "@defend/ui";
import "@defend/ui/webawesome";
import { expect, userEvent, within } from "storybook/test";

type StatusArgs = {
  energy: number;
  energyCapacity: number;
  activeThreats: number;
  state: DefendOperationalState;
};

function toViewModel(args: StatusArgs, pressured: boolean): DefendStatusViewModel {
  return {
    energy: pressured ? Math.min(args.energy, args.energyCapacity * 0.24) : args.energy,
    energyCapacity: args.energyCapacity,
    activeThreats: pressured ? Math.max(args.activeThreats, 14) : args.activeThreats,
    state: pressured ? "critical" : args.state,
    headline: pressured ? "Stronghold under pressure" : "Stronghold status",
    detail: pressured
      ? "This is presentation-only state. The real value must come from an authoritative simulation snapshot."
      : "Lit renders a typed view model without owning simulation state."
  };
}

const meta = {
  title: "UI/Status Panel",
  tags: ["test", "visual"],
  args: {
    energy: 22600,
    energyCapacity: 30000,
    activeThreats: 5,
    state: "stable"
  },
  argTypes: {
    energy: { control: { type: "range", min: 0, max: 30000, step: 100 } },
    energyCapacity: { control: { type: "range", min: 1000, max: 50000, step: 1000 } },
    activeThreats: { control: { type: "range", min: 0, max: 64, step: 1 } },
    state: { control: "select", options: ["stable", "strained", "critical"] }
  },
  render: (args: StatusArgs) => {
    const root = document.createElement("main");
    root.innerHTML = `
      <style>
        .ui-witness {
          min-height: 100vh;
          box-sizing: border-box;
          display: grid;
          place-items: center;
          gap: 16px;
          padding: clamp(24px, 6vw, 72px);
          color: #f4edf7;
          background:
            radial-gradient(circle at 50% 35%, rgba(173, 97, 26, 0.14), transparent 30%),
            #1c0530;
          font-family: system-ui, sans-serif;
        }
        .ui-witness__frame {
          width: min(520px, 100%);
          display: grid;
          gap: 14px;
        }
        .ui-witness__note {
          margin: 0;
          color: rgba(244, 237, 247, 0.62);
          font-size: 13px;
        }
      </style>
      <section class="ui-witness">
        <div class="ui-witness__frame">
          <defend-status-panel></defend-status-panel>
          <wa-button type="button" data-pressure="false">Simulate presentation pressure</wa-button>
          <p class="ui-witness__note">
            The button is a cherry-picked Web Awesome application control. The status surface is a Defend-owned Lit component.
          </p>
        </div>
      </section>
    `;

    const panel = root.querySelector<DefendStatusPanel>("defend-status-panel");
    const button = root.querySelector<HTMLElement>("wa-button");
    let pressured = false;

    if (!panel || !button) {
      throw new Error("Defend UI witness failed to create required custom elements");
    }

    const update = (): void => {
      panel.model = toViewModel(args, pressured);
      button.dataset.pressure = String(pressured);
      button.textContent = pressured ? "Restore snapshot" : "Simulate presentation pressure";
    };

    button.addEventListener("click", () => {
      pressured = !pressured;
      update();
    });

    update();
    return root;
  }
} satisfies Meta<StatusArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypedSnapshotBoundary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Stronghold status" })).toBeVisible();
    await expect(canvas.getByText("22,600 / 30,000")).toBeVisible();
    const button = canvas.getByRole("button", { name: "Simulate presentation pressure" });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("data-pressure", "true");
    await expect(canvas.getByRole("heading", { name: "Stronghold under pressure" })).toBeVisible();
  }
};
