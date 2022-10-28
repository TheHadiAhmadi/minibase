import { c as create_ssr_component, r as get_current_component, t as getContext, k as add_attribute, v as validate_component, d as escape } from "../../../chunks/index.js";
import { B as Button } from "../../../chunks/Button.js";
import { B as ButtonGroup } from "../../../chunks/ButtonGroup.js";
import { C as CardActions } from "../../../chunks/CardActions.js";
import { C as CardFooter } from "../../../chunks/CardFooter.js";
import { f as forwardEventsBuilder, c as classname, I as Icon_1 } from "../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../chunks/DialogContent.js";
import { D as DialogHeader, a as DialogTitle } from "../../../chunks/DialogTitle.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
import { C as CardBody } from "../../../chunks/CardBody.js";
const DialogClose = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  forwardEventsBuilder(get_current_component());
  getContext("DIALOG");
  return `<button type="${"button"}"${add_attribute("class", classname("dialog-close"), 0)} aria-label="${"Close"}"></button>`;
});
const MainBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(CardBody, "CardBody").$$render(
    $$result,
    {
      class: "h-100px overflow-auto flex-1 flex flex-col"
    },
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const ShowSdk = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let functions;
  let text;
  let { project } = $$props;
  if ($$props.project === void 0 && $$bindings.project && project !== void 0)
    $$bindings.project(project);
  functions = (project.functions ?? []).map((fn) => {
    return `        ${fn.name}: (data) => run("${fn.name}", data)`;
  }).join(",\n");
  text = `/* DO NOT EDIT MANUALLY, GET IT FROM MINIBASE DASHBOARD */  
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
  return `<pre class="${"relative"}">    <button class="${"absolute border border-gray-300 w-12 h-12 top-2 right-2 flex items-center justify-center"}">
        ${`${validate_component(Icon_1, "Icon").$$render($$result, { pack: "bi", name: "clipboard" }, {}, {})}`}
    </button>
    ${escape(text)}</pre>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let showSdkModalOpen = false;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(MainBody, "MainBody").$$render($$result, {}, {}, {
      default: () => {
        return `<h1>Welcome to Dashboard</h1>
  <div class="${"h-200px"}"></div>`;
      }
    })}
${validate_component(CardFooter, "CardFooter").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                  default: () => {
                    return `Show SDK File`;
                  }
                })}
      ${validate_component(Button, "Button").$$render($$result, { color: "danger", class: "w-min ms-auto" }, {}, {
                  default: () => {
                    return `Exit from Project
      `;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })}

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      {
        placement: "center",
        persistent: true,
        size: "lg",
        open: showSdkModalOpen
      },
      {
        open: ($$value) => {
          showSdkModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(DialogTitle, "DialogTitle").$$render($$result, {}, {}, {
                    default: () => {
                      return `store this file as minibase.js in your project`;
                    }
                  })}`;
                }
              })}
    ${validate_component(ShowSdk, "ShowSdk").$$render($$result, { project: data.project }, {}, {})}

    ${validate_component(DialogClose, "DialogClose").$$render($$result, {}, {}, {})}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
