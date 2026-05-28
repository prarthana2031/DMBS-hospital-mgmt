// frontend/src/pages/Billing.js
import React, { useEffect, useState, useCallback } from 'react';
import { getBills, createBill, updateBill, deleteBill } from '../api';

const PAYMENT_METHODS  = ['Cash', 'Credit Card', 'Insurance'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Failed'];

const STATUS_BADGE = {
  Paid:    'badge-green',
  Pending: 'badge-amber',
  Failed:  'badge-red',
};

const METHOD_BADGE = {
  Cash:          'badge-gray',
  'Credit Card': 'badge-blue',
  Insurance:     'badge-purple',
};

const EMPTY = {
  bill_id: '', patient_id: '', treatment_id: '',
  bill_date: '', amount: '', payment_method: 'Cash', payment_status: 'Pending',
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
          readOnly={key === 'bill_id' && isEdit} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="form-grid">
          {f('bill_id',        'Bill ID')}
          {f('patient_id',     'Patient ID')}
          {f('treatment_id',   'Treatment ID')}
          {f('bill_date',      'Bill Date', 'date')}
          {f('amount',         'Amount ($)', 'number')}
          {f('payment_method', 'Payment Method', 'text', { select: PAYMENT_METHODS })}
          {f('payment_status', 'Payment Status', 'text', { select: PAYMENT_STATUSES })}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            {isEdit ? 'Update Bill' : 'Add Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Billing() {
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatus]   = useState('');
  const [methodFilter, setMethod]   = useState('');
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [error, setError]           = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (statusFilter) params.payment_status = statusFilter;
    if (methodFilter) params.payment_method = methodFilter;
    getBills(params).then(setRows).catch(console.error).finally(() => setLoading(false));
  }, [statusFilter, methodFilter]);

  useEffect(() => { load(); }, [load]);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (row) => {
    setForm({ ...row, bill_date: row.bill_date?.slice(0, 10) || '' });
    setError(''); setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'add') await createBill(form);
      else                 await updateBill(form.bill_id, form);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete bill ${id}?`)) return;
    try { await deleteBill(id); load(); } catch (e) { alert(e.message); }
  };

  // Aggregates
  const total   = rows.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
  const paid    = rows.filter(r => r.payment_status === 'Paid').reduce((s, r) => s + parseFloat(r.amount || 0), 0);
  const pending = rows.filter(r => r.payment_status === 'Pending').reduce((s, r) => s + parseFloat(r.amount || 0), 0);
  const failed  = rows.filter(r => r.payment_status === 'Failed').reduce((s, r) => s + parseFloat(r.amount || 0), 0);

  const fmt = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <div className="page-header">
        <h1>Billing</h1>
        <p>Track payments, invoices, and billing status</p>
      </div>

      {/* Summary strip */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Billed</div>
          <div className="stat-card-value" style={{ fontSize: 20 }}>{fmt(total)}</div>
          <div className="stat-card-sub">{rows.length} bills</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Paid</div>
          <div className="stat-card-value" style={{ fontSize: 20, color: 'var(--green)' }}>{fmt(paid)}</div>
          <div className="stat-card-sub">{rows.filter(r => r.payment_status === 'Paid').length} bills</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Pending</div>
          <div className="stat-card-value" style={{ fontSize: 20, color: 'var(--amber)' }}>{fmt(pending)}</div>
          <div className="stat-card-sub">{rows.filter(r => r.payment_status === 'Pending').length} bills</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Failed</div>
          <div className="stat-card-value" style={{ fontSize: 20, color: 'var(--red)' }}>{fmt(failed)}</div>
          <div className="stat-card-sub">{rows.filter(r => r.payment_status === 'Failed').length} bills</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3>All Bills ({rows.length})</h3>
          <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={methodFilter} onChange={e => setMethod(e.target.value)}>
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Bill</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <table>
            <thead>
              <tr>
                <th>Bill ID</th><th>Patient</th><th>Treatment</th>
                <th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.bill_id}>
                  <td className="mono">{r.bill_id}</td>
                  <td>
                    <strong>{r.patient_name}</strong>
                    <div className="text-muted mono" style={{ fontSize: 11 }}>{r.patient_id}</div>
                  </td>
                  <td>
                    <div>{r.treatment_type}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{r.description}</div>
                  </td>
                  <td>{r.bill_date?.slice(0, 10)}</td>
                  <td>
                    <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
                      {fmt(parseFloat(r.amount))}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${METHOD_BADGE[r.payment_method] || 'badge-gray'}`}>
                      {r.payment_method}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.payment_status] || 'badge-gray'}`}>
                      {r.payment_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                        onClick={() => handleDelete(r.bill_id)}>Delete</button>
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
          title={modal === 'add' ? 'Add Bill' : 'Edit Bill'}
          data={form} onChange={onChange}
          onSave={handleSave} onClose={() => setModal(null)}
          isEdit={modal === 'edit'}
        />
      )}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
