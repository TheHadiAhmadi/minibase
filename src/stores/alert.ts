import { writable } from "svelte/store";

type AlertMessage = {
  id: string;
  type: "error" | "warning" | "info" | "success";
  message: string;
};

function createAlert() {
  const { set, update, subscribe } = writable<AlertMessage[]>([]);

  function show(type: AlertMessage["type"], message: AlertMessage["message"]) {
    const id = crypto.randomUUID();
    update((alerts) => [...alerts, { id, type, message }]);
    setTimeout(() => {
      update((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 5000);
  }

  function showError(message: string) {
    show("error", message);
  }
  function showWarning(message: string) {
    show("warning", message);
  }
  function showInfo(message: string) {
    show("info", message);
  }
  function showSuccess(message: string) {
    show("success", message);
  }

  return {
    subscribe,
    showError,
    showWarning,
    showSuccess,
    showInfo,
  };
}
export const alertMessage = createAlert();
