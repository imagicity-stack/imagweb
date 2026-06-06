import { createContext, useContext, useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeProvider";
import { isFirebaseConfigured } from "../../lib/firebase/client";
import {
  onAuthChange,
  getIdToken,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  createRecaptcha,
  clearRecaptcha,
  sendPhoneOtp,
  signOutUser
} from "../../lib/firebase/auth";

const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);

function friendlyError(error) {
  const code = error?.code || "";
  const map = {
    "auth/invalid-email": "That email address looks invalid.",
    "auth/user-not-found": "No account found with those details.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists for that email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/invalid-phone-number":
      "Enter a valid phone number in international format (e.g. +9112345…).",
    "auth/invalid-verification-code": "That code is incorrect. Please try again.",
    "auth/code-expired": "That code expired. Request a new one.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled in your Firebase project."
  };
  return map[code] || error?.message || "Something went wrong. Please try again.";
}

function AdminLogin() {
  const [tab, setTab] = useState("email");
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reset = () => {
    setError("");
    setNotice("");
  };

  const handleEmail = async (event) => {
    event.preventDefault();
    reset();
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    reset();
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    reset();
    if (!email.trim()) {
      setError("Enter your email first, then tap reset.");
      return;
    }
    try {
      await resetPassword(email.trim());
      setNotice("Password reset email sent.");
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    reset();
    setBusy(true);
    try {
      const verifier = createRecaptcha("recaptcha-container");
      const result = await sendPhoneOtp(phone.trim(), verifier);
      setConfirmation(result);
      setNotice("Verification code sent via SMS.");
    } catch (err) {
      clearRecaptcha();
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    reset();
    setBusy(true);
    try {
      await confirmation.confirm(code.trim());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-auth-screen">
      <span className="admin-auth-toggle">
        <ThemeToggle />
      </span>
      <div className="admin-auth-card">
        <div className="admin-auth-brand">
          <span className="admin-auth-logo">✦</span>
          <div>
            <h1>Imagicity Studio</h1>
            <p>Sign in to manage the blog</p>
          </div>
        </div>

        <div className="admin-auth-tabs">
          {[
            { id: "email", label: "Email" },
            { id: "google", label: "Google" },
            { id: "phone", label: "Phone" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "active" : ""}
              onClick={() => {
                setTab(item.id);
                reset();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "email" ? (
          <form className="admin-auth-form" onSubmit={handleEmail}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@imagicity.in"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </label>
            <button type="submit" className="btn btn-glow" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
            <div className="admin-auth-links">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  reset();
                }}
              >
                {mode === "signup" ? "Have an account? Sign in" : "Create an account"}
              </button>
              <button type="button" onClick={handleForgot}>
                Forgot password?
              </button>
            </div>
          </form>
        ) : null}

        {tab === "google" ? (
          <div className="admin-auth-form">
            <p className="admin-auth-hint">
              Use your authorized Google account to sign in instantly.
            </p>
            <button
              type="button"
              className="btn btn-outline admin-google-btn"
              onClick={handleGoogle}
              disabled={busy}
            >
              <span className="g-mark">G</span>
              {busy ? "Please wait…" : "Continue with Google"}
            </button>
          </div>
        ) : null}

        {tab === "phone" ? (
          <form
            className="admin-auth-form"
            onSubmit={confirmation ? handleVerify : handleSendCode}
          >
            {!confirmation ? (
              <label>
                Phone number
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 91222 89578"
                  autoComplete="tel"
                  required
                />
              </label>
            ) : (
              <label>
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  required
                />
              </label>
            )}
            <button type="submit" className="btn btn-glow" disabled={busy}>
              {busy ? "Please wait…" : confirmation ? "Verify & sign in" : "Send code"}
            </button>
            {confirmation ? (
              <div className="admin-auth-links">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmation(null);
                    setCode("");
                    clearRecaptcha();
                    reset();
                  }}
                >
                  Use a different number
                </button>
              </div>
            ) : null}
            <div id="recaptcha-container" />
          </form>
        ) : null}

        {error ? <p className="admin-auth-error">{error}</p> : null}
        {notice ? <p className="admin-auth-notice">{notice}</p> : null}
      </div>
    </div>
  );
}

export default function AdminAuthGate({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setStatus("config");
      return undefined;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("signedout");
        return;
      }
      setStatus("checking");
      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setDeniedMessage(data.error || "You are not authorized for the admin area.");
          setUser({ email: firebaseUser.email });
          setStatus("denied");
          return;
        }
        if (data.claimUpdated) {
          await firebaseUser.getIdToken(true);
        }
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || data.user?.name || "",
          picture: firebaseUser.photoURL || data.user?.picture || ""
        });
        setStatus("ready");
      } catch (error) {
        setDeniedMessage(friendlyError(error));
        setStatus("denied");
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  if (status === "config") {
    return (
      <div className="admin-auth-screen">
      <span className="admin-auth-toggle">
        <ThemeToggle />
      </span>
        <div className="admin-auth-card">
          <h1>Firebase not configured</h1>
          <p className="admin-auth-hint">
            Set the <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables in
            Vercel and redeploy to enable the admin area. See{" "}
            <code>BLOG_SETUP.md</code> for the full checklist.
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading" || status === "checking") {
    return (
      <div className="admin-auth-screen">
      <span className="admin-auth-toggle">
        <ThemeToggle />
      </span>
        <div className="admin-loader">
          <span className="admin-spinner" />
          <p>{status === "checking" ? "Verifying access…" : "Loading…"}</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="admin-auth-screen">
      <span className="admin-auth-toggle">
        <ThemeToggle />
      </span>
        <div className="admin-auth-card">
          <h1>Access denied</h1>
          <p className="admin-auth-hint">{deniedMessage}</p>
          {user?.email ? (
            <p className="admin-auth-hint">
              Signed in as <strong>{user.email}</strong>.
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => signOutUser()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    const value = {
      user,
      getToken: (force = false) => getIdToken(force),
      signOut: () => signOutUser()
    };
    return (
      <AdminAuthContext.Provider value={value}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  return <AdminLogin />;
}
