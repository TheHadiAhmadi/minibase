import { w as writable } from "./index3.js";
function createAlert() {
  const { set, update, subscribe } = writable([]);
  function show(type, message) {
    const id = crypto.randomUUID();
    update((alerts) => [...alerts, { id, type, message }]);
    setTimeout(() => {
      update((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 5e3);
  }
  function showError(message) {
    show("error", message);
  }
  function showWarning(message) {
    show("warning", message);
  }
  function showInfo(message) {
    show("info", message);
  }
  function showSuccess(message) {
    show("success", message);
  }
  return {
    subscribe,
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
}
const alertMessage = createAlert();
export {
  alertMessage as a
};
