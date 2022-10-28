import{S as U,i as K,s as j,e as C,b as L,f as z,t as B,h as k,H as S,X as A,J as v,K as D,B as G,k as H,l as J,m as q,L as O,Y as M,C as R,D as X,E as Y,N as I,$ as Q}from"./index-5e43de0b.js";import{f as V,c as W}from"./compiler-1d3b934d.js";import{a as Z}from"./alert-b144a61d.js";function P(l){let e,t,n,s;const a=l[16].default,c=G(a,l,l[15],null);let d=[{disabled:l[0]},{href:l[1]},l[5],{class:l[3]}],f={};for(let i=0;i<d.length;i+=1)f=v(f,d[i]);return{c(){e=H(l[1]?"a":"button"),c&&c.c(),this.h()},l(i){e=J(i,((l[1]?"a":"button")||"null").toUpperCase(),{disabled:!0,href:!0,class:!0});var u=q(e);c&&c.l(u),u.forEach(k),this.h()},h(){O(e,f)},m(i,u){L(i,e,u),c&&c.m(e,null),l[17](e),t=!0,n||(s=M(l[4].call(null,e)),n=!0)},p(i,u){c&&c.p&&(!t||u&32768)&&R(c,a,i,i[15],t?Y(a,i[15],u,null):X(i[15]),null),O(e,f=I(d,[(!t||u&1)&&{disabled:i[0]},(!t||u&2)&&{href:i[1]},u&32&&i[5],(!t||u&8)&&{class:i[3]}]))},i(i){t||(z(c,i),t=!0)},o(i){B(c,i),t=!1},d(i){i&&k(e),c&&c.d(i),l[17](null),n=!1,s()}}}function p(l){let e=l[1]?"a":"button",t,n,s=(l[1]?"a":"button")&&P(l);return{c(){s&&s.c(),t=C()},l(a){s&&s.l(a),t=C()},m(a,c){s&&s.m(a,c),L(a,t,c),n=!0},p(a,[c]){a[1],e?j(e,a[1]?"a":"button")?(s.d(1),s=P(a),s.c(),s.m(t.parentNode,t)):s.p(a,c):(s=P(a),s.c(),s.m(t.parentNode,t)),e=a[1]?"a":"button"},i(a){n||(z(s),n=!0)},o(a){B(s),n=!1},d(a){a&&k(t),s&&s.d(a)}}}function w(l,e,t){let n,s;const a=["active","block","color","disabled","ghost","href","loading","outline","shape","size"];let c=S(e,a),{$$slots:d={},$$scope:f}=e,{active:i=!1}=e,{block:u=!1}=e,{color:m="default"}=e,{disabled:h=!1}=e,{ghost:b=!1}=e,{href:y=void 0}=e,{loading:g=!1}=e,{outline:_=!1}=e,{shape:E="default"}=e,{size:T="md"}=e;const F=V(A());let r;function N(o){Q[o?"unshift":"push"](()=>{r=o,t(2,r)})}return l.$$set=o=>{t(18,e=v(v({},e),D(o))),t(5,c=S(e,a)),"active"in o&&t(6,i=o.active),"block"in o&&t(7,u=o.block),"color"in o&&t(8,m=o.color),"disabled"in o&&t(0,h=o.disabled),"ghost"in o&&t(9,b=o.ghost),"href"in o&&t(1,y=o.href),"loading"in o&&t(10,g=o.loading),"outline"in o&&t(11,_=o.outline),"shape"in o&&t(12,E=o.shape),"size"in o&&t(13,T=o.size),"$$scope"in o&&t(15,f=o.$$scope)},l.$$.update=()=>{l.$$.dirty&4&&t(14,n=r&&(!r.textContent||!r.textContent.trim())),t(3,s=W("button",{active:i,block:u,color:m,disabled:h,ghost:b,icon:n,loading:g,outline:_,shape:E,size:T},e.class,!0))},e=D(e),[h,y,r,s,F,c,i,u,m,b,g,_,E,T,n,f,d,N]}class se extends U{constructor(e){super(),K(this,e,w,p,j,{active:6,block:7,color:8,disabled:0,ghost:9,href:1,loading:10,outline:11,shape:12,size:13})}}function x(l){console.log(l),Z.showError(`(${l.status}) - ${l.message}`)}const $=()=>{async function l(e,t="GET",n=null){try{const s={};t!=="GET"&&(s.method=t),s.headers=new Headers,n!=null&&(s.headers.set("Content-Type","application/json"),s.body=JSON.stringify(n));const a=await fetch(e,s).then(c=>c.json());if(a.status>=400)throw new Error(`${a.status} - ${a.message}`);return a.data}catch(s){throw x(s),s}}return{getProjects:()=>l("/api"),getProject:e=>l(`/api/${e}`),createProject:e=>l("/api","POST",{name:e}),updateProject:(e,t)=>l(`/api/${e}`,"POST",t),removeProject:e=>l(`/api/${e}`,"DELETE"),addApiKey:(e,t)=>l(`/api/${e}/apikeys`,"POST",t),getRows:(e,t)=>l(`/api/${e}/collections/${t}`),insertData:(e,t,n)=>l(`/api/${e}/collections/${t}`,"POST",n),editData:(e,t,n,s)=>l(`/api/${e}/collections/${t}/${n}`,"PUT",s),removeData:(e,t,n)=>l(`/api/${e}/collections/${t}/${n}`,"DELETE"),addCollection:(e,t)=>l(`/api/${e}/collections`,"POST",t),editCollection:(e,t,n)=>l(`/api/${e}/collections/${t}`,"PUT",n),removeCollection:(e,t)=>l(`/api/${e}/collections/${t}`,"DELETE"),addFunction:(e,t)=>l(`/api/${e}/functions`,"POST",t),getFunctions:e=>l(`/api/${e}/functions`),editFunction:(e,t,n)=>l(`/api/${e}/functions/${t}`,"PUT",n),removeFunction:(e,t)=>l(`/api/${e}/functions/${t}`,"DELETE"),removeApiKey:(e,t)=>l(`/api/${e}/apikeys/${t}`,"DELETE"),setCookie:(e,t)=>l("/api/set-cookie","POST",{name:e,value:t})}},ae=$();export{se as B,ae as a};
