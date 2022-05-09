<script context="module">
    export async function load({params, fetch}) {
        const response = await fetch(`/${params.app}.json`).then(res => res.json())

        if(response.status === 200) {
            return {
                stuff: {
                    apiKey: response.apiKeys?.[0]?.apiKey,
                    tables: response.tables
                }
            }
        } 
        return {

        }
    }

</script>
<slot/>