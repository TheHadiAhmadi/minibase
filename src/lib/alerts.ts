import { alerts } from './stores';

export function showError(message) {
	showAlert(message, 'error');
}
export function showInfo(message) {
	showAlert(message, 'info');
}
export function showWarning(message) {
	showAlert(message, 'warning');
}
export function showSuccess(message) {
	showAlert(message, 'success');
}

export function showAlert(message, type = 'warning') {
	alerts.update((value) => [
		...value,
		{
			text: message ?? 'Something went wrong!',
			type
		}
	]);
}

export function closeAlerts() {
	alerts.set([]);
}
