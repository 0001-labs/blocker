const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/api-BIFMIXWG.js","assets/paginated_query_client-DGc-MdvA.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ze,g as Ee,a as Je,s as xe,b as Ye,i as Xe,d as Ge,e as Ke,f as Ze,h as et,j as tt}from"./app-header-D4RMZK07.js";import"https://cdn.jsdelivr.net/npm/ds-one@alpha/dist/ds-one.bundle.min.js";import{v as nt,B as st,P as it,g as U,s as ot}from"./paginated_query_client-DGc-MdvA.js";var at=Object.defineProperty,rt=(t,n,e)=>n in t?at(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,V=(t,n,e)=>rt(t,typeof n!="symbol"?n+"":n,e);class ct{constructor(n,e={}){V(this,"listeners"),V(this,"_client"),V(this,"_paginatedClient"),V(this,"callNewListenersWithCurrentValuesTimer"),V(this,"_closed"),V(this,"_disabled"),e.skipConvexDeploymentUrlCheck!==!0&&nt(n);const{disabled:i,...o}=e;this._closed=!1,this._disabled=!!i,typeof window>"u"&&!("unsavedChangesWarning"in o)&&(o.unsavedChangesWarning=!1),this.disabled||(this._client=new st(n,()=>{},o),this._paginatedClient=new it(this._client,u=>this._transition(u))),this.listeners=new Set}get closed(){return this._closed}get client(){if(this._client)return this._client;throw new Error("ConvexClient is disabled")}get paginatedClient(){if(this._paginatedClient)return this._paginatedClient;throw new Error("ConvexClient is disabled")}get disabled(){return this._disabled}onUpdate(n,e,i,o){if(this.disabled)return this.createDisabledUnsubscribe();const{queryToken:u,unsubscribe:d}=this.client.subscribe(U(n),e),l={queryToken:u,callback:i,onError:o,unsubscribe:d,hasEverRun:!1,query:n,args:e,paginationOptions:void 0};this.listeners.add(l),this.queryResultReady(u)&&this.callNewListenersWithCurrentValuesTimer===void 0&&(this.callNewListenersWithCurrentValuesTimer=setTimeout(()=>this.callNewListenersWithCurrentValues(),0));const m={unsubscribe:()=>{this.closed||(this.listeners.delete(l),d())},getCurrentValue:()=>this.client.localQueryResultByToken(u),getQueryLogs:()=>this.client.localQueryLogs(u)},p=m.unsubscribe;return Object.assign(p,m),p}onPaginatedUpdate_experimental(n,e,i,o,u){if(this.disabled)return this.createDisabledUnsubscribe();const d={initialNumItems:i.initialNumItems,id:-1},{paginatedQueryToken:l,unsubscribe:m}=this.paginatedClient.subscribe(U(n),e,d),p={queryToken:l,callback:o,onError:u,unsubscribe:m,hasEverRun:!1,query:n,args:e,paginationOptions:d};this.listeners.add(p),this.paginatedClient.localQueryResultByToken(l)&&this.callNewListenersWithCurrentValuesTimer===void 0&&(this.callNewListenersWithCurrentValuesTimer=setTimeout(()=>this.callNewListenersWithCurrentValues(),0));const b={unsubscribe:()=>{this.closed||(this.listeners.delete(p),m())},getCurrentValue:()=>this.paginatedClient.localQueryResult(U(n),e,d),getQueryLogs:()=>[]},w=b.unsubscribe;return Object.assign(w,b),w}callNewListenersWithCurrentValues(){this.callNewListenersWithCurrentValuesTimer=void 0,this._transition({queries:[],paginatedQueries:[]},!0)}queryResultReady(n){return this.client.hasLocalQueryResultByToken(n)}createDisabledUnsubscribe(){const n=()=>{};return Object.assign(n,{unsubscribe:n,getCurrentValue:()=>{},getQueryLogs:()=>{}}),n}async close(){if(!this.disabled)return this.listeners.clear(),this._closed=!0,this._paginatedClient&&(this._paginatedClient=void 0),this.client.close()}getAuth(){if(!this.disabled)return this.client.getCurrentAuthClaims()}setAuth(n,e){this.disabled||this.client.setAuth(n,e??(()=>{}))}setAdminAuth(n,e){if(this.closed)throw new Error("ConvexClient has already been closed.");this.disabled||this.client.setAdminAuth(n,e)}_transition({queries:n,paginatedQueries:e},i=!1){const o=[...n.map(u=>u.token),...e.map(u=>u.token)];for(const u of this.listeners){const{callback:d,queryToken:l,onError:m,hasEverRun:p}=u,b=ot(l),w=b?!!this.paginatedClient.localQueryResultByToken(l):this.client.hasLocalQueryResultByToken(l);if(o.includes(l)||i&&!p&&w){u.hasEverRun=!0;let k;try{b?k=this.paginatedClient.localQueryResultByToken(l):k=this.client.localQueryResultByToken(l)}catch(L){if(!(L instanceof Error))throw L;m?m(L,"Second argument to onUpdate onError is reserved for later use"):Promise.reject(L);continue}d(k,"Second argument to onUpdate callback is reserved for later use")}}}async mutation(n,e,i){if(this.disabled)throw new Error("ConvexClient is disabled");return await this.client.mutation(U(n),e,i)}async action(n,e){if(this.disabled)throw new Error("ConvexClient is disabled");return await this.client.action(U(n),e)}async query(n,e){if(this.disabled)throw new Error("ConvexClient is disabled");const i=this.client.localQueryResult(U(n),e);return i!==void 0?Promise.resolve(i):new Promise((o,u)=>{const{unsubscribe:d}=this.onUpdate(n,e,l=>{d(),o(l)},l=>{d(),u(l)})})}connectionState(){if(this.disabled)throw new Error("ConvexClient is disabled");return this.client.connectionState()}subscribeToConnectionState(n){return this.disabled?()=>{}:this.client.subscribeToConnectionState(n)}}const lt="modulepreload",dt=function(t){return"/"+t},be={},re=function(n,e,i){let o=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),l=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));o=Promise.allSettled(e.map(m=>{if(m=dt(m),m in be)return;be[m]=!0;const p=m.endsWith(".css"),b=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${b}`))return;const w=document.createElement("link");if(w.rel=p?"stylesheet":lt,p||(w.as="script"),w.crossOrigin="",w.href=m,l&&w.setAttribute("nonce",l),document.head.appendChild(w),p)return new Promise((k,L)=>{w.addEventListener("load",k),w.addEventListener("error",()=>L(new Error(`Unable to preload CSS for ${m}`)))})}))}function u(d){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=d,window.dispatchEvent(l),!l.defaultPrevented)throw d}return o.then(d=>{for(const l of d||[])l.status==="rejected"&&u(l.reason);return n().catch(u)})},ut="https://elegant-avocet-484.convex.cloud",W=new ct(ut),mt=7,ht=17,oe=25,we=4;function ft(t,n=[],e,i={}){let o=n.map(a=>({...a,recurring:a.recurring??!1})),u=!1,d=null,l=null,m=0;const{lockedSessionId:p=null}=i;let b={show24Hours:!1,firstDayOfWeek:1};function w(){return b.show24Hours?{start:0,end:23}:{start:mt,end:ht}}function k(){const a=new Date,r=a.getDay(),c=b.firstDayOfWeek;let h=r-c;h<0&&(h+=7);const g=new Date(a);g.setDate(a.getDate()-h+m*7);const E=[];for(let y=0;y<7;y++){const x=new Date(g);x.setDate(g.getDate()+y),E.push(x)}return E}function L(a){return a===0?"12 AM":a===12?"12 PM":a<12?`${a} AM`:`${a-12} PM`}function Be(a,r,c,h){const g=(E,y)=>`${E}:${y.toString().padStart(2,"0")}`;return`${g(a,r)}–${g(c,h)}`}function Se(a){return a.getDate()}function De(a){return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][a.getDay()]}function Ne(a){return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][a.getMonth()]}function ee(a,r=0){const{start:c}=w(),h=a-c,g=r/60;return(h+g)*oe}function Ae(){const a=new Date,r=a.getHours(),c=a.getMinutes(),{start:h,end:g}=w();return r<h||r>g?null:ee(r,c)}function _e(){const a=k(),r=new Date;return r.setHours(0,0,0,0),a.some(c=>{const h=new Date(c);return h.setHours(0,0,0,0),h.getTime()===r.getTime()})}function He(){const a=k(),r=new Date;r.setHours(0,0,0,0);for(let c=0;c<a.length;c++){const h=new Date(a[c]);if(h.setHours(0,0,0,0),h.getTime()===r.getTime())return c}return-1}function C(){t.innerHTML="",t.className="schedule-editor";const a=k(),r=document.createElement("div");r.className="schedule-card";const c=document.createElement("div");c.className="schedule-info-bar";const h=document.createElement("div");h.className="schedule-info-left";const g=document.createElement("span");g.className="schedule-next-session",g.id="schedule-next-session-text",g.textContent=o.length>0?"Next session begins...":"No sessions scheduled",h.appendChild(g);const E=document.createElement("div");E.className="schedule-info-right";const y=document.createElement("button");y.className="schedule-nav-btn",y.innerHTML="‹",y.setAttribute("aria-label","Previous week"),m<=0&&(y.disabled=!0,y.classList.add("schedule-nav-btn-disabled")),y.addEventListener("click",()=>{m>0&&(m--,C())});const x=document.createElement("button");x.className="schedule-nav-btn",x.innerHTML="›",x.setAttribute("aria-label","Next week"),m>=we&&(x.disabled=!0,x.classList.add("schedule-nav-btn-disabled")),x.addEventListener("click",()=>{m<we&&(m++,C())}),E.appendChild(y),E.appendChild(x),c.appendChild(h),c.appendChild(E),r.appendChild(c);const I=document.createElement("div");I.className="schedule-grid-container";const z=document.createElement("div");z.className="schedule-time-column";const pe=document.createElement("div");pe.className="schedule-time-header",z.appendChild(pe);const{start:F,end:q}=w();for(let B=F;B<=q;B++){const N=document.createElement("div");N.className="schedule-time-label",N.textContent=L(B),z.appendChild(N)}I.appendChild(z);for(let B=0;B<7;B++){const N=a[B],J=document.createElement("div");J.className="schedule-day-column";const Y=document.createElement("div");Y.className="schedule-day-header";const ge=document.createElement("span");ge.textContent=`${De(N)} ${Se(N)} `;const ne=document.createElement("span");ne.className="schedule-month",ne.textContent=Ne(N),Y.appendChild(ge),Y.appendChild(ne),J.appendChild(Y);const R=document.createElement("div");R.className="schedule-cells-container",R.dataset.day=String(B);for(let f=F;f<=q;f++){const T=document.createElement("div");T.className="schedule-cell",T.dataset.day=String(B),T.dataset.hour=String(f),R.appendChild(T)}const qe=N.getDay();o.filter(f=>f.day===qe).forEach(f=>{if(f.endHour<=F||f.startHour>q)return;const T=ee(Math.max(f.startHour,F),f.startHour>=F?f.startMinute:0),ye=ee(Math.min(f.endHour,q+1),f.endHour<=q?f.endMinute:0)-T;if(ye<=0)return;const S=document.createElement("div");S.className="schedule-block",f.recurring&&S.classList.add("schedule-block-recurring"),f.id===p&&S.classList.add("schedule-block-locked"),S.dataset.sessionId=f.id,S.style.top=`${T}px`,S.style.height=`${ye}px`;const X=document.createElement("div");X.className="schedule-block-content";const G=document.createElement("div");G.className="schedule-block-header";const se=document.createElement("span");if(se.className="schedule-block-title",se.textContent=f.title||"Blocked",G.appendChild(se),f.recurring){const A=document.createElement("span");A.className="schedule-block-repeat",A.textContent="↻",G.appendChild(A)}const ie=document.createElement("span");ie.className="schedule-block-time",ie.textContent=Be(f.startHour,f.startMinute,f.endHour,f.endMinute),X.appendChild(G),X.appendChild(ie),S.appendChild(X),S.addEventListener("click",A=>{A.stopPropagation(),f.id!==p&&(f.recurring=!f.recurring,e(o),C())}),S.addEventListener("contextmenu",A=>{A.preventDefault(),A.stopPropagation(),f.id!==p&&(o=o.filter(je=>je.id!==f.id),e(o),C())}),R.appendChild(S)});const Qe=He();if(B===Qe&&_e()){const f=Ae();if(f!==null){const T=document.createElement("div");T.className="schedule-now-line",T.style.top=`${f}px`,R.appendChild(T)}}J.appendChild(R),I.appendChild(J)}r.appendChild(I),t.appendChild(r),I.addEventListener("mousedown",Pe),I.addEventListener("mousemove",Me),I.addEventListener("mouseup",te),I.addEventListener("mouseleave",te),I.addEventListener("touchstart",$e,{passive:!1}),I.addEventListener("touchmove",Re,{passive:!1}),I.addEventListener("touchend",Ue)}function fe(a){const c=a.target.closest(".schedule-cell");return c?{day:parseInt(c.dataset.day||"0"),hour:parseInt(c.dataset.hour||"0")}:null}function Pe(a){if(a.button!==0||a.target.closest(".schedule-block"))return;const c=fe(a);c&&(u=!0,d=c,l=c,j())}function Me(a){if(!u)return;const r=fe(a);r&&(d&&r.day!==d.day||(l=r,j()))}function j(){if(document.querySelectorAll(".schedule-cell-dragging").forEach(c=>{c.classList.remove("schedule-cell-dragging")}),!u||!d||!l)return;const a=Math.min(d.hour,l.hour),r=Math.max(d.hour,l.hour);document.querySelectorAll(`.schedule-cell[data-day="${d.day}"]`).forEach(c=>{const h=parseInt(c.dataset.hour||"0");h>=a&&h<=r&&c.classList.add("schedule-cell-dragging")})}function te(a){if(u){if(document.querySelectorAll(".schedule-cell-dragging").forEach(r=>{r.classList.remove("schedule-cell-dragging")}),d&&l&&d.day===l.day){const r=Math.min(d.hour,l.hour),c=Math.max(d.hour,l.hour),g=k()[d.day].getDay();if(!o.some(y=>y.day===g&&!(c<y.startHour||r>=y.endHour))&&c>=r){const y={id:crypto.randomUUID(),day:g,startHour:r,startMinute:0,endHour:c+1,endMinute:0,recurring:!1,title:"Blocked"};o.push(y),e(o),C()}}u=!1,d=null,l=null}}let H=null,$=null;function $e(a){const c=a.target.closest(".schedule-block");if(c){a.preventDefault(),$=c;const y=c.dataset.sessionId;if(y===p)return;H=setTimeout(()=>{o=o.filter(x=>x.id!==y),e(o),C(),$=null},500);return}a.preventDefault();const h=a.touches[0],g=document.elementFromPoint(h.clientX,h.clientY);if(!(g!=null&&g.classList.contains("schedule-cell")))return;const E={day:parseInt(g.dataset.day||"0"),hour:parseInt(g.dataset.hour||"0")};u=!0,d=E,l=E,j()}function Re(a){if(H&&(clearTimeout(H),H=null),a.preventDefault(),!u)return;const r=a.touches[0],c=document.elementFromPoint(r.clientX,r.clientY);if(!(c!=null&&c.classList.contains("schedule-cell")))return;const h={day:parseInt(c.dataset.day||"0"),hour:parseInt(c.dataset.hour||"0")};d&&h.day!==d.day||(l=h,j())}function Ue(a){if($&&H){clearTimeout(H),H=null;const r=$.dataset.sessionId;if(r&&r!==p){const c=o.find(h=>h.id===r);c&&(c.recurring=!c.recurring,e(o),C())}$=null;return}$=null,te()}function Ve(a){o=a.map(r=>({...r,recurring:r.recurring??!1})),C()}function Oe(){return[...o]}function We(a){const r=document.getElementById("schedule-next-session-text");r&&(r.textContent=a)}function Fe(a){b={...b,...a},C()}return C(),{setSessions:Ve,getSessions:Oe,render:C,setNextSessionText:We,setPreferences:Fe}}if(!document.getElementById("schedule-editor-styles")){const t=document.createElement("style");t.id="schedule-editor-styles",t.textContent=`
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
      height: ${oe}px;
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
      height: ${oe}px;
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
  `,document.head.appendChild(t)}let ce=Notification.permission,_=[];function pt(){return"Notification"in window}function Ce(){return ce}async function gt(){if(!pt())return"denied";const t=await Notification.requestPermission();return ce=t,t}function ve(t,n={}){return ce!=="granted"?null:new Notification(t,{icon:"/icon.png",badge:"/icon.png",...n})}function ke(t,n,e,i){yt(t);const o=Date.now(),u=i-o;if(u<=0){ve(n,{body:e});return}const d=setTimeout(()=>{ve(n,{body:e}),_=_.filter(l=>l.id!==t)},u);_.push({id:t,timeoutId:d,triggerAt:i})}function yt(t){const n=_.find(e=>e.id===t);n&&(clearTimeout(n.timeoutId),_=_.filter(e=>e.id!==t))}function bt(){for(const t of _)clearTimeout(t.timeoutId);_=[]}function wt(t){bt();const n=new Date,e=n.getDay(),i=n.getHours()*60+n.getMinutes();for(const o of t){const u=o.startHour*60+o.startMinute,d=o.endHour*60+o.endMinute;let l=o.day-e;(l<0||l===0&&u<=i)&&(l+=7);const m=new Date(n);m.setDate(m.getDate()+l),m.setHours(o.startHour,o.startMinute,0,0),ke(`start-${o.id}`,"Blocking started","Time to set up Screen Time. Mash random keys for the PIN!",m.getTime());let p=o.day-e;(p<0||p===0&&d<=i)&&(p+=7);const b=new Date(n);b.setDate(b.getDate()+p),b.setHours(o.endHour,o.endMinute,0,0),ke(`end-${o.id}`,"Blocking ended","Your recovery password is now available.",b.getTime())}}let s=null,P=[],v=null,D=null,ae=null,le=!1,O=null;async function vt(){if(Xe(),!Ge())return window.location.href="index.html",!1;try{const t=Ke();if(t){W.setAuth(()=>t);const{api:n}=await re(async()=>{const{api:i}=await import("./api-BIFMIXWG.js");return{api:i}},__vite__mapDeps([0,1])),e=await W.query(n.users.current);if(e!=null&&e.email){const i=document.getElementById("settings-user-email");i&&(i.textContent=e.email)}console.log("About to check admin, api.admin:",n.admin);try{const i=await W.query(n.admin.isAdmin);if(console.log("Admin check result:",i),i){const o=document.getElementById("admin-section");console.log("Found admin section:",o),o&&(o.classList.remove("hidden"),console.log("Admin section shown"))}}catch(i){console.error("Admin check failed:",i)}}}catch(t){console.error("Failed to fetch user:",t)}return v=Ze(),!0}function M(t){var n;document.querySelectorAll(".view").forEach(e=>{e.classList.remove("active")}),(n=document.getElementById(t))==null||n.classList.add("active"),kt()}function kt(t){document.querySelectorAll(".nav-item[data-nav]").forEach(e=>e.classList.remove("active"))}document.addEventListener("navigate-settings",()=>{de(),M("view-settings")});function de(){Ie(),xt();const t=document.getElementById("settings-credential-display"),n=document.getElementById("change-credentials-btn"),e=document.getElementById("credentials-blocked-notice");s!=null&&s.screenTimeAppleId&&(s!=null&&s.hasStoredPassword)?t.textContent=`${s.screenTimeAppleId} • ••••••••`:s!=null&&s.screenTimeAppleId?t.textContent=`${s.screenTimeAppleId} (no password)`:t.textContent="Not configured",s!=null&&s.isBlocking?(n.setAttribute("disabled","true"),e.classList.remove("hidden")):(n.removeAttribute("disabled"),e.classList.add("hidden"))}function Et(){s!=null&&s.isBlocking||(document.getElementById("edit-apple-id").value=(s==null?void 0:s.screenTimeAppleId)||"",document.getElementById("edit-password").value="",document.getElementById("credentials-modal").classList.remove("hidden"))}function K(){document.getElementById("credentials-modal").classList.add("hidden")}document.getElementById("change-credentials-btn").addEventListener("click",Et);document.getElementById("modal-close").addEventListener("click",K);document.getElementById("modal-cancel").addEventListener("click",K);document.getElementById("credentials-modal").addEventListener("click",t=>{t.target.id==="credentials-modal"&&K()});document.addEventListener("navigate-home",()=>{he()});document.getElementById("settings-logout").addEventListener("click",()=>{ze(),localStorage.removeItem("blocker_token"),window.location.href="index.html"});document.getElementById("enable-notifications-btn").addEventListener("click",async()=>{await gt(),Ie()});document.getElementById("close-session-btn").addEventListener("click",async()=>{le=!1,O=null,await Q()});function Ie(){const t=document.getElementById("notification-status"),n=document.getElementById("enable-notifications-btn");Ce()==="granted"?(t.textContent="Enabled",t.classList.add("enabled"),n.classList.add("hidden")):(t.textContent="Disabled",t.classList.remove("enabled"),n.classList.remove("hidden"))}function ue(){return{show24Hours:localStorage.getItem("blocker_show24h")==="true",firstDayOfWeek:parseInt(localStorage.getItem("blocker_first_day")||"1")}}function Te(t,n){if(localStorage.setItem(t,n),D){const e=ue();D.setPreferences(e)}}function xt(){const t=ue(),n=document.getElementById("toggle-24h");t.show24Hours?n.classList.add("active"):n.classList.remove("active");const e=document.getElementById("first-day-of-week");e.value=t.firstDayOfWeek.toString()}document.getElementById("toggle-24h").addEventListener("click",()=>{const n=document.getElementById("toggle-24h").classList.toggle("active");Te("blocker_show24h",n.toString())});document.getElementById("first-day-of-week").addEventListener("change",t=>{Te("blocker_first_day",t.target.value)});function Le(t,n=null){const e=document.getElementById("app-header");e&&(e.isBlocking=t,e.activeUntil=n)}document.getElementById("schedule-help-close").addEventListener("click",()=>{document.getElementById("schedule-help-popup").classList.add("hidden")});document.getElementById("schedule-help-popup").addEventListener("click",t=>{t.target.id==="schedule-help-popup"&&document.getElementById("schedule-help-popup").classList.add("hidden")});document.querySelectorAll(".todo-checkbox").forEach(t=>{t.addEventListener("click",()=>{t.classList.contains("disabled")||(t.classList.toggle("checked"),me())})});function me(){const t=document.getElementById("checkbox-create-account"),n=document.getElementById("checkbox-credentials"),e=document.getElementById("go-to-schedule-btn"),i=t.classList.contains("checked"),o=n.classList.contains("checked");i&&o?(e.removeAttribute("disabled"),e.disabled=!1):(e.setAttribute("disabled","true"),e.disabled=!0)}function Z(){const t=document.getElementById("apple-id").value.trim(),n=document.getElementById("password").value,e=document.getElementById("checkbox-credentials"),i=document.getElementById("checkbox-create-account");t&&n?(e.classList.add("checked"),i.classList.add("checked"),i.classList.add("disabled")):(e.classList.remove("checked"),s!=null&&s.screenTimeAppleId||i.classList.remove("disabled")),me()}document.getElementById("apple-id").addEventListener("input",Z);document.getElementById("password").addEventListener("input",Z);document.getElementById("apple-id").addEventListener("change",Z);document.getElementById("password").addEventListener("change",Z);function Ct(t){const e=t-new Date,i=Math.floor(e/(1e3*60*60*24)),o=Math.floor(e%(1e3*60*60*24)/(1e3*60*60));return i===0?o===0?"less than an hour":`${o} hour${o===1?"":"s"}`:i===1?"tomorrow":`in ${i} days`}async function It(t,n){const e=new Date;new Date(t)-e<=0&&(clearInterval(ae),le=!0,O=n,await Tt())}async function Tt(){const t=document.getElementById("session-ended-title");O!=null&&O.title?t.textContent=`Your ${O.title} session has ended`:t.textContent="Your session has ended";const n=document.getElementById("revealed-email");n.textContent=(s==null?void 0:s.screenTimeAppleId)||"—";const e=document.getElementById("revealed-password");try{const i=await et(v);i.blocked?e.textContent="Still blocked":e.textContent=i.password||"—"}catch(i){console.error("Failed to fetch password:",i),e.textContent="Error loading"}Le(!1,null),M("view-session-ended")}function Lt(t,n){const e=document.getElementById("blocking-session-title"),i=document.getElementById("blocking-session-time");if(!t){e.textContent="Your session has started",i.innerHTML="";return}const o=t.title||"Blocked";e.textContent=`Your ${o} session has started`;const u=new Date(n);u.setHours(t.startHour,t.startMinute,0);const l=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][u.getMonth()],m=u.getDate(),p=(k,L)=>`${k}:${L.toString().padStart(2,"0")}`,b=p(t.startHour,t.startMinute),w=p(t.endHour,t.endMinute);i.innerHTML=`<span class="date">${l} ${m}</span> ${b}-${w}`}function he(){clearInterval(ae);const t=P.length>0?P:(s==null?void 0:s.sessions)||[],n=(s==null?void 0:s.screenTimeAppleId)&&(s==null?void 0:s.hasStoredPassword);if(Le((s==null?void 0:s.isBlocking)||!1,(s==null?void 0:s.activeUntil)||null),!n){M("view-setup");return}if(!le){if(s!=null&&s.isBlocking){M("view-blocking");const e=s.activeSessionId?t.find(i=>i.id===s.activeSessionId):null;Lt(e,s.activeUntil),ae=setInterval(()=>It(s.activeUntil,e),1e3)}else{M("view-idle");const e=(s==null?void 0:s.activeSessionId)||null;if(D?D.setSessions(t):(D=ft(document.getElementById("schedule-editor-idle"),t,async i=>{if(P=i,v)try{await tt(v,P),await Q()}catch(o){console.error("Failed to auto-save:",o)}},{lockedSessionId:e}),D.setPreferences(ue())),s!=null&&s.nextSession){const i=new Date(s.nextSession.startsAt),o=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],u=i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1});D.setNextSessionText(`Next session begins ${o[s.nextSession.day]} ${u} (${Ct(i)})`)}else t.length===0?D.setNextSessionText("No sessions scheduled"):D.setNextSessionText("")}t.length>0&&Ce()==="granted"&&wt(t)}}async function Q(){try{if(v){if(s=await Ee(v),s!=null&&s.sessions&&(P=s.sessions),s)try{const{api:i}=await re(async()=>{const{api:u}=await import("./api-BIFMIXWG.js");return{api:u}},__vite__mapDeps([0,1]));await W.query(i.schedules.getVaultToken)||(await W.mutation(i.schedules.setVaultToken,{vaultToken:v}),console.log("Synced vault token to Convex"))}catch(i){console.warn("Could not sync vault token to Convex:",i)}}else s=null;const t=document.getElementById("checkbox-credentials"),n=document.getElementById("checkbox-create-account");s!=null&&s.screenTimeAppleId?(document.getElementById("apple-id").value=s.screenTimeAppleId,s!=null&&s.hasStoredPassword?(document.getElementById("password").placeholder="Password stored (leave blank to keep)",t.classList.add("checked"),n.classList.add("checked"),n.classList.add("disabled")):t.classList.remove("checked")):n.classList.remove("disabled");const e=document.getElementById("setup-check");s!=null&&s.screenTimeAppleId&&(s!=null&&s.hasStoredPassword)?e.classList.remove("hidden"):e.classList.add("hidden"),me(),he()}catch(t){console.error("Failed to load vault:",t)}}document.getElementById("go-to-schedule-btn").addEventListener("click",async()=>{const t=document.getElementById("apple-id").value.trim(),n=document.getElementById("password").value;if(t&&n)try{v||(v=Je()),await xe(v,{screenTimeAppleId:t,screenTimePassword:n,sessions:P}),Ye(v);const{api:e}=await re(async()=>{const{api:i}=await import("./api-BIFMIXWG.js");return{api:i}},__vite__mapDeps([0,1]));await W.mutation(e.schedules.setVaultToken,{vaultToken:v}),await Q()}catch(e){alert("Failed to save credentials: "+e.message);return}M("view-idle"),he()});document.getElementById("save-credentials").addEventListener("click",async()=>{const t=document.getElementById("edit-apple-id").value.trim(),n=document.getElementById("edit-password").value,e=document.getElementById("save-credentials");if(!t){alert("Please enter an Apple ID");return}try{if(!v){alert("No vault token - please complete setup first");return}e.setAttribute("disabled","true"),e.textContent="Saving...";const i={screenTimeAppleId:t};n&&(i.screenTimePassword=n),await xe(v,i),v&&(s=await Ee(v),s!=null&&s.sessions&&(P=s.sessions)),K(),de(),e.removeAttribute("disabled"),e.textContent="Save"}catch(i){e.removeAttribute("disabled"),e.textContent="Save",alert("Failed to save: "+i.message)}});setInterval(async()=>{s!=null&&s.isBlocking&&await Q()},3e4);async function Bt(){await vt()&&(await Q(),sessionStorage.getItem("blocker-show-settings")==="true"&&(sessionStorage.removeItem("blocker-show-settings"),de(),M("view-settings")))}Bt();
