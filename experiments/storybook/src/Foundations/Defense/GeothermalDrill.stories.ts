import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	findReachableGeothermalStream,
	type GeothermalStream
} from "@defend/gameplay/geothermalDrill";
import { createLabShell } from "../../labTheme";

type DrillArgs = {
	reach: number;
	streamOffsetX: number;
	streamDepth: number;
};

const meta = {
	title: "Foundations/Defense/Geothermal Drill",
	tags: ["test", "visual"],
	args: {
		reach: 24,
		streamOffsetX: 0,
		streamDepth: 10
	},
	argTypes: {
		reach: { control: { type: "range", min: 8, max: 48, step: 1 } },
		streamOffsetX: { control: { type: "range", min: -10, max: 36, step: 1 } },
		streamDepth: { control: { type: "range", min: 3, max: 24, step: 1 } }
	},
	render: (args: DrillArgs) => {
		const origin = { x: 0, y: 0, z: 0 };
		const stream: GeothermalStream = {
			id: "teal-vein-a",
			active: true,
			points: [
				{ x: 42 + args.streamOffsetX, y: -args.streamDepth, z: -12 },
				{ x: 10 + args.streamOffsetX, y: -args.streamDepth, z: -12 },
				{ x: 22 + args.streamOffsetX, y: -args.streamDepth - 3, z: 24 }
			]
		};
		const result = findReachableGeothermalStream(origin, [stream], args.reach);
		const scale = 3.1;
		const centerX = 210;
		const centerY = 155;
		const point = result.contactPoint;
		const streamPoints = stream.points
			.map(item => `${centerX + item.x * scale},${centerY + item.z * scale}`)
			.join(" ");
		const contactX = point === null ? centerX : centerX + point.x * scale;
		const contactY = point === null ? centerY : centerY + point.z * scale;

		const shell = createLabShell(
			"Foundations / defense",
			"Geothermal drill reach",
			"The drill searches the actual subsurface stream polyline. A distant stream endpoint does not make the whole vein unreachable when one segment passes close enough to the tower."
		);

		shell.frame.innerHTML = `
			<style>
				.drill-grid { display:grid; grid-template-columns:minmax(0,1fr) 270px; gap:16px; }
				.drill-map { width:100%; min-height:340px; }
				.drill-reach-circle { fill:rgba(73,215,209,.025); stroke:rgba(73,215,209,.25); stroke-dasharray:6 5; }
				.drill-stream-line { fill:none; stroke:#49d7d1; stroke-width:7; stroke-linecap:round; stroke-linejoin:round; opacity:.72; }
				.drill-tower-node { fill:#e4b980; }
				.drill-contact-node { fill:#f4edf7; stroke:#49d7d1; stroke-width:3; }
				.drill-label { fill:rgba(244,237,247,.52); font-size:11px; }
			</style>
			<div class="drill-grid">
				<section class="lab__panel lab__stage">
					<svg class="drill-map" viewBox="0 0 440 320" aria-label="Geothermal stream reach fixture">
						<circle class="drill-reach-circle" cx="${centerX}" cy="${centerY}" r="${args.reach * scale}" />
						<polyline class="drill-stream-line" points="${streamPoints}" />
						<circle class="drill-tower-node" cx="${centerX}" cy="${centerY}" r="7" />
						${point === null ? "" : `<line x1="${centerX}" y1="${centerY}" x2="${contactX}" y2="${contactY}" stroke="rgba(244,237,247,.35)" stroke-dasharray="4 4" /><circle class="drill-contact-node" cx="${contactX}" cy="${contactY}" r="5" />`}
						<text class="drill-label" x="18" y="28">top-down subsurface projection</text>
					</svg>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Search result</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>State</dt><dd data-connected="${result.connected}">${result.connected ? "CONNECTED" : "DRY"}</dd></div>
						<div class="lab__metric"><dt>Stream</dt><dd>${result.sourceId ?? "—"}</dd></div>
						<div class="lab__metric"><dt>Nearest distance</dt><dd data-distance="${result.distance ?? -1}">${result.distance === null ? "—" : result.distance.toFixed(2)}</dd></div>
						<div class="lab__metric"><dt>Reach</dt><dd data-reach="${args.reach}">${args.reach.toFixed(1)}</dd></div>
						<div class="lab__metric"><dt>Contact depth</dt><dd>${point === null ? "—" : Math.abs(point.y).toFixed(1)}</dd></div>
					</dl>
				</aside>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<DrillArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StreamSegmentReach: Story = {
	play: async ({ canvasElement }) => {
		const connected = canvasElement.querySelector<HTMLElement>("[data-connected]");
		const distance = canvasElement.querySelector<HTMLElement>("[data-distance]");
		const reach = canvasElement.querySelector<HTMLElement>("[data-reach]");
		await expect(connected).not.toBeNull();
		await expect(distance).not.toBeNull();
		await expect(reach).not.toBeNull();
		if (!connected || !distance || !reach) return;
		await expect(connected.dataset.connected).toBe("true");
		await expect(Number(distance.dataset.distance)).toBeLessThanOrEqual(Number(reach.dataset.reach));
	}
};
