import { useState } from "react";
import { G, CATEGORIES } from "../constants";
import { fmt, authHeaders } from "../utils";
import LocationPicker from "./LocationPicker";

export default function SellModal({ darkMode, onClose, onPost, showToast }) {
  const [step, setStep] = useState(1);
  const [sellMode, setSellMode] = useState("fixed");
  const [auctionForm, setAuctionForm] = useState({ duration_hours: 24, reserve_price: "" });
  const [form, setForm] = useState({
    title: "",
    category: "electronics",
    price: "",
    condition: "Brand new",
    location: "",
    description: "",
    latitude: null,
    longitude: null,
    photos: [],
  });
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : G.border;
  const inputStyle = {
    width: "100%",
    background: darkMode ? G.surface2 : G.cream,
    border: `1px solid ${borderColor}`,
    borderRadius: 9,
    padding: "11px 14px",
    fontSize: 14,
    color: textPrimary,
    fontFamily: "DM Sans,sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 12,
    color: textSecondary,
    fontFamily: "DM Sans,sans-serif",
    display: "block",
    marginBottom: 5,
    fontWeight: 500,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: 18,
          width: "100%",
          maxWidth: 500,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: G.black,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "DM Sans,sans-serif",
            }}
          >
            Post a listing
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            display: "flex",
            padding: "0 24px",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          {["Details", "Pricing", "Post"].map((s, i) => (
            <div
              key={s}
              onClick={() => i + 1 < step && setStep(i + 1)}
              style={{
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                borderBottom:
                  step === i + 1
                    ? `2px solid ${G.gold}`
                    : "2px solid transparent",
                fontSize: 13,
                fontWeight: step === i + 1 ? 600 : 400,
                color: step === i + 1 ? G.gold : textSecondary,
                fontFamily: "DM Sans,sans-serif",
                cursor: i + 1 < step ? "pointer" : "default",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Sell mode toggle */}
        <div style={{ display: "flex", gap: 8, padding: "16px 24px 0" }}>
          {[["fixed","Fixed price"],["auction","Auction"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setSellMode(mode)}
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${sellMode===mode?G.gold:borderColor}`, background: sellMode===mode?(darkMode?G.goldBgDark:G.goldBg):"transparent", color: sellMode===mode?G.gold:textSecondary, fontSize: 13, fontWeight: sellMode===mode?700:400, cursor: "pointer", fontFamily: "DM Sans,sans-serif", transition: "all 0.15s" }}>
              {mode === "auction" ? "⏱ " : "◈ "}{label}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>
                  Photos{" "}
                  <span style={{ fontWeight: 400, color: G.ink3 }}>
                    (up to 10)
                  </span>
                </label>
                <div
                  onClick={() => document.getElementById("photo-input").click()}
                  style={{
                    border: `2px dashed ${darkMode ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.5)"}`,
                    borderRadius: 12,
                    padding: "16px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {form.photos && form.photos.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(80px, 1fr))",
                        gap: 8,
                      }}
                    >
                      {form.photos.map((url, i) => (
                        <div
                          key={i}
                          style={{
                            position: "relative",
                            aspectRatio: "1",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={url}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setForm((f) => ({
                                ...f,
                                photos: f.photos.filter((_, j) => j !== i),
                              }));
                            }}
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 3,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.6)",
                              border: "none",
                              color: "#fff",
                              fontSize: 11,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {form.photos.length < 10 && (
                        <div
                          style={{
                            aspectRatio: "1",
                            borderRadius: 8,
                            border: `1px dashed ${G.gold}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: G.gold,
                            fontSize: 20,
                            opacity: 0.5,
                          }}
                        >
                          +
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: "20px 0" }}>
                      <div
                        style={{ fontSize: 24, opacity: 0.3, marginBottom: 6 }}
                      >
                        ◈
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: textSecondary,
                          fontFamily: "DM Sans,sans-serif",
                        }}
                      >
                        Tap to add photos
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: G.ink3,
                          marginTop: 2,
                          fontFamily: "DM Sans,sans-serif",
                        }}
                      >
                        JPG, PNG or WebP · max 10MB each
                      </div>
                    </div>
                  )}
                </div>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;

                    const remaining = 10 - (form.photos?.length || 0);
                    if (remaining <= 0) { showToast("Maximum 10 photos reached"); e.target.value = ''; return; }
                    const toUpload = files.slice(0, remaining);

                    const uploaded = [];
                    for (const file of toUpload) {
                      const fd = new FormData();
                      fd.append('images', file);
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/images`, {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${localStorage.getItem('alsel_token')}` },
                          body: fd,
                        });
                        const data = await res.json();
                        if (data.urls) uploaded.push(...data.urls);
                      } catch (err) {
                        console.error('Upload error:', err);
                      }
                    }

                    if (uploaded.length > 0) {
                      setForm(f => ({ ...f, photos: [...(f.photos || []), ...uploaded].slice(0, 10) }));
                    }
                    e.target.value = '';
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Listing title</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. iPhone 14 Pro..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <div style={{ position: "relative" }}>
                  <textarea
                    style={{
                      ...inputStyle,
                      height: 90,
                      resize: "none",
                      paddingRight: 100,
                    }}
                    placeholder="Describe your item or click Generate..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <button
                    onClick={async () => {
                      if (!form.title) {
                        showToast("Enter a title first");
                        return;
                      }
                      setForm((f) => ({ ...f, description: "Generating..." }));
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/ai/describe`, {
                          method: "POST",
                          headers: authHeaders(),
                          body: JSON.stringify({
                            title: form.title,
                            category: form.category,
                            condition: form.condition,
                            price: form.price,
                          }),
                        });
                        const data = await res.json();
                        setForm((f) => ({
                          ...f,
                          description: data.description || "",
                        }));
                      } catch {
                        setForm((f) => ({ ...f, description: "" }));
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: G.gold,
                      color: G.black,
                      border: "none",
                      borderRadius: 7,
                      padding: "5px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  >
                    ✦ Generate
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Price (UGX)</label>
                <input
                  style={inputStyle}
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <button
                  onClick={async () => {
                    if (!form.title) {
                      showToast("Enter a title first");
                      return;
                    }
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/ai/price`, {
                        method: "POST",
                        headers: authHeaders(),
                        body: JSON.stringify({
                          title: form.title,
                          category: form.category,
                          condition: form.condition,
                        }),
                      });
                      const data = await res.json();
                      if (data.suggested) {
                        setForm((f) => ({
                          ...f,
                          price: String(data.suggested),
                        }));
                        showToast(`UGX ${data.min?.toLocaleString()} – ${data.max?.toLocaleString()} suggested`);
                      }
                    } catch {
                      showToast("Could not suggest price");
                    }
                  }}
                  style={{
                    marginTop: 6,
                    background: "transparent",
                    border: `1px solid rgba(201,168,76,0.4)`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 12,
                    color: G.gold,
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  ✦ Suggest price with AI
                </button>
              </div>
              {sellMode === "auction" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 14px", background: darkMode?G.surface2:G.cream, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>⏱ Auction settings</div>
                  <div>
                    <label style={labelStyle}>Duration</label>
                    <select style={{...inputStyle, cursor: "pointer"}} value={auctionForm.duration_hours} onChange={e => setAuctionForm(f => ({...f, duration_hours: Number(e.target.value)}))}>
                      <option value={1}>1 hour</option>
                      <option value={6}>6 hours</option>
                      <option value={12}>12 hours</option>
                      <option value={24}>24 hours</option>
                      <option value={48}>2 days</option>
                      <option value={72}>3 days</option>
                      <option value={168}>7 days</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Reserve price (optional)</label>
                    <input style={inputStyle} type="number" placeholder="Minimum price to sell"
                      value={auctionForm.reserve_price} onChange={e => setAuctionForm(f => ({...f, reserve_price: e.target.value}))} />
                    <div style={{ fontSize: 11, color: G.ink3, marginTop: 4, fontFamily: "DM Sans,sans-serif" }}>If no bid meets this price, item won't sell</div>
                  </div>
                </div>
              )}
              <div>
                <label style={labelStyle}>Location name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Kampala, Entebbe..."
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Pin on map{" "}
                  <span style={{ fontWeight: 400, color: G.ink3 }}>
                    (tap to place)
                  </span>
                </label>
                <LocationPicker
                  value={
                    form.latitude
                      ? { lat: form.latitude, lng: form.longitude }
                      : null
                  }
                  onChange={({ lat, lng }) =>
                    setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
                  }
                />
                {form.latitude && (
                  <div
                    style={{
                      fontSize: 11,
                      color: G.ink3,
                      marginTop: 4,
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  >
                    📍 {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
                  </div>
                )}
              </div>
              <div
                style={{
                  background: darkMode ? G.surface2 : G.cream,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: textSecondary,
                    marginBottom: 2,
                    fontFamily: "DM Sans,sans-serif",
                  }}
                >
                  Preview price
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: darkMode ? G.gold : G.ink,
                    fontFamily: "DM Sans,sans-serif",
                  }}
                >
                  {form.price ? fmt(Number(form.price)) : "UGX —"}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: G.goldBg,
                  border: `2px solid ${G.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                }}
              >
                {sellMode === "auction" ? "⏱" : "◈"}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: textPrimary,
                  fontFamily: "DM Sans,sans-serif",
                  marginBottom: 6,
                }}
              >
                Ready to post
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: textSecondary,
                  fontFamily: "DM Sans,sans-serif",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Your listing{" "}
                <strong style={{ color: textPrimary }}>
                  {form.title || "Untitled"}
                </strong>{" "}
                will go live immediately.
              </div>
              <div
                style={{
                  background: darkMode ? G.surface2 : G.cream,
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 20,
                  textAlign: "left",
                }}
              >
                {[
                  [
                    "Category",
                    CATEGORIES.find((c) => c.id === form.category)?.label,
                  ],
                  [sellMode === "auction" ? "Starting bid" : "Price", form.price ? fmt(Number(form.price)) : "—"],
                  ["Condition", form.condition],
                  ["Location", form.location || "—"],
                  ...(sellMode === "auction" ? [["Duration", `${auctionForm.duration_hours}h`]] : []),
                  ...(sellMode === "auction" && auctionForm.reserve_price ? [["Reserve", fmt(Number(auctionForm.reserve_price))]] : []),
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      fontSize: 13,
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  >
                    <span style={{ color: textSecondary }}>{k}</span>
                    <span style={{ color: textPrimary, fontWeight: 500 }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: textSecondary,
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                }}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  flex: 2,
                  background: G.gold,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: G.black,
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={() => { onPost(form, sellMode, auctionForm); onClose(); }}
                style={{
                  flex: 2,
                  background: G.gold,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: G.black,
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                }}
              >
                {sellMode === "auction" ? "Start auction ⏱" : "Post listing ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
