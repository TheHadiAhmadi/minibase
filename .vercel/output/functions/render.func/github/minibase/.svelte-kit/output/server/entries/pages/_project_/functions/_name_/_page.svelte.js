import { c as create_ssr_component, q as onDestroy, k as add_attribute, v as validate_component, d as escape } from "../../../../../chunks/index.js";
import "prismjs";
import { B as Button } from "../../../../../chunks/Button.js";
import { B as ButtonGroup } from "../../../../../chunks/ButtonGroup.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { C as CardActions } from "../../../../../chunks/CardActions.js";
import { C as CardHeader, a as CardTitle } from "../../../../../chunks/CardTitle.js";
import { I as Icon_1 } from "../../../../../chunks/compiler.js";
import "ssr-window";
import "@googlemaps/js-api-loader";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
const prismCoy_min = "";
const CodeEditor_svelte_svelte_type_style_lang = "";
const css = {
  code: '.editor{box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),\n        0 3px 1px -2px rgba(0, 0, 0, 0.2);font-family:"Source Code Pro", monospace;font-size:14px;font-weight:400;height:max-content;min-height:80vh;letter-spacing:normal;line-height:20px;padding:10px;tab-size:4}.codejar-wrap{width:100%}',
  map: null
};
const CodeEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let instance;
  let el;
  let { code } = $$props;
  function updateCode(code2) {
    instance == null ? void 0 : instance.updateCode(code2);
  }
  onDestroy(() => {
    instance == null ? void 0 : instance.destroy();
  });
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.updateCode === void 0 && $$bindings.updateCode && updateCode !== void 0)
    $$bindings.updateCode(updateCode);
  $$result.css.add(css);
  return `<div class="${"editor w-full language-javascript"}"${add_attribute("this", el, 0)}></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let state = "clean";
  let prevCode = data.function.code;
  let codeEditor;
  let code = data.function.code;
  function updateCode(name) {
    console.log("update");
    codeEditor == null ? void 0 : codeEditor.updateCode(data.function.code);
    code = data.function.code;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if (prevCode !== code)
        state = "dirty";
      else
        state = "clean";
    }
    {
      updateCode(data.function.name);
    }
    $$rendered = `${validate_component(Card, "Card").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Edit &quot;${escape(data.function.name)}&quot; (TODO: Playground)
    `;
              }
            })}
    ${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                      default: () => {
                        return `Back`;
                      }
                    })}
        ${validate_component(Button, "Button").$$render(
                      $$result,
                      {
                        loading: state === "saving",
                        disabled: state !== "dirty",
                        color: "primary"
                      },
                      {},
                      {
                        default: () => {
                          return `${state === "clean" ? `${validate_component(Icon_1, "Icon").$$render($$result, { pack: "material-symbols", name: "check" }, {}, {})}` : `${state === "dirty" ? `${validate_component(Icon_1, "Icon").$$render(
                            $$result,
                            {
                              pack: "material-symbols",
                              name: "save-outline"
                            },
                            {},
                            {}
                          )}` : `${state === "saving" ? `${validate_component(Icon_1, "Icon").$$render(
                            $$result,
                            {
                              pack: "material-symbols",
                              name: "save-outline"
                            },
                            {},
                            {}
                          )}` : ``}`}`}
          Save
        `;
                        }
                      }
                    )}`;
                  }
                })}`;
              }
            })}`;
          }
        })}

  <div class="${"overflow-y-auto max-h-screen"}">${validate_component(CodeEditor, "CodeEditor").$$render(
          $$result,
          { this: codeEditor, code },
          {
            this: ($$value) => {
              codeEditor = $$value;
              $$settled = false;
            },
            code: ($$value) => {
              code = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div>`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
