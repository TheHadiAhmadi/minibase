import { c as create_ssr_component, v as validate_component, e as each, d as escape } from "../../../chunks/index.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { B as Button } from "../../../chunks/Button.js";
import "../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../chunks/DialogBody.js";
import { D as DialogFooter } from "../../../chunks/DialogFooter.js";
import { D as DialogHeader, a as DialogTitle } from "../../../chunks/DialogTitle.js";
import { R as Row } from "../../../chunks/Row.js";
import { F as FormInput } from "../../../chunks/Input.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let projects = [];
  let createProjectModalOpen = false;
  let newProject = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"h-full w-full p-2 bg-gradient-to-tl from-blue-50 to-cyan-100"}"><div class="${"container flex flex-col rounded bg-gradient-to-b from-blue-500/10 to-transparent "}"><div class="${"p-4 flex w-full items-center justify-between"}"><p class="${"font-bold text-lg"}">All Projects</p>
      ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
      default: () => {
        return `Create Project`;
      }
    })}</div>
    <ul class="${"flex flex-col px-4 border-t border-blue-100"}">${each(projects, (project) => {
      return `<li class="${"p-2"}"><a href="${"./" + escape(project.name, true)}">${escape(project.name)}</a></li>`;
    })}</ul></div></div>

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      {
        placement: "center",
        open: createProjectModalOpen
      },
      {
        open: ($$value) => {
          createProjectModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${`${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(DialogTitle, "DialogTitle").$$render($$result, {}, {}, {
                    default: () => {
                      return `Create New Project`;
                    }
                  })}`;
                }
              })}
      ${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Row, "Row").$$render($$result, { align: "end" }, {}, {
                    default: () => {
                      return `${validate_component(FormInput, "FormInput").$$render(
                        $$result,
                        {
                          cols: "12",
                          label: "name",
                          placeholder: "Enter Project's name",
                          value: newProject
                        },
                        {
                          value: ($$value) => {
                            newProject = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })}
        ${validate_component(Alert, "Alert").$$render($$result, {}, {}, {
                    default: () => {
                      return `Hello`;
                    }
                  })}`;
                }
              })}
      ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `Cancel`;
                    }
                  })}
        ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                    default: () => {
                      return `Next`;
                    }
                  })}`;
                }
              })}`}`;
            }
          })}`;
        }
      }
    )}

`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
