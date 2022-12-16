<script lang="ts">
  import type { CodeJar } from "codejar";
  import { onMount } from "svelte";
  import hljs from "highlightjs";
  // import Prism from "prismjs";

  // import "prismjs/themes/prism-coy.min.css";
  import { onDestroy } from "svelte";

  let instance: CodeJar;
  let el: HTMLDivElement;

  export let code: string;

  export function updateCode(code: string) {
    instance?.updateCode(code);
  }

  onMount(() => {
    import("codejar").then(({ CodeJar }) => {
      import("codejar/linenumbers").then(({ withLineNumbers }) => {
        //  withLineNumbers(hljs.highlight)
        instance = CodeJar(el, withLineNumbers(hljs.default.highlight), {
          window,
          tab: "\t",
        });
        instance.updateCode(code);

        instance.onUpdate((c) => {
          code = c;
        });
      });
    });
  });

  onDestroy(() => {
    instance?.destroy();
  });
</script>

<div class="editor w-full language-javascript" bind:this={el} />

<style global>
  .editor {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
  }

  .codejar-wrap {
    width: 100%;
    height: 100%;
    /* background-color: #303030; */
    /* color: white; */
  }

  /* .codejar-linenumbers {
      color: white !important;
    } */
</style>
