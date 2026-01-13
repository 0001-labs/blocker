const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/api-BIFMIXWG.js","assets/paginated_query_client-DGc-MdvA.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-B5Qt9EMX.js";import"https://cdn.jsdelivr.net/npm/ds-one@alpha/dist/ds-one.bundle.min.js";import{c as ze,g as ve,a as Je,s as ke,b as Ye,i as Xe,d as Ge,e as Ke,f as Ze,h as et,j as tt}from"./app-header-BLTtKcoa.js";import{v as nt,B as st,P as it,g as R,s as ot}from"./paginated_query_client-DGc-MdvA.js";import"https://esm.sh/lit@3";var at=Object.defineProperty,rt=(e,n,t)=>n in e?at(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,U=(e,n,t)=>rt(e,typeof n!="symbol"?n+"":n,t);class ct{constructor(n,t={}){U(this,"listeners"),U(this,"_client"),U(this,"_paginatedClient"),U(this,"callNewListenersWithCurrentValuesTimer"),U(this,"_closed"),U(this,"_disabled"),t.skipConvexDeploymentUrlCheck!==!0&&nt(n);const{disabled:i,...o}=t;this._closed=!1,this._disabled=!!i,typeof window>"u"&&!("unsavedChangesWarning"in o)&&(o.unsavedChangesWarning=!1),this.disabled||(this._client=new st(n,()=>{},o),this._paginatedClient=new it(this._client,d=>this._transition(d))),this.listeners=new Set}get closed(){return this._closed}get client(){if(this._client)return this._client;throw new Error("ConvexClient is disabled")}get paginatedClient(){if(this._paginatedClient)return this._paginatedClient;throw new Error("ConvexClient is disabled")}get disabled(){return this._disabled}onUpdate(n,t,i,o){if(this.disabled)return this.createDisabledUnsubscribe();const{queryToken:d,unsubscribe:l}=this.client.subscribe(R(n),t),c={queryToken:d,callback:i,onError:o,unsubscribe:l,hasEverRun:!1,query:n,args:t,paginationOptions:void 0};this.listeners.add(c),this.queryResultReady(d)&&this.callNewListenersWithCurrentValuesTimer===void 0&&(this.callNewListenersWithCurrentValuesTimer=setTimeout(()=>this.callNewListenersWithCurrentValues(),0));const h={unsubscribe:()=>{this.closed||(this.listeners.delete(c),l())},getCurrentValue:()=>this.client.localQueryResultByToken(d),getQueryLogs:()=>this.client.localQueryLogs(d)},p=h.unsubscribe;return Object.assign(p,h),p}onPaginatedUpdate_experimental(n,t,i,o,d){if(this.disabled)return this.createDisabledUnsubscribe();const l={initialNumItems:i.initialNumItems,id:-1},{paginatedQueryToken:c,unsubscribe:h}=this.paginatedClient.subscribe(R(n),t,l),p={queryToken:c,callback:o,onError:d,unsubscribe:h,hasEverRun:!1,query:n,args:t,paginationOptions:l};this.listeners.add(p),this.paginatedClient.localQueryResultByToken(c)&&this.callNewListenersWithCurrentValuesTimer===void 0&&(this.callNewListenersWithCurrentValuesTimer=setTimeout(()=>this.callNewListenersWithCurrentValues(),0));const b={unsubscribe:()=>{this.closed||(this.listeners.delete(p),h())},getCurrentValue:()=>this.paginatedClient.localQueryResult(R(n),t,l),getQueryLogs:()=>[]},w=b.unsubscribe;return Object.assign(w,b),w}callNewListenersWithCurrentValues(){this.callNewListenersWithCurrentValuesTimer=void 0,this._transition({queries:[],paginatedQueries:[]},!0)}queryResultReady(n){return this.client.hasLocalQueryResultByToken(n)}createDisabledUnsubscribe(){const n=()=>{};return Object.assign(n,{unsubscribe:n,getCurrentValue:()=>{},getQueryLogs:()=>{}}),n}async close(){if(!this.disabled)return this.listeners.clear(),this._closed=!0,this._paginatedClient&&(this._paginatedClient=void 0),this.client.close()}getAuth(){if(!this.disabled)return this.client.getCurrentAuthClaims()}setAuth(n,t){this.disabled||this.client.setAuth(n,t??(()=>{}))}setAdminAuth(n,t){if(this.closed)throw new Error("ConvexClient has already been closed.");this.disabled||this.client.setAdminAuth(n,t)}_transition({queries:n,paginatedQueries:t},i=!1){const o=[...n.map(d=>d.token),...t.map(d=>d.token)];for(const d of this.listeners){const{callback:l,queryToken:c,onError:h,hasEverRun:p}=d,b=ot(c),w=b?!!this.paginatedClient.localQueryResultByToken(c):this.client.hasLocalQueryResultByToken(c);if(o.includes(c)||i&&!p&&w){d.hasEverRun=!0;let k;try{b?k=this.paginatedClient.localQueryResultByToken(c):k=this.client.localQueryResultByToken(c)}catch(T){if(!(T instanceof Error))throw T;h?h(T,"Second argument to onUpdate onError is reserved for later use"):Promise.reject(T);continue}l(k,"Second argument to onUpdate callback is reserved for later use")}}}async mutation(n,t,i){if(this.disabled)throw new Error("ConvexClient is disabled");return await this.client.mutation(R(n),t,i)}async action(n,t){if(this.disabled)throw new Error("ConvexClient is disabled");return await this.client.action(R(n),t)}async query(n,t){if(this.disabled)throw new Error("ConvexClient is disabled");const i=this.client.localQueryResult(R(n),t);return i!==void 0?Promise.resolve(i):new Promise((o,d)=>{const{unsubscribe:l}=this.onUpdate(n,t,c=>{l(),o(c)},c=>{l(),d(c)})})}connectionState(){if(this.disabled)throw new Error("ConvexClient is disabled");return this.client.connectionState()}subscribeToConnectionState(n){return this.disabled?()=>{}:this.client.subscribeToConnectionState(n)}}const lt="modulepreload",dt=function(e){return"/"+e},ge={},ae=function(n,t,i){let o=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));o=Promise.allSettled(t.map(h=>{if(h=dt(h),h in ge)return;ge[h]=!0;const p=h.endsWith(".css"),b=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${b}`))return;const w=document.createElement("link");if(w.rel=p?"stylesheet":lt,p||(w.as="script"),w.crossOrigin="",w.href=h,c&&w.setAttribute("nonce",c),document.head.appendChild(w),p)return new Promise((k,T)=>{w.addEventListener("load",k),w.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${h}`)))})}))}function d(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return o.then(l=>{for(const c of l||[])c.status==="rejected"&&d(c.reason);return n().catch(d)})},ut="https://elegant-avocet-484.convex.cloud",O=new ct(ut),mt=7,ht=17,ie=25,ye=4;function ft(e,n=[],t,i={}){let o=n.map(r=>({...r,recurring:r.recurring??!1})),d=!1,l=null,c=null,h=0;const{lockedSessionId:p=null}=i;let b={show24Hours:!1,firstDayOfWeek:1};function w(){return b.show24Hours?{start:0,end:23}:{start:mt,end:ht}}function k(){const r=new Date,a=r.getDay(),u=b.firstDayOfWeek;let m=a-u;m<0&&(m+=7);const g=new Date(r);g.setDate(r.getDate()-m+h*7);const E=[];for(let y=0;y<7;y++){const L=new Date(g);L.setDate(g.getDate()+y),E.push(L)}return E}function T(r){return r===0?"12 AM":r===12?"12 PM":r<12?`${r} AM`:`${r-12} PM`}function Be(r,a,u,m){const g=(E,y)=>`${E}:${y.toString().padStart(2,"0")}`;return`${g(r,a)}–${g(u,m)}`}function Se(r){return r.getDate()}function De(r){return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][r.getDay()]}function Ne(r){return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][r.getMonth()]}function Z(r,a=0){const{start:u}=w(),m=r-u,g=a/60;return(m+g)*ie}function Ae(){const r=new Date,a=r.getHours(),u=r.getMinutes(),{start:m,end:g}=w();return a<m||a>g?null:Z(a,u)}function _e(){const r=k(),a=new Date;return a.setHours(0,0,0,0),r.some(u=>{const m=new Date(u);return m.setHours(0,0,0,0),m.getTime()===a.getTime()})}function He(){const r=k(),a=new Date;a.setHours(0,0,0,0);for(let u=0;u<r.length;u++){const m=new Date(r[u]);if(m.setHours(0,0,0,0),m.getTime()===a.getTime())return u}return-1}function x(){e.innerHTML="",e.className="schedule-editor";const r=k(),a=document.createElement("div");a.className="schedule-card";const u=document.createElement("div");u.className="schedule-info-bar";const m=document.createElement("div");m.className="schedule-info-left";const g=document.createElement("span");g.className="schedule-next-session",g.id="schedule-next-session-text",g.textContent=o.length>0?"Next session begins...":"No sessions scheduled",m.appendChild(g);const E=document.createElement("div");E.className="schedule-info-right";const y=document.createElement("button");y.className="schedule-nav-btn",y.innerHTML="‹",y.setAttribute("aria-label","Previous week"),h<=0&&(y.disabled=!0,y.classList.add("schedule-nav-btn-disabled")),y.addEventListener("click",()=>{h>0&&(h--,x())});const L=document.createElement("button");L.className="schedule-nav-btn",L.innerHTML="›",L.setAttribute("aria-label","Next week"),h>=ye&&(L.disabled=!0,L.classList.add("schedule-nav-btn-disabled")),L.addEventListener("click",()=>{h<ye&&(h++,x())}),E.appendChild(y),E.appendChild(L),u.appendChild(m),u.appendChild(E),a.appendChild(u);const C=document.createElement("div");C.className="schedule-grid-container";const z=document.createElement("div");z.className="schedule-time-column";const he=document.createElement("div");he.className="schedule-time-header",z.appendChild(he);const{start:F,end:q}=w();for(let B=F;B<=q;B++){const N=document.createElement("div");N.className="schedule-time-label",N.textContent=T(B),z.appendChild(N)}C.appendChild(z);for(let B=0;B<7;B++){const N=r[B],J=document.createElement("div");J.className="schedule-day-column";const Y=document.createElement("div");Y.className="schedule-day-header";const fe=document.createElement("span");fe.textContent=`${De(N)} ${Se(N)} `;const te=document.createElement("span");te.className="schedule-month",te.textContent=Ne(N),Y.appendChild(fe),Y.appendChild(te),J.appendChild(Y);const $=document.createElement("div");$.className="schedule-cells-container",$.dataset.day=B;for(let f=F;f<=q;f++){const I=document.createElement("div");I.className="schedule-cell",I.dataset.day=B,I.dataset.hour=f,$.appendChild(I)}const qe=N.getDay();o.filter(f=>f.day===qe).forEach(f=>{if(f.endHour<=F||f.startHour>q)return;const I=Z(Math.max(f.startHour,F),f.startHour>=F?f.startMinute:0),pe=Z(Math.min(f.endHour,q+1),f.endHour<=q?f.endMinute:0)-I;if(pe<=0)return;const S=document.createElement("div");S.className="schedule-block",f.recurring&&S.classList.add("schedule-block-recurring"),f.id===p&&S.classList.add("schedule-block-locked"),S.dataset.sessionId=f.id,S.style.top=`${I}px`,S.style.height=`${pe}px`;const X=document.createElement("div");X.className="schedule-block-content";const G=document.createElement("div");G.className="schedule-block-header";const ne=document.createElement("span");if(ne.className="schedule-block-title",ne.textContent=f.title||"Blocked",G.appendChild(ne),f.recurring){const A=document.createElement("span");A.className="schedule-block-repeat",A.textContent="↻",G.appendChild(A)}const se=document.createElement("span");se.className="schedule-block-time",se.textContent=Be(f.startHour,f.startMinute,f.endHour,f.endMinute),X.appendChild(G),X.appendChild(se),S.appendChild(X),S.addEventListener("click",A=>{A.stopPropagation(),f.id!==p&&(f.recurring=!f.recurring,t(o),x())}),S.addEventListener("contextmenu",A=>{A.preventDefault(),A.stopPropagation(),f.id!==p&&(o=o.filter(je=>je.id!==f.id),t(o),x())}),$.appendChild(S)});const Qe=He();if(B===Qe&&_e()){const f=Ae();if(f!==null){const I=document.createElement("div");I.className="schedule-now-line",I.style.top=`${f}px`,$.appendChild(I)}}J.appendChild($),C.appendChild(J)}a.appendChild(C),e.appendChild(a),C.addEventListener("mousedown",Pe),C.addEventListener("mousemove",Me),C.addEventListener("mouseup",ee),C.addEventListener("mouseleave",ee),C.addEventListener("touchstart",$e,{passive:!1}),C.addEventListener("touchmove",Re,{passive:!1}),C.addEventListener("touchend",Ue)}function me(r){const a=r.target.closest(".schedule-cell");return a?{day:parseInt(a.dataset.day),hour:parseInt(a.dataset.hour)}:null}function Pe(r){if(r.button!==0||r.target.closest(".schedule-block"))return;const a=me(r);a&&(d=!0,l=a,c=a,j())}function Me(r){if(!d)return;const a=me(r);a&&a.day===l.day&&(c=a,j())}function j(){if(document.querySelectorAll(".schedule-cell-dragging").forEach(u=>{u.classList.remove("schedule-cell-dragging")}),!d||!l||!c)return;const r=Math.min(l.hour,c.hour),a=Math.max(l.hour,c.hour);document.querySelectorAll(`.schedule-cell[data-day="${l.day}"]`).forEach(u=>{const m=parseInt(u.dataset.hour);m>=r&&m<=a&&u.classList.add("schedule-cell-dragging")})}function ee(r){if(d){if(document.querySelectorAll(".schedule-cell-dragging").forEach(a=>{a.classList.remove("schedule-cell-dragging")}),l&&c&&l.day===c.day){const a=Math.min(l.hour,c.hour),u=Math.max(l.hour,c.hour),g=k()[l.day].getDay();if(!o.some(y=>y.day===g&&!(u<y.startHour||a>=y.endHour))&&u>=a){const y={id:crypto.randomUUID(),day:g,startHour:a,startMinute:0,endHour:u+1,endMinute:0,recurring:!1,title:"Blocked"};o.push(y),t(o),x()}}d=!1,l=null,c=null}}let H=null,M=null;function $e(r){const a=r.target.closest(".schedule-block");if(a){r.preventDefault(),M=a;const E=a.dataset.sessionId;if(E===p)return;H=setTimeout(()=>{o=o.filter(y=>y.id!==E),t(o),x(),M=null},500);return}r.preventDefault();const u=r.touches[0],m=document.elementFromPoint(u.clientX,u.clientY);if(!(m!=null&&m.classList.contains("schedule-cell")))return;const g={day:parseInt(m.dataset.day),hour:parseInt(m.dataset.hour)};d=!0,l=g,c=g,j()}function Re(r){if(H&&(clearTimeout(H),H=null),r.preventDefault(),!d)return;const a=r.touches[0],u=document.elementFromPoint(a.clientX,a.clientY);if(!(u!=null&&u.classList.contains("schedule-cell")))return;const m={day:parseInt(u.dataset.day),hour:parseInt(u.dataset.hour)};m.day===l.day&&(c=m,j())}function Ue(r){if(M&&H){clearTimeout(H),H=null;const a=M.dataset.sessionId;if(a&&a!==p){const u=o.find(m=>m.id===a);u&&(u.recurring=!u.recurring,t(o),x())}M=null;return}M=null,ee()}function Ve(r){o=r.map(a=>({...a,recurring:a.recurring??!1})),x()}function Oe(){return[...o]}function We(r){const a=document.getElementById("schedule-next-session-text");a&&(a.textContent=r)}function Fe(r){b={...b,...r},x()}return x(),{setSessions:Ve,getSessions:Oe,render:x,setNextSessionText:We,setPreferences:Fe}}if(!document.getElementById("schedule-editor-styles")){const e=document.createElement("style");e.id="schedule-editor-styles",e.textContent=`
    .schedule-editor {
      width: 100%;
    }

    .schedule-card {
      background: #f6f6f6;
      border-radius: 5px;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @media (prefers-color-scheme: dark) {
      .schedule-card {
        background: var(--slate-dark, #2a2a2a);
      }
    }

    .schedule-info-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .schedule-info-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .schedule-info-right {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-right: 5px;
    }

    .schedule-next-session {
      font-size: 14px;
      color: var(--text-color, #000);
    }

    .schedule-nav-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 16px;
      color: var(--text-color, #000);
      line-height: 1;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .schedule-nav-btn:hover:not(:disabled) {
      opacity: 0.7;
    }

    .schedule-nav-btn-disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .schedule-grid-container {
      display: flex;
      width: 100%;
      user-select: none;
    }

    .schedule-time-column {
      display: flex;
      flex-direction: column;
      width: 46px;
      flex-shrink: 0;
      margin-left: -10px;
    }

    .schedule-time-header {
      height: 17px;
    }

    .schedule-time-label {
      height: ${ie}px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      font-size: 10px;
      color: var(--text-color, #000);
    }

    .schedule-day-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .schedule-day-header {
      height: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--text-color, #000);
      white-space: nowrap;
    }

    .schedule-month {
      color: #868686;
    }

    .schedule-cells-container {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .schedule-cell {
      height: ${ie}px;
      border: 0.2px solid #424242;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .schedule-cell:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    @media (prefers-color-scheme: dark) {
      .schedule-cell {
        border-color: #555;
      }
      .schedule-cell:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    .schedule-cell-dragging {
      background: rgba(153, 255, 115, 0.3) !important;
    }

    /* Session blocks */
    .schedule-block {
      position: absolute;
      left: 0;
      right: 0;
      background: #fff;
      border: 0.2px solid #000;
      border-radius: 5px;
      padding: 4px;
      cursor: pointer;
      overflow: hidden;
      z-index: 10;
    }

    .schedule-block:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .schedule-block-recurring {
      background: linear-gradient(
        90deg,
        rgba(153, 255, 115, 0.15) 0%,
        rgba(153, 255, 115, 0.15) 100%
      ), #fff;
    }

    .schedule-block-locked {
      background: rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
      cursor: not-allowed;
    }

    @media (prefers-color-scheme: dark) {
      .schedule-block {
        background: var(--slate-dark, #2a2a2a);
        border-color: #555;
      }
      .schedule-block-recurring {
        background: linear-gradient(
          90deg,
          rgba(153, 255, 115, 0.2) 0%,
          rgba(153, 255, 115, 0.2) 100%
        ), var(--slate-dark, #2a2a2a);
      }
    }

    .schedule-block-content {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .schedule-block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .schedule-block-title {
      font-size: 10px;
      color: var(--text-color, #000);
      font-weight: 400;
    }

    .schedule-block-repeat {
      font-size: 8px;
      color: var(--text-color, #000);
      opacity: 0.7;
    }

    .schedule-block-time {
      font-size: 6px;
      color: #565656;
    }

    /* Now line */
    .schedule-now-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 0;
      border-top: 1px solid #ef4444;
      z-index: 5;
      pointer-events: none;
    }

    .schedule-now-line::before {
      content: '';
      position: absolute;
      left: -4px;
      top: -4px;
      width: 7px;
      height: 7px;
      background: #ef4444;
      border-radius: 50%;
    }
  `,document.head.appendChild(e)}let re=Notification.permission,_=[];function pt(){return"Notification"in window}function Ee(){return re}async function gt(){if(!pt())return"denied";const e=await Notification.requestPermission();return re=e,e}function be(e,n={}){return re!=="granted"?null:new Notification(e,{icon:"/icon.png",badge:"/icon.png",...n})}function we(e,n,t,i){yt(e);const o=Date.now(),d=i-o;if(d<=0){be(n,{body:t});return}const l=setTimeout(()=>{be(n,{body:t}),_=_.filter(c=>c.id!==e)},d);_.push({id:e,timeoutId:l,triggerAt:i})}function yt(e){const n=_.find(t=>t.id===e);n&&(clearTimeout(n.timeoutId),_=_.filter(t=>t.id!==e))}function bt(){for(const e of _)clearTimeout(e.timeoutId);_=[]}function wt(e){bt();const n=new Date,t=n.getDay(),i=n.getHours()*60+n.getMinutes();for(const o of e){const d=o.startHour*60+o.startMinute,l=o.endHour*60+o.endMinute;let c=o.day-t;(c<0||c===0&&d<=i)&&(c+=7);const h=new Date(n);h.setDate(h.getDate()+c),h.setHours(o.startHour,o.startMinute,0,0),we(`start-${o.id}`,"Blocking started","Time to set up Screen Time. Mash random keys for the PIN!",h.getTime());let p=o.day-t;(p<0||p===0&&l<=i)&&(p+=7);const b=new Date(n);b.setDate(b.getDate()+p),b.setHours(o.endHour,o.endMinute,0,0),we(`end-${o.id}`,"Blocking ended","Your recovery password is now available.",b.getTime())}}let s=null,P=[],v=null,D=null,oe=null,ce=!1,V=null;async function vt(){if(Xe(),!Ge())return window.location.href="index.html",!1;try{const e=Ke();if(e){O.setAuth(()=>e);const{api:n}=await ae(async()=>{const{api:i}=await import("./api-BIFMIXWG.js");return{api:i}},__vite__mapDeps([0,1])),t=await O.query(n.users.current);if(t!=null&&t.email){const i=document.getElementById("settings-user-email");i&&(i.textContent=t.email)}console.log("About to check admin, api.admin:",n.admin);try{const i=await O.query(n.admin.isAdmin);if(console.log("Admin check result:",i),i){const o=document.getElementById("admin-section");console.log("Found admin section:",o),o&&(o.classList.remove("hidden"),console.log("Admin section shown"))}}catch(i){console.error("Admin check failed:",i)}}}catch(e){console.error("Failed to fetch user:",e)}return v=Ze(),!0}function W(e){var n;document.querySelectorAll(".view").forEach(t=>{t.classList.remove("active")}),(n=document.getElementById(e))==null||n.classList.add("active"),kt()}function kt(e){document.querySelectorAll(".nav-item[data-nav]").forEach(t=>t.classList.remove("active"))}document.addEventListener("navigate-settings",()=>{xe(),W("view-settings")});function xe(){Ce(),xt();const e=document.getElementById("settings-credential-display"),n=document.getElementById("change-credentials-btn"),t=document.getElementById("credentials-blocked-notice");s!=null&&s.screenTimeAppleId&&(s!=null&&s.hasStoredPassword)?e.textContent=`${s.screenTimeAppleId} • ••••••••`:s!=null&&s.screenTimeAppleId?e.textContent=`${s.screenTimeAppleId} (no password)`:e.textContent="Not configured",s!=null&&s.isBlocking?(n.setAttribute("disabled","true"),t.classList.remove("hidden")):(n.removeAttribute("disabled"),t.classList.add("hidden"))}function Et(){s!=null&&s.isBlocking||(document.getElementById("edit-apple-id").value=(s==null?void 0:s.screenTimeAppleId)||"",document.getElementById("edit-password").value="",document.getElementById("credentials-modal").classList.remove("hidden"))}function K(){document.getElementById("credentials-modal").classList.add("hidden")}document.getElementById("change-credentials-btn").addEventListener("click",Et);document.getElementById("modal-close").addEventListener("click",K);document.getElementById("modal-cancel").addEventListener("click",K);document.getElementById("credentials-modal").addEventListener("click",e=>{e.target.id==="credentials-modal"&&K()});document.addEventListener("navigate-home",()=>{ue()});document.getElementById("settings-logout").addEventListener("click",()=>{ze(),localStorage.removeItem("blocker_token"),window.location.href="index.html"});document.getElementById("enable-notifications-btn").addEventListener("click",async()=>{await gt(),Ce()});document.getElementById("close-session-btn").addEventListener("click",async()=>{ce=!1,V=null,await Q()});function Ce(){const e=document.getElementById("notification-status"),n=document.getElementById("enable-notifications-btn");Ee()==="granted"?(e.textContent="Enabled",e.classList.add("enabled"),n.classList.add("hidden")):(e.textContent="Disabled",e.classList.remove("enabled"),n.classList.remove("hidden"))}function le(){return{show24Hours:localStorage.getItem("blocker_show24h")==="true",firstDayOfWeek:parseInt(localStorage.getItem("blocker_first_day")||"1")}}function Ie(e,n){if(localStorage.setItem(e,n),D){const t=le();D.setPreferences(t)}}function xt(){const e=le(),n=document.getElementById("toggle-24h");e.show24Hours?n.classList.add("active"):n.classList.remove("active");const t=document.getElementById("first-day-of-week");t.value=e.firstDayOfWeek.toString()}document.getElementById("toggle-24h").addEventListener("click",()=>{const n=document.getElementById("toggle-24h").classList.toggle("active");Ie("blocker_show24h",n.toString())});document.getElementById("first-day-of-week").addEventListener("change",e=>{Ie("blocker_first_day",e.target.value)});function Te(e,n=null){const t=document.getElementById("app-header");t&&(t.isBlocking=e,t.activeUntil=n)}document.getElementById("schedule-help-close").addEventListener("click",()=>{document.getElementById("schedule-help-popup").classList.add("hidden")});document.getElementById("schedule-help-popup").addEventListener("click",e=>{e.target.id==="schedule-help-popup"&&document.getElementById("schedule-help-popup").classList.add("hidden")});document.querySelectorAll(".todo-checkbox").forEach(e=>{e.addEventListener("click",()=>{e.classList.contains("disabled")||(e.classList.toggle("checked"),de())})});function de(){const e=document.getElementById("checkbox-create-account"),n=document.getElementById("checkbox-credentials"),t=document.getElementById("go-to-schedule-btn"),i=e.classList.contains("checked"),o=n.classList.contains("checked");i&&o?t.removeAttribute("disabled"):t.setAttribute("disabled","true")}function Le(){const e=document.getElementById("apple-id").value.trim(),n=document.getElementById("password").value,t=document.getElementById("checkbox-credentials"),i=document.getElementById("checkbox-create-account");e&&n?(t.classList.add("checked"),i.classList.add("checked"),i.classList.add("disabled")):(t.classList.remove("checked"),s!=null&&s.screenTimeAppleId||i.classList.remove("disabled")),de()}document.getElementById("apple-id").addEventListener("input",Le);document.getElementById("password").addEventListener("input",Le);function Ct(e){const t=e-new Date,i=Math.floor(t/(1e3*60*60*24)),o=Math.floor(t%(1e3*60*60*24)/(1e3*60*60));return i===0?o===0?"less than an hour":`${o} hour${o===1?"":"s"}`:i===1?"tomorrow":`in ${i} days`}async function It(e,n){const t=new Date;new Date(e)-t<=0&&(clearInterval(oe),ce=!0,V=n,await Tt())}async function Tt(){const e=document.getElementById("session-ended-title");V!=null&&V.title?e.textContent=`Your ${V.title} session has ended`:e.textContent="Your session has ended";const n=document.getElementById("revealed-email");n.textContent=(s==null?void 0:s.screenTimeAppleId)||"—";const t=document.getElementById("revealed-password");try{const i=await et(v);i.blocked?t.textContent="Still blocked":t.textContent=i.password||"—"}catch(i){console.error("Failed to fetch password:",i),t.textContent="Error loading"}Te(!1,null),W("view-session-ended")}function Lt(e,n){const t=document.getElementById("blocking-session-title"),i=document.getElementById("blocking-session-time");if(!e){t.textContent="Your session has started",i.innerHTML="";return}const o=e.title||"Blocked";t.textContent=`Your ${o} session has started`;const d=new Date(n);d.setHours(e.startHour,e.startMinute,0);const c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()],h=d.getDate(),p=(k,T)=>`${k}:${T.toString().padStart(2,"0")}`,b=p(e.startHour,e.startMinute),w=p(e.endHour,e.endMinute);i.innerHTML=`<span class="date">${c} ${h}</span> ${b}-${w}`}function ue(){clearInterval(oe);const e=P.length>0?P:(s==null?void 0:s.sessions)||[],n=(s==null?void 0:s.screenTimeAppleId)&&(s==null?void 0:s.hasStoredPassword);if(Te((s==null?void 0:s.isBlocking)||!1,(s==null?void 0:s.activeUntil)||null),!n){W("view-setup");return}if(!ce){if(s!=null&&s.isBlocking){W("view-blocking");const t=s.activeSessionId?e.find(i=>i.id===s.activeSessionId):null;Lt(t,s.activeUntil),oe=setInterval(()=>It(s.activeUntil,t),1e3)}else{W("view-idle");const t=(s==null?void 0:s.activeSessionId)||null;if(D?D.setSessions(e):(D=ft(document.getElementById("schedule-editor-idle"),e,async i=>{if(P=i,v)try{await tt(v,P),await Q()}catch(o){console.error("Failed to auto-save:",o)}},{lockedSessionId:t}),D.setPreferences(le())),s!=null&&s.nextSession){const i=new Date(s.nextSession.startsAt),o=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1});D.setNextSessionText(`Next session begins ${o[s.nextSession.day]} ${d} (${Ct(i)})`)}else e.length===0?D.setNextSessionText("No sessions scheduled"):D.setNextSessionText("")}e.length>0&&Ee()==="granted"&&wt(e)}}async function Q(){try{if(v){if(s=await ve(v),s!=null&&s.sessions&&(P=s.sessions),s)try{const{api:i}=await ae(async()=>{const{api:d}=await import("./api-BIFMIXWG.js");return{api:d}},__vite__mapDeps([0,1]));await O.query(i.schedules.getVaultToken)||(await O.mutation(i.schedules.setVaultToken,{vaultToken:v}),console.log("Synced vault token to Convex"))}catch(i){console.warn("Could not sync vault token to Convex:",i)}}else s=null;const e=document.getElementById("checkbox-credentials"),n=document.getElementById("checkbox-create-account");s!=null&&s.screenTimeAppleId?(document.getElementById("apple-id").value=s.screenTimeAppleId,s!=null&&s.hasStoredPassword?(document.getElementById("password").placeholder="Password stored (leave blank to keep)",e.classList.add("checked"),n.classList.add("checked"),n.classList.add("disabled")):e.classList.remove("checked")):n.classList.remove("disabled");const t=document.getElementById("setup-check");s!=null&&s.screenTimeAppleId&&(s!=null&&s.hasStoredPassword)?t.classList.remove("hidden"):t.classList.add("hidden"),de(),ue()}catch(e){console.error("Failed to load vault:",e)}}document.getElementById("go-to-schedule-btn").addEventListener("click",async()=>{const e=document.getElementById("apple-id").value.trim(),n=document.getElementById("password").value;if(e&&n)try{v||(v=Je()),await ke(v,{screenTimeAppleId:e,screenTimePassword:n,sessions:P}),Ye(v);const{api:t}=await ae(async()=>{const{api:i}=await import("./api-BIFMIXWG.js");return{api:i}},__vite__mapDeps([0,1]));await O.mutation(t.schedules.setVaultToken,{vaultToken:v}),await Q()}catch(t){alert("Failed to save credentials: "+t.message);return}W("view-idle"),ue()});document.getElementById("save-credentials").addEventListener("click",async()=>{const e=document.getElementById("edit-apple-id").value.trim(),n=document.getElementById("edit-password").value,t=document.getElementById("save-credentials");if(!e){alert("Please enter an Apple ID");return}try{if(!v){alert("No vault token - please complete setup first");return}t.setAttribute("disabled","true"),t.textContent="Saving...";const i={screenTimeAppleId:e};n&&(i.screenTimePassword=n),await ke(v,i),v&&(s=await ve(v),s!=null&&s.sessions&&(P=s.sessions)),K(),xe(),t.removeAttribute("disabled"),t.textContent="Save"}catch(i){t.removeAttribute("disabled"),t.textContent="Save",alert("Failed to save: "+i.message)}});setInterval(async()=>{s!=null&&s.isBlocking&&await Q()},3e4);async function Bt(){await vt()&&await Q()}Bt();
