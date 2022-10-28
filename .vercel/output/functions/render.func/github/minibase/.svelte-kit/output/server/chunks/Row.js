import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, u as is_void } from "./index.js";
import { f as forwardEventsBuilder, c as classname } from "./compiler.js";
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "forwardEvents",
    "align",
    "alignContent",
    "alignContentLg",
    "alignContentMd",
    "alignContentSm",
    "alignContentXL",
    "alignLg",
    "alignMd",
    "alignSm",
    "alignXl",
    "dense",
    "justify",
    "justifyLg",
    "justifyMd",
    "justifySm",
    "justifyXL",
    "noGutters",
    "tag"
  ]);
  let { forwardEvents = forwardEventsBuilder(get_current_component()) } = $$props;
  let { align = void 0 } = $$props;
  let { alignContent = void 0 } = $$props;
  let { alignContentLg = void 0 } = $$props;
  let { alignContentMd = void 0 } = $$props;
  let { alignContentSm = void 0 } = $$props;
  let { alignContentXL = void 0 } = $$props;
  let { alignLg = void 0 } = $$props;
  let { alignMd = void 0 } = $$props;
  let { alignSm = void 0 } = $$props;
  let { alignXl = void 0 } = $$props;
  let { dense = false } = $$props;
  let { justify = void 0 } = $$props;
  let { justifyLg = void 0 } = $$props;
  let { justifyMd = void 0 } = $$props;
  let { justifySm = void 0 } = $$props;
  let { justifyXL = void 0 } = $$props;
  let { noGutters = false } = $$props;
  let { tag = "div" } = $$props;
  if ($$props.forwardEvents === void 0 && $$bindings.forwardEvents && forwardEvents !== void 0)
    $$bindings.forwardEvents(forwardEvents);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.alignContent === void 0 && $$bindings.alignContent && alignContent !== void 0)
    $$bindings.alignContent(alignContent);
  if ($$props.alignContentLg === void 0 && $$bindings.alignContentLg && alignContentLg !== void 0)
    $$bindings.alignContentLg(alignContentLg);
  if ($$props.alignContentMd === void 0 && $$bindings.alignContentMd && alignContentMd !== void 0)
    $$bindings.alignContentMd(alignContentMd);
  if ($$props.alignContentSm === void 0 && $$bindings.alignContentSm && alignContentSm !== void 0)
    $$bindings.alignContentSm(alignContentSm);
  if ($$props.alignContentXL === void 0 && $$bindings.alignContentXL && alignContentXL !== void 0)
    $$bindings.alignContentXL(alignContentXL);
  if ($$props.alignLg === void 0 && $$bindings.alignLg && alignLg !== void 0)
    $$bindings.alignLg(alignLg);
  if ($$props.alignMd === void 0 && $$bindings.alignMd && alignMd !== void 0)
    $$bindings.alignMd(alignMd);
  if ($$props.alignSm === void 0 && $$bindings.alignSm && alignSm !== void 0)
    $$bindings.alignSm(alignSm);
  if ($$props.alignXl === void 0 && $$bindings.alignXl && alignXl !== void 0)
    $$bindings.alignXl(alignXl);
  if ($$props.dense === void 0 && $$bindings.dense && dense !== void 0)
    $$bindings.dense(dense);
  if ($$props.justify === void 0 && $$bindings.justify && justify !== void 0)
    $$bindings.justify(justify);
  if ($$props.justifyLg === void 0 && $$bindings.justifyLg && justifyLg !== void 0)
    $$bindings.justifyLg(justifyLg);
  if ($$props.justifyMd === void 0 && $$bindings.justifyMd && justifyMd !== void 0)
    $$bindings.justifyMd(justifyMd);
  if ($$props.justifySm === void 0 && $$bindings.justifySm && justifySm !== void 0)
    $$bindings.justifySm(justifySm);
  if ($$props.justifyXL === void 0 && $$bindings.justifyXL && justifyXL !== void 0)
    $$bindings.justifyXL(justifyXL);
  if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0)
    $$bindings.noGutters(noGutters);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classname(
    "row",
    {
      align,
      alignContent,
      alignContentLg,
      alignContentMd,
      alignContentSm,
      alignContentXL,
      alignLg,
      alignMd,
      alignSm,
      alignXl,
      dense,
      justify,
      justifyLg,
      justifyMd,
      justifySm,
      justifyXL,
      noGutters
    },
    $$props.class,
    true
  );
  return `${((tag$1) => {
    return tag$1 ? `<${tag}${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)}`;
});
export {
  Row as R
};
