import { c as create_ssr_component, f as compute_rest_props, g as createEventDispatcher, h as spread, i as escape_object, j as escape_attribute_value, k as add_attribute, v as validate_component, d as escape } from "./index.js";
import { c as classname, I as Icon_1 } from "./compiler.js";
import "ssr-window";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["dismissible", "icon", "title", "color", "variant", "value"]);
  let { dismissible = false } = $$props;
  let { icon = void 0 } = $$props;
  let { title = "" } = $$props;
  let { color = "default" } = $$props;
  let { variant = "outlined" } = $$props;
  let { value = true } = $$props;
  createEventDispatcher();
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0)
    $$bindings.dismissible(dismissible);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classname(
    "alert",
    {
      color,
      icon: Boolean(icon),
      dismissible,
      variant
    },
    ["fade", "show", $$props.class],
    true
  );
  return `${value ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}><div${add_attribute("class", classname("alert-icon"), 0)}>${slots.icon ? slots.icon({}) : `
				${validate_component(Icon_1, "Icon").$$render($$result, { name: icon }, {}, {})}
			`}</div>
		<div${add_attribute("class", classname("alert-title"), 0)}>${slots.title ? slots.title({}) : `${escape(title)}`}</div>
		${slots.default ? slots.default({}) : ``}
		${dismissible ? `<div${add_attribute("class", classname("alert-close"), 0)}>${slots.close ? slots.close({}) : ``}</div>` : ``}</div>` : ``}`;
});
export {
  Alert as A
};
