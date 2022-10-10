import { c as create_ssr_component, v as validate_component, u as each, e as escape, d as compute_rest_props, f as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, l as is_void } from './index-5f4e863c.js';
import { B as Button, f as forwardEventsBuilder, c as classname } from './moment-9302760e.js';
import { D as Dialog, a as DialogContent, b as DialogBody, F as FormInput, c as DialogFooter } from './Input-060eeff4.js';
import 'prismjs';
import 'fs';
import 'path';
import 'nanoid';
import './Icon-eaa3a66d.js';

const DialogHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("dialog-header");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const DialogTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("dialog-title");
  return `<h5${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</h5>`;
});
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let projects = [];
  let createProjectModalOpen = false;
  let newProject = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      console.log(createProjectModalOpen);
    }
    $$rendered = `${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Create Project`;
      }
    })}
<p>All Projects</p>
<ul>${each(projects, (app) => {
      return `<li><a href="${"./" + escape(app.name, true)}">${escape(app.name)}</a></li>`;
    })}</ul>

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      { open: createProjectModalOpen },
      {
        open: ($$value) => {
          createProjectModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${`${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(DialogTitle, "DialogTitle").$$render($$result, {}, {}, {
                    default: () => {
                      return `Create New Project`;
                    }
                  })}`;
                }
              })}
      ${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Row, "Row").$$render($$result, { align: "end" }, {}, {
                    default: () => {
                      return `${validate_component(FormInput, "FormInput").$$render(
                        $$result,
                        {
                          cols: "12",
                          label: "name",
                          placeholder: "Enter Project's name",
                          value: newProject
                        },
                        {
                          value: ($$value) => {
                            newProject = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })}`;
                }
              })}
      ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `Cancel`;
                    }
                  })}
        ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                    default: () => {
                      return `Next`;
                    }
                  })}`;
                }
              })}`}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-a3a5bad4.js.map
