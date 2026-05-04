'use client';
import { useState, useEffect } from 'react';
import { getUser, updateUser } from '@/lib/data';
import { useRouter } from 'next/navigation';
import i18n from '@/lib/i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

function Toggle({ value, onChange }) {
  return <div className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}></div>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setUser(getUser()); setLoading(false); }, 500);
  }, []);

  const handleToggle = (key) => {
    const updated = updateUser({ [key]: !user[key] });
    setUser(updated);
    if (key === 'darkMode') {
      // In real app would toggle CSS vars; here we just show feedback
    }
  };

  const handleLanguage = (lang) => {
    const updated = updateUser({ language: lang });
    setUser(updated);
    i18n.changeLanguage(lang);
  };

  const handleCurrency = (cur) => {
    const updated = updateUser({ currency: cur });
    setUser(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    updateUser(editForm);
    setUser(getUser());
    setSaving(false); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    setTimeout(() => router.push('/'), 500);
  };

  if (loading || !user) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ height: 180, borderRadius: 20 }}></div>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }}></div>)}
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Profile</h1>
        {saved && <span className="badge badge-green">✓ Saved!</span>}
      </div>

      {/* Profile card */}
      <div className="profile-header">
        <div className="avatar">{user.name.charAt(0)}</div>
        <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>{user.name}</div>
        <div style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.87rem' }}>{user.email}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          <span className="badge badge-blue">{CURRENCIES.find(c=>c.code===user.currency)?.symbol} {user.currency}</span>
          <span className="badge badge-green">{LANGUAGES.find(l=>l.code===user.language)?.flag} {LANGUAGES.find(l=>l.code===user.language)?.label}</span>
        </div>
        <button id="edit-profile-btn" className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => { setEditForm({ name: user.name, email: user.email }); setEditing(true); }}>
          ✏️ Edit Profile
        </button>
      </div>

      {/* Language */}
      <div className="glass" style={{ padding: '4px 20px' }}>
        <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>🌍 Language</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <button key={l.code} id={`lang-${l.code}`} className={`chip ${user.language === l.code ? 'active-green' : ''}`} onClick={() => handleLanguage(l.code)}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>💱 Currency</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CURRENCIES.map(c => (
              <button key={c.code} id={`cur-${c.code}`} className={`chip ${user.currency === c.code ? 'active' : ''}`} onClick={() => handleCurrency(c.code)}>
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        {[
          { key: 'darkMode', icon: '🌙', label: 'Dark Mode', sub: 'Use dark theme (default)' },
          { key: 'notifications', icon: '🔔', label: 'Notifications', sub: 'Budget alerts & insights' },
        ].map(item => (
          <div key={item.key} className="setting-row" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div>
                <div className="setting-text">{item.label}</div>
                <div className="setting-sub">{item.sub}</div>
              </div>
            </div>
            <Toggle value={user[item.key]} onChange={() => handleToggle(item.key)} />
          </div>
        ))}
      </div>

      {/* Security / other settings */}
      <div className="glass" style={{ padding: '4px 20px' }}>
        {[
          { icon: '🔐', label: 'Change Password', sub: 'Last changed 30 days ago' },
          { icon: '🔑', label: 'Two-Factor Auth', sub: 'Add extra security layer' },
          { icon: '📲', label: 'Connected Apps', sub: 'Manage linked applications' },
          { icon: '🗑️', label: 'Delete Account', sub: 'Permanently remove your data', danger: true },
        ].map((item, i) => (
          <div key={i} className="setting-row" style={{ padding: '14px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div>
                <div className="setting-text" style={{ color: item.danger ? 'var(--red)' : 'var(--text-primary)' }}>{item.label}</div>
                <div className="setting-sub">{item.sub}</div>
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button id="logout-btn" className="btn btn-danger" style={{ width: '100%', padding: 14 }} onClick={() => setShowLogout(true)}>
        → Logout
      </button>

      {/* Edit modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Edit Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input id="edit-name" className="input" value={editForm.name || ''} onChange={e => setEditForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input id="edit-email" className="input" type="email" value={editForm.email || ''} onChange={e => setEditForm(f=>({...f,email:e.target.value}))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
                <button id="save-profile-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="spinner" style={{borderTopColor:'#050a14'}}></span> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogout && (
        <div className="modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👋</div>
            <div className="modal-title" style={{ marginBottom: 8 }}>Leaving so soon?</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 24 }}>You will be logged out of Penny AI.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowLogout(false)}>Stay</button>
              <button id="confirm-logout" className="btn btn-danger" style={{ flex: 1 }} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
