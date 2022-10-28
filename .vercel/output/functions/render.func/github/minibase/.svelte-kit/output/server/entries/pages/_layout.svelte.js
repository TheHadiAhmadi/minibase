import { c as create_ssr_component, b as subscribe, e as each, v as validate_component, d as escape } from "../../chunks/index.js";
import { A as Alert } from "../../chunks/Alert.js";
import "../../chunks/compiler.js";
import "ssr-window";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
import { a as alertMessage } from "../../chunks/alert2.js";
const styles = "";
const windi = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".font-roboto.svelte-hkn6bj{font-family:Roboto, sans-serif}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $alertMessage, $$unsubscribe_alertMessage;
  $$unsubscribe_alertMessage = subscribe(alertMessage, (value) => $alertMessage = value);
  $$result.css.add(css);
  $$unsubscribe_alertMessage();
  return `<div class="${"h-full font-roboto svelte-hkn6bj"}">${slots.default ? slots.default({}) : ``}</div>

<div class="${"absolute z-2 bottom-4 right-4 left-4 min-w-300px sm:right-auto alert-container"}">${each($alertMessage, (alert) => {
    let color = alert.type === "error" ? "danger" : alert.type;
    return `
    ${validate_component(Alert, "Alert").$$render($$result, { color }, {}, {
      default: () => {
        return `${escape(alert.message)}
    `;
      }
    })}`;
  })}
</div>`;
});
export {
  Layout as default
};
