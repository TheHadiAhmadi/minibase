import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, j as escape_attribute_value, i as escape_object, u as is_void } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const Badge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["color", "dot", "ghost", "href", "outline", "shape"]);
  let { color = "default" } = $$props;
  let { dot = false } = $$props;
  let { ghost = false } = $$props;
  let { href = void 0 } = $$props;
  let { outline = false } = $$props;
  let { shape = "default" } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.dot === void 0 && $$bindings.dot && dot !== void 0)
    $$bindings.dot(dot);
  if ($$props.ghost === void 0 && $$bindings.ghost && ghost !== void 0)
    $$bindings.ghost(ghost);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.shape === void 0 && $$bindings.shape && shape !== void 0)
    $$bindings.shape(shape);
  classes = classname(
    "badge",
    {
      [color]: !!color,
      dot,
      ghost,
      outline,
      shape
    },
    $$props.class,
    true
  );
  return `${((tag) => {
    return tag ? `<${href ? "a" : "span"}${spread(
      [
        { href: escape_attribute_value(href) },
        escape_object($$restProps),
        { class: escape_attribute_value(classes) }
      ],
      {}
    )}>${is_void(tag) ? "" : `${!dot ? `${slots.default ? slots.default({}) : ``}` : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "span")}`;
});
export {
  Badge as B
};
