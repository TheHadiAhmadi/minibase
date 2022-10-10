// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  interface Error {
    message: string;
    status: number;
  }
  // interface Platform {}
}

// local imports
const CodeEditor = await import("./components/CodeEditor.svelte")["default"];
const Menu = await import("./components/Menu.svelte")["default"];
const MenuItem = await import("./components/MenuItem.svelte")["default"];

declare const CodeEditor: typeof CodeEditor;
declare const Menu: typeof Menu;
declare const MenuItem: typeof MenuItem;
