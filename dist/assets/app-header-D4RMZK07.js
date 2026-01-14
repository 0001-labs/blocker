const W="https://blocker.0001-labs.workers.dev";function Z(){return localStorage.getItem("blocker_token")}function te(i){localStorage.setItem("blocker_token",i)}function ee(){const i="abcdefghijklmnopqrstuvwxyz0123456789";let t="";for(let e=0;e<32;e++)t+=i[Math.floor(Math.random()*i.length)];return t}async function yt(i){const t=i||Z();if(!t)return null;const e=await fetch(`${W}/vault?token=${t}`);if(e.status===404)return null;if(!e.ok)throw new Error(`Failed to get vault: ${e.status}`);return e.json()}async function se(i,t){const e=await fetch(`${W}/vault`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:i,...t})});if(!e.ok){const s=await e.json();throw new Error(s.error||`Failed to save credentials: ${e.status}`)}return e.json()}async function ie(i,t){const e=await fetch(`${W}/vault`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:i,sessions:t})});if(!e.ok){const s=await e.json();throw new Error(s.error||`Failed to sync schedule: ${e.status}`)}return e.json()}async function ne(i){const t=i||Z();if(!t)throw new Error("No token");const e=await fetch(`${W}/password?token=${t}`);if(e.status===403)return{blocked:!0,...await e.json()};if(!e.ok)throw new Error(`Failed to get password: ${e.status}`);return{blocked:!1,password:(await e.json()).password}}const G="__convexAuthJWT",vt="__convexAuthRefreshToken";let C={isAuthenticated:!1,payload:null};function At(){return"https://elegant-avocet-484.convex.cloud".replace(/[^a-zA-Z0-9]/g,"")}function L(i){const t=At();return t?`${i}_${t}`:null}function bt(i){try{return window.localStorage.getItem(i)}catch(t){return console.warn("Unable to access localStorage:",t),null}}function wt(i){try{const e=i.padEnd(i.length+(4-i.length%4)%4,"=").replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(atob(e).split("").map(s=>`%${`00${s.charCodeAt(0).toString(16)}`.slice(-2)}`).join(""))}catch{return null}}function St(i){if(!i)return null;const t=i.split(".");if(t.length!==3)return null;const e=wt(t[1]);if(!e)return null;try{return JSON.parse(e)}catch{return null}}function Et(i){if(!i||typeof i!="object"||!i.exp)return!1;const t=Math.floor(Date.now()/1e3);return i.exp>t}function kt(){const i=L(G);return i?bt(i):null}function xt(){const i=kt(),t=St(i),e=i?Et(t):!1;return{isAuthenticated:e,payload:e?t:null}}function j(){return typeof window>"u"?(C={isAuthenticated:!1,payload:null},C):(C=xt(),C)}function Ct(){return j().isAuthenticated}function re(){const i=L(G),t=L(vt);try{i&&window.localStorage.removeItem(i),t&&window.localStorage.removeItem(t)}catch{}C={isAuthenticated:!1,payload:null}}function oe(){j(),window.addEventListener("storage",i=>{if(!i.key)return;const t=L(G);i.key===t&&j()}),window.addEventListener("focus",()=>{j()})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=globalThis,Y=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),et=new WeakMap;let pt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Y&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&et.set(e,t))}return t}toString(){return this.cssText}};const Pt=i=>new pt(typeof i=="string"?i:i+"",void 0,Q),Tt=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,n,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new pt(e,i,Q)},Ut=(i,t)=>{if(Y)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),n=B.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},st=Y?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Pt(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ot,defineProperty:Mt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Nt,getOwnPropertySymbols:It,getPrototypeOf:Rt}=Object,g=globalThis,it=g.trustedTypes,jt=it?it.emptyScript:"",q=g.reactiveElementPolyfillSupport,P=(i,t)=>i,D={toAttribute(i,t){switch(t){case Boolean:i=i?jt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},X=(i,t)=>!Ot(i,t),nt={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:X};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),g.litPropertyMetadata??(g.litPropertyMetadata=new WeakMap);let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Mt(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){const{get:n,set:o}=Ht(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:n,set(r){const l=n==null?void 0:n.call(this);o==null||o.call(this,r),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;const t=Rt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){const e=this.properties,s=[...Nt(e),...It(e)];for(const n of s)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const n of s)e.unshift(st(n))}else t!==void 0&&e.push(st(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ut(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const r=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:D).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){var o,r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const l=s.getPropertyOptions(n),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:D;this._$Em=n;const h=a.fromAttribute(e,l.type);this[n]=h??((r=this._$Ej)==null?void 0:r.get(n))??h,this._$Em=null}}requestUpdate(t,e,s,n=!1,o){var r;if(t!==void 0){const l=this.constructor;if(n===!1&&(o=this[t]),s??(s=l.getPropertyOptions(t)),!((s.hasChanged??X)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(l._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:o},r){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,r]of n){const{wrapped:l}=r,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,r,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var n;return(n=s.hostUpdated)==null?void 0:n.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[P("elementProperties")]=new Map,w[P("finalized")]=new Map,q==null||q({ReactiveElement:w}),(g.reactiveElementVersions??(g.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const T=globalThis,rt=i=>i,z=T.trustedTypes,ot=z?z.createPolicy("lit-html",{createHTML:i=>i}):void 0,ft="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+_,Bt=`<${$t}>`,A=document,O=()=>A.createComment(""),M=i=>i===null||typeof i!="object"&&typeof i!="function",tt=Array.isArray,Lt=i=>tt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",V=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,lt=/>/g,m=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,ht=/"/g,_t=/^(?:script|style|textarea|title)$/i,Dt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),x=Dt(1),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),dt=new WeakMap,y=A.createTreeWalker(A,129);function gt(i,t){if(!tt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(t):t}const zt=(i,t)=>{const e=i.length-1,s=[];let n,o=t===2?"<svg>":t===3?"<math>":"",r=k;for(let l=0;l<e;l++){const a=i[l];let h,u,c=-1,p=0;for(;p<a.length&&(r.lastIndex=p,u=r.exec(a),u!==null);)p=r.lastIndex,r===k?u[1]==="!--"?r=at:u[1]!==void 0?r=lt:u[2]!==void 0?(_t.test(u[2])&&(n=RegExp("</"+u[2],"g")),r=m):u[3]!==void 0&&(r=m):r===m?u[0]===">"?(r=n??k,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,h=u[1],r=u[3]===void 0?m:u[3]==='"'?ht:ct):r===ht||r===ct?r=m:r===at||r===lt?r=k:(r=m,n=void 0);const $=r===m&&i[l+1].startsWith("/>")?" ":"";o+=r===k?a+Bt:c>=0?(s.push(h),a.slice(0,c)+ft+a.slice(c)+_+$):a+_+(c===-2?l:$)}return[gt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class H{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let o=0,r=0;const l=t.length-1,a=this.parts,[h,u]=zt(t,e);if(this.el=H.createElement(h,s),y.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=y.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const c of n.getAttributeNames())if(c.endsWith(ft)){const p=u[r++],$=n.getAttribute(c).split(_),R=/([.?@])?(.*)/.exec(p);a.push({type:1,index:o,name:R[2],strings:$,ctor:R[1]==="."?Jt:R[1]==="?"?qt:R[1]==="@"?Vt:J}),n.removeAttribute(c)}else c.startsWith(_)&&(a.push({type:6,index:o}),n.removeAttribute(c));if(_t.test(n.tagName)){const c=n.textContent.split(_),p=c.length-1;if(p>0){n.textContent=z?z.emptyScript:"";for(let $=0;$<p;$++)n.append(c[$],O()),y.nextNode(),a.push({type:2,index:++o});n.append(c[p],O())}}}else if(n.nodeType===8)if(n.data===$t)a.push({type:2,index:o});else{let c=-1;for(;(c=n.data.indexOf(_,c+1))!==-1;)a.push({type:7,index:o}),c+=_.length-1}o++}}static createElement(t,e){const s=A.createElement("template");return s.innerHTML=t,s}}function E(i,t,e=i,s){var r,l;if(t===S)return t;let n=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const o=M(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==o&&((l=n==null?void 0:n._$AO)==null||l.call(n,!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=E(i,n._$AS(i,t.values),n,s)),t}class Wt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,n=((t==null?void 0:t.creationScope)??A).importNode(e,!0);y.currentNode=n;let o=y.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let h;a.type===2?h=new N(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new Ft(o,this,t)),this._$AV.push(h),a=s[++l]}r!==(a==null?void 0:a.index)&&(o=y.nextNode(),r++)}return y.currentNode=A,n}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class N{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),M(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Lt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=H.createElement(gt(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===n)this._$AH.p(e);else{const r=new Wt(n,this),l=r.u(this.options);r.p(e),this.T(l),this._$AH=r}}_$AC(t){let e=dt.get(t.strings);return e===void 0&&dt.set(t.strings,e=new H(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,n=0;for(const o of t)n===e.length?e.push(s=new N(this.O(O()),this.O(O()),this,this.options)):s=e[n],s._$AI(o),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const n=rt(t).nextSibling;rt(t).remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class J{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,n){const o=this.strings;let r=!1;if(o===void 0)t=E(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==S,r&&(this._$AH=t);else{const l=t;let a,h;for(t=o[0],a=0;a<o.length-1;a++)h=E(this,l[s+a],e,a),h===S&&(h=this._$AH[a]),r||(r=!M(h)||h!==this._$AH[a]),h===d?t=d:t!==d&&(t+=(h??"")+o[a+1]),this._$AH[a]=h}r&&!n&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Jt extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class qt extends J{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Vt extends J{constructor(t,e,s,n,o){super(t,e,s,n,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??d)===S)return;const s=this._$AH,n=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ft{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}}const F=T.litHtmlPolyfillSupport;F==null||F(H,N),(T.litHtmlVersions??(T.litHtmlVersions=[])).push("3.3.2");const Kt=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let n=s._$litPart$;if(n===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=n=new N(t.insertBefore(O(),o),o,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const v=globalThis;class U extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Kt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return S}}var ut;U._$litElement$=!0,U.finalized=!0,(ut=v.litElementHydrateSupport)==null||ut.call(v,{LitElement:U});const K=v.litElementPolyfillSupport;K==null||K({LitElement:U});(v.litElementVersions??(v.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:X},Yt=(i=Gt,t,e)=>{const{kind:s,metadata:n}=e;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:r}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,i,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,i,l),l}}}if(s==="setter"){const{name:r}=e;return function(l){const a=this[r];t.call(this,l),this.requestUpdate(r,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function I(i){return(t,e)=>typeof e=="object"?Yt(i,t,e):((s,n,o)=>{const r=n.hasOwnProperty(o);return n.constructor.createProperty(o,s),r?Object.getOwnPropertyDescriptor(n,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(i){return I({...i,state:!0,attribute:!1})}var Qt=Object.defineProperty,Xt=Object.getOwnPropertyDescriptor,b=(i,t,e,s)=>{for(var n=s>1?void 0:s?Xt(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Qt(t,e,n),n};let f=class extends U{constructor(){super(...arguments),this.currentPage="app",this.isBlocking=!1,this.activeUntil=null,this.insanoMode=!1,this._isAuthenticated=!1,this._timeLeft="",this._timerInterval=null}connectedCallback(){super.connectedCallback(),this._isAuthenticated=Ct(),this._loadBlockingStatus()}disconnectedCallback(){super.disconnectedCallback(),this._timerInterval&&clearInterval(this._timerInterval)}updated(i){(i.has("activeUntil")||i.has("isBlocking"))&&this._updateTimer()}_updateTimer(){if(this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null),!this.isBlocking||!this.activeUntil){this._timeLeft="";return}const i=()=>{const t=new Date,s=new Date(this.activeUntil).getTime()-t.getTime();if(s<=0){this._timeLeft="0:00",this._timerInterval&&clearInterval(this._timerInterval);return}const n=Math.floor(s/(1e3*60*60)),o=Math.floor(s%(1e3*60*60)/(1e3*60)),r=Math.floor(s%(1e3*60)/1e3);n>0?this._timeLeft=`${n}:${o.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")} left`:this._timeLeft=`${o}:${r.toString().padStart(2,"0")} left`};i(),this._timerInterval=setInterval(i,1e3)}async _loadBlockingStatus(){if(this._isAuthenticated)try{const i=Z();if(i){const t=await yt(i);this.isBlocking=(t==null?void 0:t.isBlocking)||!1}}catch(i){console.error("Failed to load blocking status:",i)}}_getHomeUrl(){return this._isAuthenticated?"app.html":"index.html"}_handleHomeClick(){this.currentPage==="app"?this.dispatchEvent(new CustomEvent("navigate-home",{bubbles:!0,composed:!0})):window.location.href=this._getHomeUrl()}_handleSettingsClick(){window.location.pathname.endsWith("app.html")||window.location.pathname.endsWith("/app")?this.dispatchEvent(new CustomEvent("navigate-settings",{bubbles:!0,composed:!0})):(sessionStorage.setItem("blocker-show-settings","true"),window.location.href="app.html")}render(){const i=this._isAuthenticated;return x`
      <div class="header">
        <div class="header-left" @click=${this._handleHomeClick}>
          <h1 class="logo-title">Screen Time Blocker</h1>
          ${this.insanoMode?x`<span class="insano-badge">INSANO</span>`:""}
          ${this._isAuthenticated?x`
            <span class="header-status">
              <span class="header-status-dot ${this.isBlocking?"blocking":""}"></span>
              <span>${this.isBlocking?"Blocked":"Not blocked"}</span>
            </span>
            ${this.isBlocking&&this._timeLeft?x`
              <span class="header-timer">${this._timeLeft}</span>
            `:""}
          `:""}
        </div>
        <div class="header-right">
          <a class="header-link" href="faq.html">FAQ</a>
          <a class="header-link" href="https://github.com/sponsors/Jo4712" target="_blank">Donate</a>
          ${i?x`
            <span class="header-link" @click=${this._handleSettingsClick}>Settings</span>
          `:""}
        </div>
      </div>
    `}};f.styles=Tt`
    :host {
      display: block;
      font-family: var(--typeface-regular, system-ui), system-ui, sans-serif;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--2, 32px);
      width: 100%;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--1, 16px);
      cursor: pointer;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--1, 16px);
    }

    .logo-title {
      font-family: var(--typeface-medium, system-ui), system-ui, sans-serif;
      font-size: calc(18px * var(--sf, 1));
      font-weight: 500;
      margin: 0;
      white-space: nowrap;
      color: var(--text-color, #000);
    }

    .header-status {
      display: inline-flex;
      align-items: center;
      gap: var(--025, 4px);
      font-size: calc(14px * var(--sf, 1));
      color: var(--text-color-dimmed, #666);
      margin-left: var(--05, 8px);
    }

    .header-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--every-green, #4ade80);
    }

    .header-status-dot.blocking {
      background: var(--tuned-red, #ef4444);
    }

    .header-link {
      font-size: calc(14px * var(--sf, 1));
      color: var(--text-color-dimmed, #666);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s;
    }

    .header-link:hover {
      color: var(--text-color, #000);
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .header-timer {
      background: #eee;
      padding: 2px 5px;
      border-radius: 2px;
      font-size: calc(14px * var(--sf, 1));
      color: var(--text-color, #000);
    }

    @media (prefers-color-scheme: dark) {
      .header-timer {
        background: var(--slate-dark, #333);
      }
    }

    .insano-badge {
      font-family: var(--typeface-medium, system-ui), system-ui, sans-serif;
      font-size: calc(11px * var(--sf, 1));
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 2px 6px;
      border-radius: 3px;
      background: repeating-linear-gradient(
        -45deg,
        var(--tuned-red, #ef4444),
        var(--tuned-red, #ef4444) 3px,
        #ff6b6b 3px,
        #ff6b6b 6px
      );
      color: white;
    }
  `;b([I({type:String,attribute:"current-page"})],f.prototype,"currentPage",2);b([I({type:Boolean,reflect:!0})],f.prototype,"isBlocking",2);b([I({type:String,attribute:"active-until"})],f.prototype,"activeUntil",2);b([I({type:Boolean,attribute:"insano-mode"})],f.prototype,"insanoMode",2);b([mt()],f.prototype,"_isAuthenticated",2);b([mt()],f.prototype,"_timeLeft",2);f=b([Zt("app-header")],f);export{ee as a,te as b,re as c,Ct as d,kt as e,Z as f,yt as g,ne as h,oe as i,ie as j,Tt as k,U as l,x as m,se as s,Zt as t};
