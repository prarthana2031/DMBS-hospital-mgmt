// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  getDashboardStats, getAppointmentsByMonth, getRevenueByMonth,
  getTreatmentTypes, getTopDoctors, getInsuranceBreakdown
} from '../api';

const COLORS = ['#1a56db','#059669','#d97706','#dc2626','#7c3aed','#0284c7'];

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: color + '22' }}>
        <span style={{ color, fontSize: 18 }}>{icon}</span>
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]         = useState(null);
  const [apptMonthly, setApptM]   = useState([]);
  const [revMonthly, setRevM]     = useState([]);
  const [treatTypes, setTreat]    = useState([]);
  const [topDocs, setTopDocs]     = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getAppointmentsByMonth(),
      getRevenueByMonth(),
      getTreatmentTypes(),
      getTopDoctors(),
      getInsuranceBreakdown(),
    ]).then(([s, am, rm, tt, td, ins]) => {
      setStats(s); setApptM(am); setRevM(rm);
      setTreat(tt); setTopDocs(td); setInsurance(ins);
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="loading">Loading dashboard…</div>;
  const fmt = (n) => n ? `$${parseFloat(n).toLocaleString()}` : '$0';

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Hospital Management Overview – 2023</p>
      </div>

      {/* KPI cards */}
      <div className="stat-grid">
        <StatCard label="Total Patients"     value={stats.patients.total}            icon="👥" color="#1a56db" />
        <StatCard label="Total Doctors"      value={stats.doctors.total}             icon="👨‍⚕️" color="#059669" />
        <StatCard label="Appointments"       value={stats.appointments.total}
          sub={`${stats.appointments.completed} completed`}                          icon="📅" color="#7c3aed" />
        <StatCard label="Total Revenue"      value={fmt(stats.billing.total_revenue)}
          sub={`${fmt(stats.billing.paid)} paid`}                                    icon="💰" color="#d97706" />
        <StatCard label="Pending Bills"      value={fmt(stats.billing.pending)}      icon="⏳" color="#0284c7" />
        <StatCard label="Failed Payments"    value={fmt(stats.billing.failed)}       icon="❌" color="#dc2626" />
      </div>

      {/* Charts row 1 */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Appointments by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={apptMonthly} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#059669" radius={[0,0,0,0]} />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#dc2626" />
              <Bar dataKey="no_show"   name="No-show"   stackId="a" fill="#d97706" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revMonthly} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `$${parseFloat(v).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total"  stroke="#1a56db" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="paid"  name="Paid"   stroke="#059669" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Treatment Types</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={treatTypes} dataKey="count" nameKey="treatment_type" cx="50%" cy="50%"
                   outerRadius={80} label={({ treatment_type, percent }) =>
                     `${treatment_type} ${(percent * 100).toFixed(0)}%`}>
                {treatTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Insurance Providers</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={insurance} dataKey="patient_count" nameKey="insurance_provider"
                   cx="50%" cy="50%" outerRadius={80} innerRadius={50}
                   label={({ insurance_provider }) => insurance_provider}>
                {insurance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top doctors */}
      <div className="table-card">
        <div className="table-toolbar"><h3>Top Doctors by Appointments</h3></div>
        <table>
          <thead>
            <tr>
              <th>Doctor</th><th>Specialization</th><th>Branch</th>
              <th>Total Appts</th><th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {topDocs.map((d) => (
              <tr key={d.doctor_id}>
                <td><strong>{d.name}</strong></td>
                <td>{d.specialization}</td>
                <td>{d.hospital_branch}</td>
                <td>{d.total_appointments}</td>
                <td>
                  <span className="badge badge-green">{d.completed}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
