import{w as h}from"./index-ac35e321.js";function d(){const{set:l,update:r,subscribe:e}=h([]);function n(o,f){const s=crypto.randomUUID();r(t=>[...t,{id:s,type:o,message:f}]),setTimeout(()=>{r(t=>t.filter(w=>w.id!==s))},5e3)}function c(o){n("error",o)}function i(o){n("warning",o)}function u(o){n("info",o)}function a(o){n("success",o)}return{subscribe:e,showError:c,showWarning:i,showSuccess:a,showInfo:u}}const p=d();export{p as a};
