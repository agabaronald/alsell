export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
        Page {page} of {pages}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: 'var(--text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
          ← Prev
        </button>
        <button disabled={page === pages} onClick={() => onPageChange(page + 1)}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: 'var(--text-primary)', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.5 : 1 }}>
          Next →
        </button>
      </div>
    </div>
  );
}
