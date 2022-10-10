import { c as create_ssr_component, b as subscribe, v as validate_component, d as compute_rest_props, f as get_current_component, h as spread, i as escape_object, j as escape_attribute_value } from './index-5f4e863c.js';
import { B as Button, f as forwardEventsBuilder, c as classname } from './moment-9302760e.js';
import { C as Card, b as CardHeader, c as CardTitle, a as CardBody } from './CardTitle-d197352a.js';
import 'prismjs';
import 'fs';
import 'path';
import { p as page } from './stores-febd7740.js';

const CardActions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("card-actions", void 0, $$props.class);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $page.params;
    $$rendered = `<div>${validate_component(Card, "Card").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Edit Function
          `;
              }
            })}
          ${validate_component(CardActions, "CardActions").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
                  default: () => {
                    return `Save`;
                  }
                })}`;
              }
            })}`;
          }
        })}
      ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
          default: () => {
            return `Function Editor

        ${``}
  
  
        `;
          }
        })}`;
      }
    })}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-3854904e.js.map
