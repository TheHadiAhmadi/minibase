import { errorBadRequest, errorNotAuthorized } from './errors';

export default class FileService {
	db;
	apiKey: string;
	limit: number;
	constructor(db, apiKey?) {
		this.db = db;
		this.apiKey = apiKey ?? '';
		this.limit = 2048 * 1024;
	}

	async getContent(rs: ReadableStream) {
		const reader = rs.getReader();
		const chunks = [];

		const pump = () => {
			return reader.read().then(({ value, done }) => {
				if (done) {
					console.log("serializing ", {chunks})
					const result = this.db.serialize(chunks);
					console.log("after serialize ", {result})
					return result
				}
				chunks.push(value);
				return pump();
			});
		};
		return pump();
	}

	async upload({ file, name, id, appName }) {
		const size = file.size;

		if (size > this.limit) throw errorBadRequest('file size should be smallter than 2MB');

		// check apiKey
		const keys = await this.db.get('keys', { appName, apiKey: this.apiKey });
		if (keys.length < 1)
			throw errorNotAuthorized("your apiKey doesn't have access to upload file here");

		// const content = await file.stream(0, size);
		let content = await this.getContent(file.stream());

		await this.db.insert('files', { name: name ?? file.name, id, appName, content, size });
		return id;
	}

	async getInfo(id) {
		const files = await this.db.get('files', { id: id });
		return {
			id: files[0].id,
			appName: files[0].appName,
			name: files[0].name,
			size: files[0].size
		};
	}

	async download(id) {
		console.log(await this.db.get('files'))
		const files = await this.db.get('files', { id: id });

		const result = this.db.deserialize(files[0].content);
		return new Uint8Array(result);
	}
}
