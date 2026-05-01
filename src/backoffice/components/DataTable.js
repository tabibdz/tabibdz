import { T } from '../theme';

export default function DataTable({ columns, data, loading }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#1a2840' }}>
              {columns.map(col => (
                <th key={col.key} style={{
                  padding: '12px 16px', textAlign: 'left',
                  color: T.textMuted, fontWeight: 700, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap', borderBottom: `1px solid ${T.border}`,
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 52, textAlign: 'center', color: T.textMuted, fontSize: 14 }}>
                  ⏳ Chargement...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 52, textAlign: 'center', color: T.textMuted, fontSize: 14 }}>
                  Aucun résultat
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#263548'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '11px 16px', color: T.textSecondary, verticalAlign: 'middle' }}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
