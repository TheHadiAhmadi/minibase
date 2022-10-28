import { c as create_ssr_component, v as validate_component, d as escape } from "../../../../../../chunks/index.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import { B as ButtonGroup } from "../../../../../../chunks/ButtonGroup.js";
import { C as CardActions } from "../../../../../../chunks/CardActions.js";
import "../../../../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../../../../chunks/DialogBody.js";
import { D as DialogHeader, a as DialogTitle } from "../../../../../../chunks/DialogTitle.js";
import { F as FormInput } from "../../../../../../chunks/Input.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
/* empty css                                                                       */const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let newName = data.function.name;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      console.log(data);
    }
    $$rendered = `<div class="${"h-screen"}">${validate_component(Dialog, "Dialog").$$render(
      $$result,
      {
        persistent: true,
        placement: "center",
        absolute: true,
        open: true
      },
      {},
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(DialogTitle, "DialogTitle").$$render($$result, {}, {}, {
                    default: () => {
                      return `Edit &quot;${escape(data.function.name)}&quot;
        `;
                    }
                  })}
        ${validate_component(CardActions, "CardActions").$$render($$result, { class: "-mr-10" }, {}, {
                    default: () => {
                      return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                            default: () => {
                              return `Back`;
                            }
                          })}
            ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                            default: () => {
                              return `Save`;
                            }
                          })}`;
                        }
                      })}`;
                    }
                  })}`;
                }
              })}

      ${validate_component(DialogBody, "DialogBody").$$render($$result, { class: "overflow-y-auto max-h-screen" }, {}, {
                default: () => {
                  return `${validate_component(FormInput, "FormInput").$$render(
                    $$result,
                    { label: "name", value: newName },
                    {
                      value: ($$value) => {
                        newName = $$value;
                        $$settled = false;
                      }
                    },
                    {}
                  )}
        Readme

        <br>
        input/output schema
        `;
                }
              })}`;
            }
          })}`;
        }
      }
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
