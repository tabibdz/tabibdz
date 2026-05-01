import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase';
import { T } from '../theme';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';

const WILAYAS = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Tlemcen', 'Béjaïa', 'Batna', 'Djelfa', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Skikda', 'Médéa'];

const COLS = [
  { key: 'name',    label: 'Nom'               },
  { key: 'email',   label: 'Email'             },
  { key: 'phone',   label: 'Téléphone'         },
  { key: 'wilaya',  label: 'Wilaya'            },
  { key: 'date',    label: 'Inscription'       },
  { key: 'rdv',     label: 'Nb RDV'            },
  { key: 'actions', label: 'Actions'           },
];

const selectStyle = { padding: '9px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' };
const btn = (bg, color) => ({ padding: '5px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: bg, color });

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

export default function BackofficePatients() {
  const [patients, setPatients] = useState([]);
  const [apptCounts, setApptCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('Toutes');
  const [detailPatient, setDetailPatient] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: usersData }, { data: apptData }] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('user_id'),
    ]);
    setPatients(usersData || []);
    const counts = {};
    (apptData || []).forEach(a => { counts[a.user_id] = (counts[a.user_id] || 0) + 1; });
    setApptCounts(counts);
    setLoading(false);
  };

  const toggleActive = async (patient) => {
    await supabase.from('users').update({ is_active: !patient.is_active }).eq('id', patient.id);
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, is_active: !p.is_active } : p));
  };

  const filtered = useMemo(() => patients.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.full_name?.toLowerCase().includes(q) && !p.email?.toLowerCase().includes(q) && !p.phone?.includes(q)) return false;
    if (filterWilaya !== 'Toutes' && p.wilaya !== filterWilaya) return false;
    return true;
  }), [patients, search, filterWilaya]);

  const tableData = filtered.map(p => ({
    name: <span style={{ fontWeight: 600, color: T.textPrimary, whiteSpace: 'nowrap' }}>{p.full_name || '—'}</span>,
    email: <span style={{ color: T.textMuted, fontSize: 12 }}>{p.email}</span>,
    phone: <span style={{ color: T.textMuted, fontSize: 12 }}>{p.phone || '—'}</span>,
    wilaya: <span style={{ color: T.textSecondary }}>{p.wilaya || '—'}</span>,
    date: <span style={{ color: T.textMuted, fontSize: 12 }}>{fmtDate(p.created_at)}</span>,
    rdv: (
      <span style={{ background: `${T.accent}28`, color: T.accent, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
        {apptCounts[p.auth_id] || 0}
      </span>
    ),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setDetailPatient(p)} style={btn(`${T.accent}28`, T.accent)}>Voir</button>
        <button onClick={() => toggleActive(p)}
          style={p.is_active === false ? btn(`${T.success}28`, T.success) : btn(`${T.danger}28`, T.danger)}>
          {p.is_active === false ? 'Activer' : 'Désactiver'}
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Patients</h1>
      <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24 }}>{patients.length} patient(s) enregistré(s)</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input
          placeholder="Rechercher par nom, email ou téléphone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 290 }}
        />
        <select value={filterWilaya} onChange={e => setFilterWilaya(e.target.value)} style={selectStyle}>
          {WILAYAS.map(w => <option key={w}>{w}</option>)}
        </select>
        <span style={{ color: T.textMuted, fontSize: 13, marginLeft: 4 }}>{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={COLS} data={tableData} loading={loading} />

      {detailPatient && (
        <DetailModal
          title={detailPatient.full_name || 'Patient'}
          data={{
            'Nom':          detailPatient.full_name,
            'Email':        detailPatient.email,
            'Téléphone':    detailPatient.phone,
            'Wilaya':       detailPatient.wilaya,
            'Nb RDV':       apptCounts[detailPatient.auth_id] || 0,
            'Inscrit le':   detailPatient.created_at,
            'Admin':        detailPatient.is_admin,
          }}
          onClose={() => setDetailPatient(null)}
        />
      )}
    </div>
  );
}
