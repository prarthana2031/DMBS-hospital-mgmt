// frontend/src/pages/Patients.js
import React, { useEffect, useState, useCallback } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient, getDashboardStats } from '../api';

const EMPTY = {
  patient_id: '', first_name: '', last_name: '', gender: 'M',
  date_of_birth: '', contact_number: '', address: '',
  registration_date: new Date().toISOString().slice(0, 10),
  insurance_provider: '', insurance_number: '', email: '',
};

function statusBadge(count) {
  return <span className="badge badge-blue">{count} appts</span>;
}

function Modal({ title, data, onChange, onSave, onClose, isEdit }) {
  const f = (key, label, type = 'text', opts = null) => (
    <div className={`form-group${opts?.full ? ' full' : ''}`}>
      <label>{label}</label>
      {opts?.select ? (
        <select name={key} value={data[key]} onChange={onChange}>
          {opts.select.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={key} value={data[key]} onChange={onChange}
          readOnly={key === 'patient_id' && isEdit} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="form-grid">
          {f('patient_id',         'Patient ID')}
          {f('gender',             'Gender', 'text', { select: ['M','F','O'] })}
          {f('first_name',         'First Name')}
          {f('last_name',          'Last Name')}
          {f('date_of_birth',      'Date of Birth', 'date')}
          {f('contact_number',     'Contact Number')}
          {f('email',              'Email', 'email', { full: true })}
          {f('address',            'Address', 'text', { full: true })}
          {f('insurance_provider', 'Insurance Provider')}
          {f('insurance_number',   'Insurance Number')}
          {f('registration_date',  'Registration Date', 'date')}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            {isEdit ? 'Update Patient' : 'Add Patient'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null); // null | 'add' | 'edit'
  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      getPatients(search ? { search } : {}),
      getDashboardStats(),
    ])
      .then(([rowsRes, stats]) => {
        setRows(rowsRes);
        setTotal(stats.patients?.total ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (row) => {
    setForm({
      ...row,
      date_of_birth:     row.date_of_birth?.slice(0, 10) || '',
      registration_date: row.registration_date?.slice(0, 10) || '',
    });
    setError(''); setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'add')  await createPatient(form);
      else                  await updatePatient(form.patient_id, form);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete patient ${id}?`)) return;
    try { await deletePatient(id); load(); } catch (e) { alert(e.message); }
  };

  const genderLabel = g => g === 'M' ? '♂ Male' : g === 'F' ? '♀ Female' : 'Other';

  return (
    <>
      <div className="page-header">
        <h1>Patients</h1>
        <p>Manage patient records and profiles</p>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3>All Patients {total !== null ? `(${total})` : `(${rows.length})`}</h3>
          <input className="search-input" placeholder="Search name / email / ID…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Patient</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Gender</th><th>DOB</th>
                <th>Contact</th><th>Insurance</th><th>Appointments</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.patient_id}>
                  <td className="mono">{r.patient_id}</td>
                  <td>
                    <strong>{r.first_name} {r.last_name}</strong>
                    <div className="text-muted" style={{ fontSize: 11 }}>{r.email}</div>
                  </td>
                  <td>{genderLabel(r.gender)}</td>
                  <td>{r.date_of_birth?.slice(0, 10)}</td>
                  <td>{r.contact_number}</td>
                  <td>
                    <div style={{ fontSize: 12 }}>{r.insurance_provider}</div>
                    <div className="text-muted mono">{r.insurance_number}</div>
                  </td>
                  <td>{statusBadge(r.total_appointments || 0)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                        onClick={() => handleDelete(r.patient_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add New Patient' : 'Edit Patient'}
          data={form} onChange={onChange}
          onSave={handleSave} onClose={() => setModal(null)}
          isEdit={modal === 'edit'}
        />
      )}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
