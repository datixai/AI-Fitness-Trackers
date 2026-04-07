import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const tabs = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'clients', icon: '👥', label: 'Clients' },
  { id: 'plans', icon: '📅', label: 'Plans' },
  { id: 'admins', icon: '🔑', label: 'Admin Users' },
  { id: 'settings', icon: '⚙️', label: 'Site Settings' },
  { id: 'audit', icon: '📋', label: 'Audit Log' },
];

const inputStyle = {
  width: '100%', padding: '10px 14px', background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const labelStyle = { color: '#888', fontSize: 13, display: 'block', marginBottom: 5 };

function StatCard({ label, value, color = '#D2691E' }) {
  return (
    <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#666', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value ?? '—'}</div>
    </div>
  );
}

function Alert({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14,
      background: type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(220,38,38,0.3)'}`,
      color: type === 'success' ? '#4ade80' : '#f87171',
    }}>{msg}</div>
  );
}

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [alert, setAlert] = useState({ msg: '', type: '' });
  const headers = { Authorization: `Bearer ${token}` };

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: '', type: '' }), 3500);
  };

  // ─── OVERVIEW ───
  const [stats, setStats] = useState(null);
  useEffect(() => {
    axios.get(`${API}/admin/dashboard`, { headers }).then(r => setStats(r.data.dashboard)).catch(() => {});
  }, []);

  // ─── CLIENTS ───
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetail, setClientDetail] = useState(null);
  const [newPlan, setNewPlan] = useState({ plan_name: '', start_date: '', end_date: '', price: '', duration_days: '', notes: '' });

  const loadClients = async () => {
    const r = await axios.get(`${API}/admin/clients?search=${search}&limit=100`, { headers });
    setClients(r.data.clients || []);
  };

  useEffect(() => { if (activeTab === 'clients') loadClients(); }, [activeTab, search]);

  const loadClientDetail = async (id) => {
    setSelectedClient(id);
    const r = await axios.get(`${API}/admin/clients/${id}`, { headers });
    setClientDetail(r.data.client);
  };

  const createPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/plans/admin/create`, { ...newPlan, client_id: selectedClient }, { headers });
      showAlert('Plan created successfully!');
      setNewPlan({ plan_name: '', start_date: '', end_date: '', price: '', duration_days: '', notes: '' });
    } catch { showAlert('Error creating plan', 'error'); }
  };

  const toggleActive = async (clientId, current) => {
    await axios.put(`${API}/admin/clients/${clientId}`, { is_active: !current }, { headers });
    loadClients();
    showAlert(`Client ${current ? 'deactivated' : 'activated'}`);
  };

  // ─── ADMIN USERS ───
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', first_name: '', last_name: '' });

  const loadAdmins = async () => {
    const r = await axios.get(`${API}/admin/admins`, { headers });
    setAdmins(r.data.admins || []);
  };

  useEffect(() => { if (activeTab === 'admins') loadAdmins(); }, [activeTab]);

  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/admins/create`, newAdmin, { headers });
      showAlert('Admin created successfully!');
      setNewAdmin({ email: '', password: '', first_name: '', last_name: '' });
      loadAdmins();
    } catch (err) { showAlert(err.response?.data?.message || 'Error', 'error'); }
  };

  const removeAdmin = async (id) => {
    if (!confirm('Remove this admin?')) return;
    try {
      await axios.delete(`${API}/admin/admins/${id}`, { headers });
      showAlert('Admin removed');
      loadAdmins();
    } catch { showAlert('Error removing admin', 'error'); }
  };

  // ─── SITE SETTINGS ───
  const [settings, setSettings] = useState({ whatsapp_number: '', email: '', location_name: '' });

  useEffect(() => {
    if (activeTab === 'settings') {
      axios.get(`${API}/admin/settings`, { headers }).then(r => {
        if (r.data.settings) setSettings(r.data.settings);
      }).catch(() => {});
    }
  }, [activeTab]);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/admin/settings`, settings, { headers });
      showAlert('Settings saved!');
    } catch { showAlert('Error saving settings', 'error'); }
  };

  // ─── AUDIT LOG ───
  const [auditLogs, setAuditLogs] = useState([]);
  useEffect(() => {
    if (activeTab === 'audit') {
      axios.get(`${API}/admin/audit-log?limit=50`, { headers }).then(r => setAuditLogs(r.data.logs || [])).catch(() => {});
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: '#111', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#8B4513,#D2691E)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>AM</div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Admin Panel</span>
        </div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>Logged in as</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.first_name}</div>
          <div style={{ fontSize: 11, color: '#D2691E', marginTop: 2 }}>Administrator</div>
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', background: activeTab === tab.id ? 'rgba(210,105,30,0.15)' : 'transparent',
                borderLeft: activeTab === tab.id ? '3px solid #D2691E' : '3px solid transparent',
                border: 'none', color: activeTab === tab.id ? '#D2691E' : '#666',
                cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, textAlign: 'left',
              }}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={logout} style={{ width: '100%', padding: '9px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <Alert msg={alert.msg} type={alert.type} />

        {/* ─── OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard label="Total Clients" value={stats?.totalClients} />
              <StatCard label="Active Plans" value={stats?.activePlans} color="#4ade80" />
              <StatCard label="Total Revenue" value={stats?.totalRevenue ? `€${parseFloat(stats.totalRevenue).toFixed(0)}` : '€0'} color="#a78bfa" />
            </div>
            {stats?.recentActivity?.length > 0 && (
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Activity</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Name', 'Email', 'Last Log'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#555', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 16px' }}>{c.first_name} {c.last_name}</td>
                        <td style={{ padding: '10px 16px', color: '#666' }}>{c.email}</td>
                        <td style={{ padding: '10px 16px', color: c.last_activity ? '#4ade80' : '#555' }}>{c.last_activity ? c.last_activity.split('T')[0] : 'Never'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── CLIENTS ─── */}
        {activeTab === 'clients' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Client Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: selectedClient ? '1fr 1fr' : '1fr', gap: 24 }}>
              <div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
                  style={{ ...inputStyle, marginBottom: 16 }} />
                <div style={{ display: 'grid', gap: 8 }}>
                  {clients.map(c => (
                    <div key={c.id} onClick={() => loadClientDetail(c.id)}
                      style={{
                        background: selectedClient === c.id ? 'rgba(210,105,30,0.1)' : '#141414',
                        border: `1px solid ${selectedClient === c.id ? 'rgba(210,105,30,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.first_name} {c.last_name}</div>
                        <div style={{ color: '#666', fontSize: 12 }}>{c.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: c.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: c.is_active ? '#4ade80' : '#f87171' }}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); toggleActive(c.id, c.is_active); }}
                          style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#888', cursor: 'pointer', fontSize: 11 }}>
                          {c.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client detail panel */}
              {selectedClient && clientDetail && (
                <div>
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{clientDetail.first_name} {clientDetail.last_name}</h3>
                    <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
                      {[['Email', clientDetail.email], ['Phone', clientDetail.phone], ['City', clientDetail.city], ['Height', clientDetail.height_cm ? `${clientDetail.height_cm} cm` : '—'], ['Gender', clientDetail.gender]].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: 12 }}>
                          <span style={{ color: '#555', width: 80, flexShrink: 0 }}>{k}</span>
                          <span style={{ color: '#ccc' }}>{v || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assign Plan */}
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#D2691E' }}>Assign New Plan</h3>
                    <form onSubmit={createPlan}>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Plan Name</label>
                          <input value={newPlan.plan_name} onChange={e => setNewPlan(p => ({ ...p, plan_name: e.target.value }))} style={inputStyle} placeholder="e.g. Monthly Coaching" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={labelStyle}>Start Date</label>
                            <input type="date" value={newPlan.start_date} onChange={e => setNewPlan(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>End Date</label>
                            <input type="date" value={newPlan.end_date} onChange={e => setNewPlan(p => ({ ...p, end_date: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={labelStyle}>Price (€)</label>
                            <input type="number" value={newPlan.price} onChange={e => setNewPlan(p => ({ ...p, price: e.target.value }))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Duration (days)</label>
                            <input type="number" value={newPlan.duration_days} onChange={e => setNewPlan(p => ({ ...p, duration_days: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Notes</label>
                          <textarea value={newPlan.notes} onChange={e => setNewPlan(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} rows={2} />
                        </div>
                        <button type="submit" style={{ padding: '10px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                          Create Plan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── ADMIN USERS ─── */}
        {activeTab === 'admins' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Admin User Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* List */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#888' }}>Current Admins</h3>
                <div style={{ display: 'grid', gap: 8 }}>
                  {admins.map(a => (
                    <div key={a.id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.first_name} {a.last_name}</div>
                        <div style={{ color: '#555', fontSize: 12 }}>{a.email}</div>
                      </div>
                      {a.id !== user?.id && (
                        <button onClick={() => removeAdmin(a.id)} style={{ padding: '6px 12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: 12 }}>
                          Remove
                        </button>
                      )}
                      {a.id === user?.id && <span style={{ fontSize: 11, color: '#555' }}>You</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add admin */}
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#D2691E' }}>Add New Admin</h3>
                <form onSubmit={createAdmin}>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[['first_name', 'First Name', 'text'], ['last_name', 'Last Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password (min 8 chars)', 'password']].map(([k, label, type]) => (
                      <div key={k}>
                        <label style={labelStyle}>{label}</label>
                        <input type={type} value={newAdmin[k]} onChange={e => setNewAdmin(p => ({ ...p, [k]: e.target.value }))} style={inputStyle} required />
                      </div>
                    ))}
                    <button type="submit" style={{ padding: '10px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      Create Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Site Settings</h2>
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, maxWidth: 500 }}>
              <form onSubmit={saveSettings}>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>WhatsApp Number (without +)</label>
                    <input value={settings.whatsapp_number} onChange={e => setSettings(s => ({ ...s, whatsapp_number: e.target.value }))} style={inputStyle} placeholder="34653062465" />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Email</label>
                    <input type="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} style={inputStyle} placeholder="contact@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Location Name</label>
                    <input value={settings.location_name} onChange={e => setSettings(s => ({ ...s, location_name: e.target.value }))} style={inputStyle} placeholder="e.g. Madrid, Spain" />
                  </div>
                  <button type="submit" style={{ padding: '11px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── AUDIT LOG ─── */}
        {activeTab === 'audit' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Audit Log</h2>
            {auditLogs.length === 0 ? (
              <div style={{ background: '#141414', borderRadius: 16, padding: 48, textAlign: 'center', color: '#555' }}>No audit logs yet.</div>
            ) : (
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Date', 'Admin', 'Action', 'Entity', 'Client'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#555', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 16px', color: '#666' }}>{log.created_at?.split('T')[0]}</td>
                        <td style={{ padding: '10px 16px' }}>{log.admin_email}</td>
                        <td style={{ padding: '10px 16px', color: '#D2691E' }}>{log.action}</td>
                        <td style={{ padding: '10px 16px' }}>{log.entity_type}</td>
                        <td style={{ padding: '10px 16px', color: '#666' }}>{log.client_email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
