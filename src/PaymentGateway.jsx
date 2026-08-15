import React, { useState } from "react";

// Two Fijian mobile wallets. Brand colours are approximate for demo purposes.
const GATEWAYS = {
  mpaisa: {
    name: "M-PAiSA",
    provider: "Vodafone Fiji",
    color: "#E60000",
    dark: "#B00000",
    logo: "M",
    tagline: "Vodafone M-PAiSA Wallet",
  },
  mycash: {
    name: "MyCash",
    provider: "Digicel Fiji",
    color: "#D6001C",
    dark: "#A30016",
    logo: "$",
    tagline: "Digicel MyCash Wallet",
  },
};

export default function PaymentGateway({ gateway, amount, onCancel, onSuccess }) {
  const g = GATEWAYS[gateway] || GATEWAYS.mpaisa;
  const [stage, setStage] = useState("phone"); // phone -> pin -> processing -> done
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const bg = `linear-gradient(160deg, ${g.color} 0%, ${g.dark} 100%)`;

  function pressDigit(d) {
    if (pin.length < 4) {
      const np = pin + d;
      setPin(np);
      if (np.length === 4) {
        setTimeout(() => {
          setStage("processing");
          setTimeout(() => {
            setStage("done");
            setTimeout(() => onSuccess && onSuccess(g.name), 1100);
          }, 1600);
        }, 180);
      }
    }
  }
  function backspace() { setPin(pin.slice(0, -1)); }

  return (
    <div className="paysheet" style={{ background: bg }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px" }}>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,.2)", border: "none", color: "#fff", width: 34, height: 34, borderRadius: 9, fontSize: 18, cursor: "pointer" }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", color: g.color, fontWeight: 800, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>{g.logo}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{g.name}</div>
            <div style={{ fontSize: 11, opacity: .85 }}>{g.provider}</div>
          </div>
        </div>
      </div>

      {/* amount */}
      <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
        <div style={{ fontSize: 12.5, opacity: .8 }}>Amount to pay</div>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px" }}>FJD ${amount.toFixed(2)}</div>
        <div style={{ fontSize: 12, opacity: .8 }}>to PreLoved Fiji</div>
      </div>

      {stage === "phone" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 30px" }}>
          <div style={{ fontSize: 13, opacity: .9, marginBottom: 8 }}>Enter your {g.name} mobile number</div>
          <input
            autoFocus value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9 ]/g, ""))}
            placeholder="+679 …" inputMode="numeric"
            style={{ background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.35)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 18, fontWeight: 600, outline: "none" }}
          />
          <div style={{ flex: 1 }} />
          <button
            onClick={() => phone.trim().length >= 5 && setStage("pin")}
            style={{ background: "#fff", color: g.color, border: "none", borderRadius: 14, padding: 16, fontWeight: 800, fontSize: 15, cursor: "pointer", opacity: phone.trim().length >= 5 ? 1 : .5 }}
          >Continue</button>
          <div style={{ fontSize: 11, opacity: .75, textAlign: "center", marginTop: 12 }}>🔒 Secure demo — no real payment is taken</div>
        </div>
      )}

      {stage === "pin" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 0 26px" }}>
          <div style={{ fontSize: 13, opacity: .9, textAlign: "center", marginBottom: 4 }}>Enter your 4-digit {g.name} PIN</div>
          <div className="pin-dots">
            {[0, 1, 2, 3].map((i) => <div key={i} className={"d" + (pin.length > i ? " on" : "")} />)}
          </div>
          <div style={{ flex: 1 }} />
          <div className="paypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <button key={n} onClick={() => pressDigit(String(n))}>{n}</button>)}
            <button onClick={backspace} style={{ fontSize: 18 }}>⌫</button>
            <button onClick={() => pressDigit("0")}>0</button>
            <button style={{ visibility: "hidden" }}>·</button>
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div className="spinner" />
          <div style={{ fontSize: 14, opacity: .9 }}>Authorising with {g.provider}…</div>
        </div>
      )}

      {stage === "done" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#fff", color: g.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Payment successful</div>
          <div style={{ fontSize: 13, opacity: .85 }}>FJD ${amount.toFixed(2)} paid via {g.name}</div>
        </div>
      )}
    </div>
  );
}
