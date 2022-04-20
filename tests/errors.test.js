import {
	createError,
	errorResponse,
	errorNotFound,
	errorNotImplemented,
	errorResourceExists,
	errorBadRequest,
	errorJWT
} from '$lib/services/errors';

import { expect, it } from 'vitest';
describe('error object builder', () => {
	it('should create error object', () => {
		const errorObject = createError();

		expect(errorObject).toMatchObject({
			status: 500,
			message: 'Internal Server Error'
		});
	});

	it('should create NotFound error', () => {
		let errorObject = errorNotFound();
		expect(errorObject).toMatchObject({
			status: 404,
			message: 'Not found'
		});

		errorObject = errorNotFound('user not found');
		expect(errorObject).toMatchObject({
			status: 404,
			message: 'user not found'
		});
	});

	it('should create Bad Request error', () => {
		let errorObject = errorBadRequest();
		expect(errorObject).toMatchObject({
			status: 400,
			message: 'Invalid Request'
		});

		errorObject = errorBadRequest('request is invalid');
		expect(errorObject).toMatchObject({
			status: 400,
			message: 'request is invalid'
		});
	});

	it('should create Conflict error', () => {
		let errorObject = errorResourceExists('resource exists');

		expect(errorObject).toMatchObject({
			status: 409,
			message: 'resource exists'
		});
	});

	it('should create Not implemented error', () => {
		let errorObject = errorNotImplemented('not implemented');
		expect(errorObject).toMatchObject({
			status: 600,
			message: 'not implemented'
		});
	});

	it('should create JWT error', () => {
		let errorObject = errorJWT({
			name: 'TokenExpiredError',
			message: 'Token is expired'
		});

		expect(errorObject).toMatchObject({
			status: 401,
			message: 'Token is expired, please login again'
		});

		errorObject = errorJWT();
		expect(errorObject).toMatchObject({
			status: 401,
			message: 'JWT Error'
		});
	});

	it('should create response object', () => {
		const object = errorNotFound();
		const response = errorResponse(object);
		expect(response).toMatchObject({
			status: 404,
			body: {
				status: 404,
				message: 'Not found'
			}
		});
	});
});
