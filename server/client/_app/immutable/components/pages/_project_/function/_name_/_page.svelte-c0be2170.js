import{S,i as q,s as D,B as V,H as h,k as I,l as H,m as M,h as u,I as w,b as _,J as j,C as A,D as G,E as J,K,f as i,t as d,L as C,M as L,O as k,v as m,w as p,x as g,y as b,G as N,o as O,a as P,c as T,q as v,e as B,r as E,g as R,d as U,R as y,T as z,U as Q}from"../../../../../chunks/index-beb4732d.js";import{f as W,c as X,B as Y}from"../../../../../chunks/compiler-f7934220.js";import{C as Z,b as x,a as ee,c as te}from"../../../../../chunks/CardTitle-28c545ae.js";import"../../../../../chunks/preload-helper-aa6bc0ce.js";import{p as se}from"../../../../../chunks/stores-c96e82ad.js";import{a as ae}from"../../../../../chunks/api-1d10786d.js";function ne(o){let t,s,n,r;const e=o[4].default,a=V(e,o,o[3],null);let f=[o[2],{class:o[0]}],c={};for(let l=0;l<f.length;l+=1)c=h(c,f[l]);return{c(){t=I("div"),a&&a.c(),this.h()},l(l){t=H(l,"DIV",{class:!0});var $=M(t);a&&a.l($),$.forEach(u),this.h()},h(){w(t,c)},m(l,$){_(l,t,$),a&&a.m(t,null),s=!0,n||(r=j(o[1].call(null,t)),n=!0)},p(l,[$]){a&&a.p&&(!s||$&8)&&A(a,e,l,l[3],s?J(e,l[3],$,null):G(l[3]),null),w(t,c=K(f,[$&4&&l[2],(!s||$&1)&&{class:l[0]}]))},i(l){s||(i(a,l),s=!0)},o(l){d(a,l),s=!1},d(l){l&&u(t),a&&a.d(l),n=!1,r()}}}function re(o,t,s){let n;const r=[];let e=C(t,r),{$$slots:a={},$$scope:f}=t;const c=W(L());return o.$$set=l=>{s(5,t=h(h({},t),k(l))),s(2,e=C(t,r)),"$$scope"in l&&s(3,f=l.$$scope)},o.$$.update=()=>{s(0,n=X("card-actions",void 0,t.class))},t=k(t),[n,c,e,f,a]}class oe extends S{constructor(t){super(),q(this,t,re,ne,D,{})}}function le(o){let t;return{c(){t=v("Edit Function")},l(s){t=E(s,"Edit Function")},m(s,n){_(s,t,n)},d(s){s&&u(t)}}}function ce(o){let t;return{c(){t=v("Save")},l(s){t=E(s,"Save")},m(s,n){_(s,t,n)},d(s){s&&u(t)}}}function fe(o){let t,s;return t=new Y({props:{color:"primary",$$slots:{default:[ce]},$$scope:{ctx:o}}}),{c(){m(t.$$.fragment)},l(n){p(t.$$.fragment,n)},m(n,r){g(t,n,r),s=!0},p(n,r){const e={};r&32&&(e.$$scope={dirty:r,ctx:n}),t.$set(e)},i(n){s||(i(t.$$.fragment,n),s=!0)},o(n){d(t.$$.fragment,n),s=!1},d(n){b(t,n)}}}function ie(o){let t,s,n,r;return t=new te({props:{$$slots:{default:[le]},$$scope:{ctx:o}}}),n=new oe({props:{$$slots:{default:[fe]},$$scope:{ctx:o}}}),{c(){m(t.$$.fragment),s=P(),m(n.$$.fragment)},l(e){p(t.$$.fragment,e),s=T(e),p(n.$$.fragment,e)},m(e,a){g(t,e,a),_(e,s,a),g(n,e,a),r=!0},p(e,a){const f={};a&32&&(f.$$scope={dirty:a,ctx:e}),t.$set(f);const c={};a&32&&(c.$$scope={dirty:a,ctx:e}),n.$set(c)},i(e){r||(i(t.$$.fragment,e),i(n.$$.fragment,e),r=!0)},o(e){d(t.$$.fragment,e),d(n.$$.fragment,e),r=!1},d(e){b(t,e),e&&u(s),b(n,e)}}}function F(o){let t,s,n;function r(a){o[2](a)}let e={};return o[0].code!==void 0&&(e.code=o[0].code),t=new CodeEditor({props:e}),y.push(()=>z(t,"code",r)),{c(){m(t.$$.fragment)},l(a){p(t.$$.fragment,a)},m(a,f){g(t,a,f),n=!0},p(a,f){const c={};!s&&f&1&&(s=!0,c.code=a[0].code,Q(()=>s=!1)),t.$set(c)},i(a){n||(i(t.$$.fragment,a),n=!0)},o(a){d(t.$$.fragment,a),n=!1},d(a){b(t,a)}}}function ue(o){let t,s,n,r=o[0]&&F(o);return{c(){t=v(`Function Editor

        `),r&&r.c(),s=B()},l(e){t=E(e,`Function Editor

        `),r&&r.l(e),s=B()},m(e,a){_(e,t,a),r&&r.m(e,a),_(e,s,a),n=!0},p(e,a){e[0]?r?(r.p(e,a),a&1&&i(r,1)):(r=F(e),r.c(),i(r,1),r.m(s.parentNode,s)):r&&(R(),d(r,1,1,()=>{r=null}),U())},i(e){n||(i(r),n=!0)},o(e){d(r),n=!1},d(e){e&&u(t),r&&r.d(e),e&&u(s)}}}function de(o){let t,s,n,r;return t=new x({props:{$$slots:{default:[ie]},$$scope:{ctx:o}}}),n=new ee({props:{$$slots:{default:[ue]},$$scope:{ctx:o}}}),{c(){m(t.$$.fragment),s=P(),m(n.$$.fragment)},l(e){p(t.$$.fragment,e),s=T(e),p(n.$$.fragment,e)},m(e,a){g(t,e,a),_(e,s,a),g(n,e,a),r=!0},p(e,a){const f={};a&32&&(f.$$scope={dirty:a,ctx:e}),t.$set(f);const c={};a&33&&(c.$$scope={dirty:a,ctx:e}),n.$set(c)},i(e){r||(i(t.$$.fragment,e),i(n.$$.fragment,e),r=!0)},o(e){d(t.$$.fragment,e),d(n.$$.fragment,e),r=!1},d(e){b(t,e),e&&u(s),b(n,e)}}}function $e(o){let t,s,n;return s=new Z({props:{$$slots:{default:[de]},$$scope:{ctx:o}}}),{c(){t=I("div"),m(s.$$.fragment)},l(r){t=H(r,"DIV",{});var e=M(t);p(s.$$.fragment,e),e.forEach(u)},m(r,e){_(r,t,e),g(s,t,null),n=!0},p(r,[e]){const a={};e&33&&(a.$$scope={dirty:e,ctx:r}),s.$set(a)},i(r){n||(i(s.$$.fragment,r),n=!0)},o(r){d(s.$$.fragment,r),n=!1},d(r){r&&u(t),b(s)}}}function _e(o,t,s){let n,r,e;N(o,se,c=>s(1,e=c));let a;O(async()=>{s(0,a=await ae(r,n))});function f(c){o.$$.not_equal(a.code,c)&&(a.code=c,s(0,a))}return o.$$.update=()=>{o.$$.dirty&2&&({name:n,project:r}=e.params)},[a,e,f]}class Ee extends S{constructor(t){super(),q(this,t,_e,$e,D,{})}}export{Ee as default};