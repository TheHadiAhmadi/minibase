export async function post({params}) {
    
    const app = params.app
    return {
        body: 'login for ' + app
    }
}