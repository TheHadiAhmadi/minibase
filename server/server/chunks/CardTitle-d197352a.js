import { c as create_ssr_component, d as compute_rest_props, f as get_current_component, h as spread, i as escape_object, j as escape_attribute_value, v as validate_component, e as escape } from './index-5f4e863c.js';
import { f as forwardEventsBuilder, c as classname } from './moment-9302760e.js';
import 'prismjs';

const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["title"]);
  let { title = void 0 } = $$props;
  forwardEventsBuilder(get_current_component());
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  classes = classname("card", {}, $$props.class, true);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${title ? `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(CardTitle, "CardTitle").$$render($$result, {}, {}, {
        default: () => {
          return `${escape(title)}`;
        }
      })}`;
    }
  })}` : ``}
	${slots.default ? slots.default({}) : ``}</div>`;
});
const CardBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("card-body", void 0, $$props.class);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CardHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("card-header", void 0, $$props.class, true);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CardTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, []);
  forwardEventsBuilder(get_current_component());
  classes = classname("card-title", void 0, $$props.class, true);
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});

export { Card as C, CardBody as a, CardHeader as b, CardTitle as c };
//# sourceMappingURL=CardTitle-d197352a.js.map
