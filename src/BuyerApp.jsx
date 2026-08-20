import React, { useState } from "react";
import { CATS, CITIES, BGS, shade } from "./data.js";
import PaymentGateway from "./PaymentGateway.jsx";

export default function BuyerApp({ store, mutate, toast }) {
  const [authed, setAuthed] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [otp, setOtp] = useState(false);
  const [screen, setScreen] = useState("home");
  const [payload, setPayload] = useState(null);
  const [city, setCity] = useState("Suva");
  const [cat, setCat] = useState("All");
  const [liked, setLiked] = useState([2, 6]);
  const [following, setFollowing] = useState(["Mere T."]);
  const [sellStep, setSellStep] = useState(1);
  const [enhanced, setEnhanced] = useState(false);
  const [sellCat, setSellCat] = useState("Women");
  const [sellFeature, setSellFeature] = useState(false);
  const [filters, setFilters] = useState({ cond: "Any", max: 200, cat: "All" });
  const [showFilter, setShowFilter] = useState(false);
  const [offerFor, setOfferFor] = useState(null);
  const [reportFor, setReportFor] = useState(null);
  const [pay, setPay] = useState(null); // {gateway, amount, item}
  const [selectedPay, setSelectedPay] = useState(null);
  const [prefs, setPrefs] = useState({ pushMsg: true, pushOffers: true, pushSales: true, emailUpdates: false });

  const go = (s, p = null) => { setScreen(s); setPayload(p); const el = document.getElementById("appScreen"); if (el) el.scrollTop = 0; };
  const live = () => store.items.filter(i => i.status === "live");
  const itemById = (id) => store.items.find(i => i.id === id);
  const heart = (id) => liked.includes(id) ? "♥" : "♡";
  const toggleLike = (id, e) => { e && e.stopPropagation(); setLiked(liked.includes(id) ? liked.filter(x => x !== id) : [...liked, id]); };
  const toggleFollow = (s) => { setFollowing(following.includes(s) ? following.filter(x => x !== s) : [...following, s]); toast(following.includes(s) ? "Unfollowed" : "Following " + s); };

  // ---------- AUTH ----------
  if (!authed) {
    return (
      <div className="phone">
        <div id="appScreen" className="screen full" style={{ height: "100%", overflowY: "auto" }}>
          <div style={{ background: "var(--grad-ocean)", height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <div style={{ fontSize: 52 }}>🌺</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>PreLoved Fiji</div>
            <div style={{ fontSize: 13, opacity: .9, marginTop: 4 }}>Fiji's home for pre-loved treasures</div>
          </div>
          <div style={{ padding: 22 }}>
            {!otp ? (<>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "var(--sand)", padding: 5, borderRadius: 12 }}>
                {["login", "signup"].map(t => (
                  <button key={t} onClick={() => setAuthTab(t)} style={{ flex: 1, padding: 11, borderRadius: 9, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", background: authTab === t ? "#fff" : "transparent", color: authTab === t ? "var(--ocean)" : "var(--slate)", boxShadow: authTab === t ? "var(--shadow-sm)" : "none" }}>{t === "login" ? "Log in" : "Sign up"}</button>
                ))}
              </div>
              {authTab === "signup" && <div className="field"><div className="flabel">Full name</div><input className="inp" defaultValue="Adi Vakalolo" /></div>}
              <div className="field"><div className="flabel">Mobile number</div><input className="inp" defaultValue="+679 999 1234" /></div>
              <button className="btn" onClick={() => setOtp(true)}>{authTab === "login" ? "Send OTP" : "Create account"}</button>
              <div style={{ textAlign: "center", margin: "16px 0", color: "var(--mist)", fontSize: 13 }}>or</div>
              <button className="btn" style={{ background: "#fff", color: "var(--ink)", border: "1.5px solid var(--line)", boxShadow: "none" }} onClick={() => setAuthed(true)}>Continue with Google</button>
              <p style={{ fontSize: 11, color: "var(--mist)", textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>By continuing you agree to PreLoved Fiji's <b style={{ color: "var(--ocean)" }}>Terms &amp; Conditions</b> and Privacy Policy.</p>
            </>) : (<>
              <div style={{ textAlign: "center", marginBottom: 10 }}><div style={{ fontSize: 40 }}>📲</div><div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>Enter the code</div><div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>We sent a 6-digit code to your phone</div></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "20px 0" }}>{[1, 2, 3, 4, 5, 6].map(i => <input key={i} maxLength={1} defaultValue={i <= 4 ? "•" : ""} style={{ width: 42, height: 52, textAlign: "center", fontSize: 22, border: "1.5px solid var(--line)", borderRadius: 10 }} />)}</div>
              <button className="btn" onClick={() => setAuthed(true)}>Verify &amp; continue</button>
              <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--slate)" }}>Didn't get it? <b style={{ color: "var(--ocean)" }}>Resend</b></div>
            </>)}
          </div>
        </div>
      </div>
    );
  }

  // ---------- SCREENS ----------
  let content;
  const A = { city, cat, liked, notifs: 5 };

  if (screen === "home") content = <Home {...{ store, A, CATS, go, cardHTML: (l) => <Card key={l.id} l={l} liked={liked} toggleLike={toggleLike} heart={heart} go={go} />, setCat, live }} />;
  else if (screen === "search") content = <Search {...{ store, live, go, cardHTML: (l) => <Card key={l.id} l={l} liked={liked} toggleLike={toggleLike} heart={heart} go={go} />, filters, setShowFilter }} />;
  else if (screen === "detail") content = <Detail {...{ item: itemById(payload), go, following, toggleFollow, liked, toggleLike, heart, setOfferFor, setReportFor, mutate, store, toast }} />;
  else if (screen === "checkout") content = <Checkout {...{ item: itemById(payload), go, selectedPay, setSelectedPay, setPay }} />;
  else if (screen === "sell") content = <Sell {...{ sellStep, setSellStep, enhanced, setEnhanced, sellCat, setSellCat, sellFeature, setSellFeature, store, mutate, toast, go, setScreen }} />;
  else if (screen === "posted") content = <Posted go={go} />;
  else if (screen === "chats") content = <Chats go={go} />;
  else if (screen === "thread") content = <Thread go={go} />;
  else if (screen === "profile") content = <Profile {...{ go, store, following }} />;
  else if (screen === "sellerprofile") content = <SellerProfile {...{ seller: payload, store, go, following, toggleFollow, cardHTML: (l) => <Card key={l.id} l={l} liked={liked} toggleLike={toggleLike} heart={heart} go={go} /> }} />;
  else if (screen === "reviews") content = <Reviews {...{ store, go }} />;
  else if (screen === "bundle") content = <Bundle go={go} />;
  else if (screen === "favourites") content = <Favourites {...{ store, liked, go, cardHTML: (l) => <Card key={l.id} l={l} liked={liked} toggleLike={toggleLike} heart={heart} go={go} /> }} />;
  else if (screen === "orders") content = <Orders {...{ store, go }} />;
  else if (screen === "notifs") content = <Notifs go={go} />;
  else if (screen === "citypick") content = <CityPick {...{ city, setCity, go }} />;
  else if (screen === "settings") content = <Settings {...{ go, city, following, setAuthed }} />;
  else if (screen === "notifsettings") content = <NotifSettings {...{ prefs, setPrefs, go }} />;
  else if (screen === "editprofile") content = <EditProfile {...{ city, go, toast }} />;
  else if (screen === "following") content = <FollowingScreen {...{ following, toggleFollow, go }} />;
  else content = <Home {...{ store, A, CATS, go, cardHTML: (l) => <Card key={l.id} l={l} liked={liked} toggleLike={toggleLike} heart={heart} go={go} />, setCat, live }} />;

  const showTabs = ["home", "search", "chats", "profile", "favourites"].includes(screen);
  const tab = (id, icon, label, isSell) => (
    <button className={"tab" + (screen === id ? " on" : "") + (isSell ? " sell" : "")} onClick={() => { if (id === "sell") { setSellStep(1); setEnhanced(false); } go(id); }}>
      {isSell ? <div className="plus">+</div> : <div style={{ fontSize: 20 }}>{icon}</div>}
      <div>{label}</div>
    </button>
  );

  return (
    <div className="phone">
      <div id="appScreen" className={"screen" + (showTabs ? "" : " full")} style={{ height: "100%", overflowY: "auto", paddingBottom: showTabs ? 62 : 0 }}>
        {content}
      </div>

      {pay && (
        <PaymentGateway gateway={pay.gateway} amount={pay.amount}
          onCancel={() => setPay(null)}
          onSuccess={() => {
            const l = pay.item;
            mutate(s => { s.orders.unshift({ id: s.nextOrder++, item: l.title, emoji: l.emoji, buyer: "Adi V.", seller: l.seller, amount: pay.amount, method: pay.gateway === "mpaisa" ? "M-PAiSA" : "MyCash", status: "paid", date: "Today" }); });
            setPay(null); setSelectedPay(null); toast("Payment complete ✓ Order created"); go("orders");
          }} />
      )}

      {showFilter && <FilterSheet filters={filters} setFilters={setFilters} close={() => setShowFilter(false)} />}
      {offerFor && <OfferSheet item={offerFor} close={() => setOfferFor(null)} toast={toast} />}
      {reportFor && <ReportSheet close={() => setReportFor(null)} toast={toast} />}

      {showTabs && (
        <div className="tabbar">
          {tab("home", "🏠", "Home")}
          {tab("search", "🔍", "Search")}
          {tab("sell", "", "Sell", true)}
          {tab("chats", "💬", "Chats")}
          {tab("profile", "👤", "Me")}
        </div>
      )}
    </div>
  );
}

// ============ CARD ============
function Card({ l, liked, toggleLike, heart, go }) {
  const grad = `linear-gradient(145deg, ${l.bg} 0%, ${shade(l.bg, -8)} 100%)`;
  return (
    <div className="card" onClick={() => go("detail", l.id)}>
      <div className="img" style={{ background: grad }}>
        <span style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.12))" }}>{l.emoji}</span>
        <button className="heart" onClick={(e) => toggleLike(l.id, e)} style={{ color: liked.includes(l.id) ? "var(--coral)" : "#fff", background: liked.includes(l.id) ? "#fff" : "rgba(0,0,0,.18)", backdropFilter: "blur(4px)" }}>{heart(l.id)}</button>
        {l.featured ? <span style={{ position: "absolute", top: 8, left: 8 }} className="featured-badge">⭐ Featured</span> : <span className="cond">{l.cond}</span>}
      </div>
      <div className="meta">
        <div className="price">${l.price}</div>
        <div className="ttl">{l.title}</div>
        <div className="city">📍 {l.city}</div>
      </div>
    </div>
  );
}

// ============ HOME ============
function Home({ store, A, CATS, go, cardHTML, setCat, live }) {
  const items = live().filter(i => A.cat === "All" || i.cat === A.cat);
  const featured = live().filter(i => i.featured);
  const banner = store.banners.find(b => b.active);
  return (<>
    <div className="hero">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
        <div><div className="bula">Bula, Adi 🌺</div><h1>PreLoved Fiji</h1><div style={{ fontSize: 12.5, opacity: .9, marginTop: 3, fontWeight: 500 }}>Up to 80% off retail · new finds daily</div></div>
        <div className="heroicons"><button onClick={() => go("notifs")}>🔔{A.notifs ? <span className="dot"></span> : ""}</button></div>
      </div>
      <button className="searchbtn" onClick={() => go("search")}>🔍 Search sulu, shoes, phones…</button>
      <button className="loc" onClick={() => go("citypick")}>📍 {A.city} ▾</button>
    </div>

    {featured.length > 0 && (
      <>
        <div className="secttl" style={{ paddingBottom: 8 }}><b>⭐ Featured</b></div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 14px" }}>
          {featured.map(l => (
            <div key={l.id} onClick={() => go("detail", l.id)} style={{ minWidth: 150, background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)", cursor: "pointer" }}>
              <div style={{ background: `linear-gradient(145deg,${l.bg},${shade(l.bg, -8)})`, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>{l.emoji}<span style={{ position: "absolute", top: 6, left: 6 }} className="featured-badge">⭐</span></div>
              <div style={{ padding: "8px 10px" }}><div style={{ fontWeight: 800 }}>${l.price}</div><div style={{ fontSize: 11.5, color: "var(--slate)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div></div>
            </div>
          ))}
        </div>
      </>
    )}

    {banner && (
      <div style={{ margin: "0 16px 18px" }}>
        <div style={{ background: banner.bg, borderRadius: 16, padding: "18px 16px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontWeight: 800, fontSize: 16 }}>{banner.title}</div><div style={{ fontSize: 12, opacity: .85, marginTop: 2 }}>{banner.sub}</div></div>
          <div style={{ fontSize: 30 }}>📢</div>
        </div>
      </div>
    )}

    <div className="cats">
      <button className={"pill" + (A.cat === "All" ? " on" : "")} onClick={() => setCat("All")}>All</button>
      {CATS.map(([n, e]) => <button key={n} className={"pill" + (A.cat === n ? " on" : "")} onClick={() => setCat(n)}>{e} {n}</button>)}
    </div>
    <div className="secttl"><b>Near you in {A.city}</b><span>{items.length} items</span></div>
    {items.length ? <div className="grid">{items.map(cardHTML)}</div> : <div className="empty"><div className="big">🔍</div>No items here yet.</div>}
  </>);
}

// ============ SEARCH ============
function Search({ store, live, go, cardHTML, setShowFilter }) {
  const [q, setQ] = useState("");
  const items = live().filter(i => i.title.toLowerCase().includes(q.toLowerCase()));
  return (<>
    <div className="topbar"><button onClick={() => go("home")}>←</button><div className="t">Search</div></div>
    <div style={{ padding: "8px 16px", display: "flex", gap: 8 }}>
      <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search items…" style={{ flex: 1, padding: "12px 14px", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 14 }} />
      <button onClick={() => setShowFilter(true)} style={{ background: "var(--sand)", border: "none", borderRadius: 12, padding: "0 16px", fontSize: 18, cursor: "pointer" }}>⚙️</button>
    </div>
    <div className="secttl"><b>{q ? `Results for "${q}"` : "All items"}</b><span>{items.length}</span></div>
    {items.length ? <div className="grid">{items.map(cardHTML)}</div> : <div className="empty"><div className="big">🔍</div>Nothing found.</div>}
  </>);
}

// ============ DETAIL ============
function Detail({ item: l, go, following, toggleFollow, liked, toggleLike, heart, setOfferFor, setReportFor, mutate, store, toast }) {
  if (!l) return <div className="empty" style={{ paddingTop: 80 }}>Item not found.</div>;
  const isFollowing = following.includes(l.seller);
  return (<>
    <div style={{ position: "relative" }}>
      <div className="detail-img" style={{ background: `linear-gradient(145deg,${l.bg},${shade(l.bg, -10)})` }}>{l.emoji}</div>
      <button onClick={() => go("home")} style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "none", fontSize: 18, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>←</button>
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 8 }}>
        <button onClick={() => setReportFor(l)} style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "none", fontSize: 16, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>🚩</button>
        <button onClick={(e) => toggleLike(l.id, e)} style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "none", fontSize: 16, color: liked.includes(l.id) ? "var(--coral)" : "var(--mist)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>{heart(l.id)}</button>
      </div>
      <span style={{ position: "absolute", bottom: 12, left: 14 }} className="chip">✨ AI-enhanced</span>
      {l.featured && <span style={{ position: "absolute", bottom: 12, right: 14 }} className="featured-badge">⭐ Featured</span>}
    </div>
    <div style={{ padding: "18px 16px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div style={{ fontWeight: 800, fontSize: 26 }}>${l.price}</div><span className="chip" style={{ background: "var(--coral-soft)", color: "var(--coral)" }}>{l.cond}</span></div>
      <div style={{ fontSize: 17, marginTop: 6, fontWeight: 600 }}>{l.title}</div>
      <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 13, color: "var(--slate)" }}><span>📍 {l.city}</span><span>🏷️ {l.cat}</span><span>📏 {l.size}</span></div>
      <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6, marginTop: 14 }}>{l.desc}</p>
    </div>
    <div className="sellercard">
      <div className="avatar">{l.seller[0]}</div>
      <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 5 }}><b style={{ fontSize: 14 }}>{l.seller}</b> ✅</div><div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 2 }}>⭐ {l.rating} · Verified phone</div></div>
      <button onClick={() => go("sellerprofile", l.seller)} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ocean)", background: "none", border: "none", cursor: "pointer" }}>View</button>
      <button onClick={() => toggleFollow(l.seller)} className={"mini " + (isFollowing ? "o" : "g")} style={{ padding: "7px 12px" }}>{isFollowing ? "Following" : "+ Follow"}</button>
    </div>

    <div style={{ margin: "6px 16px 16px", padding: 14, background: "#FBF1D6", borderRadius: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: "#B8860B", display: "flex", alignItems: "center", gap: 6 }}>⭐ Want more views? Feature this listing</div>
      <div style={{ fontSize: 12.5, color: "#8a6d1a", marginTop: 5, lineHeight: 1.5 }}>Get pinned to the top of the home feed and search. Send FJD $5 via M-PAiSA / MyCash and we'll feature it for 7 days.</div>
      <button onClick={() => { mutate(s => s.featureRequests.unshift({ id: s.nextFR++, item: l.title, seller: l.seller, status: "pending" })); toast("Feature request sent — admin will confirm on payment"); }} style={{ marginTop: 10, background: "#E9B949", color: "#3d2f00", fontWeight: 800, fontSize: 13, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer" }}>Request to feature</button>
    </div>

    <div style={{ height: 96 }} />
    <div className="dock">
      <button className="btn outline" style={{ flex: 1 }} onClick={() => setOfferFor(l)}>Make offer</button>
      <button className="btn outline" style={{ flex: 1 }} onClick={() => go("thread")}>💬</button>
      <button className="btn" style={{ flex: 1.3 }} onClick={() => go("checkout", l.id)}>Buy now</button>
    </div>
  </>);
}

// ============ CHECKOUT ============
// Platform & Processing Fee — bundles carrier fee, fixed charge & VAT into one line.
// Rates set so PreLoved Fiji nets the same profit on either wallet.
export function processingFee(price, key) {
  if (key === "mpaisa") return price * 0.05 + 0.40; // Vodafone M-PAiSA: 5% + $0.40
  if (key === "mycash") return price * 0.05 + 0.35; // Digicel MyCash: 5% + $0.35
  if (key === "card") return price * 0.05 + 0.40;   // Card: same basis as M-PAiSA
  return 0;                                          // Cash on meetup: no processing fee
}

function Checkout({ item: l, go, selectedPay, setSelectedPay, setPay }) {
  if (!l) return <div className="empty" style={{ paddingTop: 80 }}>Item not found.</div>;
  const methods = [
    { id: 0, key: "mpaisa", icon: "📱", name: "M-PAiSA", sub: "Vodafone wallet" },
    { id: 1, key: "mycash", icon: "💳", name: "MyCash", sub: "Digicel wallet" },
    { id: 2, key: "card", icon: "💳", name: "Card", sub: "Visa / Mastercard" },
    { id: 3, key: "cash", icon: "🤝", name: "Cash on meetup", sub: "Pay in person" },
  ];
  const key = selectedPay !== null ? methods[selectedPay].key : "mpaisa";
  const isCash = key === "cash";
  const fee = processingFee(l.price, key);
  const total = l.price + fee;
  return (<>
    <div className="topbar"><button onClick={() => go("detail", l.id)}>←</button><div className="t">Checkout</div></div>
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, background: "#fff", borderRadius: 14, padding: 12, boxShadow: "var(--shadow-card)" }}>
        <div style={{ width: 60, height: 60, borderRadius: 12, background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{l.emoji}</div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{l.title}</div><div style={{ fontSize: 12.5, color: "var(--slate)" }}>📍 {l.city} · {l.cond}</div></div>
        <div style={{ fontWeight: 800 }}>${l.price}</div>
      </div>

      <div style={{ fontWeight: 800, fontSize: 15, margin: "22px 0 12px" }}>Payment method</div>
      {methods.map(m => (
        <div key={m.id} onClick={() => setSelectedPay(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, border: "1.5px solid " + (selectedPay === m.id ? "var(--ocean)" : "var(--line)"), marginBottom: 10, cursor: "pointer", background: selectedPay === m.id ? "var(--sand)" : "#fff" }}>
          <div style={{ fontSize: 22 }}>{m.icon}</div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div><div style={{ fontSize: 12, color: "var(--mist)" }}>{m.sub}</div></div>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (selectedPay === m.id ? "var(--ocean)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center" }}>{selectedPay === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ocean)" }} />}</div>
        </div>
      ))}

      <div style={{ background: "#fff", borderRadius: 14, padding: 16, marginTop: 10, boxShadow: "var(--shadow-card)" }}>
        <Row k="Item price" v={`$${l.price.toFixed(2)}`} />
        <Row k="Platform & Processing Fee" v={isCash ? "$0.00" : `$${fee.toFixed(2)}`} />
        <div style={{ fontSize: 11, color: "var(--mist)", lineHeight: 1.45, marginTop: 2, marginBottom: 4 }}>{isCash ? "No processing fee — you'll pay in person at meetup." : "Includes carrier fees, fixed charges & applicable VAT, bundled into one transparent charge."}</div>
        <div style={{ borderTop: "1px solid var(--line)", margin: "10px 0" }} />
        <Row k="Total" v={`$${total.toFixed(2)}`} bold />
      </div>

      <button className="btn" style={{ marginTop: 18, opacity: selectedPay === null ? .5 : 1 }} onClick={() => {
        if (selectedPay === null) return;
        const m = methods[selectedPay];
        if (m.key === "mpaisa" || m.key === "mycash") setPay({ gateway: m.key, amount: total, item: l });
        else if (m.key === "cash") go("orders");
        else go("orders");
      }}>{selectedPay !== null && (methods[selectedPay].key === "mpaisa" || methods[selectedPay].key === "mycash") ? `Pay with ${methods[selectedPay].name}` : "Confirm order"}</button>
    </div>
  </>);
}
function Row({ k, v, bold }) { return <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? 16 : 13.5, fontWeight: bold ? 800 : 500, color: bold ? "var(--ink)" : "var(--slate)", padding: "3px 0" }}><span>{k}</span><span>{v}</span></div>; }

// ============ SELL ============
function Sell({ sellStep, setSellStep, enhanced, setEnhanced, sellCat, setSellCat, sellFeature, setSellFeature, store, mutate, toast, go, setScreen }) {
  const fee = store.categoryFees.find(f => f.cat === sellCat && f.on);
  return (<>
    <div className="topbar"><button onClick={() => { if (sellStep > 1) setSellStep(sellStep - 1); else go("home"); }}>←</button><div className="t">List an item</div><div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--mist)", fontWeight: 600 }}>Step {sellStep}/3</div></div>
    <div style={{ height: 3, background: "var(--line)" }}><div style={{ height: "100%", width: `${sellStep / 3 * 100}%`, background: "var(--ocean)", transition: ".3s" }} /></div>

    {sellStep === 1 && (
      <div style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18 }}>Add a photo</div>
        <div style={{ border: "2px dashed var(--line)", borderRadius: 16, padding: "36px 20px", textAlign: "center", background: enhanced ? "linear-gradient(145deg,#EAF3F0,#F5EEE2)" : "var(--sand)" }}>
          <div style={{ fontSize: 52 }}>{enhanced ? "👗" : "📷"}</div>
          <div style={{ fontSize: 13.5, color: "var(--slate)", marginTop: 10 }}>{enhanced ? "Background removed & enhanced!" : "Tap to add a photo of your item"}</div>
        </div>
        <div style={{ padding: "14px 0" }}><button className="btn coral" onClick={() => { setEnhanced(true); toast("✨ AI cleaned up your photo"); }}>✨ AI Clean &amp; Enhance</button></div>
        <button className="btn" onClick={() => setSellStep(2)}>Continue</button>
      </div>
    )}
    {sellStep === 2 && (
      <div style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18 }}>Item details</div>
        <div className="field"><div className="flabel">Title</div><input className="inp" id="sTitle" defaultValue="Hand-stitched Sulu Jaba" /></div>
        <div className="field"><div className="flabel">Description</div><textarea className="inp" id="sDesc" rows={3} defaultValue="Traditional two-piece, worn once for a wedding." /></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><div className="flabel">Price (FJD)</div><input className="inp" id="sPrice" defaultValue="28" /></div>
          <div style={{ flex: 1 }}><div className="flabel">Category</div><select className="inp" id="sCat" defaultValue={sellCat} onChange={e => setSellCat(e.target.value)}>{CATS.map(([n]) => <option key={n}>{n}</option>)}</select></div>
        </div>
        <div className="field" style={{ marginTop: 16 }}><div className="flabel">Condition</div><select className="inp" id="sCond" defaultValue="Excellent"><option>Like new</option><option>Excellent</option><option>Good</option></select></div>
        <button className="btn" onClick={() => { const c = document.getElementById("sCat").value; setSellCat(c); setSellStep(3); }}>Continue</button>
      </div>
    )}
    {sellStep === 3 && (
      <div style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18 }}>Meetup &amp; location</div>
        <div className="field"><div className="flabel">Location</div><select className="inp" id="sCity">{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div style={{ padding: 14, background: "#EAF3F0", borderRadius: 14, fontSize: 12.5, color: "var(--ocean-dark)", lineHeight: 1.5, marginBottom: 18 }}>💡 Items with meetup + AI photos sell up to 3× faster.</div>

        <div style={{ marginBottom: 16, padding: 14, background: "#FBF1D6", borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setSellFeature(!sellFeature)}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: "#B8860B" }}>⭐ Feature this listing (+$5)</div><div style={{ fontSize: 12, color: "#8a6d1a", marginTop: 3 }}>Pin to the top of the home feed &amp; search for 7 days</div></div>
            <div style={{ width: 46, height: 27, borderRadius: 999, background: sellFeature ? "#E9B949" : "#d5dbda", position: "relative", flexShrink: 0 }}><div style={{ position: "absolute", top: 3, left: sellFeature ? 22 : 3, width: 21, height: 21, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: ".15s" }} /></div>
          </div>
        </div>

        {fee && (
          <div style={{ marginBottom: 18, padding: 14, background: "#FCE8E2", borderRadius: 14, fontSize: 12.5, color: "var(--coral)", lineHeight: 1.5 }}>
            <b>💵 {sellCat} listing fee: ${fee.fee}</b><br />A flat fee applies to this category. Pay via M-PAiSA / MyCash after posting.
          </div>
        )}

        <button className="btn" onClick={() => {
          const title = document.getElementById("sTitle")?.value || "New listing";
          const price = +document.getElementById("sPrice")?.value || 0;
          const cat = document.getElementById("sCat")?.value || sellCat;
          const cond = document.getElementById("sCond")?.value || "Good";
          const cityV = document.getElementById("sCity")?.value || "Suva";
          const emoji = CATS.find(c => c[0] === cat)?.[1] || "📦";
          mutate(s => {
            const id = s.nextId++;
            s.items.unshift({ id, title, price, cond, city: cityV, cat, emoji, seller: "Adi V.", rating: 4.9, bg: BGS[id % 4], desc: document.getElementById("sDesc")?.value || "", status: "live", size: "M", featured: false });
            if (sellFeature) s.featureRequests.unshift({ id: s.nextFR++, item: title, seller: "Adi V.", status: "pending" });
          });
          const wasFeature = sellFeature; setSellFeature(false); setSellStep(1); setEnhanced(false);
          go("posted"); toast(wasFeature ? "Listing posted — feature request sent" : "Listing posted — live now!");
        }}>Post listing</button>
      </div>
    )}
  </>);
}
function Posted({ go }) {
  return <div style={{ padding: "80px 30px", textAlign: "center" }}>
    <div style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--grad-ocean)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 20px" }}>✓</div>
    <div style={{ fontSize: 22, fontWeight: 800 }}>You're live!</div>
    <div style={{ fontSize: 14, color: "var(--slate)", marginTop: 8, lineHeight: 1.6 }}>Your item is now on PreLoved Fiji for buyers across {`Suva, Nadi & beyond`} to discover.</div>
    <button className="btn" style={{ marginTop: 28 }} onClick={() => go("home")}>Back to home</button>
    <button className="btn outline" style={{ marginTop: 12 }} onClick={() => go("profile")}>View my listings</button>
  </div>;
}

// ============ CHATS ============
function Chats({ go }) {
  const chats = [
    { name: "Mere T.", item: "Sulu Jaba, hand-stitched", msg: "Bula! Is this still available?", time: "2m", emoji: "👗", unread: true },
    { name: "Ravi P.", item: "Acoustic guitar", msg: "Can you do $85?", time: "1h", emoji: "🎸", unread: true },
    { name: "Ana K.", item: "Rattan beach bag", msg: "See you at the market 😊", time: "3h", emoji: "👜" },
  ];
  return (<>
    <div className="hero" style={{ paddingBottom: 18 }}><h1 style={{ position: "relative", zIndex: 1 }}>Messages</h1></div>
    {chats.map((c, i) => (
      <div key={i} onClick={() => go("thread")} className="listrow" style={{ cursor: "pointer" }}>
        <div className="avatar" style={{ width: 48, height: 48, position: "relative" }}>{c.name[0]}{c.unread && <span style={{ position: "absolute", top: 0, right: 0, width: 11, height: 11, background: "var(--coral)", borderRadius: "50%", border: "2px solid #fff" }} />}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 14.5 }}>{c.name}</b><span style={{ fontSize: 11.5, color: "var(--mist)" }}>{c.time}</span></div>
          <div style={{ fontSize: 12, color: "var(--ocean)", margin: "2px 0" }}>{c.emoji} {c.item}</div>
          <div style={{ fontSize: 13, color: "var(--slate)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: c.unread ? 700 : 400 }}>{c.msg}</div>
        </div>
      </div>
    ))}
  </>);
}
function Thread({ go }) {
  const msgs = [["them", "Bula! Is this still available?"], ["me", "Yes it is! 😊"], ["them", "Great — would you take $25?"], ["me", "I can do $26, meet in Suva?"], ["them", "Perfect, see you Saturday!"]];
  return (<>
    <div className="topbar"><button onClick={() => go("chats")}>←</button><div className="avatar" style={{ width: 34, height: 34, fontSize: 15 }}>M</div><div><div style={{ fontWeight: 700, fontSize: 14 }}>Mere T.</div><div style={{ fontSize: 11, color: "var(--green)" }}>● Online</div></div></div>
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: "center", margin: "0 0 16px" }}><span style={{ background: "var(--sand)", padding: "8px 14px", borderRadius: 10, fontSize: 12, color: "var(--slate)" }}>👗 Sulu Jaba, hand-stitched · $28</span></div>
      {msgs.map(([who, t], i) => (
        <div key={i} style={{ display: "flex", justifyContent: who === "me" ? "flex-end" : "flex-start", marginBottom: 10 }}>
          <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: 16, fontSize: 13.5, background: who === "me" ? "var(--ocean)" : "#fff", color: who === "me" ? "#fff" : "var(--ink)", boxShadow: "var(--shadow-sm)" }}>{t}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "#fff", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
      <input placeholder="Message…" style={{ flex: 1, padding: "11px 14px", border: "1.5px solid var(--line)", borderRadius: 20, fontSize: 14 }} />
      <button style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--ocean)", color: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}>➤</button>
    </div>
  </>);
}

// ============ PROFILE ============
function Profile({ go, store, following }) {
  const mine = store.items.filter(i => i.seller === "Adi V." || i.seller === "Mere T.").slice(0, 4);
  return (<>
    <div className="hero" style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 26, background: "#fff", color: "var(--ocean)" }}>A</div>
        <div><div style={{ fontSize: 20, fontWeight: 800 }}>Adi Vakalolo</div><div style={{ fontSize: 12.5, opacity: .9 }}>⭐ 4.9 · 📍 Suva · ✅ Verified</div></div>
      </div>
    </div>
    <div style={{ display: "flex", margin: "-24px 16px 0", background: "#fff", borderRadius: 16, boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
      {[["42", "Sold"], ["8", "Listed"], [String(following.length), "Following"]].map(([n, l], i) => (
        <div key={i} style={{ flex: 1, textAlign: "center", padding: "16px 0", borderRight: i < 2 ? "1px solid var(--line)" : "none" }}><div style={{ fontWeight: 800, fontSize: 20, color: "var(--ocean)" }}>{n}</div><div style={{ fontSize: 12, color: "var(--slate)" }}>{l}</div></div>
      ))}
    </div>
    <div style={{ padding: 16 }}>
      {[["🛍️", "My orders", "orders"], ["❤️", "Favourites", "favourites"], ["⭐", "My reviews", "reviews"], ["⚙️", "Settings", "settings"]].map(([ic, t, s]) => (
        <div key={t} className="listrow" style={{ cursor: "pointer" }} onClick={() => go(s)}><span style={{ fontSize: 17, width: 26 }}>{ic}</span><span style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>{t}</span><span style={{ color: "var(--mist)" }}>›</span></div>
      ))}
    </div>
  </>);
}
function SellerProfile({ seller, store, go, following, toggleFollow, cardHTML }) {
  const items = store.items.filter(i => i.seller === seller && i.status === "live");
  const reviews = store.reviews[seller] || [];
  const isF = following.includes(seller);
  return (<>
    <div className="topbar"><button onClick={() => go("home")}>←</button><div className="t">Seller</div></div>
    <div style={{ padding: 20, textAlign: "center" }}>
      <div className="avatar" style={{ width: 76, height: 76, fontSize: 30, margin: "0 auto" }}>{seller[0]}</div>
      <div style={{ fontSize: 19, fontWeight: 800, marginTop: 10 }}>{seller} ✅</div>
      <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>⭐ 4.9 · Verified phone · 📍 Suva</div>
      <button onClick={() => toggleFollow(seller)} className="btn" style={{ width: "auto", padding: "10px 30px", margin: "16px auto 0", background: isF ? "#fff" : undefined, color: isF ? "var(--ocean)" : undefined, border: isF ? "1.5px solid var(--ocean)" : "none", boxShadow: isF ? "none" : undefined }}>{isF ? "Following" : "+ Follow"}</button>
    </div>
    <div className="secttl"><b>Listings ({items.length})</b></div>
    {items.length > 0 && <div className="grid">{items.map(cardHTML)}</div>}
    {reviews.length > 0 && <>
      <div className="secttl"><b>Reviews</b></div>
      <div style={{ padding: "0 16px" }}>{reviews.map(([who, txt, stars], i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: "var(--shadow-sm)" }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 13.5 }}>{who}</b><span style={{ color: "var(--gold)" }}>{"★".repeat(stars)}</span></div><div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>{txt}</div></div>
      ))}</div>
    </>}
  </>);
}
function Reviews({ store, go }) {
  const all = Object.entries(store.reviews).flatMap(([s, rs]) => rs.map(r => [s, ...r]));
  return (<>
    <div className="topbar"><button onClick={() => go("profile")}>←</button><div className="t">Reviews</div></div>
    <div style={{ padding: 16 }}>{all.map(([seller, who, txt, stars], i) => (
      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: "var(--shadow-sm)" }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 13.5 }}>{who} → {seller}</b><span style={{ color: "var(--gold)" }}>{"★".repeat(stars)}</span></div><div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>{txt}</div></div>
    ))}</div>
  </>);
}
function Bundle({ go }) {
  return (<>
    <div className="topbar"><button onClick={() => go("settings")}>←</button><div className="t">Bundle offers</div></div>
    <div style={{ padding: 16 }}>
      <div style={{ background: "linear-gradient(145deg,#EAF3F0,#F5EEE2)", borderRadius: 16, padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>🎁</div>
        <div style={{ fontWeight: 800, fontSize: 16, marginTop: 8 }}>Save with bundles</div>
        <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 6, lineHeight: 1.5 }}>Buy multiple items from the same seller and save on the meetup. Sellers can offer a bundle discount.</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--mist)", textAlign: "center", marginTop: 20 }}>No active bundles right now.</div>
    </div>
  </>);
}

// ============ FAVOURITES / ORDERS / NOTIFS ============
function Favourites({ store, liked, go, cardHTML }) {
  const items = store.items.filter(i => liked.includes(i.id));
  return (<>
    <div className="hero" style={{ paddingBottom: 18 }}><h1 style={{ position: "relative", zIndex: 1 }}>Favourites</h1></div>
    {items.length ? <div className="grid">{items.map(cardHTML)}</div> : <div className="empty"><div className="big">❤️</div>No favourites yet.</div>}
  </>);
}
function Orders({ store, go }) {
  return (<>
    <div className="topbar"><button onClick={() => go("profile")}>←</button><div className="t">My orders</div></div>
    <div style={{ padding: 16 }}>
      {store.orders.map(o => (
        <div key={o.id} style={{ display: "flex", gap: 12, background: "#fff", borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: "var(--shadow-card)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--sand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{o.emoji || "📦"}</div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{o.item}</div><div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{o.method} · {o.date}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800 }}>${o.amount.toFixed(2)}</div><span className="chip" style={{ background: o.status === "paid" ? "#E7F6EF" : "#FBF1D6", color: o.status === "paid" ? "var(--green)" : "#B8860B", fontSize: 10.5 }}>{o.status}</span></div>
        </div>
      ))}
    </div>
  </>);
}
function Notifs({ go }) {
  const items = [["⭐", "Mere T. followed you", "2m"], ["💬", "New message from Ravi P.", "1h"], ["🎉", "Your item sold! Cast iron pot", "3h"], ["💰", "New offer on Sulu Jaba", "5h"]];
  return (<>
    <div className="topbar"><button onClick={() => go("home")}>←</button><div className="t">Notifications</div></div>
    <div style={{ padding: "8px 0" }}>{items.map(([ic, t, tm], i) => (
      <div key={i} className="listrow"><span style={{ fontSize: 18, width: 26 }}>{ic}</span><span style={{ flex: 1, fontSize: 14 }}>{t}</span><span style={{ fontSize: 11.5, color: "var(--mist)" }}>{tm}</span></div>
    ))}</div>
  </>);
}
function CityPick({ city, setCity, go }) {
  return (<>
    <div className="topbar"><button onClick={() => go("home")}>←</button><div className="t">Choose location</div></div>
    <div style={{ padding: "8px 0" }}>{CITIES.map(c => (
      <div key={c} className="listrow" style={{ cursor: "pointer" }} onClick={() => { setCity(c); go("home"); }}><span style={{ fontSize: 17, width: 26 }}>📍</span><span style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>{c}</span>{city === c && <span style={{ color: "var(--ocean)" }}>✓</span>}</div>
    ))}</div>
  </>);
}

// ============ SETTINGS ============
function Settings({ go, city, following, setAuthed }) {
  const row = (icon, label, action, extra) => (
    <div className="listrow" style={{ cursor: action ? "pointer" : "default" }} onClick={action}><span style={{ fontSize: 17, width: 24 }}>{icon}</span><span style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>{label}</span>{extra || <span style={{ color: "var(--mist)" }}>›</span>}</div>
  );
  const grp = g => <div style={{ padding: "16px 16px 8px", fontSize: 12, fontWeight: 800, color: "var(--mist)", letterSpacing: ".5px", textTransform: "uppercase" }}>{g}</div>;
  return (<>
    <div className="topbar"><button onClick={() => go("profile")}>←</button><div className="t">Settings</div></div>
    {grp("Account")}
    {row("👤", "Edit profile", () => go("editprofile"))}
    {row("✅", "Verification & trust", null, <span className="chip" style={{ background: "#E7F6EF", color: "var(--green)" }}>Verified</span>)}
    {row("💳", "Payout method", null, <span style={{ fontSize: 12.5, color: "var(--mist)" }}>M-PAiSA</span>)}
    {grp("Selling")}
    {row("🎁", "Bundle offers", () => go("bundle"))}
    {row("⭐", "My reviews", () => go("reviews"))}
    {row("👥", "Following", () => go("following"), <span style={{ background: "var(--sand-dark)", color: "var(--slate)", fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "2px 9px" }}>{following.length}</span>)}
    {grp("Preferences")}
    {row("🔔", "Notifications", () => go("notifsettings"))}
    {row("📍", "Default location", () => go("citypick"), <span style={{ fontSize: 12.5, color: "var(--mist)" }}>{city}</span>)}
    {grp("Support")}
    {row("❓", "Help centre", () => { })}
    {row("🛡️", "Safety guidelines", () => { })}
    {row("🚩", "Report a problem", () => { })}
    <div style={{ padding: 16 }}><button className="btn outline" style={{ color: "var(--coral)", borderColor: "var(--coral-soft)" }} onClick={() => setAuthed(false)}>Log out</button></div>
    <div style={{ textAlign: "center", fontSize: 11, color: "var(--mist)", paddingBottom: 20 }}>PreLoved Fiji · Prototype</div>
  </>);
}
function NotifSettings({ prefs, setPrefs, go }) {
  const tog = (key, label, desc) => (
    <div className="listrow" style={{ cursor: "pointer" }} onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}>
      <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 12, color: "var(--mist)", marginTop: 2 }}>{desc}</div></div>
      <div style={{ width: 46, height: 27, borderRadius: 999, background: prefs[key] ? "var(--ocean)" : "#d5dbda", position: "relative", flexShrink: 0, transition: ".2s" }}><div style={{ position: "absolute", top: 3, left: prefs[key] ? 22 : 3, width: 21, height: 21, borderRadius: 999, background: "#fff", transition: ".2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} /></div>
    </div>
  );
  return (<>
    <div className="topbar"><button onClick={() => go("settings")}>←</button><div className="t">Notifications</div></div>
    <div style={{ padding: "8px 0" }}>
      {tog("pushMsg", "New messages", "When a buyer or seller messages you")}
      {tog("pushOffers", "Offers", "When someone makes or replies to an offer")}
      {tog("pushSales", "Sales & likes", "When your item sells or gets liked")}
      {tog("emailUpdates", "Email updates", "Occasional news and tips by email")}
    </div>
    <div style={{ padding: 16, fontSize: 12.5, color: "var(--mist)", lineHeight: 1.5 }}>These control what PreLoved Fiji notifies you about. Changes save automatically.</div>
  </>);
}
function EditProfile({ city, go, toast }) {
  return (<>
    <div className="topbar"><button onClick={() => go("settings")}>←</button><div className="t">Edit profile</div></div>
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><div style={{ position: "relative" }}><div className="avatar" style={{ width: 84, height: 84, fontSize: 34 }}>A</div><div style={{ position: "absolute", bottom: 0, right: 0, background: "var(--ocean)", width: 28, height: 28, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, border: "2px solid #fff" }}>📷</div></div></div>
      <div className="field"><div className="flabel">Name</div><input className="inp" defaultValue="Adi Vakalolo" /></div>
      <div className="field"><div className="flabel">Mobile</div><input className="inp" defaultValue="+679 999 1234" /></div>
      <div className="field"><div className="flabel">Location</div><select className="inp" defaultValue={city}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div className="field"><div className="flabel">Bio</div><textarea className="inp" rows={3} defaultValue="Selling pre-loved treasures from Suva 🌺" /></div>
      <button className="btn" onClick={() => { toast("Profile saved"); go("settings"); }}>Save changes</button>
    </div>
  </>);
}
function FollowingScreen({ following, toggleFollow, go }) {
  return (<>
    <div className="topbar"><button onClick={() => go("settings")}>←</button><div className="t">Following</div></div>
    {following.length ? following.map(s => (
      <div key={s} className="listrow"><div className="avatar" style={{ width: 42, height: 42 }}>{s[0]}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 700 }}>{s}</div><div style={{ fontSize: 12, color: "var(--mist)" }}>Seller</div></div><button className="mini o" onClick={() => toggleFollow(s)} style={{ padding: "7px 14px" }}>Unfollow</button></div>
    )) : <div className="empty"><div className="big">👥</div>Not following anyone yet.</div>}
  </>);
}

// ============ SHEETS ============
function FilterSheet({ filters, setFilters, close }) {
  const [f, setF] = useState(filters);
  return (
    <div className="modal-bg" onClick={e => e.target.classList.contains("modal-bg") && close()} style={{ alignItems: "flex-end" }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 390 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Filters</div>
        <div className="flabel">Max price: ${f.max}</div>
        <input type="range" min="5" max="200" value={f.max} onChange={e => setF({ ...f, max: +e.target.value })} style={{ width: "100%" }} />
        <div className="flabel" style={{ marginTop: 16 }}>Condition</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["Any", "Like new", "Excellent", "Good"].map(c => <button key={c} onClick={() => setF({ ...f, cond: c })} className={"pill" + (f.cond === c ? " on" : "")}>{c}</button>)}</div>
        <button className="btn" style={{ marginTop: 22 }} onClick={() => { setFilters(f); close(); }}>Apply filters</button>
      </div>
    </div>
  );
}
function OfferSheet({ item, close, toast }) {
  const [amt, setAmt] = useState(Math.round(item.price * 0.85));
  return (
    <div className="modal-bg" onClick={e => e.target.classList.contains("modal-bg") && close()} style={{ alignItems: "flex-end" }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 390 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Make an offer</div>
        <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 18 }}>{item.title} · listed at ${item.price}</div>
        <div style={{ textAlign: "center", fontSize: 38, fontWeight: 800, color: "var(--ocean)" }}>${amt}</div>
        <input type="range" min={Math.round(item.price * 0.4)} max={item.price} value={amt} onChange={e => setAmt(+e.target.value)} style={{ width: "100%", marginTop: 12 }} />
        <button className="btn" style={{ marginTop: 22 }} onClick={() => { toast(`Offer of $${amt} sent to ${item.seller}`); close(); }}>Send offer</button>
      </div>
    </div>
  );
}
function ReportSheet({ close, toast }) {
  const reasons = ["Counterfeit or fake", "Prohibited item", "Offensive content", "Suspected scam", "Other"];
  return (
    <div className="modal-bg" onClick={e => e.target.classList.contains("modal-bg") && close()} style={{ alignItems: "flex-end" }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 390 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Report listing</div>
        {reasons.map(r => <div key={r} className="listrow" style={{ cursor: "pointer" }} onClick={() => { toast("Report submitted — thank you"); close(); }}><span style={{ flex: 1, fontSize: 14 }}>{r}</span><span style={{ color: "var(--mist)" }}>›</span></div>)}
      </div>
    </div>
  );
}
