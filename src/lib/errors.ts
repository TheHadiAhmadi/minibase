import { alert } from './stores';

function createError(status, message, initialMessage) {
	return {
		status: status ?? 500,
		message: message ?? initialMessage ?? 'Internal Server Error'
	};
}

export function errorResponse(error) {
	return {
		status: error.status,
		body: {
			status: error.status,
			message: error.message
		}
	};
}

export function errorBadRequest(message = null) {
	return createError(400, message, 'Invalid Request');
}

export function errorNotFound(message = null) {
	return createError(404, message, 'Not found');
}

export function errorNotAuthorized(message = null) {
	return createError(401, message, 'You are not authorized');
}

export function errorResourceExists(message = null) {
	return createError(409, message, 'Resource already exists, choose another name');
}

export function errorNotImplemented(message = null) {
	return createError(600, message, 'This functionality is not implemented Yet!س');
}

export function errorJWT(err) {
	if (err.name === 'TokenExpiredError') {
		return createError(401, 'Token is expired, please login again', null);
	}
	return createError(401, err.message, 'JWT error');
}

export function showAlert(message, variant = 'error') {
	alert.set({
		text: message ?? 'Something went wrong!',
		variant,
		open: true
	});
}
