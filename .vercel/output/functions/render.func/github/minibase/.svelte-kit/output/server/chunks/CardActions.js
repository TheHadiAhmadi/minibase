import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, i as escape_object, j as escape_attribute_value } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const CardActions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("card-actions", void 0, $$props.class);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  CardActions as C
};
