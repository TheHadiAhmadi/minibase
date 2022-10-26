<script lang="ts">
  import type { ProjectInfo } from "$types";

  export let project: ProjectInfo;

  $: functions = (project.functions ?? [])
    .map((fn) => {
      return `        ${fn.name}: (data) => run("${fn.name}", data)`;
    })
    .join(",\n");

  $: text = `/* DO NOT EDIT MANUALLY, GET IT FROM MINIBASE DASHBOARD */  
  const minibase = (appName) => {
    let token = "";

    async function run(functionName, data = {}) {
        const baseUrl = "https://" + appName + ".theminibase.com/";
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "bearer " + token,
            },
            body: JSON.stringify(data),
        };

        const res = await fetch(baseUrl + functionName, opts);
        const result = await res.json();

        if (result.error) throw new Error(result.error);

        return result.data;
    }

    return {
        setToken(value) {
            token = value;
        },
        getToken() {
            return token;
        },
${functions}
    };
};

export default minibase("${project.name}");
`;

  let copied = false;
  function onCopy() {
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => (copied = false), 3000);
  }
</script>

<pre class="relative">
    <button
    on:click={onCopy}
    class="absolute border border-gray-300 w-12 h-12 top-2 right-2 flex items-center justify-center">
        {#if !copied}
      <Icon pack="bi" name="clipboard" />
    {:else}
      <Icon pack="bi" name="clipboard-check" />
    {/if}
    </button>
    {text}</pre>
