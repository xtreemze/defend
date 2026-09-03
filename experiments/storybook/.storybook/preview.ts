import type { Preview } from "@storybook/html-vite";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true
    },
    options: {
      storySort: {
        order: ["Diagnostics", "Foundations", "Audio", "Arena", "Gameplay"]
      }
    }
  }
};

export default preview;
