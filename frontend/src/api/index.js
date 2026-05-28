// frontend/src/api/index.js
const BASE = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Dashboard ────────────────────────────────────────────────
export const getDashboardStats         = () => request('/dashboard/stats');
export const getAppointmentsByMonth    = () => request('/dashboard/appointments-by-month');
export const getRevenueByMonth         = () => request('/dashboard/revenue-by-month');
export const getTreatmentTypes         = () => request('/dashboard/treatment-types');
export const getTopDoctors             = () => request('/dashboard/top-doctors');
export const getInsuranceBreakdown     = () => request('/dashboard/insurance-breakdown');

// ── Patients ─────────────────────────────────────────────────
export const getPatients  = (params = {}) => request('/patients?' + new URLSearchParams(params));
export const getPatient   = (id)          => request(`/patients/${id}`);
export const createPatient= (data)        => request('/patients', { method:'POST', body:JSON.stringify(data) });
export const updatePatient= (id, data)    => request(`/patients/${id}`, { method:'PUT', body:JSON.stringify(data) });
export const deletePatient= (id)          => request(`/patients/${id}`, { method:'DELETE' });

// ── Doctors ──────────────────────────────────────────────────
export const getDoctors   = (params = {}) => request('/doctors?' + new URLSearchParams(params));
export const getDoctor    = (id)          => request(`/doctors/${id}`);
export const createDoctor = (data)        => request('/doctors', { method:'POST', body:JSON.stringify(data) });
export const updateDoctor = (id, data)    => request(`/doctors/${id}`, { method:'PUT', body:JSON.stringify(data) });
export const deleteDoctor = (id)          => request(`/doctors/${id}`, { method:'DELETE' });

// ── Appointments ─────────────────────────────────────────────
export const getAppointments  = (params = {}) => request('/appointments?' + new URLSearchParams(params));
export const getAppointment   = (id)           => request(`/appointments/${id}`);
export const createAppointment= (data)         => request('/appointments', { method:'POST', body:JSON.stringify(data) });
export const updateAppointment= (id, data)     => request(`/appointments/${id}`, { method:'PUT', body:JSON.stringify(data) });
export const deleteAppointment= (id)           => request(`/appointments/${id}`, { method:'DELETE' });

// ── Treatments ───────────────────────────────────────────────
export const getTreatments  = (params = {}) => request('/treatments?' + new URLSearchParams(params));
export const getTreatment   = (id)           => request(`/treatments/${id}`);
export const createTreatment= (data)         => request('/treatments', { method:'POST', body:JSON.stringify(data) });
export const updateTreatment= (id, data)     => request(`/treatments/${id}`, { method:'PUT', body:JSON.stringify(data) });
export const deleteTreatment= (id)           => request(`/treatments/${id}`, { method:'DELETE' });

// ── Billing ──────────────────────────────────────────────────
export const getBills   = (params = {}) => request('/billing?' + new URLSearchParams(params));
export const getBill    = (id)          => request(`/billing/${id}`);
export const createBill = (data)        => request('/billing', { method:'POST', body:JSON.stringify(data) });
export const updateBill = (id, data)    => request(`/billing/${id}`, { method:'PUT', body:JSON.stringify(data) });
export const deleteBill = (id)          => request(`/billing/${id}`, { method:'DELETE' });
