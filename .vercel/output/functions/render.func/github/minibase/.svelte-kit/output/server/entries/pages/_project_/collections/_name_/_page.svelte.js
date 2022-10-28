import { c as create_ssr_component, f as compute_rest_props, r as get_current_component, k as add_attribute, h as spread, i as escape_object, j as escape_attribute_value, t as getContext, u as is_void, s as setContext, v as validate_component, d as escape, e as each } from "../../../../../chunks/index.js";
import { B as Badge } from "../../../../../chunks/Badge.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { B as ButtonGroup } from "../../../../../chunks/ButtonGroup.js";
import { C as CardActions } from "../../../../../chunks/CardActions.js";
import { C as CardFooter } from "../../../../../chunks/CardFooter.js";
import { C as CardHeader, a as CardTitle } from "../../../../../chunks/CardTitle.js";
import { f as forwardEventsBuilder, c as classname, I as Icon_1 } from "../../../../../chunks/compiler.js";
import "ssr-window";
import { D as Dialog, a as DialogContent } from "../../../../../chunks/DialogContent.js";
import { D as DialogBody } from "../../../../../chunks/DialogBody.js";
import { D as DialogFooter } from "../../../../../chunks/DialogFooter.js";
import { D as DialogHeader, a as DialogTitle } from "../../../../../chunks/DialogTitle.js";
import "@googlemaps/js-api-loader";
import "prismjs";
import "prism-svelte";
import "tom-select";
import "moment";
import "magic-string";
import "fs";
import "path";
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
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".height-loading{height:150px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let jsonModalOpen = false;
  let activeRow = null;
  let editModalOpen = false;
  let values = [];
  async function reload(deps) {
    return;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      reload(data.collection.name);
    }
    $$rendered = `${``}
${validate_component(CardHeader, "CardHeader").$$render($$result, { slot: "header" }, {}, {
      default: () => {
        return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
          default: () => {
            return `View &quot;${escape(data.collection.name)}&quot;
  `;
          }
        })}
  ${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => {
                    return `Reload`;
                  }
                })}
      ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => {
                    return `Edit Schema`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })}
${validate_component(Table, "Table").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(TableHead, "TableHead").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(TableRow, "TableRow").$$render($$result, {}, {}, {
              default: () => {
                return `${each(data.collection.schema, (schem) => {
                  return `${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(schem.name)}
          ${validate_component(Badge, "Badge").$$render($$result, { class: "ml-1" }, {}, {
                        default: () => {
                          return `${escape(schem.type)}`;
                        }
                      })}
        `;
                    }
                  })}`;
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
  ${validate_component(TableBody, "TableBody").$$render(
          $$result,
          {
            class: ""
          },
          {},
          {
            default: () => {
              return `${each(values, (value, i) => {
                return `${validate_component(TableRow, "TableRow").$$render($$result, {}, {}, {
                  default: () => {
                    return `${each(data.collection.schema, (schem) => {
                      return `${validate_component(TableCell, "TableCell").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(value[schem.name])}`;
                        }
                      })}`;
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
                                color: "warning",
                                class: "border-none"
                              },
                              {},
                              {
                                default: () => {
                                  return `${validate_component(Icon_1, "Icon").$$render($$result, { pack: "mdi", name: "json" }, {}, {})}
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
          }
        )}`;
      }
    })}
${validate_component(CardFooter, "CardFooter").$$render($$result, { slot: "footer" }, {}, {
      default: () => {
        return `${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => {
                    return `Back`;
                  }
                })}
      ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                  default: () => {
                    return `Insert Data`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })}

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      { open: editModalOpen },
      {
        open: ($$value) => {
          editModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `Edit Data`;
                }
              })}
    ${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `${``}`;
                }
              })}
    ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                        default: () => {
                          return `Cancel`;
                        }
                      })}
        ${`${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                        default: () => {
                          return `Insert`;
                        }
                      })}`}`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}

${validate_component(Dialog, "Dialog").$$render(
      $$result,
      { placement: "center", open: jsonModalOpen },
      {
        open: ($$value) => {
          jsonModalOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(DialogContent, "DialogContent").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(DialogHeader, "DialogHeader").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(DialogTitle, "DialogTitle").$$render($$result, {}, {}, {
                    default: () => {
                      return `View row as JSON`;
                    }
                  })}`;
                }
              })}
    ${validate_component(DialogBody, "DialogBody").$$render($$result, {}, {}, {
                default: () => {
                  return `<pre>${escape(JSON.stringify(activeRow, null, 2))}</pre>`;
                }
              })}
    ${validate_component(DialogFooter, "DialogFooter").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `Close`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
