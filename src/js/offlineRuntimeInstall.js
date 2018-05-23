import * as OfflinePluginRuntime from "offline-plugin/runtime";

OfflinePluginRuntime.install({
  onInstalled() {},

  onUpdating() {},

  onUpdateReady() {
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated() {
    window.location.reload();
  }
});
