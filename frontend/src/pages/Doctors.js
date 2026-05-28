// frontend/src/pages/Doctors.js
import React, { useEffect, useState, useCallback } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../api';

const SPECIALIZATIONS = ['Dermatology', 'Pediatrics', 'Oncology', 'Cardiology', 'Neurology', 'General'];
const BRANCHES = ['Westside Clinic', 'Eastside Clinic', 'Central Hospital'];

const EMPTY = {
  doctor_id: '', first_name: '', last_name: '', specialization: 'Dermatology',
  phone_number: '', years_experience: '', hospital_branch: 'Central Hospital', email: '',
};

const SPEC_COLOR = {
  Dermatology: 'badge-blue',
  Pediatrics:  'badge-green',
  Oncology:    'badge-red',
  Cardiology:  'badge-amber',
  Neurology:   'badge-purple',
  General:     'badge-gray',
};

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
          readOnly={key === 'doctor_id' && isEdit} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="form-grid">
          {f('doctor_id',       'Doctor ID')}
          {f('specialization',  'Specialization', 'text', { select: SPECIALIZATIONS })}
          {f('first_name',      'First Name')}
          {f('last_name',       'Last Name')}
          {f('email',           'Email', 'email', { full: true })}
          {f('phone_number',    'Phone Number')}
          {f('years_experience','Years of Experience', 'number')}
          {f('hospital_branch', 'Hospital Branch', 'text', { select: BRANCHES })}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            {isEdit ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [specFilter, setSpec]   = useState('');
  const [branchFilter, setBranch] = useState('');
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [error, setError]       = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (specFilter)   params.specialization = specFilter;
    if (branchFilter) params.branch = branchFilter;
    getDoctors(params).then(setRows).catch(console.error).finally(() => setLoading(false));
  }, [specFilter, branchFilter]);

  useEffect(() => { load(); }, [load]);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (row) => { setForm({ ...row }); setError(''); setModal('edit'); };

  const handleSave = async () => {
    try {
      if (modal === 'add') await createDoctor(form);
      else                 await updateDoctor(form.doctor_id, form);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete doctor ${id}?`)) return;
    try { await deleteDoctor(id); load(); } catch (e) { alert(e.message); }
  };

  return (
    <>
      <div className="page-header">
        <h1>Doctors</h1>
        <p>Manage doctor profiles and specializations</p>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3>All Doctors ({rows.length})</h3>
          <select className="filter-select" value={specFilter} onChange={e => setSpec(e.target.value)}>
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={branchFilter} onChange={e => setBranch(e.target.value)}>
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Doctor</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Specialization</th><th>Branch</th>
                <th>Experience</th><th>Contact</th><th>Appointments</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.doctor_id}>
                  <td className="mono">{r.doctor_id}</td>
                  <td>
                    <strong>Dr. {r.first_name} {r.last_name}</strong>
                    <div className="text-muted" style={{ fontSize: 11 }}>{r.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${SPEC_COLOR[r.specialization] || 'badge-gray'}`}>
                      {r.specialization}
                    </span>
                  </td>
                  <td>{r.hospital_branch}</td>
                  <td>{r.years_experience} yrs</td>
                  <td>{r.phone_number}</td>
                  <td>
                    <span className="badge badge-blue">{r.total_appointments || 0}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                        onClick={() => handleDelete(r.doctor_id)}>Delete</button>
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
          title={modal === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
          data={form} onChange={onChange}
          onSave={handleSave} onClose={() => setModal(null)}
          isEdit={modal === 'edit'}
        />
      )}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
