import { getWindow, getDocument } from "ssr-window";
import { $, addClass, removeClass, hasClass, toggleClass, attr, removeAttr, transform, transition as transition$1, on, off, trigger, transitionEnd as transitionEnd$1, outerWidth, outerHeight, styles, offset, css, each, html, text, is, index, eq, append, prepend, next, nextAll, prev, prevAll, parent, parents, closest, find, children, filter, remove } from "dom7";
import { p as prevent_default, l as stop_propagation, o as listen, c as create_ssr_component, q as onDestroy, h as spread, i as escape_object, g as createEventDispatcher, f as compute_rest_props, r as get_current_component, v as validate_component } from "./index.js";
import { paramCase } from "change-case";
const regex$1 = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
const handler = (detail) => {
  document.dispatchEvent(new CustomEvent("UBEAC:EVENTS", { detail }));
};
const forwardEventsBuilder = (component) => {
  const natives = {};
  component.$on = (eventType, callback) => {
    var _a;
    var _b;
    const isNative = `on${eventType}`.split(":")[0].toLowerCase() in document;
    if (isNative) {
      const callbacks3 = natives[eventType] || (natives[eventType] = []);
      callbacks3.push(callback);
      return () => {
      };
    }
    const callbacks2 = (_a = (_b = component.$$.callbacks)[eventType]) !== null && _a !== void 0 ? _a : _b[eventType] = [];
    const cb = callback;
    callback = (event) => {
      handler(event);
      return cb(event);
    };
    callbacks2.push(callback);
    return () => {
      const index2 = callbacks2.indexOf(callback);
      if (index2 == -1)
        return;
      callbacks2.splice(index2, 1);
    };
  };
  return (node2) => {
    const eventTypes = Object.keys(natives);
    const destructors = [];
    for (let eventType of eventTypes) {
      const callbacks2 = natives[eventType];
      for (let callback of callbacks2) {
        let options = false;
        if (eventType.match(regex$1)) {
          const parts = eventType.split(":");
          eventType = parts[0];
          const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
          if (eventOptions.passive) {
            options = options || {};
            options.passive = true;
          }
          if (eventOptions.nonpassive) {
            options = options || {};
            options.passive = false;
          }
          if (eventOptions.capture) {
            options = options || {};
            options.capture = true;
          }
          if (eventOptions.once) {
            options = options || {};
            options.once = true;
          }
          if (eventOptions.preventDefault) {
            callback = prevent_default(callback);
          }
          if (eventOptions.stopPropagation) {
            callback = stop_propagation(callback);
          }
        }
        const destructor = listen(node2, eventType, callback, options);
        const mirror = listen(node2, eventType, handler, options);
        destructors.push(destructor, mirror);
      }
    }
    const destroy = () => destructors.forEach((destructor) => destructor());
    return { destroy };
  };
};
const prefix = `u`;
const parse = (inputs, includeName) => {
  const result = [];
  for (const input of inputs) {
    const type = Object.prototype.toString.call(input).replace(/\[|\]|object| /g, "").toLowerCase();
    switch (type) {
      case "array": {
        console.log("TODO", input);
        break;
      }
      case "object": {
        for (let key in input) {
          const value2 = input[key];
          key = paramCase(key);
          if (typeof value2 == "undefined" || value2 === false)
            continue;
          if (value2 === true)
            key && result.push(key);
          else if (typeof value2 == "number" || includeName)
            key && result.push(`${key}-${value2}`);
          else
            result.push(value2);
        }
        break;
      }
      case "string": {
        input.split(" ").forEach((input2) => result.push(input2));
        break;
      }
    }
  }
  return result;
};
const classname = (root, scoped, global, includeName) => {
  root = paramCase(root || "");
  scoped = [scoped].flat();
  global = [global].flat();
  const classes2 = parse(scoped, includeName).map((input) => root ? `${prefix}-${root}-${input}` : `${prefix}-${input}`).concat(...parse(global)).filter((input) => input);
  if (root)
    classes2.unshift(`${prefix}-${root}`);
  return classes2.join(" ") || void 0;
};
const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition: transition$1,
  on,
  off,
  trigger,
  transitionEnd: transitionEnd$1,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach((methodName) => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e) {
    }
    try {
      delete object[key];
    } catch (e) {
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis = "x") {
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m41;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[12]);
    else
      curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m42;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[13]);
    else
      curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject(o) {
  return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node2) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node2 instanceof HTMLElement;
  }
  return node2 && (node2.nodeType === 1 || node2.nodeType === 11);
}
function extend(...args) {
  const to = Object(args[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex2 = 0, len = keysArray.length; nextIndex2 < len; nextIndex2 += 1) {
        const nextKey = keysArray[nextIndex2];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir2 = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current2, target) => {
    return dir2 === "next" && current2 >= target || dir2 === "prev" && current2 <= target;
  };
  const animate = () => {
    time = new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          get() {
            supportsPassive = true;
          }
        });
        window2.addEventListener("testPassiveListener", null, opts);
      } catch (e) {
      }
      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return "ongesturestart" in window2;
    }()
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice({
  userAgent
} = {}) {
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad)
      ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize({
  swiper,
  on: on2,
  emit
}) {
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el)
            return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("orientationchange");
  };
  on2("init", () => {
    if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on2("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  const observers = [];
  const window2 = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: typeof options.childList === "undefined" ? true : options.childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer)
      return;
    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on2("init", init);
  on2("destroy", destroy);
}
const eventsEmitter = {
  on(events2, handler2, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler2 !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self2.eventsListeners[event])
        self2.eventsListeners[event] = [];
      self2.eventsListeners[event][method](handler2);
    });
    return self2;
  },
  once(events2, handler2, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler2 !== "function")
      return self2;
    function onceHandler(...args) {
      self2.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler2.apply(self2, args);
    }
    onceHandler.__emitterProxy = handler2;
    return self2.on(events2, onceHandler, priority);
  },
  onAny(handler2, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler2 !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    if (self2.eventsAnyListeners.indexOf(handler2) < 0) {
      self2.eventsAnyListeners[method](handler2);
    }
    return self2;
  },
  offAny(handler2) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsAnyListeners)
      return self2;
    const index2 = self2.eventsAnyListeners.indexOf(handler2);
    if (index2 >= 0) {
      self2.eventsAnyListeners.splice(index2, 1);
    }
    return self2;
  },
  off(events2, handler2) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    events2.split(" ").forEach((event) => {
      if (typeof handler2 === "undefined") {
        self2.eventsListeners[event] = [];
      } else if (self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler, index2) => {
          if (eventHandler === handler2 || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler2) {
            self2.eventsListeners[event].splice(index2, 1);
          }
        });
      }
    });
    return self2;
  },
  emit(...args) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    let events2;
    let data2;
    let context;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data2 = args.slice(1, args.length);
      context = self2;
    } else {
      events2 = args[0].events;
      data2 = args[0].data;
      context = args[0].context || self2;
    }
    data2.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
        self2.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event, ...data2]);
        });
      }
      if (self2.eventsListeners && self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context, data2);
        });
      }
    });
    return self2;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
  height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
  if (Number.isNaN(width))
    width = 0;
  if (Number.isNaN(height))
    height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  function getDirectionPropertyValue(node2, label) {
    return parseFloat(node2.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index2 = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  }
  swiper.virtualSize = -spaceBetween;
  if (rtl)
    slides.css({
      marginLeft: "",
      marginBottom: "",
      marginTop: ""
    });
  else
    slides.css({
      marginRight: "",
      marginBottom: "",
      marginTop: ""
    });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide2 = slides.eq(i);
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide2, slidesLength, getDirectionLabel);
    }
    if (slide2.css("display") === "none")
      continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2[0]);
      const currentTransform = slide2[0].style.transform;
      const currentWebKitTransform = slide2[0].style.webkitTransform;
      if (currentTransform) {
        slide2[0].style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide2.outerWidth(true) : slide2.outerHeight(true);
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2[0].style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3)
        slidePosition = 0;
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if (index2 % params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if ((index2 - Math.min(swiper.params.slidesPerGroupSkip, index2)) % swiper.params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index2 += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths)
        slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (snapGrid.length === 0)
    snapGrid = [0];
  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
    slides.filter((_, slideIndex) => {
      if (!params.cssMode)
        return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map((snap) => {
      if (snap < 0)
        return -offsetBefore;
      if (snap > maxSnap)
        return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow)
      swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.$el.removeClass(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index2) => {
    if (isVirtual) {
      return swiper.slides.filter((el) => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index2)[0];
    }
    return swiper.slides.eq(index2)[0];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || $([])).each((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index2 = swiper.activeIndex + i;
        if (index2 > swiper.slides.length && !isVirtual)
          break;
        activeSlides.push(getSlideByIndex(index2));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== "undefined") {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper.$wrapperEl.css("height", `${newHeight}px`);
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}
function updateSlidesProgress(translate2 = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0)
    return;
  if (typeof slides[0].swiperSlideOffset === "undefined")
    swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl)
    offsetCenter = translate2;
  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  for (let i = 0; i < slides.length; i += 1) {
    const slide2 = slides[i];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
  swiper.visibleSlides = $(swiper.visibleSlides);
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }
  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
    swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;
  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  }
  activeSlide.addClass(params.slideActiveClass);
  if (params.loop) {
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  }
  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  }
  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }
  if (params.loop) {
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    }
    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }
  swiper.emitSlidesClasses();
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  if (typeof activeIndex === "undefined") {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (previousRealIndex !== realIndex) {
    swiper.emit("realIndexChange");
  }
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide2 = $(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide2) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($(slide2).attr("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
const update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    $wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl)
    currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x2 = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x2 = rtl ? -translate2 : translate2;
  } else {
    y = translate2;
  }
  if (params.roundLengths) {
    x2 = Math.floor(x2);
    y = Math.floor(y);
  }
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x2 : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x2}px, ${y}px, ${z}px)`);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x2 : y;
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else
    newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper || swiper.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
const translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir2 = direction;
  if (!dir2) {
    if (activeIndex > previousIndex)
      dir2 = "next";
    else if (activeIndex < previousIndex)
      dir2 = "prev";
    else
      dir2 = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir2 === "reset") {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir2 === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode)
    return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode)
    return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
const transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index2 = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index2 !== "number" && typeof index2 !== "string") {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index2}] given.`);
  }
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let slideIndex = index2;
  if (slideIndex < 0)
    slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate2 < swiper.translate && translate2 < swiper.minTranslate()) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex)
        return false;
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex)
    direction = "next";
  else if (slideIndex < activeIndex)
    direction = "prev";
  else
    direction = "reset";
  if (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate2 : -translate2;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t,
        behavior: "smooth"
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
        if (!swiper || swiper.destroyed)
          return;
        if (e.target !== this)
          return;
        swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index2 = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let newIndex = index2;
  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }
  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled)
    return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return swiper;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0)
      return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0)
      prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index2 = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index2);
  const snapIndex = skip + Math.floor((index2 - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index2 += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index2 -= swiper.params.slidesPerGroup;
    }
  }
  index2 = Math.max(index2, 0);
  index2 = Math.min(index2, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index2, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  if (params.loop) {
    if (swiper.animating)
      return;
    realIndex = parseInt($(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
const slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper;
  const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);
  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $(document2.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }
      slides = $selector.children(`.${params.slideClass}`);
    }
  }
  if (params.slidesPerView === "auto" && !params.loopedSlides)
    params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;
  if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) {
    swiper.loopedSlides = slides.length;
  }
  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index2) => {
    const slide2 = $(el);
    slide2.attr("data-swiper-slide-index", index2);
  });
  for (let i = 0; i < swiper.loopedSlides; i += 1) {
    const index2 = i - Math.floor(i / slides.length) * slides.length;
    appendSlides.push(slides.eq(index2)[0]);
    prependSlides.unshift(slides.eq(slides.length - index2 - 1)[0]);
  }
  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}
function loopFix() {
  const swiper = this;
  swiper.emit("beforeLoopFix");
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate();
  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr("data-swiper-slide-index");
}
const loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
    return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
}
const grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector2, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow())
      return null;
    if (el.assignedSlot)
      el = el.assignedSlot;
    const found = el.closest(selector2);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event) {
  const swiper = this;
  const document2 = getDocument();
  const window2 = getWindow();
  const data2 = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  let $targetEl = $(e.target);
  if (params.touchEventsTarget === "wrapper") {
    if (!$targetEl.closest(swiper.wrapperEl).length)
      return;
  }
  data2.isTouchEvent = e.type === "touchstart";
  if (!data2.isTouchEvent && "which" in e && e.which === 3)
    return;
  if (!data2.isTouchEvent && "button" in e && e.button > 0)
    return;
  if (data2.isTouched && data2.isMoved)
    return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = event.composedPath ? event.composedPath() : event.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    $targetEl = $(eventPath[0]);
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0])
      return;
  }
  touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data2, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data2.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0)
    data2.allowThresholdMove = false;
  if (e.type !== "touchstart") {
    let preventDefault = true;
    if ($targetEl.is(data2.focusableElements)) {
      preventDefault = false;
      if ($targetEl[0].nodeName === "SELECT") {
        data2.isTouched = false;
      }
    }
    if (document2.activeElement && $(document2.activeElement).is(data2.focusableElements) && document2.activeElement !== $targetEl[0]) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }
  if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e);
}
function onTouchMove(event) {
  const document2 = getDocument();
  const swiper = this;
  const data2 = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (!data2.isTouched) {
    if (data2.startMoving && data2.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    return;
  }
  if (data2.isTouchEvent && e.type !== "touchmove")
    return;
  const targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
  const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!$(e.target).is(data2.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data2.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data2.touchStartTime = now();
    }
    return;
  }
  if (data2.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data2.isTouched = false;
        data2.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (data2.isTouchEvent && document2.activeElement) {
    if (e.target === document2.activeElement && $(e.target).is(data2.focusableElements)) {
      data2.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data2.allowTouchCallbacks) {
    swiper.emit("touchMove", e);
  }
  if (e.targetTouches && e.targetTouches.length > 1)
    return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
    return;
  if (typeof data2.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data2.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data2.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data2.isScrolling) {
    swiper.emit("touchMoveOpposite", e);
  }
  if (typeof data2.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data2.startMoving = true;
    }
  }
  if (data2.isScrolling) {
    data2.isTouched = false;
    return;
  }
  if (!data2.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  if (!data2.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }
    data2.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
    }
    data2.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e);
  }
  swiper.emit("sliderMove", e);
  data2.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl)
    diff = -diff;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  data2.currentTranslate = diff + data2.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0 && data2.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data2.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data2.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data2.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data2.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data2.startTranslate - diff) ** resistanceRatio;
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data2.currentTranslate < data2.startTranslate) {
    data2.currentTranslate = data2.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data2.currentTranslate > data2.startTranslate) {
    data2.currentTranslate = data2.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data2.currentTranslate = data2.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data2.allowThresholdMove) {
      if (!data2.allowThresholdMove) {
        data2.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data2.currentTranslate = data2.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data2.currentTranslate = data2.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode)
    return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data2.currentTranslate);
  swiper.setTranslate(data2.currentTranslate);
}
function onTouchEnd(event) {
  const swiper = this;
  const data2 = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (data2.allowTouchCallbacks) {
    swiper.emit("touchEnd", e);
  }
  data2.allowTouchCallbacks = false;
  if (!data2.isTouched) {
    if (data2.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data2.isMoved = false;
    data2.startMoving = false;
    return;
  }
  if (params.grabCursor && data2.isMoved && data2.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data2.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit("tap click", e);
    if (timeDiff < 300 && touchEndTime - data2.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e);
    }
  }
  data2.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed)
      swiper.allowClick = true;
  });
  if (!data2.isTouched || !data2.isMoved || !swiper.swipeDirection || touches.diff === 0 || data2.currentTranslate === data2.startTranslate) {
    data2.isTouched = false;
    data2.isMoved = false;
    data2.startMoving = false;
    return;
  }
  data2.isTouched = false;
  data2.isMoved = false;
  data2.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data2.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment2] !== "undefined") {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment2] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else
        swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0)
    return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e) {
  const swiper = this;
  if (!swiper.enabled)
    return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks)
      e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0)
    swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
let dummyEventAttached = false;
function dummyEventListener() {
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support: support2
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!support2.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document2[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document2[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === "touchstart" && support2.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support2.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  }
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
};
function attachEvents() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    support: support2
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  if (support2.touch && !dummyEventAttached) {
    document2.addEventListener("touchstart", dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
const events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
    return;
  const breakpoint = swiper.getBreakpoint(breakpoints2, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint)
    return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base = "window", containerEl) {
  if (!breakpoints2 || base === "container" && !containerEl)
    return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value2 = currentHeight * minRatio;
      return {
        value: value2,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value: value2
    } = points[i];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value2}px)`).matches) {
        breakpoint = point;
      }
    } else if (value2 <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
const breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix2) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix2 + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix2 + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support: support2
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "pointer-events": !support2.touch
  }, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(" "));
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(" "));
  swiper.emitContainerClasses();
}
const classes = {
  addClasses,
  removeClasses
};
function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window2 = getWindow();
  let image;
  function onReady() {
    if (callback)
      callback();
  }
  const isPicture = $(imageEl).parent("picture")[0];
  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window2.Image();
      image.onload = onReady;
      image.onerror = onReady;
      if (sizes) {
        image.sizes = sizes;
      }
      if (srcset) {
        image.srcset = srcset;
      }
      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    onReady();
  }
}
function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find("img");
  function onReady() {
    if (typeof swiper === "undefined" || swiper === null || !swiper || swiper.destroyed)
      return;
    if (swiper.imagesLoaded !== void 0)
      swiper.imagesLoaded += 1;
    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady)
        swiper.update();
      swiper.emit("imagesReady");
    }
  }
  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
  }
}
const images = {
  loadImage,
  preloadImages
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
const checkOverflow$1 = {
  checkOverflow
};
const defaults$1 = {
  init: true,
  direction: "horizontal",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  width: null,
  height: null,
  preventInteractionOnTransition: false,
  userAgent: null,
  url: null,
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  autoHeight: false,
  setWrapperSize: false,
  virtualTranslate: false,
  effect: "slide",
  breakpoints: void 0,
  breakpointsBase: "window",
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  watchOverflow: true,
  roundLengths: false,
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  uniqueNavElements: true,
  resistance: true,
  resistanceRatio: 0.85,
  watchSlidesProgress: false,
  grabCursor: false,
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  preloadImages: true,
  updateOnImagesReady: true,
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopedSlidesLimit: true,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  rewind: false,
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  containerModifierClass: "swiper-",
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-invisible-blank",
  slideActiveClass: "swiper-slide-active",
  slideDuplicateActiveClass: "swiper-slide-duplicate-active",
  slideVisibleClass: "swiper-slide-visible",
  slideDuplicateClass: "swiper-slide-duplicate",
  slideNextClass: "swiper-slide-next",
  slideDuplicateNextClass: "swiper-slide-duplicate-next",
  slidePrevClass: "swiper-slide-prev",
  slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
  wrapperClass: "swiper-wrapper",
  runCallbacksOnInit: true,
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false
      };
    extend(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params)
      params = {};
    params = extend({}, params);
    if (el && !params.el)
      params.el = el;
    if (params.el && $(params.el).length > 1) {
      const swipers = [];
      $(params.el).each((containerEl) => {
        const newParams = extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend({}, defaults$1, allModulesParams);
    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    swiper.$ = $;
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      classNames: [],
      slides: $(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      activeIndex: 0,
      realIndex: 0,
      isBeginning: true,
      isEnd: false,
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      touchEvents: function touchEvents() {
        const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
        const desktop = ["pointerdown", "pointermove", "pointerup"];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        focusableElements: swiper.params.focusableElements,
        lastClickTime: now(),
        clickTimeout: void 0,
        velocities: [],
        allowMomentumBounce: void 0,
        isTouchEvent: void 0,
        startMoving: void 0
      },
      allowClick: true,
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  enable() {
    const swiper = this;
    if (swiper.enabled)
      return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled)
      return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current2 = (max - min) * progress + min;
    swiper.translateTo(current2, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed)
      return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const updates = [];
    swiper.slides.each((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed)
      return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate2();
      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate)
      swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
      return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(el) {
    const swiper = this;
    if (swiper.mounted)
      return true;
    const $el = $(el || swiper.params.el);
    el = $el[0];
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $(el.shadowRoot.querySelector(getWrapperSelector()));
        res.children = (options) => $el.children(options);
        return res;
      }
      if (!$el.children) {
        return $($el).children(getWrapperSelector());
      }
      return $el.children(getWrapperSelector());
    };
    let $wrapperEl = getWrapper();
    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document2 = getDocument();
      const wrapper = document2.createElement("div");
      $wrapperEl = $(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each((slideEl) => {
        $wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
      wrongRTL: $wrapperEl.css("display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized)
      return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false)
      return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    if (swiper.params.loop) {
      swiper.loopCreate();
    }
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    }
    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    swiper.attachEvents();
    swiper.initialized = true;
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr("style");
      $wrapperEl.removeAttr("style");
      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults$1;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__)
      Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m) => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
const swiperBundle_min = "";
const matchName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const iconDefaults = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16,
  rotate: 0,
  vFlip: false,
  hFlip: false
});
function fullIcon(data2) {
  return { ...iconDefaults, ...data2 };
}
const stringToIcon = (value2, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value2.split(":");
  if (value2.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix2 = colonSeparated.pop();
    const result = {
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix: prefix2,
      name: name2
    };
    return validate && !validateIcon(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIcon(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIcon(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIcon = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchName)) && icon.name.match(matchName));
};
function mergeIconData(icon, alias) {
  const result = { ...icon };
  for (const key in iconDefaults) {
    const prop = key;
    if (alias[prop] !== void 0) {
      const value2 = alias[prop];
      if (result[prop] === void 0) {
        result[prop] = value2;
        continue;
      }
      switch (prop) {
        case "rotate":
          result[prop] = (result[prop] + value2) % 4;
          break;
        case "hFlip":
        case "vFlip":
          result[prop] = value2 !== result[prop];
          break;
        default:
          result[prop] = value2;
      }
    }
  }
  return result;
}
function getIconData$1(data2, name, full = false) {
  function getIcon(name2, iteration) {
    if (data2.icons[name2] !== void 0) {
      return Object.assign({}, data2.icons[name2]);
    }
    if (iteration > 5) {
      return null;
    }
    const aliases = data2.aliases;
    if (aliases && aliases[name2] !== void 0) {
      const item = aliases[name2];
      const result2 = getIcon(item.parent, iteration + 1);
      if (result2) {
        return mergeIconData(result2, item);
      }
      return result2;
    }
    const chars = data2.chars;
    if (!iteration && chars && chars[name2] !== void 0) {
      return getIcon(chars[name2], iteration + 1);
    }
    return null;
  }
  const result = getIcon(name, 0);
  if (result) {
    for (const key in iconDefaults) {
      if (result[key] === void 0 && data2[key] !== void 0) {
        result[key] = data2[key];
      }
    }
  }
  return result && full ? fullIcon(result) : result;
}
function isVariation(item) {
  for (const key in iconDefaults) {
    if (item[key] !== void 0) {
      return true;
    }
  }
  return false;
}
function parseIconSet(data2, callback, options) {
  options = options || {};
  const names2 = [];
  if (typeof data2 !== "object" || typeof data2.icons !== "object") {
    return names2;
  }
  if (data2.not_found instanceof Array) {
    data2.not_found.forEach((name) => {
      callback(name, null);
      names2.push(name);
    });
  }
  const icons = data2.icons;
  Object.keys(icons).forEach((name) => {
    const iconData = getIconData$1(data2, name, true);
    if (iconData) {
      callback(name, iconData);
      names2.push(name);
    }
  });
  const parseAliases = options.aliases || "all";
  if (parseAliases !== "none" && typeof data2.aliases === "object") {
    const aliases = data2.aliases;
    Object.keys(aliases).forEach((name) => {
      if (parseAliases === "variations" && isVariation(aliases[name])) {
        return;
      }
      const iconData = getIconData$1(data2, name, true);
      if (iconData) {
        callback(name, iconData);
        names2.push(name);
      }
    });
  }
  return names2;
}
const optionalProperties = {
  provider: "string",
  aliases: "object",
  not_found: "object"
};
for (const prop in iconDefaults) {
  optionalProperties[prop] = typeof iconDefaults[prop];
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data2 = obj;
  if (typeof data2.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  for (const prop in optionalProperties) {
    if (obj[prop] !== void 0 && typeof obj[prop] !== optionalProperties[prop]) {
      return null;
    }
  }
  const icons = data2.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchName) || typeof icon.body !== "string") {
      return null;
    }
    for (const prop in iconDefaults) {
      if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
        return null;
      }
    }
  }
  const aliases = data2.aliases;
  if (aliases) {
    for (const name in aliases) {
      const icon = aliases[name];
      const parent2 = icon.parent;
      if (!name.match(matchName) || typeof parent2 !== "string" || !icons[parent2] && !aliases[parent2]) {
        return null;
      }
      for (const prop in iconDefaults) {
        if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
          return null;
        }
      }
    }
  }
  return data2;
}
const storageVersion = 1;
let storage$1 = /* @__PURE__ */ Object.create(null);
try {
  const w = window || self;
  if (w && w._iconifyStorage.version === storageVersion) {
    storage$1 = w._iconifyStorage.storage;
  }
} catch (err) {
}
function newStorage(provider, prefix2) {
  return {
    provider,
    prefix: prefix2,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ Object.create(null)
  };
}
function getStorage(provider, prefix2) {
  if (storage$1[provider] === void 0) {
    storage$1[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerStorage = storage$1[provider];
  if (providerStorage[prefix2] === void 0) {
    providerStorage[prefix2] = newStorage(provider, prefix2);
  }
  return providerStorage[prefix2];
}
function addIconSet(storage2, data2) {
  if (!quicklyValidateIconSet(data2)) {
    return [];
  }
  const t = Date.now();
  return parseIconSet(data2, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing[name] = t;
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = Object.freeze(fullIcon(icon));
      return true;
    }
  } catch (err) {
  }
  return false;
}
function getIconFromStorage(storage2, name) {
  const value2 = storage2.icons[name];
  return value2 === void 0 ? null : value2;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  return icon ? getIconFromStorage(getStorage(icon.provider, icon.prefix), icon.name) : null;
}
function addIcon(name, data2) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data2);
}
function addCollection(data2, provider) {
  if (typeof data2 !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = typeof data2.provider === "string" ? data2.provider : "";
  }
  if (simpleNames && provider === "" && (typeof data2.prefix !== "string" || data2.prefix === "")) {
    let added = false;
    if (quicklyValidateIconSet(data2)) {
      data2.prefix = "";
      parseIconSet(data2, (name, icon) => {
        if (icon && addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  if (typeof data2.prefix !== "string" || !validateIcon({
    provider,
    prefix: data2.prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, data2.prefix);
  return !!addIconSet(storage2, data2);
}
const defaults = Object.freeze({
  inline: false,
  width: null,
  height: null,
  hAlign: "center",
  vAlign: "middle",
  slice: false,
  hFlip: false,
  vFlip: false,
  rotate: 0
});
function mergeCustomisations(defaults2, item) {
  const result = {};
  for (const key in defaults2) {
    const attr2 = key;
    result[attr2] = defaults2[attr2];
    if (item[attr2] === void 0) {
      continue;
    }
    const value2 = item[attr2];
    switch (attr2) {
      case "inline":
      case "slice":
        if (typeof value2 === "boolean") {
          result[attr2] = value2;
        }
        break;
      case "hFlip":
      case "vFlip":
        if (value2 === true) {
          result[attr2] = !result[attr2];
        }
        break;
      case "hAlign":
      case "vAlign":
        if (typeof value2 === "string" && value2 !== "") {
          result[attr2] = value2;
        }
        break;
      case "width":
      case "height":
        if (typeof value2 === "string" && value2 !== "" || typeof value2 === "number" && value2 || value2 === null) {
          result[attr2] = value2;
        }
        break;
      case "rotate":
        if (typeof value2 === "number") {
          result[attr2] += value2;
        }
        break;
    }
  }
  return result;
}
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision === void 0 ? 100 : precision;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function preserveAspectRatio(props) {
  let result = "";
  switch (props.hAlign) {
    case "left":
      result += "xMin";
      break;
    case "right":
      result += "xMax";
      break;
    default:
      result += "xMid";
  }
  switch (props.vAlign) {
    case "top":
      result += "YMin";
      break;
    case "bottom":
      result += "YMax";
      break;
    default:
      result += "YMid";
  }
  result += props.slice ? " slice" : " meet";
  return result;
}
function iconToSVG(icon, customisations) {
  const box = {
    left: icon.left,
    top: icon.top,
    width: icon.width,
    height: icon.height
  };
  let body = icon.body;
  [icon, customisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
      case 2:
        transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== 0 || box.top !== 0) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  let width, height;
  if (customisations.width === null && customisations.height === null) {
    height = "1em";
    width = calculateSize(height, box.width / box.height);
  } else if (customisations.width !== null && customisations.height !== null) {
    width = customisations.width;
    height = customisations.height;
  } else if (customisations.height !== null) {
    height = customisations.height;
    width = calculateSize(height, box.width / box.height);
  } else {
    width = customisations.width;
    height = calculateSize(width, box.height / box.width);
  }
  if (width === "auto") {
    width = box.width;
  }
  if (height === "auto") {
    height = box.height;
  }
  width = typeof width === "string" ? width : width.toString() + "";
  height = typeof height === "string" ? height : height.toString() + "";
  const result = {
    attributes: {
      width,
      height,
      preserveAspectRatio: preserveAspectRatio(customisations),
      viewBox: box.left.toString() + " " + box.top.toString() + " " + box.width.toString() + " " + box.height.toString()
    },
    body
  };
  if (customisations.inline) {
    result.inline = true;
  }
  return result;
}
const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix2 = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  ids.forEach((id2) => {
    const newID = typeof prefix2 === "function" ? prefix2(id2) : prefix2 + (counter++).toString();
    const escapedID = id2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
  });
  return body;
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    resources,
    path: source.path === void 0 ? "/" : source.path,
    maxURL: source.maxURL ? source.maxURL : 500,
    rotate: source.rotate ? source.rotate : 750,
    timeout: source.timeout ? source.timeout : 5e3,
    random: source.random === true,
    index: source.index ? source.index : 0,
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config2 = createAPIConfig(customConfig);
  if (config2 === null) {
    return false;
  }
  configStorage[provider] = config2;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
const mergeParams = (base, params) => {
  let result = base, hasParams = result.indexOf("?") !== -1;
  function paramToString(value2) {
    switch (typeof value2) {
      case "boolean":
        return value2 ? "true" : "false";
      case "number":
        return encodeURIComponent(value2);
      case "string":
        return encodeURIComponent(value2);
      default:
        throw new Error("Invalid parameter");
    }
  }
  Object.keys(params).forEach((key) => {
    let value2;
    try {
      value2 = paramToString(params[key]);
    } catch (err) {
      return;
    }
    result += (hasParams ? "&" : "?") + encodeURIComponent(key) + "=" + value2;
    hasParams = true;
  });
  return result;
};
const maxLengthCache = {};
const pathCache = {};
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
  return null;
};
let fetchModule = detectFetch();
function calculateMaxLength(provider, prefix2) {
  const config2 = getAPIConfig(provider);
  if (!config2) {
    return 0;
  }
  let result;
  if (!config2.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config2.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = mergeParams(prefix2 + ".json", {
      icons: ""
    });
    result = config2.maxURL - maxHostLength - config2.path.length - url.length;
  }
  const cacheKey = provider + ":" + prefix2;
  pathCache[provider] = config2.path;
  maxLengthCache[cacheKey] = result;
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix2, icons) => {
  const results = [];
  let maxLength = maxLengthCache[prefix2];
  if (maxLength === void 0) {
    maxLength = calculateMaxLength(provider, prefix2);
  }
  const type = "icons";
  let item = {
    type,
    provider,
    prefix: prefix2,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index2) => {
    length += name.length + 1;
    if (length >= maxLength && index2 > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix: prefix2,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    if (pathCache[provider] === void 0) {
      const config2 = getAPIConfig(provider);
      if (!config2) {
        return "/";
      }
      pathCache[provider] = config2.path;
    }
    return pathCache[provider];
  }
  return "/";
}
const send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix2 = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      path += mergeParams(prefix2 + ".json", {
        icons: iconsList
      });
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data2) => {
    if (typeof data2 !== "object" || data2 === null) {
      setTimeout(() => {
        callback("next", defaultError);
      });
      return;
    }
    setTimeout(() => {
      callback("success", data2);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    if (a.prefix !== b.prefix) {
      return a.prefix.localeCompare(b.prefix);
    }
    return a.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix2 = icon.prefix;
    const name = icon.name;
    if (storage2[provider] === void 0) {
      storage2[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerStorage = storage2[provider];
    if (providerStorage[prefix2] === void 0) {
      providerStorage[prefix2] = getStorage(provider, prefix2);
    }
    const localStorage = providerStorage[prefix2];
    let list;
    if (localStorage.icons[name] !== void 0) {
      list = result.loaded;
    } else if (prefix2 === "" || localStorage.missing[name] !== void 0) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix: prefix2,
      name
    };
    list.push(item);
  });
  return result;
}
const callbacks = /* @__PURE__ */ Object.create(null);
const pendingUpdates = /* @__PURE__ */ Object.create(null);
function removeCallback(sources, id2) {
  sources.forEach((source) => {
    const provider = source.provider;
    if (callbacks[provider] === void 0) {
      return;
    }
    const providerCallbacks = callbacks[provider];
    const prefix2 = source.prefix;
    const items = providerCallbacks[prefix2];
    if (items) {
      providerCallbacks[prefix2] = items.filter((row) => row.id !== id2);
    }
  });
}
function updateCallbacks(provider, prefix2) {
  if (pendingUpdates[provider] === void 0) {
    pendingUpdates[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerPendingUpdates = pendingUpdates[provider];
  if (!providerPendingUpdates[prefix2]) {
    providerPendingUpdates[prefix2] = true;
    setTimeout(() => {
      providerPendingUpdates[prefix2] = false;
      if (callbacks[provider] === void 0 || callbacks[provider][prefix2] === void 0) {
        return;
      }
      const items = callbacks[provider][prefix2].slice(0);
      if (!items.length) {
        return;
      }
      const storage2 = getStorage(provider, prefix2);
      let hasPending = false;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix2) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name] !== void 0) {
            icons.loaded.push({
              provider,
              prefix: prefix2,
              name
            });
          } else if (storage2.missing[name] !== void 0) {
            icons.missing.push({
              provider,
              prefix: prefix2,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([
              {
                provider,
                prefix: prefix2
              }
            ], item.id);
          }
          item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
        }
      });
    });
  }
}
let idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id2 = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id2);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id: id2,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((source) => {
    const provider = source.provider;
    const prefix2 = source.prefix;
    if (callbacks[provider] === void 0) {
      callbacks[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerCallbacks = callbacks[provider];
    if (providerCallbacks[prefix2] === void 0) {
      providerCallbacks[prefix2] = [];
    }
    providerCallbacks[prefix2].push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, false, simpleNames2) : item;
    if (!validate || validateIcon(icon, simpleNames2)) {
      result.push({
        provider: icon.provider,
        prefix: icon.prefix,
        name: icon.name
      });
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config2, payload, query, done) {
  const resourcesCount = config2.resources.length;
  const startIndex = config2.random ? Math.floor(Math.random() * resourcesCount) : config2.index;
  let resources;
  if (config2.random) {
    let list = config2.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex2 = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex2]);
      list = list.slice(0, nextIndex2).concat(list.slice(nextIndex2 + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config2.resources.slice(startIndex).concat(config2.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function moduleResponse(item, response, data2) {
    const isError = response !== "success";
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config2.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data2;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data2;
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config2.random) {
      const index2 = config2.resources.indexOf(item.resource);
      if (index2 !== -1 && index2 !== config2.index) {
        config2.index = index2;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data2);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config2.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data2) => {
        moduleResponse(item, status2, data2);
      }
    };
    queue.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config2.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function setConfig(config2) {
  if (typeof config2 !== "object" || typeof config2.resources !== "object" || !(config2.resources instanceof Array) || !config2.resources.length) {
    throw new Error("Invalid Reduncancy configuration");
  }
  const newConfig = /* @__PURE__ */ Object.create(null);
  let key;
  for (key in defaultConfig) {
    if (config2[key] !== void 0) {
      newConfig[key] = config2[key];
    } else {
      newConfig[key] = defaultConfig[key];
    }
  }
  return newConfig;
}
function initRedundancy(cfg) {
  const config2 = setConfig(cfg);
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(config2, payload, queryCallback, (data2, error) => {
      cleanup();
      if (doneCallback) {
        doneCallback(data2, error);
      }
    });
    queries.push(query2);
    return query2;
  }
  function find2(callback) {
    const result = queries.find((value2) => {
      return callback(value2);
    });
    return result !== void 0 ? result : null;
  }
  const instance = {
    query,
    find: find2,
    setIndex: (index2) => {
      config2.index = index2;
    },
    getIndex: () => config2.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
const redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (redundancyCache[provider] === void 0) {
    const config2 = getAPIConfig(provider);
    if (!config2) {
      return;
    }
    const redundancy = initRedundancy(config2);
    const cachedReundancy = {
      config: config2,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config2 = createAPIConfig(target);
    if (config2) {
      redundancy = initRedundancy(config2);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
const cache = {};
function emptyCallback() {
}
const pendingIcons = /* @__PURE__ */ Object.create(null);
const iconsToLoad = /* @__PURE__ */ Object.create(null);
const loaderFlags = /* @__PURE__ */ Object.create(null);
const queueFlags = /* @__PURE__ */ Object.create(null);
function loadedNewIcons(provider, prefix2) {
  if (loaderFlags[provider] === void 0) {
    loaderFlags[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerLoaderFlags = loaderFlags[provider];
  if (!providerLoaderFlags[prefix2]) {
    providerLoaderFlags[prefix2] = true;
    setTimeout(() => {
      providerLoaderFlags[prefix2] = false;
      updateCallbacks(provider, prefix2);
    });
  }
}
const errorsCache = /* @__PURE__ */ Object.create(null);
function loadNewIcons(provider, prefix2, icons) {
  function err() {
    const key = (provider === "" ? "" : "@" + provider + ":") + prefix2;
    const time = Math.floor(Date.now() / 6e4);
    if (errorsCache[key] < time) {
      errorsCache[key] = time;
      console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
    }
  }
  if (iconsToLoad[provider] === void 0) {
    iconsToLoad[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerIconsToLoad = iconsToLoad[provider];
  if (queueFlags[provider] === void 0) {
    queueFlags[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerQueueFlags = queueFlags[provider];
  if (pendingIcons[provider] === void 0) {
    pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerPendingIcons = pendingIcons[provider];
  if (providerIconsToLoad[prefix2] === void 0) {
    providerIconsToLoad[prefix2] = icons;
  } else {
    providerIconsToLoad[prefix2] = providerIconsToLoad[prefix2].concat(icons).sort();
  }
  if (!providerQueueFlags[prefix2]) {
    providerQueueFlags[prefix2] = true;
    setTimeout(() => {
      providerQueueFlags[prefix2] = false;
      const icons2 = providerIconsToLoad[prefix2];
      delete providerIconsToLoad[prefix2];
      const api = getAPIModule(provider);
      if (!api) {
        err();
        return;
      }
      const params = api.prepare(provider, prefix2, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data2, error) => {
          const storage2 = getStorage(provider, prefix2);
          if (typeof data2 !== "object") {
            if (error !== 404) {
              return;
            }
            const t = Date.now();
            item.icons.forEach((name) => {
              storage2.missing[name] = t;
            });
          } else {
            try {
              const parsed = addIconSet(storage2, data2);
              if (!parsed.length) {
                return;
              }
              const pending = providerPendingIcons[prefix2];
              parsed.forEach((name) => {
                delete pending[name];
              });
              if (cache.store) {
                cache.store(provider, data2);
              }
            } catch (err2) {
              console.error(err2);
            }
          }
          loadedNewIcons(provider, prefix2);
        });
      });
    });
  }
}
const loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix2 = icon.prefix;
    if (prefix2 === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix2;
    sources.push({
      provider,
      prefix: prefix2
    });
    if (pendingIcons[provider] === void 0) {
      pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerPendingIcons = pendingIcons[provider];
    if (providerPendingIcons[prefix2] === void 0) {
      providerPendingIcons[prefix2] = /* @__PURE__ */ Object.create(null);
    }
    if (newIcons[provider] === void 0) {
      newIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerNewIcons = newIcons[provider];
    if (providerNewIcons[prefix2] === void 0) {
      providerNewIcons[prefix2] = [];
    }
  });
  const time = Date.now();
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix2 = icon.prefix;
    const name = icon.name;
    const pendingQueue = pendingIcons[provider][prefix2];
    if (pendingQueue[name] === void 0) {
      pendingQueue[name] = time;
      newIcons[provider][prefix2].push(name);
    }
  });
  sources.forEach((source) => {
    const provider = source.provider;
    const prefix2 = source.prefix;
    if (newIcons[provider][prefix2].length) {
      loadNewIcons(provider, prefix2, newIcons[provider][prefix2]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
const cacheVersion = "iconify2";
const cachePrefix = "iconify";
const countKey = cachePrefix + "-count";
const versionKey = cachePrefix + "-version";
const hour = 36e5;
const cacheExpiration = 168;
const config = {
  local: true,
  session: true
};
let loaded = false;
const count = {
  local: 0,
  session: 0
};
const emptyList = {
  local: [],
  session: []
};
let _window = typeof window === "undefined" ? {} : window;
function getGlobal(key) {
  const attr2 = key + "Storage";
  try {
    if (_window && _window[attr2] && typeof _window[attr2].length === "number") {
      return _window[attr2];
    }
  } catch (err) {
  }
  config[key] = false;
  return null;
}
function setCount(storage2, key, value2) {
  try {
    storage2.setItem(countKey, value2.toString());
    count[key] = value2;
    return true;
  } catch (err) {
    return false;
  }
}
function getCount(storage2) {
  const count2 = storage2.getItem(countKey);
  if (count2) {
    const total = parseInt(count2);
    return total ? total : 0;
  }
  return 0;
}
function initCache(storage2, key) {
  try {
    storage2.setItem(versionKey, cacheVersion);
  } catch (err) {
  }
  setCount(storage2, key, 0);
}
function destroyCache(storage2) {
  try {
    const total = getCount(storage2);
    for (let i = 0; i < total; i++) {
      storage2.removeItem(cachePrefix + i.toString());
    }
  } catch (err) {
  }
}
const loadCache = () => {
  if (loaded) {
    return;
  }
  loaded = true;
  const minTime = Math.floor(Date.now() / hour) - cacheExpiration;
  function load(key) {
    const func = getGlobal(key);
    if (!func) {
      return;
    }
    const getItem = (index2) => {
      const name = cachePrefix + index2.toString();
      const item = func.getItem(name);
      if (typeof item !== "string") {
        return false;
      }
      let valid = true;
      try {
        const data2 = JSON.parse(item);
        if (typeof data2 !== "object" || typeof data2.cached !== "number" || data2.cached < minTime || typeof data2.provider !== "string" || typeof data2.data !== "object" || typeof data2.data.prefix !== "string") {
          valid = false;
        } else {
          const provider = data2.provider;
          const prefix2 = data2.data.prefix;
          const storage2 = getStorage(provider, prefix2);
          valid = addIconSet(storage2, data2.data).length > 0;
        }
      } catch (err) {
        valid = false;
      }
      if (!valid) {
        func.removeItem(name);
      }
      return valid;
    };
    try {
      const version2 = func.getItem(versionKey);
      if (version2 !== cacheVersion) {
        if (version2) {
          destroyCache(func);
        }
        initCache(func, key);
        return;
      }
      let total = getCount(func);
      for (let i = total - 1; i >= 0; i--) {
        if (!getItem(i)) {
          if (i === total - 1) {
            total--;
          } else {
            emptyList[key].push(i);
          }
        }
      }
      setCount(func, key, total);
    } catch (err) {
    }
  }
  for (const key in config) {
    load(key);
  }
};
const storeCache = (provider, data2) => {
  if (!loaded) {
    loadCache();
  }
  function store(key) {
    if (!config[key]) {
      return false;
    }
    const func = getGlobal(key);
    if (!func) {
      return false;
    }
    let index2 = emptyList[key].shift();
    if (index2 === void 0) {
      index2 = count[key];
      if (!setCount(func, key, index2 + 1)) {
        return false;
      }
    }
    try {
      const item = {
        cached: Math.floor(Date.now() / hour),
        provider,
        data: data2
      };
      func.setItem(cachePrefix + index2.toString(), JSON.stringify(item));
    } catch (err) {
      return false;
    }
    return true;
  }
  if (!Object.keys(data2.icons).length) {
    return;
  }
  if (data2.not_found) {
    data2 = Object.assign({}, data2);
    delete data2.not_found;
  }
  if (!store("local")) {
    store("session");
  }
};
const separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value2 = str.trim();
    switch (value2) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function alignmentFromString(custom, align) {
  align.split(separator).forEach((str) => {
    const value2 = str.trim();
    switch (value2) {
      case "left":
      case "center":
      case "right":
        custom.hAlign = value2;
        break;
      case "top":
      case "middle":
      case "bottom":
        custom.vAlign = value2;
        break;
      case "slice":
      case "crop":
        custom.slice = true;
        break;
      case "meet":
        custom.slice = false;
    }
  });
}
function rotateFromString(value2, defaultValue = 0) {
  const units = value2.replace(/^-?[0-9.]*/, "");
  function cleanup(value22) {
    while (value22 < 0) {
      value22 += 4;
    }
    return value22 % 4;
  }
  if (units === "") {
    const num = parseInt(value2);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value2) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value2.slice(0, value2.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
const svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
function render(icon, props) {
  const customisations = mergeCustomisations(defaults, props);
  const componentProps = { ...svgDefaults };
  let style = typeof props.style === "string" ? props.style : "";
  for (let key in props) {
    const value2 = props[key];
    if (value2 === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value2 === true || value2 === "true" || value2 === 1;
        break;
      case "flip":
        if (typeof value2 === "string") {
          flipFromString(customisations, value2);
        }
        break;
      case "align":
        if (typeof value2 === "string") {
          alignmentFromString(customisations, value2);
        }
        break;
      case "color":
        style = style + (style.length > 0 && style.trim().slice(-1) !== ";" ? ";" : "") + "color: " + value2 + "; ";
        break;
      case "rotate":
        if (typeof value2 === "string") {
          customisations[key] = rotateFromString(value2);
        } else if (typeof value2 === "number") {
          customisations[key] = value2;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value2 !== true && value2 !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default:
        if (key.slice(0, 3) === "on:") {
          break;
        }
        if (defaults[key] === void 0) {
          componentProps[key] = value2;
        }
    }
  }
  const item = iconToSVG(icon, customisations);
  for (let key in item.attributes) {
    componentProps[key] = item.attributes[key];
  }
  if (item.inline) {
    style = "vertical-align: -0.125em; " + style;
  }
  if (style !== "") {
    componentProps.style = style;
  }
  let localCounter = 0;
  let id2 = props.id;
  if (typeof id2 === "string") {
    id2 = id2.replace(/-/g, "_");
  }
  return {
    attributes: componentProps,
    body: replaceIDs(item.body, id2 ? () => id2 + "ID" + localCounter++ : "iconifySvelte")
  };
}
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  cache.store = storeCache;
  loadCache();
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (typeof item !== "object" || item === null || item instanceof Array || typeof item.icons !== "object" || typeof item.prefix !== "string" || !addCollection(item)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window2.IconifyProviders !== void 0) {
    const providers = _window2.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value2 = providers[key];
          if (typeof value2 !== "object" || !value2 || value2.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value2)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
function checkIconState(icon, state, mounted, callback, onload) {
  function abortLoading() {
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  }
  if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
    state.name = "";
    abortLoading();
    return { data: fullIcon(icon) };
  }
  let iconName;
  if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
    abortLoading();
    return null;
  }
  const data2 = getIconData(iconName);
  if (data2 === null) {
    if (mounted && (!state.loading || state.loading.name !== icon)) {
      abortLoading();
      state.name = "";
      state.loading = {
        name: icon,
        abort: loadIcons([iconName], callback)
      };
    }
    return null;
  }
  abortLoading();
  if (state.name !== icon) {
    state.name = icon;
    if (onload && !state.destroyed) {
      onload(icon);
    }
  }
  const classes2 = ["iconify"];
  if (iconName.prefix !== "") {
    classes2.push("iconify--" + iconName.prefix);
  }
  if (iconName.provider !== "") {
    classes2.push("iconify--" + iconName.provider);
  }
  return { data: data2, classes: classes2 };
}
function generateIcon(icon, props) {
  return icon ? render(icon, props) : null;
}
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const state = {
    name: "",
    loading: null,
    destroyed: false
  };
  let mounted = false;
  let data2;
  const onLoad = (icon) => {
    if (typeof $$props.onLoad === "function") {
      $$props.onLoad(icon);
    }
    const dispatch = createEventDispatcher();
    dispatch("load", { icon });
  };
  function loaded2() {
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
      const iconData = checkIconState($$props.icon, state, mounted, loaded2, onLoad);
      data2 = iconData ? generateIcon(iconData.data, $$props) : null;
      if (data2 && iconData.classes) {
        data2.attributes["class"] = (typeof $$props["class"] === "string" ? $$props["class"] + " " : "") + iconData.classes.join(" ");
      }
    }
  }
  return `${data2 !== null ? `<svg${spread([escape_object(data2.attributes)], {})}><!-- HTML_TAG_START -->${data2.body}<!-- HTML_TAG_END --></svg>` : ``}`;
});
const Icon_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes2;
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
  classes2 = classname("icon", { color, filled, size }, $$props.class, true);
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({ icon: pack + ":" + name }, { width: "auto" }, { height: "auto" }, $$restProps, { class: classes2 }), {}, {})}`;
});
const prism = "";
typeof process !== "undefined" && process.hrtime ? () => {
  const t = process.hrtime();
  return t[0] * 1e3 + t[1] / 1e6;
} : () => self.performance.now();
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];
var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i = 0; i < set.length; i += 2) {
    pos += set[i];
    if (pos > code) {
      return false;
    }
    pos += set[i + 1];
    if (pos >= code) {
      return true;
    }
  }
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0)
    conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true }, startsExpr = { startsExpr: true };
var keywords = {};
function kw(name, options) {
  if (options === void 0)
    options = {};
  options.keyword = name;
  return keywords[name] = new TokenType(name, options);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
  if (end === void 0)
    end = code.length;
  for (var i = from; i < end; i++) {
    var next2 = code.charCodeAt(i);
    if (isNewLine(next2)) {
      return i < end - 1 && next2 === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1;
    }
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};
var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};
function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}
function codePointToString(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset2(n) {
  return new Position(this.line, this.column + n);
};
var SourceLocation = function SourceLocation2(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};
function getLineInfo(input, offset3) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset3);
    if (nextBreak < 0) {
      return new Position(line, offset3 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
var defaultOptions = {
  ecmaVersion: null,
  sourceType: "script",
  onInsertedSemicolon: null,
  onTrailingComma: null,
  allowReserved: null,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  allowAwaitOutsideFunction: null,
  allowSuperOutsideMethod: null,
  allowHashBang: false,
  locations: false,
  onToken: null,
  onComment: null,
  ranges: false,
  program: null,
  sourceFile: null,
  directSourceFile: null,
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text2, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text2,
      start,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5;
var Parser = function Parser2(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
  this.privateNameStack = [];
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Parser.prototype.parse = function parse2() {
  var node2 = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node2);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.canAwait.get = function() {
  for (var i = this.scopeStack.length - 1; i >= 0; i--) {
    var scope2 = this.scopeStack[i];
    if (scope2.inClassFieldInit || scope2.flags & SCOPE_CLASS_STATIC_BLOCK) {
      return false;
    }
    if (scope2.flags & SCOPE_FUNCTION) {
      return (scope2.flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  var inClassFieldInit = ref2.inClassFieldInit;
  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  var inClassFieldInit = ref2.inClassFieldInit;
  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend2() {
  var plugins = [], len = arguments.length;
  while (len--)
    plugins[len] = arguments[len];
  var cls = this;
  for (var i = 0; i < plugins.length; i++) {
    cls = plugins[i](cls);
  }
  return cls;
};
Parser.parse = function parse3(input, options) {
  return new this(options, input).parse();
};
Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
  var parser2 = new this(options, input, pos);
  parser2.nextToken();
  return parser2.parseExpression();
};
Parser.tokenizer = function tokenizer(input, options) {
  return new this(options, input);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next2 = this.input.charAt(end);
      return next2 === ";" || next2 === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next2) || next2 === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node2) {
  var exports = /* @__PURE__ */ Object.create(null);
  if (!node2.body) {
    node2.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node2.body.push(stmt);
  }
  if (this.inModule) {
    for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1) {
      var name = list[i];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node2.body);
  this.next();
  node2.sourceType = this.options.sourceType;
  return this.finishNode(node2, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next2 = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next2);
  if (nextCh === 91 || nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next2 + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
      return true;
    }
    var ident = this.input.slice(next2, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next2 = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next2)) && this.input.slice(next2, next2 + 8) === "function" && (next2 + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next2 + 8)) || after > 55295 && after < 56320));
};
pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node2 = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node2, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node2);
    case types$1._do:
      return this.parseDoStatement(node2);
    case types$1._for:
      return this.parseForStatement(node2);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node2, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node2, true);
    case types$1._if:
      return this.parseIfStatement(node2);
    case types$1._return:
      return this.parseReturnStatement(node2);
    case types$1._switch:
      return this.parseSwitchStatement(node2);
    case types$1._throw:
      return this.parseThrowStatement(node2);
    case types$1._try:
      return this.parseTryStatement(node2);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node2, kind);
    case types$1._while:
      return this.parseWhileStatement(node2);
    case types$1._with:
      return this.parseWithStatement(node2);
    case types$1.braceL:
      return this.parseBlock(true, node2);
    case types$1.semi:
      return this.parseEmptyStatement(node2);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next2 = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next2);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node2, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node2) : this.parseExport(node2, exports);
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node2, true, !context);
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node2, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node2, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node2, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node2.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node2.label = this.parseIdent();
    this.semicolon();
  }
  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this.labels[i];
    if (node2.label == null || lab.name === node2.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node2.label && isBreak) {
        break;
      }
    }
  }
  if (i === this.labels.length) {
    this.raise(node2.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node2, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node2) {
  this.next();
  this.semicolon();
  return this.finishNode(node2, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node2) {
  this.next();
  this.labels.push(loopLabel);
  node2.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node2.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node2, "DoWhileStatement");
};
pp$8.parseForStatement = function(node2) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node2, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else {
          node2.await = awaitAt > -1;
        }
      }
      return this.parseForIn(node2, init$1);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node2, init$1);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var refDestructuringErrors = new DestructuringErrors();
  var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types$1._in) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
      } else {
        node2.await = awaitAt > -1;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node2, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node2, init);
};
pp$8.parseFunctionStatement = function(node2, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node2, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node2) {
  this.next();
  node2.test = this.parseParenExpression();
  node2.consequent = this.parseStatement("if");
  node2.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node2, "IfStatement");
};
pp$8.parseReturnStatement = function(node2) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node2.argument = null;
  } else {
    node2.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node2, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node2) {
  this.next();
  node2.discriminant = this.parseParenExpression();
  node2.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node2.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node2, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node2) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node2.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node2, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseTryStatement = function(node2) {
  this.next();
  node2.block = this.parseBlock();
  node2.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseBindingAtom();
      var simple = clause.param.type === "Identifier";
      this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
      this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
      this.expect(types$1.parenR);
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node2.handler = this.finishNode(clause, "CatchClause");
  }
  node2.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node2.handler && !node2.finalizer) {
    this.raise(node2.start, "Missing catch or finally clause");
  }
  return this.finishNode(node2, "TryStatement");
};
pp$8.parseVarStatement = function(node2, kind) {
  this.next();
  this.parseVar(node2, false, kind);
  this.semicolon();
  return this.finishNode(node2, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node2) {
  this.next();
  node2.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node2.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node2, "WhileStatement");
};
pp$8.parseWithStatement = function(node2) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node2.object = this.parseParenExpression();
  node2.body = this.parseStatement("with");
  return this.finishNode(node2, "WithStatement");
};
pp$8.parseEmptyStatement = function(node2) {
  this.next();
  return this.finishNode(node2, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node2, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
    var label = list[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this.labels[i];
    if (label$1.statementStart === node2.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node2.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node2.label = expr;
  return this.finishNode(node2, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node2, expr) {
  node2.expression = expr;
  this.semicolon();
  return this.finishNode(node2, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node2, exitStrict) {
  if (createNewLexicalScope === void 0)
    createNewLexicalScope = true;
  if (node2 === void 0)
    node2 = this.startNode();
  node2.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node2.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node2, "BlockStatement");
};
pp$8.parseFor = function(node2, init) {
  node2.init = init;
  this.expect(types$1.semi);
  node2.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node2.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node2.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node2, "ForStatement");
};
pp$8.parseForIn = function(node2, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  }
  node2.left = init;
  node2.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node2.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node2, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node2, isFor, kind) {
  node2.declarations = [];
  node2.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node2.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node2;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node2, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node2);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node2.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node2.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node2.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node2.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node2.id, this.strict || node2.generator || node2.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node2.async, node2.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node2.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node2);
  this.parseFunctionBody(node2, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node2, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node2) {
  this.expect(types$1.parenL);
  node2.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node2, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node2, isStatement);
  this.parseClassSuper(node2);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node2.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raise(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node2.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node2, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion = this.options.ecmaVersion;
  var node2 = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node2);
      return node2;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node2.static = isStatic;
  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node2.computed = false;
    node2.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node2.key.name = keyName;
    this.finishNode(node2.key, "Identifier");
  } else {
    this.parseClassElementName(node2);
  }
  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node2.static && checkKeyName(node2, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node2.key.start, "Constructor can't have get/set modifier");
    }
    node2.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node2, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node2);
  }
  return node2;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value2 = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value2.params.length !== 0) {
    this.raiseRecoverable(value2.start, "getter should have no params");
  }
  if (method.kind === "set" && value2.params.length !== 1) {
    this.raiseRecoverable(value2.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value2.params[0].type === "RestElement") {
    this.raiseRecoverable(value2.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    var scope2 = this.currentThisScope();
    var inClassFieldInit = scope2.inClassFieldInit;
    scope2.inClassFieldInit = true;
    field.value = this.parseMaybeAssign();
    scope2.inClassFieldInit = inClassFieldInit;
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node2) {
  node2.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node2.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node2, "StaticBlock");
};
pp$8.parseClassId = function(node2, isStatement) {
  if (this.type === types$1.name) {
    node2.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node2.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node2.id = null;
  }
};
pp$8.parseClassSuper = function(node2) {
  node2.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(false) : null;
};
pp$8.enterClassBody = function() {
  var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  this.privateNameStack.push(element);
  return element.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  var len = this.privateNameStack.length;
  var parent2 = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i = 0; i < used.length; ++i) {
    var id2 = used[i];
    if (!hasOwn(declared, id2.name)) {
      if (parent2) {
        parent2.used.push(id2);
      } else {
        this.raiseRecoverable(id2.start, "Private field '#" + id2.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next2 = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next2 = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next2 === "iset" || curr === "iset" && next2 === "iget" || curr === "sget" && next2 === "sset" || curr === "sset" && next2 === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next2;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node2, name) {
  var computed = node2.computed;
  var key = node2.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
pp$8.parseExport = function(node2, exports) {
  this.next();
  if (this.eat(types$1.star)) {
    if (this.options.ecmaVersion >= 11) {
      if (this.eatContextual("as")) {
        node2.exported = this.parseModuleExportName();
        this.checkExport(exports, node2.exported, this.lastTokStart);
      } else {
        node2.exported = null;
      }
    }
    this.expectContextual("from");
    if (this.type !== types$1.string) {
      this.unexpected();
    }
    node2.source = this.parseExprAtom();
    this.semicolon();
    return this.finishNode(node2, "ExportAllDeclaration");
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    var isAsync;
    if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
      var fNode = this.startNode();
      this.next();
      if (isAsync) {
        this.next();
      }
      node2.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
    } else if (this.type === types$1._class) {
      var cNode = this.startNode();
      node2.declaration = this.parseClass(cNode, "nullableID");
    } else {
      node2.declaration = this.parseMaybeAssign();
      this.semicolon();
    }
    return this.finishNode(node2, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node2.declaration = this.parseStatement(null);
    if (node2.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node2.declaration.declarations);
    } else {
      this.checkExport(exports, node2.declaration.id, node2.declaration.id.start);
    }
    node2.specifiers = [];
    node2.source = null;
  } else {
    node2.declaration = null;
    node2.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node2.source = this.parseExprAtom();
    } else {
      for (var i = 0, list = node2.specifiers; i < list.length; i += 1) {
        var spec = list[i];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node2.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node2, "ExportNamedDeclaration");
};
pp$8.checkExport = function(exports, name, pos) {
  if (!exports) {
    return;
  }
  if (typeof name !== "string") {
    name = name.type === "Identifier" ? name.name : name.value;
  }
  if (hasOwn(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};
pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i = 0, list = pat.properties; i < list.length; i += 1) {
      var prop = list[i];
      this.checkPatternExport(exports, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  } else if (type === "ParenthesizedExpression") {
    this.checkPatternExport(exports, pat.expression);
  }
};
pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) {
    return;
  }
  for (var i = 0, list = decls; i < list.length; i += 1) {
    var decl = list[i];
    this.checkPatternExport(exports, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var node2 = this.startNode();
    node2.local = this.parseModuleExportName();
    node2.exported = this.eatContextual("as") ? this.parseModuleExportName() : node2.local;
    this.checkExport(
      exports,
      node2.exported,
      node2.exported.start
    );
    nodes.push(this.finishNode(node2, "ExportSpecifier"));
  }
  return nodes;
};
pp$8.parseImport = function(node2) {
  this.next();
  if (this.type === types$1.string) {
    node2.specifiers = empty$1;
    node2.source = this.parseExprAtom();
  } else {
    node2.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node2.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node2, "ImportDeclaration");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    var node2 = this.startNode();
    node2.local = this.parseIdent();
    this.checkLValSimple(node2.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node2, "ImportDefaultSpecifier"));
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    var node$1 = this.startNode();
    this.next();
    this.expectContextual("as");
    node$1.local = this.parseIdent();
    this.checkLValSimple(node$1.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var node$2 = this.startNode();
    node$2.imported = this.parseModuleExportName();
    if (this.eatContextual("as")) {
      node$2.local = this.parseIdent();
    } else {
      this.checkUnreserved(node$2.imported);
      node$2.local = node$2.imported;
    }
    this.checkLValSimple(node$2.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$2, "ImportSpecifier"));
  }
  return nodes;
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node2, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node2) {
    switch (node2.type) {
      case "Identifier":
        if (this.inAsync && node2.name === "await") {
          this.raise(node2.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node2.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i = 0, list = node2.properties; i < list.length; i += 1) {
          var prop = list[i];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node2.kind !== "init") {
          this.raise(node2.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node2.value, isBinding);
        break;
      case "ArrayExpression":
        node2.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node2.elements, isBinding);
        break;
      case "SpreadElement":
        node2.type = "RestElement";
        this.toAssignable(node2.argument, isBinding);
        if (node2.argument.type === "AssignmentPattern") {
          this.raise(node2.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node2.operator !== "=") {
          this.raise(node2.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node2.type = "AssignmentPattern";
        delete node2.operator;
        this.toAssignable(node2.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node2.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node2.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node2.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node2;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node2 = this.startNode();
  this.next();
  node2.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node2, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node2 = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node2.argument = this.parseBindingAtom();
  return this.finishNode(node2, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node2 = this.startNode();
        this.next();
        node2.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node2, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      var elem = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(elem);
      elts.push(elem);
    }
  }
  return elts;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node2 = this.startNodeAt(startPos, startLoc);
  node2.left = left;
  node2.right = this.parseMaybeAssign();
  return this.finishNode(node2, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0)
    bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0)
    bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1) {
        var prop = list[i];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0)
    bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent2 = this.curContext();
  if (parent2 === types.f_expr || parent2 === types.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent2 === types.b_stat || parent2 === types.b_expr)) {
    return !parent2.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent2 === types.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update2, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update2 = type.updateContext) {
    update2.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
    this.context.push(types.f_expr);
  } else {
    this.context.push(types.f_stat);
  }
  this.exprAllowed = false;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index2 = this.context.length - 1;
    if (this.context[index2] === types.f_expr) {
      this.context[index2] = types.f_expr_gen;
    } else {
      this.context[index2] = types.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node2 = this.startNodeAt(startPos, startLoc);
    node2.expressions = [expr];
    while (this.eat(types$1.comma)) {
      node2.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    }
    return this.finishNode(node2, "SequenceExpression");
  }
  return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node2 = this.startNodeAt(startPos, startLoc);
    node2.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node2.left = left;
    this.next();
    node2.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node2, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types$1.question)) {
    var node2 = this.startNodeAt(startPos, startLoc);
    node2.test = expr;
    node2.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node2.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node2, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node2 = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node2, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node2 = this.startNodeAt(startPos, startLoc);
  node2.left = left;
  node2.operator = op;
  node2.right = right;
  return this.finishNode(node2, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node2 = this.startNode(), update2 = this.type === types$1.incDec;
    node2.operator = this.value;
    node2.prefix = true;
    this.next();
    node2.argument = this.parseMaybeUnary(null, true, update2, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update2) {
      this.checkLValSimple(node2.argument);
    } else if (this.strict && node2.operator === "delete" && node2.argument.type === "Identifier") {
      this.raiseRecoverable(node2.start, "Deleting local variable in strict mode");
    } else if (node2.operator === "delete" && isPrivateFieldAccess(node2.argument)) {
      this.raiseRecoverable(node2.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node2, update2 ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if (forInit || this.privateNameStack.length === 0) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isPrivateFieldAccess(node2) {
  return node2.type === "MemberExpression" && node2.property.type === "PrivateIdentifier" || node2.type === "ChainExpression" && isPrivateFieldAccess(node2.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base = element;
  }
};
pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node2 = this.startNodeAt(startPos, startLoc);
    node2.object = base;
    if (computed) {
      node2.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node2.property = this.parsePrivateIdent();
    } else {
      node2.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node2.computed = !!computed;
    if (optionalSupported) {
      node2.optional = optional;
    }
    base = this.finishNode(node2, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node2, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node2 = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node2.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node2, "Super");
    case types$1._this:
      node2 = this.startNode();
      this.next();
      return this.finishNode(node2, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id2 = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id2.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id2.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id2 = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], true, forInit);
        }
      }
      return id2;
    case types$1.regexp:
      var value2 = this.value;
      node2 = this.parseLiteral(value2.value);
      node2.regex = { pattern: value2.pattern, flags: value2.flags };
      return node2;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node2 = this.startNode();
      node2.value = this.type === types$1._null ? null : this.type === types$1._true;
      node2.raw = this.type.keyword;
      this.next();
      return this.finishNode(node2, "Literal");
    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types$1.bracketL:
      node2 = this.startNode();
      this.next();
      node2.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node2, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node2 = this.startNode();
      this.next();
      return this.parseFunction(node2, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport();
      } else {
        return this.unexpected();
      }
    default:
      this.unexpected();
  }
};
pp$5.parseExprImport = function() {
  var node2 = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  var meta = this.parseIdent(true);
  switch (this.type) {
    case types$1.parenL:
      return this.parseDynamicImport(node2);
    case types$1.dot:
      node2.meta = meta;
      return this.parseImportMeta(node2);
    default:
      this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node2) {
  this.next();
  node2.source = this.parseMaybeAssign();
  if (!this.eat(types$1.parenR)) {
    var errorPos = this.start;
    if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
      this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
    } else {
      this.unexpected(errorPos);
    }
  }
  return this.finishNode(node2, "ImportExpression");
};
pp$5.parseImportMeta = function(node2) {
  this.next();
  var containsEsc = this.containsEsc;
  node2.property = this.parseIdent(true);
  if (node2.property.name !== "meta") {
    this.raiseRecoverable(node2.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node2.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node2.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node2, "MetaProperty");
};
pp$5.parseLiteral = function(value2) {
  var node2 = this.startNode();
  node2.value = value2;
  node2.raw = this.input.slice(this.start, this.end);
  if (node2.raw.charCodeAt(node2.raw.length - 1) === 110) {
    node2.bigint = node2.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node2, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node2 = this.startNode();
  var meta = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(types$1.dot)) {
    node2.meta = meta;
    var containsEsc = this.containsEsc;
    node2.property = this.parseIdent(true);
    if (node2.property.name !== "target") {
      this.raiseRecoverable(node2.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node2.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node2.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node2, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types$1._import;
  node2.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
  if (isImport && node2.callee.type === "ImportExpression") {
    this.raise(startPos, "Cannot use new with import()");
  }
  if (this.eat(types$1.parenL)) {
    node2.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node2.arguments = empty;
  }
  return this.finishNode(node2, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value,
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0)
    isTagged = false;
  var node2 = this.startNode();
  this.next();
  node2.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node2.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node2.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node2.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node2, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node2 = this.startNode(), first = true, propHash = {};
  node2.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node2.properties.push(prop);
  }
  return this.finishNode(node2, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    if (this.type === types$1.parenL && refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0) {
        refDestructuringErrors.parenthesizedAssign = this.start;
      }
      if (refDestructuringErrors.parenthesizedBind < 0) {
        refDestructuringErrors.parenthesizedBind = this.start;
      }
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop, refDestructuringErrors);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    prop.kind = prop.key.name;
    this.parsePropertyName(prop);
    prop.value = this.parseMethod(false);
    var paramCount = prop.kind === "get" ? 0 : 1;
    if (prop.value.params.length !== paramCount) {
      var start = prop.value.start;
      if (prop.kind === "get") {
        this.raiseRecoverable(start, "getter should have no params");
      } else {
        this.raiseRecoverable(start, "setter should have exactly one param");
      }
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
        this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
      }
    }
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node2) {
  node2.id = null;
  if (this.options.ecmaVersion >= 6) {
    node2.generator = node2.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node2.async = false;
  }
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node2 = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node2);
  if (this.options.ecmaVersion >= 6) {
    node2.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node2.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node2.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node2.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node2, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node2, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node2, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node2);
  if (this.options.ecmaVersion >= 8) {
    node2.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node2.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node2, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node2, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node2, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node2.body = this.parseMaybeAssign(forInit);
    node2.expression = true;
    this.checkParams(node2, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node2.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node2.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node2, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node2.params));
    if (this.strict && node2.id) {
      this.checkLValSimple(node2.id, BIND_OUTSIDE);
    }
    node2.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node2.expression = false;
    this.adaptDirectivePrologue(node2.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i = 0, list = params; i < list.length; i += 1) {
    var param = list[i];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node2, allowDuplicates) {
  var nameHash = /* @__PURE__ */ Object.create(null);
  for (var i = 0, list = node2.params; i < list.length; i += 1) {
    var param = list[i];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (this.currentThisScope().inClassFieldInit && name === "arguments") {
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
    this.raise(start, "Cannot use " + name + " in class static initialization block");
  }
  if (this.keywords.test(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re2 = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re2.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal, isBinding) {
  var node2 = this.startNode();
  if (this.type === types$1.name) {
    node2.name = this.value;
  } else if (this.type.keyword) {
    node2.name = this.type.keyword;
    if ((node2.name === "class" || node2.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
  } else {
    this.unexpected();
  }
  this.next(!!liberal);
  this.finishNode(node2, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node2);
    if (node2.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node2.start;
    }
  }
  return node2;
};
pp$5.parsePrivateIdent = function() {
  var node2 = this.startNode();
  if (this.type === types$1.privateId) {
    node2.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node2, "PrivateIdentifier");
  if (this.privateNameStack.length === 0) {
    this.raise(node2.start, "Private field '#" + node2.name + "' must be declared in an enclosing class");
  } else {
    this.privateNameStack[this.privateNameStack.length - 1].used.push(node2);
  }
  return node2;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node2 = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node2.delegate = false;
    node2.argument = null;
  } else {
    node2.delegate = this.eat(types$1.star);
    node2.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node2, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node2 = this.startNode();
  this.next();
  node2.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node2, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
  this.inClassFieldInit = false;
};
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope2) {
  return scope2.flags & SCOPE_FUNCTION || !this.inModule && scope2.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope2 = this.currentScope();
    redeclared = scope2.lexical.indexOf(name) > -1 || scope2.functions.indexOf(name) > -1 || scope2.var.indexOf(name) > -1;
    scope2.lexical.push(name);
    if (this.inModule && scope2.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var scope$3 = this.scopeStack[i];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id2) {
  if (this.scopeStack[0].lexical.indexOf(id2.name) === -1 && this.scopeStack[0].var.indexOf(id2.name) === -1) {
    this.undefinedExports[id2.name] = id2;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope2 = this.scopeStack[i];
    if (scope2.flags & SCOPE_VAR) {
      return scope2;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope2 = this.scopeStack[i];
    if (scope2.flags & SCOPE_VAR && !(scope2.flags & SCOPE_ARROW)) {
      return scope2;
    }
  }
};
var Node = function Node2(parser2, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser2.options.locations) {
    this.loc = new SourceLocation(parser2, loc);
  }
  if (parser2.options.directSourceFile) {
    this.sourceFile = parser2.options.directSourceFile;
  }
  if (parser2.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node2, type, pos, loc) {
  node2.type = type;
  node2.end = pos;
  if (this.options.locations) {
    node2.loc.end = loc;
  }
  if (this.options.ranges) {
    node2.range[1] = pos;
  }
  return node2;
}
pp$2.finishNode = function(node2, type) {
  return finishNodeAt.call(this, node2, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node2, type, pos, loc) {
  return finishNodeAt.call(this, node2, type, pos, loc);
};
pp$2.copyNode = function(node2) {
  var newNode = new Node(this, node2.start, this.startLoc);
  for (var prop in node2) {
    newNode[prop] = node2[prop];
  }
  return newNode;
};
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion) {
  var d = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
for (var i = 0, list = [9, 10, 11, 12, 13]; i < list.length; i += 1) {
  var ecmaVersion = list[i];
  buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser.prototype;
var RegExpValidationState = function RegExpValidationState2(parser2) {
  this.parser = parser2;
  this.validFlags = "gim" + (parser2.options.ecmaVersion >= 6 ? "uy" : "") + (parser2.options.ecmaVersion >= 9 ? "s" : "") + (parser2.options.ecmaVersion >= 13 ? "d" : "");
  this.unicodeProperties = data[parser2.options.ecmaVersion >= 13 ? 13 : parser2.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = [];
  this.backReferenceNames = [];
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
  this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i, forceU) {
  if (forceU === void 0)
    forceU = false;
  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return -1;
  }
  var c = s.charCodeAt(i);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l) {
    return c;
  }
  var next2 = s.charCodeAt(i + 1);
  return next2 >= 56320 && next2 <= 57343 ? (c << 10) + next2 - 56613888 : c;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i, forceU) {
  if (forceU === void 0)
    forceU = false;
  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return l;
  }
  var c = s.charCodeAt(i), next2;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l || (next2 = s.charCodeAt(i + 1)) < 56320 || next2 > 57343) {
    return i + 1;
  }
  return i + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0)
    forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0)
    forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
  if (forceU === void 0)
    forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
  if (forceU === void 0)
    forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  for (var i = 0; i < flags.length; i++) {
    var flag = flags.charAt(i);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
  }
};
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames.length = 0;
  state.backReferenceNames.length = 0;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(41)) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(93) || state.eat(125)) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
    var name = list[i];
    if (state.groupNames.indexOf(name) === -1) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  this.regexp_alternative(state);
  while (state.eat(124)) {
    this.regexp_alternative(state);
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(123)) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(94) || state.eat(36)) {
    return true;
  }
  if (state.eat(92)) {
    if (state.eat(66) || state.eat(98)) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(40) && state.eat(63)) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(60);
    }
    if (state.eat(61) || state.eat(33)) {
      this.regexp_disjunction(state);
      if (!state.eat(41)) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0)
    noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(63);
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(42) || state.eat(43) || state.eat(63) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(123)) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(44) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(125)) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(92)) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(40)) {
    if (state.eat(63) && state.eat(58)) {
      this.regexp_disjunction(state);
      if (state.eat(41)) {
        return true;
      }
      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(40)) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(41)) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(63)) {
    if (this.regexp_eatGroupName(state)) {
      if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
        state.raise("Duplicate capture group name");
      }
      state.groupNames.push(state.lastStringValue);
      return;
    }
    state.raise("Invalid group");
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(60)) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(62)) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true;
    }
    if (n <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(107)) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(99)) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0)
    forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(117)) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(92) && state.eat(117) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(123) && this.regexp_eatHexDigits(state) && state.eat(125) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(47)) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return true;
  }
  if (state.switchU && this.options.ecmaVersion >= 9 && (ch === 80 || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    if (state.eat(123) && this.regexp_eatUnicodePropertyValueExpression(state) && state.eat(125)) {
      return true;
    }
    state.raise("Invalid property name");
  }
  return false;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(61)) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value2 = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value2);
      return true;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
    return true;
  }
  return false;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value2) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value2)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (!state.unicodeProperties.binary.test(nameOrValue)) {
    state.raise("Invalid property name");
  }
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(91)) {
    state.eat(94);
    this.regexp_classRanges(state);
    if (state.eat(93)) {
      return true;
    }
    state.raise("Unterminated character class");
  }
  return false;
};
pp$1.regexp_classRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(45) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(92)) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(98)) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(45)) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(99)) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(120)) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i = 0; i < length; ++i) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code) {
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code);
};
pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 55295 || code >= 56320) {
    return code;
  }
  var next2 = this.input.charCodeAt(this.pos + 1);
  return next2 <= 56319 || next2 >= 57344 ? code : (code << 10) + next2 - 56613888;
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipSpace = function() {
  loop:
    while (this.pos < this.input.length) {
      var ch = this.input.charCodeAt(this.pos);
      switch (ch) {
        case 32:
        case 160:
          ++this.pos;
          break;
        case 13:
          if (this.input.charCodeAt(this.pos + 1) === 10) {
            ++this.pos;
          }
        case 10:
        case 8232:
        case 8233:
          ++this.pos;
          if (this.options.locations) {
            ++this.curLine;
            this.lineStart = this.pos;
          }
          break;
        case 47:
          switch (this.input.charCodeAt(this.pos + 1)) {
            case 42:
              this.skipBlockComment();
              break;
            case 47:
              this.skipLineComment(2);
              break;
            default:
              break loop;
          }
          break;
        default:
          if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++this.pos;
          } else {
            break loop;
          }
      }
    }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 >= 48 && next2 <= 57) {
    return this.readNumber(true);
  }
  var next22 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next2 === 46 && next22 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code === 42 && next2 === 42) {
    ++size;
    tokentype = types$1.starstar;
    next2 = this.input.charCodeAt(this.pos + 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === code) {
    if (this.options.ecmaVersion >= 12) {
      var next22 = this.input.charCodeAt(this.pos + 2);
      if (next22 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === code) {
    if (next2 === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next2 === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next2 === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next2 === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next2 === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next2 = this.input.charCodeAt(this.pos + 1);
    if (next2 === 46) {
      var next22 = this.input.charCodeAt(this.pos + 2);
      if (next22 < 48 || next22 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next2 === 63) {
      if (ecmaVersion >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion = this.options.ecmaVersion;
  var code = 35;
  if (ecmaVersion >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.getTokenFromCode = function(code) {
  switch (code) {
    case 46:
      return this.readToken_dot();
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next2 = this.input.charCodeAt(this.pos + 1);
      if (next2 === 120 || next2 === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next2 === 111 || next2 === 79) {
          return this.readRadixNumber(8);
        }
        if (next2 === 98 || next2 === 66) {
          return this.readRadixNumber(2);
        }
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(code);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code);
    case 60:
    case 62:
      return this.readToken_lt_gt(code);
    case 61:
    case 33:
      return this.readToken_eq_excl(code);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value2 = null;
  try {
    value2 = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types$1.regexp, { pattern, flags, value: value2 });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (code >= 48 && code <= 57) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next2 = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next2 === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next2 === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next2 = this.input.charCodeAt(this.pos);
  }
  if ((next2 === 69 || next2 === 101) && !octal) {
    next2 = this.input.charCodeAt(++this.pos);
    if (next2 === 43 || next2 === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};
pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 8232 || ch === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
        return null;
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version = "8.7.1";
Parser.acorn = {
  Parser,
  version,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parseExpressionAt2(input, pos, options) {
  return Parser.parseExpressionAt(input, pos, options);
}
class WalkerBase {
  constructor() {
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node2) => this.replacement = node2
    };
  }
  replace(parent2, prop, index2, node2) {
    if (parent2) {
      if (index2 !== null) {
        parent2[prop][index2] = node2;
      } else {
        parent2[prop] = node2;
      }
    }
  }
  remove(parent2, prop, index2) {
    if (parent2) {
      if (index2 !== null) {
        parent2[prop].splice(index2, 1);
      } else {
        delete parent2[prop];
      }
    }
  }
}
class SyncWalker extends WalkerBase {
  constructor(enter, leave) {
    super();
    this.enter = enter;
    this.leave = leave;
  }
  visit(node2, parent2, prop, index2) {
    if (node2) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;
        this.enter.call(this.context, node2, parent2, prop, index2);
        if (this.replacement) {
          node2 = this.replacement;
          this.replace(parent2, prop, index2, node2);
        }
        if (this.should_remove) {
          this.remove(parent2, prop, index2);
        }
        const skipped = this.should_skip;
        const removed = this.should_remove;
        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;
        if (skipped)
          return node2;
        if (removed)
          return null;
      }
      for (const key in node2) {
        const value2 = node2[key];
        if (typeof value2 !== "object") {
          continue;
        } else if (Array.isArray(value2)) {
          for (let i = 0; i < value2.length; i += 1) {
            if (value2[i] !== null && typeof value2[i].type === "string") {
              if (!this.visit(value2[i], node2, key, i)) {
                i--;
              }
            }
          }
        } else if (value2 !== null && typeof value2.type === "string") {
          this.visit(value2, node2, key, null);
        }
      }
      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;
        this.leave.call(this.context, node2, parent2, prop, index2);
        if (this.replacement) {
          node2 = this.replacement;
          this.replace(parent2, prop, index2, node2);
        }
        if (this.should_remove) {
          this.remove(parent2, prop, index2);
        }
        const removed = this.should_remove;
        this.replacement = _replacement;
        this.should_remove = _should_remove;
        if (removed)
          return null;
      }
    }
    return node2;
  }
}
function walk(ast, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast, null);
}
const id = Math.round(Math.random() * 1e20).toString(36);
const re = new RegExp(`_${id}_(?:(\\d+)|(AT)|(HASH))_(\\w+)?`, "g");
const get_comment_handlers = (comments, raw) => ({
  onComment: (block, value2, start, end) => {
    if (block && /\n/.test(value2)) {
      let a = start;
      while (a > 0 && raw[a - 1] !== "\n")
        a -= 1;
      let b = a;
      while (/[ \t]/.test(raw[b]))
        b += 1;
      const indentation = raw.slice(a, b);
      value2 = value2.replace(new RegExp(`^${indentation}`, "gm"), "");
    }
    comments.push({ type: block ? "Block" : "Line", value: value2, start, end });
  },
  enter(node2) {
    let comment;
    while (comments[0] && comments[0].start < node2.start) {
      comment = comments.shift();
      comment.value = comment.value.replace(re, (match, id2, at2, hash, value2) => {
        if (hash)
          return `#${value2}`;
        if (at2)
          return `@${value2}`;
        return match;
      });
      const next2 = comments[0] || node2;
      comment.has_trailing_newline = comment.type === "Line" || /\n/.test(raw.slice(comment.end, next2.start));
      (node2.leadingComments || (node2.leadingComments = [])).push(comment);
    }
  },
  leave(node2) {
    if (comments[0]) {
      const slice = raw.slice(node2.end, comments[0].start);
      if (/^[,) \t]*$/.test(slice)) {
        node2.trailingComments = [comments.shift()];
      }
    }
  }
});
const sigils = {
  "@": "AT",
  "#": "HASH"
};
const join$1 = (strings) => {
  let str = strings[0];
  for (let i = 1; i < strings.length; i += 1) {
    str += `_${id}_${i - 1}_${strings[i]}`;
  }
  return str.replace(
    /([@#])(\w+)/g,
    (_m, sigil, name) => `_${id}_${sigils[sigil]}_${name}`
  );
};
const flatten_body = (array, target) => {
  for (let i = 0; i < array.length; i += 1) {
    const statement = array[i];
    if (Array.isArray(statement)) {
      flatten_body(statement, target);
      continue;
    }
    if (statement.type === "ExpressionStatement") {
      if (statement.expression === EMPTY)
        continue;
      if (Array.isArray(statement.expression)) {
        let node2 = statement.expression[0];
        while (Array.isArray(node2))
          node2 = node2[0];
        if (node2)
          node2.leadingComments = statement.leadingComments;
        flatten_body(statement.expression, target);
        continue;
      }
      if (/(Expression|Literal)$/.test(statement.expression.type)) {
        target.push(statement);
        continue;
      }
      if (statement.leadingComments)
        statement.expression.leadingComments = statement.leadingComments;
      if (statement.trailingComments)
        statement.expression.trailingComments = statement.trailingComments;
      target.push(statement.expression);
      continue;
    }
    target.push(statement);
  }
  return target;
};
const flatten_properties = (array, target) => {
  for (let i = 0; i < array.length; i += 1) {
    const property = array[i];
    if (property.value === EMPTY)
      continue;
    if (property.key === property.value && Array.isArray(property.key)) {
      flatten_properties(property.key, target);
      continue;
    }
    target.push(property);
  }
  return target;
};
const flatten$1 = (nodes, target) => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node2 = nodes[i];
    if (node2 === EMPTY)
      continue;
    if (Array.isArray(node2)) {
      flatten$1(node2, target);
      continue;
    }
    target.push(node2);
  }
  return target;
};
const EMPTY = { type: "Empty" };
const acorn_opts = (comments, raw) => {
  const { onComment } = get_comment_handlers(comments, raw);
  return {
    ecmaVersion: 2020,
    sourceType: "module",
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    onComment
  };
};
const inject = (raw, node2, values, comments) => {
  comments.forEach((comment) => {
    comment.value = comment.value.replace(
      re,
      (m, i) => +i in values ? values[+i] : m
    );
  });
  const { enter, leave } = get_comment_handlers(comments, raw);
  return walk(node2, {
    enter,
    leave(node3) {
      if (node3.type === "Identifier") {
        re.lastIndex = 0;
        const match = re.exec(node3.name);
        if (match) {
          if (match[1]) {
            if (+match[1] in values) {
              let value2 = values[+match[1]];
              if (typeof value2 === "string") {
                value2 = {
                  type: "Identifier",
                  name: value2,
                  leadingComments: node3.leadingComments,
                  trailingComments: node3.trailingComments
                };
              } else if (typeof value2 === "number") {
                value2 = {
                  type: "Literal",
                  value: value2,
                  leadingComments: node3.leadingComments,
                  trailingComments: node3.trailingComments
                };
              }
              this.replace(value2 || EMPTY);
            }
          } else {
            node3.name = `${match[2] ? `@` : `#`}${match[4]}`;
          }
        }
      }
      if (node3.type === "Literal") {
        if (typeof node3.value === "string") {
          re.lastIndex = 0;
          const new_value = node3.value.replace(
            re,
            (m, i) => +i in values ? values[+i] : m
          );
          const has_changed = new_value !== node3.value;
          node3.value = new_value;
          if (has_changed && node3.raw) {
            node3.raw = `${node3.raw[0]}${JSON.stringify(node3.value).slice(
              1,
              -1
            )}${node3.raw[node3.raw.length - 1]}`;
          }
        }
      }
      if (node3.type === "TemplateElement") {
        re.lastIndex = 0;
        node3.value.raw = node3.value.raw.replace(
          re,
          (m, i) => +i in values ? values[+i] : m
        );
      }
      if (node3.type === "Program" || node3.type === "BlockStatement") {
        node3.body = flatten_body(node3.body, []);
      }
      if (node3.type === "ObjectExpression" || node3.type === "ObjectPattern") {
        node3.properties = flatten_properties(node3.properties, []);
      }
      if (node3.type === "ArrayExpression" || node3.type === "ArrayPattern") {
        node3.elements = flatten$1(node3.elements, []);
      }
      if (node3.type === "FunctionExpression" || node3.type === "FunctionDeclaration" || node3.type === "ArrowFunctionExpression") {
        node3.params = flatten$1(node3.params, []);
      }
      if (node3.type === "CallExpression" || node3.type === "NewExpression") {
        node3.arguments = flatten$1(node3.arguments, []);
      }
      if (node3.type === "ImportDeclaration" || node3.type === "ExportNamedDeclaration") {
        node3.specifiers = flatten$1(node3.specifiers, []);
      }
      if (node3.type === "ForStatement") {
        node3.init = node3.init === EMPTY ? null : node3.init;
        node3.test = node3.test === EMPTY ? null : node3.test;
        node3.update = node3.update === EMPTY ? null : node3.update;
      }
      leave(node3);
    }
  });
};
function x(strings, ...values) {
  const str = join$1(strings);
  const comments = [];
  try {
    let expression2 = parseExpressionAt2(str, 0, acorn_opts(comments, str));
    const match = /\S+/.exec(str.slice(expression2.end));
    if (match) {
      throw new Error(`Unexpected token '${match[0]}'`);
    }
    expression2 = inject(str, expression2, values, comments);
    return expression2;
  } catch (err) {
    handle_error(str, err);
  }
}
function handle_error(str, err) {
  re.lastIndex = 0;
  str = str.replace(re, (m, i, at2, hash, name) => {
    if (at2)
      return `@${name}`;
    if (hash)
      return `#${name}`;
    return "${...}";
  });
  console.log(`failed to parse:
${str}`);
  throw err;
}
var MIN_SIZE = 16 * 1024;
var SafeUint32Array = typeof Uint32Array !== "undefined" ? Uint32Array : Array;
var adoptBuffer = function adoptBuffer2(buffer, size) {
  if (buffer === null || buffer.length < size) {
    return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
  }
  return buffer;
};
var TYPE = {
  EOF: 0,
  Ident: 1,
  Function: 2,
  AtKeyword: 3,
  Hash: 4,
  String: 5,
  BadString: 6,
  Url: 7,
  BadUrl: 8,
  Delim: 9,
  Number: 10,
  Percentage: 11,
  Dimension: 12,
  WhiteSpace: 13,
  CDO: 14,
  CDC: 15,
  Colon: 16,
  Semicolon: 17,
  Comma: 18,
  LeftSquareBracket: 19,
  RightSquareBracket: 20,
  LeftParenthesis: 21,
  RightParenthesis: 22,
  LeftCurlyBracket: 23,
  RightCurlyBracket: 24,
  Comment: 25
};
var NAME = Object.keys(TYPE).reduce(function(result, key) {
  result[TYPE[key]] = key;
  return result;
}, {});
var _const = {
  TYPE,
  NAME
};
var EOF = 0;
function isDigit(code) {
  return code >= 48 && code <= 57;
}
function isHexDigit$1(code) {
  return isDigit(code) || code >= 65 && code <= 70 || code >= 97 && code <= 102;
}
function isUppercaseLetter(code) {
  return code >= 65 && code <= 90;
}
function isLowercaseLetter(code) {
  return code >= 97 && code <= 122;
}
function isLetter(code) {
  return isUppercaseLetter(code) || isLowercaseLetter(code);
}
function isNonAscii(code) {
  return code >= 128;
}
function isNameStart(code) {
  return isLetter(code) || isNonAscii(code) || code === 95;
}
function isName(code) {
  return isNameStart(code) || isDigit(code) || code === 45;
}
function isNonPrintable(code) {
  return code >= 0 && code <= 8 || code === 11 || code >= 14 && code <= 31 || code === 127;
}
function isNewline(code) {
  return code === 10 || code === 13 || code === 12;
}
function isWhiteSpace(code) {
  return isNewline(code) || code === 32 || code === 9;
}
function isValidEscape(first, second) {
  if (first !== 92) {
    return false;
  }
  if (isNewline(second) || second === EOF) {
    return false;
  }
  return true;
}
function isIdentifierStart$1(first, second, third) {
  if (first === 45) {
    return isNameStart(second) || second === 45 || isValidEscape(second, third);
  }
  if (isNameStart(first)) {
    return true;
  }
  if (first === 92) {
    return isValidEscape(first, second);
  }
  return false;
}
function isNumberStart(first, second, third) {
  if (first === 43 || first === 45) {
    if (isDigit(second)) {
      return 2;
    }
    return second === 46 && isDigit(third) ? 3 : 0;
  }
  if (first === 46) {
    return isDigit(second) ? 2 : 0;
  }
  if (isDigit(first)) {
    return 1;
  }
  return 0;
}
function isBOM(code) {
  if (code === 65279) {
    return 1;
  }
  if (code === 65534) {
    return 1;
  }
  return 0;
}
var CATEGORY = new Array(128);
charCodeCategory.Eof = 128;
charCodeCategory.WhiteSpace = 130;
charCodeCategory.Digit = 131;
charCodeCategory.NameStart = 132;
charCodeCategory.NonPrintable = 133;
for (var i$2 = 0; i$2 < CATEGORY.length; i$2++) {
  switch (true) {
    case isWhiteSpace(i$2):
      CATEGORY[i$2] = charCodeCategory.WhiteSpace;
      break;
    case isDigit(i$2):
      CATEGORY[i$2] = charCodeCategory.Digit;
      break;
    case isNameStart(i$2):
      CATEGORY[i$2] = charCodeCategory.NameStart;
      break;
    case isNonPrintable(i$2):
      CATEGORY[i$2] = charCodeCategory.NonPrintable;
      break;
    default:
      CATEGORY[i$2] = i$2 || charCodeCategory.Eof;
  }
}
function charCodeCategory(code) {
  return code < 128 ? CATEGORY[code] : charCodeCategory.NameStart;
}
var charCodeDefinitions = {
  isDigit,
  isHexDigit: isHexDigit$1,
  isUppercaseLetter,
  isLowercaseLetter,
  isLetter,
  isNonAscii,
  isNameStart,
  isName,
  isNonPrintable,
  isNewline,
  isWhiteSpace,
  isValidEscape,
  isIdentifierStart: isIdentifierStart$1,
  isNumberStart,
  isBOM,
  charCodeCategory
};
var isDigit$1 = charCodeDefinitions.isDigit;
var isHexDigit$2 = charCodeDefinitions.isHexDigit;
var isUppercaseLetter$1 = charCodeDefinitions.isUppercaseLetter;
var isName$1 = charCodeDefinitions.isName;
var isWhiteSpace$1 = charCodeDefinitions.isWhiteSpace;
var isValidEscape$1 = charCodeDefinitions.isValidEscape;
function getCharCode(source, offset3) {
  return offset3 < source.length ? source.charCodeAt(offset3) : 0;
}
function getNewlineLength(source, offset3, code) {
  if (code === 13 && getCharCode(source, offset3 + 1) === 10) {
    return 2;
  }
  return 1;
}
function cmpChar(testStr, offset3, referenceCode) {
  var code = testStr.charCodeAt(offset3);
  if (isUppercaseLetter$1(code)) {
    code = code | 32;
  }
  return code === referenceCode;
}
function cmpStr(testStr, start, end, referenceStr) {
  if (end - start !== referenceStr.length) {
    return false;
  }
  if (start < 0 || end > testStr.length) {
    return false;
  }
  for (var i = start; i < end; i++) {
    var testCode = testStr.charCodeAt(i);
    var referenceCode = referenceStr.charCodeAt(i - start);
    if (isUppercaseLetter$1(testCode)) {
      testCode = testCode | 32;
    }
    if (testCode !== referenceCode) {
      return false;
    }
  }
  return true;
}
function findWhiteSpaceStart(source, offset3) {
  for (; offset3 >= 0; offset3--) {
    if (!isWhiteSpace$1(source.charCodeAt(offset3))) {
      break;
    }
  }
  return offset3 + 1;
}
function findWhiteSpaceEnd(source, offset3) {
  for (; offset3 < source.length; offset3++) {
    if (!isWhiteSpace$1(source.charCodeAt(offset3))) {
      break;
    }
  }
  return offset3;
}
function findDecimalNumberEnd(source, offset3) {
  for (; offset3 < source.length; offset3++) {
    if (!isDigit$1(source.charCodeAt(offset3))) {
      break;
    }
  }
  return offset3;
}
function consumeEscaped(source, offset3) {
  offset3 += 2;
  if (isHexDigit$2(getCharCode(source, offset3 - 1))) {
    for (var maxOffset = Math.min(source.length, offset3 + 5); offset3 < maxOffset; offset3++) {
      if (!isHexDigit$2(getCharCode(source, offset3))) {
        break;
      }
    }
    var code = getCharCode(source, offset3);
    if (isWhiteSpace$1(code)) {
      offset3 += getNewlineLength(source, offset3, code);
    }
  }
  return offset3;
}
function consumeName(source, offset3) {
  for (; offset3 < source.length; offset3++) {
    var code = source.charCodeAt(offset3);
    if (isName$1(code)) {
      continue;
    }
    if (isValidEscape$1(code, getCharCode(source, offset3 + 1))) {
      offset3 = consumeEscaped(source, offset3) - 1;
      continue;
    }
    break;
  }
  return offset3;
}
function consumeNumber(source, offset3) {
  var code = source.charCodeAt(offset3);
  if (code === 43 || code === 45) {
    code = source.charCodeAt(offset3 += 1);
  }
  if (isDigit$1(code)) {
    offset3 = findDecimalNumberEnd(source, offset3 + 1);
    code = source.charCodeAt(offset3);
  }
  if (code === 46 && isDigit$1(source.charCodeAt(offset3 + 1))) {
    code = source.charCodeAt(offset3 += 2);
    offset3 = findDecimalNumberEnd(source, offset3);
  }
  if (cmpChar(source, offset3, 101)) {
    var sign = 0;
    code = source.charCodeAt(offset3 + 1);
    if (code === 45 || code === 43) {
      sign = 1;
      code = source.charCodeAt(offset3 + 2);
    }
    if (isDigit$1(code)) {
      offset3 = findDecimalNumberEnd(source, offset3 + 1 + sign + 1);
    }
  }
  return offset3;
}
function consumeBadUrlRemnants(source, offset3) {
  for (; offset3 < source.length; offset3++) {
    var code = source.charCodeAt(offset3);
    if (code === 41) {
      offset3++;
      break;
    }
    if (isValidEscape$1(code, getCharCode(source, offset3 + 1))) {
      offset3 = consumeEscaped(source, offset3);
    }
  }
  return offset3;
}
var utils = {
  consumeEscaped,
  consumeName,
  consumeNumber,
  consumeBadUrlRemnants,
  cmpChar,
  cmpStr,
  getNewlineLength,
  findWhiteSpaceStart,
  findWhiteSpaceEnd
};
var TYPE$1 = _const.TYPE;
var NAME$1 = _const.NAME;
var cmpStr$1 = utils.cmpStr;
var EOF$1 = TYPE$1.EOF;
var WHITESPACE = TYPE$1.WhiteSpace;
var COMMENT = TYPE$1.Comment;
var OFFSET_MASK = 16777215;
var TYPE_SHIFT = 24;
var TokenStream = function() {
  this.offsetAndType = null;
  this.balance = null;
  this.reset();
};
TokenStream.prototype = {
  reset: function() {
    this.eof = false;
    this.tokenIndex = -1;
    this.tokenType = 0;
    this.tokenStart = this.firstCharOffset;
    this.tokenEnd = this.firstCharOffset;
  },
  lookupType: function(offset3) {
    offset3 += this.tokenIndex;
    if (offset3 < this.tokenCount) {
      return this.offsetAndType[offset3] >> TYPE_SHIFT;
    }
    return EOF$1;
  },
  lookupOffset: function(offset3) {
    offset3 += this.tokenIndex;
    if (offset3 < this.tokenCount) {
      return this.offsetAndType[offset3 - 1] & OFFSET_MASK;
    }
    return this.source.length;
  },
  lookupValue: function(offset3, referenceStr) {
    offset3 += this.tokenIndex;
    if (offset3 < this.tokenCount) {
      return cmpStr$1(
        this.source,
        this.offsetAndType[offset3 - 1] & OFFSET_MASK,
        this.offsetAndType[offset3] & OFFSET_MASK,
        referenceStr
      );
    }
    return false;
  },
  getTokenStart: function(tokenIndex) {
    if (tokenIndex === this.tokenIndex) {
      return this.tokenStart;
    }
    if (tokenIndex > 0) {
      return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
    }
    return this.firstCharOffset;
  },
  getRawLength: function(startToken, mode) {
    var cursor = startToken;
    var balanceEnd2;
    var offset3 = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
    var type;
    loop:
      for (; cursor < this.tokenCount; cursor++) {
        balanceEnd2 = this.balance[cursor];
        if (balanceEnd2 < startToken) {
          break loop;
        }
        type = this.offsetAndType[cursor] >> TYPE_SHIFT;
        switch (mode(type, this.source, offset3)) {
          case 1:
            break loop;
          case 2:
            cursor++;
            break loop;
          default:
            offset3 = this.offsetAndType[cursor] & OFFSET_MASK;
            if (this.balance[balanceEnd2] === cursor) {
              cursor = balanceEnd2;
            }
        }
      }
    return cursor - this.tokenIndex;
  },
  isBalanceEdge: function(pos) {
    return this.balance[this.tokenIndex] < pos;
  },
  isDelim: function(code, offset3) {
    if (offset3) {
      return this.lookupType(offset3) === TYPE$1.Delim && this.source.charCodeAt(this.lookupOffset(offset3)) === code;
    }
    return this.tokenType === TYPE$1.Delim && this.source.charCodeAt(this.tokenStart) === code;
  },
  getTokenValue: function() {
    return this.source.substring(this.tokenStart, this.tokenEnd);
  },
  getTokenLength: function() {
    return this.tokenEnd - this.tokenStart;
  },
  substrToCursor: function(start) {
    return this.source.substring(start, this.tokenStart);
  },
  skipWS: function() {
    for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
      if (this.offsetAndType[i] >> TYPE_SHIFT !== WHITESPACE) {
        break;
      }
    }
    if (skipTokenCount > 0) {
      this.skip(skipTokenCount);
    }
  },
  skipSC: function() {
    while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
      this.next();
    }
  },
  skip: function(tokenCount) {
    var next2 = this.tokenIndex + tokenCount;
    if (next2 < this.tokenCount) {
      this.tokenIndex = next2;
      this.tokenStart = this.offsetAndType[next2 - 1] & OFFSET_MASK;
      next2 = this.offsetAndType[next2];
      this.tokenType = next2 >> TYPE_SHIFT;
      this.tokenEnd = next2 & OFFSET_MASK;
    } else {
      this.tokenIndex = this.tokenCount;
      this.next();
    }
  },
  next: function() {
    var next2 = this.tokenIndex + 1;
    if (next2 < this.tokenCount) {
      this.tokenIndex = next2;
      this.tokenStart = this.tokenEnd;
      next2 = this.offsetAndType[next2];
      this.tokenType = next2 >> TYPE_SHIFT;
      this.tokenEnd = next2 & OFFSET_MASK;
    } else {
      this.tokenIndex = this.tokenCount;
      this.eof = true;
      this.tokenType = EOF$1;
      this.tokenStart = this.tokenEnd = this.source.length;
    }
  },
  forEachToken(fn) {
    for (var i = 0, offset3 = this.firstCharOffset; i < this.tokenCount; i++) {
      var start = offset3;
      var item = this.offsetAndType[i];
      var end = item & OFFSET_MASK;
      var type = item >> TYPE_SHIFT;
      offset3 = end;
      fn(type, start, end, i);
    }
  },
  dump() {
    var tokens = new Array(this.tokenCount);
    this.forEachToken((type, start, end, index2) => {
      tokens[index2] = {
        idx: index2,
        type: NAME$1[type],
        chunk: this.source.substring(start, end),
        balance: this.balance[index2]
      };
    });
    return tokens;
  }
};
var TokenStream_1 = TokenStream;
var TYPE$2 = _const.TYPE;
var isNewline$1 = charCodeDefinitions.isNewline;
var isName$2 = charCodeDefinitions.isName;
var isValidEscape$2 = charCodeDefinitions.isValidEscape;
var isNumberStart$1 = charCodeDefinitions.isNumberStart;
var isIdentifierStart$2 = charCodeDefinitions.isIdentifierStart;
var charCodeCategory$1 = charCodeDefinitions.charCodeCategory;
var isBOM$1 = charCodeDefinitions.isBOM;
var cmpStr$2 = utils.cmpStr;
var getNewlineLength$1 = utils.getNewlineLength;
var findWhiteSpaceEnd$1 = utils.findWhiteSpaceEnd;
var consumeEscaped$1 = utils.consumeEscaped;
var consumeName$1 = utils.consumeName;
var consumeNumber$1 = utils.consumeNumber;
var consumeBadUrlRemnants$1 = utils.consumeBadUrlRemnants;
var OFFSET_MASK$1 = 16777215;
var TYPE_SHIFT$1 = 24;
function tokenize(source, stream) {
  function getCharCode2(offset4) {
    return offset4 < sourceLength ? source.charCodeAt(offset4) : 0;
  }
  function consumeNumericToken() {
    offset3 = consumeNumber$1(source, offset3);
    if (isIdentifierStart$2(getCharCode2(offset3), getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
      type = TYPE$2.Dimension;
      offset3 = consumeName$1(source, offset3);
      return;
    }
    if (getCharCode2(offset3) === 37) {
      type = TYPE$2.Percentage;
      offset3++;
      return;
    }
    type = TYPE$2.Number;
  }
  function consumeIdentLikeToken() {
    const nameStartOffset = offset3;
    offset3 = consumeName$1(source, offset3);
    if (cmpStr$2(source, nameStartOffset, offset3, "url") && getCharCode2(offset3) === 40) {
      offset3 = findWhiteSpaceEnd$1(source, offset3 + 1);
      if (getCharCode2(offset3) === 34 || getCharCode2(offset3) === 39) {
        type = TYPE$2.Function;
        offset3 = nameStartOffset + 4;
        return;
      }
      consumeUrlToken();
      return;
    }
    if (getCharCode2(offset3) === 40) {
      type = TYPE$2.Function;
      offset3++;
      return;
    }
    type = TYPE$2.Ident;
  }
  function consumeStringToken(endingCodePoint) {
    if (!endingCodePoint) {
      endingCodePoint = getCharCode2(offset3++);
    }
    type = TYPE$2.String;
    for (; offset3 < source.length; offset3++) {
      var code2 = source.charCodeAt(offset3);
      switch (charCodeCategory$1(code2)) {
        case endingCodePoint:
          offset3++;
          return;
        case charCodeCategory$1.Eof:
          return;
        case charCodeCategory$1.WhiteSpace:
          if (isNewline$1(code2)) {
            offset3 += getNewlineLength$1(source, offset3, code2);
            type = TYPE$2.BadString;
            return;
          }
          break;
        case 92:
          if (offset3 === source.length - 1) {
            break;
          }
          var nextCode = getCharCode2(offset3 + 1);
          if (isNewline$1(nextCode)) {
            offset3 += getNewlineLength$1(source, offset3 + 1, nextCode);
          } else if (isValidEscape$2(code2, nextCode)) {
            offset3 = consumeEscaped$1(source, offset3) - 1;
          }
          break;
      }
    }
  }
  function consumeUrlToken() {
    type = TYPE$2.Url;
    offset3 = findWhiteSpaceEnd$1(source, offset3);
    for (; offset3 < source.length; offset3++) {
      var code2 = source.charCodeAt(offset3);
      switch (charCodeCategory$1(code2)) {
        case 41:
          offset3++;
          return;
        case charCodeCategory$1.Eof:
          return;
        case charCodeCategory$1.WhiteSpace:
          offset3 = findWhiteSpaceEnd$1(source, offset3);
          if (getCharCode2(offset3) === 41 || offset3 >= source.length) {
            if (offset3 < source.length) {
              offset3++;
            }
            return;
          }
          offset3 = consumeBadUrlRemnants$1(source, offset3);
          type = TYPE$2.BadUrl;
          return;
        case 34:
        case 39:
        case 40:
        case charCodeCategory$1.NonPrintable:
          offset3 = consumeBadUrlRemnants$1(source, offset3);
          type = TYPE$2.BadUrl;
          return;
        case 92:
          if (isValidEscape$2(code2, getCharCode2(offset3 + 1))) {
            offset3 = consumeEscaped$1(source, offset3) - 1;
            break;
          }
          offset3 = consumeBadUrlRemnants$1(source, offset3);
          type = TYPE$2.BadUrl;
          return;
      }
    }
  }
  if (!stream) {
    stream = new TokenStream_1();
  }
  source = String(source || "");
  var sourceLength = source.length;
  var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1);
  var balance = adoptBuffer(stream.balance, sourceLength + 1);
  var tokenCount = 0;
  var start = isBOM$1(getCharCode2(0));
  var offset3 = start;
  var balanceCloseType = 0;
  var balanceStart = 0;
  var balancePrev = 0;
  while (offset3 < sourceLength) {
    var code = source.charCodeAt(offset3);
    var type = 0;
    balance[tokenCount] = sourceLength;
    switch (charCodeCategory$1(code)) {
      case charCodeCategory$1.WhiteSpace:
        type = TYPE$2.WhiteSpace;
        offset3 = findWhiteSpaceEnd$1(source, offset3 + 1);
        break;
      case 34:
        consumeStringToken();
        break;
      case 35:
        if (isName$2(getCharCode2(offset3 + 1)) || isValidEscape$2(getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
          type = TYPE$2.Hash;
          offset3 = consumeName$1(source, offset3 + 1);
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 39:
        consumeStringToken();
        break;
      case 40:
        type = TYPE$2.LeftParenthesis;
        offset3++;
        break;
      case 41:
        type = TYPE$2.RightParenthesis;
        offset3++;
        break;
      case 43:
        if (isNumberStart$1(code, getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
          consumeNumericToken();
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 44:
        type = TYPE$2.Comma;
        offset3++;
        break;
      case 45:
        if (isNumberStart$1(code, getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
          consumeNumericToken();
        } else {
          if (getCharCode2(offset3 + 1) === 45 && getCharCode2(offset3 + 2) === 62) {
            type = TYPE$2.CDC;
            offset3 = offset3 + 3;
          } else {
            if (isIdentifierStart$2(code, getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
              consumeIdentLikeToken();
            } else {
              type = TYPE$2.Delim;
              offset3++;
            }
          }
        }
        break;
      case 46:
        if (isNumberStart$1(code, getCharCode2(offset3 + 1), getCharCode2(offset3 + 2))) {
          consumeNumericToken();
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 47:
        if (getCharCode2(offset3 + 1) === 42) {
          type = TYPE$2.Comment;
          offset3 = source.indexOf("*/", offset3 + 2) + 2;
          if (offset3 === 1) {
            offset3 = source.length;
          }
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 58:
        type = TYPE$2.Colon;
        offset3++;
        break;
      case 59:
        type = TYPE$2.Semicolon;
        offset3++;
        break;
      case 60:
        if (getCharCode2(offset3 + 1) === 33 && getCharCode2(offset3 + 2) === 45 && getCharCode2(offset3 + 3) === 45) {
          type = TYPE$2.CDO;
          offset3 = offset3 + 4;
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 64:
        if (isIdentifierStart$2(getCharCode2(offset3 + 1), getCharCode2(offset3 + 2), getCharCode2(offset3 + 3))) {
          type = TYPE$2.AtKeyword;
          offset3 = consumeName$1(source, offset3 + 1);
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 91:
        type = TYPE$2.LeftSquareBracket;
        offset3++;
        break;
      case 92:
        if (isValidEscape$2(code, getCharCode2(offset3 + 1))) {
          consumeIdentLikeToken();
        } else {
          type = TYPE$2.Delim;
          offset3++;
        }
        break;
      case 93:
        type = TYPE$2.RightSquareBracket;
        offset3++;
        break;
      case 123:
        type = TYPE$2.LeftCurlyBracket;
        offset3++;
        break;
      case 125:
        type = TYPE$2.RightCurlyBracket;
        offset3++;
        break;
      case charCodeCategory$1.Digit:
        consumeNumericToken();
        break;
      case charCodeCategory$1.NameStart:
        consumeIdentLikeToken();
        break;
      case charCodeCategory$1.Eof:
        break;
      default:
        type = TYPE$2.Delim;
        offset3++;
    }
    switch (type) {
      case balanceCloseType:
        balancePrev = balanceStart & OFFSET_MASK$1;
        balanceStart = balance[balancePrev];
        balanceCloseType = balanceStart >> TYPE_SHIFT$1;
        balance[tokenCount] = balancePrev;
        balance[balancePrev++] = tokenCount;
        for (; balancePrev < tokenCount; balancePrev++) {
          if (balance[balancePrev] === sourceLength) {
            balance[balancePrev] = tokenCount;
          }
        }
        break;
      case TYPE$2.LeftParenthesis:
      case TYPE$2.Function:
        balance[tokenCount] = balanceStart;
        balanceCloseType = TYPE$2.RightParenthesis;
        balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
        break;
      case TYPE$2.LeftSquareBracket:
        balance[tokenCount] = balanceStart;
        balanceCloseType = TYPE$2.RightSquareBracket;
        balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
        break;
      case TYPE$2.LeftCurlyBracket:
        balance[tokenCount] = balanceStart;
        balanceCloseType = TYPE$2.RightCurlyBracket;
        balanceStart = balanceCloseType << TYPE_SHIFT$1 | tokenCount;
        break;
    }
    offsetAndType[tokenCount++] = type << TYPE_SHIFT$1 | offset3;
  }
  offsetAndType[tokenCount] = TYPE$2.EOF << TYPE_SHIFT$1 | offset3;
  balance[tokenCount] = sourceLength;
  balance[sourceLength] = sourceLength;
  while (balanceStart !== 0) {
    balancePrev = balanceStart & OFFSET_MASK$1;
    balanceStart = balance[balancePrev];
    balance[balancePrev] = sourceLength;
  }
  stream.source = source;
  stream.firstCharOffset = start;
  stream.offsetAndType = offsetAndType;
  stream.tokenCount = tokenCount;
  stream.balance = balance;
  stream.reset();
  stream.next();
  return stream;
}
Object.keys(_const).forEach(function(key) {
  tokenize[key] = _const[key];
});
Object.keys(charCodeDefinitions).forEach(function(key) {
  tokenize[key] = charCodeDefinitions[key];
});
Object.keys(utils).forEach(function(key) {
  tokenize[key] = utils[key];
});
var tokenizer2 = tokenize;
var isBOM$2 = tokenizer2.isBOM;
var N = 10;
var F = 12;
var R = 13;
function computeLinesAndColumns(host, source) {
  var sourceLength = source.length;
  var lines = adoptBuffer(host.lines, sourceLength);
  var line = host.startLine;
  var columns = adoptBuffer(host.columns, sourceLength);
  var column = host.startColumn;
  var startOffset = source.length > 0 ? isBOM$2(source.charCodeAt(0)) : 0;
  for (var i = startOffset; i < sourceLength; i++) {
    var code = source.charCodeAt(i);
    lines[i] = line;
    columns[i] = column++;
    if (code === N || code === R || code === F) {
      if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
        i++;
        lines[i] = line;
        columns[i] = column;
      }
      line++;
      column = 1;
    }
  }
  lines[i] = line;
  columns[i] = column;
  host.lines = lines;
  host.columns = columns;
}
var OffsetToLocation = function() {
  this.lines = null;
  this.columns = null;
  this.linesAndColumnsComputed = false;
};
OffsetToLocation.prototype = {
  setSource: function(source, startOffset, startLine, startColumn) {
    this.source = source;
    this.startOffset = typeof startOffset === "undefined" ? 0 : startOffset;
    this.startLine = typeof startLine === "undefined" ? 1 : startLine;
    this.startColumn = typeof startColumn === "undefined" ? 1 : startColumn;
    this.linesAndColumnsComputed = false;
  },
  ensureLinesAndColumnsComputed: function() {
    if (!this.linesAndColumnsComputed) {
      computeLinesAndColumns(this, this.source);
      this.linesAndColumnsComputed = true;
    }
  },
  getLocation: function(offset3, filename) {
    this.ensureLinesAndColumnsComputed();
    return {
      source: filename,
      offset: this.startOffset + offset3,
      line: this.lines[offset3],
      column: this.columns[offset3]
    };
  },
  getLocationRange: function(start, end, filename) {
    this.ensureLinesAndColumnsComputed();
    return {
      source: filename,
      start: {
        offset: this.startOffset + start,
        line: this.lines[start],
        column: this.columns[start]
      },
      end: {
        offset: this.startOffset + end,
        line: this.lines[end],
        column: this.columns[end]
      }
    };
  }
};
var OffsetToLocation_1 = OffsetToLocation;
var createCustomError = function createCustomError2(name, message) {
  var error = Object.create(SyntaxError.prototype);
  var errorStack = new Error();
  error.name = name;
  error.message = message;
  Object.defineProperty(error, "stack", {
    get: function() {
      return (errorStack.stack || "").replace(/^(.+\n){1,3}/, name + ": " + message + "\n");
    }
  });
  return error;
};
var MAX_LINE_LENGTH = 100;
var OFFSET_CORRECTION = 60;
var TAB_REPLACEMENT = "    ";
function sourceFragment(error, extraLines) {
  function processLines(start, end) {
    return lines.slice(start, end).map(function(line2, idx) {
      var num = String(start + idx + 1);
      while (num.length < maxNumLength) {
        num = " " + num;
      }
      return num + " |" + line2;
    }).join("\n");
  }
  var lines = error.source.split(/\r\n?|\n|\f/);
  var line = error.line;
  var column = error.column;
  var startLine = Math.max(1, line - extraLines) - 1;
  var endLine = Math.min(line + extraLines, lines.length + 1);
  var maxNumLength = Math.max(4, String(endLine).length) + 1;
  var cutLeft = 0;
  column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
  if (column > MAX_LINE_LENGTH) {
    cutLeft = column - OFFSET_CORRECTION + 3;
    column = OFFSET_CORRECTION - 2;
  }
  for (var i = startLine; i <= endLine; i++) {
    if (i >= 0 && i < lines.length) {
      lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
      lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "\u2026" : "") + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "\u2026" : "");
    }
  }
  return [
    processLines(startLine, line),
    new Array(column + maxNumLength + 2).join("-") + "^",
    processLines(line, endLine)
  ].filter(Boolean).join("\n");
}
var SyntaxError$1 = function(message, source, offset3, line, column) {
  var error = createCustomError("SyntaxError", message);
  error.source = source;
  error.offset = offset3;
  error.line = line;
  error.column = column;
  error.sourceFragment = function(extraLines) {
    return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
  };
  Object.defineProperty(error, "formattedMessage", {
    get: function() {
      return "Parse error: " + error.message + "\n" + sourceFragment(error, 2);
    }
  });
  error.parseError = {
    offset: offset3,
    line,
    column
  };
  return error;
};
var _SyntaxError = SyntaxError$1;
function createItem(data2) {
  return {
    prev: null,
    next: null,
    data: data2
  };
}
function allocateCursor(node2, prev2, next2) {
  var cursor;
  if (cursors !== null) {
    cursor = cursors;
    cursors = cursors.cursor;
    cursor.prev = prev2;
    cursor.next = next2;
    cursor.cursor = node2.cursor;
  } else {
    cursor = {
      prev: prev2,
      next: next2,
      cursor: node2.cursor
    };
  }
  node2.cursor = cursor;
  return cursor;
}
function releaseCursor(node2) {
  var cursor = node2.cursor;
  node2.cursor = cursor.cursor;
  cursor.prev = null;
  cursor.next = null;
  cursor.cursor = cursors;
  cursors = cursor;
}
var cursors = null;
var List = function() {
  this.cursor = null;
  this.head = null;
  this.tail = null;
};
List.createItem = createItem;
List.prototype.createItem = createItem;
List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
  var cursor = this.cursor;
  while (cursor !== null) {
    if (cursor.prev === prevOld) {
      cursor.prev = prevNew;
    }
    if (cursor.next === nextOld) {
      cursor.next = nextNew;
    }
    cursor = cursor.cursor;
  }
};
List.prototype.getSize = function() {
  var size = 0;
  var cursor = this.head;
  while (cursor) {
    size++;
    cursor = cursor.next;
  }
  return size;
};
List.prototype.fromArray = function(array) {
  var cursor = null;
  this.head = null;
  for (var i = 0; i < array.length; i++) {
    var item = createItem(array[i]);
    if (cursor !== null) {
      cursor.next = item;
    } else {
      this.head = item;
    }
    item.prev = cursor;
    cursor = item;
  }
  this.tail = cursor;
  return this;
};
List.prototype.toArray = function() {
  var cursor = this.head;
  var result = [];
  while (cursor) {
    result.push(cursor.data);
    cursor = cursor.next;
  }
  return result;
};
List.prototype.toJSON = List.prototype.toArray;
List.prototype.isEmpty = function() {
  return this.head === null;
};
List.prototype.first = function() {
  return this.head && this.head.data;
};
List.prototype.last = function() {
  return this.tail && this.tail.data;
};
List.prototype.each = function(fn, context) {
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, null, this.head);
  while (cursor.next !== null) {
    item = cursor.next;
    cursor.next = item.next;
    fn.call(context, item.data, item, this);
  }
  releaseCursor(this);
};
List.prototype.forEach = List.prototype.each;
List.prototype.eachRight = function(fn, context) {
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, this.tail, null);
  while (cursor.prev !== null) {
    item = cursor.prev;
    cursor.prev = item.prev;
    fn.call(context, item.data, item, this);
  }
  releaseCursor(this);
};
List.prototype.forEachRight = List.prototype.eachRight;
List.prototype.reduce = function(fn, initialValue, context) {
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, null, this.head);
  var acc = initialValue;
  while (cursor.next !== null) {
    item = cursor.next;
    cursor.next = item.next;
    acc = fn.call(context, acc, item.data, item, this);
  }
  releaseCursor(this);
  return acc;
};
List.prototype.reduceRight = function(fn, initialValue, context) {
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, this.tail, null);
  var acc = initialValue;
  while (cursor.prev !== null) {
    item = cursor.prev;
    cursor.prev = item.prev;
    acc = fn.call(context, acc, item.data, item, this);
  }
  releaseCursor(this);
  return acc;
};
List.prototype.nextUntil = function(start, fn, context) {
  if (start === null) {
    return;
  }
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, null, start);
  while (cursor.next !== null) {
    item = cursor.next;
    cursor.next = item.next;
    if (fn.call(context, item.data, item, this)) {
      break;
    }
  }
  releaseCursor(this);
};
List.prototype.prevUntil = function(start, fn, context) {
  if (start === null) {
    return;
  }
  var item;
  if (context === void 0) {
    context = this;
  }
  var cursor = allocateCursor(this, start, null);
  while (cursor.prev !== null) {
    item = cursor.prev;
    cursor.prev = item.prev;
    if (fn.call(context, item.data, item, this)) {
      break;
    }
  }
  releaseCursor(this);
};
List.prototype.some = function(fn, context) {
  var cursor = this.head;
  if (context === void 0) {
    context = this;
  }
  while (cursor !== null) {
    if (fn.call(context, cursor.data, cursor, this)) {
      return true;
    }
    cursor = cursor.next;
  }
  return false;
};
List.prototype.map = function(fn, context) {
  var result = new List();
  var cursor = this.head;
  if (context === void 0) {
    context = this;
  }
  while (cursor !== null) {
    result.appendData(fn.call(context, cursor.data, cursor, this));
    cursor = cursor.next;
  }
  return result;
};
List.prototype.filter = function(fn, context) {
  var result = new List();
  var cursor = this.head;
  if (context === void 0) {
    context = this;
  }
  while (cursor !== null) {
    if (fn.call(context, cursor.data, cursor, this)) {
      result.appendData(cursor.data);
    }
    cursor = cursor.next;
  }
  return result;
};
List.prototype.clear = function() {
  this.head = null;
  this.tail = null;
};
List.prototype.copy = function() {
  var result = new List();
  var cursor = this.head;
  while (cursor !== null) {
    result.insert(createItem(cursor.data));
    cursor = cursor.next;
  }
  return result;
};
List.prototype.prepend = function(item) {
  this.updateCursors(null, item, this.head, item);
  if (this.head !== null) {
    this.head.prev = item;
    item.next = this.head;
  } else {
    this.tail = item;
  }
  this.head = item;
  return this;
};
List.prototype.prependData = function(data2) {
  return this.prepend(createItem(data2));
};
List.prototype.append = function(item) {
  return this.insert(item);
};
List.prototype.appendData = function(data2) {
  return this.insert(createItem(data2));
};
List.prototype.insert = function(item, before) {
  if (before !== void 0 && before !== null) {
    this.updateCursors(before.prev, item, before, item);
    if (before.prev === null) {
      if (this.head !== before) {
        throw new Error("before doesn't belong to list");
      }
      this.head = item;
      before.prev = item;
      item.next = before;
      this.updateCursors(null, item);
    } else {
      before.prev.next = item;
      item.prev = before.prev;
      before.prev = item;
      item.next = before;
    }
  } else {
    this.updateCursors(this.tail, item, null, item);
    if (this.tail !== null) {
      this.tail.next = item;
      item.prev = this.tail;
    } else {
      this.head = item;
    }
    this.tail = item;
  }
  return this;
};
List.prototype.insertData = function(data2, before) {
  return this.insert(createItem(data2), before);
};
List.prototype.remove = function(item) {
  this.updateCursors(item, item.prev, item, item.next);
  if (item.prev !== null) {
    item.prev.next = item.next;
  } else {
    if (this.head !== item) {
      throw new Error("item doesn't belong to list");
    }
    this.head = item.next;
  }
  if (item.next !== null) {
    item.next.prev = item.prev;
  } else {
    if (this.tail !== item) {
      throw new Error("item doesn't belong to list");
    }
    this.tail = item.prev;
  }
  item.prev = null;
  item.next = null;
  return item;
};
List.prototype.push = function(data2) {
  this.insert(createItem(data2));
};
List.prototype.pop = function() {
  if (this.tail !== null) {
    return this.remove(this.tail);
  }
};
List.prototype.unshift = function(data2) {
  this.prepend(createItem(data2));
};
List.prototype.shift = function() {
  if (this.head !== null) {
    return this.remove(this.head);
  }
};
List.prototype.prependList = function(list) {
  return this.insertList(list, this.head);
};
List.prototype.appendList = function(list) {
  return this.insertList(list);
};
List.prototype.insertList = function(list, before) {
  if (list.head === null) {
    return this;
  }
  if (before !== void 0 && before !== null) {
    this.updateCursors(before.prev, list.tail, before, list.head);
    if (before.prev !== null) {
      before.prev.next = list.head;
      list.head.prev = before.prev;
    } else {
      this.head = list.head;
    }
    before.prev = list.tail;
    list.tail.next = before;
  } else {
    this.updateCursors(this.tail, list.tail, null, list.head);
    if (this.tail !== null) {
      this.tail.next = list.head;
      list.head.prev = this.tail;
    } else {
      this.head = list.head;
    }
    this.tail = list.tail;
  }
  list.head = null;
  list.tail = null;
  return this;
};
List.prototype.replace = function(oldItem, newItemOrList) {
  if ("head" in newItemOrList) {
    this.insertList(newItemOrList, oldItem);
  } else {
    this.insert(newItemOrList, oldItem);
  }
  this.remove(oldItem);
};
var List_1 = List;
var TYPE$3 = tokenizer2.TYPE;
var WHITESPACE$1 = TYPE$3.WhiteSpace;
var COMMENT$1 = TYPE$3.Comment;
var sequence = function readSequence(recognizer) {
  var children2 = this.createList();
  var child = null;
  var context = {
    recognizer,
    space: null,
    ignoreWS: false,
    ignoreWSAfter: false
  };
  this.scanner.skipSC();
  while (!this.scanner.eof) {
    switch (this.scanner.tokenType) {
      case COMMENT$1:
        this.scanner.next();
        continue;
      case WHITESPACE$1:
        if (context.ignoreWS) {
          this.scanner.next();
        } else {
          context.space = this.WhiteSpace();
        }
        continue;
    }
    child = recognizer.getNode.call(this, context);
    if (child === void 0) {
      break;
    }
    if (context.space !== null) {
      children2.push(context.space);
      context.space = null;
    }
    children2.push(child);
    if (context.ignoreWSAfter) {
      context.ignoreWSAfter = false;
      context.ignoreWS = true;
    } else {
      context.ignoreWS = false;
    }
  }
  return children2;
};
var { findWhiteSpaceStart: findWhiteSpaceStart$1, cmpStr: cmpStr$3 } = utils;
var noop = function() {
};
var TYPE$4 = _const.TYPE;
var NAME$2 = _const.NAME;
var WHITESPACE$2 = TYPE$4.WhiteSpace;
var COMMENT$2 = TYPE$4.Comment;
var IDENT = TYPE$4.Ident;
var FUNCTION = TYPE$4.Function;
var URL$1 = TYPE$4.Url;
var HASH = TYPE$4.Hash;
var PERCENTAGE = TYPE$4.Percentage;
var NUMBER = TYPE$4.Number;
var NUMBERSIGN = 35;
var NULL = 0;
function createParseContext(name) {
  return function() {
    return this[name]();
  };
}
function processConfig(config2) {
  var parserConfig = {
    context: {},
    scope: {},
    atrule: {},
    pseudo: {}
  };
  if (config2.parseContext) {
    for (var name in config2.parseContext) {
      switch (typeof config2.parseContext[name]) {
        case "function":
          parserConfig.context[name] = config2.parseContext[name];
          break;
        case "string":
          parserConfig.context[name] = createParseContext(config2.parseContext[name]);
          break;
      }
    }
  }
  if (config2.scope) {
    for (var name in config2.scope) {
      parserConfig.scope[name] = config2.scope[name];
    }
  }
  if (config2.atrule) {
    for (var name in config2.atrule) {
      var atrule2 = config2.atrule[name];
      if (atrule2.parse) {
        parserConfig.atrule[name] = atrule2.parse;
      }
    }
  }
  if (config2.pseudo) {
    for (var name in config2.pseudo) {
      var pseudo2 = config2.pseudo[name];
      if (pseudo2.parse) {
        parserConfig.pseudo[name] = pseudo2.parse;
      }
    }
  }
  if (config2.node) {
    for (var name in config2.node) {
      parserConfig[name] = config2.node[name].parse;
    }
  }
  return parserConfig;
}
var create = function createParser(config2) {
  var parser2 = {
    scanner: new TokenStream_1(),
    locationMap: new OffsetToLocation_1(),
    filename: "<unknown>",
    needPositions: false,
    onParseError: noop,
    onParseErrorThrow: false,
    parseAtrulePrelude: true,
    parseRulePrelude: true,
    parseValue: true,
    parseCustomProperty: false,
    readSequence: sequence,
    createList: function() {
      return new List_1();
    },
    createSingleNodeList: function(node2) {
      return new List_1().appendData(node2);
    },
    getFirstListNode: function(list) {
      return list && list.first();
    },
    getLastListNode: function(list) {
      return list.last();
    },
    parseWithFallback: function(consumer, fallback) {
      var startToken = this.scanner.tokenIndex;
      try {
        return consumer.call(this);
      } catch (e) {
        if (this.onParseErrorThrow) {
          throw e;
        }
        var fallbackNode = fallback.call(this, startToken);
        this.onParseErrorThrow = true;
        this.onParseError(e, fallbackNode);
        this.onParseErrorThrow = false;
        return fallbackNode;
      }
    },
    lookupNonWSType: function(offset3) {
      do {
        var type = this.scanner.lookupType(offset3++);
        if (type !== WHITESPACE$2) {
          return type;
        }
      } while (type !== NULL);
      return NULL;
    },
    eat: function(tokenType) {
      if (this.scanner.tokenType !== tokenType) {
        var offset3 = this.scanner.tokenStart;
        var message = NAME$2[tokenType] + " is expected";
        switch (tokenType) {
          case IDENT:
            if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL$1) {
              offset3 = this.scanner.tokenEnd - 1;
              message = "Identifier is expected but function found";
            } else {
              message = "Identifier is expected";
            }
            break;
          case HASH:
            if (this.scanner.isDelim(NUMBERSIGN)) {
              this.scanner.next();
              offset3++;
              message = "Name is expected";
            }
            break;
          case PERCENTAGE:
            if (this.scanner.tokenType === NUMBER) {
              offset3 = this.scanner.tokenEnd;
              message = "Percent sign is expected";
            }
            break;
          default:
            if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
              offset3 = offset3 + 1;
            }
        }
        this.error(message, offset3);
      }
      this.scanner.next();
    },
    consume: function(tokenType) {
      var value2 = this.scanner.getTokenValue();
      this.eat(tokenType);
      return value2;
    },
    consumeFunctionName: function() {
      var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
      this.eat(FUNCTION);
      return name;
    },
    getLocation: function(start, end) {
      if (this.needPositions) {
        return this.locationMap.getLocationRange(
          start,
          end,
          this.filename
        );
      }
      return null;
    },
    getLocationFromList: function(list) {
      if (this.needPositions) {
        var head = this.getFirstListNode(list);
        var tail = this.getLastListNode(list);
        return this.locationMap.getLocationRange(
          head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart,
          tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart,
          this.filename
        );
      }
      return null;
    },
    error: function(message, offset3) {
      var location = typeof offset3 !== "undefined" && offset3 < this.scanner.source.length ? this.locationMap.getLocation(offset3) : this.scanner.eof ? this.locationMap.getLocation(findWhiteSpaceStart$1(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
      throw new _SyntaxError(
        message || "Unexpected input",
        this.scanner.source,
        location.offset,
        location.line,
        location.column
      );
    }
  };
  config2 = processConfig(config2 || {});
  for (var key in config2) {
    parser2[key] = config2[key];
  }
  return function(source, options) {
    options = options || {};
    var context = options.context || "default";
    var onComment = options.onComment;
    var ast;
    tokenizer2(source, parser2.scanner);
    parser2.locationMap.setSource(
      source,
      options.offset,
      options.line,
      options.column
    );
    parser2.filename = options.filename || "<unknown>";
    parser2.needPositions = Boolean(options.positions);
    parser2.onParseError = typeof options.onParseError === "function" ? options.onParseError : noop;
    parser2.onParseErrorThrow = false;
    parser2.parseAtrulePrelude = "parseAtrulePrelude" in options ? Boolean(options.parseAtrulePrelude) : true;
    parser2.parseRulePrelude = "parseRulePrelude" in options ? Boolean(options.parseRulePrelude) : true;
    parser2.parseValue = "parseValue" in options ? Boolean(options.parseValue) : true;
    parser2.parseCustomProperty = "parseCustomProperty" in options ? Boolean(options.parseCustomProperty) : false;
    if (!parser2.context.hasOwnProperty(context)) {
      throw new Error("Unknown context `" + context + "`");
    }
    if (typeof onComment === "function") {
      parser2.scanner.forEachToken((type, start, end) => {
        if (type === COMMENT$2) {
          const loc = parser2.getLocation(start, end);
          const value2 = cmpStr$3(source, end - 2, end, "*/") ? source.slice(start + 2, end - 2) : source.slice(start + 2, end);
          onComment(value2, loc);
        }
      });
    }
    ast = parser2.context[context].call(parser2, options);
    if (!parser2.scanner.eof) {
      parser2.error();
    }
    return ast;
  };
};
var cmpChar$1 = tokenizer2.cmpChar;
var cmpStr$4 = tokenizer2.cmpStr;
var TYPE$5 = tokenizer2.TYPE;
var IDENT$1 = TYPE$5.Ident;
var STRING = TYPE$5.String;
var NUMBER$1 = TYPE$5.Number;
var FUNCTION$1 = TYPE$5.Function;
var URL$2 = TYPE$5.Url;
var HASH$1 = TYPE$5.Hash;
var DIMENSION = TYPE$5.Dimension;
var PERCENTAGE$1 = TYPE$5.Percentage;
var LEFTPARENTHESIS = TYPE$5.LeftParenthesis;
var LEFTSQUAREBRACKET = TYPE$5.LeftSquareBracket;
var COMMA = TYPE$5.Comma;
var DELIM = TYPE$5.Delim;
var NUMBERSIGN$1 = 35;
var ASTERISK = 42;
var PLUSSIGN = 43;
var HYPHENMINUS = 45;
var SOLIDUS = 47;
var U = 117;
var _default = function defaultRecognizer(context) {
  switch (this.scanner.tokenType) {
    case HASH$1:
      return this.Hash();
    case COMMA:
      context.space = null;
      context.ignoreWSAfter = true;
      return this.Operator();
    case LEFTPARENTHESIS:
      return this.Parentheses(this.readSequence, context.recognizer);
    case LEFTSQUAREBRACKET:
      return this.Brackets(this.readSequence, context.recognizer);
    case STRING:
      return this.String();
    case DIMENSION:
      return this.Dimension();
    case PERCENTAGE$1:
      return this.Percentage();
    case NUMBER$1:
      return this.Number();
    case FUNCTION$1:
      return cmpStr$4(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);
    case URL$2:
      return this.Url();
    case IDENT$1:
      if (cmpChar$1(this.scanner.source, this.scanner.tokenStart, U) && cmpChar$1(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN)) {
        return this.UnicodeRange();
      } else {
        return this.Identifier();
      }
    case DELIM:
      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
      if (code === SOLIDUS || code === ASTERISK || code === PLUSSIGN || code === HYPHENMINUS) {
        return this.Operator();
      }
      if (code === NUMBERSIGN$1) {
        this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
      }
      break;
  }
};
var atrulePrelude = {
  getNode: _default
};
var TYPE$6 = tokenizer2.TYPE;
var DELIM$1 = TYPE$6.Delim;
var IDENT$2 = TYPE$6.Ident;
var DIMENSION$1 = TYPE$6.Dimension;
var PERCENTAGE$2 = TYPE$6.Percentage;
var NUMBER$2 = TYPE$6.Number;
var HASH$2 = TYPE$6.Hash;
var COLON = TYPE$6.Colon;
var LEFTSQUAREBRACKET$1 = TYPE$6.LeftSquareBracket;
var NUMBERSIGN$2 = 35;
var ASTERISK$1 = 42;
var PLUSSIGN$1 = 43;
var SOLIDUS$1 = 47;
var FULLSTOP = 46;
var GREATERTHANSIGN = 62;
var VERTICALLINE = 124;
var TILDE = 126;
function getNode(context) {
  switch (this.scanner.tokenType) {
    case LEFTSQUAREBRACKET$1:
      return this.AttributeSelector();
    case HASH$2:
      return this.IdSelector();
    case COLON:
      if (this.scanner.lookupType(1) === COLON) {
        return this.PseudoElementSelector();
      } else {
        return this.PseudoClassSelector();
      }
    case IDENT$2:
      return this.TypeSelector();
    case NUMBER$2:
    case PERCENTAGE$2:
      return this.Percentage();
    case DIMENSION$1:
      if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP) {
        this.error("Identifier is expected", this.scanner.tokenStart + 1);
      }
      break;
    case DELIM$1:
      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
      switch (code) {
        case PLUSSIGN$1:
        case GREATERTHANSIGN:
        case TILDE:
          context.space = null;
          context.ignoreWSAfter = true;
          return this.Combinator();
        case SOLIDUS$1:
          return this.Combinator();
        case FULLSTOP:
          return this.ClassSelector();
        case ASTERISK$1:
        case VERTICALLINE:
          return this.TypeSelector();
        case NUMBERSIGN$2:
          return this.IdSelector();
      }
      break;
  }
}
var selector = {
  getNode
};
var expression = function() {
  return this.createSingleNodeList(
    this.Raw(this.scanner.tokenIndex, null, false)
  );
};
var TYPE$7 = tokenizer2.TYPE;
var WhiteSpace = TYPE$7.WhiteSpace;
var Semicolon = TYPE$7.Semicolon;
var LeftCurlyBracket = TYPE$7.LeftCurlyBracket;
var Delim = TYPE$7.Delim;
var EXCLAMATIONMARK = 33;
function getOffsetExcludeWS() {
  if (this.scanner.tokenIndex > 0) {
    if (this.scanner.lookupType(-1) === WhiteSpace) {
      return this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset;
    }
  }
  return this.scanner.tokenStart;
}
function balanceEnd() {
  return 0;
}
function leftCurlyBracket(tokenType) {
  return tokenType === LeftCurlyBracket ? 1 : 0;
}
function leftCurlyBracketOrSemicolon(tokenType) {
  return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
}
function exclamationMarkOrSemicolon(tokenType, source, offset3) {
  if (tokenType === Delim && source.charCodeAt(offset3) === EXCLAMATIONMARK) {
    return 1;
  }
  return tokenType === Semicolon ? 1 : 0;
}
function semicolonIncluded(tokenType) {
  return tokenType === Semicolon ? 2 : 0;
}
var Raw = {
  name: "Raw",
  structure: {
    value: String
  },
  parse: function(startToken, mode, excludeWhiteSpace) {
    var startOffset = this.scanner.getTokenStart(startToken);
    var endOffset;
    this.scanner.skip(
      this.scanner.getRawLength(startToken, mode || balanceEnd)
    );
    if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
      endOffset = getOffsetExcludeWS.call(this);
    } else {
      endOffset = this.scanner.tokenStart;
    }
    return {
      type: "Raw",
      loc: this.getLocation(startOffset, endOffset),
      value: this.scanner.source.substring(startOffset, endOffset)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
  },
  mode: {
    default: balanceEnd,
    leftCurlyBracket,
    leftCurlyBracketOrSemicolon,
    exclamationMarkOrSemicolon,
    semicolonIncluded
  }
};
var TYPE$8 = tokenizer2.TYPE;
var rawMode = Raw.mode;
var COMMA$1 = TYPE$8.Comma;
var WHITESPACE$3 = TYPE$8.WhiteSpace;
var _var = function() {
  var children2 = this.createList();
  this.scanner.skipSC();
  children2.push(this.Identifier());
  this.scanner.skipSC();
  if (this.scanner.tokenType === COMMA$1) {
    children2.push(this.Operator());
    const startIndex = this.scanner.tokenIndex;
    const value2 = this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, rawMode.exclamationMarkOrSemicolon, false);
    if (value2.type === "Value" && value2.children.isEmpty()) {
      for (let offset3 = startIndex - this.scanner.tokenIndex; offset3 <= 0; offset3++) {
        if (this.scanner.lookupType(offset3) === WHITESPACE$3) {
          value2.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
      }
    }
    children2.push(value2);
  }
  return children2;
};
var value = {
  getNode: _default,
  "expression": expression,
  "var": _var
};
var scope = {
  AtrulePrelude: atrulePrelude,
  Selector: selector,
  Value: value
};
var fontFace = {
  parse: {
    prelude: null,
    block: function() {
      return this.Block(true);
    }
  }
};
var TYPE$9 = tokenizer2.TYPE;
var STRING$1 = TYPE$9.String;
var IDENT$3 = TYPE$9.Ident;
var URL$3 = TYPE$9.Url;
var FUNCTION$2 = TYPE$9.Function;
var LEFTPARENTHESIS$1 = TYPE$9.LeftParenthesis;
var _import = {
  parse: {
    prelude: function() {
      var children2 = this.createList();
      this.scanner.skipSC();
      switch (this.scanner.tokenType) {
        case STRING$1:
          children2.push(this.String());
          break;
        case URL$3:
        case FUNCTION$2:
          children2.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      if (this.lookupNonWSType(0) === IDENT$3 || this.lookupNonWSType(0) === LEFTPARENTHESIS$1) {
        children2.push(this.WhiteSpace());
        children2.push(this.MediaQueryList());
      }
      return children2;
    },
    block: null
  }
};
var media = {
  parse: {
    prelude: function() {
      return this.createSingleNodeList(
        this.MediaQueryList()
      );
    },
    block: function() {
      return this.Block(false);
    }
  }
};
var page = {
  parse: {
    prelude: function() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block: function() {
      return this.Block(true);
    }
  }
};
var TYPE$a = tokenizer2.TYPE;
var WHITESPACE$4 = TYPE$a.WhiteSpace;
var COMMENT$3 = TYPE$a.Comment;
var IDENT$4 = TYPE$a.Ident;
var FUNCTION$3 = TYPE$a.Function;
var COLON$1 = TYPE$a.Colon;
var LEFTPARENTHESIS$2 = TYPE$a.LeftParenthesis;
function consumeRaw() {
  return this.createSingleNodeList(
    this.Raw(this.scanner.tokenIndex, null, false)
  );
}
function parentheses() {
  this.scanner.skipSC();
  if (this.scanner.tokenType === IDENT$4 && this.lookupNonWSType(1) === COLON$1) {
    return this.createSingleNodeList(
      this.Declaration()
    );
  }
  return readSequence2.call(this);
}
function readSequence2() {
  var children2 = this.createList();
  var space = null;
  var child;
  this.scanner.skipSC();
  scan:
    while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case WHITESPACE$4:
          space = this.WhiteSpace();
          continue;
        case COMMENT$3:
          this.scanner.next();
          continue;
        case FUNCTION$3:
          child = this.Function(consumeRaw, this.scope.AtrulePrelude);
          break;
        case IDENT$4:
          child = this.Identifier();
          break;
        case LEFTPARENTHESIS$2:
          child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
          break;
        default:
          break scan;
      }
      if (space !== null) {
        children2.push(space);
        space = null;
      }
      children2.push(child);
    }
  return children2;
}
var supports = {
  parse: {
    prelude: function() {
      var children2 = readSequence2.call(this);
      if (this.getFirstListNode(children2) === null) {
        this.error("Condition is expected");
      }
      return children2;
    },
    block: function() {
      return this.Block(false);
    }
  }
};
var atrule = {
  "font-face": fontFace,
  "import": _import,
  "media": media,
  "page": page,
  "supports": supports
};
var dir = {
  parse: function() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
};
var has = {
  parse: function() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
};
var lang = {
  parse: function() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
};
var selectorList = {
  parse: function selectorList2() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
};
var matches = selectorList;
var not = selectorList;
var ALLOW_OF_CLAUSE = true;
var nthWithOfClause = {
  parse: function nthWithOfClause2() {
    return this.createSingleNodeList(
      this.Nth(ALLOW_OF_CLAUSE)
    );
  }
};
var nthChild = nthWithOfClause;
var nthLastChild = nthWithOfClause;
var DISALLOW_OF_CLAUSE = false;
var nth = {
  parse: function nth2() {
    return this.createSingleNodeList(
      this.Nth(DISALLOW_OF_CLAUSE)
    );
  }
};
var nthLastOfType = nth;
var nthOfType = nth;
var slotted = {
  parse: function compoundSelector() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
};
var pseudo = {
  "dir": dir,
  "has": has,
  "lang": lang,
  "matches": matches,
  "not": not,
  "nth-child": nthChild,
  "nth-last-child": nthLastChild,
  "nth-last-of-type": nthLastOfType,
  "nth-of-type": nthOfType,
  "slotted": slotted
};
var cmpChar$2 = tokenizer2.cmpChar;
var isDigit$2 = tokenizer2.isDigit;
var TYPE$b = tokenizer2.TYPE;
var WHITESPACE$5 = TYPE$b.WhiteSpace;
var COMMENT$4 = TYPE$b.Comment;
var IDENT$5 = TYPE$b.Ident;
var NUMBER$3 = TYPE$b.Number;
var DIMENSION$2 = TYPE$b.Dimension;
var PLUSSIGN$2 = 43;
var HYPHENMINUS$1 = 45;
var N$1 = 110;
var DISALLOW_SIGN = true;
var ALLOW_SIGN = false;
function checkInteger(offset3, disallowSign) {
  var pos = this.scanner.tokenStart + offset3;
  var code = this.scanner.source.charCodeAt(pos);
  if (code === PLUSSIGN$2 || code === HYPHENMINUS$1) {
    if (disallowSign) {
      this.error("Number sign is not allowed");
    }
    pos++;
  }
  for (; pos < this.scanner.tokenEnd; pos++) {
    if (!isDigit$2(this.scanner.source.charCodeAt(pos))) {
      this.error("Integer is expected", pos);
    }
  }
}
function checkTokenIsInteger(disallowSign) {
  return checkInteger.call(this, 0, disallowSign);
}
function expectCharCode(offset3, code) {
  if (!cmpChar$2(this.scanner.source, this.scanner.tokenStart + offset3, code)) {
    var msg = "";
    switch (code) {
      case N$1:
        msg = "N is expected";
        break;
      case HYPHENMINUS$1:
        msg = "HyphenMinus is expected";
        break;
    }
    this.error(msg, this.scanner.tokenStart + offset3);
  }
}
function consumeB() {
  var offset3 = 0;
  var sign = 0;
  var type = this.scanner.tokenType;
  while (type === WHITESPACE$5 || type === COMMENT$4) {
    type = this.scanner.lookupType(++offset3);
  }
  if (type !== NUMBER$3) {
    if (this.scanner.isDelim(PLUSSIGN$2, offset3) || this.scanner.isDelim(HYPHENMINUS$1, offset3)) {
      sign = this.scanner.isDelim(PLUSSIGN$2, offset3) ? PLUSSIGN$2 : HYPHENMINUS$1;
      do {
        type = this.scanner.lookupType(++offset3);
      } while (type === WHITESPACE$5 || type === COMMENT$4);
      if (type !== NUMBER$3) {
        this.scanner.skip(offset3);
        checkTokenIsInteger.call(this, DISALLOW_SIGN);
      }
    } else {
      return null;
    }
  }
  if (offset3 > 0) {
    this.scanner.skip(offset3);
  }
  if (sign === 0) {
    type = this.scanner.source.charCodeAt(this.scanner.tokenStart);
    if (type !== PLUSSIGN$2 && type !== HYPHENMINUS$1) {
      this.error("Number sign is expected");
    }
  }
  checkTokenIsInteger.call(this, sign !== 0);
  return sign === HYPHENMINUS$1 ? "-" + this.consume(NUMBER$3) : this.consume(NUMBER$3);
}
var AnPlusB = {
  name: "AnPlusB",
  structure: {
    a: [String, null],
    b: [String, null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var a = null;
    var b = null;
    if (this.scanner.tokenType === NUMBER$3) {
      checkTokenIsInteger.call(this, ALLOW_SIGN);
      b = this.consume(NUMBER$3);
    } else if (this.scanner.tokenType === IDENT$5 && cmpChar$2(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS$1)) {
      a = "-1";
      expectCharCode.call(this, 1, N$1);
      switch (this.scanner.getTokenLength()) {
        case 2:
          this.scanner.next();
          b = consumeB.call(this);
          break;
        case 3:
          expectCharCode.call(this, 2, HYPHENMINUS$1);
          this.scanner.next();
          this.scanner.skipSC();
          checkTokenIsInteger.call(this, DISALLOW_SIGN);
          b = "-" + this.consume(NUMBER$3);
          break;
        default:
          expectCharCode.call(this, 2, HYPHENMINUS$1);
          checkInteger.call(this, 3, DISALLOW_SIGN);
          this.scanner.next();
          b = this.scanner.substrToCursor(start + 2);
      }
    } else if (this.scanner.tokenType === IDENT$5 || this.scanner.isDelim(PLUSSIGN$2) && this.scanner.lookupType(1) === IDENT$5) {
      var sign = 0;
      a = "1";
      if (this.scanner.isDelim(PLUSSIGN$2)) {
        sign = 1;
        this.scanner.next();
      }
      expectCharCode.call(this, 0, N$1);
      switch (this.scanner.getTokenLength()) {
        case 1:
          this.scanner.next();
          b = consumeB.call(this);
          break;
        case 2:
          expectCharCode.call(this, 1, HYPHENMINUS$1);
          this.scanner.next();
          this.scanner.skipSC();
          checkTokenIsInteger.call(this, DISALLOW_SIGN);
          b = "-" + this.consume(NUMBER$3);
          break;
        default:
          expectCharCode.call(this, 1, HYPHENMINUS$1);
          checkInteger.call(this, 2, DISALLOW_SIGN);
          this.scanner.next();
          b = this.scanner.substrToCursor(start + sign + 1);
      }
    } else if (this.scanner.tokenType === DIMENSION$2) {
      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
      var sign = code === PLUSSIGN$2 || code === HYPHENMINUS$1;
      for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
        if (!isDigit$2(this.scanner.source.charCodeAt(i))) {
          break;
        }
      }
      if (i === this.scanner.tokenStart + sign) {
        this.error("Integer is expected", this.scanner.tokenStart + sign);
      }
      expectCharCode.call(this, i - this.scanner.tokenStart, N$1);
      a = this.scanner.source.substring(start, i);
      if (i + 1 === this.scanner.tokenEnd) {
        this.scanner.next();
        b = consumeB.call(this);
      } else {
        expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS$1);
        if (i + 2 === this.scanner.tokenEnd) {
          this.scanner.next();
          this.scanner.skipSC();
          checkTokenIsInteger.call(this, DISALLOW_SIGN);
          b = "-" + this.consume(NUMBER$3);
        } else {
          checkInteger.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN);
          this.scanner.next();
          b = this.scanner.substrToCursor(i + 1);
        }
      }
    } else {
      this.error();
    }
    if (a !== null && a.charCodeAt(0) === PLUSSIGN$2) {
      a = a.substr(1);
    }
    if (b !== null && b.charCodeAt(0) === PLUSSIGN$2) {
      b = b.substr(1);
    }
    return {
      type: "AnPlusB",
      loc: this.getLocation(start, this.scanner.tokenStart),
      a,
      b
    };
  },
  generate: function(node2) {
    var a = node2.a !== null && node2.a !== void 0;
    var b = node2.b !== null && node2.b !== void 0;
    if (a) {
      this.chunk(
        node2.a === "+1" ? "+n" : node2.a === "1" ? "n" : node2.a === "-1" ? "-n" : node2.a + "n"
      );
      if (b) {
        b = String(node2.b);
        if (b.charAt(0) === "-" || b.charAt(0) === "+") {
          this.chunk(b.charAt(0));
          this.chunk(b.substr(1));
        } else {
          this.chunk("+");
          this.chunk(b);
        }
      }
    } else {
      this.chunk(String(node2.b));
    }
  }
};
var TYPE$c = tokenizer2.TYPE;
var rawMode$1 = Raw.mode;
var ATKEYWORD = TYPE$c.AtKeyword;
var SEMICOLON = TYPE$c.Semicolon;
var LEFTCURLYBRACKET = TYPE$c.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE$c.RightCurlyBracket;
function consumeRaw$1(startToken) {
  return this.Raw(startToken, rawMode$1.leftCurlyBracketOrSemicolon, true);
}
function isDeclarationBlockAtrule() {
  for (var offset3 = 1, type; type = this.scanner.lookupType(offset3); offset3++) {
    if (type === RIGHTCURLYBRACKET) {
      return true;
    }
    if (type === LEFTCURLYBRACKET || type === ATKEYWORD) {
      return false;
    }
  }
  return false;
}
var Atrule = {
  name: "Atrule",
  structure: {
    name: String,
    prelude: ["AtrulePrelude", "Raw", null],
    block: ["Block", null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var name;
    var nameLowerCase;
    var prelude = null;
    var block = null;
    this.eat(ATKEYWORD);
    name = this.scanner.substrToCursor(start + 1);
    nameLowerCase = name.toLowerCase();
    this.scanner.skipSC();
    if (this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON) {
      if (this.parseAtrulePrelude) {
        prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw$1);
        if (prelude.type === "AtrulePrelude" && prelude.children.head === null) {
          prelude = null;
        }
      } else {
        prelude = consumeRaw$1.call(this, this.scanner.tokenIndex);
      }
      this.scanner.skipSC();
    }
    switch (this.scanner.tokenType) {
      case SEMICOLON:
        this.scanner.next();
        break;
      case LEFTCURLYBRACKET:
        if (this.atrule.hasOwnProperty(nameLowerCase) && typeof this.atrule[nameLowerCase].block === "function") {
          block = this.atrule[nameLowerCase].block.call(this);
        } else {
          block = this.Block(isDeclarationBlockAtrule.call(this));
        }
        break;
    }
    return {
      type: "Atrule",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      prelude,
      block
    };
  },
  generate: function(node2) {
    this.chunk("@");
    this.chunk(node2.name);
    if (node2.prelude !== null) {
      this.chunk(" ");
      this.node(node2.prelude);
    }
    if (node2.block) {
      this.node(node2.block);
    } else {
      this.chunk(";");
    }
  },
  walkContext: "atrule"
};
var TYPE$d = tokenizer2.TYPE;
var SEMICOLON$1 = TYPE$d.Semicolon;
var LEFTCURLYBRACKET$1 = TYPE$d.LeftCurlyBracket;
var AtrulePrelude = {
  name: "AtrulePrelude",
  structure: {
    children: [[]]
  },
  parse: function(name) {
    var children2 = null;
    if (name !== null) {
      name = name.toLowerCase();
    }
    this.scanner.skipSC();
    if (this.atrule.hasOwnProperty(name) && typeof this.atrule[name].prelude === "function") {
      children2 = this.atrule[name].prelude.call(this);
    } else {
      children2 = this.readSequence(this.scope.AtrulePrelude);
    }
    this.scanner.skipSC();
    if (this.scanner.eof !== true && this.scanner.tokenType !== LEFTCURLYBRACKET$1 && this.scanner.tokenType !== SEMICOLON$1) {
      this.error("Semicolon or block is expected");
    }
    if (children2 === null) {
      children2 = this.createList();
    }
    return {
      type: "AtrulePrelude",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2);
  },
  walkContext: "atrulePrelude"
};
var TYPE$e = tokenizer2.TYPE;
var IDENT$6 = TYPE$e.Ident;
var STRING$2 = TYPE$e.String;
var COLON$2 = TYPE$e.Colon;
var LEFTSQUAREBRACKET$2 = TYPE$e.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE$e.RightSquareBracket;
var DOLLARSIGN = 36;
var ASTERISK$2 = 42;
var EQUALSSIGN = 61;
var CIRCUMFLEXACCENT = 94;
var VERTICALLINE$1 = 124;
var TILDE$1 = 126;
function getAttributeName() {
  if (this.scanner.eof) {
    this.error("Unexpected end of input");
  }
  var start = this.scanner.tokenStart;
  var expectIdent = false;
  var checkColon = true;
  if (this.scanner.isDelim(ASTERISK$2)) {
    expectIdent = true;
    checkColon = false;
    this.scanner.next();
  } else if (!this.scanner.isDelim(VERTICALLINE$1)) {
    this.eat(IDENT$6);
  }
  if (this.scanner.isDelim(VERTICALLINE$1)) {
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
      this.scanner.next();
      this.eat(IDENT$6);
    } else if (expectIdent) {
      this.error("Identifier is expected", this.scanner.tokenEnd);
    }
  } else if (expectIdent) {
    this.error("Vertical line is expected");
  }
  if (checkColon && this.scanner.tokenType === COLON$2) {
    this.scanner.next();
    this.eat(IDENT$6);
  }
  return {
    type: "Identifier",
    loc: this.getLocation(start, this.scanner.tokenStart),
    name: this.scanner.substrToCursor(start)
  };
}
function getOperator() {
  var start = this.scanner.tokenStart;
  var code = this.scanner.source.charCodeAt(start);
  if (code !== EQUALSSIGN && code !== TILDE$1 && code !== CIRCUMFLEXACCENT && code !== DOLLARSIGN && code !== ASTERISK$2 && code !== VERTICALLINE$1) {
    this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected");
  }
  this.scanner.next();
  if (code !== EQUALSSIGN) {
    if (!this.scanner.isDelim(EQUALSSIGN)) {
      this.error("Equal sign is expected");
    }
    this.scanner.next();
  }
  return this.scanner.substrToCursor(start);
}
var AttributeSelector = {
  name: "AttributeSelector",
  structure: {
    name: "Identifier",
    matcher: [String, null],
    value: ["String", "Identifier", null],
    flags: [String, null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var name;
    var matcher = null;
    var value2 = null;
    var flags = null;
    this.eat(LEFTSQUAREBRACKET$2);
    this.scanner.skipSC();
    name = getAttributeName.call(this);
    this.scanner.skipSC();
    if (this.scanner.tokenType !== RIGHTSQUAREBRACKET) {
      if (this.scanner.tokenType !== IDENT$6) {
        matcher = getOperator.call(this);
        this.scanner.skipSC();
        value2 = this.scanner.tokenType === STRING$2 ? this.String() : this.Identifier();
        this.scanner.skipSC();
      }
      if (this.scanner.tokenType === IDENT$6) {
        flags = this.scanner.getTokenValue();
        this.scanner.next();
        this.scanner.skipSC();
      }
    }
    this.eat(RIGHTSQUAREBRACKET);
    return {
      type: "AttributeSelector",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      matcher,
      value: value2,
      flags
    };
  },
  generate: function(node2) {
    var flagsPrefix = " ";
    this.chunk("[");
    this.node(node2.name);
    if (node2.matcher !== null) {
      this.chunk(node2.matcher);
      if (node2.value !== null) {
        this.node(node2.value);
        if (node2.value.type === "String") {
          flagsPrefix = "";
        }
      }
    }
    if (node2.flags !== null) {
      this.chunk(flagsPrefix);
      this.chunk(node2.flags);
    }
    this.chunk("]");
  }
};
var TYPE$f = tokenizer2.TYPE;
var rawMode$2 = Raw.mode;
var WHITESPACE$6 = TYPE$f.WhiteSpace;
var COMMENT$5 = TYPE$f.Comment;
var SEMICOLON$2 = TYPE$f.Semicolon;
var ATKEYWORD$1 = TYPE$f.AtKeyword;
var LEFTCURLYBRACKET$2 = TYPE$f.LeftCurlyBracket;
var RIGHTCURLYBRACKET$1 = TYPE$f.RightCurlyBracket;
function consumeRaw$2(startToken) {
  return this.Raw(startToken, null, true);
}
function consumeRule() {
  return this.parseWithFallback(this.Rule, consumeRaw$2);
}
function consumeRawDeclaration(startToken) {
  return this.Raw(startToken, rawMode$2.semicolonIncluded, true);
}
function consumeDeclaration() {
  if (this.scanner.tokenType === SEMICOLON$2) {
    return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
  }
  var node2 = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
  if (this.scanner.tokenType === SEMICOLON$2) {
    this.scanner.next();
  }
  return node2;
}
var Block = {
  name: "Block",
  structure: {
    children: [[
      "Atrule",
      "Rule",
      "Declaration"
    ]]
  },
  parse: function(isDeclaration) {
    var consumer = isDeclaration ? consumeDeclaration : consumeRule;
    var start = this.scanner.tokenStart;
    var children2 = this.createList();
    this.eat(LEFTCURLYBRACKET$2);
    scan:
      while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case RIGHTCURLYBRACKET$1:
            break scan;
          case WHITESPACE$6:
          case COMMENT$5:
            this.scanner.next();
            break;
          case ATKEYWORD$1:
            children2.push(this.parseWithFallback(this.Atrule, consumeRaw$2));
            break;
          default:
            children2.push(consumer.call(this));
        }
      }
    if (!this.scanner.eof) {
      this.eat(RIGHTCURLYBRACKET$1);
    }
    return {
      type: "Block",
      loc: this.getLocation(start, this.scanner.tokenStart),
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk("{");
    this.children(node2, function(prev2) {
      if (prev2.type === "Declaration") {
        this.chunk(";");
      }
    });
    this.chunk("}");
  },
  walkContext: "block"
};
var TYPE$g = tokenizer2.TYPE;
var LEFTSQUAREBRACKET$3 = TYPE$g.LeftSquareBracket;
var RIGHTSQUAREBRACKET$1 = TYPE$g.RightSquareBracket;
var Brackets = {
  name: "Brackets",
  structure: {
    children: [[]]
  },
  parse: function(readSequence3, recognizer) {
    var start = this.scanner.tokenStart;
    var children2 = null;
    this.eat(LEFTSQUAREBRACKET$3);
    children2 = readSequence3.call(this, recognizer);
    if (!this.scanner.eof) {
      this.eat(RIGHTSQUAREBRACKET$1);
    }
    return {
      type: "Brackets",
      loc: this.getLocation(start, this.scanner.tokenStart),
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk("[");
    this.children(node2);
    this.chunk("]");
  }
};
var CDC = tokenizer2.TYPE.CDC;
var CDC_1 = {
  name: "CDC",
  structure: [],
  parse: function() {
    var start = this.scanner.tokenStart;
    this.eat(CDC);
    return {
      type: "CDC",
      loc: this.getLocation(start, this.scanner.tokenStart)
    };
  },
  generate: function() {
    this.chunk("-->");
  }
};
var CDO = tokenizer2.TYPE.CDO;
var CDO_1 = {
  name: "CDO",
  structure: [],
  parse: function() {
    var start = this.scanner.tokenStart;
    this.eat(CDO);
    return {
      type: "CDO",
      loc: this.getLocation(start, this.scanner.tokenStart)
    };
  },
  generate: function() {
    this.chunk("<!--");
  }
};
var TYPE$h = tokenizer2.TYPE;
var IDENT$7 = TYPE$h.Ident;
var FULLSTOP$1 = 46;
var ClassSelector = {
  name: "ClassSelector",
  structure: {
    name: String
  },
  parse: function() {
    if (!this.scanner.isDelim(FULLSTOP$1)) {
      this.error("Full stop is expected");
    }
    this.scanner.next();
    return {
      type: "ClassSelector",
      loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
      name: this.consume(IDENT$7)
    };
  },
  generate: function(node2) {
    this.chunk(".");
    this.chunk(node2.name);
  }
};
var TYPE$i = tokenizer2.TYPE;
var IDENT$8 = TYPE$i.Ident;
var PLUSSIGN$3 = 43;
var SOLIDUS$2 = 47;
var GREATERTHANSIGN$1 = 62;
var TILDE$2 = 126;
var Combinator = {
  name: "Combinator",
  structure: {
    name: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
    switch (code) {
      case GREATERTHANSIGN$1:
      case PLUSSIGN$3:
      case TILDE$2:
        this.scanner.next();
        break;
      case SOLIDUS$2:
        this.scanner.next();
        if (this.scanner.tokenType !== IDENT$8 || this.scanner.lookupValue(0, "deep") === false) {
          this.error("Identifier `deep` is expected");
        }
        this.scanner.next();
        if (!this.scanner.isDelim(SOLIDUS$2)) {
          this.error("Solidus is expected");
        }
        this.scanner.next();
        break;
      default:
        this.error("Combinator is expected");
    }
    return {
      type: "Combinator",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name: this.scanner.substrToCursor(start)
    };
  },
  generate: function(node2) {
    this.chunk(node2.name);
  }
};
var TYPE$j = tokenizer2.TYPE;
var COMMENT$6 = TYPE$j.Comment;
var ASTERISK$3 = 42;
var SOLIDUS$3 = 47;
var Comment = {
  name: "Comment",
  structure: {
    value: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var end = this.scanner.tokenEnd;
    this.eat(COMMENT$6);
    if (end - start + 2 >= 2 && this.scanner.source.charCodeAt(end - 2) === ASTERISK$3 && this.scanner.source.charCodeAt(end - 1) === SOLIDUS$3) {
      end -= 2;
    }
    return {
      type: "Comment",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.source.substring(start + 2, end)
    };
  },
  generate: function(node2) {
    this.chunk("/*");
    this.chunk(node2.value);
    this.chunk("*/");
  }
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var keywords$2 = /* @__PURE__ */ Object.create(null);
var properties = /* @__PURE__ */ Object.create(null);
var HYPHENMINUS$2 = 45;
function isCustomProperty(str, offset3) {
  offset3 = offset3 || 0;
  return str.length - offset3 >= 2 && str.charCodeAt(offset3) === HYPHENMINUS$2 && str.charCodeAt(offset3 + 1) === HYPHENMINUS$2;
}
function getVendorPrefix(str, offset3) {
  offset3 = offset3 || 0;
  if (str.length - offset3 >= 3) {
    if (str.charCodeAt(offset3) === HYPHENMINUS$2 && str.charCodeAt(offset3 + 1) !== HYPHENMINUS$2) {
      var secondDashIndex = str.indexOf("-", offset3 + 2);
      if (secondDashIndex !== -1) {
        return str.substring(offset3, secondDashIndex + 1);
      }
    }
  }
  return "";
}
function getKeywordDescriptor(keyword) {
  if (hasOwnProperty$1.call(keywords$2, keyword)) {
    return keywords$2[keyword];
  }
  var name = keyword.toLowerCase();
  if (hasOwnProperty$1.call(keywords$2, name)) {
    return keywords$2[keyword] = keywords$2[name];
  }
  var custom = isCustomProperty(name, 0);
  var vendor = !custom ? getVendorPrefix(name, 0) : "";
  return keywords$2[keyword] = Object.freeze({
    basename: name.substr(vendor.length),
    name,
    vendor,
    prefix: vendor,
    custom
  });
}
function getPropertyDescriptor(property) {
  if (hasOwnProperty$1.call(properties, property)) {
    return properties[property];
  }
  var name = property;
  var hack = property[0];
  if (hack === "/") {
    hack = property[1] === "/" ? "//" : "/";
  } else if (hack !== "_" && hack !== "*" && hack !== "$" && hack !== "#" && hack !== "+" && hack !== "&") {
    hack = "";
  }
  var custom = isCustomProperty(name, hack.length);
  if (!custom) {
    name = name.toLowerCase();
    if (hasOwnProperty$1.call(properties, name)) {
      return properties[property] = properties[name];
    }
  }
  var vendor = !custom ? getVendorPrefix(name, hack.length) : "";
  var prefix2 = name.substr(0, hack.length + vendor.length);
  return properties[property] = Object.freeze({
    basename: name.substr(prefix2.length),
    name: name.substr(hack.length),
    hack,
    vendor,
    prefix: prefix2,
    custom
  });
}
var names = {
  keyword: getKeywordDescriptor,
  property: getPropertyDescriptor,
  isCustomProperty,
  vendorPrefix: getVendorPrefix
};
var isCustomProperty$1 = names.isCustomProperty;
var TYPE$k = tokenizer2.TYPE;
var rawMode$3 = Raw.mode;
var IDENT$9 = TYPE$k.Ident;
var HASH$3 = TYPE$k.Hash;
var COLON$3 = TYPE$k.Colon;
var SEMICOLON$3 = TYPE$k.Semicolon;
var DELIM$2 = TYPE$k.Delim;
var WHITESPACE$7 = TYPE$k.WhiteSpace;
var EXCLAMATIONMARK$1 = 33;
var NUMBERSIGN$3 = 35;
var DOLLARSIGN$1 = 36;
var AMPERSAND = 38;
var ASTERISK$4 = 42;
var PLUSSIGN$4 = 43;
var SOLIDUS$4 = 47;
function consumeValueRaw(startToken) {
  return this.Raw(startToken, rawMode$3.exclamationMarkOrSemicolon, true);
}
function consumeCustomPropertyRaw(startToken) {
  return this.Raw(startToken, rawMode$3.exclamationMarkOrSemicolon, false);
}
function consumeValue() {
  var startValueToken = this.scanner.tokenIndex;
  var value2 = this.Value();
  if (value2.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON$3 && this.scanner.isDelim(EXCLAMATIONMARK$1) === false && this.scanner.isBalanceEdge(startValueToken) === false) {
    this.error();
  }
  return value2;
}
var Declaration = {
  name: "Declaration",
  structure: {
    important: [Boolean, String],
    property: String,
    value: ["Value", "Raw"]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var startToken = this.scanner.tokenIndex;
    var property = readProperty.call(this);
    var customProperty = isCustomProperty$1(property);
    var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
    var consumeRaw2 = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
    var important = false;
    var value2;
    this.scanner.skipSC();
    this.eat(COLON$3);
    const valueStart = this.scanner.tokenIndex;
    if (!customProperty) {
      this.scanner.skipSC();
    }
    if (parseValue) {
      value2 = this.parseWithFallback(consumeValue, consumeRaw2);
    } else {
      value2 = consumeRaw2.call(this, this.scanner.tokenIndex);
    }
    if (customProperty && value2.type === "Value" && value2.children.isEmpty()) {
      for (let offset3 = valueStart - this.scanner.tokenIndex; offset3 <= 0; offset3++) {
        if (this.scanner.lookupType(offset3) === WHITESPACE$7) {
          value2.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
      }
    }
    if (this.scanner.isDelim(EXCLAMATIONMARK$1)) {
      important = getImportant.call(this);
      this.scanner.skipSC();
    }
    if (this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON$3 && this.scanner.isBalanceEdge(startToken) === false) {
      this.error();
    }
    return {
      type: "Declaration",
      loc: this.getLocation(start, this.scanner.tokenStart),
      important,
      property,
      value: value2
    };
  },
  generate: function(node2) {
    this.chunk(node2.property);
    this.chunk(":");
    this.node(node2.value);
    if (node2.important) {
      this.chunk(node2.important === true ? "!important" : "!" + node2.important);
    }
  },
  walkContext: "declaration"
};
function readProperty() {
  var start = this.scanner.tokenStart;
  if (this.scanner.tokenType === DELIM$2) {
    switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
      case ASTERISK$4:
      case DOLLARSIGN$1:
      case PLUSSIGN$4:
      case NUMBERSIGN$3:
      case AMPERSAND:
        this.scanner.next();
        break;
      case SOLIDUS$4:
        this.scanner.next();
        if (this.scanner.isDelim(SOLIDUS$4)) {
          this.scanner.next();
        }
        break;
    }
  }
  if (this.scanner.tokenType === HASH$3) {
    this.eat(HASH$3);
  } else {
    this.eat(IDENT$9);
  }
  return this.scanner.substrToCursor(start);
}
function getImportant() {
  this.eat(DELIM$2);
  this.scanner.skipSC();
  var important = this.consume(IDENT$9);
  return important === "important" ? true : important;
}
var TYPE$l = tokenizer2.TYPE;
var rawMode$4 = Raw.mode;
var WHITESPACE$8 = TYPE$l.WhiteSpace;
var COMMENT$7 = TYPE$l.Comment;
var SEMICOLON$4 = TYPE$l.Semicolon;
function consumeRaw$3(startToken) {
  return this.Raw(startToken, rawMode$4.semicolonIncluded, true);
}
var DeclarationList = {
  name: "DeclarationList",
  structure: {
    children: [[
      "Declaration"
    ]]
  },
  parse: function() {
    var children2 = this.createList();
    while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case WHITESPACE$8:
        case COMMENT$7:
        case SEMICOLON$4:
          this.scanner.next();
          break;
        default:
          children2.push(this.parseWithFallback(this.Declaration, consumeRaw$3));
      }
    }
    return {
      type: "DeclarationList",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2, function(prev2) {
      if (prev2.type === "Declaration") {
        this.chunk(";");
      }
    });
  }
};
var consumeNumber$2 = utils.consumeNumber;
var TYPE$m = tokenizer2.TYPE;
var DIMENSION$3 = TYPE$m.Dimension;
var Dimension = {
  name: "Dimension",
  structure: {
    value: String,
    unit: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var numberEnd = consumeNumber$2(this.scanner.source, start);
    this.eat(DIMENSION$3);
    return {
      type: "Dimension",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.source.substring(start, numberEnd),
      unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
    this.chunk(node2.unit);
  }
};
var TYPE$n = tokenizer2.TYPE;
var RIGHTPARENTHESIS = TYPE$n.RightParenthesis;
var _Function = {
  name: "Function",
  structure: {
    name: String,
    children: [[]]
  },
  parse: function(readSequence3, recognizer) {
    var start = this.scanner.tokenStart;
    var name = this.consumeFunctionName();
    var nameLowerCase = name.toLowerCase();
    var children2;
    children2 = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence3.call(this, recognizer);
    if (!this.scanner.eof) {
      this.eat(RIGHTPARENTHESIS);
    }
    return {
      type: "Function",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk(node2.name);
    this.chunk("(");
    this.children(node2);
    this.chunk(")");
  },
  walkContext: "function"
};
var TYPE$o = tokenizer2.TYPE;
var HASH$4 = TYPE$o.Hash;
var Hash = {
  name: "Hash",
  structure: {
    value: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    this.eat(HASH$4);
    return {
      type: "Hash",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.substrToCursor(start + 1)
    };
  },
  generate: function(node2) {
    this.chunk("#");
    this.chunk(node2.value);
  }
};
var TYPE$p = tokenizer2.TYPE;
var IDENT$a = TYPE$p.Ident;
var Identifier = {
  name: "Identifier",
  structure: {
    name: String
  },
  parse: function() {
    return {
      type: "Identifier",
      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
      name: this.consume(IDENT$a)
    };
  },
  generate: function(node2) {
    this.chunk(node2.name);
  }
};
var TYPE$q = tokenizer2.TYPE;
var HASH$5 = TYPE$q.Hash;
var IdSelector = {
  name: "IdSelector",
  structure: {
    name: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    this.eat(HASH$5);
    return {
      type: "IdSelector",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name: this.scanner.substrToCursor(start + 1)
    };
  },
  generate: function(node2) {
    this.chunk("#");
    this.chunk(node2.name);
  }
};
var TYPE$r = tokenizer2.TYPE;
var IDENT$b = TYPE$r.Ident;
var NUMBER$4 = TYPE$r.Number;
var DIMENSION$4 = TYPE$r.Dimension;
var LEFTPARENTHESIS$3 = TYPE$r.LeftParenthesis;
var RIGHTPARENTHESIS$1 = TYPE$r.RightParenthesis;
var COLON$4 = TYPE$r.Colon;
var DELIM$3 = TYPE$r.Delim;
var MediaFeature = {
  name: "MediaFeature",
  structure: {
    name: String,
    value: ["Identifier", "Number", "Dimension", "Ratio", null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var name;
    var value2 = null;
    this.eat(LEFTPARENTHESIS$3);
    this.scanner.skipSC();
    name = this.consume(IDENT$b);
    this.scanner.skipSC();
    if (this.scanner.tokenType !== RIGHTPARENTHESIS$1) {
      this.eat(COLON$4);
      this.scanner.skipSC();
      switch (this.scanner.tokenType) {
        case NUMBER$4:
          if (this.lookupNonWSType(1) === DELIM$3) {
            value2 = this.Ratio();
          } else {
            value2 = this.Number();
          }
          break;
        case DIMENSION$4:
          value2 = this.Dimension();
          break;
        case IDENT$b:
          value2 = this.Identifier();
          break;
        default:
          this.error("Number, dimension, ratio or identifier is expected");
      }
      this.scanner.skipSC();
    }
    this.eat(RIGHTPARENTHESIS$1);
    return {
      type: "MediaFeature",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      value: value2
    };
  },
  generate: function(node2) {
    this.chunk("(");
    this.chunk(node2.name);
    if (node2.value !== null) {
      this.chunk(":");
      this.node(node2.value);
    }
    this.chunk(")");
  }
};
var TYPE$s = tokenizer2.TYPE;
var WHITESPACE$9 = TYPE$s.WhiteSpace;
var COMMENT$8 = TYPE$s.Comment;
var IDENT$c = TYPE$s.Ident;
var LEFTPARENTHESIS$4 = TYPE$s.LeftParenthesis;
var MediaQuery = {
  name: "MediaQuery",
  structure: {
    children: [[
      "Identifier",
      "MediaFeature",
      "WhiteSpace"
    ]]
  },
  parse: function() {
    this.scanner.skipSC();
    var children2 = this.createList();
    var child = null;
    var space = null;
    scan:
      while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case COMMENT$8:
            this.scanner.next();
            continue;
          case WHITESPACE$9:
            space = this.WhiteSpace();
            continue;
          case IDENT$c:
            child = this.Identifier();
            break;
          case LEFTPARENTHESIS$4:
            child = this.MediaFeature();
            break;
          default:
            break scan;
        }
        if (space !== null) {
          children2.push(space);
          space = null;
        }
        children2.push(child);
      }
    if (child === null) {
      this.error("Identifier or parenthesis is expected");
    }
    return {
      type: "MediaQuery",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2);
  }
};
var COMMA$2 = tokenizer2.TYPE.Comma;
var MediaQueryList = {
  name: "MediaQueryList",
  structure: {
    children: [[
      "MediaQuery"
    ]]
  },
  parse: function(relative) {
    var children2 = this.createList();
    this.scanner.skipSC();
    while (!this.scanner.eof) {
      children2.push(this.MediaQuery(relative));
      if (this.scanner.tokenType !== COMMA$2) {
        break;
      }
      this.scanner.next();
    }
    return {
      type: "MediaQueryList",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2, function() {
      this.chunk(",");
    });
  }
};
var Nth = {
  name: "Nth",
  structure: {
    nth: ["AnPlusB", "Identifier"],
    selector: ["SelectorList", null]
  },
  parse: function(allowOfClause) {
    this.scanner.skipSC();
    var start = this.scanner.tokenStart;
    var end = start;
    var selector2 = null;
    var query;
    if (this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even")) {
      query = this.Identifier();
    } else {
      query = this.AnPlusB();
    }
    this.scanner.skipSC();
    if (allowOfClause && this.scanner.lookupValue(0, "of")) {
      this.scanner.next();
      selector2 = this.SelectorList();
      if (this.needPositions) {
        end = this.getLastListNode(selector2.children).loc.end.offset;
      }
    } else {
      if (this.needPositions) {
        end = query.loc.end.offset;
      }
    }
    return {
      type: "Nth",
      loc: this.getLocation(start, end),
      nth: query,
      selector: selector2
    };
  },
  generate: function(node2) {
    this.node(node2.nth);
    if (node2.selector !== null) {
      this.chunk(" of ");
      this.node(node2.selector);
    }
  }
};
var NUMBER$5 = tokenizer2.TYPE.Number;
var _Number = {
  name: "Number",
  structure: {
    value: String
  },
  parse: function() {
    return {
      type: "Number",
      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
      value: this.consume(NUMBER$5)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
  }
};
var Operator = {
  name: "Operator",
  structure: {
    value: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    this.scanner.next();
    return {
      type: "Operator",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.substrToCursor(start)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
  }
};
var TYPE$t = tokenizer2.TYPE;
var LEFTPARENTHESIS$5 = TYPE$t.LeftParenthesis;
var RIGHTPARENTHESIS$2 = TYPE$t.RightParenthesis;
var Parentheses = {
  name: "Parentheses",
  structure: {
    children: [[]]
  },
  parse: function(readSequence3, recognizer) {
    var start = this.scanner.tokenStart;
    var children2 = null;
    this.eat(LEFTPARENTHESIS$5);
    children2 = readSequence3.call(this, recognizer);
    if (!this.scanner.eof) {
      this.eat(RIGHTPARENTHESIS$2);
    }
    return {
      type: "Parentheses",
      loc: this.getLocation(start, this.scanner.tokenStart),
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk("(");
    this.children(node2);
    this.chunk(")");
  }
};
var consumeNumber$3 = utils.consumeNumber;
var TYPE$u = tokenizer2.TYPE;
var PERCENTAGE$3 = TYPE$u.Percentage;
var Percentage = {
  name: "Percentage",
  structure: {
    value: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var numberEnd = consumeNumber$3(this.scanner.source, start);
    this.eat(PERCENTAGE$3);
    return {
      type: "Percentage",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.source.substring(start, numberEnd)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
    this.chunk("%");
  }
};
var TYPE$v = tokenizer2.TYPE;
var IDENT$d = TYPE$v.Ident;
var FUNCTION$4 = TYPE$v.Function;
var COLON$5 = TYPE$v.Colon;
var RIGHTPARENTHESIS$3 = TYPE$v.RightParenthesis;
var PseudoClassSelector = {
  name: "PseudoClassSelector",
  structure: {
    name: String,
    children: [["Raw"], null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var children2 = null;
    var name;
    var nameLowerCase;
    this.eat(COLON$5);
    if (this.scanner.tokenType === FUNCTION$4) {
      name = this.consumeFunctionName();
      nameLowerCase = name.toLowerCase();
      if (this.pseudo.hasOwnProperty(nameLowerCase)) {
        this.scanner.skipSC();
        children2 = this.pseudo[nameLowerCase].call(this);
        this.scanner.skipSC();
      } else {
        children2 = this.createList();
        children2.push(
          this.Raw(this.scanner.tokenIndex, null, false)
        );
      }
      this.eat(RIGHTPARENTHESIS$3);
    } else {
      name = this.consume(IDENT$d);
    }
    return {
      type: "PseudoClassSelector",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk(":");
    this.chunk(node2.name);
    if (node2.children !== null) {
      this.chunk("(");
      this.children(node2);
      this.chunk(")");
    }
  },
  walkContext: "function"
};
var TYPE$w = tokenizer2.TYPE;
var IDENT$e = TYPE$w.Ident;
var FUNCTION$5 = TYPE$w.Function;
var COLON$6 = TYPE$w.Colon;
var RIGHTPARENTHESIS$4 = TYPE$w.RightParenthesis;
var PseudoElementSelector = {
  name: "PseudoElementSelector",
  structure: {
    name: String,
    children: [["Raw"], null]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var children2 = null;
    var name;
    var nameLowerCase;
    this.eat(COLON$6);
    this.eat(COLON$6);
    if (this.scanner.tokenType === FUNCTION$5) {
      name = this.consumeFunctionName();
      nameLowerCase = name.toLowerCase();
      if (this.pseudo.hasOwnProperty(nameLowerCase)) {
        this.scanner.skipSC();
        children2 = this.pseudo[nameLowerCase].call(this);
        this.scanner.skipSC();
      } else {
        children2 = this.createList();
        children2.push(
          this.Raw(this.scanner.tokenIndex, null, false)
        );
      }
      this.eat(RIGHTPARENTHESIS$4);
    } else {
      name = this.consume(IDENT$e);
    }
    return {
      type: "PseudoElementSelector",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name,
      children: children2
    };
  },
  generate: function(node2) {
    this.chunk("::");
    this.chunk(node2.name);
    if (node2.children !== null) {
      this.chunk("(");
      this.children(node2);
      this.chunk(")");
    }
  },
  walkContext: "function"
};
var isDigit$3 = tokenizer2.isDigit;
var TYPE$x = tokenizer2.TYPE;
var NUMBER$6 = TYPE$x.Number;
var DELIM$4 = TYPE$x.Delim;
var SOLIDUS$5 = 47;
var FULLSTOP$2 = 46;
function consumeNumber$4() {
  this.scanner.skipWS();
  var value2 = this.consume(NUMBER$6);
  for (var i = 0; i < value2.length; i++) {
    var code = value2.charCodeAt(i);
    if (!isDigit$3(code) && code !== FULLSTOP$2) {
      this.error("Unsigned number is expected", this.scanner.tokenStart - value2.length + i);
    }
  }
  if (Number(value2) === 0) {
    this.error("Zero number is not allowed", this.scanner.tokenStart - value2.length);
  }
  return value2;
}
var Ratio = {
  name: "Ratio",
  structure: {
    left: String,
    right: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var left = consumeNumber$4.call(this);
    var right;
    this.scanner.skipWS();
    if (!this.scanner.isDelim(SOLIDUS$5)) {
      this.error("Solidus is expected");
    }
    this.eat(DELIM$4);
    right = consumeNumber$4.call(this);
    return {
      type: "Ratio",
      loc: this.getLocation(start, this.scanner.tokenStart),
      left,
      right
    };
  },
  generate: function(node2) {
    this.chunk(node2.left);
    this.chunk("/");
    this.chunk(node2.right);
  }
};
var TYPE$y = tokenizer2.TYPE;
var rawMode$5 = Raw.mode;
var LEFTCURLYBRACKET$3 = TYPE$y.LeftCurlyBracket;
function consumeRaw$4(startToken) {
  return this.Raw(startToken, rawMode$5.leftCurlyBracket, true);
}
function consumePrelude() {
  var prelude = this.SelectorList();
  if (prelude.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET$3) {
    this.error();
  }
  return prelude;
}
var Rule = {
  name: "Rule",
  structure: {
    prelude: ["SelectorList", "Raw"],
    block: ["Block"]
  },
  parse: function() {
    var startToken = this.scanner.tokenIndex;
    var startOffset = this.scanner.tokenStart;
    var prelude;
    var block;
    if (this.parseRulePrelude) {
      prelude = this.parseWithFallback(consumePrelude, consumeRaw$4);
    } else {
      prelude = consumeRaw$4.call(this, startToken);
    }
    block = this.Block(true);
    return {
      type: "Rule",
      loc: this.getLocation(startOffset, this.scanner.tokenStart),
      prelude,
      block
    };
  },
  generate: function(node2) {
    this.node(node2.prelude);
    this.node(node2.block);
  },
  walkContext: "rule"
};
var Selector = {
  name: "Selector",
  structure: {
    children: [[
      "TypeSelector",
      "IdSelector",
      "ClassSelector",
      "AttributeSelector",
      "PseudoClassSelector",
      "PseudoElementSelector",
      "Combinator",
      "WhiteSpace"
    ]]
  },
  parse: function() {
    var children2 = this.readSequence(this.scope.Selector);
    if (this.getFirstListNode(children2) === null) {
      this.error("Selector is expected");
    }
    return {
      type: "Selector",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2);
  }
};
var TYPE$z = tokenizer2.TYPE;
var COMMA$3 = TYPE$z.Comma;
var SelectorList = {
  name: "SelectorList",
  structure: {
    children: [[
      "Selector",
      "Raw"
    ]]
  },
  parse: function() {
    var children2 = this.createList();
    while (!this.scanner.eof) {
      children2.push(this.Selector());
      if (this.scanner.tokenType === COMMA$3) {
        this.scanner.next();
        continue;
      }
      break;
    }
    return {
      type: "SelectorList",
      loc: this.getLocationFromList(children2),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2, function() {
      this.chunk(",");
    });
  },
  walkContext: "selector"
};
var STRING$3 = tokenizer2.TYPE.String;
var _String = {
  name: "String",
  structure: {
    value: String
  },
  parse: function() {
    return {
      type: "String",
      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
      value: this.consume(STRING$3)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
  }
};
var TYPE$A = tokenizer2.TYPE;
var WHITESPACE$a = TYPE$A.WhiteSpace;
var COMMENT$9 = TYPE$A.Comment;
var ATKEYWORD$2 = TYPE$A.AtKeyword;
var CDO$1 = TYPE$A.CDO;
var CDC$1 = TYPE$A.CDC;
var EXCLAMATIONMARK$2 = 33;
function consumeRaw$5(startToken) {
  return this.Raw(startToken, null, false);
}
var StyleSheet = {
  name: "StyleSheet",
  structure: {
    children: [[
      "Comment",
      "CDO",
      "CDC",
      "Atrule",
      "Rule",
      "Raw"
    ]]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var children2 = this.createList();
    var child;
    while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case WHITESPACE$a:
          this.scanner.next();
          continue;
        case COMMENT$9:
          if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK$2) {
            this.scanner.next();
            continue;
          }
          child = this.Comment();
          break;
        case CDO$1:
          child = this.CDO();
          break;
        case CDC$1:
          child = this.CDC();
          break;
        case ATKEYWORD$2:
          child = this.parseWithFallback(this.Atrule, consumeRaw$5);
          break;
        default:
          child = this.parseWithFallback(this.Rule, consumeRaw$5);
      }
      children2.push(child);
    }
    return {
      type: "StyleSheet",
      loc: this.getLocation(start, this.scanner.tokenStart),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2);
  },
  walkContext: "stylesheet"
};
var TYPE$B = tokenizer2.TYPE;
var IDENT$f = TYPE$B.Ident;
var ASTERISK$5 = 42;
var VERTICALLINE$2 = 124;
function eatIdentifierOrAsterisk() {
  if (this.scanner.tokenType !== IDENT$f && this.scanner.isDelim(ASTERISK$5) === false) {
    this.error("Identifier or asterisk is expected");
  }
  this.scanner.next();
}
var TypeSelector = {
  name: "TypeSelector",
  structure: {
    name: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    if (this.scanner.isDelim(VERTICALLINE$2)) {
      this.scanner.next();
      eatIdentifierOrAsterisk.call(this);
    } else {
      eatIdentifierOrAsterisk.call(this);
      if (this.scanner.isDelim(VERTICALLINE$2)) {
        this.scanner.next();
        eatIdentifierOrAsterisk.call(this);
      }
    }
    return {
      type: "TypeSelector",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name: this.scanner.substrToCursor(start)
    };
  },
  generate: function(node2) {
    this.chunk(node2.name);
  }
};
var isHexDigit$3 = tokenizer2.isHexDigit;
var cmpChar$3 = tokenizer2.cmpChar;
var TYPE$C = tokenizer2.TYPE;
var NAME$3 = tokenizer2.NAME;
var IDENT$g = TYPE$C.Ident;
var NUMBER$7 = TYPE$C.Number;
var DIMENSION$5 = TYPE$C.Dimension;
var PLUSSIGN$5 = 43;
var HYPHENMINUS$3 = 45;
var QUESTIONMARK = 63;
var U$1 = 117;
function eatHexSequence(offset3, allowDash) {
  for (var pos = this.scanner.tokenStart + offset3, len = 0; pos < this.scanner.tokenEnd; pos++) {
    var code = this.scanner.source.charCodeAt(pos);
    if (code === HYPHENMINUS$3 && allowDash && len !== 0) {
      if (eatHexSequence.call(this, offset3 + len + 1, false) === 0) {
        this.error();
      }
      return -1;
    }
    if (!isHexDigit$3(code)) {
      this.error(
        allowDash && len !== 0 ? "HyphenMinus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input",
        pos
      );
    }
    if (++len > 6) {
      this.error("Too many hex digits", pos);
    }
  }
  this.scanner.next();
  return len;
}
function eatQuestionMarkSequence(max) {
  var count2 = 0;
  while (this.scanner.isDelim(QUESTIONMARK)) {
    if (++count2 > max) {
      this.error("Too many question marks");
    }
    this.scanner.next();
  }
}
function startsWith(code) {
  if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
    this.error(NAME$3[code] + " is expected");
  }
}
function scanUnicodeRange() {
  var hexLength = 0;
  if (this.scanner.isDelim(PLUSSIGN$5)) {
    this.scanner.next();
    if (this.scanner.tokenType === IDENT$g) {
      hexLength = eatHexSequence.call(this, 0, true);
      if (hexLength > 0) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
      }
      return;
    }
    if (this.scanner.isDelim(QUESTIONMARK)) {
      this.scanner.next();
      eatQuestionMarkSequence.call(this, 5);
      return;
    }
    this.error("Hex digit or question mark is expected");
    return;
  }
  if (this.scanner.tokenType === NUMBER$7) {
    startsWith.call(this, PLUSSIGN$5);
    hexLength = eatHexSequence.call(this, 1, true);
    if (this.scanner.isDelim(QUESTIONMARK)) {
      eatQuestionMarkSequence.call(this, 6 - hexLength);
      return;
    }
    if (this.scanner.tokenType === DIMENSION$5 || this.scanner.tokenType === NUMBER$7) {
      startsWith.call(this, HYPHENMINUS$3);
      eatHexSequence.call(this, 1, false);
      return;
    }
    return;
  }
  if (this.scanner.tokenType === DIMENSION$5) {
    startsWith.call(this, PLUSSIGN$5);
    hexLength = eatHexSequence.call(this, 1, true);
    if (hexLength > 0) {
      eatQuestionMarkSequence.call(this, 6 - hexLength);
    }
    return;
  }
  this.error();
}
var UnicodeRange = {
  name: "UnicodeRange",
  structure: {
    value: String
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    if (!cmpChar$3(this.scanner.source, start, U$1)) {
      this.error("U is expected");
    }
    if (!cmpChar$3(this.scanner.source, start + 1, PLUSSIGN$5)) {
      this.error("Plus sign is expected");
    }
    this.scanner.next();
    scanUnicodeRange.call(this);
    return {
      type: "UnicodeRange",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: this.scanner.substrToCursor(start)
    };
  },
  generate: function(node2) {
    this.chunk(node2.value);
  }
};
var isWhiteSpace$2 = tokenizer2.isWhiteSpace;
var cmpStr$5 = tokenizer2.cmpStr;
var TYPE$D = tokenizer2.TYPE;
var FUNCTION$6 = TYPE$D.Function;
var URL$4 = TYPE$D.Url;
var RIGHTPARENTHESIS$5 = TYPE$D.RightParenthesis;
var Url = {
  name: "Url",
  structure: {
    value: ["String", "Raw"]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var value2;
    switch (this.scanner.tokenType) {
      case URL$4:
        var rawStart = start + 4;
        var rawEnd = this.scanner.tokenEnd - 1;
        while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawStart))) {
          rawStart++;
        }
        while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawEnd - 1))) {
          rawEnd--;
        }
        value2 = {
          type: "Raw",
          loc: this.getLocation(rawStart, rawEnd),
          value: this.scanner.source.substring(rawStart, rawEnd)
        };
        this.eat(URL$4);
        break;
      case FUNCTION$6:
        if (!cmpStr$5(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(")) {
          this.error("Function name must be `url`");
        }
        this.eat(FUNCTION$6);
        this.scanner.skipSC();
        value2 = this.String();
        this.scanner.skipSC();
        this.eat(RIGHTPARENTHESIS$5);
        break;
      default:
        this.error("Url or Function is expected");
    }
    return {
      type: "Url",
      loc: this.getLocation(start, this.scanner.tokenStart),
      value: value2
    };
  },
  generate: function(node2) {
    this.chunk("url");
    this.chunk("(");
    this.node(node2.value);
    this.chunk(")");
  }
};
var Value = {
  name: "Value",
  structure: {
    children: [[]]
  },
  parse: function() {
    var start = this.scanner.tokenStart;
    var children2 = this.readSequence(this.scope.Value);
    return {
      type: "Value",
      loc: this.getLocation(start, this.scanner.tokenStart),
      children: children2
    };
  },
  generate: function(node2) {
    this.children(node2);
  }
};
var WHITESPACE$b = tokenizer2.TYPE.WhiteSpace;
var SPACE = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
});
var WhiteSpace$1 = {
  name: "WhiteSpace",
  structure: {
    value: String
  },
  parse: function() {
    this.eat(WHITESPACE$b);
    return SPACE;
  },
  generate: function(node2) {
    this.chunk(node2.value);
  }
};
var node = {
  AnPlusB,
  Atrule,
  AtrulePrelude,
  AttributeSelector,
  Block,
  Brackets,
  CDC: CDC_1,
  CDO: CDO_1,
  ClassSelector,
  Combinator,
  Comment,
  Declaration,
  DeclarationList,
  Dimension,
  Function: _Function,
  Hash,
  Identifier,
  IdSelector,
  MediaFeature,
  MediaQuery,
  MediaQueryList,
  Nth,
  Number: _Number,
  Operator,
  Parentheses,
  Percentage,
  PseudoClassSelector,
  PseudoElementSelector,
  Ratio,
  Raw,
  Rule,
  Selector,
  SelectorList,
  String: _String,
  StyleSheet,
  TypeSelector,
  UnicodeRange,
  Url,
  Value,
  WhiteSpace: WhiteSpace$1
};
var parser = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude: function(options) {
      return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block: function() {
      return this.Block(true);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  scope,
  atrule,
  pseudo,
  node
};
create(parser);
var entities = {
  CounterClockwiseContourIntegral: 8755,
  ClockwiseContourIntegral: 8754,
  DoubleLongLeftRightArrow: 10234,
  DiacriticalDoubleAcute: 733,
  NotSquareSupersetEqual: 8931,
  CloseCurlyDoubleQuote: 8221,
  DoubleContourIntegral: 8751,
  FilledVerySmallSquare: 9642,
  NegativeVeryThinSpace: 8203,
  NotPrecedesSlantEqual: 8928,
  NotRightTriangleEqual: 8941,
  NotSucceedsSlantEqual: 8929,
  CapitalDifferentialD: 8517,
  DoubleLeftRightArrow: 8660,
  DoubleLongRightArrow: 10233,
  EmptyVerySmallSquare: 9643,
  NestedGreaterGreater: 8811,
  NotDoubleVerticalBar: 8742,
  NotLeftTriangleEqual: 8940,
  NotSquareSubsetEqual: 8930,
  OpenCurlyDoubleQuote: 8220,
  ReverseUpEquilibrium: 10607,
  DoubleLongLeftArrow: 10232,
  DownLeftRightVector: 10576,
  LeftArrowRightArrow: 8646,
  NegativeMediumSpace: 8203,
  RightArrowLeftArrow: 8644,
  SquareSupersetEqual: 8850,
  leftrightsquigarrow: 8621,
  DownRightTeeVector: 10591,
  DownRightVectorBar: 10583,
  LongLeftRightArrow: 10231,
  Longleftrightarrow: 10234,
  NegativeThickSpace: 8203,
  PrecedesSlantEqual: 8828,
  ReverseEquilibrium: 8651,
  RightDoubleBracket: 10215,
  RightDownTeeVector: 10589,
  RightDownVectorBar: 10581,
  RightTriangleEqual: 8885,
  SquareIntersection: 8851,
  SucceedsSlantEqual: 8829,
  blacktriangleright: 9656,
  longleftrightarrow: 10231,
  DoubleUpDownArrow: 8661,
  DoubleVerticalBar: 8741,
  DownLeftTeeVector: 10590,
  DownLeftVectorBar: 10582,
  FilledSmallSquare: 9724,
  GreaterSlantEqual: 10878,
  LeftDoubleBracket: 10214,
  LeftDownTeeVector: 10593,
  LeftDownVectorBar: 10585,
  LeftTriangleEqual: 8884,
  NegativeThinSpace: 8203,
  NotReverseElement: 8716,
  NotTildeFullEqual: 8775,
  RightAngleBracket: 10217,
  RightUpDownVector: 10575,
  SquareSubsetEqual: 8849,
  VerticalSeparator: 10072,
  blacktriangledown: 9662,
  blacktriangleleft: 9666,
  leftrightharpoons: 8651,
  rightleftharpoons: 8652,
  twoheadrightarrow: 8608,
  DiacriticalAcute: 180,
  DiacriticalGrave: 96,
  DiacriticalTilde: 732,
  DoubleRightArrow: 8658,
  DownArrowUpArrow: 8693,
  EmptySmallSquare: 9723,
  GreaterEqualLess: 8923,
  GreaterFullEqual: 8807,
  LeftAngleBracket: 10216,
  LeftUpDownVector: 10577,
  LessEqualGreater: 8922,
  NonBreakingSpace: 160,
  NotRightTriangle: 8939,
  NotSupersetEqual: 8841,
  RightTriangleBar: 10704,
  RightUpTeeVector: 10588,
  RightUpVectorBar: 10580,
  UnderParenthesis: 9181,
  UpArrowDownArrow: 8645,
  circlearrowright: 8635,
  downharpoonright: 8642,
  ntrianglerighteq: 8941,
  rightharpoondown: 8641,
  rightrightarrows: 8649,
  twoheadleftarrow: 8606,
  vartriangleright: 8883,
  CloseCurlyQuote: 8217,
  ContourIntegral: 8750,
  DoubleDownArrow: 8659,
  DoubleLeftArrow: 8656,
  DownRightVector: 8641,
  LeftRightVector: 10574,
  LeftTriangleBar: 10703,
  LeftUpTeeVector: 10592,
  LeftUpVectorBar: 10584,
  LowerRightArrow: 8600,
  NotGreaterEqual: 8817,
  NotGreaterTilde: 8821,
  NotLeftTriangle: 8938,
  OverParenthesis: 9180,
  RightDownVector: 8642,
  ShortRightArrow: 8594,
  UpperRightArrow: 8599,
  bigtriangledown: 9661,
  circlearrowleft: 8634,
  curvearrowright: 8631,
  downharpoonleft: 8643,
  leftharpoondown: 8637,
  leftrightarrows: 8646,
  nLeftrightarrow: 8654,
  nleftrightarrow: 8622,
  ntrianglelefteq: 8940,
  rightleftarrows: 8644,
  rightsquigarrow: 8605,
  rightthreetimes: 8908,
  straightepsilon: 1013,
  trianglerighteq: 8885,
  vartriangleleft: 8882,
  DiacriticalDot: 729,
  DoubleRightTee: 8872,
  DownLeftVector: 8637,
  GreaterGreater: 10914,
  HorizontalLine: 9472,
  InvisibleComma: 8291,
  InvisibleTimes: 8290,
  LeftDownVector: 8643,
  LeftRightArrow: 8596,
  Leftrightarrow: 8660,
  LessSlantEqual: 10877,
  LongRightArrow: 10230,
  Longrightarrow: 10233,
  LowerLeftArrow: 8601,
  NestedLessLess: 8810,
  NotGreaterLess: 8825,
  NotLessGreater: 8824,
  NotSubsetEqual: 8840,
  NotVerticalBar: 8740,
  OpenCurlyQuote: 8216,
  ReverseElement: 8715,
  RightTeeVector: 10587,
  RightVectorBar: 10579,
  ShortDownArrow: 8595,
  ShortLeftArrow: 8592,
  SquareSuperset: 8848,
  TildeFullEqual: 8773,
  UpperLeftArrow: 8598,
  ZeroWidthSpace: 8203,
  curvearrowleft: 8630,
  doublebarwedge: 8966,
  downdownarrows: 8650,
  hookrightarrow: 8618,
  leftleftarrows: 8647,
  leftrightarrow: 8596,
  leftthreetimes: 8907,
  longrightarrow: 10230,
  looparrowright: 8620,
  nshortparallel: 8742,
  ntriangleright: 8939,
  rightarrowtail: 8611,
  rightharpoonup: 8640,
  trianglelefteq: 8884,
  upharpoonright: 8638,
  ApplyFunction: 8289,
  DifferentialD: 8518,
  DoubleLeftTee: 10980,
  DoubleUpArrow: 8657,
  LeftTeeVector: 10586,
  LeftVectorBar: 10578,
  LessFullEqual: 8806,
  LongLeftArrow: 10229,
  Longleftarrow: 10232,
  NotTildeEqual: 8772,
  NotTildeTilde: 8777,
  Poincareplane: 8460,
  PrecedesEqual: 10927,
  PrecedesTilde: 8830,
  RightArrowBar: 8677,
  RightTeeArrow: 8614,
  RightTriangle: 8883,
  RightUpVector: 8638,
  SucceedsEqual: 10928,
  SucceedsTilde: 8831,
  SupersetEqual: 8839,
  UpEquilibrium: 10606,
  VerticalTilde: 8768,
  VeryThinSpace: 8202,
  bigtriangleup: 9651,
  blacktriangle: 9652,
  divideontimes: 8903,
  fallingdotseq: 8786,
  hookleftarrow: 8617,
  leftarrowtail: 8610,
  leftharpoonup: 8636,
  longleftarrow: 10229,
  looparrowleft: 8619,
  measuredangle: 8737,
  ntriangleleft: 8938,
  shortparallel: 8741,
  smallsetminus: 8726,
  triangleright: 9657,
  upharpoonleft: 8639,
  DownArrowBar: 10515,
  DownTeeArrow: 8615,
  ExponentialE: 8519,
  GreaterEqual: 8805,
  GreaterTilde: 8819,
  HilbertSpace: 8459,
  HumpDownHump: 8782,
  Intersection: 8898,
  LeftArrowBar: 8676,
  LeftTeeArrow: 8612,
  LeftTriangle: 8882,
  LeftUpVector: 8639,
  NotCongruent: 8802,
  NotLessEqual: 8816,
  NotLessTilde: 8820,
  Proportional: 8733,
  RightCeiling: 8969,
  RoundImplies: 10608,
  ShortUpArrow: 8593,
  SquareSubset: 8847,
  UnderBracket: 9141,
  VerticalLine: 124,
  blacklozenge: 10731,
  exponentiale: 8519,
  risingdotseq: 8787,
  triangledown: 9663,
  triangleleft: 9667,
  CircleMinus: 8854,
  CircleTimes: 8855,
  Equilibrium: 8652,
  GreaterLess: 8823,
  LeftCeiling: 8968,
  LessGreater: 8822,
  MediumSpace: 8287,
  NotPrecedes: 8832,
  NotSucceeds: 8833,
  OverBracket: 9140,
  RightVector: 8640,
  Rrightarrow: 8667,
  RuleDelayed: 10740,
  SmallCircle: 8728,
  SquareUnion: 8852,
  SubsetEqual: 8838,
  UpDownArrow: 8597,
  Updownarrow: 8661,
  VerticalBar: 8739,
  backepsilon: 1014,
  blacksquare: 9642,
  circledcirc: 8858,
  circleddash: 8861,
  curlyeqprec: 8926,
  curlyeqsucc: 8927,
  diamondsuit: 9830,
  eqslantless: 10901,
  expectation: 8496,
  nRightarrow: 8655,
  nrightarrow: 8603,
  preccurlyeq: 8828,
  precnapprox: 10937,
  quaternions: 8461,
  straightphi: 981,
  succcurlyeq: 8829,
  succnapprox: 10938,
  thickapprox: 8776,
  updownarrow: 8597,
  Bernoullis: 8492,
  CirclePlus: 8853,
  EqualTilde: 8770,
  Fouriertrf: 8497,
  ImaginaryI: 8520,
  Laplacetrf: 8466,
  LeftVector: 8636,
  Lleftarrow: 8666,
  NotElement: 8713,
  NotGreater: 8815,
  Proportion: 8759,
  RightArrow: 8594,
  RightFloor: 8971,
  Rightarrow: 8658,
  TildeEqual: 8771,
  TildeTilde: 8776,
  UnderBrace: 9183,
  UpArrowBar: 10514,
  UpTeeArrow: 8613,
  circledast: 8859,
  complement: 8705,
  curlywedge: 8911,
  eqslantgtr: 10902,
  gtreqqless: 10892,
  lessapprox: 10885,
  lesseqqgtr: 10891,
  lmoustache: 9136,
  longmapsto: 10236,
  mapstodown: 8615,
  mapstoleft: 8612,
  nLeftarrow: 8653,
  nleftarrow: 8602,
  precapprox: 10935,
  rightarrow: 8594,
  rmoustache: 9137,
  sqsubseteq: 8849,
  sqsupseteq: 8850,
  subsetneqq: 10955,
  succapprox: 10936,
  supsetneqq: 10956,
  upuparrows: 8648,
  varepsilon: 949,
  varnothing: 8709,
  Backslash: 8726,
  CenterDot: 183,
  CircleDot: 8857,
  Congruent: 8801,
  Coproduct: 8720,
  DoubleDot: 168,
  DownArrow: 8595,
  DownBreve: 785,
  Downarrow: 8659,
  HumpEqual: 8783,
  LeftArrow: 8592,
  LeftFloor: 8970,
  Leftarrow: 8656,
  LessTilde: 8818,
  Mellintrf: 8499,
  MinusPlus: 8723,
  NotCupCap: 8813,
  NotExists: 8708,
  OverBrace: 9182,
  PlusMinus: 177,
  Therefore: 8756,
  ThinSpace: 8201,
  TripleDot: 8411,
  UnionPlus: 8846,
  backprime: 8245,
  backsimeq: 8909,
  bigotimes: 10754,
  centerdot: 183,
  checkmark: 10003,
  complexes: 8450,
  dotsquare: 8865,
  downarrow: 8595,
  gtrapprox: 10886,
  gtreqless: 8923,
  heartsuit: 9829,
  leftarrow: 8592,
  lesseqgtr: 8922,
  nparallel: 8742,
  nshortmid: 8740,
  nsubseteq: 8840,
  nsupseteq: 8841,
  pitchfork: 8916,
  rationals: 8474,
  spadesuit: 9824,
  subseteqq: 10949,
  subsetneq: 8842,
  supseteqq: 10950,
  supsetneq: 8843,
  therefore: 8756,
  triangleq: 8796,
  varpropto: 8733,
  DDotrahd: 10513,
  DotEqual: 8784,
  Integral: 8747,
  LessLess: 10913,
  NotEqual: 8800,
  NotTilde: 8769,
  PartialD: 8706,
  Precedes: 8826,
  RightTee: 8866,
  Succeeds: 8827,
  SuchThat: 8715,
  Superset: 8835,
  Uarrocir: 10569,
  UnderBar: 818,
  andslope: 10840,
  angmsdaa: 10664,
  angmsdab: 10665,
  angmsdac: 10666,
  angmsdad: 10667,
  angmsdae: 10668,
  angmsdaf: 10669,
  angmsdag: 10670,
  angmsdah: 10671,
  angrtvbd: 10653,
  approxeq: 8778,
  awconint: 8755,
  backcong: 8780,
  barwedge: 8965,
  bbrktbrk: 9142,
  bigoplus: 10753,
  bigsqcup: 10758,
  biguplus: 10756,
  bigwedge: 8896,
  boxminus: 8863,
  boxtimes: 8864,
  capbrcup: 10825,
  circledR: 174,
  circledS: 9416,
  cirfnint: 10768,
  clubsuit: 9827,
  cupbrcap: 10824,
  curlyvee: 8910,
  cwconint: 8754,
  doteqdot: 8785,
  dotminus: 8760,
  drbkarow: 10512,
  dzigrarr: 10239,
  elinters: 9191,
  emptyset: 8709,
  eqvparsl: 10725,
  fpartint: 10765,
  geqslant: 10878,
  gesdotol: 10884,
  gnapprox: 10890,
  hksearow: 10533,
  hkswarow: 10534,
  imagline: 8464,
  imagpart: 8465,
  infintie: 10717,
  integers: 8484,
  intercal: 8890,
  intlarhk: 10775,
  laemptyv: 10676,
  ldrushar: 10571,
  leqslant: 10877,
  lesdotor: 10883,
  llcorner: 8990,
  lnapprox: 10889,
  lrcorner: 8991,
  lurdshar: 10570,
  mapstoup: 8613,
  multimap: 8888,
  naturals: 8469,
  otimesas: 10806,
  parallel: 8741,
  plusacir: 10787,
  pointint: 10773,
  precneqq: 10933,
  precnsim: 8936,
  profalar: 9006,
  profline: 8978,
  profsurf: 8979,
  raemptyv: 10675,
  realpart: 8476,
  rppolint: 10770,
  rtriltri: 10702,
  scpolint: 10771,
  setminus: 8726,
  shortmid: 8739,
  smeparsl: 10724,
  sqsubset: 8847,
  sqsupset: 8848,
  subseteq: 8838,
  succneqq: 10934,
  succnsim: 8937,
  supseteq: 8839,
  thetasym: 977,
  thicksim: 8764,
  timesbar: 10801,
  triangle: 9653,
  triminus: 10810,
  trpezium: 9186,
  ulcorner: 8988,
  urcorner: 8989,
  varkappa: 1008,
  varsigma: 962,
  vartheta: 977,
  Because: 8757,
  Cayleys: 8493,
  Cconint: 8752,
  Cedilla: 184,
  Diamond: 8900,
  DownTee: 8868,
  Element: 8712,
  Epsilon: 917,
  Implies: 8658,
  LeftTee: 8867,
  NewLine: 10,
  NoBreak: 8288,
  NotLess: 8814,
  Omicron: 927,
  OverBar: 175,
  Product: 8719,
  UpArrow: 8593,
  Uparrow: 8657,
  Upsilon: 933,
  alefsym: 8501,
  angrtvb: 8894,
  angzarr: 9084,
  asympeq: 8781,
  backsim: 8765,
  because: 8757,
  bemptyv: 10672,
  between: 8812,
  bigcirc: 9711,
  bigodot: 10752,
  bigstar: 9733,
  boxplus: 8862,
  ccupssm: 10832,
  cemptyv: 10674,
  cirscir: 10690,
  coloneq: 8788,
  congdot: 10861,
  cudarrl: 10552,
  cudarrr: 10549,
  cularrp: 10557,
  curarrm: 10556,
  dbkarow: 10511,
  ddagger: 8225,
  ddotseq: 10871,
  demptyv: 10673,
  diamond: 8900,
  digamma: 989,
  dotplus: 8724,
  dwangle: 10662,
  epsilon: 949,
  eqcolon: 8789,
  equivDD: 10872,
  gesdoto: 10882,
  gtquest: 10876,
  gtrless: 8823,
  harrcir: 10568,
  intprod: 10812,
  isindot: 8949,
  larrbfs: 10527,
  larrsim: 10611,
  lbrksld: 10639,
  lbrkslu: 10637,
  ldrdhar: 10599,
  lesdoto: 10881,
  lessdot: 8918,
  lessgtr: 8822,
  lesssim: 8818,
  lotimes: 10804,
  lozenge: 9674,
  ltquest: 10875,
  luruhar: 10598,
  maltese: 10016,
  minusdu: 10794,
  napprox: 8777,
  natural: 9838,
  nearrow: 8599,
  nexists: 8708,
  notinva: 8713,
  notinvb: 8951,
  notinvc: 8950,
  notniva: 8716,
  notnivb: 8958,
  notnivc: 8957,
  npolint: 10772,
  nsqsube: 8930,
  nsqsupe: 8931,
  nvinfin: 10718,
  nwarrow: 8598,
  olcross: 10683,
  omicron: 959,
  orderof: 8500,
  orslope: 10839,
  pertenk: 8241,
  planckh: 8462,
  pluscir: 10786,
  plussim: 10790,
  plustwo: 10791,
  precsim: 8830,
  quatint: 10774,
  questeq: 8799,
  rarrbfs: 10528,
  rarrsim: 10612,
  rbrksld: 10638,
  rbrkslu: 10640,
  rdldhar: 10601,
  realine: 8475,
  rotimes: 10805,
  ruluhar: 10600,
  searrow: 8600,
  simplus: 10788,
  simrarr: 10610,
  subedot: 10947,
  submult: 10945,
  subplus: 10943,
  subrarr: 10617,
  succsim: 8831,
  supdsub: 10968,
  supedot: 10948,
  suphsub: 10967,
  suplarr: 10619,
  supmult: 10946,
  supplus: 10944,
  swarrow: 8601,
  topfork: 10970,
  triplus: 10809,
  tritime: 10811,
  uparrow: 8593,
  upsilon: 965,
  uwangle: 10663,
  vzigzag: 10650,
  zigrarr: 8669,
  Aacute: 193,
  Abreve: 258,
  Agrave: 192,
  Assign: 8788,
  Atilde: 195,
  Barwed: 8966,
  Bumpeq: 8782,
  Cacute: 262,
  Ccaron: 268,
  Ccedil: 199,
  Colone: 10868,
  Conint: 8751,
  CupCap: 8781,
  Dagger: 8225,
  Dcaron: 270,
  DotDot: 8412,
  Dstrok: 272,
  Eacute: 201,
  Ecaron: 282,
  Egrave: 200,
  Exists: 8707,
  ForAll: 8704,
  Gammad: 988,
  Gbreve: 286,
  Gcedil: 290,
  HARDcy: 1066,
  Hstrok: 294,
  Iacute: 205,
  Igrave: 204,
  Itilde: 296,
  Jsercy: 1032,
  Kcedil: 310,
  Lacute: 313,
  Lambda: 923,
  Lcaron: 317,
  Lcedil: 315,
  Lmidot: 319,
  Lstrok: 321,
  Nacute: 323,
  Ncaron: 327,
  Ncedil: 325,
  Ntilde: 209,
  Oacute: 211,
  Odblac: 336,
  Ograve: 210,
  Oslash: 216,
  Otilde: 213,
  Otimes: 10807,
  Racute: 340,
  Rarrtl: 10518,
  Rcaron: 344,
  Rcedil: 342,
  SHCHcy: 1065,
  SOFTcy: 1068,
  Sacute: 346,
  Scaron: 352,
  Scedil: 350,
  Square: 9633,
  Subset: 8912,
  Supset: 8913,
  Tcaron: 356,
  Tcedil: 354,
  Tstrok: 358,
  Uacute: 218,
  Ubreve: 364,
  Udblac: 368,
  Ugrave: 217,
  Utilde: 360,
  Vdashl: 10982,
  Verbar: 8214,
  Vvdash: 8874,
  Yacute: 221,
  Zacute: 377,
  Zcaron: 381,
  aacute: 225,
  abreve: 259,
  agrave: 224,
  andand: 10837,
  angmsd: 8737,
  angsph: 8738,
  apacir: 10863,
  approx: 8776,
  atilde: 227,
  barvee: 8893,
  barwed: 8965,
  becaus: 8757,
  bernou: 8492,
  bigcap: 8898,
  bigcup: 8899,
  bigvee: 8897,
  bkarow: 10509,
  bottom: 8869,
  bowtie: 8904,
  boxbox: 10697,
  bprime: 8245,
  brvbar: 166,
  bullet: 8226,
  bumpeq: 8783,
  cacute: 263,
  capand: 10820,
  capcap: 10827,
  capcup: 10823,
  capdot: 10816,
  ccaron: 269,
  ccedil: 231,
  circeq: 8791,
  cirmid: 10991,
  colone: 8788,
  commat: 64,
  compfn: 8728,
  conint: 8750,
  coprod: 8720,
  copysr: 8471,
  cularr: 8630,
  cupcap: 10822,
  cupcup: 10826,
  cupdot: 8845,
  curarr: 8631,
  curren: 164,
  cylcty: 9005,
  dagger: 8224,
  daleth: 8504,
  dcaron: 271,
  dfisht: 10623,
  divide: 247,
  divonx: 8903,
  dlcorn: 8990,
  dlcrop: 8973,
  dollar: 36,
  drcorn: 8991,
  drcrop: 8972,
  dstrok: 273,
  eacute: 233,
  easter: 10862,
  ecaron: 283,
  ecolon: 8789,
  egrave: 232,
  egsdot: 10904,
  elsdot: 10903,
  emptyv: 8709,
  emsp13: 8196,
  emsp14: 8197,
  eparsl: 10723,
  eqcirc: 8790,
  equals: 61,
  equest: 8799,
  female: 9792,
  ffilig: 64259,
  ffllig: 64260,
  forall: 8704,
  frac12: 189,
  frac13: 8531,
  frac14: 188,
  frac15: 8533,
  frac16: 8537,
  frac18: 8539,
  frac23: 8532,
  frac25: 8534,
  frac34: 190,
  frac35: 8535,
  frac38: 8540,
  frac45: 8536,
  frac56: 8538,
  frac58: 8541,
  frac78: 8542,
  gacute: 501,
  gammad: 989,
  gbreve: 287,
  gesdot: 10880,
  gesles: 10900,
  gtlPar: 10645,
  gtrarr: 10616,
  gtrdot: 8919,
  gtrsim: 8819,
  hairsp: 8202,
  hamilt: 8459,
  hardcy: 1098,
  hearts: 9829,
  hellip: 8230,
  hercon: 8889,
  homtht: 8763,
  horbar: 8213,
  hslash: 8463,
  hstrok: 295,
  hybull: 8259,
  hyphen: 8208,
  iacute: 237,
  igrave: 236,
  iiiint: 10764,
  iinfin: 10716,
  incare: 8453,
  inodot: 305,
  intcal: 8890,
  iquest: 191,
  isinsv: 8947,
  itilde: 297,
  jsercy: 1112,
  kappav: 1008,
  kcedil: 311,
  kgreen: 312,
  lAtail: 10523,
  lacute: 314,
  lagran: 8466,
  lambda: 955,
  langle: 10216,
  larrfs: 10525,
  larrhk: 8617,
  larrlp: 8619,
  larrpl: 10553,
  larrtl: 8610,
  latail: 10521,
  lbrace: 123,
  lbrack: 91,
  lcaron: 318,
  lcedil: 316,
  ldquor: 8222,
  lesdot: 10879,
  lesges: 10899,
  lfisht: 10620,
  lfloor: 8970,
  lharul: 10602,
  llhard: 10603,
  lmidot: 320,
  lmoust: 9136,
  loplus: 10797,
  lowast: 8727,
  lowbar: 95,
  lparlt: 10643,
  lrhard: 10605,
  lsaquo: 8249,
  lsquor: 8218,
  lstrok: 322,
  lthree: 8907,
  ltimes: 8905,
  ltlarr: 10614,
  ltrPar: 10646,
  mapsto: 8614,
  marker: 9646,
  mcomma: 10793,
  midast: 42,
  midcir: 10992,
  middot: 183,
  minusb: 8863,
  minusd: 8760,
  mnplus: 8723,
  models: 8871,
  mstpos: 8766,
  nVDash: 8879,
  nVdash: 8878,
  nacute: 324,
  ncaron: 328,
  ncedil: 326,
  nearhk: 10532,
  nequiv: 8802,
  nesear: 10536,
  nexist: 8708,
  nltrie: 8940,
  nprcue: 8928,
  nrtrie: 8941,
  nsccue: 8929,
  nsimeq: 8772,
  ntilde: 241,
  numero: 8470,
  nvDash: 8877,
  nvHarr: 10500,
  nvdash: 8876,
  nvlArr: 10498,
  nvrArr: 10499,
  nwarhk: 10531,
  nwnear: 10535,
  oacute: 243,
  odblac: 337,
  odsold: 10684,
  ograve: 242,
  ominus: 8854,
  origof: 8886,
  oslash: 248,
  otilde: 245,
  otimes: 8855,
  parsim: 10995,
  percnt: 37,
  period: 46,
  permil: 8240,
  phmmat: 8499,
  planck: 8463,
  plankv: 8463,
  plusdo: 8724,
  plusdu: 10789,
  plusmn: 177,
  preceq: 10927,
  primes: 8473,
  prnsim: 8936,
  propto: 8733,
  prurel: 8880,
  puncsp: 8200,
  qprime: 8279,
  rAtail: 10524,
  racute: 341,
  rangle: 10217,
  rarrap: 10613,
  rarrfs: 10526,
  rarrhk: 8618,
  rarrlp: 8620,
  rarrpl: 10565,
  rarrtl: 8611,
  ratail: 10522,
  rbrace: 125,
  rbrack: 93,
  rcaron: 345,
  rcedil: 343,
  rdquor: 8221,
  rfisht: 10621,
  rfloor: 8971,
  rharul: 10604,
  rmoust: 9137,
  roplus: 10798,
  rpargt: 10644,
  rsaquo: 8250,
  rsquor: 8217,
  rthree: 8908,
  rtimes: 8906,
  sacute: 347,
  scaron: 353,
  scedil: 351,
  scnsim: 8937,
  searhk: 10533,
  seswar: 10537,
  sfrown: 8994,
  shchcy: 1097,
  sigmaf: 962,
  sigmav: 962,
  simdot: 10858,
  smashp: 10803,
  softcy: 1100,
  solbar: 9023,
  spades: 9824,
  sqsube: 8849,
  sqsupe: 8850,
  square: 9633,
  squarf: 9642,
  ssetmn: 8726,
  ssmile: 8995,
  sstarf: 8902,
  subdot: 10941,
  subset: 8834,
  subsim: 10951,
  subsub: 10965,
  subsup: 10963,
  succeq: 10928,
  supdot: 10942,
  supset: 8835,
  supsim: 10952,
  supsub: 10964,
  supsup: 10966,
  swarhk: 10534,
  swnwar: 10538,
  target: 8982,
  tcaron: 357,
  tcedil: 355,
  telrec: 8981,
  there4: 8756,
  thetav: 977,
  thinsp: 8201,
  thksim: 8764,
  timesb: 8864,
  timesd: 10800,
  topbot: 9014,
  topcir: 10993,
  tprime: 8244,
  tridot: 9708,
  tstrok: 359,
  uacute: 250,
  ubreve: 365,
  udblac: 369,
  ufisht: 10622,
  ugrave: 249,
  ulcorn: 8988,
  ulcrop: 8975,
  urcorn: 8989,
  urcrop: 8974,
  utilde: 361,
  vangrt: 10652,
  varphi: 966,
  varrho: 1009,
  veebar: 8891,
  vellip: 8942,
  verbar: 124,
  wedbar: 10847,
  wedgeq: 8793,
  weierp: 8472,
  wreath: 8768,
  xoplus: 10753,
  xotime: 10754,
  xsqcup: 10758,
  xuplus: 10756,
  xwedge: 8896,
  yacute: 253,
  zacute: 378,
  zcaron: 382,
  zeetrf: 8488,
  AElig: 198,
  Acirc: 194,
  Alpha: 913,
  Amacr: 256,
  Aogon: 260,
  Aring: 197,
  Breve: 728,
  Ccirc: 264,
  Colon: 8759,
  Cross: 10799,
  Dashv: 10980,
  Delta: 916,
  Ecirc: 202,
  Emacr: 274,
  Eogon: 280,
  Equal: 10869,
  Gamma: 915,
  Gcirc: 284,
  Hacek: 711,
  Hcirc: 292,
  IJlig: 306,
  Icirc: 206,
  Imacr: 298,
  Iogon: 302,
  Iukcy: 1030,
  Jcirc: 308,
  Jukcy: 1028,
  Kappa: 922,
  OElig: 338,
  Ocirc: 212,
  Omacr: 332,
  Omega: 937,
  Prime: 8243,
  RBarr: 10512,
  Scirc: 348,
  Sigma: 931,
  THORN: 222,
  TRADE: 8482,
  TSHcy: 1035,
  Theta: 920,
  Tilde: 8764,
  Ubrcy: 1038,
  Ucirc: 219,
  Umacr: 362,
  Union: 8899,
  Uogon: 370,
  UpTee: 8869,
  Uring: 366,
  VDash: 8875,
  Vdash: 8873,
  Wcirc: 372,
  Wedge: 8896,
  Ycirc: 374,
  acirc: 226,
  acute: 180,
  aelig: 230,
  aleph: 8501,
  alpha: 945,
  amacr: 257,
  amalg: 10815,
  angle: 8736,
  angrt: 8735,
  angst: 8491,
  aogon: 261,
  aring: 229,
  asymp: 8776,
  awint: 10769,
  bcong: 8780,
  bdquo: 8222,
  bepsi: 1014,
  blank: 9251,
  blk12: 9618,
  blk14: 9617,
  blk34: 9619,
  block: 9608,
  boxDL: 9559,
  boxDR: 9556,
  boxDl: 9558,
  boxDr: 9555,
  boxHD: 9574,
  boxHU: 9577,
  boxHd: 9572,
  boxHu: 9575,
  boxUL: 9565,
  boxUR: 9562,
  boxUl: 9564,
  boxUr: 9561,
  boxVH: 9580,
  boxVL: 9571,
  boxVR: 9568,
  boxVh: 9579,
  boxVl: 9570,
  boxVr: 9567,
  boxdL: 9557,
  boxdR: 9554,
  boxdl: 9488,
  boxdr: 9484,
  boxhD: 9573,
  boxhU: 9576,
  boxhd: 9516,
  boxhu: 9524,
  boxuL: 9563,
  boxuR: 9560,
  boxul: 9496,
  boxur: 9492,
  boxvH: 9578,
  boxvL: 9569,
  boxvR: 9566,
  boxvh: 9532,
  boxvl: 9508,
  boxvr: 9500,
  breve: 728,
  bsemi: 8271,
  bsime: 8909,
  bsolb: 10693,
  bumpE: 10926,
  bumpe: 8783,
  caret: 8257,
  caron: 711,
  ccaps: 10829,
  ccirc: 265,
  ccups: 10828,
  cedil: 184,
  check: 10003,
  clubs: 9827,
  colon: 58,
  comma: 44,
  crarr: 8629,
  cross: 10007,
  csube: 10961,
  csupe: 10962,
  ctdot: 8943,
  cuepr: 8926,
  cuesc: 8927,
  cupor: 10821,
  cuvee: 8910,
  cuwed: 8911,
  cwint: 8753,
  dashv: 8867,
  dblac: 733,
  ddarr: 8650,
  delta: 948,
  dharl: 8643,
  dharr: 8642,
  diams: 9830,
  disin: 8946,
  doteq: 8784,
  dtdot: 8945,
  dtrif: 9662,
  duarr: 8693,
  duhar: 10607,
  eDDot: 10871,
  ecirc: 234,
  efDot: 8786,
  emacr: 275,
  empty: 8709,
  eogon: 281,
  eplus: 10865,
  epsiv: 949,
  eqsim: 8770,
  equiv: 8801,
  erDot: 8787,
  erarr: 10609,
  esdot: 8784,
  exist: 8707,
  fflig: 64256,
  filig: 64257,
  fllig: 64258,
  fltns: 9649,
  forkv: 10969,
  frasl: 8260,
  frown: 8994,
  gamma: 947,
  gcirc: 285,
  gescc: 10921,
  gimel: 8503,
  gneqq: 8809,
  gnsim: 8935,
  grave: 96,
  gsime: 10894,
  gsiml: 10896,
  gtcir: 10874,
  gtdot: 8919,
  harrw: 8621,
  hcirc: 293,
  hoarr: 8703,
  icirc: 238,
  iexcl: 161,
  iiint: 8749,
  iiota: 8489,
  ijlig: 307,
  imacr: 299,
  image: 8465,
  imath: 305,
  imped: 437,
  infin: 8734,
  iogon: 303,
  iprod: 10812,
  isinE: 8953,
  isins: 8948,
  isinv: 8712,
  iukcy: 1110,
  jcirc: 309,
  jmath: 567,
  jukcy: 1108,
  kappa: 954,
  lAarr: 8666,
  lBarr: 10510,
  langd: 10641,
  laquo: 171,
  larrb: 8676,
  lbarr: 10508,
  lbbrk: 10098,
  lbrke: 10635,
  lceil: 8968,
  ldquo: 8220,
  lescc: 10920,
  lhard: 8637,
  lharu: 8636,
  lhblk: 9604,
  llarr: 8647,
  lltri: 9722,
  lneqq: 8808,
  lnsim: 8934,
  loang: 10220,
  loarr: 8701,
  lobrk: 10214,
  lopar: 10629,
  lrarr: 8646,
  lrhar: 8651,
  lrtri: 8895,
  lsime: 10893,
  lsimg: 10895,
  lsquo: 8216,
  ltcir: 10873,
  ltdot: 8918,
  ltrie: 8884,
  ltrif: 9666,
  mDDot: 8762,
  mdash: 8212,
  micro: 181,
  minus: 8722,
  mumap: 8888,
  nabla: 8711,
  napos: 329,
  natur: 9838,
  ncong: 8775,
  ndash: 8211,
  neArr: 8663,
  nearr: 8599,
  ngsim: 8821,
  nhArr: 8654,
  nharr: 8622,
  nhpar: 10994,
  nlArr: 8653,
  nlarr: 8602,
  nless: 8814,
  nlsim: 8820,
  nltri: 8938,
  notin: 8713,
  notni: 8716,
  nprec: 8832,
  nrArr: 8655,
  nrarr: 8603,
  nrtri: 8939,
  nsime: 8772,
  nsmid: 8740,
  nspar: 8742,
  nsube: 8840,
  nsucc: 8833,
  nsupe: 8841,
  numsp: 8199,
  nwArr: 8662,
  nwarr: 8598,
  ocirc: 244,
  odash: 8861,
  oelig: 339,
  ofcir: 10687,
  ohbar: 10677,
  olarr: 8634,
  olcir: 10686,
  oline: 8254,
  omacr: 333,
  omega: 969,
  operp: 10681,
  oplus: 8853,
  orarr: 8635,
  order: 8500,
  ovbar: 9021,
  parsl: 11005,
  phone: 9742,
  plusb: 8862,
  pluse: 10866,
  pound: 163,
  prcue: 8828,
  prime: 8242,
  prnap: 10937,
  prsim: 8830,
  quest: 63,
  rAarr: 8667,
  rBarr: 10511,
  radic: 8730,
  rangd: 10642,
  range: 10661,
  raquo: 187,
  rarrb: 8677,
  rarrc: 10547,
  rarrw: 8605,
  ratio: 8758,
  rbarr: 10509,
  rbbrk: 10099,
  rbrke: 10636,
  rceil: 8969,
  rdquo: 8221,
  reals: 8477,
  rhard: 8641,
  rharu: 8640,
  rlarr: 8644,
  rlhar: 8652,
  rnmid: 10990,
  roang: 10221,
  roarr: 8702,
  robrk: 10215,
  ropar: 10630,
  rrarr: 8649,
  rsquo: 8217,
  rtrie: 8885,
  rtrif: 9656,
  sbquo: 8218,
  sccue: 8829,
  scirc: 349,
  scnap: 10938,
  scsim: 8831,
  sdotb: 8865,
  sdote: 10854,
  seArr: 8664,
  searr: 8600,
  setmn: 8726,
  sharp: 9839,
  sigma: 963,
  simeq: 8771,
  simgE: 10912,
  simlE: 10911,
  simne: 8774,
  slarr: 8592,
  smile: 8995,
  sqcap: 8851,
  sqcup: 8852,
  sqsub: 8847,
  sqsup: 8848,
  srarr: 8594,
  starf: 9733,
  strns: 175,
  subnE: 10955,
  subne: 8842,
  supnE: 10956,
  supne: 8843,
  swArr: 8665,
  swarr: 8601,
  szlig: 223,
  theta: 952,
  thkap: 8776,
  thorn: 254,
  tilde: 732,
  times: 215,
  trade: 8482,
  trisb: 10701,
  tshcy: 1115,
  twixt: 8812,
  ubrcy: 1118,
  ucirc: 251,
  udarr: 8645,
  udhar: 10606,
  uharl: 8639,
  uharr: 8638,
  uhblk: 9600,
  ultri: 9720,
  umacr: 363,
  uogon: 371,
  uplus: 8846,
  upsih: 978,
  uring: 367,
  urtri: 9721,
  utdot: 8944,
  utrif: 9652,
  uuarr: 8648,
  vBarv: 10985,
  vDash: 8872,
  varpi: 982,
  vdash: 8866,
  veeeq: 8794,
  vltri: 8882,
  vprop: 8733,
  vrtri: 8883,
  wcirc: 373,
  wedge: 8743,
  xcirc: 9711,
  xdtri: 9661,
  xhArr: 10234,
  xharr: 10231,
  xlArr: 10232,
  xlarr: 10229,
  xodot: 10752,
  xrArr: 10233,
  xrarr: 10230,
  xutri: 9651,
  ycirc: 375,
  Aopf: 120120,
  Ascr: 119964,
  Auml: 196,
  Barv: 10983,
  Beta: 914,
  Bopf: 120121,
  Bscr: 8492,
  CHcy: 1063,
  COPY: 169,
  Cdot: 266,
  Copf: 8450,
  Cscr: 119966,
  DJcy: 1026,
  DScy: 1029,
  DZcy: 1039,
  Darr: 8609,
  Dopf: 120123,
  Dscr: 119967,
  Edot: 278,
  Eopf: 120124,
  Escr: 8496,
  Esim: 10867,
  Euml: 203,
  Fopf: 120125,
  Fscr: 8497,
  GJcy: 1027,
  Gdot: 288,
  Gopf: 120126,
  Gscr: 119970,
  Hopf: 8461,
  Hscr: 8459,
  IEcy: 1045,
  IOcy: 1025,
  Idot: 304,
  Iopf: 120128,
  Iota: 921,
  Iscr: 8464,
  Iuml: 207,
  Jopf: 120129,
  Jscr: 119973,
  KHcy: 1061,
  KJcy: 1036,
  Kopf: 120130,
  Kscr: 119974,
  LJcy: 1033,
  Lang: 10218,
  Larr: 8606,
  Lopf: 120131,
  Lscr: 8466,
  Mopf: 120132,
  Mscr: 8499,
  NJcy: 1034,
  Nopf: 8469,
  Nscr: 119977,
  Oopf: 120134,
  Oscr: 119978,
  Ouml: 214,
  Popf: 8473,
  Pscr: 119979,
  QUOT: 34,
  Qopf: 8474,
  Qscr: 119980,
  Rang: 10219,
  Rarr: 8608,
  Ropf: 8477,
  Rscr: 8475,
  SHcy: 1064,
  Sopf: 120138,
  Sqrt: 8730,
  Sscr: 119982,
  Star: 8902,
  TScy: 1062,
  Topf: 120139,
  Tscr: 119983,
  Uarr: 8607,
  Uopf: 120140,
  Upsi: 978,
  Uscr: 119984,
  Uuml: 220,
  Vbar: 10987,
  Vert: 8214,
  Vopf: 120141,
  Vscr: 119985,
  Wopf: 120142,
  Wscr: 119986,
  Xopf: 120143,
  Xscr: 119987,
  YAcy: 1071,
  YIcy: 1031,
  YUcy: 1070,
  Yopf: 120144,
  Yscr: 119988,
  Yuml: 376,
  ZHcy: 1046,
  Zdot: 379,
  Zeta: 918,
  Zopf: 8484,
  Zscr: 119989,
  andd: 10844,
  andv: 10842,
  ange: 10660,
  aopf: 120146,
  apid: 8779,
  apos: 39,
  ascr: 119990,
  auml: 228,
  bNot: 10989,
  bbrk: 9141,
  beta: 946,
  beth: 8502,
  bnot: 8976,
  bopf: 120147,
  boxH: 9552,
  boxV: 9553,
  boxh: 9472,
  boxv: 9474,
  bscr: 119991,
  bsim: 8765,
  bsol: 92,
  bull: 8226,
  bump: 8782,
  cdot: 267,
  cent: 162,
  chcy: 1095,
  cirE: 10691,
  circ: 710,
  cire: 8791,
  comp: 8705,
  cong: 8773,
  copf: 120148,
  copy: 169,
  cscr: 119992,
  csub: 10959,
  csup: 10960,
  dArr: 8659,
  dHar: 10597,
  darr: 8595,
  dash: 8208,
  diam: 8900,
  djcy: 1106,
  dopf: 120149,
  dscr: 119993,
  dscy: 1109,
  dsol: 10742,
  dtri: 9663,
  dzcy: 1119,
  eDot: 8785,
  ecir: 8790,
  edot: 279,
  emsp: 8195,
  ensp: 8194,
  eopf: 120150,
  epar: 8917,
  epsi: 1013,
  escr: 8495,
  esim: 8770,
  euml: 235,
  euro: 8364,
  excl: 33,
  flat: 9837,
  fnof: 402,
  fopf: 120151,
  fork: 8916,
  fscr: 119995,
  gdot: 289,
  geqq: 8807,
  gjcy: 1107,
  gnap: 10890,
  gneq: 10888,
  gopf: 120152,
  gscr: 8458,
  gsim: 8819,
  gtcc: 10919,
  hArr: 8660,
  half: 189,
  harr: 8596,
  hbar: 8463,
  hopf: 120153,
  hscr: 119997,
  iecy: 1077,
  imof: 8887,
  iocy: 1105,
  iopf: 120154,
  iota: 953,
  iscr: 119998,
  isin: 8712,
  iuml: 239,
  jopf: 120155,
  jscr: 119999,
  khcy: 1093,
  kjcy: 1116,
  kopf: 120156,
  kscr: 12e4,
  lArr: 8656,
  lHar: 10594,
  lang: 10216,
  larr: 8592,
  late: 10925,
  lcub: 123,
  ldca: 10550,
  ldsh: 8626,
  leqq: 8806,
  ljcy: 1113,
  lnap: 10889,
  lneq: 10887,
  lopf: 120157,
  lozf: 10731,
  lpar: 40,
  lscr: 120001,
  lsim: 8818,
  lsqb: 91,
  ltcc: 10918,
  ltri: 9667,
  macr: 175,
  male: 9794,
  malt: 10016,
  mlcp: 10971,
  mldr: 8230,
  mopf: 120158,
  mscr: 120002,
  nbsp: 160,
  ncap: 10819,
  ncup: 10818,
  ngeq: 8817,
  ngtr: 8815,
  nisd: 8954,
  njcy: 1114,
  nldr: 8229,
  nleq: 8816,
  nmid: 8740,
  nopf: 120159,
  npar: 8742,
  nscr: 120003,
  nsim: 8769,
  nsub: 8836,
  nsup: 8837,
  ntgl: 8825,
  ntlg: 8824,
  oast: 8859,
  ocir: 8858,
  odiv: 10808,
  odot: 8857,
  ogon: 731,
  oint: 8750,
  omid: 10678,
  oopf: 120160,
  opar: 10679,
  ordf: 170,
  ordm: 186,
  oror: 10838,
  oscr: 8500,
  osol: 8856,
  ouml: 246,
  para: 182,
  part: 8706,
  perp: 8869,
  phiv: 966,
  plus: 43,
  popf: 120161,
  prap: 10935,
  prec: 8826,
  prnE: 10933,
  prod: 8719,
  prop: 8733,
  pscr: 120005,
  qint: 10764,
  qopf: 120162,
  qscr: 120006,
  quot: 34,
  rArr: 8658,
  rHar: 10596,
  race: 10714,
  rang: 10217,
  rarr: 8594,
  rcub: 125,
  rdca: 10551,
  rdsh: 8627,
  real: 8476,
  rect: 9645,
  rhov: 1009,
  ring: 730,
  ropf: 120163,
  rpar: 41,
  rscr: 120007,
  rsqb: 93,
  rtri: 9657,
  scap: 10936,
  scnE: 10934,
  sdot: 8901,
  sect: 167,
  semi: 59,
  sext: 10038,
  shcy: 1096,
  sime: 8771,
  simg: 10910,
  siml: 10909,
  smid: 8739,
  smte: 10924,
  solb: 10692,
  sopf: 120164,
  spar: 8741,
  squf: 9642,
  sscr: 120008,
  star: 9734,
  subE: 10949,
  sube: 8838,
  succ: 8827,
  sung: 9834,
  sup1: 185,
  sup2: 178,
  sup3: 179,
  supE: 10950,
  supe: 8839,
  tbrk: 9140,
  tdot: 8411,
  tint: 8749,
  toea: 10536,
  topf: 120165,
  tosa: 10537,
  trie: 8796,
  tscr: 120009,
  tscy: 1094,
  uArr: 8657,
  uHar: 10595,
  uarr: 8593,
  uopf: 120166,
  upsi: 965,
  uscr: 120010,
  utri: 9653,
  uuml: 252,
  vArr: 8661,
  vBar: 10984,
  varr: 8597,
  vert: 124,
  vopf: 120167,
  vscr: 120011,
  wopf: 120168,
  wscr: 120012,
  xcap: 8898,
  xcup: 8899,
  xmap: 10236,
  xnis: 8955,
  xopf: 120169,
  xscr: 120013,
  xvee: 8897,
  yacy: 1103,
  yicy: 1111,
  yopf: 120170,
  yscr: 120014,
  yucy: 1102,
  yuml: 255,
  zdot: 380,
  zeta: 950,
  zhcy: 1078,
  zopf: 120171,
  zscr: 120015,
  zwnj: 8204,
  AMP: 38,
  Acy: 1040,
  Afr: 120068,
  And: 10835,
  Bcy: 1041,
  Bfr: 120069,
  Cap: 8914,
  Cfr: 8493,
  Chi: 935,
  Cup: 8915,
  Dcy: 1044,
  Del: 8711,
  Dfr: 120071,
  Dot: 168,
  ENG: 330,
  ETH: 208,
  Ecy: 1069,
  Efr: 120072,
  Eta: 919,
  Fcy: 1060,
  Ffr: 120073,
  Gcy: 1043,
  Gfr: 120074,
  Hat: 94,
  Hfr: 8460,
  Icy: 1048,
  Ifr: 8465,
  Int: 8748,
  Jcy: 1049,
  Jfr: 120077,
  Kcy: 1050,
  Kfr: 120078,
  Lcy: 1051,
  Lfr: 120079,
  Lsh: 8624,
  Map: 10501,
  Mcy: 1052,
  Mfr: 120080,
  Ncy: 1053,
  Nfr: 120081,
  Not: 10988,
  Ocy: 1054,
  Ofr: 120082,
  Pcy: 1055,
  Pfr: 120083,
  Phi: 934,
  Psi: 936,
  Qfr: 120084,
  REG: 174,
  Rcy: 1056,
  Rfr: 8476,
  Rho: 929,
  Rsh: 8625,
  Scy: 1057,
  Sfr: 120086,
  Sub: 8912,
  Sum: 8721,
  Sup: 8913,
  Tab: 9,
  Tau: 932,
  Tcy: 1058,
  Tfr: 120087,
  Ucy: 1059,
  Ufr: 120088,
  Vcy: 1042,
  Vee: 8897,
  Vfr: 120089,
  Wfr: 120090,
  Xfr: 120091,
  Ycy: 1067,
  Yfr: 120092,
  Zcy: 1047,
  Zfr: 8488,
  acd: 8767,
  acy: 1072,
  afr: 120094,
  amp: 38,
  and: 8743,
  ang: 8736,
  apE: 10864,
  ape: 8778,
  ast: 42,
  bcy: 1073,
  bfr: 120095,
  bot: 8869,
  cap: 8745,
  cfr: 120096,
  chi: 967,
  cir: 9675,
  cup: 8746,
  dcy: 1076,
  deg: 176,
  dfr: 120097,
  die: 168,
  div: 247,
  dot: 729,
  ecy: 1101,
  efr: 120098,
  egs: 10902,
  ell: 8467,
  els: 10901,
  eng: 331,
  eta: 951,
  eth: 240,
  fcy: 1092,
  ffr: 120099,
  gEl: 10892,
  gap: 10886,
  gcy: 1075,
  gel: 8923,
  geq: 8805,
  ges: 10878,
  gfr: 120100,
  ggg: 8921,
  glE: 10898,
  gla: 10917,
  glj: 10916,
  gnE: 8809,
  gne: 10888,
  hfr: 120101,
  icy: 1080,
  iff: 8660,
  ifr: 120102,
  int: 8747,
  jcy: 1081,
  jfr: 120103,
  kcy: 1082,
  kfr: 120104,
  lEg: 10891,
  lap: 10885,
  lat: 10923,
  lcy: 1083,
  leg: 8922,
  leq: 8804,
  les: 10877,
  lfr: 120105,
  lgE: 10897,
  lnE: 8808,
  lne: 10887,
  loz: 9674,
  lrm: 8206,
  lsh: 8624,
  map: 8614,
  mcy: 1084,
  mfr: 120106,
  mho: 8487,
  mid: 8739,
  nap: 8777,
  ncy: 1085,
  nfr: 120107,
  nge: 8817,
  ngt: 8815,
  nis: 8956,
  niv: 8715,
  nle: 8816,
  nlt: 8814,
  not: 172,
  npr: 8832,
  nsc: 8833,
  num: 35,
  ocy: 1086,
  ofr: 120108,
  ogt: 10689,
  ohm: 8486,
  olt: 10688,
  ord: 10845,
  orv: 10843,
  par: 8741,
  pcy: 1087,
  pfr: 120109,
  phi: 966,
  piv: 982,
  prE: 10931,
  pre: 10927,
  psi: 968,
  qfr: 120110,
  rcy: 1088,
  reg: 174,
  rfr: 120111,
  rho: 961,
  rlm: 8207,
  rsh: 8625,
  scE: 10932,
  sce: 10928,
  scy: 1089,
  sfr: 120112,
  shy: 173,
  sim: 8764,
  smt: 10922,
  sol: 47,
  squ: 9633,
  sub: 8834,
  sum: 8721,
  sup: 8835,
  tau: 964,
  tcy: 1090,
  tfr: 120113,
  top: 8868,
  ucy: 1091,
  ufr: 120114,
  uml: 168,
  vcy: 1074,
  vee: 8744,
  vfr: 120115,
  wfr: 120116,
  xfr: 120117,
  ycy: 1099,
  yen: 165,
  yfr: 120118,
  zcy: 1079,
  zfr: 120119,
  zwj: 8205,
  DD: 8517,
  GT: 62,
  Gg: 8921,
  Gt: 8811,
  Im: 8465,
  LT: 60,
  Ll: 8920,
  Lt: 8810,
  Mu: 924,
  Nu: 925,
  Or: 10836,
  Pi: 928,
  Pr: 10939,
  Re: 8476,
  Sc: 10940,
  Xi: 926,
  ac: 8766,
  af: 8289,
  ap: 8776,
  dd: 8518,
  ee: 8519,
  eg: 10906,
  el: 10905,
  gE: 8807,
  ge: 8805,
  gg: 8811,
  gl: 8823,
  gt: 62,
  ic: 8291,
  ii: 8520,
  in: 8712,
  it: 8290,
  lE: 8806,
  le: 8804,
  lg: 8822,
  ll: 8810,
  lt: 60,
  mp: 8723,
  mu: 956,
  ne: 8800,
  ni: 8715,
  nu: 957,
  oS: 9416,
  or: 8744,
  pi: 960,
  pm: 177,
  pr: 8826,
  rx: 8478,
  sc: 8827,
  wp: 8472,
  wr: 8768,
  xi: 958
};
new RegExp(`&(#?(?:x[\\w\\d]+|\\d+|${Object.keys(entities).join("|")}))(?:;|\\b)`, "g");
const meta_tags = /* @__PURE__ */ new Map([
  ["svelte:head", "Head"],
  ["svelte:options", "Options"],
  ["svelte:window", "Window"],
  ["svelte:body", "Body"]
]);
Array.from(meta_tags.keys()).concat("svelte:self", "svelte:component", "svelte:fragment", "svelte:element");
function unwrapExports(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var ariaPropsMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var properties2 = [["aria-activedescendant", {
    "type": "id"
  }], ["aria-atomic", {
    "type": "boolean"
  }], ["aria-autocomplete", {
    "type": "token",
    "values": ["inline", "list", "both", "none"]
  }], ["aria-busy", {
    "type": "boolean"
  }], ["aria-checked", {
    "type": "tristate"
  }], ["aria-colcount", {
    type: "integer"
  }], ["aria-colindex", {
    type: "integer"
  }], ["aria-colspan", {
    type: "integer"
  }], ["aria-controls", {
    "type": "idlist"
  }], ["aria-current", {
    type: "token",
    values: ["page", "step", "location", "date", "time", true, false]
  }], ["aria-describedby", {
    "type": "idlist"
  }], ["aria-details", {
    "type": "id"
  }], ["aria-disabled", {
    "type": "boolean"
  }], ["aria-dropeffect", {
    "type": "tokenlist",
    "values": ["copy", "execute", "link", "move", "none", "popup"]
  }], ["aria-errormessage", {
    "type": "id"
  }], ["aria-expanded", {
    "type": "boolean",
    "allowundefined": true
  }], ["aria-flowto", {
    "type": "idlist"
  }], ["aria-grabbed", {
    "type": "boolean",
    "allowundefined": true
  }], ["aria-haspopup", {
    "type": "token",
    "values": [false, true, "menu", "listbox", "tree", "grid", "dialog"]
  }], ["aria-hidden", {
    "type": "boolean",
    "allowundefined": true
  }], ["aria-invalid", {
    "type": "token",
    "values": ["grammar", false, "spelling", true]
  }], ["aria-keyshortcuts", {
    type: "string"
  }], ["aria-label", {
    "type": "string"
  }], ["aria-labelledby", {
    "type": "idlist"
  }], ["aria-level", {
    "type": "integer"
  }], ["aria-live", {
    "type": "token",
    "values": ["assertive", "off", "polite"]
  }], ["aria-modal", {
    type: "boolean"
  }], ["aria-multiline", {
    "type": "boolean"
  }], ["aria-multiselectable", {
    "type": "boolean"
  }], ["aria-orientation", {
    "type": "token",
    "values": ["vertical", "undefined", "horizontal"]
  }], ["aria-owns", {
    "type": "idlist"
  }], ["aria-placeholder", {
    type: "string"
  }], ["aria-posinset", {
    "type": "integer"
  }], ["aria-pressed", {
    "type": "tristate"
  }], ["aria-readonly", {
    "type": "boolean"
  }], ["aria-relevant", {
    "type": "tokenlist",
    "values": ["additions", "all", "removals", "text"]
  }], ["aria-required", {
    "type": "boolean"
  }], ["aria-roledescription", {
    type: "string"
  }], ["aria-rowcount", {
    type: "integer"
  }], ["aria-rowindex", {
    type: "integer"
  }], ["aria-rowspan", {
    type: "integer"
  }], ["aria-selected", {
    "type": "boolean",
    "allowundefined": true
  }], ["aria-setsize", {
    "type": "integer"
  }], ["aria-sort", {
    "type": "token",
    "values": ["ascending", "descending", "none", "other"]
  }], ["aria-valuemax", {
    "type": "number"
  }], ["aria-valuemin", {
    "type": "number"
  }], ["aria-valuenow", {
    "type": "number"
  }], ["aria-valuetext", {
    "type": "string"
  }]];
  var ariaPropsMap = {
    entries: function entries() {
      return properties2;
    },
    get: function get(key) {
      var item = properties2.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return properties2.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return properties2.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = ariaPropsMap;
  exports.default = _default2;
});
unwrapExports(ariaPropsMap_1);
var domMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var dom = [["a", {
    reserved: false
  }], ["abbr", {
    reserved: false
  }], ["acronym", {
    reserved: false
  }], ["address", {
    reserved: false
  }], ["applet", {
    reserved: false
  }], ["area", {
    reserved: false
  }], ["article", {
    reserved: false
  }], ["aside", {
    reserved: false
  }], ["audio", {
    reserved: false
  }], ["b", {
    reserved: false
  }], ["base", {
    reserved: true
  }], ["bdi", {
    reserved: false
  }], ["bdo", {
    reserved: false
  }], ["big", {
    reserved: false
  }], ["blink", {
    reserved: false
  }], ["blockquote", {
    reserved: false
  }], ["body", {
    reserved: false
  }], ["br", {
    reserved: false
  }], ["button", {
    reserved: false
  }], ["canvas", {
    reserved: false
  }], ["caption", {
    reserved: false
  }], ["center", {
    reserved: false
  }], ["cite", {
    reserved: false
  }], ["code", {
    reserved: false
  }], ["col", {
    reserved: true
  }], ["colgroup", {
    reserved: true
  }], ["content", {
    reserved: false
  }], ["data", {
    reserved: false
  }], ["datalist", {
    reserved: false
  }], ["dd", {
    reserved: false
  }], ["del", {
    reserved: false
  }], ["details", {
    reserved: false
  }], ["dfn", {
    reserved: false
  }], ["dialog", {
    reserved: false
  }], ["dir", {
    reserved: false
  }], ["div", {
    reserved: false
  }], ["dl", {
    reserved: false
  }], ["dt", {
    reserved: false
  }], ["em", {
    reserved: false
  }], ["embed", {
    reserved: false
  }], ["fieldset", {
    reserved: false
  }], ["figcaption", {
    reserved: false
  }], ["figure", {
    reserved: false
  }], ["font", {
    reserved: false
  }], ["footer", {
    reserved: false
  }], ["form", {
    reserved: false
  }], ["frame", {
    reserved: false
  }], ["frameset", {
    reserved: false
  }], ["h1", {
    reserved: false
  }], ["h2", {
    reserved: false
  }], ["h3", {
    reserved: false
  }], ["h4", {
    reserved: false
  }], ["h5", {
    reserved: false
  }], ["h6", {
    reserved: false
  }], ["head", {
    reserved: true
  }], ["header", {
    reserved: false
  }], ["hgroup", {
    reserved: false
  }], ["hr", {
    reserved: false
  }], ["html", {
    reserved: true
  }], ["i", {
    reserved: false
  }], ["iframe", {
    reserved: false
  }], ["img", {
    reserved: false
  }], ["input", {
    reserved: false
  }], ["ins", {
    reserved: false
  }], ["kbd", {
    reserved: false
  }], ["keygen", {
    reserved: false
  }], ["label", {
    reserved: false
  }], ["legend", {
    reserved: false
  }], ["li", {
    reserved: false
  }], ["link", {
    reserved: true
  }], ["main", {
    reserved: false
  }], ["map", {
    reserved: false
  }], ["mark", {
    reserved: false
  }], ["marquee", {
    reserved: false
  }], ["menu", {
    reserved: false
  }], ["menuitem", {
    reserved: false
  }], ["meta", {
    reserved: true
  }], ["meter", {
    reserved: false
  }], ["nav", {
    reserved: false
  }], ["noembed", {
    reserved: true
  }], ["noscript", {
    reserved: true
  }], ["object", {
    reserved: false
  }], ["ol", {
    reserved: false
  }], ["optgroup", {
    reserved: false
  }], ["option", {
    reserved: false
  }], ["output", {
    reserved: false
  }], ["p", {
    reserved: false
  }], ["param", {
    reserved: true
  }], ["picture", {
    reserved: true
  }], ["pre", {
    reserved: false
  }], ["progress", {
    reserved: false
  }], ["q", {
    reserved: false
  }], ["rp", {
    reserved: false
  }], ["rt", {
    reserved: false
  }], ["rtc", {
    reserved: false
  }], ["ruby", {
    reserved: false
  }], ["s", {
    reserved: false
  }], ["samp", {
    reserved: false
  }], ["script", {
    reserved: true
  }], ["section", {
    reserved: false
  }], ["select", {
    reserved: false
  }], ["small", {
    reserved: false
  }], ["source", {
    reserved: true
  }], ["spacer", {
    reserved: false
  }], ["span", {
    reserved: false
  }], ["strike", {
    reserved: false
  }], ["strong", {
    reserved: false
  }], ["style", {
    reserved: true
  }], ["sub", {
    reserved: false
  }], ["summary", {
    reserved: false
  }], ["sup", {
    reserved: false
  }], ["table", {
    reserved: false
  }], ["tbody", {
    reserved: false
  }], ["td", {
    reserved: false
  }], ["textarea", {
    reserved: false
  }], ["tfoot", {
    reserved: false
  }], ["th", {
    reserved: false
  }], ["thead", {
    reserved: false
  }], ["time", {
    reserved: false
  }], ["title", {
    reserved: true
  }], ["tr", {
    reserved: false
  }], ["track", {
    reserved: true
  }], ["tt", {
    reserved: false
  }], ["u", {
    reserved: false
  }], ["ul", {
    reserved: false
  }], ["var", {
    reserved: false
  }], ["video", {
    reserved: false
  }], ["wbr", {
    reserved: false
  }], ["xmp", {
    reserved: false
  }]];
  var domMap = {
    entries: function entries() {
      return dom;
    },
    get: function get(key) {
      var item = dom.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return dom.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return dom.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = domMap;
  exports.default = _default2;
});
unwrapExports(domMap_1);
var commandRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var commandRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "menuitem"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget"]]
  };
  var _default2 = commandRole;
  exports.default = _default2;
});
unwrapExports(commandRole_1);
var compositeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var compositeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-activedescendant": null,
      "aria-disabled": null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget"]]
  };
  var _default2 = compositeRole;
  exports.default = _default2;
});
unwrapExports(compositeRole_1);
var inputRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var inputRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null
    },
    relatedConcepts: [{
      concept: {
        name: "input"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget"]]
  };
  var _default2 = inputRole;
  exports.default = _default2;
});
unwrapExports(inputRole_1);
var landmarkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var landmarkRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = landmarkRole;
  exports.default = _default2;
});
unwrapExports(landmarkRole_1);
var rangeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var rangeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-valuemax": null,
      "aria-valuemin": null,
      "aria-valuenow": null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = rangeRole;
  exports.default = _default2;
});
unwrapExports(rangeRole_1);
var roletypeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var roletypeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {
      "aria-atomic": null,
      "aria-busy": null,
      "aria-controls": null,
      "aria-current": null,
      "aria-describedby": null,
      "aria-details": null,
      "aria-dropeffect": null,
      "aria-flowto": null,
      "aria-grabbed": null,
      "aria-hidden": null,
      "aria-keyshortcuts": null,
      "aria-label": null,
      "aria-labelledby": null,
      "aria-live": null,
      "aria-owns": null,
      "aria-relevant": null,
      "aria-roledescription": null
    },
    relatedConcepts: [{
      concept: {
        name: "rel"
      },
      module: "HTML"
    }, {
      concept: {
        name: "role"
      },
      module: "XHTML"
    }, {
      concept: {
        name: "type"
      },
      module: "Dublin Core"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: []
  };
  var _default2 = roletypeRole;
  exports.default = _default2;
});
unwrapExports(roletypeRole_1);
var sectionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var sectionRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "frontmatter"
      },
      module: "DTB"
    }, {
      concept: {
        name: "level"
      },
      module: "DTB"
    }, {
      concept: {
        name: "level"
      },
      module: "SMIL"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = sectionRole;
  exports.default = _default2;
});
unwrapExports(sectionRole_1);
var sectionheadRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var sectionheadRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = sectionheadRole;
  exports.default = _default2;
});
unwrapExports(sectionheadRole_1);
var selectRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var selectRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-orientation": null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite"], ["roletype", "structure", "section", "group"]]
  };
  var _default2 = selectRole;
  exports.default = _default2;
});
unwrapExports(selectRole_1);
var structureRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var structureRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype"]]
  };
  var _default2 = structureRole;
  exports.default = _default2;
});
unwrapExports(structureRole_1);
var widgetRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var widgetRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype"]]
  };
  var _default2 = widgetRole;
  exports.default = _default2;
});
unwrapExports(widgetRole_1);
var windowRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var windowRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-modal": null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype"]]
  };
  var _default2 = windowRole;
  exports.default = _default2;
});
unwrapExports(windowRole_1);
var ariaAbstractRoles_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _commandRole = _interopRequireDefault(commandRole_1);
  var _compositeRole = _interopRequireDefault(compositeRole_1);
  var _inputRole = _interopRequireDefault(inputRole_1);
  var _landmarkRole = _interopRequireDefault(landmarkRole_1);
  var _rangeRole = _interopRequireDefault(rangeRole_1);
  var _roletypeRole = _interopRequireDefault(roletypeRole_1);
  var _sectionRole = _interopRequireDefault(sectionRole_1);
  var _sectionheadRole = _interopRequireDefault(sectionheadRole_1);
  var _selectRole = _interopRequireDefault(selectRole_1);
  var _structureRole = _interopRequireDefault(structureRole_1);
  var _widgetRole = _interopRequireDefault(widgetRole_1);
  var _windowRole = _interopRequireDefault(windowRole_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var ariaAbstractRoles = [["command", _commandRole.default], ["composite", _compositeRole.default], ["input", _inputRole.default], ["landmark", _landmarkRole.default], ["range", _rangeRole.default], ["roletype", _roletypeRole.default], ["section", _sectionRole.default], ["sectionhead", _sectionheadRole.default], ["select", _selectRole.default], ["structure", _structureRole.default], ["widget", _widgetRole.default], ["window", _windowRole.default]];
  var _default2 = ariaAbstractRoles;
  exports.default = _default2;
});
unwrapExports(ariaAbstractRoles_1);
var alertRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var alertRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-atomic": "true",
      "aria-live": "assertive"
    },
    relatedConcepts: [{
      concept: {
        name: "alert"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = alertRole;
  exports.default = _default2;
});
unwrapExports(alertRole_1);
var alertdialogRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var alertdialogRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "alert"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "alert"], ["roletype", "window", "dialog"]]
  };
  var _default2 = alertdialogRole;
  exports.default = _default2;
});
unwrapExports(alertdialogRole_1);
var applicationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var applicationRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-activedescendant": null,
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "Device Independence Delivery Unit"
      }
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = applicationRole;
  exports.default = _default2;
});
unwrapExports(applicationRole_1);
var articleRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var articleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-posinset": null,
      "aria-setsize": null
    },
    relatedConcepts: [{
      concept: {
        name: "article"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "document"]]
  };
  var _default2 = articleRole;
  exports.default = _default2;
});
unwrapExports(articleRole_1);
var bannerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var bannerRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        constraints: ["direct descendant of document"],
        name: "header"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = bannerRole;
  exports.default = _default2;
});
unwrapExports(bannerRole_1);
var blockquoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var blockquoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = blockquoteRole;
  exports.default = _default2;
});
unwrapExports(blockquoteRole_1);
var buttonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var buttonRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-pressed": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "aria-pressed"
        }, {
          name: "type",
          value: "checkbox"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "aria-expanded",
          value: "false"
        }],
        name: "summary"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "aria-expanded",
          value: "true"
        }],
        constraints: ["direct descendant of details element with the open attribute defined"],
        name: "summary"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "type",
          value: "button"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "type",
          value: "image"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "type",
          value: "reset"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "type",
          value: "submit"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        name: "button"
      },
      module: "HTML"
    }, {
      concept: {
        name: "trigger"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command"]]
  };
  var _default2 = buttonRole;
  exports.default = _default2;
});
unwrapExports(buttonRole_1);
var captionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var captionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: ["figure", "grid", "table"],
    requiredContextRole: ["figure", "grid", "table"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = captionRole;
  exports.default = _default2;
});
unwrapExports(captionRole_1);
var cellRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var cellRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-colindex": null,
      "aria-colspan": null,
      "aria-rowindex": null,
      "aria-rowspan": null
    },
    relatedConcepts: [{
      concept: {
        constraints: ["descendant of table"],
        name: "td"
      },
      module: "HTML"
    }],
    requireContextRole: ["row"],
    requiredContextRole: ["row"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = cellRole;
  exports.default = _default2;
});
unwrapExports(cellRole_1);
var checkboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var checkboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-checked": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-required": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "type",
          value: "checkbox"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        name: "option"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-checked": null
    },
    superClass: [["roletype", "widget", "input"]]
  };
  var _default2 = checkboxRole;
  exports.default = _default2;
});
unwrapExports(checkboxRole_1);
var codeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var codeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = codeRole;
  exports.default = _default2;
});
unwrapExports(codeRole_1);
var columnheaderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var columnheaderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-sort": null
    },
    relatedConcepts: [{
      attributes: [{
        name: "scope",
        value: "col"
      }],
      concept: {
        name: "th"
      },
      module: "HTML"
    }],
    requireContextRole: ["row"],
    requiredContextRole: ["row"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "cell"], ["roletype", "structure", "section", "cell", "gridcell"], ["roletype", "widget", "gridcell"], ["roletype", "structure", "sectionhead"]]
  };
  var _default2 = columnheaderRole;
  exports.default = _default2;
});
unwrapExports(columnheaderRole_1);
var comboboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var comboboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-activedescendant": null,
      "aria-autocomplete": null,
      "aria-errormessage": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-required": null,
      "aria-expanded": "false",
      "aria-haspopup": "listbox"
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "email"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "search"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "tel"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "text"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "url"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "list"
        }, {
          name: "type",
          value: "url"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "multiple"
        }, {
          constraints: ["undefined"],
          name: "size"
        }],
        name: "select"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "multiple"
        }, {
          name: "size",
          value: 1
        }],
        name: "select"
      },
      module: "HTML"
    }, {
      concept: {
        name: "select"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-controls": null,
      "aria-expanded": "false"
    },
    superClass: [["roletype", "widget", "input"]]
  };
  var _default2 = comboboxRole;
  exports.default = _default2;
});
unwrapExports(comboboxRole_1);
var complementaryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var complementaryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "aside"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = complementaryRole;
  exports.default = _default2;
});
unwrapExports(complementaryRole_1);
var contentinfoRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var contentinfoRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        constraints: ["direct descendant of document"],
        name: "footer"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = contentinfoRole;
  exports.default = _default2;
});
unwrapExports(contentinfoRole_1);
var definitionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var definitionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "dd"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = definitionRole;
  exports.default = _default2;
});
unwrapExports(definitionRole_1);
var deletionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var deletionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = deletionRole;
  exports.default = _default2;
});
unwrapExports(deletionRole_1);
var dialogRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var dialogRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "dialog"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "window"]]
  };
  var _default2 = dialogRole;
  exports.default = _default2;
});
unwrapExports(dialogRole_1);
var directoryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var directoryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      module: "DAISY Guide"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "list"]]
  };
  var _default2 = directoryRole;
  exports.default = _default2;
});
unwrapExports(directoryRole_1);
var documentRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var documentRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "Device Independence Delivery Unit"
      }
    }, {
      concept: {
        name: "body"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = documentRole;
  exports.default = _default2;
});
unwrapExports(documentRole_1);
var emphasisRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var emphasisRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = emphasisRole;
  exports.default = _default2;
});
unwrapExports(emphasisRole_1);
var feedRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var feedRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["article"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "list"]]
  };
  var _default2 = feedRole;
  exports.default = _default2;
});
unwrapExports(feedRole_1);
var figureRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var figureRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "figure"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = figureRole;
  exports.default = _default2;
});
unwrapExports(figureRole_1);
var formRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var formRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "aria-label"
        }],
        name: "form"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "aria-labelledby"
        }],
        name: "form"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "name"
        }],
        name: "form"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = formRole;
  exports.default = _default2;
});
unwrapExports(formRole_1);
var genericRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var genericRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "span"
      },
      module: "HTML"
    }, {
      concept: {
        name: "div"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = genericRole;
  exports.default = _default2;
});
unwrapExports(genericRole_1);
var gridRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var gridRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-multiselectable": null,
      "aria-readonly": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "role",
          value: "grid"
        }],
        name: "table"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["row"], ["row", "rowgroup"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite"], ["roletype", "structure", "section", "table"]]
  };
  var _default2 = gridRole;
  exports.default = _default2;
});
unwrapExports(gridRole_1);
var gridcellRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var gridcellRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-required": null,
      "aria-selected": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "role",
          value: "gridcell"
        }],
        name: "td"
      },
      module: "HTML"
    }],
    requireContextRole: ["row"],
    requiredContextRole: ["row"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "cell"], ["roletype", "widget"]]
  };
  var _default2 = gridcellRole;
  exports.default = _default2;
});
unwrapExports(gridcellRole_1);
var groupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var groupRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-activedescendant": null,
      "aria-disabled": null
    },
    relatedConcepts: [{
      concept: {
        name: "details"
      },
      module: "HTML"
    }, {
      concept: {
        name: "fieldset"
      },
      module: "HTML"
    }, {
      concept: {
        name: "optgroup"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = groupRole;
  exports.default = _default2;
});
unwrapExports(groupRole_1);
var headingRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var headingRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-level": "2"
    },
    relatedConcepts: [{
      concept: {
        name: "h1"
      },
      module: "HTML"
    }, {
      concept: {
        name: "h2"
      },
      module: "HTML"
    }, {
      concept: {
        name: "h3"
      },
      module: "HTML"
    }, {
      concept: {
        name: "h4"
      },
      module: "HTML"
    }, {
      concept: {
        name: "h5"
      },
      module: "HTML"
    }, {
      concept: {
        name: "h6"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-level": "2"
    },
    superClass: [["roletype", "structure", "sectionhead"]]
  };
  var _default2 = headingRole;
  exports.default = _default2;
});
unwrapExports(headingRole_1);
var imgRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var imgRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "alt"
        }],
        name: "img"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "alt"
        }],
        name: "img"
      },
      module: "HTML"
    }, {
      concept: {
        name: "imggroup"
      },
      module: "DTB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = imgRole;
  exports.default = _default2;
});
unwrapExports(imgRole_1);
var insertionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var insertionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = insertionRole;
  exports.default = _default2;
});
unwrapExports(insertionRole_1);
var linkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var linkRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-expanded": null,
      "aria-haspopup": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "href"
        }],
        name: "a"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "href"
        }],
        name: "area"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "href"
        }],
        name: "link"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command"]]
  };
  var _default2 = linkRole;
  exports.default = _default2;
});
unwrapExports(linkRole_1);
var listRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var listRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "menu"
      },
      module: "HTML"
    }, {
      concept: {
        name: "ol"
      },
      module: "HTML"
    }, {
      concept: {
        name: "ul"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["listitem"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = listRole;
  exports.default = _default2;
});
unwrapExports(listRole_1);
var listboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var listboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-invalid": null,
      "aria-multiselectable": null,
      "aria-readonly": null,
      "aria-required": null,
      "aria-orientation": "vertical"
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: [">1"],
          name: "size"
        }, {
          name: "multiple"
        }],
        name: "select"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: [">1"],
          name: "size"
        }],
        name: "select"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          name: "multiple"
        }],
        name: "select"
      },
      module: "HTML"
    }, {
      concept: {
        name: "datalist"
      },
      module: "HTML"
    }, {
      concept: {
        name: "list"
      },
      module: "ARIA"
    }, {
      concept: {
        name: "select"
      },
      module: "XForms"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["option", "group"], ["option"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
  };
  var _default2 = listboxRole;
  exports.default = _default2;
});
unwrapExports(listboxRole_1);
var listitemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var listitemRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-level": null,
      "aria-posinset": null,
      "aria-setsize": null
    },
    relatedConcepts: [{
      concept: {
        constraints: ["direct descendant of ol, ul or menu"],
        name: "li"
      },
      module: "HTML"
    }, {
      concept: {
        name: "item"
      },
      module: "XForms"
    }],
    requireContextRole: ["directory", "list"],
    requiredContextRole: ["directory", "list"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = listitemRole;
  exports.default = _default2;
});
unwrapExports(listitemRole_1);
var logRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var logRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-live": "polite"
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = logRole;
  exports.default = _default2;
});
unwrapExports(logRole_1);
var mainRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var mainRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "main"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = mainRole;
  exports.default = _default2;
});
unwrapExports(mainRole_1);
var marqueeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var marqueeRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = marqueeRole;
  exports.default = _default2;
});
unwrapExports(marqueeRole_1);
var mathRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var mathRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "math"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = mathRole;
  exports.default = _default2;
});
unwrapExports(mathRole_1);
var menuRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var menuRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-orientation": "vertical"
    },
    relatedConcepts: [{
      concept: {
        name: "MENU"
      },
      module: "JAPI"
    }, {
      concept: {
        name: "list"
      },
      module: "ARIA"
    }, {
      concept: {
        name: "select"
      },
      module: "XForms"
    }, {
      concept: {
        name: "sidebar"
      },
      module: "DTB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["menuitem", "group"], ["menuitemradio", "group"], ["menuitemcheckbox", "group"], ["menuitem"], ["menuitemcheckbox"], ["menuitemradio"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
  };
  var _default2 = menuRole;
  exports.default = _default2;
});
unwrapExports(menuRole_1);
var menubarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var menubarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-orientation": "horizontal"
    },
    relatedConcepts: [{
      concept: {
        name: "toolbar"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["menuitem", "group"], ["menuitemradio", "group"], ["menuitemcheckbox", "group"], ["menuitem"], ["menuitemcheckbox"], ["menuitemradio"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "select", "menu"], ["roletype", "structure", "section", "group", "select", "menu"]]
  };
  var _default2 = menubarRole;
  exports.default = _default2;
});
unwrapExports(menubarRole_1);
var menuitemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var menuitemRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-posinset": null,
      "aria-setsize": null
    },
    relatedConcepts: [{
      concept: {
        name: "MENU_ITEM"
      },
      module: "JAPI"
    }, {
      concept: {
        name: "listitem"
      },
      module: "ARIA"
    }, {
      concept: {
        name: "menuitem"
      },
      module: "HTML"
    }, {
      concept: {
        name: "option"
      },
      module: "ARIA"
    }],
    requireContextRole: ["group", "menu", "menubar"],
    requiredContextRole: ["group", "menu", "menubar"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command"]]
  };
  var _default2 = menuitemRole;
  exports.default = _default2;
});
unwrapExports(menuitemRole_1);
var menuitemcheckboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var menuitemcheckboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "menuitem"
      },
      module: "ARIA"
    }],
    requireContextRole: ["group", "menu", "menubar"],
    requiredContextRole: ["group", "menu", "menubar"],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-checked": null
    },
    superClass: [["roletype", "widget", "input", "checkbox"], ["roletype", "widget", "command", "menuitem"]]
  };
  var _default2 = menuitemcheckboxRole;
  exports.default = _default2;
});
unwrapExports(menuitemcheckboxRole_1);
var menuitemradioRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var menuitemradioRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "menuitem"
      },
      module: "ARIA"
    }],
    requireContextRole: ["group", "menu", "menubar"],
    requiredContextRole: ["group", "menu", "menubar"],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-checked": null
    },
    superClass: [["roletype", "widget", "input", "checkbox", "menuitemcheckbox"], ["roletype", "widget", "command", "menuitem", "menuitemcheckbox"], ["roletype", "widget", "input", "radio"]]
  };
  var _default2 = menuitemradioRole;
  exports.default = _default2;
});
unwrapExports(menuitemradioRole_1);
var meterRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var meterRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-valuetext": null,
      "aria-valuemax": "100",
      "aria-valuemin": "0"
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-valuenow": null
    },
    superClass: [["roletype", "structure", "range"]]
  };
  var _default2 = meterRole;
  exports.default = _default2;
});
unwrapExports(meterRole_1);
var navigationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var navigationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "nav"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = navigationRole;
  exports.default = _default2;
});
unwrapExports(navigationRole_1);
var noneRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var noneRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: []
  };
  var _default2 = noneRole;
  exports.default = _default2;
});
unwrapExports(noneRole_1);
var noteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var noteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = noteRole;
  exports.default = _default2;
});
unwrapExports(noteRole_1);
var optionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var optionRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-checked": null,
      "aria-posinset": null,
      "aria-setsize": null,
      "aria-selected": "false"
    },
    relatedConcepts: [{
      concept: {
        name: "item"
      },
      module: "XForms"
    }, {
      concept: {
        name: "listitem"
      },
      module: "ARIA"
    }, {
      concept: {
        name: "option"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-selected": "false"
    },
    superClass: [["roletype", "widget", "input"]]
  };
  var _default2 = optionRole;
  exports.default = _default2;
});
unwrapExports(optionRole_1);
var paragraphRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var paragraphRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = paragraphRole;
  exports.default = _default2;
});
unwrapExports(paragraphRole_1);
var presentationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var presentationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = presentationRole;
  exports.default = _default2;
});
unwrapExports(presentationRole_1);
var progressbarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var progressbarRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-valuetext": null
    },
    relatedConcepts: [{
      concept: {
        name: "progress"
      },
      module: "HTML"
    }, {
      concept: {
        name: "status"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "range"], ["roletype", "widget"]]
  };
  var _default2 = progressbarRole;
  exports.default = _default2;
});
unwrapExports(progressbarRole_1);
var radioRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var radioRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-checked": null,
      "aria-posinset": null,
      "aria-setsize": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "type",
          value: "radio"
        }],
        name: "input"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-checked": null
    },
    superClass: [["roletype", "widget", "input"]]
  };
  var _default2 = radioRole;
  exports.default = _default2;
});
unwrapExports(radioRole_1);
var radiogroupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var radiogroupRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-required": null
    },
    relatedConcepts: [{
      concept: {
        name: "list"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["radio"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
  };
  var _default2 = radiogroupRole;
  exports.default = _default2;
});
unwrapExports(radiogroupRole_1);
var regionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var regionRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "aria-label"
        }],
        name: "section"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["set"],
          name: "aria-labelledby"
        }],
        name: "section"
      },
      module: "HTML"
    }, {
      concept: {
        name: "Device Independence Glossart perceivable unit"
      }
    }, {
      concept: {
        name: "frame"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = regionRole;
  exports.default = _default2;
});
unwrapExports(regionRole_1);
var rowRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var rowRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-colindex": null,
      "aria-expanded": null,
      "aria-level": null,
      "aria-posinset": null,
      "aria-rowindex": null,
      "aria-selected": null,
      "aria-setsize": null
    },
    relatedConcepts: [{
      concept: {
        name: "tr"
      },
      module: "HTML"
    }],
    requireContextRole: ["grid", "rowgroup", "table", "treegrid"],
    requiredContextRole: ["grid", "rowgroup", "table", "treegrid"],
    requiredOwnedElements: [["cell"], ["columnheader"], ["gridcell"], ["rowheader"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "group"], ["roletype", "widget"]]
  };
  var _default2 = rowRole;
  exports.default = _default2;
});
unwrapExports(rowRole_1);
var rowgroupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var rowgroupRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "tbody"
      },
      module: "HTML"
    }, {
      concept: {
        name: "tfoot"
      },
      module: "HTML"
    }, {
      concept: {
        name: "thead"
      },
      module: "HTML"
    }],
    requireContextRole: ["grid", "table", "treegrid"],
    requiredContextRole: ["grid", "table", "treegrid"],
    requiredOwnedElements: [["row"]],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = rowgroupRole;
  exports.default = _default2;
});
unwrapExports(rowgroupRole_1);
var rowheaderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var rowheaderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-sort": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "scope",
          value: "row"
        }],
        name: "th"
      },
      module: "HTML"
    }],
    requireContextRole: ["row"],
    requiredContextRole: ["row"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "cell"], ["roletype", "structure", "section", "cell", "gridcell"], ["roletype", "widget", "gridcell"], ["roletype", "structure", "sectionhead"]]
  };
  var _default2 = rowheaderRole;
  exports.default = _default2;
});
unwrapExports(rowheaderRole_1);
var scrollbarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var scrollbarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-valuetext": null,
      "aria-orientation": "vertical",
      "aria-valuemax": "100",
      "aria-valuemin": "0"
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-controls": null,
      "aria-valuenow": null
    },
    superClass: [["roletype", "structure", "range"], ["roletype", "widget"]]
  };
  var _default2 = scrollbarRole;
  exports.default = _default2;
});
unwrapExports(scrollbarRole_1);
var searchRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var searchRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = searchRole;
  exports.default = _default2;
});
unwrapExports(searchRole_1);
var searchboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var searchboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "list"
        }, {
          name: "type",
          value: "search"
        }],
        name: "input"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "input", "textbox"]]
  };
  var _default2 = searchboxRole;
  exports.default = _default2;
});
unwrapExports(searchboxRole_1);
var separatorRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var separatorRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-orientation": "horizontal",
      "aria-valuemax": "100",
      "aria-valuemin": "0",
      "aria-valuenow": null,
      "aria-valuetext": null
    },
    relatedConcepts: [{
      concept: {
        name: "hr"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure"]]
  };
  var _default2 = separatorRole;
  exports.default = _default2;
});
unwrapExports(separatorRole_1);
var sliderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var sliderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-haspopup": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-valuetext": null,
      "aria-orientation": "horizontal",
      "aria-valuemax": "100",
      "aria-valuemin": "0"
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "type",
          value: "range"
        }],
        name: "input"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-valuenow": null
    },
    superClass: [["roletype", "widget", "input"], ["roletype", "structure", "range"]]
  };
  var _default2 = sliderRole;
  exports.default = _default2;
});
unwrapExports(sliderRole_1);
var spinbuttonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var spinbuttonRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null,
      "aria-readonly": null,
      "aria-required": null,
      "aria-valuetext": null,
      "aria-valuenow": "0"
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: "type",
          value: "number"
        }],
        name: "input"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite"], ["roletype", "widget", "input"], ["roletype", "structure", "range"]]
  };
  var _default2 = spinbuttonRole;
  exports.default = _default2;
});
unwrapExports(spinbuttonRole_1);
var statusRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var statusRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-atomic": "true",
      "aria-live": "polite"
    },
    relatedConcepts: [{
      concept: {
        name: "output"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = statusRole;
  exports.default = _default2;
});
unwrapExports(statusRole_1);
var strongRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var strongRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = strongRole;
  exports.default = _default2;
});
unwrapExports(strongRole_1);
var subscriptRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var subscriptRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = subscriptRole;
  exports.default = _default2;
});
unwrapExports(subscriptRole_1);
var superscriptRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var superscriptRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["prohibited"],
    prohibitedProps: ["aria-label", "aria-labelledby"],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = superscriptRole;
  exports.default = _default2;
});
unwrapExports(superscriptRole_1);
var switchRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var switchRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "button"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-checked": null
    },
    superClass: [["roletype", "widget", "input", "checkbox"]]
  };
  var _default2 = switchRole;
  exports.default = _default2;
});
unwrapExports(switchRole_1);
var tabRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var tabRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-posinset": null,
      "aria-setsize": null,
      "aria-selected": "false"
    },
    relatedConcepts: [],
    requireContextRole: ["tablist"],
    requiredContextRole: ["tablist"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "sectionhead"], ["roletype", "widget"]]
  };
  var _default2 = tabRole;
  exports.default = _default2;
});
unwrapExports(tabRole_1);
var tableRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var tableRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-colcount": null,
      "aria-rowcount": null
    },
    relatedConcepts: [{
      concept: {
        name: "table"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["row"], ["row", "rowgroup"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = tableRole;
  exports.default = _default2;
});
unwrapExports(tableRole_1);
var tablistRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var tablistRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-level": null,
      "aria-multiselectable": null,
      "aria-orientation": "horizontal"
    },
    relatedConcepts: [{
      module: "DAISY",
      concept: {
        name: "guide"
      }
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["tab"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite"]]
  };
  var _default2 = tablistRole;
  exports.default = _default2;
});
unwrapExports(tablistRole_1);
var tabpanelRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var tabpanelRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = tabpanelRole;
  exports.default = _default2;
});
unwrapExports(tabpanelRole_1);
var termRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var termRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "dfn"
      },
      module: "HTML"
    }, {
      concept: {
        name: "dt"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = termRole;
  exports.default = _default2;
});
unwrapExports(termRole_1);
var textboxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var textboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-activedescendant": null,
      "aria-autocomplete": null,
      "aria-errormessage": null,
      "aria-haspopup": null,
      "aria-invalid": null,
      "aria-multiline": null,
      "aria-placeholder": null,
      "aria-readonly": null,
      "aria-required": null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "type"
        }, {
          constraints: ["undefined"],
          name: "list"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "list"
        }, {
          name: "type",
          value: "email"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "list"
        }, {
          name: "type",
          value: "tel"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "list"
        }, {
          name: "type",
          value: "text"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        attributes: [{
          constraints: ["undefined"],
          name: "list"
        }, {
          name: "type",
          value: "url"
        }],
        name: "input"
      },
      module: "HTML"
    }, {
      concept: {
        name: "input"
      },
      module: "XForms"
    }, {
      concept: {
        name: "textarea"
      },
      module: "HTML"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "input"]]
  };
  var _default2 = textboxRole;
  exports.default = _default2;
});
unwrapExports(textboxRole_1);
var timeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var timeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = timeRole;
  exports.default = _default2;
});
unwrapExports(timeRole_1);
var timerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var timerRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "status"]]
  };
  var _default2 = timerRole;
  exports.default = _default2;
});
unwrapExports(timerRole_1);
var toolbarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var toolbarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-orientation": "horizontal"
    },
    relatedConcepts: [{
      concept: {
        name: "menubar"
      },
      module: "ARIA"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "group"]]
  };
  var _default2 = toolbarRole;
  exports.default = _default2;
});
unwrapExports(toolbarRole_1);
var tooltipRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var tooltipRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = tooltipRole;
  exports.default = _default2;
});
unwrapExports(tooltipRole_1);
var treeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var treeRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null,
      "aria-multiselectable": null,
      "aria-required": null,
      "aria-orientation": "vertical"
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["treeitem", "group"], ["treeitem"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
  };
  var _default2 = treeRole;
  exports.default = _default2;
});
unwrapExports(treeRole_1);
var treegridRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var treegridRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["row"], ["row", "rowgroup"]],
    requiredProps: {},
    superClass: [["roletype", "widget", "composite", "grid"], ["roletype", "structure", "section", "table", "grid"], ["roletype", "widget", "composite", "select", "tree"], ["roletype", "structure", "section", "group", "select", "tree"]]
  };
  var _default2 = treegridRole;
  exports.default = _default2;
});
unwrapExports(treegridRole_1);
var treeitemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var treeitemRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-expanded": null,
      "aria-haspopup": null
    },
    relatedConcepts: [],
    requireContextRole: ["group", "tree"],
    requiredContextRole: ["group", "tree"],
    requiredOwnedElements: [],
    requiredProps: {
      "aria-selected": null
    },
    superClass: [["roletype", "structure", "section", "listitem"], ["roletype", "widget", "input", "option"]]
  };
  var _default2 = treeitemRole;
  exports.default = _default2;
});
unwrapExports(treeitemRole_1);
var ariaLiteralRoles_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _alertRole = _interopRequireDefault(alertRole_1);
  var _alertdialogRole = _interopRequireDefault(alertdialogRole_1);
  var _applicationRole = _interopRequireDefault(applicationRole_1);
  var _articleRole = _interopRequireDefault(articleRole_1);
  var _bannerRole = _interopRequireDefault(bannerRole_1);
  var _blockquoteRole = _interopRequireDefault(blockquoteRole_1);
  var _buttonRole = _interopRequireDefault(buttonRole_1);
  var _captionRole = _interopRequireDefault(captionRole_1);
  var _cellRole = _interopRequireDefault(cellRole_1);
  var _checkboxRole = _interopRequireDefault(checkboxRole_1);
  var _codeRole = _interopRequireDefault(codeRole_1);
  var _columnheaderRole = _interopRequireDefault(columnheaderRole_1);
  var _comboboxRole = _interopRequireDefault(comboboxRole_1);
  var _complementaryRole = _interopRequireDefault(complementaryRole_1);
  var _contentinfoRole = _interopRequireDefault(contentinfoRole_1);
  var _definitionRole = _interopRequireDefault(definitionRole_1);
  var _deletionRole = _interopRequireDefault(deletionRole_1);
  var _dialogRole = _interopRequireDefault(dialogRole_1);
  var _directoryRole = _interopRequireDefault(directoryRole_1);
  var _documentRole = _interopRequireDefault(documentRole_1);
  var _emphasisRole = _interopRequireDefault(emphasisRole_1);
  var _feedRole = _interopRequireDefault(feedRole_1);
  var _figureRole = _interopRequireDefault(figureRole_1);
  var _formRole = _interopRequireDefault(formRole_1);
  var _genericRole = _interopRequireDefault(genericRole_1);
  var _gridRole = _interopRequireDefault(gridRole_1);
  var _gridcellRole = _interopRequireDefault(gridcellRole_1);
  var _groupRole = _interopRequireDefault(groupRole_1);
  var _headingRole = _interopRequireDefault(headingRole_1);
  var _imgRole = _interopRequireDefault(imgRole_1);
  var _insertionRole = _interopRequireDefault(insertionRole_1);
  var _linkRole = _interopRequireDefault(linkRole_1);
  var _listRole = _interopRequireDefault(listRole_1);
  var _listboxRole = _interopRequireDefault(listboxRole_1);
  var _listitemRole = _interopRequireDefault(listitemRole_1);
  var _logRole = _interopRequireDefault(logRole_1);
  var _mainRole = _interopRequireDefault(mainRole_1);
  var _marqueeRole = _interopRequireDefault(marqueeRole_1);
  var _mathRole = _interopRequireDefault(mathRole_1);
  var _menuRole = _interopRequireDefault(menuRole_1);
  var _menubarRole = _interopRequireDefault(menubarRole_1);
  var _menuitemRole = _interopRequireDefault(menuitemRole_1);
  var _menuitemcheckboxRole = _interopRequireDefault(menuitemcheckboxRole_1);
  var _menuitemradioRole = _interopRequireDefault(menuitemradioRole_1);
  var _meterRole = _interopRequireDefault(meterRole_1);
  var _navigationRole = _interopRequireDefault(navigationRole_1);
  var _noneRole = _interopRequireDefault(noneRole_1);
  var _noteRole = _interopRequireDefault(noteRole_1);
  var _optionRole = _interopRequireDefault(optionRole_1);
  var _paragraphRole = _interopRequireDefault(paragraphRole_1);
  var _presentationRole = _interopRequireDefault(presentationRole_1);
  var _progressbarRole = _interopRequireDefault(progressbarRole_1);
  var _radioRole = _interopRequireDefault(radioRole_1);
  var _radiogroupRole = _interopRequireDefault(radiogroupRole_1);
  var _regionRole = _interopRequireDefault(regionRole_1);
  var _rowRole = _interopRequireDefault(rowRole_1);
  var _rowgroupRole = _interopRequireDefault(rowgroupRole_1);
  var _rowheaderRole = _interopRequireDefault(rowheaderRole_1);
  var _scrollbarRole = _interopRequireDefault(scrollbarRole_1);
  var _searchRole = _interopRequireDefault(searchRole_1);
  var _searchboxRole = _interopRequireDefault(searchboxRole_1);
  var _separatorRole = _interopRequireDefault(separatorRole_1);
  var _sliderRole = _interopRequireDefault(sliderRole_1);
  var _spinbuttonRole = _interopRequireDefault(spinbuttonRole_1);
  var _statusRole = _interopRequireDefault(statusRole_1);
  var _strongRole = _interopRequireDefault(strongRole_1);
  var _subscriptRole = _interopRequireDefault(subscriptRole_1);
  var _superscriptRole = _interopRequireDefault(superscriptRole_1);
  var _switchRole = _interopRequireDefault(switchRole_1);
  var _tabRole = _interopRequireDefault(tabRole_1);
  var _tableRole = _interopRequireDefault(tableRole_1);
  var _tablistRole = _interopRequireDefault(tablistRole_1);
  var _tabpanelRole = _interopRequireDefault(tabpanelRole_1);
  var _termRole = _interopRequireDefault(termRole_1);
  var _textboxRole = _interopRequireDefault(textboxRole_1);
  var _timeRole = _interopRequireDefault(timeRole_1);
  var _timerRole = _interopRequireDefault(timerRole_1);
  var _toolbarRole = _interopRequireDefault(toolbarRole_1);
  var _tooltipRole = _interopRequireDefault(tooltipRole_1);
  var _treeRole = _interopRequireDefault(treeRole_1);
  var _treegridRole = _interopRequireDefault(treegridRole_1);
  var _treeitemRole = _interopRequireDefault(treeitemRole_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var ariaLiteralRoles = [["alert", _alertRole.default], ["alertdialog", _alertdialogRole.default], ["application", _applicationRole.default], ["article", _articleRole.default], ["banner", _bannerRole.default], ["blockquote", _blockquoteRole.default], ["button", _buttonRole.default], ["caption", _captionRole.default], ["cell", _cellRole.default], ["checkbox", _checkboxRole.default], ["code", _codeRole.default], ["columnheader", _columnheaderRole.default], ["combobox", _comboboxRole.default], ["complementary", _complementaryRole.default], ["contentinfo", _contentinfoRole.default], ["definition", _definitionRole.default], ["deletion", _deletionRole.default], ["dialog", _dialogRole.default], ["directory", _directoryRole.default], ["document", _documentRole.default], ["emphasis", _emphasisRole.default], ["feed", _feedRole.default], ["figure", _figureRole.default], ["form", _formRole.default], ["generic", _genericRole.default], ["grid", _gridRole.default], ["gridcell", _gridcellRole.default], ["group", _groupRole.default], ["heading", _headingRole.default], ["img", _imgRole.default], ["insertion", _insertionRole.default], ["link", _linkRole.default], ["list", _listRole.default], ["listbox", _listboxRole.default], ["listitem", _listitemRole.default], ["log", _logRole.default], ["main", _mainRole.default], ["marquee", _marqueeRole.default], ["math", _mathRole.default], ["menu", _menuRole.default], ["menubar", _menubarRole.default], ["menuitem", _menuitemRole.default], ["menuitemcheckbox", _menuitemcheckboxRole.default], ["menuitemradio", _menuitemradioRole.default], ["meter", _meterRole.default], ["navigation", _navigationRole.default], ["none", _noneRole.default], ["note", _noteRole.default], ["option", _optionRole.default], ["paragraph", _paragraphRole.default], ["presentation", _presentationRole.default], ["progressbar", _progressbarRole.default], ["radio", _radioRole.default], ["radiogroup", _radiogroupRole.default], ["region", _regionRole.default], ["row", _rowRole.default], ["rowgroup", _rowgroupRole.default], ["rowheader", _rowheaderRole.default], ["scrollbar", _scrollbarRole.default], ["search", _searchRole.default], ["searchbox", _searchboxRole.default], ["separator", _separatorRole.default], ["slider", _sliderRole.default], ["spinbutton", _spinbuttonRole.default], ["status", _statusRole.default], ["strong", _strongRole.default], ["subscript", _subscriptRole.default], ["superscript", _superscriptRole.default], ["switch", _switchRole.default], ["tab", _tabRole.default], ["table", _tableRole.default], ["tablist", _tablistRole.default], ["tabpanel", _tabpanelRole.default], ["term", _termRole.default], ["textbox", _textboxRole.default], ["time", _timeRole.default], ["timer", _timerRole.default], ["toolbar", _toolbarRole.default], ["tooltip", _tooltipRole.default], ["tree", _treeRole.default], ["treegrid", _treegridRole.default], ["treeitem", _treeitemRole.default]];
  var _default2 = ariaLiteralRoles;
  exports.default = _default2;
});
unwrapExports(ariaLiteralRoles_1);
var docAbstractRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docAbstractRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "abstract [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docAbstractRole;
  exports.default = _default2;
});
unwrapExports(docAbstractRole_1);
var docAcknowledgmentsRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docAcknowledgmentsRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "acknowledgments [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docAcknowledgmentsRole;
  exports.default = _default2;
});
unwrapExports(docAcknowledgmentsRole_1);
var docAfterwordRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docAfterwordRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "afterword [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docAfterwordRole;
  exports.default = _default2;
});
unwrapExports(docAfterwordRole_1);
var docAppendixRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docAppendixRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "appendix [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docAppendixRole;
  exports.default = _default2;
});
unwrapExports(docAppendixRole_1);
var docBacklinkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docBacklinkRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "content"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "referrer [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command", "link"]]
  };
  var _default2 = docBacklinkRole;
  exports.default = _default2;
});
unwrapExports(docBacklinkRole_1);
var docBiblioentryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docBiblioentryRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "EPUB biblioentry [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: ["doc-bibliography"],
    requiredContextRole: ["doc-bibliography"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "listitem"]]
  };
  var _default2 = docBiblioentryRole;
  exports.default = _default2;
});
unwrapExports(docBiblioentryRole_1);
var docBibliographyRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docBibliographyRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "bibliography [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["doc-biblioentry"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docBibliographyRole;
  exports.default = _default2;
});
unwrapExports(docBibliographyRole_1);
var docBibliorefRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docBibliorefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "biblioref [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command", "link"]]
  };
  var _default2 = docBibliorefRole;
  exports.default = _default2;
});
unwrapExports(docBibliorefRole_1);
var docChapterRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docChapterRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "chapter [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docChapterRole;
  exports.default = _default2;
});
unwrapExports(docChapterRole_1);
var docColophonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docColophonRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "colophon [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docColophonRole;
  exports.default = _default2;
});
unwrapExports(docColophonRole_1);
var docConclusionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docConclusionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "conclusion [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docConclusionRole;
  exports.default = _default2;
});
unwrapExports(docConclusionRole_1);
var docCoverRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docCoverRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "cover [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "img"]]
  };
  var _default2 = docCoverRole;
  exports.default = _default2;
});
unwrapExports(docCoverRole_1);
var docCreditRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docCreditRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "credit [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docCreditRole;
  exports.default = _default2;
});
unwrapExports(docCreditRole_1);
var docCreditsRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docCreditsRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "credits [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docCreditsRole;
  exports.default = _default2;
});
unwrapExports(docCreditsRole_1);
var docDedicationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docDedicationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "dedication [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docDedicationRole;
  exports.default = _default2;
});
unwrapExports(docDedicationRole_1);
var docEndnoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docEndnoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "rearnote [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: ["doc-endnotes"],
    requiredContextRole: ["doc-endnotes"],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "listitem"]]
  };
  var _default2 = docEndnoteRole;
  exports.default = _default2;
});
unwrapExports(docEndnoteRole_1);
var docEndnotesRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docEndnotesRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "rearnotes [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["doc-endnote"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docEndnotesRole;
  exports.default = _default2;
});
unwrapExports(docEndnotesRole_1);
var docEpigraphRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docEpigraphRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "epigraph [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docEpigraphRole;
  exports.default = _default2;
});
unwrapExports(docEpigraphRole_1);
var docEpilogueRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docEpilogueRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "epilogue [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docEpilogueRole;
  exports.default = _default2;
});
unwrapExports(docEpilogueRole_1);
var docErrataRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docErrataRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "errata [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docErrataRole;
  exports.default = _default2;
});
unwrapExports(docErrataRole_1);
var docExampleRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docExampleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docExampleRole;
  exports.default = _default2;
});
unwrapExports(docExampleRole_1);
var docFootnoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docFootnoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "footnote [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docFootnoteRole;
  exports.default = _default2;
});
unwrapExports(docFootnoteRole_1);
var docForewordRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docForewordRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "foreword [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docForewordRole;
  exports.default = _default2;
});
unwrapExports(docForewordRole_1);
var docGlossaryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docGlossaryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "glossary [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [["definition"], ["term"]],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docGlossaryRole;
  exports.default = _default2;
});
unwrapExports(docGlossaryRole_1);
var docGlossrefRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docGlossrefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "glossref [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command", "link"]]
  };
  var _default2 = docGlossrefRole;
  exports.default = _default2;
});
unwrapExports(docGlossrefRole_1);
var docIndexRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docIndexRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "index [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
  };
  var _default2 = docIndexRole;
  exports.default = _default2;
});
unwrapExports(docIndexRole_1);
var docIntroductionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docIntroductionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "introduction [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docIntroductionRole;
  exports.default = _default2;
});
unwrapExports(docIntroductionRole_1);
var docNoterefRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docNoterefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author", "contents"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "noteref [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "widget", "command", "link"]]
  };
  var _default2 = docNoterefRole;
  exports.default = _default2;
});
unwrapExports(docNoterefRole_1);
var docNoticeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docNoticeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "notice [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "note"]]
  };
  var _default2 = docNoticeRole;
  exports.default = _default2;
});
unwrapExports(docNoticeRole_1);
var docPagebreakRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPagebreakRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "pagebreak [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "separator"]]
  };
  var _default2 = docPagebreakRole;
  exports.default = _default2;
});
unwrapExports(docPagebreakRole_1);
var docPagelistRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPagelistRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "page-list [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
  };
  var _default2 = docPagelistRole;
  exports.default = _default2;
});
unwrapExports(docPagelistRole_1);
var docPartRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPartRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "part [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docPartRole;
  exports.default = _default2;
});
unwrapExports(docPartRole_1);
var docPrefaceRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPrefaceRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "preface [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docPrefaceRole;
  exports.default = _default2;
});
unwrapExports(docPrefaceRole_1);
var docPrologueRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPrologueRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "prologue [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark"]]
  };
  var _default2 = docPrologueRole;
  exports.default = _default2;
});
unwrapExports(docPrologueRole_1);
var docPullquoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docPullquoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: "pullquote [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["none"]]
  };
  var _default2 = docPullquoteRole;
  exports.default = _default2;
});
unwrapExports(docPullquoteRole_1);
var docQnaRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docQnaRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "qna [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section"]]
  };
  var _default2 = docQnaRole;
  exports.default = _default2;
});
unwrapExports(docQnaRole_1);
var docSubtitleRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docSubtitleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "subtitle [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "sectionhead"]]
  };
  var _default2 = docSubtitleRole;
  exports.default = _default2;
});
unwrapExports(docSubtitleRole_1);
var docTipRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docTipRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "help [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "note"]]
  };
  var _default2 = docTipRole;
  exports.default = _default2;
});
unwrapExports(docTipRole_1);
var docTocRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var docTocRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ["author"],
    prohibitedProps: [],
    props: {
      "aria-disabled": null,
      "aria-errormessage": null,
      "aria-expanded": null,
      "aria-haspopup": null,
      "aria-invalid": null
    },
    relatedConcepts: [{
      concept: {
        name: "toc [EPUB-SSV]"
      },
      module: "EPUB"
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
  };
  var _default2 = docTocRole;
  exports.default = _default2;
});
unwrapExports(docTocRole_1);
var ariaDpubRoles_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _docAbstractRole = _interopRequireDefault(docAbstractRole_1);
  var _docAcknowledgmentsRole = _interopRequireDefault(docAcknowledgmentsRole_1);
  var _docAfterwordRole = _interopRequireDefault(docAfterwordRole_1);
  var _docAppendixRole = _interopRequireDefault(docAppendixRole_1);
  var _docBacklinkRole = _interopRequireDefault(docBacklinkRole_1);
  var _docBiblioentryRole = _interopRequireDefault(docBiblioentryRole_1);
  var _docBibliographyRole = _interopRequireDefault(docBibliographyRole_1);
  var _docBibliorefRole = _interopRequireDefault(docBibliorefRole_1);
  var _docChapterRole = _interopRequireDefault(docChapterRole_1);
  var _docColophonRole = _interopRequireDefault(docColophonRole_1);
  var _docConclusionRole = _interopRequireDefault(docConclusionRole_1);
  var _docCoverRole = _interopRequireDefault(docCoverRole_1);
  var _docCreditRole = _interopRequireDefault(docCreditRole_1);
  var _docCreditsRole = _interopRequireDefault(docCreditsRole_1);
  var _docDedicationRole = _interopRequireDefault(docDedicationRole_1);
  var _docEndnoteRole = _interopRequireDefault(docEndnoteRole_1);
  var _docEndnotesRole = _interopRequireDefault(docEndnotesRole_1);
  var _docEpigraphRole = _interopRequireDefault(docEpigraphRole_1);
  var _docEpilogueRole = _interopRequireDefault(docEpilogueRole_1);
  var _docErrataRole = _interopRequireDefault(docErrataRole_1);
  var _docExampleRole = _interopRequireDefault(docExampleRole_1);
  var _docFootnoteRole = _interopRequireDefault(docFootnoteRole_1);
  var _docForewordRole = _interopRequireDefault(docForewordRole_1);
  var _docGlossaryRole = _interopRequireDefault(docGlossaryRole_1);
  var _docGlossrefRole = _interopRequireDefault(docGlossrefRole_1);
  var _docIndexRole = _interopRequireDefault(docIndexRole_1);
  var _docIntroductionRole = _interopRequireDefault(docIntroductionRole_1);
  var _docNoterefRole = _interopRequireDefault(docNoterefRole_1);
  var _docNoticeRole = _interopRequireDefault(docNoticeRole_1);
  var _docPagebreakRole = _interopRequireDefault(docPagebreakRole_1);
  var _docPagelistRole = _interopRequireDefault(docPagelistRole_1);
  var _docPartRole = _interopRequireDefault(docPartRole_1);
  var _docPrefaceRole = _interopRequireDefault(docPrefaceRole_1);
  var _docPrologueRole = _interopRequireDefault(docPrologueRole_1);
  var _docPullquoteRole = _interopRequireDefault(docPullquoteRole_1);
  var _docQnaRole = _interopRequireDefault(docQnaRole_1);
  var _docSubtitleRole = _interopRequireDefault(docSubtitleRole_1);
  var _docTipRole = _interopRequireDefault(docTipRole_1);
  var _docTocRole = _interopRequireDefault(docTocRole_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var ariaDpubRoles = [["doc-abstract", _docAbstractRole.default], ["doc-acknowledgments", _docAcknowledgmentsRole.default], ["doc-afterword", _docAfterwordRole.default], ["doc-appendix", _docAppendixRole.default], ["doc-backlink", _docBacklinkRole.default], ["doc-biblioentry", _docBiblioentryRole.default], ["doc-bibliography", _docBibliographyRole.default], ["doc-biblioref", _docBibliorefRole.default], ["doc-chapter", _docChapterRole.default], ["doc-colophon", _docColophonRole.default], ["doc-conclusion", _docConclusionRole.default], ["doc-cover", _docCoverRole.default], ["doc-credit", _docCreditRole.default], ["doc-credits", _docCreditsRole.default], ["doc-dedication", _docDedicationRole.default], ["doc-endnote", _docEndnoteRole.default], ["doc-endnotes", _docEndnotesRole.default], ["doc-epigraph", _docEpigraphRole.default], ["doc-epilogue", _docEpilogueRole.default], ["doc-errata", _docErrataRole.default], ["doc-example", _docExampleRole.default], ["doc-footnote", _docFootnoteRole.default], ["doc-foreword", _docForewordRole.default], ["doc-glossary", _docGlossaryRole.default], ["doc-glossref", _docGlossrefRole.default], ["doc-index", _docIndexRole.default], ["doc-introduction", _docIntroductionRole.default], ["doc-noteref", _docNoterefRole.default], ["doc-notice", _docNoticeRole.default], ["doc-pagebreak", _docPagebreakRole.default], ["doc-pagelist", _docPagelistRole.default], ["doc-part", _docPartRole.default], ["doc-preface", _docPrefaceRole.default], ["doc-prologue", _docPrologueRole.default], ["doc-pullquote", _docPullquoteRole.default], ["doc-qna", _docQnaRole.default], ["doc-subtitle", _docSubtitleRole.default], ["doc-tip", _docTipRole.default], ["doc-toc", _docTocRole.default]];
  var _default2 = ariaDpubRoles;
  exports.default = _default2;
});
unwrapExports(ariaDpubRoles_1);
var rolesMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _ariaAbstractRoles = _interopRequireDefault(ariaAbstractRoles_1);
  var _ariaLiteralRoles = _interopRequireDefault(ariaLiteralRoles_1);
  var _ariaDpubRoles = _interopRequireDefault(ariaDpubRoles_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _defineProperty(obj, key, value2) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value: value2, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value2;
    }
    return obj;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F2 = function F3() {
        };
        return { s: F2, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F2 };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e3) {
      didErr = true;
      err = _e3;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var roles2 = [].concat(_ariaAbstractRoles.default, _ariaLiteralRoles.default, _ariaDpubRoles.default);
  roles2.forEach(function(_ref) {
    var _ref2 = _slicedToArray(_ref, 2), roleDefinition = _ref2[1];
    var _iterator = _createForOfIteratorHelper(roleDefinition.superClass), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var superClassIter = _step.value;
        var _iterator2 = _createForOfIteratorHelper(superClassIter), _step2;
        try {
          var _loop = function _loop2() {
            var superClassName = _step2.value;
            var superClassRoleTuple = roles2.find(function(_ref3) {
              var _ref4 = _slicedToArray(_ref3, 1), name = _ref4[0];
              return name === superClassName;
            });
            if (superClassRoleTuple) {
              var superClassDefinition = superClassRoleTuple[1];
              for (var _i2 = 0, _Object$keys = Object.keys(superClassDefinition.props); _i2 < _Object$keys.length; _i2++) {
                var prop = _Object$keys[_i2];
                if (!Object.prototype.hasOwnProperty.call(roleDefinition.props, prop)) {
                  Object.assign(roleDefinition.props, _defineProperty({}, prop, superClassDefinition.props[prop]));
                }
              }
            }
          };
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            _loop();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  var rolesMap = {
    entries: function entries() {
      return roles2;
    },
    get: function get(key) {
      var item = roles2.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return roles2.map(function(_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1), key = _ref6[0];
        return key;
      });
    },
    values: function values() {
      return roles2.map(function(_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2), values2 = _ref8[1];
        return values2;
      });
    }
  };
  var _default2 = rolesMap;
  exports.default = _default2;
});
unwrapExports(rolesMap_1);
var elementRoleMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _rolesMap = _interopRequireDefault(rolesMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i2) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
      arr2[i2] = arr[i2];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i2) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i2 && _arr.length === i2)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var elementRoles = [];
  var keys = _rolesMap.default.keys();
  for (var i = 0; i < keys.length; i++) {
    var _key = keys[i];
    var role = _rolesMap.default.get(_key);
    if (role) {
      var concepts = [].concat(role.baseConcepts, role.relatedConcepts);
      for (var k = 0; k < concepts.length; k++) {
        var relation = concepts[k];
        if (relation.module === "HTML") {
          var concept = relation.concept;
          if (concept) {
            (function() {
              var conceptStr = JSON.stringify(concept);
              var elementRoleRelation = elementRoles.find(function(relation2) {
                return JSON.stringify(relation2[0]) === conceptStr;
              });
              var roles2 = void 0;
              if (elementRoleRelation) {
                roles2 = elementRoleRelation[1];
              } else {
                roles2 = [];
              }
              var isUnique = true;
              for (var _i = 0; _i < roles2.length; _i++) {
                if (roles2[_i] === _key) {
                  isUnique = false;
                  break;
                }
              }
              if (isUnique) {
                roles2.push(_key);
              }
              elementRoles.push([concept, roles2]);
            })();
          }
        }
      }
    }
  }
  var elementRoleMap = {
    entries: function entries() {
      return elementRoles;
    },
    get: function get(key) {
      var item = elementRoles.find(function(tuple) {
        return JSON.stringify(tuple[0]) === JSON.stringify(key) ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys2() {
      return elementRoles.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return elementRoles.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = elementRoleMap;
  exports.default = _default2;
});
unwrapExports(elementRoleMap_1);
var roleElementMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _rolesMap = _interopRequireDefault(rolesMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i2) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
      arr2[i2] = arr[i2];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i2) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i2 && _arr.length === i2)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var roleElement = [];
  var keys = _rolesMap.default.keys();
  var _loop = function _loop2(i2) {
    var key = keys[i2];
    var role = _rolesMap.default.get(key);
    if (role) {
      var concepts = [].concat(role.baseConcepts, role.relatedConcepts);
      for (var k = 0; k < concepts.length; k++) {
        var relation = concepts[k];
        if (relation.module === "HTML") {
          var concept = relation.concept;
          if (concept) {
            var roleElementRelation = roleElement.find(function(item) {
              return item[0] === key;
            });
            var relationConcepts = void 0;
            if (roleElementRelation) {
              relationConcepts = roleElementRelation[1];
            } else {
              relationConcepts = [];
            }
            relationConcepts.push(concept);
            roleElement.push([key, relationConcepts]);
          }
        }
      }
    }
  };
  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }
  var roleElementMap = {
    entries: function entries() {
      return roleElement;
    },
    get: function get(key) {
      var item = roleElement.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys2() {
      return roleElement.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return roleElement.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = roleElementMap;
  exports.default = _default2;
});
unwrapExports(roleElementMap_1);
var lib = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.roleElements = exports.elementRoles = exports.roles = exports.dom = exports.aria = void 0;
  var _ariaPropsMap = _interopRequireDefault(ariaPropsMap_1);
  var _domMap = _interopRequireDefault(domMap_1);
  var _rolesMap = _interopRequireDefault(rolesMap_1);
  var _elementRoleMap = _interopRequireDefault(elementRoleMap_1);
  var _roleElementMap = _interopRequireDefault(roleElementMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var aria = _ariaPropsMap.default;
  exports.aria = aria;
  var dom = _domMap.default;
  exports.dom = dom;
  var roles2 = _rolesMap.default;
  exports.roles = roles2;
  var elementRoles = _elementRoleMap.default;
  exports.elementRoles = elementRoles;
  var roleElements = _roleElementMap.default;
  exports.roleElements = roleElements;
});
unwrapExports(lib);
lib.roleElements;
var lib_2 = lib.elementRoles;
var lib_3 = lib.roles;
lib.dom;
lib.aria;
var AbbrRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var AbbrRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "abbr"
      }
    }],
    type: "structure"
  };
  var _default2 = AbbrRole;
  exports.default = _default2;
});
unwrapExports(AbbrRole_1);
var AlertDialogRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var AlertDialogRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "alertdialog"
      }
    }],
    type: "window"
  };
  var _default2 = AlertDialogRole;
  exports.default = _default2;
});
unwrapExports(AlertDialogRole_1);
var AlertRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var AlertRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "alert"
      }
    }],
    type: "structure"
  };
  var _default2 = AlertRole;
  exports.default = _default2;
});
unwrapExports(AlertRole_1);
var AnnotationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var AnnotationRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = AnnotationRole;
  exports.default = _default2;
});
unwrapExports(AnnotationRole_1);
var ApplicationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ApplicationRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "application"
      }
    }],
    type: "window"
  };
  var _default2 = ApplicationRole;
  exports.default = _default2;
});
unwrapExports(ApplicationRole_1);
var ArticleRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ArticleRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "article"
      }
    }, {
      module: "HTML",
      concept: {
        name: "article"
      }
    }],
    type: "structure"
  };
  var _default2 = ArticleRole;
  exports.default = _default2;
});
unwrapExports(ArticleRole_1);
var AudioRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var AudioRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "audio"
      }
    }],
    type: "widget"
  };
  var _default2 = AudioRole;
  exports.default = _default2;
});
unwrapExports(AudioRole_1);
var BannerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var BannerRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "banner"
      }
    }],
    type: "structure"
  };
  var _default2 = BannerRole;
  exports.default = _default2;
});
unwrapExports(BannerRole_1);
var BlockquoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var BlockquoteRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "blockquote"
      }
    }],
    type: "structure"
  };
  var _default2 = BlockquoteRole;
  exports.default = _default2;
});
unwrapExports(BlockquoteRole_1);
var BusyIndicatorRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var BusyIndicatorRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        attributes: [{
          name: "aria-busy",
          value: "true"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = BusyIndicatorRole;
  exports.default = _default2;
});
unwrapExports(BusyIndicatorRole_1);
var ButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ButtonRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "button"
      }
    }, {
      module: "HTML",
      concept: {
        name: "button"
      }
    }],
    type: "widget"
  };
  var _default2 = ButtonRole;
  exports.default = _default2;
});
unwrapExports(ButtonRole_1);
var CanvasRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var CanvasRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "canvas"
      }
    }],
    type: "widget"
  };
  var _default2 = CanvasRole;
  exports.default = _default2;
});
unwrapExports(CanvasRole_1);
var CaptionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var CaptionRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "caption"
      }
    }],
    type: "structure"
  };
  var _default2 = CaptionRole;
  exports.default = _default2;
});
unwrapExports(CaptionRole_1);
var CellRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var CellRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "cell"
      }
    }, {
      module: "ARIA",
      concept: {
        name: "gridcell"
      }
    }, {
      module: "HTML",
      concept: {
        name: "td"
      }
    }],
    type: "widget"
  };
  var _default2 = CellRole;
  exports.default = _default2;
});
unwrapExports(CellRole_1);
var CheckBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var CheckBoxRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "checkbox"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "checkbox"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = CheckBoxRole;
  exports.default = _default2;
});
unwrapExports(CheckBoxRole_1);
var ColorWellRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ColorWellRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "color"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = ColorWellRole;
  exports.default = _default2;
});
unwrapExports(ColorWellRole_1);
var ColumnHeaderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ColumnHeaderRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "columnheader"
      }
    }, {
      module: "HTML",
      concept: {
        name: "th"
      }
    }],
    type: "widget"
  };
  var _default2 = ColumnHeaderRole;
  exports.default = _default2;
});
unwrapExports(ColumnHeaderRole_1);
var ColumnRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ColumnRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = ColumnRole;
  exports.default = _default2;
});
unwrapExports(ColumnRole_1);
var ComboBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ComboBoxRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "combobox"
      }
    }, {
      module: "HTML",
      concept: {
        name: "select"
      }
    }],
    type: "widget"
  };
  var _default2 = ComboBoxRole;
  exports.default = _default2;
});
unwrapExports(ComboBoxRole_1);
var ComplementaryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ComplementaryRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "complementary"
      }
    }],
    type: "structure"
  };
  var _default2 = ComplementaryRole;
  exports.default = _default2;
});
unwrapExports(ComplementaryRole_1);
var ContentInfoRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ContentInfoRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "structureinfo"
      }
    }],
    type: "structure"
  };
  var _default2 = ContentInfoRole;
  exports.default = _default2;
});
unwrapExports(ContentInfoRole_1);
var DateRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DateRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "date"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = DateRole;
  exports.default = _default2;
});
unwrapExports(DateRole_1);
var DateTimeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DateTimeRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "datetime"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = DateTimeRole;
  exports.default = _default2;
});
unwrapExports(DateTimeRole_1);
var DefinitionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DefinitionRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "dfn"
      }
    }],
    type: "structure"
  };
  var _default2 = DefinitionRole;
  exports.default = _default2;
});
unwrapExports(DefinitionRole_1);
var DescriptionListDetailRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DescriptionListDetailRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "dd"
      }
    }],
    type: "structure"
  };
  var _default2 = DescriptionListDetailRole;
  exports.default = _default2;
});
unwrapExports(DescriptionListDetailRole_1);
var DescriptionListRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DescriptionListRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "dl"
      }
    }],
    type: "structure"
  };
  var _default2 = DescriptionListRole;
  exports.default = _default2;
});
unwrapExports(DescriptionListRole_1);
var DescriptionListTermRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DescriptionListTermRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "dt"
      }
    }],
    type: "structure"
  };
  var _default2 = DescriptionListTermRole;
  exports.default = _default2;
});
unwrapExports(DescriptionListTermRole_1);
var DetailsRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DetailsRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "details"
      }
    }],
    type: "structure"
  };
  var _default2 = DetailsRole;
  exports.default = _default2;
});
unwrapExports(DetailsRole_1);
var DialogRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DialogRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "dialog"
      }
    }, {
      module: "HTML",
      concept: {
        name: "dialog"
      }
    }],
    type: "window"
  };
  var _default2 = DialogRole;
  exports.default = _default2;
});
unwrapExports(DialogRole_1);
var DirectoryRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DirectoryRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "directory"
      }
    }, {
      module: "HTML",
      concept: {
        name: "dir"
      }
    }],
    type: "structure"
  };
  var _default2 = DirectoryRole;
  exports.default = _default2;
});
unwrapExports(DirectoryRole_1);
var DisclosureTriangleRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DisclosureTriangleRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "summary"
      }
    }],
    type: "widget"
  };
  var _default2 = DisclosureTriangleRole;
  exports.default = _default2;
});
unwrapExports(DisclosureTriangleRole_1);
var DivRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DivRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "div"
      }
    }],
    type: "generic"
  };
  var _default2 = DivRole;
  exports.default = _default2;
});
unwrapExports(DivRole_1);
var DocumentRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var DocumentRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "document"
      }
    }],
    type: "structure"
  };
  var _default2 = DocumentRole;
  exports.default = _default2;
});
unwrapExports(DocumentRole_1);
var EmbeddedObjectRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var EmbeddedObjectRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "embed"
      }
    }],
    type: "widget"
  };
  var _default2 = EmbeddedObjectRole;
  exports.default = _default2;
});
unwrapExports(EmbeddedObjectRole_1);
var FeedRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var FeedRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "feed"
      }
    }],
    type: "structure"
  };
  var _default2 = FeedRole;
  exports.default = _default2;
});
unwrapExports(FeedRole_1);
var FigcaptionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var FigcaptionRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "figcaption"
      }
    }],
    type: "structure"
  };
  var _default2 = FigcaptionRole;
  exports.default = _default2;
});
unwrapExports(FigcaptionRole_1);
var FigureRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var FigureRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "figure"
      }
    }, {
      module: "HTML",
      concept: {
        name: "figure"
      }
    }],
    type: "structure"
  };
  var _default2 = FigureRole;
  exports.default = _default2;
});
unwrapExports(FigureRole_1);
var FooterRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var FooterRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "footer"
      }
    }],
    type: "structure"
  };
  var _default2 = FooterRole;
  exports.default = _default2;
});
unwrapExports(FooterRole_1);
var FormRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var FormRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "form"
      }
    }, {
      module: "HTML",
      concept: {
        name: "form"
      }
    }],
    type: "structure"
  };
  var _default2 = FormRole;
  exports.default = _default2;
});
unwrapExports(FormRole_1);
var GridRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var GridRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "grid"
      }
    }],
    type: "widget"
  };
  var _default2 = GridRole;
  exports.default = _default2;
});
unwrapExports(GridRole_1);
var GroupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var GroupRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "group"
      }
    }],
    type: "structure"
  };
  var _default2 = GroupRole;
  exports.default = _default2;
});
unwrapExports(GroupRole_1);
var HeadingRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var HeadingRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "heading"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h1"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h2"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h3"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h4"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h5"
      }
    }, {
      module: "HTML",
      concept: {
        name: "h6"
      }
    }],
    type: "structure"
  };
  var _default2 = HeadingRole;
  exports.default = _default2;
});
unwrapExports(HeadingRole_1);
var IframePresentationalRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var IframePresentationalRole = {
    relatedConcepts: [],
    type: "window"
  };
  var _default2 = IframePresentationalRole;
  exports.default = _default2;
});
unwrapExports(IframePresentationalRole_1);
var IframeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var IframeRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "iframe"
      }
    }],
    type: "window"
  };
  var _default2 = IframeRole;
  exports.default = _default2;
});
unwrapExports(IframeRole_1);
var IgnoredRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var IgnoredRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = IgnoredRole;
  exports.default = _default2;
});
unwrapExports(IgnoredRole_1);
var ImageMapLinkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ImageMapLinkRole = {
    relatedConcepts: [],
    type: "widget"
  };
  var _default2 = ImageMapLinkRole;
  exports.default = _default2;
});
unwrapExports(ImageMapLinkRole_1);
var ImageMapRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ImageMapRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "img",
        attributes: [{
          name: "usemap"
        }]
      }
    }],
    type: "structure"
  };
  var _default2 = ImageMapRole;
  exports.default = _default2;
});
unwrapExports(ImageMapRole_1);
var ImageRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ImageRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "img"
      }
    }, {
      module: "HTML",
      concept: {
        name: "img"
      }
    }],
    type: "structure"
  };
  var _default2 = ImageRole;
  exports.default = _default2;
});
unwrapExports(ImageRole_1);
var InlineTextBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var InlineTextBoxRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "input"
      }
    }],
    type: "widget"
  };
  var _default2 = InlineTextBoxRole;
  exports.default = _default2;
});
unwrapExports(InlineTextBoxRole_1);
var InputTimeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var InputTimeRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "time"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = InputTimeRole;
  exports.default = _default2;
});
unwrapExports(InputTimeRole_1);
var LabelRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var LabelRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "label"
      }
    }],
    type: "structure"
  };
  var _default2 = LabelRole;
  exports.default = _default2;
});
unwrapExports(LabelRole_1);
var LegendRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var LegendRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "legend"
      }
    }],
    type: "structure"
  };
  var _default2 = LegendRole;
  exports.default = _default2;
});
unwrapExports(LegendRole_1);
var LineBreakRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var LineBreakRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "br"
      }
    }],
    type: "structure"
  };
  var _default2 = LineBreakRole;
  exports.default = _default2;
});
unwrapExports(LineBreakRole_1);
var LinkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var LinkRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "link"
      }
    }, {
      module: "HTML",
      concept: {
        name: "a",
        attributes: [{
          name: "href"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = LinkRole;
  exports.default = _default2;
});
unwrapExports(LinkRole_1);
var ListBoxOptionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ListBoxOptionRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "option"
      }
    }, {
      module: "HTML",
      concept: {
        name: "option"
      }
    }],
    type: "widget"
  };
  var _default2 = ListBoxOptionRole;
  exports.default = _default2;
});
unwrapExports(ListBoxOptionRole_1);
var ListBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ListBoxRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "listbox"
      }
    }, {
      module: "HTML",
      concept: {
        name: "datalist"
      }
    }, {
      module: "HTML",
      concept: {
        name: "select"
      }
    }],
    type: "widget"
  };
  var _default2 = ListBoxRole;
  exports.default = _default2;
});
unwrapExports(ListBoxRole_1);
var ListItemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ListItemRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "listitem"
      }
    }, {
      module: "HTML",
      concept: {
        name: "li"
      }
    }],
    type: "structure"
  };
  var _default2 = ListItemRole;
  exports.default = _default2;
});
unwrapExports(ListItemRole_1);
var ListMarkerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ListMarkerRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = ListMarkerRole;
  exports.default = _default2;
});
unwrapExports(ListMarkerRole_1);
var ListRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ListRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "list"
      }
    }, {
      module: "HTML",
      concept: {
        name: "ul"
      }
    }, {
      module: "HTML",
      concept: {
        name: "ol"
      }
    }],
    type: "structure"
  };
  var _default2 = ListRole;
  exports.default = _default2;
});
unwrapExports(ListRole_1);
var LogRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var LogRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "log"
      }
    }],
    type: "structure"
  };
  var _default2 = LogRole;
  exports.default = _default2;
});
unwrapExports(LogRole_1);
var MainRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MainRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "main"
      }
    }, {
      module: "HTML",
      concept: {
        name: "main"
      }
    }],
    type: "structure"
  };
  var _default2 = MainRole;
  exports.default = _default2;
});
unwrapExports(MainRole_1);
var MarkRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MarkRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "mark"
      }
    }],
    type: "structure"
  };
  var _default2 = MarkRole;
  exports.default = _default2;
});
unwrapExports(MarkRole_1);
var MarqueeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MarqueeRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "marquee"
      }
    }, {
      module: "HTML",
      concept: {
        name: "marquee"
      }
    }],
    type: "structure"
  };
  var _default2 = MarqueeRole;
  exports.default = _default2;
});
unwrapExports(MarqueeRole_1);
var MathRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MathRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "math"
      }
    }],
    type: "structure"
  };
  var _default2 = MathRole;
  exports.default = _default2;
});
unwrapExports(MathRole_1);
var MenuBarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuBarRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "menubar"
      }
    }],
    type: "structure"
  };
  var _default2 = MenuBarRole;
  exports.default = _default2;
});
unwrapExports(MenuBarRole_1);
var MenuButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuButtonRole = {
    relatedConcepts: [],
    type: "widget"
  };
  var _default2 = MenuButtonRole;
  exports.default = _default2;
});
unwrapExports(MenuButtonRole_1);
var MenuItemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuItemRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "menuitem"
      }
    }, {
      module: "HTML",
      concept: {
        name: "menuitem"
      }
    }],
    type: "widget"
  };
  var _default2 = MenuItemRole;
  exports.default = _default2;
});
unwrapExports(MenuItemRole_1);
var MenuItemCheckBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuItemCheckBoxRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "menuitemcheckbox"
      }
    }],
    type: "widget"
  };
  var _default2 = MenuItemCheckBoxRole;
  exports.default = _default2;
});
unwrapExports(MenuItemCheckBoxRole_1);
var MenuItemRadioRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuItemRadioRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "menuitemradio"
      }
    }],
    type: "widget"
  };
  var _default2 = MenuItemRadioRole;
  exports.default = _default2;
});
unwrapExports(MenuItemRadioRole_1);
var MenuListOptionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuListOptionRole = {
    relatedConcepts: [],
    type: "widget"
  };
  var _default2 = MenuListOptionRole;
  exports.default = _default2;
});
unwrapExports(MenuListOptionRole_1);
var MenuListPopupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuListPopupRole = {
    relatedConcepts: [],
    type: "widget"
  };
  var _default2 = MenuListPopupRole;
  exports.default = _default2;
});
unwrapExports(MenuListPopupRole_1);
var MenuRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MenuRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "menu"
      }
    }, {
      module: "HTML",
      concept: {
        name: "menu"
      }
    }],
    type: "structure"
  };
  var _default2 = MenuRole;
  exports.default = _default2;
});
unwrapExports(MenuRole_1);
var MeterRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var MeterRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "meter"
      }
    }],
    type: "structure"
  };
  var _default2 = MeterRole;
  exports.default = _default2;
});
unwrapExports(MeterRole_1);
var NavigationRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var NavigationRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "navigation"
      }
    }, {
      module: "HTML",
      concept: {
        name: "nav"
      }
    }],
    type: "structure"
  };
  var _default2 = NavigationRole;
  exports.default = _default2;
});
unwrapExports(NavigationRole_1);
var NoneRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var NoneRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "none"
      }
    }],
    type: "structure"
  };
  var _default2 = NoneRole;
  exports.default = _default2;
});
unwrapExports(NoneRole_1);
var NoteRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var NoteRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "note"
      }
    }],
    type: "structure"
  };
  var _default2 = NoteRole;
  exports.default = _default2;
});
unwrapExports(NoteRole_1);
var OutlineRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var OutlineRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = OutlineRole;
  exports.default = _default2;
});
unwrapExports(OutlineRole_1);
var ParagraphRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ParagraphRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "p"
      }
    }],
    type: "structure"
  };
  var _default2 = ParagraphRole;
  exports.default = _default2;
});
unwrapExports(ParagraphRole_1);
var PopUpButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var PopUpButtonRole = {
    relatedConcepts: [],
    type: "widget"
  };
  var _default2 = PopUpButtonRole;
  exports.default = _default2;
});
unwrapExports(PopUpButtonRole_1);
var PreRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var PreRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "pre"
      }
    }],
    type: "structure"
  };
  var _default2 = PreRole;
  exports.default = _default2;
});
unwrapExports(PreRole_1);
var PresentationalRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var PresentationalRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "presentation"
      }
    }],
    type: "structure"
  };
  var _default2 = PresentationalRole;
  exports.default = _default2;
});
unwrapExports(PresentationalRole_1);
var ProgressIndicatorRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ProgressIndicatorRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "progressbar"
      }
    }, {
      module: "HTML",
      concept: {
        name: "progress"
      }
    }],
    type: "structure"
  };
  var _default2 = ProgressIndicatorRole;
  exports.default = _default2;
});
unwrapExports(ProgressIndicatorRole_1);
var RadioButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RadioButtonRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "radio"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "radio"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = RadioButtonRole;
  exports.default = _default2;
});
unwrapExports(RadioButtonRole_1);
var RadioGroupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RadioGroupRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "radiogroup"
      }
    }],
    type: "structure"
  };
  var _default2 = RadioGroupRole;
  exports.default = _default2;
});
unwrapExports(RadioGroupRole_1);
var RegionRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RegionRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "region"
      }
    }],
    type: "structure"
  };
  var _default2 = RegionRole;
  exports.default = _default2;
});
unwrapExports(RegionRole_1);
var RootWebAreaRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RootWebAreaRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = RootWebAreaRole;
  exports.default = _default2;
});
unwrapExports(RootWebAreaRole_1);
var RowHeaderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RowHeaderRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "rowheader"
      }
    }, {
      module: "HTML",
      concept: {
        name: "th",
        attributes: [{
          name: "scope",
          value: "row"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = RowHeaderRole;
  exports.default = _default2;
});
unwrapExports(RowHeaderRole_1);
var RowRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RowRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "row"
      }
    }, {
      module: "HTML",
      concept: {
        name: "tr"
      }
    }],
    type: "structure"
  };
  var _default2 = RowRole;
  exports.default = _default2;
});
unwrapExports(RowRole_1);
var RubyRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RubyRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "ruby"
      }
    }],
    type: "structure"
  };
  var _default2 = RubyRole;
  exports.default = _default2;
});
unwrapExports(RubyRole_1);
var RulerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var RulerRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = RulerRole;
  exports.default = _default2;
});
unwrapExports(RulerRole_1);
var ScrollAreaRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ScrollAreaRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = ScrollAreaRole;
  exports.default = _default2;
});
unwrapExports(ScrollAreaRole_1);
var ScrollBarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ScrollBarRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "scrollbar"
      }
    }],
    type: "widget"
  };
  var _default2 = ScrollBarRole;
  exports.default = _default2;
});
unwrapExports(ScrollBarRole_1);
var SeamlessWebAreaRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SeamlessWebAreaRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = SeamlessWebAreaRole;
  exports.default = _default2;
});
unwrapExports(SeamlessWebAreaRole_1);
var SearchRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SearchRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "search"
      }
    }],
    type: "structure"
  };
  var _default2 = SearchRole;
  exports.default = _default2;
});
unwrapExports(SearchRole_1);
var SearchBoxRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SearchBoxRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "searchbox"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "search"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = SearchBoxRole;
  exports.default = _default2;
});
unwrapExports(SearchBoxRole_1);
var SliderRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SliderRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "slider"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "range"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = SliderRole;
  exports.default = _default2;
});
unwrapExports(SliderRole_1);
var SliderThumbRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SliderThumbRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = SliderThumbRole;
  exports.default = _default2;
});
unwrapExports(SliderThumbRole_1);
var SpinButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SpinButtonRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "spinbutton"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "number"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = SpinButtonRole;
  exports.default = _default2;
});
unwrapExports(SpinButtonRole_1);
var SpinButtonPartRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SpinButtonPartRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = SpinButtonPartRole;
  exports.default = _default2;
});
unwrapExports(SpinButtonPartRole_1);
var SplitterRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SplitterRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "separator"
      }
    }],
    type: "widget"
  };
  var _default2 = SplitterRole;
  exports.default = _default2;
});
unwrapExports(SplitterRole_1);
var StaticTextRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var StaticTextRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = StaticTextRole;
  exports.default = _default2;
});
unwrapExports(StaticTextRole_1);
var StatusRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var StatusRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "status"
      }
    }],
    type: "structure"
  };
  var _default2 = StatusRole;
  exports.default = _default2;
});
unwrapExports(StatusRole_1);
var SVGRootRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SVGRootRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = SVGRootRole;
  exports.default = _default2;
});
unwrapExports(SVGRootRole_1);
var SwitchRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var SwitchRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "switch"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "checkbox"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = SwitchRole;
  exports.default = _default2;
});
unwrapExports(SwitchRole_1);
var TabGroupRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TabGroupRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tablist"
      }
    }],
    type: "structure"
  };
  var _default2 = TabGroupRole;
  exports.default = _default2;
});
unwrapExports(TabGroupRole_1);
var TabRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TabRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tab"
      }
    }],
    type: "widget"
  };
  var _default2 = TabRole;
  exports.default = _default2;
});
unwrapExports(TabRole_1);
var TableHeaderContainerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TableHeaderContainerRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = TableHeaderContainerRole;
  exports.default = _default2;
});
unwrapExports(TableHeaderContainerRole_1);
var TableRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TableRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "table"
      }
    }, {
      module: "HTML",
      concept: {
        name: "table"
      }
    }],
    type: "structure"
  };
  var _default2 = TableRole;
  exports.default = _default2;
});
unwrapExports(TableRole_1);
var TabListRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TabListRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tablist"
      }
    }],
    type: "structure"
  };
  var _default2 = TabListRole;
  exports.default = _default2;
});
unwrapExports(TabListRole_1);
var TabPanelRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TabPanelRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tabpanel"
      }
    }],
    type: "structure"
  };
  var _default2 = TabPanelRole;
  exports.default = _default2;
});
unwrapExports(TabPanelRole_1);
var TermRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TermRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "term"
      }
    }],
    type: "structure"
  };
  var _default2 = TermRole;
  exports.default = _default2;
});
unwrapExports(TermRole_1);
var TextFieldRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TextFieldRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "textbox"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input"
      }
    }, {
      module: "HTML",
      concept: {
        name: "input",
        attributes: [{
          name: "type",
          value: "text"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = TextFieldRole;
  exports.default = _default2;
});
unwrapExports(TextFieldRole_1);
var TimeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TimeRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "time"
      }
    }],
    type: "structure"
  };
  var _default2 = TimeRole;
  exports.default = _default2;
});
unwrapExports(TimeRole_1);
var TimerRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TimerRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "timer"
      }
    }],
    type: "structure"
  };
  var _default2 = TimerRole;
  exports.default = _default2;
});
unwrapExports(TimerRole_1);
var ToggleButtonRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ToggleButtonRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        attributes: [{
          name: "aria-pressed"
        }]
      }
    }],
    type: "widget"
  };
  var _default2 = ToggleButtonRole;
  exports.default = _default2;
});
unwrapExports(ToggleButtonRole_1);
var ToolbarRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var ToolbarRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "toolbar"
      }
    }],
    type: "structure"
  };
  var _default2 = ToolbarRole;
  exports.default = _default2;
});
unwrapExports(ToolbarRole_1);
var TreeRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TreeRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tree"
      }
    }],
    type: "widget"
  };
  var _default2 = TreeRole;
  exports.default = _default2;
});
unwrapExports(TreeRole_1);
var TreeGridRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TreeGridRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "treegrid"
      }
    }],
    type: "widget"
  };
  var _default2 = TreeGridRole;
  exports.default = _default2;
});
unwrapExports(TreeGridRole_1);
var TreeItemRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var TreeItemRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "treeitem"
      }
    }],
    type: "widget"
  };
  var _default2 = TreeItemRole;
  exports.default = _default2;
});
unwrapExports(TreeItemRole_1);
var UserInterfaceTooltipRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var UserInterfaceTooltipRole = {
    relatedConcepts: [{
      module: "ARIA",
      concept: {
        name: "tooltip"
      }
    }],
    type: "structure"
  };
  var _default2 = UserInterfaceTooltipRole;
  exports.default = _default2;
});
unwrapExports(UserInterfaceTooltipRole_1);
var VideoRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var VideoRole = {
    relatedConcepts: [{
      module: "HTML",
      concept: {
        name: "video"
      }
    }],
    type: "widget"
  };
  var _default2 = VideoRole;
  exports.default = _default2;
});
unwrapExports(VideoRole_1);
var WebAreaRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var WebAreaRole = {
    relatedConcepts: [],
    type: "structure"
  };
  var _default2 = WebAreaRole;
  exports.default = _default2;
});
unwrapExports(WebAreaRole_1);
var WindowRole_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var WindowRole = {
    relatedConcepts: [],
    type: "window"
  };
  var _default2 = WindowRole;
  exports.default = _default2;
});
unwrapExports(WindowRole_1);
var AXObjectsMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _AbbrRole = _interopRequireDefault(AbbrRole_1);
  var _AlertDialogRole = _interopRequireDefault(AlertDialogRole_1);
  var _AlertRole = _interopRequireDefault(AlertRole_1);
  var _AnnotationRole = _interopRequireDefault(AnnotationRole_1);
  var _ApplicationRole = _interopRequireDefault(ApplicationRole_1);
  var _ArticleRole = _interopRequireDefault(ArticleRole_1);
  var _AudioRole = _interopRequireDefault(AudioRole_1);
  var _BannerRole = _interopRequireDefault(BannerRole_1);
  var _BlockquoteRole = _interopRequireDefault(BlockquoteRole_1);
  var _BusyIndicatorRole = _interopRequireDefault(BusyIndicatorRole_1);
  var _ButtonRole = _interopRequireDefault(ButtonRole_1);
  var _CanvasRole = _interopRequireDefault(CanvasRole_1);
  var _CaptionRole = _interopRequireDefault(CaptionRole_1);
  var _CellRole = _interopRequireDefault(CellRole_1);
  var _CheckBoxRole = _interopRequireDefault(CheckBoxRole_1);
  var _ColorWellRole = _interopRequireDefault(ColorWellRole_1);
  var _ColumnHeaderRole = _interopRequireDefault(ColumnHeaderRole_1);
  var _ColumnRole = _interopRequireDefault(ColumnRole_1);
  var _ComboBoxRole = _interopRequireDefault(ComboBoxRole_1);
  var _ComplementaryRole = _interopRequireDefault(ComplementaryRole_1);
  var _ContentInfoRole = _interopRequireDefault(ContentInfoRole_1);
  var _DateRole = _interopRequireDefault(DateRole_1);
  var _DateTimeRole = _interopRequireDefault(DateTimeRole_1);
  var _DefinitionRole = _interopRequireDefault(DefinitionRole_1);
  var _DescriptionListDetailRole = _interopRequireDefault(DescriptionListDetailRole_1);
  var _DescriptionListRole = _interopRequireDefault(DescriptionListRole_1);
  var _DescriptionListTermRole = _interopRequireDefault(DescriptionListTermRole_1);
  var _DetailsRole = _interopRequireDefault(DetailsRole_1);
  var _DialogRole = _interopRequireDefault(DialogRole_1);
  var _DirectoryRole = _interopRequireDefault(DirectoryRole_1);
  var _DisclosureTriangleRole = _interopRequireDefault(DisclosureTriangleRole_1);
  var _DivRole = _interopRequireDefault(DivRole_1);
  var _DocumentRole = _interopRequireDefault(DocumentRole_1);
  var _EmbeddedObjectRole = _interopRequireDefault(EmbeddedObjectRole_1);
  var _FeedRole = _interopRequireDefault(FeedRole_1);
  var _FigcaptionRole = _interopRequireDefault(FigcaptionRole_1);
  var _FigureRole = _interopRequireDefault(FigureRole_1);
  var _FooterRole = _interopRequireDefault(FooterRole_1);
  var _FormRole = _interopRequireDefault(FormRole_1);
  var _GridRole = _interopRequireDefault(GridRole_1);
  var _GroupRole = _interopRequireDefault(GroupRole_1);
  var _HeadingRole = _interopRequireDefault(HeadingRole_1);
  var _IframePresentationalRole = _interopRequireDefault(IframePresentationalRole_1);
  var _IframeRole = _interopRequireDefault(IframeRole_1);
  var _IgnoredRole = _interopRequireDefault(IgnoredRole_1);
  var _ImageMapLinkRole = _interopRequireDefault(ImageMapLinkRole_1);
  var _ImageMapRole = _interopRequireDefault(ImageMapRole_1);
  var _ImageRole = _interopRequireDefault(ImageRole_1);
  var _InlineTextBoxRole = _interopRequireDefault(InlineTextBoxRole_1);
  var _InputTimeRole = _interopRequireDefault(InputTimeRole_1);
  var _LabelRole = _interopRequireDefault(LabelRole_1);
  var _LegendRole = _interopRequireDefault(LegendRole_1);
  var _LineBreakRole = _interopRequireDefault(LineBreakRole_1);
  var _LinkRole = _interopRequireDefault(LinkRole_1);
  var _ListBoxOptionRole = _interopRequireDefault(ListBoxOptionRole_1);
  var _ListBoxRole = _interopRequireDefault(ListBoxRole_1);
  var _ListItemRole = _interopRequireDefault(ListItemRole_1);
  var _ListMarkerRole = _interopRequireDefault(ListMarkerRole_1);
  var _ListRole = _interopRequireDefault(ListRole_1);
  var _LogRole = _interopRequireDefault(LogRole_1);
  var _MainRole = _interopRequireDefault(MainRole_1);
  var _MarkRole = _interopRequireDefault(MarkRole_1);
  var _MarqueeRole = _interopRequireDefault(MarqueeRole_1);
  var _MathRole = _interopRequireDefault(MathRole_1);
  var _MenuBarRole = _interopRequireDefault(MenuBarRole_1);
  var _MenuButtonRole = _interopRequireDefault(MenuButtonRole_1);
  var _MenuItemRole = _interopRequireDefault(MenuItemRole_1);
  var _MenuItemCheckBoxRole = _interopRequireDefault(MenuItemCheckBoxRole_1);
  var _MenuItemRadioRole = _interopRequireDefault(MenuItemRadioRole_1);
  var _MenuListOptionRole = _interopRequireDefault(MenuListOptionRole_1);
  var _MenuListPopupRole = _interopRequireDefault(MenuListPopupRole_1);
  var _MenuRole = _interopRequireDefault(MenuRole_1);
  var _MeterRole = _interopRequireDefault(MeterRole_1);
  var _NavigationRole = _interopRequireDefault(NavigationRole_1);
  var _NoneRole = _interopRequireDefault(NoneRole_1);
  var _NoteRole = _interopRequireDefault(NoteRole_1);
  var _OutlineRole = _interopRequireDefault(OutlineRole_1);
  var _ParagraphRole = _interopRequireDefault(ParagraphRole_1);
  var _PopUpButtonRole = _interopRequireDefault(PopUpButtonRole_1);
  var _PreRole = _interopRequireDefault(PreRole_1);
  var _PresentationalRole = _interopRequireDefault(PresentationalRole_1);
  var _ProgressIndicatorRole = _interopRequireDefault(ProgressIndicatorRole_1);
  var _RadioButtonRole = _interopRequireDefault(RadioButtonRole_1);
  var _RadioGroupRole = _interopRequireDefault(RadioGroupRole_1);
  var _RegionRole = _interopRequireDefault(RegionRole_1);
  var _RootWebAreaRole = _interopRequireDefault(RootWebAreaRole_1);
  var _RowHeaderRole = _interopRequireDefault(RowHeaderRole_1);
  var _RowRole = _interopRequireDefault(RowRole_1);
  var _RubyRole = _interopRequireDefault(RubyRole_1);
  var _RulerRole = _interopRequireDefault(RulerRole_1);
  var _ScrollAreaRole = _interopRequireDefault(ScrollAreaRole_1);
  var _ScrollBarRole = _interopRequireDefault(ScrollBarRole_1);
  var _SeamlessWebAreaRole = _interopRequireDefault(SeamlessWebAreaRole_1);
  var _SearchRole = _interopRequireDefault(SearchRole_1);
  var _SearchBoxRole = _interopRequireDefault(SearchBoxRole_1);
  var _SliderRole = _interopRequireDefault(SliderRole_1);
  var _SliderThumbRole = _interopRequireDefault(SliderThumbRole_1);
  var _SpinButtonRole = _interopRequireDefault(SpinButtonRole_1);
  var _SpinButtonPartRole = _interopRequireDefault(SpinButtonPartRole_1);
  var _SplitterRole = _interopRequireDefault(SplitterRole_1);
  var _StaticTextRole = _interopRequireDefault(StaticTextRole_1);
  var _StatusRole = _interopRequireDefault(StatusRole_1);
  var _SVGRootRole = _interopRequireDefault(SVGRootRole_1);
  var _SwitchRole = _interopRequireDefault(SwitchRole_1);
  var _TabGroupRole = _interopRequireDefault(TabGroupRole_1);
  var _TabRole = _interopRequireDefault(TabRole_1);
  var _TableHeaderContainerRole = _interopRequireDefault(TableHeaderContainerRole_1);
  var _TableRole = _interopRequireDefault(TableRole_1);
  var _TabListRole = _interopRequireDefault(TabListRole_1);
  var _TabPanelRole = _interopRequireDefault(TabPanelRole_1);
  var _TermRole = _interopRequireDefault(TermRole_1);
  var _TextFieldRole = _interopRequireDefault(TextFieldRole_1);
  var _TimeRole = _interopRequireDefault(TimeRole_1);
  var _TimerRole = _interopRequireDefault(TimerRole_1);
  var _ToggleButtonRole = _interopRequireDefault(ToggleButtonRole_1);
  var _ToolbarRole = _interopRequireDefault(ToolbarRole_1);
  var _TreeRole = _interopRequireDefault(TreeRole_1);
  var _TreeGridRole = _interopRequireDefault(TreeGridRole_1);
  var _TreeItemRole = _interopRequireDefault(TreeItemRole_1);
  var _UserInterfaceTooltipRole = _interopRequireDefault(UserInterfaceTooltipRole_1);
  var _VideoRole = _interopRequireDefault(VideoRole_1);
  var _WebAreaRole = _interopRequireDefault(WebAreaRole_1);
  var _WindowRole = _interopRequireDefault(WindowRole_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var AXObjects = [["AbbrRole", _AbbrRole.default], ["AlertDialogRole", _AlertDialogRole.default], ["AlertRole", _AlertRole.default], ["AnnotationRole", _AnnotationRole.default], ["ApplicationRole", _ApplicationRole.default], ["ArticleRole", _ArticleRole.default], ["AudioRole", _AudioRole.default], ["BannerRole", _BannerRole.default], ["BlockquoteRole", _BlockquoteRole.default], ["BusyIndicatorRole", _BusyIndicatorRole.default], ["ButtonRole", _ButtonRole.default], ["CanvasRole", _CanvasRole.default], ["CaptionRole", _CaptionRole.default], ["CellRole", _CellRole.default], ["CheckBoxRole", _CheckBoxRole.default], ["ColorWellRole", _ColorWellRole.default], ["ColumnHeaderRole", _ColumnHeaderRole.default], ["ColumnRole", _ColumnRole.default], ["ComboBoxRole", _ComboBoxRole.default], ["ComplementaryRole", _ComplementaryRole.default], ["ContentInfoRole", _ContentInfoRole.default], ["DateRole", _DateRole.default], ["DateTimeRole", _DateTimeRole.default], ["DefinitionRole", _DefinitionRole.default], ["DescriptionListDetailRole", _DescriptionListDetailRole.default], ["DescriptionListRole", _DescriptionListRole.default], ["DescriptionListTermRole", _DescriptionListTermRole.default], ["DetailsRole", _DetailsRole.default], ["DialogRole", _DialogRole.default], ["DirectoryRole", _DirectoryRole.default], ["DisclosureTriangleRole", _DisclosureTriangleRole.default], ["DivRole", _DivRole.default], ["DocumentRole", _DocumentRole.default], ["EmbeddedObjectRole", _EmbeddedObjectRole.default], ["FeedRole", _FeedRole.default], ["FigcaptionRole", _FigcaptionRole.default], ["FigureRole", _FigureRole.default], ["FooterRole", _FooterRole.default], ["FormRole", _FormRole.default], ["GridRole", _GridRole.default], ["GroupRole", _GroupRole.default], ["HeadingRole", _HeadingRole.default], ["IframePresentationalRole", _IframePresentationalRole.default], ["IframeRole", _IframeRole.default], ["IgnoredRole", _IgnoredRole.default], ["ImageMapLinkRole", _ImageMapLinkRole.default], ["ImageMapRole", _ImageMapRole.default], ["ImageRole", _ImageRole.default], ["InlineTextBoxRole", _InlineTextBoxRole.default], ["InputTimeRole", _InputTimeRole.default], ["LabelRole", _LabelRole.default], ["LegendRole", _LegendRole.default], ["LineBreakRole", _LineBreakRole.default], ["LinkRole", _LinkRole.default], ["ListBoxOptionRole", _ListBoxOptionRole.default], ["ListBoxRole", _ListBoxRole.default], ["ListItemRole", _ListItemRole.default], ["ListMarkerRole", _ListMarkerRole.default], ["ListRole", _ListRole.default], ["LogRole", _LogRole.default], ["MainRole", _MainRole.default], ["MarkRole", _MarkRole.default], ["MarqueeRole", _MarqueeRole.default], ["MathRole", _MathRole.default], ["MenuBarRole", _MenuBarRole.default], ["MenuButtonRole", _MenuButtonRole.default], ["MenuItemRole", _MenuItemRole.default], ["MenuItemCheckBoxRole", _MenuItemCheckBoxRole.default], ["MenuItemRadioRole", _MenuItemRadioRole.default], ["MenuListOptionRole", _MenuListOptionRole.default], ["MenuListPopupRole", _MenuListPopupRole.default], ["MenuRole", _MenuRole.default], ["MeterRole", _MeterRole.default], ["NavigationRole", _NavigationRole.default], ["NoneRole", _NoneRole.default], ["NoteRole", _NoteRole.default], ["OutlineRole", _OutlineRole.default], ["ParagraphRole", _ParagraphRole.default], ["PopUpButtonRole", _PopUpButtonRole.default], ["PreRole", _PreRole.default], ["PresentationalRole", _PresentationalRole.default], ["ProgressIndicatorRole", _ProgressIndicatorRole.default], ["RadioButtonRole", _RadioButtonRole.default], ["RadioGroupRole", _RadioGroupRole.default], ["RegionRole", _RegionRole.default], ["RootWebAreaRole", _RootWebAreaRole.default], ["RowHeaderRole", _RowHeaderRole.default], ["RowRole", _RowRole.default], ["RubyRole", _RubyRole.default], ["RulerRole", _RulerRole.default], ["ScrollAreaRole", _ScrollAreaRole.default], ["ScrollBarRole", _ScrollBarRole.default], ["SeamlessWebAreaRole", _SeamlessWebAreaRole.default], ["SearchRole", _SearchRole.default], ["SearchBoxRole", _SearchBoxRole.default], ["SliderRole", _SliderRole.default], ["SliderThumbRole", _SliderThumbRole.default], ["SpinButtonRole", _SpinButtonRole.default], ["SpinButtonPartRole", _SpinButtonPartRole.default], ["SplitterRole", _SplitterRole.default], ["StaticTextRole", _StaticTextRole.default], ["StatusRole", _StatusRole.default], ["SVGRootRole", _SVGRootRole.default], ["SwitchRole", _SwitchRole.default], ["TabGroupRole", _TabGroupRole.default], ["TabRole", _TabRole.default], ["TableHeaderContainerRole", _TableHeaderContainerRole.default], ["TableRole", _TableRole.default], ["TabListRole", _TabListRole.default], ["TabPanelRole", _TabPanelRole.default], ["TermRole", _TermRole.default], ["TextFieldRole", _TextFieldRole.default], ["TimeRole", _TimeRole.default], ["TimerRole", _TimerRole.default], ["ToggleButtonRole", _ToggleButtonRole.default], ["ToolbarRole", _ToolbarRole.default], ["TreeRole", _TreeRole.default], ["TreeGridRole", _TreeGridRole.default], ["TreeItemRole", _TreeItemRole.default], ["UserInterfaceTooltipRole", _UserInterfaceTooltipRole.default], ["VideoRole", _VideoRole.default], ["WebAreaRole", _WebAreaRole.default], ["WindowRole", _WindowRole.default]];
  var AXObjectsMap = {
    entries: function entries() {
      return AXObjects;
    },
    get: function get(key) {
      var item = AXObjects.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return AXObjects.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return AXObjects.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = AXObjectsMap;
  exports.default = _default2;
});
unwrapExports(AXObjectsMap_1);
var AXObjectElementMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _AXObjectsMap = _interopRequireDefault(AXObjectsMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F2 = function F3() {
        };
        return { s: F2, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F2 };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e3) {
      didErr = true;
      err = _e3;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  var AXObjectElements = [];
  var _iterator = _createForOfIteratorHelper(_AXObjectsMap.default.entries()), _step;
  try {
    var _loop = function _loop2() {
      var _step$value = _slicedToArray(_step.value, 2), name = _step$value[0], def = _step$value[1];
      var relatedConcepts = def.relatedConcepts;
      if (Array.isArray(relatedConcepts)) {
        relatedConcepts.forEach(function(relation) {
          if (relation.module === "HTML") {
            var concept = relation.concept;
            if (concept) {
              var index2 = AXObjectElements.findIndex(function(_ref5) {
                var _ref6 = _slicedToArray(_ref5, 1), key = _ref6[0];
                return key === name;
              });
              if (index2 === -1) {
                AXObjectElements.push([name, []]);
                index2 = AXObjectElements.length - 1;
              }
              AXObjectElements[index2][1].push(concept);
            }
          }
        });
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var AXObjectElementMap = {
    entries: function entries() {
      return AXObjectElements;
    },
    get: function get(key) {
      var item = AXObjectElements.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return AXObjectElements.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return AXObjectElements.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = AXObjectElementMap;
  exports.default = _default2;
});
unwrapExports(AXObjectElementMap_1);
var AXObjectRoleMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _AXObjectsMap = _interopRequireDefault(AXObjectsMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F2 = function F3() {
        };
        return { s: F2, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F2 };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e3) {
      didErr = true;
      err = _e3;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  var AXObjectRoleElements = [];
  var _iterator = _createForOfIteratorHelper(_AXObjectsMap.default.entries()), _step;
  try {
    var _loop = function _loop2() {
      var _step$value = _slicedToArray(_step.value, 2), name = _step$value[0], def = _step$value[1];
      var relatedConcepts = def.relatedConcepts;
      if (Array.isArray(relatedConcepts)) {
        relatedConcepts.forEach(function(relation) {
          if (relation.module === "ARIA") {
            var concept = relation.concept;
            if (concept) {
              var index2 = AXObjectRoleElements.findIndex(function(_ref5) {
                var _ref6 = _slicedToArray(_ref5, 1), key = _ref6[0];
                return key === name;
              });
              if (index2 === -1) {
                AXObjectRoleElements.push([name, []]);
                index2 = AXObjectRoleElements.length - 1;
              }
              AXObjectRoleElements[index2][1].push(concept);
            }
          }
        });
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var AXObjectRoleMap = {
    entries: function entries() {
      return AXObjectRoleElements;
    },
    get: function get(key) {
      var item = AXObjectRoleElements.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return AXObjectRoleElements.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return AXObjectRoleElements.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = AXObjectRoleMap;
  exports.default = _default2;
});
unwrapExports(AXObjectRoleMap_1);
var elementAXObjectMap_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _AXObjectsMap = _interopRequireDefault(AXObjectsMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F2 = function F3() {
        };
        return { s: F2, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F2 };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e3) {
      didErr = true;
      err = _e3;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  var elementAXObjects = [];
  var _iterator = _createForOfIteratorHelper(_AXObjectsMap.default.entries()), _step;
  try {
    var _loop = function _loop2() {
      var _step$value = _slicedToArray(_step.value, 2), name = _step$value[0], def = _step$value[1];
      var relatedConcepts = def.relatedConcepts;
      if (Array.isArray(relatedConcepts)) {
        relatedConcepts.forEach(function(relation) {
          if (relation.module === "HTML") {
            var concept = relation.concept;
            if (concept) {
              var conceptStr = JSON.stringify(concept);
              var axObjects;
              var index2 = 0;
              for (; index2 < elementAXObjects.length; index2++) {
                var _key = elementAXObjects[index2][0];
                if (JSON.stringify(_key) === conceptStr) {
                  axObjects = elementAXObjects[index2][1];
                  break;
                }
              }
              if (!axObjects) {
                axObjects = [];
              }
              var loc = axObjects.findIndex(function(item) {
                return item === name;
              });
              if (loc === -1) {
                axObjects.push(name);
              }
              if (index2 < elementAXObjects.length) {
                elementAXObjects.splice(index2, 1, [concept, axObjects]);
              } else {
                elementAXObjects.push([concept, axObjects]);
              }
            }
          }
        });
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var elementAXObjectMap = {
    entries: function entries() {
      return elementAXObjects;
    },
    get: function get(key) {
      var item = elementAXObjects.find(function(tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has2(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return elementAXObjects.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
        return key;
      });
    },
    values: function values() {
      return elementAXObjects.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
        return values2;
      });
    }
  };
  var _default2 = elementAXObjectMap;
  exports.default = _default2;
});
unwrapExports(elementAXObjectMap_1);
var lib$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.elementAXObjects = exports.AXObjects = exports.AXObjectRoles = exports.AXObjectElements = void 0;
  var _AXObjectElementMap = _interopRequireDefault(AXObjectElementMap_1);
  var _AXObjectRoleMap = _interopRequireDefault(AXObjectRoleMap_1);
  var _AXObjectsMap = _interopRequireDefault(AXObjectsMap_1);
  var _elementAXObjectMap = _interopRequireDefault(elementAXObjectMap_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var AXObjectElements = _AXObjectElementMap.default;
  exports.AXObjectElements = AXObjectElements;
  var AXObjectRoles = _AXObjectRoleMap.default;
  exports.AXObjectRoles = AXObjectRoles;
  var AXObjects = _AXObjectsMap.default;
  exports.AXObjects = AXObjects;
  var elementAXObjects = _elementAXObjectMap.default;
  exports.elementAXObjects = elementAXObjects;
});
unwrapExports(lib$1);
var lib_1$1 = lib$1.elementAXObjects;
var lib_2$1 = lib$1.AXObjects;
lib$1.AXObjectRoles;
lib$1.AXObjectElements;
const roles = [...lib_3.keys()];
const non_interactive_roles = new Set(roles.filter((name) => {
  const role = lib_3.get(name);
  return !lib_3.get(name).abstract && name !== "toolbar" && !role.superClass.some((classes2) => classes2.includes("widget"));
}).concat(
  "progressbar"
));
const interactive_roles = new Set(roles.filter((name) => {
  const role = lib_3.get(name);
  return !role.abstract && name !== "progressbar" && role.superClass.some((classes2) => classes2.includes("widget"));
}).concat(
  "toolbar"
));
lib_2.entries().forEach(([schema, roles2]) => {
  if ([...roles2].every((role) => non_interactive_roles.has(role)))
    ;
});
lib_2.entries().forEach(([schema, roles2]) => {
  if ([...roles2].every((role) => interactive_roles.has(role)))
    ;
});
const interactive_ax_objects = new Set([...lib_2$1.keys()].filter((name) => lib_2$1.get(name).type === "widget"));
lib_1$1.entries().forEach(([schema, ax_object]) => {
  if ([...ax_object].every((role) => interactive_ax_objects.has(role)))
    ;
});
lib_3.keys();
new Set(lib_3.keys().filter((role) => lib_3.get(role).abstract));
x`true`;
x`false`;
const svg_attributes = "accent-height accumulate additive alignment-baseline allowReorder alphabetic amplitude arabic-form ascent attributeName attributeType autoReverse azimuth baseFrequency baseline-shift baseProfile bbox begin bias by calcMode cap-height class clip clipPathUnits clip-path clip-rule color color-interpolation color-interpolation-filters color-profile color-rendering contentScriptType contentStyleType cursor cx cy d decelerate descent diffuseConstant direction display divisor dominant-baseline dur dx dy edgeMode elevation enable-background end exponent externalResourcesRequired fill fill-opacity fill-rule filter filterRes filterUnits flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight format from fr fx fy g1 g2 glyph-name glyph-orientation-horizontal glyph-orientation-vertical glyphRef gradientTransform gradientUnits hanging height href horiz-adv-x horiz-origin-x id ideographic image-rendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength kerning keyPoints keySplines keyTimes lang lengthAdjust letter-spacing lighting-color limitingConeAngle local marker-end marker-mid marker-start markerHeight markerUnits markerWidth mask maskContentUnits maskUnits mathematical max media method min mode name numOctaves offset onabort onactivate onbegin onclick onend onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onrepeat onresize onscroll onunload opacity operator order orient orientation origin overflow overline-position overline-thickness panose-1 paint-order pathLength patternContentUnits patternTransform patternUnits pointer-events points pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits r radius refX refY rendering-intent repeatCount repeatDur requiredExtensions requiredFeatures restart result rotate rx ry scale seed shape-rendering slope spacing specularConstant specularExponent speed spreadMethod startOffset stdDeviation stemh stemv stitchTiles stop-color stop-opacity strikethrough-position strikethrough-thickness string stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width style surfaceScale systemLanguage tabindex tableValues target targetX targetY text-anchor text-decoration text-rendering textLength to transform type u1 u2 underline-position underline-thickness unicode unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical values version vert-adv-y vert-origin-x vert-origin-y viewBox viewTarget visibility width widths word-spacing writing-mode x x-height x1 x2 xChannelSelector xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y y1 y2 yChannelSelector z zoomAndPan".split(" ");
const svg_attribute_lookup = /* @__PURE__ */ new Map();
svg_attributes.forEach((name) => {
  svg_attribute_lookup.set(name.toLowerCase(), name);
});
const attribute_lookup = {
  allowfullscreen: { property_name: "allowFullscreen", applies_to: ["iframe"] },
  allowpaymentrequest: { property_name: "allowPaymentRequest", applies_to: ["iframe"] },
  async: { applies_to: ["script"] },
  autofocus: { applies_to: ["button", "input", "keygen", "select", "textarea"] },
  autoplay: { applies_to: ["audio", "video"] },
  checked: { applies_to: ["input"] },
  controls: { applies_to: ["audio", "video"] },
  default: { applies_to: ["track"] },
  defer: { applies_to: ["script"] },
  disabled: {
    applies_to: [
      "button",
      "fieldset",
      "input",
      "keygen",
      "optgroup",
      "option",
      "select",
      "textarea"
    ]
  },
  formnovalidate: { property_name: "formNoValidate", applies_to: ["button", "input"] },
  hidden: {},
  indeterminate: { applies_to: ["input"] },
  ismap: { property_name: "isMap", applies_to: ["img"] },
  loop: { applies_to: ["audio", "bgsound", "video"] },
  multiple: { applies_to: ["input", "select"] },
  muted: { applies_to: ["audio", "video"] },
  nomodule: { property_name: "noModule", applies_to: ["script"] },
  novalidate: { property_name: "noValidate", applies_to: ["form"] },
  open: { applies_to: ["details", "dialog"] },
  playsinline: { property_name: "playsInline", applies_to: ["video"] },
  readonly: { property_name: "readOnly", applies_to: ["input", "textarea"] },
  required: { applies_to: ["input", "select", "textarea"] },
  reversed: { applies_to: ["ol"] },
  selected: { applies_to: ["option"] },
  value: {
    applies_to: [
      "button",
      "option",
      "input",
      "li",
      "meter",
      "progress",
      "param",
      "select",
      "textarea"
    ]
  }
};
Object.keys(attribute_lookup).forEach((name) => {
  const metadata = attribute_lookup[name];
  if (!metadata.property_name)
    metadata.property_name = name;
});
typeof URL !== "undefined" ? URL : require("url").URL;
var BlockAppliesToNode;
(function(BlockAppliesToNode2) {
  BlockAppliesToNode2[BlockAppliesToNode2["NotPossible"] = 0] = "NotPossible";
  BlockAppliesToNode2[BlockAppliesToNode2["Possible"] = 1] = "Possible";
  BlockAppliesToNode2[BlockAppliesToNode2["UnknownSelectorType"] = 2] = "UnknownSelectorType";
})(BlockAppliesToNode || (BlockAppliesToNode = {}));
var NodeExist;
(function(NodeExist2) {
  NodeExist2[NodeExist2["Probably"] = 1] = "Probably";
  NodeExist2[NodeExist2["Definitely"] = 2] = "Definitely";
})(NodeExist || (NodeExist = {}));
typeof process !== "undefined" && process.env.TEST;
export {
  Icon_1 as I,
  classname as c,
  forwardEventsBuilder as f
};
