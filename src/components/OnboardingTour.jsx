import React, { useState } from "react";

const steps = [
  "Welcome to the Finance Tracker!",
  "Add your accounts and select one to manage its transactions.",
  "Add, edit, or delete transactions. Categorize and tag them for better tracking.",
  "Set budgets for each category and monitor your spending.",
  "View analytics and trends in the Analytics section.",
  "Switch between light and dark mode using the toggle.",
  "Import/export your data for backup or migration.",
  "You're ready to take control of your finances!"
];

const OnboardingTour = () => {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(() => localStorage.getItem("onboardingDone") !== "true");

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setShow(false);
      localStorage.setItem("onboardingDone", "true");
    }
  };
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "#fff", color: "#222", borderRadius: 12, padding: 32, maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
        <h2>Getting Started</h2>
        <p>{steps[step]}</p>
        <button onClick={next} style={{ marginTop: 16 }}>{step < steps.length - 1 ? "Next" : "Finish"}</button>
      </div>
    </div>
  );
};

export default OnboardingTour;
