<script lang="ts">
  export let value: string;
  let copied = false;
</script>

<div
  on:click={() => {
    navigator.clipboard.writeText(value);
    copied = true;
  }}
>
  <Alert>
    <div class="alert-title">
      {#if copied}
        Copied To Clipboard!
      {:else}
        Copy this ApiKey
      {/if}
    </div>
    <p class="break-all">{value}</p>
  </Alert>
</div>
