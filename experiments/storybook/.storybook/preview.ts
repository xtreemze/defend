import type { Preview } from "@storybook/web-components-vite";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true
    },
    options: {
      storySort: {
        order: ["Diagnostics", "UI", "Foundations", "Audio", "Arena", "Gameplay"]
      }
    }
  }
};

export default preview;
