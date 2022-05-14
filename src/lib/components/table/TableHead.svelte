<script>
import { setContext } from "svelte";


    setContext('table-head', true)
</script>
<thead>
    <tr>
        <slot/>
    </tr>
</thead>