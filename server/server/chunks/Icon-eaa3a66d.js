import { c as create_ssr_component, d as compute_rest_props, f as get_current_component, v as validate_component, o as onDestroy, h as spread, i as escape_object, t as createEventDispatcher } from './index-5f4e863c.js';
import { f as forwardEventsBuilder, c as classname, a as checkIconState, g as generateIcon } from './moment-9302760e.js';

const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const state = {
    name: "",
    loading: null,
    destroyed: false
  };
  let mounted = false;
  let data;
  const onLoad = (icon) => {
    if (typeof $$props.onLoad === "function") {
      $$props.onLoad(icon);
    }
    const dispatch = createEventDispatcher();
    dispatch("load", { icon });
  };
  function loaded() {
  }
  onDestroy(() => {
    state.destroyed = true;
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  });
  {
    {
      const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
      data = iconData ? generateIcon(iconData.data, $$props) : null;
      if (data && iconData.classes) {
        data.attributes["class"] = (typeof $$props["class"] === "string" ? $$props["class"] + " " : "") + iconData.classes.join(" ");
      }
    }
  }
  return `${data !== null ? `<svg${spread([escape_object(data.attributes)], {})}><!-- HTML_TAG_START -->${data.body}<!-- HTML_TAG_END --></svg>` : ``}`;
});
const Icon_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["color", "filled", "name", "pack", "size"]);
  let { color = "default" } = $$props;
  let { filled = false } = $$props;
  let { name = void 0 } = $$props;
  let { pack = "tabler" } = $$props;
  let { size = "auto" } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.filled === void 0 && $$bindings.filled && filled !== void 0)
    $$bindings.filled(filled);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.pack === void 0 && $$bindings.pack && pack !== void 0)
    $$bindings.pack(pack);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  classes = classname("icon", { color, filled, size }, $$props.class, true);
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({ icon: pack + ":" + name }, { width: "auto" }, { height: "auto" }, $$restProps, { class: classes }), {}, {})}`;
});

export { Icon_1 as I };
//# sourceMappingURL=Icon-eaa3a66d.js.map
