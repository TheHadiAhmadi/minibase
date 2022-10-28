import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, i as escape_object, j as escape_attribute_value } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const ButtonGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["compact", "vertical", "wrap"]);
  let { compact = false } = $$props;
  let { vertical = false } = $$props;
  let { wrap = false } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.compact === void 0 && $$bindings.compact && compact !== void 0)
    $$bindings.compact(compact);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.wrap === void 0 && $$bindings.wrap && wrap !== void 0)
    $$bindings.wrap(wrap);
  classes = classname(
    "button-group",
    {
      compact,
      horizontal: !vertical,
      vertical,
      wrap
    },
    $$props.class
  );
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  ButtonGroup as B
};
