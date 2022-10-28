import { c as create_ssr_component, f as compute_rest_props, w as compute_slots, r as get_current_component, k as add_attribute, h as spread, j as escape_attribute_value, i as escape_object, d as escape, e as each, v as validate_component, n as noop, b as subscribe, g as createEventDispatcher } from "../../../../chunks/index.js";
import { B as Button } from "../../../../chunks/Button.js";
import { C as CardBody } from "../../../../chunks/CardBody.js";
import { C as CardHeader, a as CardTitle } from "../../../../chunks/CardTitle.js";
import { f as forwardEventsBuilder, c as classname, I as Icon_1 } from "../../../../chunks/compiler.js";
import "ssr-window";
import { a as FormField, L as Label, F as FormInput } from "../../../../chunks/Input.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
import { B as Badge } from "../../../../chunks/Badge.js";
import { D as Dialog, a as DialogContent } from "../../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../../chunks/DialogBody.js";
import { D as DialogFooter } from "../../../../chunks/DialogFooter.js";
import { D as DialogHeader, a as DialogTitle } from "../../../../chunks/DialogTitle.js";
import { w as writable } from "../../../../chunks/index3.js";
import { nanoid } from "nanoid";
import { A as APIKEY_SCOPES } from "../../../../chunks/index5.js";
import { p as page } from "../../../../chunks/stores.js";
const createOptions = ({ items = [], key = "key", text = "text" }) => {
  const options = writable(Array.isArray(items) ? items : Object.entries(items));
  const extract = (option) => {
    switch (getType(option)) {
      case "array":
        return {
          key: option[0],
          text: option[1]
        };
      case "object":
        return {
          key: option[key],
          text: option[text]
        };
      default:
        return {
          key: option,
          text: option
        };
    }
  };
  const fromValue = (value) => {
    if (Array.isArray(value))
      return value.map(toKey);
    return toKey(value);
  };
  const getKey = (option) => {
    const { key: key2 } = extract(option);
    return toKey(key2);
  };
  const getText = (option) => {
    return extract(option).text;
  };
  const getType = (input) => {
    return Object.prototype.toString.call(input).replace("object", "").replace("[", "").replace("]", "").trim().toLowerCase();
  };
  const isSelected = (option, value) => {
    const { key: key2 } = extract(option);
    if (Array.isArray(value))
      return value === null || value === void 0 ? void 0 : value.includes(key2);
    return key2 == value;
  };
  const toKey = (input) => {
    switch (getType(input)) {
      case "number":
        return `${input}`;
      default:
        return input;
    }
  };
  const toValue = (input) => {
    const isMultiple = Array.isArray(input);
    const result = [input].flat().map((input2) => {
      const [value, type] = input2.split(":");
      switch (type) {
        case "number":
          return Number(value);
      }
      switch (value) {
        case "null":
          return null;
        case "undefined":
          return void 0;
        default:
          return value;
      }
    });
    return isMultiple ? result : result[0];
  };
  return {
    options,
    fromValue,
    getKey,
    getText,
    isSelected,
    toValue
  };
};
const Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "color",
    "description",
    "descriptionColor",
    "forwardEvents",
    "group",
    "id",
    "inline",
    "key",
    "text",
    "value"
  ]);
  let $$slots = compute_slots(slots);
  let { color = "primary" } = $$props;
  let { description = "" } = $$props;
  let { descriptionColor = "default" } = $$props;
  let { forwardEvents = forwardEventsBuilder(get_current_component()) } = $$props;
  let { group = [] } = $$props;
  let { id = "checkbox-" + nanoid(10) } = $$props;
  let { inline = false } = $$props;
  let { key = void 0 } = $$props;
  let { text = void 0 } = $$props;
  let { value = false } = $$props;
  function updateChekbox(group2) {
    value = group2.indexOf(key) >= 0;
  }
  function updateGroup(value2) {
    const index = group.indexOf(key);
    if (value2) {
      if (index < 0) {
        group = [...group, key];
      }
    } else {
      if (index >= 0) {
        group.splice(index, 1);
        group = group;
      }
    }
  }
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  if ($$props.descriptionColor === void 0 && $$bindings.descriptionColor && descriptionColor !== void 0)
    $$bindings.descriptionColor(descriptionColor);
  if ($$props.forwardEvents === void 0 && $$bindings.forwardEvents && forwardEvents !== void 0)
    $$bindings.forwardEvents(forwardEvents);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classname("checkbox", { inline }, $$props.class, true);
  {
    updateGroup(value);
  }
  {
    updateChekbox(group);
  }
  return `<div${add_attribute("class", classes, 0)}><input${spread(
    [
      { type: "checkbox" },
      { id: escape_attribute_value(id) },
      { value: escape_attribute_value(key) },
      escape_object($$restProps),
      {
        class: escape_attribute_value(classname("checkbox-input", { color }, void 0, true))
      }
    ],
    {}
  )}${add_attribute("checked", value, 1)}>
	<label${add_attribute("for", id, 0)}${add_attribute("class", classname("checkbox-label"), 0)}>${slots.default ? slots.default({}) : `
			${escape(text)}
		`}</label>
	${description || $$slots["description"] ? `<div${add_attribute("class", classname("checkbox-description"), 0)}>${slots.description ? slots.description({}) : `
				${escape(description)}
			`}</div>` : ``}</div>`;
});
const CheckboxGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let options;
  let getKey;
  let getText;
  let classes;
  let $options, $$unsubscribe_options = noop, $$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, ($$value) => $options = $$value), options);
  let { color = "primary" } = $$props;
  let { inline = false } = $$props;
  let { items = [] } = $$props;
  let { key = "key" } = $$props;
  let { text = "text" } = $$props;
  let { value = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$subscribe_options({ options, getKey, getText } = createOptions({ items, key, text }));
    classes = classname("checkbox-group", $$props.class, true);
    $$rendered = `<div${add_attribute("class", classes, 0)}>${each($options, (option) => {
      return `${validate_component(Checkbox, "Checkbox").$$render(
        $$result,
        {
          inline,
          forwardEvents,
          text: getText(option),
          key: getKey(option),
          color,
          group: value
        },
        {
          group: ($$value) => {
            value = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })}</div>`;
  } while (!$$settled);
  $$unsubscribe_options();
  return $$rendered;
});
const FormCheckboxGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["cols", "forwardEvents", "inline", "items", "key", "label", "text", "value"]);
  let { cols = false } = $$props;
  let { forwardEvents = forwardEventsBuilder(get_current_component()) } = $$props;
  let { inline = false } = $$props;
  let { items = void 0 } = $$props;
  let { key = "key" } = $$props;
  let { label = void 0 } = $$props;
  let { text = "text" } = $$props;
  let { value = [] } = $$props;
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  if ($$props.forwardEvents === void 0 && $$bindings.forwardEvents && forwardEvents !== void 0)
    $$bindings.forwardEvents(forwardEvents);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    classes = classname("form-checkbox-group", void 0, $$props.class, true);
    $$rendered = `${validate_component(FormField, "FormField").$$render($$result, { cols, class: classes }, {}, {
      default: () => {
        return `${!!label ? `${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(label)}`;
          }
        })}` : ``}
	${validate_component(CheckboxGroup, "CheckboxGroup").$$render(
          $$result,
          Object.assign({ inline }, { items }, { key }, { text }, { forwardEvents }, $$restProps, { value }),
          {
            value: ($$value) => {
              value = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const ApiKeyEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const project = $page.data.project;
  let addApiKeyOpen = false;
  let request = { name: "", scopes: [] };
  let show = false;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${each(project.apiKeys ?? [], (key, index) => {
      return `<div class="${"flex mb-2 flex-col p-2 border border-gray-500"}"><div class="${"flex items-center justify-between"}"><div class="${"font-bold"}">${escape(key.name)}</div>
      ${index > 0 ? `${validate_component(Button, "Button").$$render($$result, { outline: true, size: "sm", color: "red" }, {}, {
        default: () => {
          return `${validate_component(Icon_1, "Icon").$$render($$result, { name: "trash-can", pack: "mdi" }, {}, {})}
        `;
        }
      })}` : ``}</div>
    <div class="${"flex gap-2 flex-wrap text-lg"}">${each(key.scopes, (scope) => {
        let color = scope.startsWith("read") ? "blue" : scope.startsWith("write") ? "green" : "red";
        return `
        ${validate_component(Badge, "Badge").$$render($$result, { ghost: true, color, shape: "round" }, {}, {
          default: () => {
            return `${escape(scope)}`;
          }
        })}`;
      })}</div>
  </div>`;
    })}

${validate_component(Button, "Button").$$render($$result, { color: "primary", class: "mt-3 ms-auto" }, {}, {
      default: () => {
        return `Add New ApiKey`;
      }
    })}










${validate_component(Dialog, "Dialog").$$render(
      $$result,
      { open: addApiKeyOpen },
      {
        open: ($$value) => {
          addApiKeyOpen = $$value;
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
                      return `Add ApiKey`;
                    }
                  })}`;
                }
              })}
    ${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(FormInput, "FormInput").$$render(
                    $$result,
                    { label: "name", value: request.name },
                    {
                      value: ($$value) => {
                        request.name = $$value;
                        $$settled = false;
                      }
                    },
                    {}
                  )}
      ${validate_component(FormCheckboxGroup, "FormCheckboxGroup").$$render(
                    $$result,
                    {
                      text: "key",
                      key: "value",
                      items: Object.entries(APIKEY_SCOPES).map(([key, value]) => ({ key, value })).slice(0, -1),
                      value: request.scopes
                    },
                    {
                      value: ($$value) => {
                        request.scopes = $$value;
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
                  return `${validate_component(Button, "Button").$$render($$result, { disabled: show }, {}, {
                    default: () => {
                      return `Cancel
      `;
                    }
                  })}
      ${`${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `Add`;
                    }
                  })}`}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let newName = data.project.name;
  createEventDispatcher();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
          default: () => {
            return `Settings`;
          }
        })}`;
      }
    })}

${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(FormInput, "FormInput").$$render(
          $$result,
          { label: "Rename Project", value: newName },
          {
            value: ($$value) => {
              newName = $$value;
              $$settled = false;
            }
          },
          {}
        )}
  ${validate_component(Button, "Button").$$render($$result, {}, {}, {
          default: () => {
            return `Rename`;
          }
        })}

  <div class="${"p-6 opacity-50"}"><br> import / export data
  </div>

  ${validate_component(FormField, "FormField").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Label, "Label").$$render($$result, {}, {}, {
              default: () => {
                return `ApiKeys`;
              }
            })}
    ${validate_component(ApiKeyEditor, "ApiKeyEditor").$$render($$result, {}, {}, {})}`;
          }
        })}

  ${validate_component(Button, "Button").$$render($$result, { color: "danger" }, {}, {
          default: () => {
            return `Remove Project`;
          }
        })}

  <br>`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
