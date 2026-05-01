import { T } from '../theme';

const CONFIG = {
  confirmed:  { bg: `${T.success}28`, color: T.success,  label: '✅ Confirmé'     },
  cancelled:  { bg: `${T.danger}28`,  color: T.danger,   label: '❌ Annulé'       },
  pending:    { bg: `${T.warning}28`, color: T.warning,  label: '⏳ En attente'   },
  verified:   { bg: `${T.success}28`, color: T.success,  label: '✅ Vérifié'      },
  unverified: { bg: `${T.warning}28`, color: T.warning,  label: '⚠️ Non vérifié'  },
  active:     { bg: `${T.success}28`, color: T.success,  label: '🟢 Actif'        },
  inactive:   { bg: `${T.danger}28`,  color: T.danger,   label: '🔴 Inactif'      },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || { bg: T.border, color: T.textMuted, label: status };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}
