export function api(url, app, table, token = '') {
	return {
		post(data) {
			return fetch(`${url}/api/${app}/${table}/${resource}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(data)
			}).then((res) => res.json());
		},
		get(id) {
			let finalUrl = `${url}/api/${app}/${table}`;
			if (id) {
				finalUrl = finalUrl + '/${id}';
			}
			return fetch(finalUrl, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}).then((res) => res.json());
		}
	};
}

function createTable(tableName) {
	const todoApi = api('http://localhost:3000', 'todo-app', tableName);

	function get(id) {
		return todoApi.get(id);
	}

	function post(data) {
		return todoApi.post(data);
	}

	function update() {}

	function del() {}

	return {
		get,
		post,
		update,
		del
	};
}

export const Todos = createTable('todos');
