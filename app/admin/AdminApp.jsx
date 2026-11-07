"use client";

import { useEffect, useState } from "react";

/* ---------- small field primitives ---------- */

function F({ label, value, onChange, hint, type = "text" }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      {hint && <div className="admin-hint">{hint}</div>}
    </div>
  );
}

function TA({ label, value, onChange, hint, rows = 4 }) {
  return (
    <div>
      <label>{label}</label>
      <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      {hint && <div className="admin-hint">{hint}</div>}
    </div>
  );
}

function Lines({ label, value, onChange, hint }) {
  return (
    <TA
      label={label}
      rows={Math.min(12, (value?.length || 3) + 2)}
      value={(value || []).join("\n")}
      onChange={(v) => onChange(v.split("\n"))}
      hint={hint || "One item per line."}
    />
  );
}

function FaqEd({ faqs, onChange }) {
  const list = faqs || [];
  const set = (i, k, v) => onChange(list.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  return (
    <div>
      <label>FAQs (auto-generates FAQPage JSON-LD)</label>
      {list.map((f, i) => (
        <div className="admin-list-item" key={i}>
          <F label={`Question ${i + 1}`} value={f.q} onChange={(v) => set(i, "q", v)} />
          <TA label="Answer" value={f.a} rows={2} onChange={(v) => set(i, "a", v)} />
          <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { q: "", a: "" }])}>+ Add FAQ</button>
    </div>
  );
}

function Pairs({ label, value, onChange }) {
  const list = value || [];
  const set = (i, k, v) => onChange(list.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  return (
    <div>
      <label>{label}</label>
      {list.map((p, i) => (
        <div className="admin-list-item" key={i}>
          <F label="Heading" value={p.h} onChange={(v) => set(i, "h", v)} />
          <TA label="Text" value={p.p} rows={2} onChange={(v) => set(i, "p", v)} />
          <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { h: "", p: "" }])}>+ Add</button>
    </div>
  );
}

function ImgField({ label, value, onChange }) {
  const v = value || { src: "", alt: "" };
  const [busy, setBusy] = useState(false);
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) {
      const j = await res.json();
      onChange({ src: j.src, alt: v.alt || j.alt });
    } else {
      alert("Upload failed.");
    }
  }
  return (
    <div className="admin-list-item">
      <label>{label}</label>
      <div className="row2">
        <F label="Image path" value={v.src} onChange={(s) => onChange({ ...v, src: s })} hint="/images/… or /uploads/…" />
        <F label="Alt text (max 125 chars)" value={v.alt} onChange={(a) => onChange({ ...v, alt: a })} />
      </div>
      <input type="file" accept="image/*" onChange={upload} />
      {busy && <span className="admin-hint"> Uploading & converting to WebP…</span>}
      {v.src && <img src={v.src} alt={v.alt || ""} style={{ maxWidth: 220, marginTop: 8, borderRadius: 8 }} />}
    </div>
  );
}

/* ---------- main app ---------- */

const TABS = ["Global Settings", "Schema Markup Data", "Pages", "Services", "Locations", "Blog", "Images", "Messages", "Password"];

export default function AdminApp() {
  const [tab, setTab] = useState(TABS[0]);
  const [content, setContent] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return <p>Loading…</p>;

  const set = (path, value) => {
    const next = structuredClone(content);
    const keys = path.split(".");
    let obj = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setContent(next);
  };

  const stampToday = (path) => set(`${path}.updatedAt`, new Date().toISOString().slice(0, 10));

  async function save(note = "Saved — live site updated.") {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setMsg(res.ok ? note : "Save failed.");
    setTimeout(() => setMsg(""), 4000);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  const s = content.settings;
  const today = () => new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="admin-nav">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
        <button onClick={logout} style={{ marginLeft: "auto" }}>Log out</button>
      </div>
      {msg && <p className="admin-msg">{msg}</p>}

      {tab === "Global Settings" && (
        <div className="admin-card">
          <h2>Global Settings</h2>
          <p className="admin-hint">These update the header, footer, contact page, llm.txt and schema site-wide.</p>
          <div className="row2">
            <F label="Business name" value={s.businessName} onChange={(v) => set("settings.businessName", v)} />
            <F label="Tagline" value={s.tagline} onChange={(v) => set("settings.tagline", v)} />
            <F label="Phone" value={s.phone} onChange={(v) => set("settings.phone", v)} hint="Updates every tel: link site-wide." />
            <F label="WhatsApp number" value={s.whatsapp} onChange={(v) => set("settings.whatsapp", v)} hint="Auto-builds the floating button wa.me link." />
            <F label="Email" value={s.email} onChange={(v) => set("settings.email", v)} />
            <F label="Website domain" value={s.domain} onChange={(v) => set("settings.domain", v)} hint="e.g. https://cleannitjs.com" />
            <F label="Licence number" value={s.license} onChange={(v) => set("settings.license", v)} />
            <F label="Founder" value={s.founder} onChange={(v) => set("settings.founder", v)} />
            <F label="Founded year" value={s.foundedYear} onChange={(v) => set("settings.foundedYear", v)} />
            <F label="Logo path" value={s.logo} onChange={(v) => set("settings.logo", v)} hint="Replace/upload in the Images tab." />
            <F label="Favicon path" value={s.favicon} onChange={(v) => set("settings.favicon", v)} hint="Replace/upload in the Images tab." />
            <F label="Google Business Profile URL" value={s.gbpUrl} onChange={(v) => set("settings.gbpUrl", v)} />
          </div>
          <TA label="WhatsApp pre-filled greeting" value={s.whatsappMessage} rows={2}
            onChange={(v) => set("settings.whatsappMessage", v)} hint="Sent automatically when someone taps the WhatsApp button." />
          <Lines label="Social profile URLs" value={s.social} onChange={(v) => set("settings.social", v)} hint="One URL per line — feeds Organization schema sameAs." />
          <button className="btn btn-primary admin-save" onClick={() => save()}>Save Settings</button>
        </div>
      )}

      {tab === "Schema Markup Data" && (
        <div className="admin-card">
          <h2>Schema Markup Data</h2>
          <p className="admin-hint">
            Single source of truth: every field here is injected into all JSON-LD schemas (LocalBusiness, Organization,
            Service, FAQPage, BreadcrumbList, Article, Review) across the whole site. Empty fields are omitted from schema output.
          </p>
          <div className="row2">
            <div>
              <label>Business type (schema.org)</label>
              <select value={s.businessType} onChange={(e) => set("settings.businessType", e.target.value)}>
                {["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness", "ProfessionalService", "Organization"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <F label="Price range (optional)" value={s.priceRange} onChange={(v) => set("settings.priceRange", v)} hint="e.g. $$" />
            <F label="Currencies accepted (optional)" value={s.currenciesAccepted} onChange={(v) => set("settings.currenciesAccepted", v)} hint="e.g. CAD" />
            <F label="Google Maps link" value={s.mapsUrl} onChange={(v) => set("settings.mapsUrl", v)} />
            <F label="Geo latitude" value={s.geo?.lat} onChange={(v) => set("settings.geo.lat", v)} />
            <F label="Geo longitude" value={s.geo?.lng} onChange={(v) => set("settings.geo.lng", v)} />
            <F label="Aggregate rating (optional)" value={s.aggregateRating?.ratingValue} onChange={(v) => set("settings.aggregateRating.ratingValue", v)} hint="e.g. 4.9" />
            <F label="Review count (optional)" value={s.aggregateRating?.reviewCount} onChange={(v) => set("settings.aggregateRating.reviewCount", v)} hint="e.g. 57" />
          </div>
          <h3 style={{ marginTop: 20 }}>Address (NAP)</h3>
          <div className="row2">
            <F label="Street" value={s.address?.street} onChange={(v) => set("settings.address.street", v)} />
            <F label="City" value={s.address?.city} onChange={(v) => set("settings.address.city", v)} />
            <F label="Region / Province" value={s.address?.region} onChange={(v) => set("settings.address.region", v)} />
            <F label="Postal code" value={s.address?.postalCode} onChange={(v) => set("settings.address.postalCode", v)} />
            <F label="Country" value={s.address?.country} onChange={(v) => set("settings.address.country", v)} />
          </div>
          <h3 style={{ marginTop: 20 }}>Opening hours</h3>
          <div className="row3">
            {Object.keys(s.hours).map((d) => (
              <div key={d} className="admin-list-item">
                <label style={{ textTransform: "capitalize" }}>{d}</label>
                <label style={{ fontWeight: 400 }}>
                  <input type="checkbox" style={{ width: "auto", marginRight: 6 }}
                    checked={!!s.hours[d].closed}
                    onChange={(e) => set(`settings.hours.${d}.closed`, e.target.checked)} />
                  Closed
                </label>
                {!s.hours[d].closed && (
                  <div className="row2">
                    <F label="Opens" type="time" value={s.hours[d].open} onChange={(v) => set(`settings.hours.${d}.open`, v)} />
                    <F label="Closes" type="time" value={s.hours[d].close} onChange={(v) => set(`settings.hours.${d}.close`, v)} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Lines label="Service area (feeds areaServed everywhere)" value={s.serviceArea} onChange={(v) => set("settings.serviceArea", v)} hint="One city/suburb per line." />
          <p className="admin-hint">Services for Service schema are managed in the Services tab — one Service schema is generated per service page automatically. FAQPage schema is generated from each page's FAQ block.</p>
          <button className="btn btn-primary admin-save" onClick={() => save("Saved — all JSON-LD schemas re-rendered site-wide.")}>Save Schema Data</button>
        </div>
      )}

      {tab === "Pages" && (
        <>
          {["home", "about", "contact"].map((key) => {
            const p = content.pages[key];
            return (
              <div className="admin-card" key={key}>
                <h2 style={{ textTransform: "capitalize" }}>{key} page</h2>
                <F label="SEO title (50–60 chars)" value={p.title} onChange={(v) => set(`pages.${key}.title`, v)} />
                <TA label="Meta description (150–160 chars)" rows={2} value={p.metaDescription} onChange={(v) => set(`pages.${key}.metaDescription`, v)} />
                <F label="H1" value={p.h1} onChange={(v) => set(`pages.${key}.h1`, v)} />
                {p.intro !== undefined && (
                  <TA label="Intro (keyword + location in first 100 words)" value={p.intro} onChange={(v) => set(`pages.${key}.intro`, v)} />
                )}
                {p.whyChoose !== undefined && (
                  <Lines label="Why-choose-us points" value={p.whyChoose} onChange={(v) => set(`pages.${key}.whyChoose`, v)} />
                )}
                {p.blocks !== undefined && (
                  <Pairs label="Content blocks" value={p.blocks} onChange={(v) => set(`pages.${key}.blocks`, v)} />
                )}
                {p.faqs !== undefined && (
                  <FaqEd faqs={p.faqs} onChange={(v) => set(`pages.${key}.faqs`, v)} />
                )}
                {p.heroImage !== undefined && (
                  <ImgField label="Hero image" value={p.heroImage} onChange={(v) => set(`pages.${key}.heroImage`, v)} />
                )}
                {p.founderImage !== undefined && (
                  <ImgField label="Founder image" value={p.founderImage} onChange={(v) => set(`pages.${key}.founderImage`, v)} />
                )}
                <button className="btn btn-primary admin-save" onClick={() => { stampToday(`pages.${key}`); save(`Saved — ${key} page updated, "last updated" refreshed.`); }}>Save {key} page</button>
              </div>
            );
          })}
        </>
      )}

      {tab === "Services" && (
        <CollectionEditor
          items={content.services}
          kind="services"
          setContent={setContent}
          content={content}
          onSave={save}
          stampToday={stampToday}
          newItem={() => ({
            slug: `service-${Date.now().toString(36)}`, name: "New Service", shortDesc: "",
            cardImage: { src: "", alt: "" }, hero: { src: "", alt: "" },
            title: "", metaDescription: "", h1: "", intro: "",
            includes: { heading: "What's Included", items: [] },
            benefits: [], problems: [], process: [], whyChoose: "",
            gallery: [], faqs: [], related: [], blogLink: null, updatedAt: today(),
          })}
          renderFields={(item, base) => (
            <>
              <div className="row2">
                <F label="Service name (H3 on cards)" value={item.name} onChange={(v) => set(`${base}.name`, v)} />
                <F label="URL slug" value={item.slug} onChange={(v) => set(`${base}.slug`, v)} hint="lowercase-hyphenated — changing it changes the URL" />
              </div>
              <TA label="Card description (1–2 lines)" rows={2} value={item.shortDesc} onChange={(v) => set(`${base}.shortDesc`, v)} />
              <F label="SEO title (50–60 chars)" value={item.title} onChange={(v) => set(`${base}.title`, v)} />
              <TA label="Meta description (150–160 chars)" rows={2} value={item.metaDescription} onChange={(v) => set(`${base}.metaDescription`, v)} />
              <F label="H1" value={item.h1} onChange={(v) => set(`${base}.h1`, v)} />
              <TA label="Intro (150–200 words)" value={item.intro} onChange={(v) => set(`${base}.intro`, v)} />
              <F label="'What's included' heading" value={item.includes?.heading} onChange={(v) => set(`${base}.includes.heading`, v)} />
              <Lines label="Included items" value={item.includes?.items} onChange={(v) => set(`${base}.includes.items`, v)} />
              <Lines label="Benefits" value={item.benefits} onChange={(v) => set(`${base}.benefits`, v)} />
              <Pairs label="Common problems" value={item.problems} onChange={(v) => set(`${base}.problems`, v)} />
              <Pairs label="Process steps" value={item.process} onChange={(v) => set(`${base}.process`, v)} />
              <TA label="Why choose us" value={item.whyChoose} onChange={(v) => set(`${base}.whyChoose`, v)} />
              <ImgField label="Card image" value={item.cardImage} onChange={(v) => set(`${base}.cardImage`, v)} />
              <ImgField label="Hero image" value={item.hero} onChange={(v) => set(`${base}.hero`, v)} />
              <GalleryEd value={item.gallery} onChange={(v) => set(`${base}.gallery`, v)} />
              <Lines label="Related service slugs" value={item.related} onChange={(v) => set(`${base}.related`, v.filter(Boolean))} />
              <FaqEd faqs={item.faqs} onChange={(v) => set(`${base}.faqs`, v)} />
            </>
          )}
        />
      )}

      {tab === "Locations" && (
        <CollectionEditor
          items={content.locations}
          kind="locations"
          setContent={setContent}
          content={content}
          onSave={save}
          stampToday={stampToday}
          newItem={() => ({
            slug: `location-${Date.now().toString(36)}`, name: "New Location",
            title: "", metaDescription: "", h1: "", intro: "", local: "", projects: "",
            image: { src: "", alt: "" }, landmarks: [], faqs: [], updatedAt: today(),
          })}
          renderFields={(item, base) => (
            <>
              <div className="row2">
                <F label="Location name" value={item.name} onChange={(v) => set(`${base}.name`, v)} />
                <F label="URL slug" value={item.slug} onChange={(v) => set(`${base}.slug`, v)} />
              </div>
              <F label="SEO title (50–60 chars)" value={item.title} onChange={(v) => set(`${base}.title`, v)} />
              <TA label="Meta description (150–160 chars)" rows={2} value={item.metaDescription} onChange={(v) => set(`${base}.metaDescription`, v)} />
              <F label="H1" value={item.h1} onChange={(v) => set(`${base}.h1`, v)} />
              <TA label="Intro (location keyword in first 100 words)" value={item.intro} onChange={(v) => set(`${base}.intro`, v)} />
              <TA label="Local coverage paragraph" value={item.local} onChange={(v) => set(`${base}.local`, v)} />
              <TA label="Recent local work" rows={2} value={item.projects} onChange={(v) => set(`${base}.projects`, v)} />
              <Lines label="Landmarks / neighbourhoods" value={item.landmarks} onChange={(v) => set(`${base}.landmarks`, v)} />
              <ImgField label="Location image" value={item.image} onChange={(v) => set(`${base}.image`, v)} />
              <FaqEd faqs={item.faqs} onChange={(v) => set(`${base}.faqs`, v)} />
            </>
          )}
        />
      )}

      {tab === "Blog" && (
        <CollectionEditor
          items={content.posts}
          kind="posts"
          setContent={setContent}
          content={content}
          onSave={save}
          stampToday={stampToday}
          newItem={() => ({
            slug: `post-${Date.now().toString(36)}`, title: "New Post", metaDescription: "", excerpt: "",
            image: { src: "", alt: "" }, date: today(), updatedAt: today(), body: [], faqs: [],
          })}
          renderFields={(item, base) => (
            <>
              <div className="row2">
                <F label="Post title" value={item.title} onChange={(v) => set(`${base}.title`, v)} />
                <F label="URL slug" value={item.slug} onChange={(v) => set(`${base}.slug`, v)} />
              </div>
              <TA label="Meta description" rows={2} value={item.metaDescription} onChange={(v) => set(`${base}.metaDescription`, v)} />
              <TA label="Excerpt (card text)" rows={2} value={item.excerpt} onChange={(v) => set(`${base}.excerpt`, v)} />
              <F label="Publish date" type="date" value={item.date} onChange={(v) => set(`${base}.date`, v)} />
              <ImgField label="Post image" value={item.image} onChange={(v) => set(`${base}.image`, v)} />
              <Pairs label="Body sections (H2 + paragraph)" value={item.body} onChange={(v) => set(`${base}.body`, v)} />
              <FaqEd faqs={item.faqs} onChange={(v) => set(`${base}.faqs`, v)} />
            </>
          )}
        />
      )}

      {tab === "Images" && <ImagesTab content={content} set={set} save={save} />}
      {tab === "Messages" && <MessagesTab />}
      {tab === "Password" && <PasswordTab />}
    </div>
  );
}

/* ---------- collection editor (services / locations / blog) ---------- */

function CollectionEditor({ items, kind, content, setContent, onSave, newItem, renderFields }) {
  const [open, setOpen] = useState(null);

  function updateList(next) {
    setContent({ ...content, [kind]: next });
  }
  function move(i, dir) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    updateList(next);
  }
  function remove(i) {
    if (!confirm(`Delete "${items[i].name || items[i].title}"? This removes its page from the site and sitemap.`)) return;
    updateList(items.filter((_, j) => j !== i));
    setOpen(null);
  }
  function add() {
    updateList([...items, newItem()]);
    setOpen(items.length);
  }

  return (
    <div className="admin-card">
      <h2 style={{ textTransform: "capitalize" }}>{kind}</h2>
      <p className="admin-hint">Add, edit, reorder or delete — the page, navigation, sitemap.xml and schema update automatically.</p>
      {items.map((item, i) => (
        <div className="admin-list-item" key={item.slug}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <b style={{ flex: 1 }}>{item.name || item.title}</b>
            <button type="button" onClick={() => move(i, -1)}>↑</button>
            <button type="button" onClick={() => move(i, 1)}>↓</button>
            <button type="button" onClick={() => setOpen(open === i ? null : i)}>{open === i ? "Close" : "Edit"}</button>
            <button type="button" onClick={() => remove(i)}>Delete</button>
          </div>
          {open === i && (
            <div style={{ marginTop: 14 }}>
              {renderFields(item, `${kind}.${i}`)}
              <button className="btn btn-primary admin-save" onClick={() => {
                const next = structuredClone(content);
                next[kind][i].updatedAt = new Date().toISOString().slice(0, 10);
                setContent(next);
                fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) })
                  .then((r) => alert(r.ok ? "Saved — page and sitemap updated." : "Save failed."));
              }}>Save this {kind === "posts" ? "post" : kind.slice(0, -1)}</button>
            </div>
          )}
        </div>
      ))}
      <button className="btn btn-accent" type="button" onClick={add}>+ Add new {kind === "posts" ? "post" : kind === "services" ? "service" : "location"}</button>
      <div><button className="btn btn-primary admin-save" onClick={() => onSave()}>Save order & list</button></div>
    </div>
  );
}

/* ---------- gallery editor ---------- */

function GalleryEd({ value, onChange }) {
  const list = value || [];
  const set = (i, v) => onChange(list.map((g, j) => (j === i ? v : g)));
  return (
    <div>
      <label>Gallery images (3–6 recommended)</label>
      {list.map((g, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <ImgField label={`Gallery image ${i + 1}`} value={g} onChange={(v) => set(i, v)} />
          <F label="Caption" value={g.caption} onChange={(c) => set(i, { ...g, caption: c })} />
          <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}>Remove image</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { src: "", alt: "", caption: "" }])}>+ Add gallery image</button>
    </div>
  );
}

/* ---------- messages inbox ---------- */

function MessagesTab() {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    fetch("/api/admin/messages").then((r) => r.json()).then(setMessages);
  }, []);
  if (!messages) return <div className="admin-card"><p>Loading…</p></div>;
  async function mark(id, read) {
    await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read }) });
    setMessages(messages.map((m) => (m.id === id ? { ...m, read } : m)));
  }
  async function del(id) {
    await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages(messages.filter((m) => m.id !== id));
  }
  return (
    <div className="admin-card">
      <h2>Contact Form Inbox</h2>
      {messages.length === 0 && <p>No submissions yet.</p>}
      {messages.map((m) => (
        <div className="admin-list-item" key={m.id} style={{ opacity: m.read ? 0.65 : 1 }}>
          <b>{m.name}</b> — {m.phone} {m.email ? `· ${m.email}` : ""} {m.service ? `· ${m.service}` : ""} {m.city ? `· ${m.city}` : ""}
          <div className="admin-hint">{new Date(m.date).toLocaleString()}</div>
          {m.message && <p style={{ margin: "8px 0" }}>{m.message}</p>}
          <button type="button" onClick={() => mark(m.id, !m.read)}>{m.read ? "Mark unread" : "Mark read"}</button>{" "}
          <button type="button" onClick={() => del(m.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/* ---------- password ---------- */

function PasswordTab() {
  const [state, setState] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    const j = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Password updated." : j.error || "Failed.");
  }
  return (
    <form className="admin-card" onSubmit={submit}>
      <h2>Change Admin Password</h2>
      <F label="Current password" type="password" value={state.currentPassword} onChange={(v) => setState({ ...state, currentPassword: v })} />
      <F label="New password (min 10 characters)" type="password" value={state.newPassword} onChange={(v) => setState({ ...state, newPassword: v })} />
      <button className="btn btn-primary admin-save" type="submit">Update Password</button>
      {msg && <p className="admin-msg">{msg}</p>}
    </form>
  );
}

/* ---------- images tab: every image on the site, replaceable ---------- */

function StrImg({ label, value, onChange }) {
  // For string image fields (logo, favicon) instead of {src, alt} objects.
  const [busy, setBusy] = useState(false);
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) {
      const j = await res.json();
      onChange(j.src);
    } else {
      alert("Upload failed.");
    }
  }
  return (
    <div className="admin-list-item">
      <label>{label}</label>
      <F label="Path" value={value} onChange={onChange} />
      <input type="file" accept="image/*" onChange={upload} />
      {busy && <span className="admin-hint"> Uploading & converting to WebP…</span>}
      {value && <img src={value} alt={label} style={{ maxWidth: 160, marginTop: 8, borderRadius: 8 }} />}
    </div>
  );
}

function ImagesTab({ content, set, save }) {
  return (
    <div className="admin-card">
      <h2>Site Images</h2>
      <p className="admin-hint">Replace any image on the site — uploads are auto-converted to WebP and resized. Save when done.</p>
      <h3 style={{ marginTop: 18 }}>Brand</h3>
      <StrImg label="Logo" value={content.settings.logo} onChange={(v) => set("settings.logo", v)} />
      <StrImg label="Favicon" value={content.settings.favicon || ""} onChange={(v) => set("settings.favicon", v)} />
      <h3 style={{ marginTop: 18 }}>Pages</h3>
      <ImgField label="Home hero image" value={content.pages.home.heroImage} onChange={(v) => set("pages.home.heroImage", v)} />
      <ImgField label="Founder image (home + about)" value={content.pages.about.founderImage} onChange={(v) => set("pages.about.founderImage", v)} />
      <ImgField label="Fleet / van image (home)" value={content.settings.fleetImage || { src: "", alt: "" }} onChange={(v) => set("settings.fleetImage", v)} />
      <h3 style={{ marginTop: 18 }}>Services</h3>
      {content.services.map((sv, i) => (
        <div key={sv.slug} className="admin-list-item">
          <b>{sv.name}</b>
          <ImgField label="Card image" value={sv.cardImage} onChange={(v) => set(`services.${i}.cardImage`, v)} />
          <ImgField label="Hero image" value={sv.hero} onChange={(v) => set(`services.${i}.hero`, v)} />
          <GalleryEd value={sv.gallery} onChange={(v) => set(`services.${i}.gallery`, v)} />
        </div>
      ))}
      <h3 style={{ marginTop: 18 }}>Locations</h3>
      {content.locations.map((lc, i) => (
        <div key={lc.slug} className="admin-list-item">
          <b>{lc.name}</b>
          <ImgField label="Location image" value={lc.image} onChange={(v) => set(`locations.${i}.image`, v)} />
        </div>
      ))}
      <h3 style={{ marginTop: 18 }}>Blog</h3>
      {content.posts.map((p, i) => (
        <div key={p.slug} className="admin-list-item">
          <b>{p.title}</b>
          <ImgField label="Post image" value={p.image} onChange={(v) => set(`posts.${i}.image`, v)} />
        </div>
      ))}
      <button className="btn btn-primary admin-save" onClick={() => save("Saved — images updated site-wide.")}>Save All Images</button>
    </div>
  );
}
