import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, v as validate_component, d as escape } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
import { C as CardHeader, a as CardTitle } from "./CardTitle.js";
import "ssr-window";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["title"]);
  let { title = void 0 } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  classes = classname("card", {}, $$props.class, true);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${title ? `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
        default: () => {
          return `${escape(title)}`;
        }
      })}`;
    }
  })}` : ``}
	${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Card as C
};
