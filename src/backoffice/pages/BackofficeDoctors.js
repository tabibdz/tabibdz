import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase';
import { T } from '../theme';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import DetailModal from '../components/DetailModal';

const SPECIALTIES = ['Tous', 'Cardiologue', 'Dermatologue', 'Pédiatre', 'Généraliste', 'Ophtalmologue', 'Dentiste', 'Gynécologue', 'Neurologue', 'Orthopédiste', 'Psychiatre', 'Urologue', 'ORL', 'Rhumatologue', 'Endocrinologue', 'Gastro-entérologue'];
const WILAYAS = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Tlemcen', 'Béjaïa', 'Batna', 'Djelfa', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Skikda', 'Médéa'];

const COLS = [
  { key: 'avatar',    label: ''           },
  { key: 'name',      label: 'Nom'        },
  { key: 'specialty', label: 'Spécialité' },
  { key: 'wilaya',    label: 'Wilaya'     },
  { key: 'email',     label: 'Email'      },
  { key: 'phone',     label: 'Téléphone'  },
  { key: 'status',    label: 'Statut'     },
  { key: 'actions',   label: 'Actions'    },
];

const selectStyle = { padding: '9px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' };
const btn = (bg, color) => ({ padding: '5px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: bg, color });

export default function BackofficeDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('Tous');
  const [filterWilaya, setFilterWilaya] = useState('Toutes');
  const [filterVerified, setFilterVerified] = useState('tous');
  const [filterActive, setFilterActive] = useState('tous');
  const [detailDoc, setDetailDoc] = useState(null);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const { data } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
    setDoctors(data || []);
    setLoading(false);
  };

  const toggleVerified = async (doc) => {
    await supabase.from('doctors').update({ is_verified: !doc.is_verified }).eq('id', doc.id);
    setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, is_verified: !d.is_verified } : d));
  };

  const toggleActive = async (doc) => {
    await supabase.from('doctors').update({ is_active: !doc.is_active }).eq('id', doc.id);
    setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, is_active: !d.is_active } : d));
  };

  const filtered = useMemo(() => doctors.filter(d => {
    const q = search.toLowerCase();
    if (q && !d.full_name?.toLowerCase().includes(q) && !d.email?.toLowerCase().includes(q) && !d.phone?.includes(q)) return false;
    if (filterSpecialty !== 'Tous' && d.specialty !== filterSpecialty) return false;
    if (filterWilaya !== 'Toutes' && d.wilaya !== filterWilaya) return false;
    if (filterVerified === 'oui' && !d.is_verified) return false;
    if (filterVerified === 'non' && d.is_verified) return false;
    if (filterActive === 'oui' && !d.is_active) return false;
    if (filterActive === 'non' && d.is_active) return false;
    return true;
  }), [doctors, search, filterSpecialty, filterWilaya, filterVerified, filterActive]);

  const tableData = filtered.map(doc => ({
    avatar: (
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 800, fontSize: 12 }}>
        {(doc.full_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
    ),
    name:      <span style={{ fontWeight: 600, color: T.textPrimary, whiteSpace: 'nowrap' }}>{doc.full_name}</span>,
    specialty: <span style={{ color: T.textSecondary }}>{doc.specialty}</span>,
    wilaya:    <span style={{ color: T.textSecondary }}>{doc.wilaya}</span>,
    email:     <span style={{ color: T.textMuted, fontSize: 12 }}>{doc.email}</span>,
    phone:     <span style={{ color: T.textMuted, fontSize: 12 }}>{doc.phone || '—'}</span>,
    status: (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        <StatusBadge status={doc.is_verified ? 'verified' : 'unverified'} />
        <StatusBadge status={doc.is_active ? 'active' : 'inactive'} />
      </div>
    ),
    actions: (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={() => toggleVerified(doc)}
          style={doc.is_verified ? btn(`${T.warning}28`, T.warning) : btn(`${T.success}28`, T.success)}>
          {doc.is_verified ? 'Révoquer' : 'Vérifier'}
        </button>
        <button onClick={() => toggleActive(doc)}
          style={doc.is_active ? btn(`${T.danger}28`, T.danger) : btn(`${T.success}28`, T.success)}>
          {doc.is_active ? 'Désactiver' : 'Activer'}
        </button>
        <button onClick={() => setDetailDoc(doc)} style={btn(`${T.accent}28`, T.accent)}>
          Voir
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Médecins</h1>
      <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24 }}>{doctors.length} médecin(s) enregistré(s)</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input
          placeholder="Rechercher par nom, email ou téléphone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textPrimary, fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 290 }}
        />
        <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)} style={selectStyle}>
          {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterWilaya} onChange={e => setFilterWilaya(e.target.value)} style={selectStyle}>
          {WILAYAS.map(w => <option key={w}>{w}</option>)}
        </select>
        <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)} style={selectStyle}>
          <option value="tous">Vérifié: tous</option>
          <option value="oui">Vérifié: oui</option>
          <option value="non">Vérifié: non</option>
        </select>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value)} style={selectStyle}>
          <option value="tous">Actif: tous</option>
          <option value="oui">Actif: oui</option>
          <option value="non">Actif: non</option>
        </select>
        <span style={{ color: T.textMuted, fontSize: 13, marginLeft: 4 }}>
          {filtered.length} résultat(s)
        </span>
      </div>

      <DataTable columns={COLS} data={tableData} loading={loading} />

      {detailDoc && (
        <DetailModal
          title={`Dr. ${detailDoc.full_name}`}
          data={{
            'Nom':         detailDoc.full_name,
            'Email':       detailDoc.email,
            'Téléphone':   detailDoc.phone,
            'Spécialité':  detailDoc.specialty,
            'Wilaya':      detailDoc.wilaya,
            'Adresse':     detailDoc.address,
            'Prix (DA)':   detailDoc.price,
            'Note':        detailDoc.rating,
            'Vérifié':     detailDoc.is_verified,
            'Actif':       detailDoc.is_active,
            'Bio':         detailDoc.bio,
            'Inscrit le':  detailDoc.created_at,
          }}
          onClose={() => setDetailDoc(null)}
        />
      )}
    </div>
  );
}
