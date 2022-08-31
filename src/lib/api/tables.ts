import { baseUrl } from "$lib/helpers"

export async function apiAddTable(appName, table) {
    console.log("addTable", appName, table)

    const result = await fetch(baseUrl(appName) + '/index.json', {
        method: 'POST', 
        body: JSON.stringify(table)
    }).then(res => res.json())

    console.log('result: ', result)

    return result;
    ;
}

export async function apiRemoveTable(appName, table) {
    const result = await fetch(baseUrl(appName) + '/' + table + '.json', {
        method: 'DELETE'
    }).then(res => res.json())

    return result
}