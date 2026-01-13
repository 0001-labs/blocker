import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

/**
 * Setup Page DOM Helper
 * Creates the minimal DOM structure needed for setup page tests
 */
function createSetupPageDOM() {
  document.body.innerHTML = `
    <div class="view setup-page" id="view-setup">
      <h1 class="page-title">Setup</h1>

      <ul class="todo-list">
        <li class="todo-item">
          <div class="todo-checkbox" id="checkbox-create-account"></div>
          <div class="todo-content">
            <p>Create Apple Account for Screen Time recovery</p>
          </div>
        </li>
        <li class="todo-item" id="todo-credentials">
          <div class="todo-checkbox disabled" id="checkbox-credentials"></div>
          <div class="todo-content">
            <p>Store the Apple Account credentials here</p>
            <div class="todo-summary" id="credentials-summary"></div>
            <div class="todo-collapsible">
              <div class="form-group">
                <label for="apple-id">Apple Account email</label>
                <input type="email" id="apple-id" placeholder="blocker-recovery@icloud.com"/>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Paste the password"/>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <button id="go-to-schedule-btn" disabled>Go to schedule</button>
    </div>
  `;
}

/**
 * Simulates the updateGoToScheduleButton function from app.html
 */
function updateGoToScheduleButton() {
  const createAccountCheckbox = document.getElementById("checkbox-create-account");
  const credentialsCheckbox = document.getElementById("checkbox-credentials");
  const goToScheduleBtn = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

  const step1Complete = createAccountCheckbox?.classList.contains("checked") ?? false;
  const step2Complete = credentialsCheckbox?.classList.contains("checked") ?? false;

  if (step1Complete && step2Complete) {
    goToScheduleBtn?.removeAttribute("disabled");
  } else {
    goToScheduleBtn?.setAttribute("disabled", "true");
  }
}

/**
 * Simulates the updateCredentialsState function from app.html
 */
function updateCredentialsState() {
  const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const checkbox = document.getElementById("checkbox-credentials");
  const summary = document.getElementById("credentials-summary");
  const createAccountCheckbox = document.getElementById("checkbox-create-account");

  const appleId = appleIdInput?.value.trim() ?? "";
  const password = passwordInput?.value ?? "";
  const isComplete = appleId && password;

  if (isComplete) {
    checkbox?.classList.add("checked");
    if (summary) {
      summary.textContent = `${appleId} • ••••••••`;
    }
    createAccountCheckbox?.classList.add("checked");
    createAccountCheckbox?.classList.add("disabled");
  } else {
    checkbox?.classList.remove("checked");
  }

  updateGoToScheduleButton();
}

describe("Setup Page - Initial State", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should have Go to schedule button disabled initially", () => {
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("should have step 1 checkbox unchecked initially", () => {
    const checkbox = document.getElementById("checkbox-create-account");
    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should have step 2 checkbox unchecked initially", () => {
    const checkbox = document.getElementById("checkbox-credentials");
    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should have empty credentials fields initially", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    expect(appleIdInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });
});

describe("Setup Page - Step 1 Checkbox", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should toggle checked class when clicked", () => {
    const checkbox = document.getElementById("checkbox-create-account");
    expect(checkbox?.classList.contains("checked")).toBe(false);

    checkbox?.classList.toggle("checked");
    expect(checkbox?.classList.contains("checked")).toBe(true);

    checkbox?.classList.toggle("checked");
    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should keep button disabled when only step 1 is checked", () => {
    const checkbox = document.getElementById("checkbox-create-account");
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    checkbox?.classList.add("checked");
    updateGoToScheduleButton();

    expect(button.disabled).toBe(true);
  });
});

describe("Setup Page - Step 2 Credentials", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should mark step 2 complete when both fields are filled", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const checkbox = document.getElementById("checkbox-credentials");

    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(checkbox?.classList.contains("checked")).toBe(true);
  });

  it("should not mark step 2 complete with only email", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const checkbox = document.getElementById("checkbox-credentials");

    appleIdInput.value = "test@icloud.com";
    updateCredentialsState();

    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should not mark step 2 complete with only password", () => {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const checkbox = document.getElementById("checkbox-credentials");

    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should display credentials summary when complete", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const summary = document.getElementById("credentials-summary");

    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(summary?.textContent).toBe("test@icloud.com • ••••••••");
  });

  it("should trim whitespace from email", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const summary = document.getElementById("credentials-summary");

    appleIdInput.value = "  test@icloud.com  ";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(summary?.textContent).toBe("test@icloud.com • ••••••••");
  });

  it("should auto-check step 1 when credentials are filled", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const createAccountCheckbox = document.getElementById("checkbox-create-account");

    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(createAccountCheckbox?.classList.contains("checked")).toBe(true);
    expect(createAccountCheckbox?.classList.contains("disabled")).toBe(true);
  });
});

describe("Setup Page - Go to Schedule Button", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should be disabled when no steps are complete", () => {
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;
    updateGoToScheduleButton();
    expect(button.disabled).toBe(true);
  });

  it("should be disabled when only step 1 is complete", () => {
    const checkbox = document.getElementById("checkbox-create-account");
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    checkbox?.classList.add("checked");
    updateGoToScheduleButton();

    expect(button.disabled).toBe(true);
  });

  it("should be enabled when both steps are complete", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(button.disabled).toBe(false);
  });

  it("should be disabled when credentials are cleared after being set", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    // First, fill credentials
    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();
    expect(button.disabled).toBe(false);

    // Then, clear password
    passwordInput.value = "";
    updateCredentialsState();
    expect(button.disabled).toBe(true);
  });
});

describe("Setup Page - Complete Flow", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should enable button after completing both steps in order", () => {
    const step1Checkbox = document.getElementById("checkbox-create-account");
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    // Step 1: Check create account
    step1Checkbox?.classList.add("checked");
    updateGoToScheduleButton();
    expect(button.disabled).toBe(true);

    // Step 2: Fill credentials
    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(button.disabled).toBe(false);
  });

  it("should enable button when credentials filled first (auto-checks step 1)", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const button = document.getElementById("go-to-schedule-btn") as HTMLButtonElement;

    // Fill credentials without checking step 1 first
    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    // Should auto-check step 1 and enable button
    expect(button.disabled).toBe(false);
  });
});

describe("Setup Page - Input Validation Edge Cases", () => {
  beforeEach(() => {
    createSetupPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should not accept whitespace-only email", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const checkbox = document.getElementById("checkbox-credentials");

    appleIdInput.value = "   ";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should not accept empty password", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const checkbox = document.getElementById("checkbox-credentials");

    appleIdInput.value = "test@icloud.com";
    passwordInput.value = "";
    updateCredentialsState();

    expect(checkbox?.classList.contains("checked")).toBe(false);
  });

  it("should handle special characters in email", () => {
    const appleIdInput = document.getElementById("apple-id") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const summary = document.getElementById("credentials-summary");

    appleIdInput.value = "test+blocker@icloud.com";
    passwordInput.value = "secretpassword";
    updateCredentialsState();

    expect(summary?.textContent).toBe("test+blocker@icloud.com • ••••••••");
  });
});
