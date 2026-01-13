import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      setError("Email is required");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await signIn("resend-otp", { email: email.trim() });
      setStep("code");
    } catch (err: any) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn("resend-otp", { email, code });
      // Redirect to app on success
      window.location.href = "/app.html";
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>{step === "email" ? "Sign in" : "Enter code"}</h2>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendCode}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
            />
          </div>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <p className="email-sent-message">
            We sent a code to <strong>{email}</strong>
          </p>
          <div className="form-group">
            <label htmlFor="code">Verification code</label>
            <input
              type="text"
              id="code"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            disabled={loading}
          >
            Use different email
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>
      )}
    </div>
  );
}
