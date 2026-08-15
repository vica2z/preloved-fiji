import React, { useState, useCallback } from "react";
import { loadStore, saveStore, clearStore } from "./data.js";
import BuyerApp from "./BuyerApp.jsx";
import AdminPanel from "./AdminPanel.jsx";

export default function App() {
  const [role, setRole] = useState("buyer");
  const [store, setStore] = useState(() => loadStore());
  const [toastMsg, setToastMsg] = useState(null);

  // mutate(fn): apply fn to a deep copy, persist, re-render
  const mutate = useCallback((fn) => {
    setStore(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      saveStore(next);
      return next;
    });
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const reset = () => {
    if (confirm("Reset all demo data back to the original sample? Your changes will be cleared.")) {
      clearStore();
      window.location.reload();
    }
  };

  return (
    <>
      <div className="rolebar">
        <b>PreLoved Fiji · Demo</b>
        <button className={role === "buyer" ? "on" : ""} onClick={() => setRole("buyer")}>📱 Buyer app</button>
        <button className={role === "admin" ? "on" : ""} onClick={() => setRole("admin")}>🖥️ Admin panel</button>
        <button onClick={reset} style={{ marginLeft: 8, background: "rgba(242,106,75,.9)" }}>↺ Reset</button>
      </div>

      <div className="stage">
        {/* Both mounted always; visibility toggled so state persists across role switches */}
        <div className="phone-wrap" style={{ display: role === "buyer" ? "flex" : "none" }}>
          <div style={{ textAlign: "center", marginBottom: 12, color: "var(--slate)", fontSize: 12.5, fontWeight: 600 }}>📱 Buyer &amp; Seller app</div>
          <BuyerApp store={store} mutate={mutate} toast={toast} />
        </div>
        <div style={{ width: "100%", display: role === "admin" ? "block" : "none" }}>
          <AdminPanel store={store} mutate={mutate} toast={toast} />
        </div>
      </div>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
