import { c as create_ssr_component, b as subscribe, v as validate_component, e as escape, u as each, d as compute_rest_props, f as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, k as add_attribute, g as getContext, l as is_void, s as setContext } from './index-5f4e863c.js';
import { B as Button, f as forwardEventsBuilder, c as classname } from './moment-9302760e.js';
import { C as Card, a as CardBody } from './CardTitle-d197352a.js';
import { I as Icon_1 } from './Icon-eaa3a66d.js';
import 'prismjs';
import 'fs';
import 'path';
import { p as page } from './stores-febd7740.js';

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
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["border", "hover", "striped", "wrap", "size"]);
  let { border = false } = $$props;
  let { hover = false } = $$props;
  let { striped = false } = $$props;
  let { wrap = false } = $$props;
  let { size = "md" } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.striped === void 0 && $$bindings.striped && striped !== void 0)
    $$bindings.striped(striped);
  if ($$props.wrap === void 0 && $$bindings.wrap && wrap !== void 0)
    $$bindings.wrap(wrap);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  classes = classname("table", { border, hover, striped, wrap, size }, $$props.class);
  return `<div${add_attribute("class", classname("table-parent"), 0)}><table${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</table></div>`;
});
const TableBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("table-body", void 0, $$props.class);
  return `<tbody${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</tbody>`;
});
const TableCell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  var _a;
  forwardEventsBuilder(get_current_component());
  const head = (_a = getContext("TABLE:HEAD")) !== null && _a !== void 0 ? _a : false;
  classes = classname("table-cell", void 0, $$props.class);
  return `${((tag) => {
    return tag ? `<${head ? "th" : "td"}${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(head ? "th" : "td")}`;
});
const TableHead = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  setContext("TABLE:HEAD", true);
  classes = classname("table-head", void 0, $$props.class);
  return `<thead${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</thead>`;
});
const TableRow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("table-row", void 0, $$props.class);
  return `<tr${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</tr>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let name;
  let params;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let values = [];
  ({ name, params } = $page.params);
  $$unsubscribe_page();
  return `${validate_component(Card, "Card").$$render($$result, { class: "h-full overflow-hidden" }, {}, {
    default: () => {
      return `${validate_component(CardBody, "CardBody").$$render($$result, { class: "h-full flex flex-col" }, {}, {
        default: () => {
          return `<div class="${"w-full flex items-center justify-between border-b border-gray-200 py-3"}"><div class="${"text-lg font-bold"}">${escape(name)}</div>

      <div>${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Settings`;
            }
          })}
        ${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Insert Data`;
            }
          })}</div></div>

    <div class="${"h-full overflow-auto"}">${validate_component(Table, "Table").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(TableHead, "TableHead").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(TableRow, "TableRow").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `1`;
                        }
                      })}
            ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `2`;
                        }
                      })}
            ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `3`;
                        }
                      })}
            ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `4`;
                        }
                      })}
            ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `5`;
                        }
                      })}
            ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `Actions`;
                        }
                      })}`;
                    }
                  })}`;
                }
              })}
        ${validate_component(TableBody, "TableBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${each(values, (value, i) => {
                    return `${validate_component(TableRow, "TableRow").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${escape(i)}`;
                          }
                        })}
              ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${escape(i * 2)}`;
                          }
                        })}
              ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${escape(i * 3)}`;
                          }
                        })}
              ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${escape(i * 4)}`;
                          }
                        })}
              ${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                          default: () => {
                            return `${escape(i * 5)}`;
                          }
                        })}
              ${validate_component(TableCell, "TableCell").$$render($$result, { class: "w-0" }, {}, {
                          default: () => {
                            return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, { compact: true }, {}, {
                              default: () => {
                                return `${validate_component(Button, "Button").$$render(
                                  $$result,
                                  {
                                    size: "sm",
                                    color: "info",
                                    class: "border-none"
                                  },
                                  {},
                                  {
                                    default: () => {
                                      return `${validate_component(Icon_1, "Icon").$$render($$result, { pack: "mdi", name: "pencil" }, {}, {})}
                  `;
                                    }
                                  }
                                )}
                  ${validate_component(Button, "Button").$$render(
                                  $$result,
                                  {
                                    size: "sm",
                                    color: "danger",
                                    class: "border-none"
                                  },
                                  {},
                                  {
                                    default: () => {
                                      return `${validate_component(Icon_1, "Icon").$$render($$result, { pack: "mdi", name: "trash-can" }, {}, {})}
                  `;
                                    }
                                  }
                                )}
                `;
                              }
                            })}
              `;
                          }
                        })}
            `;
                      }
                    })}`;
                  })}`;
                }
              })}`;
            }
          })}</div>`;
        }
      })}`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-bd9ac50d.js.map
