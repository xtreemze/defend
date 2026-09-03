type RaiderTier = 1 | 2 | 3;

interface SectorTarget {
  x: number;
  z: number;
}

interface RaidSetPlan {
  r1: number;
  r2: number;
  r3: number;
  sector: SectorTarget | null;
}

interface NavigationDebugState {
  raidSector: { x: number; z: number };
  reserve: number;
}

interface NavigationDebugApi {
  state: NavigationDebugState;
}

const MAX_PER_TIER = 9;
const COMMITMENT_WEIGHT: Record<RaiderTier, number> = {
  1: 1,
  2: 4,
  3: 9,
};

const plans: RaidSetPlan[] = [
  { r1: 3, r2: 0, r3: 0, sector: null },
  { r1: 1, r2: 1, r3: 0, sector: null },
  { r1: 0, r2: 0, r3: 0, sector: null },
];

function navigationApi(): NavigationDebugApi | null {
  const scope = window as unknown as {
    __defendMothershipNavigation?: NavigationDebugApi;
  };
  return scope.__defendMothershipNavigation ?? null;
}

function copyCurrentSector(): SectorTarget | null {
  const api = navigationApi();
  if (!api) return null;
  return {
    x: api.state.raidSector.x,
    z: api.state.raidSector.z,
  };
}

function commitment(plan: RaidSetPlan): number {
  return (
    plan.r1 * COMMITMENT_WEIGHT[1] +
    plan.r2 * COMMITMENT_WEIGHT[2] +
    plan.r3 * COMMITMENT_WEIGHT[3]
  );
}

function isHold(plan: RaidSetPlan): boolean {
  return plan.r1 === 0 && plan.r2 === 0 && plan.r3 === 0;
}

function adjust(index: number, tier: RaiderTier, delta: number): void {
  const plan = plans[index];
  const key = tier === 1 ? "r1" : tier === 2 ? "r2" : "r3";
  plan[key] = Math.max(0, Math.min(MAX_PER_TIER, plan[key] + delta));
  render();
}

function setHold(index: number): void {
  plans[index].r1 = 0;
  plans[index].r2 = 0;
  plans[index].r3 = 0;
  render();
}

function useCurrentSector(index: number): void {
  plans[index].sector = copyCurrentSector();
  render();
}

function advanceQueue(): void {
  plans.shift();
  plans.push({ r1: 0, r2: 0, r3: 0, sector: null });
  render();
}

function compositionText(plan: RaidSetPlan): string {
  if (isHold(plan)) return "HOLD / NO RAID";
  const parts: string[] = [];
  if (plan.r1 > 0) parts.push(`R1×${plan.r1}`);
  if (plan.r2 > 0) parts.push(`R2×${plan.r2}`);
  if (plan.r3 > 0) parts.push(`R3×${plan.r3}`);
  return parts.join("  ");
}

function sectorText(plan: RaidSetPlan): string {
  if (!plan.sector) return "sector: current at launch / unset";
  return `sector: ${plan.sector.x.toFixed(1)}, ${plan.sector.z.toFixed(1)}`;
}

const style = document.createElement("style");
style.textContent = `
  #raid-plan-lab {
    position: fixed;
    right: 12px;
    bottom: 48px;
    z-index: 5;
    width: min(620px, calc(100vw - 24px));
    max-height: 52vh;
    overflow: auto;
    box-sizing: border-box;
    padding: 9px;
    border: 1px solid rgba(66, 216, 210, .32);
    background: rgba(8, 5, 13, .86);
    font-size: 11px;
    line-height: 1.35;
  }
  #raid-plan-lab header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
  }
  #raid-plan-lab h2 { margin: 0; font-size: 12px; font-weight: 600; }
  #raid-plan-lab .queue { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  #raid-plan-lab .slot { border: 1px solid rgba(214, 145, 76, .24); padding: 6px; background: rgba(18, 10, 27, .6); }
  #raid-plan-lab .slot.hold { border-style: dashed; opacity: .78; }
  #raid-plan-lab .slot-title { display: flex; justify-content: space-between; gap: 4px; margin-bottom: 4px; }
  #raid-plan-lab .composition { min-height: 16px; color: rgb(119, 223, 218); }
  #raid-plan-lab .sector { opacity: .72; margin: 3px 0 5px; }
  #raid-plan-lab .tier-row { display: grid; grid-template-columns: 24px 1fr 1fr 24px; gap: 3px; align-items: center; margin-top: 3px; }
  #raid-plan-lab button { padding: 3px 5px; font-size: 10px; }
  #raid-plan-lab .slot-actions { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 5px; }
  #raid-plan-lab .summary { margin-top: 7px; opacity: .84; }
  @media (max-width: 760px) {
    #raid-plan-lab { max-height: 44vh; }
    #raid-plan-lab .queue { grid-template-columns: 1fr; }
  }
`;
document.head.appendChild(style);

const panel = document.createElement("section");
panel.id = "raid-plan-lab";
panel.setAttribute("aria-label", "Three-set raid planning prototype");
document.body.appendChild(panel);

function tierControls(planIndex: number, tier: RaiderTier, value: number): string {
  return `
    <div class="tier-row">
      <span>R${tier}</span>
      <button type="button" data-action="minus" data-index="${planIndex}" data-tier="${tier}" aria-label="Remove one R${tier} from raid ${planIndex + 1}">−</button>
      <button type="button" data-action="plus" data-index="${planIndex}" data-tier="${tier}" aria-label="Add one R${tier} to raid ${planIndex + 1}">+</button>
      <strong>${value}</strong>
    </div>
  `;
}

function render(): void {
  const api = navigationApi();
  const currentSector = api
    ? `${api.state.raidSector.x.toFixed(1)}, ${api.state.raidSector.z.toFixed(1)}`
    : "navigation initializing";
  const totalCommitment = plans.reduce((sum, plan) => sum + commitment(plan), 0);

  panel.innerHTML = `
    <header>
      <div>
        <h2>Upcoming three raid sets</h2>
        <div>current selected sector: ${currentSector}</div>
      </div>
      <button type="button" data-action="advance">Advance queue [Q]</button>
    </header>
    <div class="queue">
      ${plans
        .map(
          (plan, index) => `
            <article class="slot ${isHold(plan) ? "hold" : ""}">
              <div class="slot-title"><strong>Set ${index + 1}</strong><span>weight ${commitment(plan)}</span></div>
              <div class="composition">${compositionText(plan)}</div>
              <div class="sector">${sectorText(plan)}</div>
              ${tierControls(index, 1, plan.r1)}
              ${tierControls(index, 2, plan.r2)}
              ${tierControls(index, 3, plan.r3)}
              <div class="slot-actions">
                <button type="button" data-action="sector" data-index="${index}">Use current sector</button>
                <button type="button" data-action="hold" data-index="${index}">Hold / clear</button>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="summary">
      total queued commitment weight: ${totalCommitment}. R1/R2/R3 lab weights use 1/4/9 only to visualize relative commitment; they are not production launch costs. Empty sets intentionally mean no raid while mothership hover drain continues in the navigation simulation.
    </div>
  `;
}

panel.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const action = target.dataset.action;
  if (action === "advance") {
    advanceQueue();
    return;
  }
  const index = Number(target.dataset.index);
  if (!Number.isInteger(index) || index < 0 || index >= plans.length) return;
  if (action === "hold") setHold(index);
  if (action === "sector") useCurrentSector(index);
  if (action === "plus" || action === "minus") {
    const tier = Number(target.dataset.tier) as RaiderTier;
    if (tier === 1 || tier === 2 || tier === 3) {
      adjust(index, tier, action === "plus" ? 1 : -1);
    }
  }
});

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === "q") advanceQueue();
};
window.addEventListener("keydown", onKeyDown);

let refreshFrame = 0;
function refreshCurrentSector(): void {
  refreshFrame += 1;
  if (refreshFrame % 20 === 0) render();
  requestAnimationFrame(refreshCurrentSector);
}

render();
requestAnimationFrame(refreshCurrentSector);

(window as unknown as { __defendRaidPlanPrototype?: unknown }).__defendRaidPlanPrototype = {
  plans,
  advanceQueue,
  useCurrentSector,
};
