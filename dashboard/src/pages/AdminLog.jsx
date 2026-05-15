import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/log')
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load log'))
      .finally(() => setLoading(false));
  }, []);

  const actionColor = (action) => {
    if (action.includes('ban')) return 'var(--red)';
    if (action.includes('verify')) return 'var(--green)';
    if (action.includes('remove')) return 'var(--red)';
    if (action.includes('feature')) return 'var(--gold)';
    return 'var(--blue)';
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Audit log</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>All admin actions · immutable record</div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No admin actions recorded yet</div>
        ) : logs.map((log, i) => (
          <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: i < logs.length-1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: actionColor(log.action), flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: actionColor(log.action), fontWeight: 600 }}>{log.action}</span>
              {log.details && Object.keys(log.details).length > 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>
                  {JSON.stringify(log.details).slice(0, 80)}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {format(new Date(log.created_at), 'MMM d, HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}