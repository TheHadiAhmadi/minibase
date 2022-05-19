// import fs from 'fs/promises';
import _data from './data.json';

export default {
	db: {
		async get(collection, filter = {}) {
			return await Promise.all(
				_data[collection]?.filter((data) => {
					let shouldReturnData = true;
					Object.keys(filter).map((key) => {
						if (filter[key] !== data[key]) shouldReturnData = false;
					});
					return shouldReturnData;
				}) ?? []
			);
		},
		insert: (collection, data) => {
			// console.log('DEV, insert', collection, data);
			_data[collection].push(data);
			return true;
		},
		async update(collection, filter, data) {
			// console.log('DEV, update', collection, filter, data);
			_data[collection] = _data[collection].map((single_data) => {
				let shouldUpdate = true;
				Object.keys(filter).map((key) => {
					if (single_data[key] !== filter[key]) shouldUpdate = false;
				});
				if (shouldUpdate) {
					// replace the data with parameter
					return {
						...single_data,
						...data
					};
				}
				// return existing data
				return single_data;
			});
			// console.log('*', _data[collection]);
			return true;
		},
		remove: (collection, filter) => {
			// console.log('DEV, remove', collection, filter);
			_data[collection] = _data[collection].filter((data) => {
				let shouldDelete = true;
				Object.keys(filter).map((key) => {
					if (data[key] !== filter[key]) shouldDelete = false;
				});
				return !shouldDelete;
			});
			return true;
		},
		serialize: (array) => {
			return array.join(',');
		},
		deserialize: (data) => {
			return data.split(',').map(Number);
		},
		deserializeStream: (data) => {
			// return ReadableStream(data.split('-'))
			console.log('TODO: implement desesrializeStream');
		}
	},
	secret: import.meta.env.VITE_ACCESS_TOKEN_SECRET
};
