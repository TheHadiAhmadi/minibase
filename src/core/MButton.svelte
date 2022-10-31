<script lang="ts">
  export let color:
    | "base"
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "info"
    | "warning" = "base";

  $: className = ["button", "button-color-" + color].join(" ");
</script>

<button class={className}>
  <slot />
</button>

<style>
  :root {
    --light-100: #ddeeee;
    --light-110: #d6eaea;
    --light-120: #c9e4e4;
    --light-90: #f1f8f8;
    --light-80: #ffffff;
    --light-10: #303030;
    --light-text: var(--dark-100);

    --dark-100: #333333;
    --dark-110: #292929;
    --dark-120: #1f1f1f;
    --dark-90: #3d3d3d;
    --dark-80: #474747;
    --dark-70: #525252;
    --dark-60: #5c5c5c;
    --dark-50: #666666;
    --dark-40: #707070;
    --dark-10: #f5f5f5;
    --dark-text: var(--light-100);

    --base-100: var(--light-100);
    --base-110: var(--light-110);
    --base-120: var(--light-120);
    --base-90: var(--light-90);
    --base-80: var(--light-80);

    --base-10: var(--light-10);
    --base-text: var(--dark-100);

    --primary-100: #307fb0;
    --primary-110: #2c74a0;
    --primary-120: #276890;
    --primary-90: #3f95ca;
    --primary-80: #4f9cbf;
    --primary-10: #e6ebef;
    --primary-text: var(--light-100);

    --secondary-100: #445566;
    --secondary-110: #405263;
    --secondary-120: #384856;
    --secondary-90: #516776;
    --secondary-80: #597188;
    --secondary-10: #dae1e7;
    --secondary-text: var(--light-100);
  }

  .button {
    display: inline-flex;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .button:active {
    transform: scale(0.975);
  }

  .button-color-base {
    background-color: var(--base-100);
    border: 1px solid var(--base-120);
    color: var(--base-text);
  }
  .button-color-base:hover {
    background-color: var(--base-110);
  }
  .button-color-base:active {
    background-color: var(--base-120);
  }

  .button-color-primary {
    background-color: var(--primary-100);
    border: 1px solid var(--primary-110);
    color: var(--primary-text);
  }

  .button-color-primary:hover {
    background-color: var(--primary-90);
  }
  .button-color-primary:active {
    background-color: var(--primary-80);
  }
  .button-color-secondary {
    background-color: var(--secondary-100);
    border: 1px solid var(--secondary-110);
    color: var(--secondary-text);
  }
  .button-color-secondary:hover {
    background-color: var(--secondary-90);
  }
  .button-color-secondary:active {
    background-color: var(--secondary-80);
  }
</style>
