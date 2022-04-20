
export function createError(status = 500, message = 'Internal Server Error') {
	return {
		status,
		message: message
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

export function errorBadRequest(message = 'Invalid Request') {
	return createError(400, message);
}

export function errorNotFound(message = 'Not found') {
	return createError(404, message);
}

export function errorNotAuthorized(message = 'You are not authorized') {
	return createError(401, message);
}

export function errorResourceExists(message = 'Resource already exists, choose another name') {
	return createError(409, message);
}

export function errorNotImplemented(message = 'This functionality is not implemented Yet!') {
	return createError(600, message);
}

export function errorJWT(err = {name: '', message: 'JWT Error'}) {
	if (err.name === 'TokenExpiredError') {
		return errorNotAuthorized('Token is expired, please login again');
	}
	return errorNotAuthorized(err.message);
}
