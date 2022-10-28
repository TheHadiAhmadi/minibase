import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, s as setContext, h as spread, i as escape_object, j as escape_attribute_value, k as add_attribute } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["backdrop", "absolute", "open", "persistent", "placement", "scrollable", "size"]);
  forwardEventsBuilder(get_current_component());
  let { backdrop = true } = $$props;
  let { absolute = false } = $$props;
  let { open = false } = $$props;
  let { persistent = false } = $$props;
  let { placement = "top" } = $$props;
  let { scrollable = false } = $$props;
  let { size = "md" } = $$props;
  function hide(force = false) {
    if (!force && persistent)
      return;
    open = false;
  }
  setContext("DIALOG", { hide });
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop !== void 0)
    $$bindings.backdrop(backdrop);
  if ($$props.absolute === void 0 && $$bindings.absolute && absolute !== void 0)
    $$bindings.absolute(absolute);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.persistent === void 0 && $$bindings.persistent && persistent !== void 0)
    $$bindings.persistent(persistent);
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  if ($$props.scrollable === void 0 && $$bindings.scrollable && scrollable !== void 0)
    $$bindings.scrollable(scrollable);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  classes = classname(
    "dialog",
    {
      placement,
      scrollable,
      size,
      open,
      absolute
    },
    $$props.class,
    true
  );
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}><div${add_attribute("class", classname("dialog-container"), 0)}>${slots.default ? slots.default({}) : ``}</div></div>

${backdrop ? `<div${add_attribute("class", classname("dialog-backdrop", { open, absolute }), 0)}></div>` : ``}`;
});
const DialogContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("dialog-content");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Dialog as D,
  DialogContent as a
};
