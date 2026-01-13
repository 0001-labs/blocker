import { LitElement, html, css } from "https://esm.sh/lit@3";
import { isAuthenticated } from "../auth.js";
import { getToken, getVault } from "../api.js";

/**
 * App header component with title, blocking status, and navigation
 * @element app-header
 */
export class AppHeader extends LitElement {
  static properties = {
    currentPage: { type: String, attribute: "current-page" },
    isBlocking: { type: Boolean, state: true },
    activeUntil: { type: String, attribute: "active-until" },
    insanoMode: { type: Boolean, attribute: "insano-mode" },
    _isAuthenticated: { type: Boolean, state: true },
    _timeLeft: { type: String, state: true },
  };

  static styles = css`
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
  `;

  constructor() {
    super();
    this.currentPage = "app";
    this.isBlocking = false;
    this.activeUntil = null;
    this.insanoMode = false;
    this._isAuthenticated = false;
    this._timeLeft = "";
    this._timerInterval = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._isAuthenticated = isAuthenticated();
    this._loadBlockingStatus();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("activeUntil") || changedProperties.has("isBlocking")) {
      this._updateTimer();
    }
  }

  _updateTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }

    if (!this.isBlocking || !this.activeUntil) {
      this._timeLeft = "";
      return;
    }

    const update = () => {
      const now = new Date();
      const until = new Date(this.activeUntil);
      const diffMs = until - now;

      if (diffMs <= 0) {
        this._timeLeft = "0:00";
        clearInterval(this._timerInterval);
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (hours > 0) {
        this._timeLeft = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} left`;
      } else {
        this._timeLeft = `${minutes}:${seconds.toString().padStart(2, "0")} left`;
      }
    };

    update();
    this._timerInterval = setInterval(update, 1000);
  }

  async _loadBlockingStatus() {
    if (!this._isAuthenticated) return;

    try {
      const token = getToken();
      if (token) {
        const vault = await getVault(token);
        this.isBlocking = vault?.isBlocking || false;
      }
    } catch (err) {
      console.error("Failed to load blocking status:", err);
    }
  }

  _getHomeUrl() {
    return this._isAuthenticated ? "app.html" : "index.html";
  }

  _handleHomeClick() {
    // If on app page, dispatch event for in-app navigation
    if (this.currentPage === "app") {
      this.dispatchEvent(new CustomEvent("navigate-home", { bubbles: true, composed: true }));
    } else {
      window.location.href = this._getHomeUrl();
    }
  }

  _handleSettingsClick() {
    // Dispatch event for view change (no hash in URL)
    this.dispatchEvent(new CustomEvent("navigate-settings", { bubbles: true, composed: true }));
  }

  render() {
    const showSettingsIcon = this._isAuthenticated;

    return html`
      <div class="header">
        <div class="header-left" @click=${this._handleHomeClick}>
          <h1 class="logo-title">Screen Time Blocker</h1>
          ${this.insanoMode ? html`<span class="insano-badge">INSANO</span>` : ""}
          ${this._isAuthenticated ? html`
            <span class="header-status">
              <span class="header-status-dot ${this.isBlocking ? "blocking" : ""}"></span>
              <span>${this.isBlocking ? "Blocked" : "Not blocked"}</span>
            </span>
            ${this.isBlocking && this._timeLeft ? html`
              <span class="header-timer">${this._timeLeft}</span>
            ` : ""}
          ` : ""}
        </div>
        <div class="header-right">
          <a class="header-link" href="faq.html">FAQ</a>
          <a class="header-link" href="https://github.com/sponsors/Jo4712" target="_blank">Donate</a>
          ${showSettingsIcon ? html`
            <span class="header-link" @click=${this._handleSettingsClick}>Settings</span>
          ` : ""}
        </div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
