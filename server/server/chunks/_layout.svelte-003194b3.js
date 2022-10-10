import { c as create_ssr_component, b as subscribe, v as validate_component, d as compute_rest_props, f as get_current_component, s as setContext, h as spread, i as escape_object, j as escape_attribute_value, g as getContext, o as onDestroy, k as add_attribute } from './index-5f4e863c.js';
import { w as writable } from './index2-c2301a67.js';
import { B as Button, f as forwardEventsBuilder, c as classname } from './moment-9302760e.js';
import { nanoid } from 'nanoid';
import { D as Dialog, a as DialogContent, b as DialogBody, F as FormInput, c as DialogFooter } from './Input-060eeff4.js';
import { I as Icon_1 } from './Icon-eaa3a66d.js';
import 'prismjs';
import 'fs';
import 'path';
import { p as page } from './stores-febd7740.js';

function calculateHeight(elements) {
  return elements.reduce(
    (height, current) => {
      return height + current.element.clientHeight;
    },
    0
  );
}
function calculateSidebarWidth(elements) {
  let result = elements.reduce(
    (width, current) => {
      const sidebarWidth = current.open ? current.mode === "temporary" ? 0 : current.element.clientWidth : 0;
      return width + sidebarWidth;
    },
    0
  );
  return result;
}
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["absolute", "headerMode", "footerMode"]);
  forwardEventsBuilder(get_current_component());
  let { absolute = false } = $$props;
  let { headerMode = "grow" } = $$props;
  let { footerMode = "grow" } = $$props;
  let elements = [];
  let headerSize = writable(0);
  let leftSize = writable(0);
  let rightSize = writable(0);
  let footerSize = writable(0);
  let headerModeStore = writable(headerMode);
  let footerModeStore = writable(footerMode);
  function addElement(id, element, type, props) {
    elements = [...elements, { id, element, type, ...props }];
  }
  function removeElement(id) {
    elements = elements.filter((element) => element.id !== id);
  }
  function updateElement(id, props) {
    elements = elements.map((element) => {
      if (element.id === id)
        return { ...element, ...props };
      return element;
    });
  }
  setContext("APP", {
    headerMode: headerModeStore,
    footerMode: footerModeStore,
    headerSize,
    footerSize,
    leftSize,
    rightSize,
    addElement,
    removeElement,
    updateElement
  });
  if ($$props.absolute === void 0 && $$bindings.absolute && absolute !== void 0)
    $$bindings.absolute(absolute);
  if ($$props.headerMode === void 0 && $$bindings.headerMode && headerMode !== void 0)
    $$bindings.headerMode(headerMode);
  if ($$props.footerMode === void 0 && $$bindings.footerMode && footerMode !== void 0)
    $$bindings.footerMode(footerMode);
  {
    headerSize.set(calculateHeight(elements.filter((element) => element.type === "header")));
  }
  {
    leftSize.set(calculateSidebarWidth(elements.filter((element) => element.type === "sidebar" && !element.right)));
  }
  {
    rightSize.set(calculateSidebarWidth(elements.filter((element) => element.type === "sidebar" && element.right)));
  }
  {
    footerSize.set(calculateHeight(elements.filter((element) => element.type === "footer")));
  }
  {
    headerModeStore.set(headerMode);
  }
  {
    footerModeStore.set(footerMode);
  }
  classes = classname("app", { absolute }, $$props.class, true);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}
</div>`;
});
const AppBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let styles;
  let $$restProps = compute_rest_props($$props, []);
  let $leftSize, $$unsubscribe_leftSize;
  let $footerSize, $$unsubscribe_footerSize;
  let $rightSize, $$unsubscribe_rightSize;
  let $headerSize, $$unsubscribe_headerSize;
  forwardEventsBuilder(get_current_component());
  const { headerSize, footerSize, leftSize, rightSize } = getContext("APP");
  $$unsubscribe_headerSize = subscribe(headerSize, (value) => $headerSize = value);
  $$unsubscribe_footerSize = subscribe(footerSize, (value) => $footerSize = value);
  $$unsubscribe_leftSize = subscribe(leftSize, (value) => $leftSize = value);
  $$unsubscribe_rightSize = subscribe(rightSize, (value) => $rightSize = value);
  classes = classname("app-body", {}, $$props.class);
  styles = `inset: ${$headerSize}px ${$rightSize}px  ${$footerSize}px ${$leftSize}px;`;
  $$unsubscribe_leftSize();
  $$unsubscribe_footerSize();
  $$unsubscribe_rightSize();
  $$unsubscribe_headerSize();
  return `<div${spread(
    [
      escape_object($$restProps),
      { style: escape_attribute_value(styles) },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const AppHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let styles;
  let classes;
  let $$restProps = compute_rest_props($$props, ["id"]);
  let $rightSize, $$unsubscribe_rightSize;
  let $headerMode, $$unsubscribe_headerMode;
  let $leftSize, $$unsubscribe_leftSize;
  let { id = "app-header-" + nanoid(5) } = $$props;
  let ref;
  forwardEventsBuilder(get_current_component());
  const { headerMode, leftSize, rightSize, addElement, removeElement } = getContext("APP");
  $$unsubscribe_headerMode = subscribe(headerMode, (value) => $headerMode = value);
  $$unsubscribe_leftSize = subscribe(leftSize, (value) => $leftSize = value);
  $$unsubscribe_rightSize = subscribe(rightSize, (value) => $rightSize = value);
  onDestroy(() => {
    removeElement(id);
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  styles = [
    `left: ${["end", "center"].includes($headerMode) ? $leftSize : 0}px`,
    `right: ${["start", "center"].includes($headerMode) ? $rightSize : 0}px`
  ].join(";");
  classes = classname("app-header", {}, $$props.class, true);
  $$unsubscribe_rightSize();
  $$unsubscribe_headerMode();
  $$unsubscribe_leftSize();
  return `<header${spread(
    [
      escape_object($$restProps),
      { style: escape_attribute_value(styles) },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</header>`;
});
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let style;
  let classes;
  let $$restProps = compute_rest_props($$props, ["color", "image", "shape", "size"]);
  let { color = "default" } = $$props;
  let { image = void 0 } = $$props;
  let { shape = "round" } = $$props;
  let { size = "ep" } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.shape === void 0 && $$bindings.shape && shape !== void 0)
    $$bindings.shape(shape);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  style = image ? `background-image: url(${image})` : null;
  classes = classname("avatar", { [color]: !!color, shape, size }, $$props.class, true);
  return `<span${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { style: escape_attribute_value(style) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</span>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let hasAccess = false;
  let apiKey = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $page.params.project;
    $$rendered = `${validate_component(App, "App").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(AppHeader, "AppHeader").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="${"p-2 flex justify-between align-center bg-blue-200 border-b border-blue-400 w-full"}"><div class="${"flex gap-2 items-center justify-start"}">${validate_component(Button, "Button").$$render($$result, { class: "border-none sm:hidden" }, {}, {
              default: () => {
                return `${validate_component(Icon_1, "Icon").$$render($$result, { pack: "ion", name: "menu" }, {}, {})}`;
              }
            })}
        <a class="${"font-bold sm:pl-3 text-lg h-full flex items-center"}" href="${"/"}">Minibase</a></div>
  
        <div>${validate_component(Avatar, "Avatar").$$render($$result, { shape: "circle" }, {}, {
              default: () => {
                return `AB`;
              }
            })}</div></div>`;
          }
        })}
  
    
  
    ${validate_component(AppBody, "AppBody").$$render($$result, { class: "overflow-hidden" }, {}, {
          default: () => {
            return `<div class="${"p-3 overflow-hidden"}">${``}
</div>`;
          }
        })}`;
      }
    })}
  
  
${validate_component(Dialog, "Dialog").$$render($$result, { persistent: true, open: !hasAccess }, {}, {
      default: () => {
        return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(FormInput, "FormInput").$$render(
                  $$result,
                  {
                    label: "Enter Project's ApiKey",
                    value: apiKey
                  },
                  {
                    value: ($$value) => {
                      apiKey = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}`;
              }
            })}
        ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, {
                  default: () => {
                    return `Back`;
                  }
                })}
            ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                  default: () => {
                    return `Continue`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-003194b3.js.map
