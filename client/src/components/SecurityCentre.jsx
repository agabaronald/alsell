import { useState, useEffect } from 'react';
import { G } from '../constants';
import { authHeaders } from '../utils';
import { API } from '../constants';

export default function SecurityCentre({ darkMode, onClose, user, showToast }) {
  const [trustData, setTrustData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [twoFAStatus, setTwoFAStatus] = useState(null);
  const [twoFASetup, setTwoFASetup] = useState(null);
  const [totpInput, setTotpInput] = useState('');
  const [activeTab, setActiveTab] = useState('trust');
  const [loading, setLoading] = useState(true);
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [disableTotpInput, setDisableTotpInput] = useState('');
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  useEffect(() => {
    const load = async () => {
      try {
        const [trust, twofa, devs, history] = await Promise.all([
          fetch(`${API}/trust/me`, { headers: authHeaders() }).then(r => r.json()),
          fetch(`${API}/twofa/status`, { headers: authHeaders() }).then(r => r.json()),
          fetch(`${API}/trust/devices`, { headers: authHeaders() }).then(r => r.json()),
          fetch(`${API}/trust/login-history`, { headers: authHeaders() }).then(r => r.json()),
        ]);
        if (!trust.error) setTrustData(trust);
        if (!twofa.error) setTwoFAStatus(twofa);
        if (Array.isArray(devs)) setDevices(devs);
        if (Array.isArray(history)) setLoginHistory(history);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSetup2FA = async () => {
    try {
      const res = await fetch(`${API}/twofa/setup`, { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      if (!data.error) setTwoFASetup(data);
      else showToast(data.error);
    } catch { showToast('Failed to setup 2FA'); }
  };

  const handleEnable2FA = async () => {
    try {
      const res = await fetch(`${API}/twofa/enable`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ token: totpInput }) });
      const data = await res.json();
      if (res.ok) { setTwoFAStatus({ enabled: true }); setTwoFASetup(null); showToast('2FA enabled!'); }
      else showToast(data.error || 'Invalid code');
    } catch { showToast('Failed to enable 2FA'); }
  };

  const handleDisable2FA = async () => {
    if (!showDisablePrompt) { setShowDisablePrompt(true); return; }
    if (!disableTotpInput) { showToast('Enter your 6-digit code'); return; }
    try {
      const res = await fetch(`${API}/twofa/disable`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ token: disableTotpInput }) });
      const data = await res.json();
      if (res.ok) { setTwoFAStatus({ enabled: false }); setShowDisablePrompt(false); setDisableTotpInput(''); showToast('2FA disabled'); }
      else showToast(data.error || 'Failed to disable');
    } catch { showToast('Failed to disable 2FA'); }
  };

  const handleRemoveDevice = async (id) => {
    try {
      const res = await fetch(`${API}/trust/devices/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { setDevices(prev => prev.filter(d => d.id !== id)); showToast('Device removed'); }
      else showToast('Failed to remove device');
    } catch { showToast('Network error'); }
  };

  const getTrustColor = (score) => {
    if (score >= 80) return '#A0C4FF';
    if (score >= 60) return G.gold;
    if (score >= 40) return '#9E9E9E';
    if (score >= 20) return '#CD7F32';
    return G.ink3;
  };

  const tabs = ['trust', '2fa', 'devices', 'history'];

  return (
    <div style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: bg, borderRadius: 18, width: '100%', maxWidth: 580, overflow: 'hidden' }}>
        <div style={{ background: G.black, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: 'DM Sans,sans-serif' }}>🔐 Security Centre</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans,sans-serif', marginTop: 2 }}>{user?.username}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${borderColor}` }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: '12px 6px', background: 'transparent', border: 'none', borderBottom: activeTab===t?`2px solid ${G.gold}`:'2px solid transparent', fontSize: 12, fontWeight: activeTab===t?600:400, color: activeTab===t?G.gold:textSecondary, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', textTransform: 'capitalize' }}>
              {t === '2fa' ? '2FA' : t === 'history' ? 'Login history' : t}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading && <div style={{ textAlign: 'center', padding: 40, color: textSecondary, fontFamily: 'DM Sans,sans-serif', fontSize: 13 }}>Loading...</div>}

          {!loading && activeTab === 'trust' && trustData && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', border: `4px solid ${getTrustColor(trustData.score)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', background: darkMode?G.surface2:G.cream }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: getTrustColor(trustData.score), fontFamily: 'DM Sans,sans-serif', lineHeight: 1 }}>{trustData.score}</div>
                  <div style={{ fontSize: 10, color: textSecondary, fontFamily: 'DM Sans,sans-serif' }}>/ 100</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: getTrustColor(trustData.score), fontFamily: 'DM Sans,sans-serif' }}>{trustData.level?.level} Seller</div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 4, fontFamily: 'DM Sans,sans-serif' }}>Your trust score is visible to buyers</div>
              </div>

              {trustData.breakdown && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Rating score', value: trustData.breakdown.rating_score, max: 30, desc: 'Based on your seller ratings' },
                    { label: 'Verification score', value: trustData.breakdown.verification_score, max: 25, desc: 'Phone +10pts, ID +15pts' },
                    { label: 'Activity score', value: trustData.breakdown.activity_score, max: 20, desc: 'Based on completed sales' },
                    { label: 'Account age', value: trustData.breakdown.age_score, max: 15, desc: 'Months on Alsel (max 15)' },
                    { label: 'Response rate', value: trustData.breakdown.response_score, max: 10, desc: 'How quickly you respond to offers' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: textPrimary, fontFamily: 'DM Sans,sans-serif' }}>{item.label}</span>
                        <span style={{ fontSize: 12, fontFamily: 'DM Sans,sans-serif', color: G.gold }}>{item.value}/{item.max}</span>
                      </div>
                      <div style={{ height: 6, background: darkMode?G.surface2:G.cream, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.value/item.max)*100}%`, background: G.gold, borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ fontSize: 11, color: textSecondary, marginTop: 2, fontFamily: 'DM Sans,sans-serif' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 20, padding: '14px 16px', background: darkMode?G.surface2:G.cream, borderRadius: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: 'DM Sans,sans-serif', marginBottom: 10 }}>Verification status</div>
                {[
                  { label: 'Email', verified: true, pts: 0 },
                  { label: 'Government ID', verified: trustData.user?.is_verified, pts: 15 },
                  { label: 'Two-factor auth', verified: trustData.user?.two_fa_enabled, pts: 0 },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: item.verified ? G.green : G.ink3 }}>{item.verified ? '✓' : '○'}</span>
                      <span style={{ fontSize: 13, color: textPrimary, fontFamily: 'DM Sans,sans-serif' }}>{item.label}</span>
                    </div>
                    {item.pts > 0 && !item.verified && <span style={{ fontSize: 11, color: G.gold, fontFamily: 'DM Sans,sans-serif' }}>+{item.pts} pts</span>}
                    {item.verified && <span style={{ fontSize: 11, color: G.green, fontFamily: 'DM Sans,sans-serif' }}>Verified</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === '2fa' && (
            <div>
              <div style={{ padding: '14px 16px', background: darkMode?G.surface2:G.cream, borderRadius: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: 'DM Sans,sans-serif' }}>Two-factor authentication</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2, fontFamily: 'DM Sans,sans-serif' }}>
                      {twoFAStatus?.enabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security to your account'}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: twoFAStatus?.enabled ? 'rgba(61,214,140,0.15)' : 'rgba(255,255,255,0.05)', color: twoFAStatus?.enabled ? G.green : G.ink3 }}>
                    {twoFAStatus?.enabled ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>

              {!twoFAStatus?.enabled && !twoFASetup && (
                <button onClick={handleSetup2FA}
                  style={{ width: '100%', background: G.gold, border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, color: G.black, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                  Set up 2FA with Authenticator app
                </button>
              )}

              {twoFASetup && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 13, color: textSecondary, fontFamily: 'DM Sans,sans-serif', lineHeight: 1.6 }}>
                    1. Install Google Authenticator or Authy on your phone<br/>
                    2. Scan the QR code below<br/>
                    3. Enter the 6-digit code to confirm
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <img src={twoFASetup.qr_code} alt="QR Code" style={{ width: 180, height: 180, borderRadius: 12, background: '#fff', padding: 8 }} />
                  </div>
                  <div style={{ padding: '10px 14px', background: darkMode?G.surface2:G.cream, borderRadius: 9, fontSize: 12, fontFamily: 'DM Sans,sans-serif', color: textSecondary, wordBreak: 'break-all' }}>
                    Manual entry: <span style={{ color: G.gold, userSelect: 'all' }}>{twoFASetup.secret}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: textSecondary, fontFamily: 'DM Sans,sans-serif', display: 'block', marginBottom: 6 }}>Enter the 6-digit code from your app</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={totpInput} onChange={e => setTotpInput(e.target.value)} maxLength={6}
                        placeholder="000000"
                        style={{ flex: 1, background: darkMode?G.surface2:G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: '11px 14px', fontSize: 18, color: textPrimary, fontFamily: 'DM Sans,sans-serif', outline: 'none', letterSpacing: 8, textAlign: 'center' }} />
                      <button onClick={handleEnable2FA} disabled={totpInput.length !== 6}
                        style={{ background: G.gold, border: 'none', borderRadius: 9, padding: '0 20px', fontSize: 14, fontWeight: 700, color: G.black, cursor: totpInput.length !== 6 ? 'not-allowed' : 'pointer', opacity: totpInput.length !== 6 ? 0.5 : 1 }}>
                        Verify
                      </button>
                    </div>
                  </div>
                  {twoFASetup.backup_codes && (
                    <div style={{ padding: '14px 16px', background: darkMode?'rgba(201,168,76,0.08)':G.goldBg, border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: G.gold, marginBottom: 8, fontFamily: 'DM Sans,sans-serif' }}>⚠ Save your backup codes</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        {twoFASetup.backup_codes.map(c => (
                          <div key={c} style={{ fontSize: 12, fontFamily: 'DM Sans,sans-serif', color: textPrimary, background: darkMode?G.surface2:G.cream, padding: '4px 8px', borderRadius: 6, letterSpacing: 2 }}>{c}</div>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: textSecondary, marginTop: 8, fontFamily: 'DM Sans,sans-serif' }}>Store these somewhere safe. Each can only be used once if you lose your phone.</div>
                    </div>
                  )}
                </div>
              )}

              {twoFAStatus?.enabled && !showDisablePrompt && (
                <button onClick={handleDisable2FA}
                  style={{ width: '100%', background: 'transparent', border: `1.5px solid rgba(224,80,80,0.4)`, borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, color: G.red, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                  Disable 2FA
                </button>
              )}
              {twoFAStatus?.enabled && showDisablePrompt && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', background: darkMode?G.surface2:G.cream, borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: textSecondary, fontFamily: 'DM Sans,sans-serif' }}>Enter the 6-digit code from your authenticator app to confirm:</div>
                  <input value={disableTotpInput} onChange={e => setDisableTotpInput(e.target.value)} maxLength={6} placeholder="000000"
                    style={{ width: '100%', background: darkMode?G.surface2:G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: '11px 14px', fontSize: 18, color: textPrimary, fontFamily: 'DM Sans,sans-serif', outline: 'none', letterSpacing: 8, textAlign: 'center', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setShowDisablePrompt(false); setDisableTotpInput(''); }}
                      style={{ flex: 1, background: 'transparent', border: `1px solid ${borderColor}`, borderRadius: 9, padding: '11px', fontSize: 13, color: textSecondary, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Cancel</button>
                    <button onClick={handleDisable2FA}
                      style={{ flex: 1, background: G.red, border: 'none', borderRadius: 9, padding: '11px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Disable 2FA</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'devices' && (
            <div>
              <div style={{ fontSize: 13, color: textSecondary, fontFamily: 'DM Sans,sans-serif', marginBottom: 16 }}>
                These devices have logged into your account. Remove any you don't recognise.
              </div>
              {devices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: textSecondary, fontFamily: 'DM Sans,sans-serif', fontSize: 13 }}>No devices recorded</div>
              ) : devices.map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: darkMode?G.surface2:G.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {d.user_agent?.includes('Mobile') ? '📱' : '💻'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: textPrimary, fontFamily: 'DM Sans,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.user_agent?.slice(0, 60) || 'Unknown device'}
                    </div>
                    <div style={{ fontSize: 11, color: textSecondary, fontFamily: 'DM Sans,sans-serif', marginTop: 2 }}>
                      IP: {d.ip_address} · Last seen: {d.last_seen ? new Date(d.last_seen).toLocaleDateString() : 'Unknown'}
                    </div>
                    {d.trusted && <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10, background: 'rgba(61,214,140,0.1)', color: G.green, fontFamily: 'DM Sans,sans-serif' }}>Trusted</span>}
                  </div>
                  <button onClick={() => handleRemoveDevice(d.id)}
                    style={{ background: 'rgba(224,80,80,0.1)', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: G.red, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', flexShrink: 0 }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && activeTab === 'history' && (
            <div>
              <div style={{ fontSize: 13, color: textSecondary, fontFamily: 'DM Sans,sans-serif', marginBottom: 16 }}>
                Recent login activity on your account.
              </div>
              {loginHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: textSecondary, fontFamily: 'DM Sans,sans-serif', fontSize: 13 }}>No login history</div>
              ) : loginHistory.map((h, i) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < loginHistory.length-1 ? `1px solid ${borderColor}` : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.status === 'success' || h.status === 'success_2fa' ? G.green : G.red, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: textPrimary, fontFamily: 'DM Sans,sans-serif' }}>
                      {h.status === 'success' ? 'Successful login' : h.status === 'success_2fa' ? 'Login with 2FA' : 'Failed login attempt'}
                    </div>
                    <div style={{ fontSize: 11, color: textSecondary, fontFamily: 'DM Sans,sans-serif' }}>
                      IP: {h.ip_address || 'Unknown'} · {new Date(h.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: h.status.includes('success') ? 'rgba(61,214,140,0.1)' : 'rgba(224,80,80,0.1)', color: h.status.includes('success') ? G.green : G.red }}>
                    {h.status.includes('success') ? 'OK' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
