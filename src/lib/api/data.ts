import { baseUrl } from "$lib/helpers";

export async function apiInsertData(appName, tableName, data) {
    const result = await fetch(baseUrl(appName) + '/' + tableName + '.json', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(res => res.json())
    return result
}