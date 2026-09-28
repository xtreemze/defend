// Conventional application controls only. Keep these imports explicit so Defend
// does not accidentally register or ship the entire component catalog.
import "@awesome.me/webawesome/dist/styles/webawesome.css";
import "@awesome.me/webawesome/dist/components/button/button.js";

export const DEFEND_CONVENTIONAL_CONTROL_TAGS = ["wa-button"] as const;
