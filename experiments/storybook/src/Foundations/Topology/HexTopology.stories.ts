import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent } from "storybook/test";
import {
  hexKey,
  hexRing,
  hexSector,
  hexToWorld,
  isHexProtected,
  isHexWithinRadius,
  type HexCell
} from "@defend/gameplay/hexGrid";
import { createLabShell } from "../../labTheme";

type HexArgs = {
  radius: number;
  protectedRadius: number;
  size: number;
  showSectors: boolean;
};

function cellsWithin(radius: number): HexCell[] {
  const cells: HexCell[] = [];
  for (let q = -radius; q <= radius; q += 1) {
    for (let r = -radius; r <= radius; r += 1) {
      const cell = { q, r };
      if (isHexWithinRadius(cell, radius)) {
        cells.push(cell);
      }
    }
  }
  return cells;
}

function polygonPoints(size: number): string {
  const points: string[] = [];
  for (let index = 0; index < 6; index += 1) {
    const angle = ((-90 + index * 60) * Math.PI) / 180;
    points.push(`${Math.cos(angle) * size},${Math.sin(angle) * size}`);
  }
  return points.join(" ");
}

function cellMarkup(cell: HexCell, args: HexArgs): string {
  const world = hexToWorld(cell, args.size);
  const key = hexKey(cell);
  const ring = hexRing(cell);
  const sector = hexSector(cell, args.size);
  const protectedCell = isHexProtected(cell, args.protectedRadius);
  const sectorClass = args.showSectors && sector >= 0 ? ` hex--sector-${sector}` : "";
  const protectedClass = protectedCell ? " hex--protected" : "";

  return `
    <g
      class="hex${sectorClass}${protectedClass}"
      transform="translate(${world.x} ${world.z})"
      role="button"
      tabindex="0"
      data-cell="${key}"
      data-ring="${ring}"
      data-sector="${sector}"
      aria-label="Hex ${key}, ring ${ring}, sector ${sector}"
    >
      <polygon points="${polygonPoints(args.size * 0.92)}" />
      ${ring <= 1 ? `<text y="2">${key}</text>` : ""}
    </g>
  `;
}

const meta = {
  title: "Foundations/Topology/Hex Grid",
  tags: ["test", "visual"],
  args: {
    radius: 5,
    protectedRadius: 1,
    size: 18,
    showSectors: true
  },
  argTypes: {
    radius: { control: { type: "range", min: 2, max: 9, step: 1 } },
    protectedRadius: { control: { type: "range", min: 0, max: 3, step: 1 } },
    size: { control: { type: "range", min: 10, max: 28, step: 1 } },
    showSectors: { control: "boolean" }
  },
  render: (args: HexArgs) => {
    const safeRadius = Math.max(1, Math.floor(args.radius));
    const cells = cellsWithin(safeRadius);
    const shell = createLabShell(
      "Foundations / topology",
      "Hex topology playground",
      "The strategic lattice is discrete while physics remains continuous. Select cells to inspect canonical keys, rings, protected-core membership, and deterministic six-sector classification."
    );

    shell.frame.innerHTML = `
      <style>
        .hex polygon {
          fill: rgba(215, 164, 108, 0.025);
          stroke: rgba(215, 164, 108, 0.28);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
          transition: fill 120ms ease, stroke 120ms ease;
        }
        .hex:hover polygon, .hex:focus polygon { fill: rgba(215, 164, 108, 0.12); stroke: #e4b980; }
        .hex--protected polygon { fill: rgba(173, 97, 26, 0.2); stroke: rgba(228, 185, 128, 0.72); }
        .hex--sector-1 polygon, .hex--sector-4 polygon { stroke-opacity: 0.72; }
        .hex--sector-2 polygon, .hex--sector-5 polygon { stroke-dasharray: 2 2; }
        .hex text { fill: rgba(244, 237, 247, 0.6); font-size: 4px; text-anchor: middle; pointer-events: none; }
        .hex--selected polygon { fill: rgba(228, 185, 128, 0.2); stroke: #f4edf7; stroke-width: 2; }
        .hex-stage { background: radial-gradient(circle at center, rgba(173, 97, 26, 0.08), transparent 42%); }
      </style>
      <div class="lab__grid">
        <section class="lab__panel lab__stage hex-stage">
          <svg viewBox="-190 -170 380 340" aria-label="Interactive hex topology" data-hex-grid>
            ${cells.map(cell => cellMarkup(cell, { ...args, radius: safeRadius })).join("")}
          </svg>
        </section>
        <aside class="lab__panel lab__panel--padded">
          <h2 class="lab__section-title">Topology state</h2>
          <dl class="lab__metrics">
            <div class="lab__metric"><dt>Cells</dt><dd>${cells.length}</dd></div>
            <div class="lab__metric"><dt>Arena radius</dt><dd>${safeRadius}</dd></div>
            <div class="lab__metric"><dt>Protected radius</dt><dd>${Math.max(0, Math.floor(args.protectedRadius))}</dd></div>
            <div class="lab__metric"><dt>Orientation</dt><dd>pointy</dd></div>
          </dl>
          <h2 class="lab__section-title" style="margin-top:18px">Selected cell</h2>
          <dl class="lab__metrics" data-selection>
            <div class="lab__metric"><dt>Key</dt><dd data-selected-key>0,0</dd></div>
            <div class="lab__metric"><dt>Ring</dt><dd data-selected-ring>0</dd></div>
            <div class="lab__metric"><dt>Sector</dt><dd data-selected-sector>-1</dd></div>
          </dl>
        </aside>
      </div>
    `;

    const selectionKey = shell.root.querySelector<HTMLElement>("[data-selected-key]");
    const selectionRing = shell.root.querySelector<HTMLElement>("[data-selected-ring]");
    const selectionSector = shell.root.querySelector<HTMLElement>("[data-selected-sector]");
    const hexes = Array.from(shell.root.querySelectorAll<SVGGElement>("[data-cell]"));

    const selectHex = (hex: SVGGElement): void => {
      hexes.forEach(candidate => candidate.classList.remove("hex--selected"));
      hex.classList.add("hex--selected");
      if (selectionKey) selectionKey.textContent = hex.dataset.cell || "";
      if (selectionRing) selectionRing.textContent = hex.dataset.ring || "";
      if (selectionSector) selectionSector.textContent = hex.dataset.sector || "";
    };

    hexes.forEach(hex => {
      hex.addEventListener("click", () => selectHex(hex));
      hex.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectHex(hex);
        }
      });
    });

    const center = shell.root.querySelector<SVGGElement>("[data-cell='0,0']");
    if (center) selectHex(center);

    return shell.root;
  }
} satisfies Meta<HexArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveTopology: Story = {
  play: async ({ canvasElement }) => {
    const east = canvasElement.querySelector<SVGGElement>("[data-cell='1,0']");
    const selected = canvasElement.querySelector<HTMLElement>("[data-selected-key]");
    await expect(east).not.toBeNull();
    await expect(selected).not.toBeNull();
    if (!east || !selected) return;
    await userEvent.click(east);
    await expect(selected).toHaveTextContent("1,0");
    await expect(east).toHaveAttribute("data-sector", "0");
  }
};
