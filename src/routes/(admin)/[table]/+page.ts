import {errorResponse} from '$lib/services/errors'
import {getAppName} from '$lib/helpers'


export async function load({parent}) {
    const data = await parent()

    const appName = data.appName


    return data
}
