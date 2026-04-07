import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const tabs = [
  { id: 'profile', icon: '👤', it: 'Profilo', en: 'Profile' },
  { id: 'daily', icon: '📋', it: 'Diario', en: 'Daily Log' },
  { id: 'misure', icon: '📏', it: 'Misure', en: 'Measurements' },
  { id: 'pliche', icon: '🫸', it: 'Pliche', en: 'Body Fat' },
  { id: 'photos', icon: '📸', it: 'Foto', en: 'Photos' },
  { id: 'plan', icon: '📅', it: 'Piano', en: 'Plan' },
  { id: 'workout', icon: '🏋️', it: 'Allenamento', en: 'Workout' },
  { id: 'nutrition', icon: '🥗', it: 'Nutrizione', en: 'Nutrition' },
  { id: 'supplements', icon: '💊', it: 'Integratori', en: 'Supplements' },
];

const inputStyle = {
  width: '100%', padding: '10px 14px', background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const labelStyle = { color: '#888', fontSize: 13, display: 'block', marginBottom: 5 };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 };

function ScaleInput({ label, name, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} type="button" onClick={() => onChange({ target: { name, value: n } })}
            style={{
              width: 34, height: 34, borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: value === n ? 'linear-gradient(135deg,#8B4513,#D2691E)' : '#2a2a2a',
              color: value === n ? '#fff' : '#888',
            }}>{n}</button>
        ))}
      </div>
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

export default function ClientDashboard() {
  const { user, token, logout } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState({ msg: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const L = (it, en) => lang === 'it' ? it : en;
  const headers = { Authorization: `Bearer ${token}` };

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: '', type: '' }), 3500);
  };

  // ─── PROFILE ───
  const [profile, setProfile] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: '', city: '',
    postal_code: '', birth_date: '', height_cm: '', gender: '',
    training_history: '', injury_history: '', dietary_preferences: '',
    sleep_hours: '', physical_activity_level: '', smoking: '', alcohol: '',
    work_activity: '', intolerances: '', allergies: '', medications: '',
  });

  useEffect(() => {
    axios.get(`${API}/client/profile`, { headers }).then(r => {
      const p = r.data.profile;
      setProfile(prev => ({ ...prev, ...p, birth_date: p.birth_date?.split('T')[0] || '' }));
    }).catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/client/profile`, profile, { headers });
      showAlert(L('Profilo salvato!', 'Profile saved!'));
    } catch { showAlert(L('Errore nel salvataggio', 'Save error'), 'error'); }
  };

  // ─── DAILY LOG ───
  const [daily, setDaily] = useState({
    log_date: new Date().toISOString().split('T')[0],
    weight_kg: '', resting_heart_rate: '',
    mood: 0, stress: 0, energy: 0, sleep_quality: 0, hunger: 0, notes: '',
  });
  const [dailyLogs, setDailyLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'daily') {
      axios.get(`${API}/daily-log`, { headers }).then(r => setDailyLogs(r.data.logs || [])).catch(() => {});
    }
  }, [activeTab]);

  const saveDaily = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/daily-log/submit`, { ...daily, formType: 'daily_log' }, { headers });
      showAlert(L('Diario salvato!', 'Daily log saved!'));
      const r = await axios.get(`${API}/daily-log`, { headers });
      setDailyLogs(r.data.logs || []);
    } catch (err) {
      showAlert(err.response?.data?.message || L('Errore', 'Error'), 'error');
    }
  };

  // ─── MISURE ───
  const [misure, setMisure] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    week_number: '', petto_cm: '', braccio_sinistro_cm: '', braccio_destro_cm: '',
    vita_cm: '', coscia_sinistra_cm: '', coscia_destra_cm: '',
  });
  const [misureHistory, setMisureHistory] = useState([]);

  useEffect(() => {
    if (activeTab === 'misure') {
      axios.get(`${API}/measurements/misure`, { headers }).then(r => setMisureHistory(r.data.measurements || [])).catch(() => {});
    }
  }, [activeTab]);

  const saveMisure = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/measurements/misure`, { ...misure, formType: 'misure' }, { headers });
      showAlert(L('Misure salvate!', 'Measurements saved!'));
      const r = await axios.get(`${API}/measurements/misure`, { headers });
      setMisureHistory(r.data.measurements || []);
    } catch (err) {
      showAlert(err.response?.data?.message || L('Errore', 'Error'), 'error');
    }
  };

  // ─── PLICHE ───
  const [pliche, setPliche] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    week_number: '', gender: 'Male', age: '',
    petto_mm: '', addome_mm: '', coscia_mm: '', tricipite_mm: '',
    sottoscapola_mm: '', medio_ascellare_mm: '', anca_mm: '',
  });
  const [plichResult, setPlichResult] = useState(null);
  const [plichHistory, setPlichHistory] = useState([]);

  useEffect(() => {
    if (activeTab === 'pliche') {
      axios.get(`${API}/measurements/pliche`, { headers }).then(r => setPlichHistory(r.data.data || [])).catch(() => {});
    }
  }, [activeTab]);

  const savePliche = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/measurements/pliche`, { ...pliche, formType: 'body_fat' }, { headers });
      setPlichResult(r.data.data?.body_fat_percentage);
      showAlert(L('Pliche salvate!', 'Body fat saved!'));
      const r2 = await axios.get(`${API}/measurements/pliche`, { headers });
      setPlichHistory(r2.data.data || []);
    } catch (err) {
      showAlert(err.response?.data?.message || L('Errore', 'Error'), 'error');
    }
  };

  // ─── PLAN ───
  const [plan, setPlan] = useState(null);
  useEffect(() => {
    if (activeTab === 'plan') {
      axios.get(`${API}/plans/current`, { headers }).then(r => setPlan(r.data.plan)).catch(() => {});
    }
  }, [activeTab]);

  // ─── WORKOUT ───
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    if (activeTab === 'workout') {
      axios.get(`${API}/workout/history`, { headers }).then(r => setWorkouts(r.data.workouts || [])).catch(() => {});
    }
  }, [activeTab]);

  // ─── SUPPLEMENTS ───
  const [supplements, setSupplements] = useState([]);
  useEffect(() => {
    if (activeTab === 'supplements') {
      axios.get(`${API}/supplements/my-protocols`, { headers }).then(r => setSupplements(r.data.protocols || [])).catch(() => {});
    }
  }, [activeTab]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 220 : 60, background: '#111', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#8B4513,#D2691E)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>AM</div>
          {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>AM Culturismo</span>}
        </div>

        {/* User */}
        {sidebarOpen && (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{L('Benvenuto', 'Welcome')}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.first_name} {user?.last_name}</div>
          </div>
        )}

        {/* Tabs */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: sidebarOpen ? '10px 16px' : '10px 14px',
                background: activeTab === tab.id ? 'rgba(210,105,30,0.15)' : 'transparent',
                borderLeft: activeTab === tab.id ? '3px solid #D2691E' : '3px solid transparent',
                border: 'none', color: activeTab === tab.id ? '#D2691E' : '#666',
                cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                textAlign: 'left', whiteSpace: 'nowrap', transition: 'all .2s',
              }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{tab.icon}</span>
              {sidebarOpen && <span>{lang === 'it' ? tab.it : tab.en}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sidebarOpen && (
            <button onClick={toggleLang} style={{
              padding: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, color: '#888', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}>
              {lang === 'it' ? '🇬🇧 English' : '🇮🇹 Italiano'}
            </button>
          )}
          <button onClick={logout} style={{
            padding: '8px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: 12,
          }}>
            {sidebarOpen ? L('Esci', 'Logout') : '↩'}
          </button>
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            padding: '6px', background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18,
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <Alert msg={alert.msg} type={alert.type} />

        {/* ─── PROFILE TAB ─── */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Il Mio Profilo', 'My Profile')}</h2>
            <form onSubmit={saveProfile}>
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#D2691E', marginBottom: 16 }}>{L('Dati Personali', 'Personal Info')}</h3>
                <div style={gridStyle}>
                  {[['first_name', L('Nome','First Name')], ['last_name', L('Cognome','Last Name')], ['email', 'Email'], ['phone', L('Telefono','Phone')]].map(([name, label]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input name={name} value={profile[name] || ''} onChange={handleChange(setProfile)}
                        style={inputStyle} disabled={name === 'email'} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>{L('Data di Nascita','Birth Date')}</label>
                    <input type="date" name="birth_date" value={profile.birth_date || ''} onChange={handleChange(setProfile)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{L('Sesso','Gender')}</label>
                    <select name="gender" value={profile.gender || ''} onChange={handleChange(setProfile)} style={inputStyle}>
                      <option value="">--</option>
                      <option value="Male">{L('Maschio','Male')}</option>
                      <option value="Female">{L('Femmina','Female')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{L('Altezza (cm)','Height (cm)')}</label>
                    <input type="number" name="height_cm" value={profile.height_cm || ''} onChange={handleChange(setProfile)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{L('Città','City')}</label>
                    <input name="city" value={profile.city || ''} onChange={handleChange(setProfile)} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#D2691E', marginBottom: 16 }}>{L('Stile di Vita','Lifestyle')}</h3>
                <div style={gridStyle}>
                  {[
                    ['sleep_hours', L('Ore di Sonno','Sleep Hours'), 'number'],
                    ['physical_activity_level', L('Livello Attività','Activity Level'), 'text'],
                    ['smoking', L('Fumo','Smoking'), 'text'],
                    ['alcohol', L('Alcol','Alcohol'), 'text'],
                    ['work_activity', L('Attività Lavorativa','Work Activity'), 'text'],
                  ].map(([name, label, type]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input type={type} name={name} value={profile[name] || ''} onChange={handleChange(setProfile)} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#D2691E', marginBottom: 16 }}>{L('Salute & Anamnesi','Health & History')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['training_history', L('Storia Allenamento','Training History')],
                    ['injury_history', L('Infortuni','Injury History')],
                    ['dietary_preferences', L('Preferenze Alimentari','Dietary Preferences')],
                    ['intolerances', L('Intolleranze','Intolerances')],
                    ['allergies', L('Allergie','Allergies')],
                    ['medications', L('Farmaci','Medications')],
                  ].map(([name, label]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <textarea name={name} value={profile[name] || ''} onChange={handleChange(setProfile)}
                        rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" style={{
                padding: '12px 32px', background: 'linear-gradient(135deg,#8B4513,#D2691E)',
                color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>{L('Salva Profilo','Save Profile')}</button>
            </form>
          </div>
        )}

        {/* ─── DAILY LOG TAB ─── */}
        {activeTab === 'daily' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Diario Giornaliero','Daily Log')}</h2>
            <form onSubmit={saveDaily} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>{L('Data','Date')}</label>
                  <input type="date" name="log_date" value={daily.log_date} onChange={handleChange(setDaily)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{L('Peso (kg)','Weight (kg)')}</label>
                  <input type="number" step="0.1" name="weight_kg" value={daily.weight_kg} onChange={handleChange(setDaily)} style={inputStyle} placeholder="es. 75.5" />
                </div>
                <div>
                  <label style={labelStyle}>{L('FC a Riposo (bpm)','Resting Heart Rate')}</label>
                  <input type="number" name="resting_heart_rate" value={daily.resting_heart_rate} onChange={handleChange(setDaily)} style={inputStyle} placeholder="es. 62" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20, marginTop: 20 }}>
                <ScaleInput label={L('Umore 😊','Mood 😊')} name="mood" value={daily.mood} onChange={handleChange(setDaily)} />
                <ScaleInput label={L('Stress 😤','Stress 😤')} name="stress" value={daily.stress} onChange={handleChange(setDaily)} />
                <ScaleInput label={L('Energia ⚡','Energy ⚡')} name="energy" value={daily.energy} onChange={handleChange(setDaily)} />
                <ScaleInput label={L('Qualità Sonno 😴','Sleep Quality 😴')} name="sleep_quality" value={daily.sleep_quality} onChange={handleChange(setDaily)} />
                <ScaleInput label={L('Fame 🍽️','Hunger 🍽️')} name="hunger" value={daily.hunger} onChange={handleChange(setDaily)} />
              </div>
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>{L('Note','Notes')}</label>
                <textarea name="notes" value={daily.notes} onChange={handleChange(setDaily)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ marginTop: 20, padding: '11px 28px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {L('Salva Diario','Save Log')}
              </button>
            </form>

            {/* History table */}
            {dailyLogs.length > 0 && (
              <div style={{ background: '#141414', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{L('Storico','History')}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {[L('Data','Date'), L('Peso','Weight'), 'FC', L('Umore','Mood'), L('Stress','Stress'), L('Energia','Energy')].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#666', fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dailyLogs.slice(0, 20).map(log => (
                        <tr key={log.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 14px', color: '#D2691E' }}>{log.log_date?.split('T')[0]}</td>
                          <td style={{ padding: '10px 14px' }}>{log.weight_kg ? `${log.weight_kg} kg` : '-'}</td>
                          <td style={{ padding: '10px 14px' }}>{log.resting_heart_rate || '-'}</td>
                          <td style={{ padding: '10px 14px' }}>{log.mood || '-'}/10</td>
                          <td style={{ padding: '10px 14px' }}>{log.stress || '-'}/10</td>
                          <td style={{ padding: '10px 14px' }}>{log.energy || '-'}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── MISURE TAB ─── */}
        {activeTab === 'misure' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Misurazioni Corporee','Body Measurements')}</h2>
            <form onSubmit={saveMisure} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>{L('Data','Date')}</label>
                  <input type="date" name="measurement_date" value={misure.measurement_date} onChange={handleChange(setMisure)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{L('Settimana n°','Week n°')}</label>
                  <input type="number" name="week_number" value={misure.week_number} onChange={handleChange(setMisure)} style={inputStyle} />
                </div>
              </div>
              <div style={{ ...gridStyle, marginTop: 16 }}>
                {[
                  ['petto_cm', L('Petto (cm)','Chest (cm)')],
                  ['braccio_sinistro_cm', L('Braccio Sinistro (cm)','Left Arm (cm)')],
                  ['braccio_destro_cm', L('Braccio Destro (cm)','Right Arm (cm)')],
                  ['vita_cm', L('Vita (cm)','Waist (cm)')],
                  ['coscia_sinistra_cm', L('Coscia Sinistra (cm)','Left Thigh (cm)')],
                  ['coscia_destra_cm', L('Coscia Destra (cm)','Right Thigh (cm)')],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" step="0.1" name={name} value={misure[name]} onChange={handleChange(setMisure)} style={inputStyle} />
                  </div>
                ))}
              </div>
              <button type="submit" style={{ marginTop: 20, padding: '11px 28px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {L('Salva Misure','Save Measurements')}
              </button>
            </form>
            {misureHistory.length > 0 && (
              <div style={{ background: '#141414', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{L('Storico Misure','Measurement History')}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {[L('Data','Date'), L('Sett','Wk'), L('Petto','Chest'), L('B.Sin','L.Arm'), L('B.Dx','R.Arm'), L('Vita','Waist'), L('C.Sin','L.Th'), L('C.Dx','R.Th'), L('Totale','Total')].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#666', fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {misureHistory.slice(0, 15).map(m => (
                        <tr key={m.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 14px', color: '#D2691E' }}>{m.measurement_date?.split('T')[0]}</td>
                          <td style={{ padding: '10px 14px' }}>{m.week_number || '-'}</td>
                          {['petto_cm','braccio_sinistro_cm','braccio_destro_cm','vita_cm','coscia_sinistra_cm','coscia_destra_cm','total_cm'].map(k => (
                            <td key={k} style={{ padding: '10px 14px' }}>{m[k] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PLICHE TAB ─── */}
        {activeTab === 'pliche' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{L('Pliche — % Grasso Corporeo','Pliche — Body Fat %')}</h2>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>{L('Formula Jackson-Pollock 7 punti','Jackson-Pollock 7-site formula')}</p>
            <form onSubmit={savePliche} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>{L('Data','Date')}</label>
                  <input type="date" name="measurement_date" value={pliche.measurement_date} onChange={handleChange(setPliche)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{L('Settimana','Week')}</label>
                  <input type="number" name="week_number" value={pliche.week_number} onChange={handleChange(setPliche)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{L('Sesso','Gender')}</label>
                  <select name="gender" value={pliche.gender} onChange={handleChange(setPliche)} style={inputStyle}>
                    <option value="Male">{L('Maschio','Male')}</option>
                    <option value="Female">{L('Femmina','Female')}</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{L('Età','Age')}</label>
                  <input type="number" name="age" value={pliche.age} onChange={handleChange(setPliche)} style={inputStyle} />
                </div>
              </div>
              <div style={{ ...gridStyle, marginTop: 16 }}>
                {[
                  ['petto_mm', L('Petto (mm)','Chest (mm)')],
                  ['addome_mm', L('Addome (mm)','Abdomen (mm)')],
                  ['coscia_mm', L('Coscia (mm)','Thigh (mm)')],
                  ['tricipite_mm', L('Tricipite (mm)','Tricep (mm)')],
                  ['sottoscapola_mm', L('Sottoscapola (mm)','Subscapular (mm)')],
                  ['medio_ascellare_mm', L('Medio Ascellare (mm)','Midaxillary (mm)')],
                  ['anca_mm', L('Anca (mm)','Hip (mm)')],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" step="0.1" name={name} value={pliche[name]} onChange={handleChange(setPliche)} style={inputStyle} />
                  </div>
                ))}
              </div>
              {plichResult && (
                <div style={{ marginTop: 16, padding: '16px', background: 'rgba(210,105,30,0.1)', border: '1px solid rgba(210,105,30,0.3)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#D2691E', marginBottom: 4 }}>{L('% Grasso Corporeo Calcolato','Calculated Body Fat %')}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#D2691E' }}>{parseFloat(plichResult).toFixed(1)}%</div>
                </div>
              )}
              <button type="submit" style={{ marginTop: 20, padding: '11px 28px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {L('Calcola e Salva','Calculate & Save')}
              </button>
            </form>
            {plichHistory.length > 0 && (
              <div style={{ background: '#141414', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{L('Storico','History')}</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {plichHistory.slice(0, 10).map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <span style={{ color: '#D2691E' }}>{p.measurement_date?.split('T')[0]}</span>
                      <span>{L('Sett.','Wk')} {p.week_number || '-'}</span>
                      <span style={{ fontWeight: 700 }}>{parseFloat(p.body_fat_percentage || 0).toFixed(1)}% {L('grasso','fat')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PLAN TAB ─── */}
        {activeTab === 'plan' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Il Mio Piano','My Plan')}</h2>
            {plan ? (
              <div style={{ background: '#141414', border: '1px solid rgba(210,105,30,0.3)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.plan_name}</h3>
                    <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: plan.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: plan.status === 'active' ? '#4ade80' : '#f87171' }}>
                      {plan.status === 'active' ? L('Attivo','Active') : L('Scaduto','Expired')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#D2691E' }}>{plan.daysRemaining}</div>
                    <div style={{ color: '#666', fontSize: 13 }}>{L('giorni rimanenti','days remaining')}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginTop: 24 }}>
                  {[
                    [L('Inizio','Start'), plan.start_date?.split('T')[0]],
                    [L('Fine','End'), plan.end_date?.split('T')[0]],
                    [L('Pagamento','Payment'), plan.payment_status],
                    [L('Prezzo','Price'), plan.price ? `€${plan.price}` : '-'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14 }}>
                      <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#141414', borderRadius: 16, padding: 48, textAlign: 'center', color: '#555' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                <p>{L('Nessun piano attivo. Contatta il tuo coach.','No active plan. Contact your coach.')}</p>
              </div>
            )}
          </div>
        )}

        {/* ─── WORKOUT TAB ─── */}
        {activeTab === 'workout' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Schede Allenamento','Workout Plans')}</h2>
            {workouts.length === 0 ? (
              <div style={{ background: '#141414', borderRadius: 16, padding: 48, textAlign: 'center', color: '#555' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
                <p>{L('Nessuna scheda assegnata dal coach.','No workout assigned by coach.')}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {workouts.map(w => (
                  <div key={w.id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600 }}>{L('Settimana','Week')} {w.week_number} — {w.phase}</h3>
                      <span style={{ color: '#666', fontSize: 12 }}>{w.start_date?.split('T')[0]}</span>
                    </div>
                    {w.notes && <p style={{ color: '#777', fontSize: 13 }}>{w.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── SUPPLEMENTS TAB ─── */}
        {activeTab === 'supplements' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('I Miei Integratori','My Supplements')}</h2>
            {supplements.length === 0 ? (
              <div style={{ background: '#141414', borderRadius: 16, padding: 48, textAlign: 'center', color: '#555' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
                <p>{L('Nessun protocollo assegnato dal coach.','No protocol assigned by coach.')}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {supplements.map(s => (
                  <div key={s.id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600 }}>{s.supplement_name}</h3>
                      <span style={{ color: '#D2691E', fontSize: 12, fontWeight: 600 }}>{s.phase}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, fontSize: 13, color: '#777' }}>
                      <span>{L('Dosaggio:','Dosage:')} {s.current_dosage}</span>
                      <span>{L('Timing:','Timing:')} {s.timing}</span>
                      <span>{L('Giorni/settimana:','Days/week:')} {s.days_per_week}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── NUTRITION TAB ─── */}
        {activeTab === 'nutrition' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Il Mio Piano Nutrizionale','My Nutrition Plan')}</h2>
            <div style={{ background: '#141414', borderRadius: 16, padding: 48, textAlign: 'center', color: '#555' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
              <p>{L('Il tuo piano nutrizionale sarà visibile qui quando il coach lo assegnerà.','Your nutrition plan will appear here once assigned by your coach.')}</p>
            </div>
          </div>
        )}

        {/* ─── PHOTOS TAB ─── */}
        {activeTab === 'photos' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{L('Foto Progresso','Progress Photos')}</h2>
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>{L('Inserisci i link delle foto (carica su Google Drive o Dropbox e incolla il link)','Enter photo links (upload to Google Drive or Dropbox and paste the link)')}</p>
              <div style={gridStyle}>
                {[['front', L('Anteriore','Front')], ['back', L('Posteriore','Back')], ['right_side', L('Lato Destro','Right Side')], ['left_side', L('Lato Sinistro','Left Side')]].map(([k, label]) => (
                  <div key={k}>
                    <label style={labelStyle}>{label}</label>
                    <input placeholder="https://..." style={inputStyle} />
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 16, padding: '11px 28px', background: 'linear-gradient(135deg,#8B4513,#D2691E)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {L('Salva Foto','Save Photos')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
