// frontend/src/pages/Treatments.js
import React, { useEffect, useState, useCallback } from 'react';
import { getTreatments, createTreatment, updateTreatment, deleteTreatment } from '../api';

const TREATMENT_TYPES = ['Chemotherapy', 'MRI', 'ECG', 'Physiotherapy', 'X-Ray'];
const DESCRIPTIONS    = ['Basic screening', 'Standard procedure', 'Advanced protocol'];

const TYPE_BADGE = {
  Chemotherapy: 'badge-red',
  MRI:          'badge-purple',
  ECG:          'badge-blue',
  Physiotherapy:'badge-green',
  'X-Ray':      'badge-amber',
};

const EMPTY = {
  treatment_id: '', appointment_id: '', treatment_type: 'MRI',
  description: 'Standard procedure', cost: '', treatment_date: '',
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
          readOnly={key === 'treatment_id' && isEdit} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="form-grid">
          {f('treatment_id',   'Treatment ID')}
          {f('appointment_id', 'Appointment ID')}
          {f('treatment_type', 'Treatment Type', 'text', { select: TREATMENT_TYPES })}
          {f('description',    'Description', 'text', { select: DESCRIPTIONS })}
          {f('cost',           'Cost ($)', 'number')}
          {f('treatment_date', 'Treatment Date', 'date')}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            {isEdit ? 'Update Treatment' : 'Add Treatment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Treatments() {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [typeFilter, setType]     = useState('');
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [error, setError]         = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (typeFilter) params.treatment_type = typeFilter;
    getTreatments(params).then(setRows).catch(console.error).finally(() => setLoading(false));
  }, [typeFilter]);

  useEffect(() => { load(); }, [load]);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (row) => {
    setForm({ ...row, treatment_date: row.treatment_date?.slice(0, 10) || '' });
    setError(''); setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'add') await createTreatment(form);
      else                 await updateTreatment(form.treatment_id, form);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete treatment ${id}?`)) return;
    try { await deleteTreatment(id); load(); } catch (e) { alert(e.message); }
  };

  // Stats per type
  const stats = TREATMENT_TYPES.map(t => ({
    type: t,
    count: rows.filter(r => r.treatment_type === t).length,
    total: rows.filter(r => r.treatment_type === t).reduce((s, r) => s + parseFloat(r.cost || 0), 0),
  }));

  return (
    <>
      <div className="page-header">
        <h1>Treatments</h1>
        <p>Manage treatment records and costs</p>
      </div>

      {/* Summary strip */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map(s => (
          <div className="stat-card" key={s.type} style={{ padding: '12px 16px' }}>
            <span className={`badge ${TYPE_BADGE[s.type] || 'badge-gray'}`} style={{ marginBottom: 4 }}>
              {s.type}
            </span>
            <div className="stat-card-value" style={{ fontSize: 20 }}>{s.count}</div>
            <div className="stat-card-sub">${s.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3>All Treatments ({rows.length})</h3>
          <select className="filter-select" value={typeFilter} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            {TREATMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Treatment</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Type</th><th>Patient</th><th>Doctor</th>
                <th>Description</th><th>Cost</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.treatment_id}>
                  <td className="mono">{r.treatment_id}</td>
                  <td>
                    <span className={`badge ${TYPE_BADGE[r.treatment_type] || 'badge-gray'}`}>
                      {r.treatment_type}
                    </span>
                  </td>
                  <td>{r.patient_name}</td>
                  <td>Dr. {r.doctor_name}</td>
                  <td className="text-muted">{r.description}</td>
                  <td>
                    <strong>${parseFloat(r.cost).toLocaleString()}</strong>
                  </td>
                  <td>{r.treatment_date?.slice(0, 10)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                        onClick={() => handleDelete(r.treatment_id)}>Delete</button>
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
          title={modal === 'add' ? 'Add Treatment' : 'Edit Treatment'}
          data={form} onChange={onChange}
          onSave={handleSave} onClose={() => setModal(null)}
          isEdit={modal === 'edit'}
        />
      )}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
