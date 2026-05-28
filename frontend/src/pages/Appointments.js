// frontend/src/pages/Appointments.js
import React, { useEffect, useState, useCallback } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api';

const STATUSES  = ['Scheduled', 'Completed', 'Cancelled', 'No-show'];
const REASONS   = ['Consultation', 'Checkup', 'Follow-up', 'Therapy', 'Emergency'];

const STATUS_BADGE = {
  Scheduled:  'badge-blue',
  Completed:  'badge-green',
  Cancelled:  'badge-gray',
  'No-show':  'badge-amber',
};

const REASON_BADGE = {
  Emergency:    'badge-red',
  Consultation: 'badge-purple',
  Checkup:      'badge-blue',
  'Follow-up':  'badge-green',
  Therapy:      'badge-amber',
};

const EMPTY = {
  appointment_id: '', patient_id: '', doctor_id: '',
  appointment_date: '', appointment_time: '',
  reason_for_visit: 'Consultation', status: 'Scheduled',
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
          readOnly={key === 'appointment_id' && isEdit} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="form-grid">
          {f('appointment_id',   'Appointment ID')}
          {f('status',           'Status', 'text', { select: STATUSES })}
          {f('patient_id',       'Patient ID')}
          {f('doctor_id',        'Doctor ID')}
          {f('appointment_date', 'Date', 'date')}
          {f('appointment_time', 'Time', 'time')}
          {f('reason_for_visit', 'Reason', 'text', { select: REASONS, full: true })}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            {isEdit ? 'Update Appointment' : 'Add Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Appointments() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [error, setError]       = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (statusFilter) params.status = statusFilter;
    getAppointments(params).then(setRows).catch(console.error).finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (row) => {
    setForm({
      ...row,
      appointment_date: row.appointment_date?.slice(0, 10) || '',
      appointment_time: row.appointment_time?.slice(0, 5)  || '',
    });
    setError(''); setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'add') await createAppointment(form);
      else                 await updateAppointment(form.appointment_id, form);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete appointment ${id}?`)) return;
    try { await deleteAppointment(id); load(); } catch (e) { alert(e.message); }
  };

  // Summary counts
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = rows.filter(r => r.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Track and manage all patient appointments</p>
      </div>

      {/* Mini stat strip */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {STATUSES.map(s => (
          <div className="stat-card" key={s} style={{ padding: '12px 16px' }}>
            <div className="stat-card-label">{s}</div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>{counts[s] || 0}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3>Appointments ({rows.length})</h3>
          <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Appointment</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Patient</th><th>Doctor</th><th>Specialization</th>
                <th>Date & Time</th><th>Reason</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.appointment_id}>
                  <td className="mono">{r.appointment_id}</td>
                  <td>
                    <strong>{r.patient_name}</strong>
                    <div className="text-muted mono" style={{ fontSize: 11 }}>{r.patient_id}</div>
                  </td>
                  <td>
                    <strong>Dr. {r.doctor_name}</strong>
                    <div className="text-muted mono" style={{ fontSize: 11 }}>{r.doctor_id}</div>
                  </td>
                  <td>{r.specialization}</td>
                  <td>
                    <div>{r.appointment_date?.slice(0, 10)}</div>
                    <div className="text-muted">{r.appointment_time?.slice(0, 5)}</div>
                  </td>
                  <td>
                    <span className={`badge ${REASON_BADGE[r.reason_for_visit] || 'badge-gray'}`}>
                      {r.reason_for_visit}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.status] || 'badge-gray'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                        onClick={() => handleDelete(r.appointment_id)}>Delete</button>
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
          title={modal === 'add' ? 'Add Appointment' : 'Edit Appointment'}
          data={form} onChange={onChange}
          onSave={handleSave} onClose={() => setModal(null)}
          isEdit={modal === 'edit'}
        />
      )}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
