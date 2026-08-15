import React, { useState } from "react";
import { CATS, CITIES, BGS } from "./data.js";

export default function AdminPanel({ store, mutate, toast }) {
  const [page, setPage] = useState("guide");
  const [modal, setModal] = useState(null); // {type:'item'|'user', id}

  const nav = [["guide", "📖 Guide & How-To"], ["dashboard", "📊 Dashboard"], ["listings", "🏷️ Listings"], ["orders", "🧾 Orders"], ["users", "👥 Users"], ["disputes", "⚖️ Disputes"], ["reports", "🚩 Reports"]];
  const moneyNav = [["featurereq", "⭐ Feature requests"], ["banners", "📢 Ad banners"], ["fees", "💵 Category fees"]];

  return (
    <div className="admin-main" style={{ display: "flex" }}>
      <div className="side">
        <div className="brand">🌺 PreLoved Fiji</div>
        {nav.map(([p, l]) => <a key={p} className={page === p ? "on" : ""} onClick={() => setPage(p)}>{l}</a>)}
        <div style={{ margin: "14px 8px 6px", fontSize: 10.5, fontWeight: 800, color: "rgba(255,255,255,.5)", letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 6 }}>MONETIZATION</div>
        {moneyNav.map(([p, l]) => <a key={p} className={page === p ? "on" : ""} onClick={() => setPage(p)}>{l}</a>)}
        <div style={{ margin: "18px 8px", padding: 12, background: "rgba(255,255,255,.08)", borderRadius: 10, fontSize: 11.5, color: "rgba(255,255,255,.7)" }}>Signed in as<br /><b style={{ color: "#fff" }}>admin@prelovedfiji.com</b></div>
      </div>

      <div className="admin-stage" id="adminStage">
        {page === "guide" && <Guide setPage={setPage} />}
        {page === "dashboard" && <Dashboard store={store} />}
        {page === "listings" && <Listings store={store} mutate={mutate} toast={toast} openModal={(id) => setModal({ type: "item", id })} />}
        {page === "orders" && <OrdersAdmin store={store} mutate={mutate} toast={toast} />}
        {page === "users" && <Users store={store} mutate={mutate} toast={toast} openModal={(id) => setModal({ type: "user", id })} />}
        {page === "disputes" && <Disputes store={store} mutate={mutate} toast={toast} />}
        {page === "reports" && <Reports store={store} mutate={mutate} toast={toast} />}
        {page === "featurereq" && <FeatureReq store={store} mutate={mutate} toast={toast} />}
        {page === "banners" && <Banners store={store} mutate={mutate} toast={toast} />}
        {page === "fees" && <Fees store={store} mutate={mutate} toast={toast} />}
      </div>

      {modal?.type === "item" && <ItemModal store={store} mutate={mutate} toast={toast} id={modal.id} close={() => setModal(null)} />}
      {modal?.type === "user" && <UserModal store={store} mutate={mutate} toast={toast} id={modal.id} close={() => setModal(null)} />}
    </div>
  );
}

const H1 = ({ children }) => <h1>{children}</h1>;
const Desc = ({ children }) => <div className="desc">{children}</div>;
const Tag = ({ kind, children }) => <span className={"tag " + kind}>{children}</span>;

// ============ GUIDE ============
function Guide({ setPage }) {
  const card = (icon, title, body, accent) => (
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderLeft: `4px solid ${accent}`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: accent, marginBottom: 8 }}>{icon} {title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: "#333" }}>{body}</div>
    </div>
  );
  const step = (n, t, d) => (
    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
      <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: "var(--ocean)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{n}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: "#333" }}><b>{t}</b> — {d}</div>
    </div>
  );
  return (<>
    <H1>📖 Guide &amp; How-To</H1>
    <Desc>Everything the PreLoved Fiji team needs to run the marketplace. Take a minute to read through — it covers every button and screen.</Desc>

    <div style={{ background: "#EAF3F0", borderRadius: 14, padding: "18px 20px", marginBottom: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ocean-dark)", marginBottom: 6 }}>🔄 The most important thing: everything is live</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "#084F4F" }}>Any change made here in the panel appears in the mobile app straight away — and anything buyers or sellers do in the app appears here. Add a product, and it's on the app home feed instantly. Someone buys in the app, and the order shows up under Orders. It works both ways, automatically.</div>
    </div>

    <div style={{ background: "#FBF1D6", borderRadius: 14, padding: "16px 20px", marginBottom: 26 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#8a6d1a", marginBottom: 5 }}>💾 Your changes are saved</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#8a6d1a" }}>This demo remembers your changes even if you refresh the page. To start fresh with the original sample data, click <b>Reset demo data</b> at the bottom of the sidebar area on the dashboard.</div>
    </div>

    <h2 style={{ fontSize: 18, margin: "0 0 14px", color: "var(--ink)" }}>Managing listings</h2>
    {card("🏷️", "Add, edit, hide or delete a product", <>On the <b>Listings</b> page: <b>+ Add product</b> creates a new listing (it appears in the app immediately). <b>Edit</b> opens the same form pre-filled so you can change any detail. <b>Hide</b> takes it off the app without deleting it; <b>Approve</b> puts a pending one live. <b>Delete</b> removes it for good.</>, "#0B6E6E")}
    {card("⭐", "Feature a listing", <>Click the <b>Feature</b> button in the Featured column to pin any listing to the top of the app home feed and search. Click again to remove it. A gold "Featured" badge shows on the item in the app.</>, "#E9B949")}

    <h2 style={{ fontSize: 18, margin: "22px 0 14px", color: "var(--ink)" }}>Orders, users &amp; issues</h2>
    {card("🧾", "Orders & transactions", <>Every purchase from the app lands on the <b>Orders</b> page with the item, buyer, seller, payment method and amount. For a cash-on-meetup order you can <b>Mark paid</b> once money changes hands, or <b>Delete</b> an order if needed.</>, "#0B6E6E")}
    {card("👥", "Users", <>On the <b>Users</b> page you can <b>+ Add user</b>, <b>Edit</b> their details, <b>Suspend</b> a troublesome account (or <b>Restore</b> it), and <b>Delete</b> a user. The verified badge marks trusted, phone-verified accounts.</>, "#0E8A8A")}
    {card("⚖️ 🚩", "Disputes & reports", <>When a buyer and seller disagree, it appears under <b>Disputes</b> — click <b>Resolve</b> once sorted. When someone flags a listing or user in the app, it appears under <b>Reports</b> — click <b>Dismiss</b> after reviewing.</>, "#F26A4B")}

    <h2 style={{ fontSize: 18, margin: "22px 0 14px", color: "var(--ink)" }}>Earning from the marketplace</h2>
    {card("⭐", "Feature requests", <>When a seller asks to feature their listing (from the app), it appears under <b>Feature requests</b>. Once they have sent the FJD $5 by M-PAiSA / MyCash, click <b>Confirm &amp; feature</b> and it pins to the top of the app.</>, "#F26A4B")}
    {card("📢", "Ad banners", <>On the <b>Ad banners</b> page you can turn a promotional banner on or off in the app home feed. Charge a local business to show their banner, or use the slot for your own promotions.</>, "#F26A4B")}
    {card("💵", "Category fees", <>On the <b>Category fees</b> page, set a flat listing fee for high-value categories like Vehicles or Electronics. Turn a fee on or off anytime. Sellers see the fee noted when they list in that category.</>, "#F26A4B")}

    <h2 style={{ fontSize: 18, margin: "22px 0 14px", color: "var(--ink)" }}>A quick walkthrough to try now</h2>
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
      {step(1, "Add a product", "Go to Listings → + Add product, fill it in, Save. Watch it appear.")}
      {step(2, "See it in the app", "Click “📱 Buyer app” at the top — your new product is on the home feed.")}
      {step(3, "Buy it", "In the app, open the item and tap Buy now → pick M-PAiSA or MyCash → pay.")}
      {step(4, "See the order", "Back in the panel, open Orders — the sale is there.")}
      {step(5, "Feature something", "On Listings, click Feature on any item, then check the app home feed.")}
    </div>

    <div style={{ marginTop: 26 }}>
      <button className="adminbtn" onClick={() => setPage("dashboard")}>Go to Dashboard →</button>
    </div>
  </>);
}

// ============ DASHBOARD ============
function Dashboard({ store }) {
  const live = store.items.filter(i => i.status === "live").length;
  const pending = store.items.filter(i => i.status === "pending").length;
  const revenue = store.orders.filter(o => o.status === "paid").reduce((a, b) => a + b.amount, 0);
  const openIssues = store.reports.filter(r => r.status === "open").length + store.disputes.filter(d => d.status === "open").length;
  const stat = (label, value, accent) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "var(--shadow-card)", borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>{label}</div>
    </div>
  );
  return (<>
    <H1>Dashboard</H1><Desc>Live overview of your marketplace.</Desc>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
      {stat("Live listings", live, "#0B6E6E")}
      {stat("Pending approval", pending, "#E9B949")}
      {stat("Registered users", store.users.length, "#0E8A8A")}
      {stat("Revenue (paid)", "$" + revenue.toFixed(0), "#22A06B")}
      {stat("Open issues", openIssues, "#F26A4B")}
    </div>
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "var(--shadow-card)" }}>
      <div style={{ fontWeight: 800, marginBottom: 12 }}>Recent orders</div>
      {store.orders.slice(0, 4).map(o => (
        <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
          <span>{o.emoji} {o.item}</span><span style={{ fontWeight: 700 }}>${o.amount.toFixed(2)} · <Tag kind={o.status === "paid" ? "paid" : "meetup"}>{o.status}</Tag></span>
        </div>
      ))}
    </div>
  </>);
}

// ============ LISTINGS ============
function Listings({ store, mutate, toast, openModal }) {
  return (<>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><H1>Listings</H1><button className="adminbtn" onClick={() => openModal(null)}>+ Add product</button></div>
    <Desc>Add, approve, hide or delete · reflects in the app instantly · the Featured column pins items to the top.</Desc>
    <table><thead><tr><th>Item</th><th>Price</th><th>Category</th><th>Seller</th><th>Status</th><th>Featured ★</th><th>Actions</th></tr></thead><tbody>
      {store.items.map(l => (
        <tr key={l.id}>
          <td><span className="thumb" style={{ background: l.bg }}>{l.emoji}</span> <b>{l.title}</b></td>
          <td>${l.price}</td><td>{l.cat}</td><td>{l.seller}</td>
          <td><Tag kind={l.status === "live" ? "live" : l.status === "pending" ? "pending" : "hidden-t"}>{l.status}</Tag></td>
          <td><button onClick={() => { mutate(s => { const it = s.items.find(x => x.id === l.id); it.featured = !it.featured; }); toast("Featured updated"); }} style={{ background: l.featured ? "#E9B949" : "#eee", color: l.featured ? "#3d2f00" : "#999", fontWeight: 800, fontSize: 11.5, padding: "5px 11px", borderRadius: 999, border: "none", cursor: "pointer" }}>{l.featured ? "⭐ Featured" : "Feature"}</button></td>
          <td style={{ whiteSpace: "nowrap" }}>
            {l.status !== "live"
              ? <button className="mini g" onClick={() => { mutate(s => { s.items.find(x => x.id === l.id).status = "live"; }); toast("Approved"); }}>Approve</button>
              : <button className="mini o" onClick={() => { mutate(s => { s.items.find(x => x.id === l.id).status = "hidden"; }); toast("Hidden"); }}>Hide</button>}
            {" "}<button className="mini" style={{ background: "#EAF3F0", color: "#0B6E6E" }} onClick={() => openModal(l.id)}>Edit</button>
            {" "}<button className="mini r" onClick={() => { mutate(s => { s.items = s.items.filter(x => x.id !== l.id); }); toast("Deleted from app too"); }}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody></table>
  </>);
}

// ============ ORDERS ============
function OrdersAdmin({ store, mutate, toast }) {
  const revenue = store.orders.filter(o => o.status === "paid").reduce((a, b) => a + b.amount, 0);
  return (<>
    <H1>Orders</H1><Desc>Every sale from the app. Paid revenue: <b>${revenue.toFixed(2)}</b></Desc>
    <table><thead><tr><th>Order</th><th>Item</th><th>Buyer</th><th>Seller</th><th>Method</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {store.orders.map(o => (
        <tr key={o.id}>
          <td>#{o.id}</td><td>{o.emoji || "📦"} {o.item}</td><td>{o.buyer}</td><td>{o.seller}</td><td>{o.method}</td><td><b>${o.amount.toFixed(2)}</b></td>
          <td><Tag kind={o.status === "paid" ? "paid" : "meetup"}>{o.status}</Tag></td>
          <td>
            {o.status === "meetup" && <button className="mini g" onClick={() => { mutate(s => { s.orders.find(x => x.id === o.id).status = "paid"; }); toast("Marked paid"); }}>Mark paid</button>}
            {" "}<button className="mini r" onClick={() => { mutate(s => { s.orders = s.orders.filter(x => x.id !== o.id); }); toast("Order deleted"); }}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody></table>
  </>);
}

// ============ USERS ============
function Users({ store, mutate, toast, openModal }) {
  return (<>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><H1>Users</H1><button className="adminbtn" onClick={() => openModal(null)}>+ Add user</button></div>
    <Desc>Registered buyers and sellers · add, edit, suspend or remove.</Desc>
    <table><thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Sales</th><th>Rating</th><th>Verified</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {store.users.map(u => (
        <tr key={u.id}>
          <td><span className="avatar" style={{ width: 34, height: 34, fontSize: 15, display: "inline-flex" }}>{u.name[0]}</span> <b>{u.name}</b></td>
          <td>{u.phone}</td><td>{u.city}</td><td>{u.sales}</td><td>⭐ {u.rating}</td>
          <td>{u.verified ? <Tag kind="live">Verified</Tag> : <Tag kind="pending">Unverified</Tag>}</td>
          <td><Tag kind={u.status === "active" ? "live" : "hidden-t"}>{u.status}</Tag></td>
          <td style={{ whiteSpace: "nowrap" }}>
            <button className={"mini " + (u.status === "active" ? "r" : "g")} onClick={() => { mutate(s => { const x = s.users.find(y => y.id === u.id); x.status = x.status === "active" ? "suspended" : "active"; }); toast("User updated"); }}>{u.status === "active" ? "Suspend" : "Restore"}</button>
            {" "}<button className="mini" style={{ background: "#EAF3F0", color: "#0B6E6E" }} onClick={() => openModal(u.id)}>Edit</button>
            {" "}<button className="mini r" onClick={() => { if (confirm("Remove this user?")) { mutate(s => { s.users = s.users.filter(y => y.id !== u.id); }); toast("User removed"); } }}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody></table>
  </>);
}

// ============ DISPUTES / REPORTS ============
function Disputes({ store, mutate, toast }) {
  return (<>
    <H1>Disputes</H1><Desc>Buyer–seller issues to resolve.</Desc>
    <table><thead><tr><th>Item</th><th>Buyer</th><th>Seller</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {store.disputes.map(d => (
        <tr key={d.id}><td><b>{d.item}</b></td><td>{d.buyer}</td><td>{d.seller}</td><td>{d.reason}</td><td><Tag kind={d.status === "open" ? "pending" : "live"}>{d.status}</Tag></td>
          <td>{d.status === "open" ? <button className="mini g" onClick={() => { mutate(s => { s.disputes.find(x => x.id === d.id).status = "resolved"; }); toast("Dispute resolved"); }}>Resolve</button> : "—"}</td></tr>
      ))}
    </tbody></table>
  </>);
}
function Reports({ store, mutate, toast }) {
  return (<>
    <H1>Reports</H1><Desc>Community flags from the app.</Desc>
    <table><thead><tr><th>Type</th><th>Target</th><th>Reported by</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {store.reports.map(r => (
        <tr key={r.id}><td>{r.type}</td><td><b>{r.target}</b></td><td>{r.by}</td><td>{r.reason}</td><td><Tag kind={r.status === "open" ? "pending" : "live"}>{r.status}</Tag></td>
          <td>{r.status === "open" ? <button className="mini g" onClick={() => { mutate(s => { s.reports.find(x => x.id === r.id).status = "reviewed"; }); toast("Report dismissed"); }}>Dismiss</button> : "—"}</td></tr>
      ))}
    </tbody></table>
  </>);
}

// ============ MONETIZATION ============
function FeatureReq({ store, mutate, toast }) {
  return (<>
    <H1>⭐ Feature Requests</H1><Desc>Sellers asking to feature their listing · confirm once payment received via M-PAiSA / MyCash.</Desc>
    {store.featureRequests.length ? (
      <table><thead><tr><th>Item</th><th>Seller</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {store.featureRequests.map(r => (
          <tr key={r.id}><td><b>{r.item}</b></td><td>{r.seller}</td><td>FJD $5 / 7 days</td><td><Tag kind={r.status === "approved" ? "live" : "pending"}>{r.status}</Tag></td>
            <td>{r.status === "pending" ? <button className="mini g" onClick={() => { mutate(s => { const rr = s.featureRequests.find(x => x.id === r.id); rr.status = "approved"; const it = s.items.find(i => i.title === rr.item); if (it) it.featured = true; }); toast("Featured — now pinned in the app"); }}>Confirm &amp; feature</button> : "—"}</td></tr>
        ))}
      </tbody></table>
    ) : <div style={{ padding: 40, textAlign: "center", color: "var(--mist)" }}>No requests yet. In the app, open any listing → “Request to feature”.</div>}
  </>);
}
function Banners({ store, mutate, toast }) {
  return (<>
    <H1>📢 Ad Banners</H1><Desc>Upload promo banners for the app feed, or leave a slot for a sponsor.</Desc>
    <table><thead><tr><th>Banner</th><th>Subtitle</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {store.banners.map(b => (
        <tr key={b.id}><td><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 4, background: b.bg, verticalAlign: "middle", marginRight: 6 }} /><b>{b.title}</b></td><td>{b.sub}</td><td><Tag kind={b.active ? "live" : "hidden-t"}>{b.active ? "showing" : "off"}</Tag></td>
          <td><button className={"mini " + (b.active ? "o" : "g")} onClick={() => { mutate(s => { if (!b.active) { s.banners.forEach(x => x.active = false); s.banners.find(x => x.id === b.id).active = true; } else s.banners.find(x => x.id === b.id).active = false; }); toast("Banner updated"); }}>{b.active ? "Turn off" : "Show"}</button></td></tr>
      ))}
    </tbody></table>
    <div style={{ marginTop: 18, padding: 16, background: "var(--sand)", borderRadius: 12, fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}><b style={{ color: "var(--ink)" }}>How to earn:</b> Upload a sponsor's graphic and charge them directly (fits Phase 1).</div>
  </>);
}
function Fees({ store, mutate, toast }) {
  return (<>
    <H1>💵 Category Fees</H1><Desc>Set a flat listing fee for high-value categories · collected manually in Phase 1.</Desc>
    <table><thead><tr><th>Category</th><th>Listing fee (FJD)</th><th>Charging?</th><th>Action</th></tr></thead><tbody>
      {store.categoryFees.map((f, i) => (
        <tr key={f.cat}><td><b>{f.cat}</b></td><td>{f.on ? "$" + f.fee : "—"}</td><td><Tag kind={f.on ? "live" : "hidden-t"}>{f.on ? "on" : "off"}</Tag></td>
          <td><button className={"mini " + (f.on ? "o" : "g")} onClick={() => { mutate(s => { s.categoryFees[i].on = !s.categoryFees[i].on; }); toast("Category fee updated"); }}>{f.on ? "Turn off" : "Turn on"}</button></td></tr>
      ))}
    </tbody></table>
  </>);
}

// ============ MODALS ============
function ItemModal({ store, mutate, toast, id, close }) {
  const it = id ? store.items.find(x => x.id === id) : null;
  const [emoji, setEmoji] = useState(it ? it.emoji : "👗");
  return (
    <div className="modal-bg" onClick={e => e.target.classList.contains("modal-bg") && close()}>
      <div className="modal">
        <h3>{it ? "Edit product" : "Add new product"}</h3>
        <div className="adm-field"><label>Title</label><input id="mTitle" defaultValue={it ? it.title : ""} placeholder="e.g. Vintage denim jacket" /></div>
        <div className="adm-field"><label>Description</label><textarea id="mDesc" rows={2} defaultValue={it ? it.desc : ""} /></div>
        <div className="row2"><div className="adm-field"><label>Price (FJD)</label><input id="mPrice" type="number" defaultValue={it ? it.price : ""} /></div><div className="adm-field"><label>Condition</label><select id="mCond" defaultValue={it ? it.cond : "Good"}><option>Like new</option><option>Excellent</option><option>Good</option></select></div></div>
        <div className="row2"><div className="adm-field"><label>Category</label><select id="mCat" defaultValue={it ? it.cat : "Women"} onChange={e => { const em = CATS.find(c => c[0] === e.target.value); if (em) setEmoji(em[1]); }}>{CATS.map(([n]) => <option key={n}>{n}</option>)}</select></div><div className="adm-field"><label>City</label><select id="mCity" defaultValue={it ? it.city : "Suva"}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div></div>
        <div className="adm-field"><label>Seller name</label><input id="mSeller" defaultValue={it ? it.seller : "Adi V."} /></div>
        <div className="adm-field"><label>Image</label><div className="emoji-pick">{["👗", "🧥", "👟", "🔊", "👜", "🍲", "🎸", "📱", "🍼", "💄"].map(e => <button key={e} className={e === emoji ? "on" : ""} onClick={() => setEmoji(e)}>{e}</button>)}</div></div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="mini o" style={{ flex: 1, padding: 12 }} onClick={close}>Cancel</button>
          <button className="adminbtn" style={{ flex: 2 }} onClick={() => {
            const title = document.getElementById("mTitle").value.trim(); if (!title) { toast("Please enter a title"); return; }
            const data = { title, price: +document.getElementById("mPrice").value || 0, cond: document.getElementById("mCond").value, cat: document.getElementById("mCat").value, city: document.getElementById("mCity").value, seller: document.getElementById("mSeller").value || "Admin", desc: document.getElementById("mDesc").value, emoji };
            mutate(s => {
              if (it) Object.assign(s.items.find(x => x.id === id), data);
              else { const nid = s.nextId++; s.items.unshift({ id: nid, ...data, rating: 5.0, bg: BGS[nid % 4], status: "live", size: "M", featured: false }); }
            });
            toast(it ? "Changes saved — updated in the app 📱" : "Product published — live in the app! 📱"); close();
          }}>{it ? "Save changes" : "Save & publish"}</button>
        </div>
      </div>
    </div>
  );
}
function UserModal({ store, mutate, toast, id, close }) {
  const u = id ? store.users.find(x => x.id === id) : null;
  return (
    <div className="modal-bg" onClick={e => e.target.classList.contains("modal-bg") && close()}>
      <div className="modal">
        <h3>{u ? "Edit user" : "Add user"}</h3>
        <div className="adm-field"><label>Name</label><input id="uName" defaultValue={u ? u.name : ""} placeholder="e.g. Sana K." /></div>
        <div className="row2"><div className="adm-field"><label>Phone</label><input id="uPhone" defaultValue={u ? u.phone : "+679 "} /></div><div className="adm-field"><label>City</label><select id="uCity" defaultValue={u ? u.city : "Suva"}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div></div>
        <div className="row2"><div className="adm-field"><label>Sales</label><input id="uSales" type="number" defaultValue={u ? u.sales : 0} /></div><div className="adm-field"><label>Rating</label><input id="uRating" type="number" step="0.1" defaultValue={u ? u.rating : 5.0} /></div></div>
        <div className="adm-field"><label>Verified</label><select id="uVerified" defaultValue={u ? (u.verified ? "yes" : "no") : "yes"}><option value="yes">Verified</option><option value="no">Unverified</option></select></div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="mini o" style={{ flex: 1, padding: 12 }} onClick={close}>Cancel</button>
          <button className="adminbtn" style={{ flex: 2 }} onClick={() => {
            const name = document.getElementById("uName").value.trim(); if (!name) { toast("Please enter a name"); return; }
            const data = { name, phone: document.getElementById("uPhone").value, city: document.getElementById("uCity").value, sales: +document.getElementById("uSales").value || 0, rating: +document.getElementById("uRating").value || 5, verified: document.getElementById("uVerified").value === "yes" };
            mutate(s => {
              if (u) Object.assign(s.users.find(x => x.id === id), data);
              else { const nid = Math.max(0, ...s.users.map(x => x.id)) + 1; s.users.push({ id: nid, status: "active", ...data }); }
            });
            toast(u ? "User updated" : "User added"); close();
          }}>{u ? "Save changes" : "Add user"}</button>
        </div>
      </div>
    </div>
  );
}
