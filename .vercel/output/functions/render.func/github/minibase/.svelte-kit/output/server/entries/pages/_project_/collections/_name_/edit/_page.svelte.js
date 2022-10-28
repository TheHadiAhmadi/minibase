import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, w as compute_slots, v as validate_component, x as onMount, q as onDestroy, k as add_attribute, d as escape, e as each } from "../../../../../../chunks/index.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import { B as ButtonGroup } from "../../../../../../chunks/ButtonGroup.js";
import { C as CardActions } from "../../../../../../chunks/CardActions.js";
import { f as forwardEventsBuilder, c as classname, I as Icon_1 } from "../../../../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../../../../chunks/DialogBody.js";
import { D as DialogHeader, a as DialogTitle } from "../../../../../../chunks/DialogTitle.js";
import { F as FormInput, C as Col, a as FormField, L as Label } from "../../../../../../chunks/Input.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
import { R as Row } from "../../../../../../chunks/Row.js";
import { createPopper } from "@popperjs/core";
/* empty css                                                                       */const Divider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["placement", "type", "variant", "vertical", "width"]);
  let $$slots = compute_slots(slots);
  let { placement = "center" } = $$props;
  let { type = "solid" } = $$props;
  let { variant = "full" } = $$props;
  let { vertical = false } = $$props;
  let { width = "thin" } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  classes = classname(
    "divider",
    {
      empty: !$$slots["default"],
      horizontal: !vertical,
      placement,
      type,
      variant,
      vertical,
      width
    },
    $$props.class
  );
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["offset", "persistence", "placement"]);
  let { offset = [0, 2] } = $$props;
  let { persistence = false } = $$props;
  let { placement = "bottom-start" } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.persistence === void 0 && $$bindings.persistence && persistence !== void 0)
    $$bindings.persistence(persistence);
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  classes = classname("menu", void 0, $$props.class);
  return `${validate_component(Popup, "Popup").$$render($$result, Object.assign({ forwardEvents }, { trigger: ["click"] }, { offset }, { persistence }, { placement }, $$restProps, { class: classes }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Popup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let options;
  let $$restProps = compute_rest_props($$props, [
    "disabled",
    "fixed",
    "forwardEvents",
    "offset",
    "persistence",
    "placement",
    "trigger"
  ]);
  let { disabled = false } = $$props;
  let { fixed = false } = $$props;
  let { forwardEvents = forwardEventsBuilder(get_current_component()) } = $$props;
  let { offset = [0, 8] } = $$props;
  let { persistence = false } = $$props;
  let { placement = "auto" } = $$props;
  let { trigger = ["focus", "hover"] } = $$props;
  let instance;
  let ref;
  function eventsName() {
    const events = [];
    if (trigger.includes("click"))
      events.push(["", "click"]);
    if (trigger.includes("focus"))
      events.push(["blur", "focus"]);
    if (trigger.includes("hover"))
      events.push(["mouseleave", "mouseenter"]);
    return events;
  }
  function bind() {
    if (disabled)
      return;
    if (typeof window != "undefined")
      document.addEventListener("click", onOutside);
    eventsName().map(([hide, show]) => {
      var _a, _b;
      (_a = void 0) === null || _a === void 0 ? void 0 : _a.addEventListener(hide, onHide);
      (_b = void 0) === null || _b === void 0 ? void 0 : _b.addEventListener(show, onShow);
    });
  }
  function unbind() {
    if (typeof window != "undefined")
      document.removeEventListener("click", onOutside);
    eventsName().map(([hide, show]) => {
      var _a, _b;
      (_a = void 0) === null || _a === void 0 ? void 0 : _a.removeEventListener(hide, onHide);
      (_b = void 0) === null || _b === void 0 ? void 0 : _b.removeEventListener(show, onShow);
    });
  }
  function rebind() {
    bind();
    unbind();
  }
  function onHide(event) {
    const run = () => {
      instance === null || instance === void 0 ? void 0 : instance.destroy();
      ref.setAttribute("hidden", "");
    };
    if (!event)
      return run();
    if (persistence)
      return;
    setTimeout(run, 150);
  }
  function onOutside(event) {
    if (!persistence)
      return;
    if (ref.hasAttribute("hidden"))
      return;
    if (event.composedPath().some((path) => path == ref || path == void 0))
      return;
    instance === null || instance === void 0 ? void 0 : instance.destroy();
    ref.setAttribute("hidden", "");
  }
  function onShow() {
    if (!ref.hasAttribute("hidden"))
      return onHide();
    instance = createPopper(
      void 0,
      ref,
      options
    );
    ref.removeAttribute("hidden");
  }
  onMount(bind);
  onDestroy(unbind);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0)
    $$bindings.fixed(fixed);
  if ($$props.forwardEvents === void 0 && $$bindings.forwardEvents && forwardEvents !== void 0)
    $$bindings.forwardEvents(forwardEvents);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.persistence === void 0 && $$bindings.persistence && persistence !== void 0)
    $$bindings.persistence(persistence);
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  if ($$props.trigger === void 0 && $$bindings.trigger && trigger !== void 0)
    $$bindings.trigger(trigger);
  {
    if (typeof trigger === "string")
      trigger = [trigger];
  }
  options = {
    placement,
    strategy: fixed ? "fixed" : "absolute",
    modifiers: [
      {
        name: "preventOverflow",
        options: { boundary: "clippingParents" }
      },
      { name: "offset", options: { offset } }
    ]
  };
  options && rebind();
  return `<div${spread([{ hidden: true }, escape_object($$restProps)], {})}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CollectionTypeEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { schem = { name: "", type: "string" } } = $$props;
  if ($$props.schem === void 0 && $$bindings.schem && schem !== void 0)
    $$bindings.schem(schem);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Row, "Row").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(FormInput, "FormInput").$$render(
          $$result,
          {
            cols: "9",
            placeholder: "Collection's name...",
            value: schem.name
          },
          {
            value: ($$value) => {
              schem.name = $$value;
              $$settled = false;
            }
          },
          {}
        )}

  ${validate_component(Col, "Col").$$render($$result, { cols: "2" }, {}, {
          default: () => {
            return `${validate_component(Button, "Button").$$render($$result, { block: true }, {}, {
              default: () => {
                return `${escape(schem.type)}`;
              }
            })}
    ${validate_component(Menu, "UMenu").$$render($$result, {}, {}, {
              default: () => {
                return `<a href="${"/"}" class="${"dropdown-item"}">string
      </a>
      <a href="${"/"}" class="${"dropdown-item"}">boolean
      </a>
      <a href="${"/"}" class="${"dropdown-item"}">number
      </a>
      <a href="${"/"}" class="${"dropdown-item"}">object
      </a>
      <a href="${"/"}" class="${"dropdown-item"}">array
      </a>`;
              }
            })}`;
          }
        })}

  ${validate_component(Col, "Col").$$render($$result, { cols: "" }, {}, {
          default: () => {
            return `${slots.default ? slots.default({}) : ``}`;
          }
        })}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const SchemaEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { schema } = $$props;
  let newSchem = { name: "", type: "string" };
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      console.log(schema);
    }
    $$rendered = `${validate_component(Row, "Row").$$render($$result, {}, {}, {
      default: () => {
        return `${each(schema, (schem) => {
          return `${validate_component(CollectionTypeEditor, "CollectionTypeEditor").$$render(
            $$result,
            { schem },
            {
              schem: ($$value) => {
                schem = $$value;
                $$settled = false;
              }
            },
            {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { color: "danger" }, {}, {
                  default: () => {
                    return `${validate_component(Icon_1, "Icon").$$render($$result, { name: "minus", pack: "mdi" }, {}, {})}
      `;
                  }
                })}
    `;
              }
            }
          )}`;
        })}
  ${validate_component(Col, "Col").$$render($$result, { cols: "12" }, {}, {
          default: () => {
            return `${validate_component(Divider, "Divider").$$render($$result, {}, {}, {
              default: () => {
                return `New`;
              }
            })}`;
          }
        })}
  ${validate_component(CollectionTypeEditor, "CollectionTypeEditor").$$render(
          $$result,
          { schem: newSchem },
          {
            schem: ($$value) => {
              newSchem = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${validate_component(Button, "Button").$$render($$result, { color: "primary", block: true }, {}, {
                default: () => {
                  return `Add`;
                }
              })}`;
            }
          }
        )}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let newName = data.collection.name;
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
                      return `Edit &quot;${escape(data.collection.name)}&quot;
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
        ${validate_component(FormField, "FormField").$$render($$result, { class: "!-mb-4" }, {}, {
                    default: () => {
                      return `${validate_component(Label, "Label").$$render($$result, {}, {}, {
                        default: () => {
                          return `Columns`;
                        }
                      })}
          ${validate_component(SchemaEditor, "SchemaEditor").$$render(
                        $$result,
                        { schema: data.collection.schema },
                        {
                          schema: ($$value) => {
                            data.collection.schema = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })}`;
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
