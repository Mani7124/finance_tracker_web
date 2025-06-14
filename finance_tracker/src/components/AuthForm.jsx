import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const AuthForm = () => {
  const { user, signup, login, logout, resetPassword } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const passwordStrong = password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isSignup) {
        if (password !== confirm) throw new Error("Passwords do not match");
        if (!passwordStrong) throw new Error("Password must be at least 6 characters, include a number and an uppercase letter");
        await signup(email, password, name, work, address);
        setSuccess("Signup successful! You are now logged in.");
      } else {
        await login(email, password);
        setSuccess("Login successful!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      resetPassword(resetEmail);
      setSuccess("Password reset! Check your email (simulated)");
      setShowReset(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <p>Welcome, {user.email}!</p>
        <button onClick={logout}>Logout</button>
        {success && <div style={{ color: "#2ecc71" }}>{success}</div>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "40px auto", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", justifyContent: "center" }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      {isSignup && <>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label htmlFor="work">Work</label>
        <input
          id="work"
          type="text"
          placeholder="Work"
          value={work}
          onChange={e => setWork(e.target.value)}
          required
        />
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
      </>}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {isSignup && <>
        <label htmlFor="confirm">Confirm Password</label>
        <input
          id="confirm"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <div style={{ fontSize: 12, color: passwordStrong ? '#2ecc71' : '#e74c3c' }}>
          Password must be at least 6 characters, include a number and an uppercase letter.
        </div>
      </>}
      {error && <div style={{ color: "#e74c3c" }}>{error}</div>}
      {success && <div style={{ color: "#2ecc71" }}>{success}</div>}
      <button type="submit" disabled={loading}>{loading ? "Please wait..." : (isSignup ? "Sign Up" : "Login")}</button>
      <button type="button" onClick={() => setIsSignup(s => !s)} style={{ background: "none", color: "#2d8cf0", border: "none", cursor: "pointer" }}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
      {!isSignup && <button type="button" onClick={() => setShowReset(true)} style={{ background: "none", color: "#2d8cf0", border: "none", cursor: "pointer" }}>Forgot password?</button>}
      {showReset && (
        <div style={{ marginTop: 8 }}>
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="resetEmail">Enter your email to reset password</label>
            <input
              id="resetEmail"
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
            <button type="button" onClick={() => setShowReset(false)}>Cancel</button>
          </form>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
