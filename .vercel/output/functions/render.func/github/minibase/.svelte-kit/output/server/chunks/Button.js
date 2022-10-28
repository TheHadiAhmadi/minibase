import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, j as escape_attribute_value, i as escape_object, k as add_attribute, u as is_void } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let icon;
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "active",
    "block",
    "color",
    "disabled",
    "ghost",
    "href",
    "loading",
    "outline",
    "shape",
    "size"
  ]);
  let { active = false } = $$props;
  let { block = false } = $$props;
  let { color = "default" } = $$props;
  let { disabled = false } = $$props;
  let { ghost = false } = $$props;
  let { href = void 0 } = $$props;
  let { loading = false } = $$props;
  let { outline = false } = $$props;
  let { shape = "default" } = $$props;
  let { size = "md" } = $$props;
  forwardEventsBuilder(get_current_component());
  let ref;
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.ghost === void 0 && $$bindings.ghost && ghost !== void 0)
    $$bindings.ghost(ghost);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.shape === void 0 && $$bindings.shape && shape !== void 0)
    $$bindings.shape(shape);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  icon = ref;
  classes = classname(
    "button",
    {
      active,
      block,
      color,
      disabled,
      ghost,
      icon,
      loading,
      outline,
      shape,
      size
    },
    $$props.class,
    true
  );
  return `${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        { disabled: disabled || null },
        { href: escape_attribute_value(href) },
        escape_object($$restProps),
        { class: escape_attribute_value(classes) }
      ],
      {}
    )}${add_attribute("this", ref, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}`;
});
export {
  Button as B
};
