import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🪙 CryptoTracker</div>
        <h2 className="auth-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="auth-subtitle">{isSignup ? "Sign up to track your crypto" : "Sign in to your account"}</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </div>

        <button className="auth-btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-btn-google" onClick={handleGoogle} disabled={loading}>
          <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="Google" />
          Continue with Google
        </button>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => { setIsSignup(!isSignup); setError(null); }}>
            {isSignup ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;