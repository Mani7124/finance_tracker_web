import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  // Frontend-only signup
  const signup = async (email, password, name, work, address) => {
    await new Promise(res => setTimeout(res, 500)); // simulate network
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      throw new Error("User already exists");
    }
    users.push({ email, password, name, work, address });
    localStorage.setItem("users", JSON.stringify(users));
    setUser({ email, name, work, address });
  };

  // Frontend-only login
  const login = async (email, password) => {
    await new Promise(res => setTimeout(res, 500)); // simulate network
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    setUser({ email: found.email, name: found.name, work: found.work, address: found.address });
  };

  const logout = () => setUser(null);

  // Simulated password reset
  const resetPassword = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) throw new Error("Email not found");
    users[idx].password = "NewPass123";
    localStorage.setItem("users", JSON.stringify(users));
  };

  // For backend: replace signup/login/logout/resetPassword with API calls

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
