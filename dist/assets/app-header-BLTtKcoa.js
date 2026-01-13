var v=Object.defineProperty;var k=(e,t,n)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var d=(e,t,n)=>k(e,typeof t!="symbol"?t+"":t,n);import{LitElement as w,css as y,html as s}from"https://esm.sh/lit@3";const c="https://blocker.0001-labs.workers.dev";function h(){return localStorage.getItem("blocker_token")}function L(e){localStorage.setItem("blocker_token",e)}function M(){const e="abcdefghijklmnopqrstuvwxyz0123456789";let t="";for(let n=0;n<32;n++)t+=e[Math.floor(Math.random()*e.length)];return t}async function b(e){const t=e||h();if(!t)return null;const n=await fetch(`${c}/vault?token=${t}`);if(n.status===404)return null;if(!n.ok)throw new Error(`Failed to get vault: ${n.status}`);return n.json()}async function U(e,t){const n=await fetch(`${c}/vault`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,...t})});if(!n.ok){const a=await n.json();throw new Error(a.error||`Failed to save credentials: ${n.status}`)}return n.json()}async function J(e,t){const n=await fetch(`${c}/vault`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,sessions:t})});if(!n.ok){const a=await n.json();throw new Error(a.error||`Failed to sync schedule: ${n.status}`)}return n.json()}async function F(e){const t=e||h();if(!t)throw new Error("No token");const n=await fetch(`${c}/password?token=${t}`);if(n.status===403)return{blocked:!0,...await n.json()};if(!n.ok)throw new Error(`Failed to get password: ${n.status}`);return{blocked:!1,password:(await n.json()).password}}const f="__convexAuthJWT",_="__convexAuthRefreshToken";let i={isAuthenticated:!1,payload:null};function x(){return"https://elegant-avocet-484.convex.cloud".replace(/[^a-zA-Z0-9]/g,"")}function l(e){const t=x();return t?`${e}_${t}`:null}function S(e){try{return window.localStorage.getItem(e)}catch(t){return console.warn("Unable to access localStorage:",t),null}}function $(e){try{const n=e.padEnd(e.length+(4-e.length%4)%4,"=").replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(atob(n).split("").map(a=>`%${`00${a.charCodeAt(0).toString(16)}`.slice(-2)}`).join(""))}catch{return null}}function A(e){if(!e)return null;const t=e.split(".");if(t.length!==3)return null;const n=$(t[1]);if(!n)return null;try{return JSON.parse(n)}catch{return null}}function I(e){if(!e||typeof e!="object"||!e.exp)return!1;const t=Math.floor(Date.now()/1e3);return e.exp>t}function E(){const e=l(f);return e?S(e):null}function B(){const e=E(),t=A(e),n=e?I(t):!1;return{isAuthenticated:n,payload:n?t:null}}function o(){return typeof window>"u"?(i={isAuthenticated:!1,payload:null},i):(i=B(),i)}function T(){return o().isAuthenticated}function N(){const e=l(f),t=l(_);try{e&&window.localStorage.removeItem(e),t&&window.localStorage.removeItem(t)}catch{}i={isAuthenticated:!1,payload:null}}function O(){o(),window.addEventListener("storage",e=>{if(!e.key)return;const t=l(f);e.key===t&&o()}),window.addEventListener("focus",()=>{o()})}class u extends w{constructor(){super(),this.currentPage="app",this.isBlocking=!1,this.activeUntil=null,this.insanoMode=!1,this._isAuthenticated=!1,this._timeLeft="",this._timerInterval=null}connectedCallback(){super.connectedCallback(),this._isAuthenticated=T(),this._loadBlockingStatus()}disconnectedCallback(){super.disconnectedCallback(),this._timerInterval&&clearInterval(this._timerInterval)}updated(t){(t.has("activeUntil")||t.has("isBlocking"))&&this._updateTimer()}_updateTimer(){if(this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null),!this.isBlocking||!this.activeUntil){this._timeLeft="";return}const t=()=>{const n=new Date,r=new Date(this.activeUntil)-n;if(r<=0){this._timeLeft="0:00",clearInterval(this._timerInterval);return}const p=Math.floor(r/(1e3*60*60)),g=Math.floor(r%(1e3*60*60)/(1e3*60)),m=Math.floor(r%(1e3*60)/1e3);p>0?this._timeLeft=`${p}:${g.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} left`:this._timeLeft=`${g}:${m.toString().padStart(2,"0")} left`};t(),this._timerInterval=setInterval(t,1e3)}async _loadBlockingStatus(){if(this._isAuthenticated)try{const t=h();if(t){const n=await b(t);this.isBlocking=(n==null?void 0:n.isBlocking)||!1}}catch(t){console.error("Failed to load blocking status:",t)}}_getHomeUrl(){return this._isAuthenticated?"app.html":"index.html"}_handleHomeClick(){this.currentPage==="app"?this.dispatchEvent(new CustomEvent("navigate-home",{bubbles:!0,composed:!0})):window.location.href=this._getHomeUrl()}_handleSettingsClick(){this.dispatchEvent(new CustomEvent("navigate-settings",{bubbles:!0,composed:!0}))}render(){const t=this._isAuthenticated;return s`
      <div class="header">
        <div class="header-left" @click=${this._handleHomeClick}>
          <h1 class="logo-title">Screen Time Blocker</h1>
          ${this.insanoMode?s`<span class="insano-badge">INSANO</span>`:""}
          ${this._isAuthenticated?s`
            <span class="header-status">
              <span class="header-status-dot ${this.isBlocking?"blocking":""}"></span>
              <span>${this.isBlocking?"Blocked":"Not blocked"}</span>
            </span>
            ${this.isBlocking&&this._timeLeft?s`
              <span class="header-timer">${this._timeLeft}</span>
            `:""}
          `:""}
        </div>
        <div class="header-right">
          <a class="header-link" href="faq.html">FAQ</a>
          <a class="header-link" href="https://github.com/sponsors/Jo4712" target="_blank">Donate</a>
          ${t?s`
            <span class="header-link" @click=${this._handleSettingsClick}>Settings</span>
          `:""}
        </div>
      </div>
    `}}d(u,"properties",{currentPage:{type:String,attribute:"current-page"},isBlocking:{type:Boolean,state:!0},activeUntil:{type:String,attribute:"active-until"},insanoMode:{type:Boolean,attribute:"insano-mode"},_isAuthenticated:{type:Boolean,state:!0},_timeLeft:{type:String,state:!0}}),d(u,"styles",y`
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
  `);customElements.define("app-header",u);export{M as a,L as b,N as c,T as d,E as e,h as f,b as g,F as h,O as i,J as j,U as s};
