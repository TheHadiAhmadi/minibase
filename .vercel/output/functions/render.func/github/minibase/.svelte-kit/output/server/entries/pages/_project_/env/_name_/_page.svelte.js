import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, v as validate_component, d as escape, k as add_attribute, h as spread, j as escape_attribute_value, i as escape_object } from "../../../../../chunks/index.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { C as CardActions } from "../../../../../chunks/CardActions.js";
import { C as CardBody } from "../../../../../chunks/CardBody.js";
import { C as CardFooter } from "../../../../../chunks/CardFooter.js";
import { C as CardHeader, a as CardTitle } from "../../../../../chunks/CardTitle.js";
import { f as forwardEventsBuilder, c as classname, I as Icon_1 } from "../../../../../chunks/compiler.js";
import "ssr-window";
import { a as FormField, L as Label, S as Spinner, b as FormHint, F as FormInput } from "../../../../../chunks/Input.js";
import { nanoid } from "nanoid";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
const FormTextarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["cols", "icon", "id", "iconEnd", "label", "loading", "message", "required", "value"]);
  let { cols = "12" } = $$props;
  let { icon = void 0 } = $$props;
  let { id = nanoid(10) } = $$props;
  let { iconEnd = void 0 } = $$props;
  let { label = void 0 } = $$props;
  let { loading = false } = $$props;
  let { message = void 0 } = $$props;
  let { required = false } = $$props;
  let { value = void 0 } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.iconEnd === void 0 && $$bindings.iconEnd && iconEnd !== void 0)
    $$bindings.iconEnd(iconEnd);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    classes = classname("form-textarea", void 0, $$props.class);
    $$rendered = `${validate_component(FormField, "FormField").$$render($$result, { cols, class: classes }, {}, {
      default: () => {
        return `${slots.label ? slots.label({}) : `
		${label ? `${validate_component(Label, "Label").$$render($$result, { for: "form-input-" + id, required }, {}, {
          default: () => {
            return `${escape(label)}`;
          }
        })}` : ``}
	`}
	<div${add_attribute("class", classname("form-field-body"), 0)}>${slots.start ? slots.start({}) : `
			${icon ? `<span${add_attribute("class", classname("form-field-icon"), 0)}>${validate_component(Icon_1, "Icon").$$render($$result, { name: icon }, {}, {})}</span>` : ``}
		`}
		${validate_component(Textarea, "Textarea").$$render(
          $$result,
          Object.assign({ id: "form-textarea-" + id }, { required }, { forwardEvents }, $$restProps, { value }),
          {
            value: ($$value) => {
              value = $$value;
              $$settled = false;
            }
          },
          {}
        )}
		${slots.end ? slots.end({}) : `
			${iconEnd && !loading ? `<span${add_attribute("class", classname("form-field-icon"), 0)}>${validate_component(Icon_1, "Icon").$$render($$result, { name: iconEnd }, {}, {})}</span>` : ``}
			${loading ? `<span${add_attribute("class", classname("form-field-icon"), 0)}>${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}</span>` : ``}
		`}</div>
	${slots.message ? slots.message({}) : `
		${message ? `${validate_component(FormHint, "FormHint").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(message)}`;
          }
        })}` : ``}
	`}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["disabled", "forwardEvents", "placeholder", "readOnly", "rows", "value"]);
  let { disabled = false } = $$props;
  let { forwardEvents = forwardEventsBuilder(get_current_component()) } = $$props;
  let { placeholder = void 0 } = $$props;
  let { readOnly = false } = $$props;
  let { rows = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.forwardEvents === void 0 && $$bindings.forwardEvents && forwardEvents !== void 0)
    $$bindings.forwardEvents(forwardEvents);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.readOnly === void 0 && $$bindings.readOnly && readOnly !== void 0)
    $$bindings.readOnly(readOnly);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classname("textarea", {}, $$props.class);
  return `<textarea${spread(
    [
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readOnly || null },
      { rows: escape_attribute_value(rows) },
      escape_object($$restProps),
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${value || ""}</textarea>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Card, "Card").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Edit Environment Variable`;
              }
            })}`;
          }
        })}
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(FormInput, "FormInput").$$render(
              $$result,
              {
                readonly: true,
                label: "name",
                value: data.key
              },
              {
                value: ($$value) => {
                  data.key = $$value;
                  $$settled = false;
                }
              },
              {}
            )}

    ${validate_component(FormTextarea, "FormTextarea").$$render(
              $$result,
              {
                placeholder: "Enter value...",
                label: "value",
                value: data.value
              },
              {
                value: ($$value) => {
                  data.value = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}

  ${validate_component(CardFooter, "CardFooter").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
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
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
