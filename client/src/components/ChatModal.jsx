import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { G, SOCKET_URL } from '../constants';
import { fmt, authHeaders, timeAgo } from '../utils';
import { API } from '../constants';

export default function ChatModal({ offer, darkMode, onClose, user }) {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  useEffect(() => {
    fetch(`${API}/messages/${offer.id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setMessages(data));
    const s = io(SOCKET_URL, { reconnection: true, reconnectionAttempts: 5 });
    s.emit("join_room", offer.id);
    s.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));
    socketRef.current = s;
    return () => s.disconnect();
  }, [offer.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = () => {
    if (!body.trim() || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      offer_id: offer.id,
      sender_id: user.id,
      sender_name: user.username,
      body: body.trim(),
    });
    setBody("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 520, overflow: "hidden", display: "flex", flexDirection: "column", height: 560, maxHeight: "85vh" }}>
        <div style={{ background: G.black, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>{offer.listing_title}</div>
            <div style={{ fontSize: 12, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>Offer: {fmt(offer.amount)} · {offer.status}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: textSecondary, fontSize: 13, fontFamily: "DM Sans,sans-serif", marginTop: 40 }}>No messages yet. Start the conversation.</div>
          )}
          {messages.map((m) => {
            const isMe = m.sender_id === user.id;
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "72%", background: isMe ? G.gold : (darkMode ? G.surface2 : G.cream), borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px" }}>
                  {!isMe && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: G.gold, marginBottom: 3, fontFamily: "DM Sans,sans-serif" }}>{m.sender_name}</div>
                  )}
                  <div style={{ fontSize: 14, color: isMe ? G.black : textPrimary, fontFamily: "DM Sans,sans-serif", lineHeight: 1.5 }}>{m.body}</div>
                  <div style={{ fontSize: 10, color: isMe ? "rgba(0,0,0,0.4)" : textSecondary, marginTop: 4, fontFamily: "DM Sans,sans-serif" }}>{timeAgo(m.sent_at)}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${borderColor}`, display: "flex", gap: 8 }}>
          <input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, background: darkMode ? G.surface2 : G.cream, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none" }} />
          <button onClick={sendMessage}
            style={{ background: G.gold, color: G.black, border: "none", borderRadius: 10, padding: "0 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Send</button>
        </div>
      </div>
    </div>
  );
}
