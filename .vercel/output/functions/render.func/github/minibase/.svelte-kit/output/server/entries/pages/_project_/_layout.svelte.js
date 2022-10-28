import { c as create_ssr_component, b as subscribe, v as validate_component } from "../../../chunks/index.js";
import { B as Button } from "../../../chunks/Button.js";
import "../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../chunks/DialogBody.js";
import { D as DialogFooter } from "../../../chunks/DialogFooter.js";
import { F as FormInput } from "../../../chunks/Input.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
import { w as writable } from "../../../chunks/index3.js";
import { p as page } from "../../../chunks/stores.js";
function svelteMedia(t) {
  return writable({ classNames: "" }, (e) => {
    if ("undefined" == typeof window)
      return;
    let n = {}, r = () => e(function(e2) {
      let t2 = { classNames: "" }, n2 = [];
      for (let r2 in e2)
        t2[r2] = e2[r2].matches, t2[r2] && n2.push("media-" + r2);
      return t2.classNames = n2.join(" "), t2;
    }(n));
    for (let e2 in t) {
      let i = window.matchMedia(t[e2]);
      n[e2] = i, n[e2].addListener(r);
    }
    return r(), () => {
      for (let e2 in n)
        n[e2].removeListener(r);
    };
  });
}
const media = svelteMedia({
  "sm": "(max-width: 640px)",
  "md": "(max-width: 768px)",
  "lg": "(max-width: 920px)"
});
const Loading_svelte_svelte_type_style_lang = "";
const css = {
  code: ".sk-cube-grid.svelte-1l7numc.svelte-1l7numc{width:80px;height:80px;margin:30px auto}.sk-cube-grid.svelte-1l7numc .sk-cube.svelte-1l7numc{width:33%;height:33%;background-color:#368;float:left;-webkit-animation:svelte-1l7numc-sk-cubeGridScaleDelay 1.3s infinite ease-in-out;animation:svelte-1l7numc-sk-cubeGridScaleDelay 1.3s infinite ease-in-out}.sk-cube-grid.svelte-1l7numc .sk-cube1.svelte-1l7numc{-webkit-animation-delay:0.2s;animation-delay:0.2s}.sk-cube-grid.svelte-1l7numc .sk-cube2.svelte-1l7numc{-webkit-animation-delay:0.3s;animation-delay:0.3s}.sk-cube-grid.svelte-1l7numc .sk-cube3.svelte-1l7numc{-webkit-animation-delay:0.4s;animation-delay:0.4s}.sk-cube-grid.svelte-1l7numc .sk-cube4.svelte-1l7numc{-webkit-animation-delay:0.1s;animation-delay:0.1s}.sk-cube-grid.svelte-1l7numc .sk-cube5.svelte-1l7numc{-webkit-animation-delay:0.2s;animation-delay:0.2s}.sk-cube-grid.svelte-1l7numc .sk-cube6.svelte-1l7numc{-webkit-animation-delay:0.3s;animation-delay:0.3s}.sk-cube-grid.svelte-1l7numc .sk-cube7.svelte-1l7numc{-webkit-animation-delay:0s;animation-delay:0s}.sk-cube-grid.svelte-1l7numc .sk-cube8.svelte-1l7numc{-webkit-animation-delay:0.1s;animation-delay:0.1s}.sk-cube-grid.svelte-1l7numc .sk-cube9.svelte-1l7numc{-webkit-animation-delay:0.2s;animation-delay:0.2s}@-webkit-keyframes svelte-1l7numc-sk-cubeGridScaleDelay{0%,70%,100%{-webkit-transform:scale3D(1, 1, 1);transform:scale3D(1, 1, 1)}35%{-webkit-transform:scale3D(0, 0, 1);transform:scale3D(0, 0, 1)}}@keyframes svelte-1l7numc-sk-cubeGridScaleDelay{0%,100%{-webkit-transform:scale3D(1, 1, 1);transform:scale3D(1, 1, 1)}50%{-webkit-transform:scale3D(0, 0, 1);transform:scale3D(0, 0, 1)}}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"sk-cube-grid svelte-1l7numc"}"><div class="${"sk-cube sk-cube1 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube2 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube3 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube4 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube5 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube6 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube7 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube8 svelte-1l7numc"}"></div>
  <div class="${"sk-cube sk-cube9 svelte-1l7numc"}"></div>
</div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  let $$unsubscribe_media;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_media = subscribe(media, (value) => value);
  let { data } = $$props;
  let apiKey = data.apiKey ?? "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${`<div class="${"h-full overflow-hidden w-full flex flex-col text-lg text-teal-900 font-bold items-center justify-center"}">${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}
    Loading Project...
  </div>`}

${``}

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      {
        persistent: true,
        placement: "center",
        open: !data.project
      },
      {},
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(FormInput, "FormInput").$$render(
                    $$result,
                    {
                      name: "apiKey",
                      label: "Enter Project's ApiKey",
                      value: apiKey
                    },
                    {
                      value: ($$value) => {
                        apiKey = $$value;
                        $$settled = false;
                      }
                    },
                    {}
                  )}
      ${``}`;
                }
              })}
    ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { href: "/projects" }, {}, {
                    default: () => {
                      return `Back`;
                    }
                  })}
      ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                    default: () => {
                      return `Continue`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_media();
  return $$rendered;
});
export {
  Layout as default
};
