// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';

import Dashboard    from './pages/Dashboard';
import Patients     from './pages/Patients';
import Doctors      from './pages/Doctors';
import Appointments from './pages/Appointments';
import Treatments   from './pages/Treatments';
import Billing      from './pages/Billing';

// ── Icons ──────────────────────────────────────────────────────
const icons = {
  dashboard:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  patients:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
  doctors:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 22V12m-3 3h6"/></svg>,
  appointments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  treatments:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  billing:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        MediCore
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Overview</div>
        <NavLink to="/" end className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
          {icons.dashboard} Dashboard
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Management</div>
        {[
          { to: '/patients',     label: 'Patients',     icon: icons.patients },
          { to: '/doctors',      label: 'Doctors',      icon: icons.doctors },
          { to: '/appointments', label: 'Appointments', icon: icons.appointments },
          { to: '/treatments',   label: 'Treatments',   icon: icons.treatments },
          { to: '/billing',      label: 'Billing',      icon: icons.billing },
        ].map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
            {icon} {label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/patients"     element={<Patients />} />
            <Route path="/doctors"      element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/treatments"   element={<Treatments />} />
            <Route path="/billing"      element={<Billing />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
