
import runtime = require("offline-plugin/runtime");
runtime.install({
  onUpdating: () => {},
  onUpdateReady: () => {
    runtime.applyUpdate();
  },
  onUpdated: () => {
    window.location.reload();
  },
  onUpdateFailed: () => {}
});