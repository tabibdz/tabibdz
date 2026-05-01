import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase';
import { T } from '../theme';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import DetailModal from '../components/DetailModal';

const COLS = [
  { key: 'patient',  label: 'Patient'    },
  { key: 'doctor',   label: 'Médecin'    },
  { key: 'date',     label: 'Date'       },
  { key: 'time',     label: 'Heure'      },
  { key: 'status',   label: 'Statut'     },
  { key: 'price',    label: 'Prix'       },
  { key: 'created',  label: 'Créé le'    },
  { key: 'actions',  label: 'Actions'    },
];

const selectStyle = { padding: '9px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' };
const btn = (bg, color) => ({ padding: '5px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: bg, color });

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

export default function BackofficeAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [detailAppt, setDetailAppt] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*, users(full_name, phone, email), doctors(full_name, specialty, wilaya)')
      .order('appointment_date', { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  };

  const cancelAppointment = async (appt) => {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id);
    setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'cancelled' } : a));
  };

  const filtered = useMemo(() => appointments.filter(a => {
    const q = search.toLowerCase();
    if (q) {
      const patientName = a.users?.full_name?.toLowerCase() || '';
      const doctorName = a.doctors?.full_name?.toLowerCase() || '';
      if (!patientName.includes(q) && !doctorName.includes(q)) return false;
    }
    if (filterStatus !== 'tous' && a.status !== filterStatus) return false;
    return true;
  }), [appointments, search, filterStatus]);

  const tableData = filtered.map(a => ({
    patient: (
      <div>
        <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 13 }}>{a.users?.full_name || '—'}</div>
        <div style={{ color: T.textMuted, fontSize: 11 }}>{a.users?.phone || ''}</div>
      </div>
    ),
    doctor: (
      <div>
        <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 13 }}>{a.doctors?.full_name || '—'}</div>
        <div style={{ color: T.textMuted, fontSize: 11 }}>{a.doctors?.specialty || ''}</div>
      </div>
    ),
    date:    <span style={{ color: T.textSecondary, whiteSpace: 'nowrap' }}>{a.appointment_date || '—'}</span>,
    time:    <span style={{ color: T.textSecondary }}>{a.appointment_time?.slice(0, 5) || '—'}</span>,
    status:  <StatusBadge status={a.status} />,
    price:   <span style={{ color: T.accent, fontWeight: 700 }}>{a.price ? `${a.price} DA` : '—'}</span>,
    created: <span style={{ color: T.textMuted, fontSize: 12 }}>{fmtDate(a.created_at)}</span>,
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setDetailAppt(a)} style={btn(`${T.accent}28`, T.accent)}>Voir</button>
        {(a.status === 'confirmed' || a.status === 'pending') && (
          <button onClick={() => cancelAppointment(a)} style={btn(`${T.danger}28`, T.danger)}>Annuler</button>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Rendez-vous</h1>
      <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24 }}>{appointments.length} rendez-vous au total</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input
          placeholder="Rechercher par patient ou médecin"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 290 }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="tous">Statut: tous</option>
          <option value="confirmed">Confirmé</option>
          <option value="cancelled">Annulé</option>
          <option value="pending">En attente</option>
        </select>
        <span style={{ color: T.textMuted, fontSize: 13, marginLeft: 4 }}>{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={COLS} data={tableData} loading={loading} />

      {detailAppt && (
        <DetailModal
          title="Détails du rendez-vous"
          data={{
            'Patient':      detailAppt.users?.full_name,
            'Email':        detailAppt.users?.email,
            'Téléphone':    detailAppt.users?.phone,
            'Médecin':      detailAppt.doctors?.full_name,
            'Spécialité':   detailAppt.doctors?.specialty,
            'Wilaya':       detailAppt.doctors?.wilaya,
            'Date':         detailAppt.appointment_date,
            'Heure':        detailAppt.appointment_time?.slice(0, 5),
            'Statut':       detailAppt.status,
            'Prix (DA)':    detailAppt.price,
            'Paiement':     detailAppt.payment_status,
            'Type':         detailAppt.type,
            'Créé le':      detailAppt.created_at,
          }}
          onClose={() => setDetailAppt(null)}
        />
      )}
    </div>
  );
}
