'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', language: 'en' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'var(--red)', 'var(--yellow)', 'var(--blue)', 'var(--green)'];

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const nextStep = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg,#00e5a0,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: 4 }}>Join Penny AI — finance made smart</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1,2].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? 'var(--green)' : 'var(--border)', transition: 'background 0.3s' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input id="reg-name" className="input" placeholder="Dinesh Kumar" value={form.name} onChange={e => { setForm(f=>({...f,name:e.target.value})); setErrors(x=>({...x,name:''})); }} style={errors.name?{borderColor:'var(--red)'}:{}} />
              {errors.name && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.name}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input id="reg-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => { setForm(f=>({...f,email:e.target.value})); setErrors(x=>({...x,email:''})); }} style={errors.email?{borderColor:'var(--red)'}:{}} />
              {errors.email && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.email}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Preferred Language</label>
              <select id="reg-lang" className="input" value={form.language} onChange={e => setForm(f=>({...f,language:e.target.value}))}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
              </select>
            </div>
            <button id="reg-next" className="btn btn-primary" style={{width:'100%',padding:14}} onClick={nextStep}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input id="reg-password" className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => { setForm(f=>({...f,password:e.target.value})); setErrors(x=>({...x,password:''})); }} style={errors.password?{borderColor:'var(--red)'}:{}} />
              {form.password && (
                <>
                  <div className="strength-bar">
                    {[1,2,3,4].map(i => <div key={i} className="strength-seg" style={{background: i <= strength ? strengthColors[strength] : ''}}></div>)}
                  </div>
                  <span style={{fontSize:'0.78rem',color:strengthColors[strength]}}>{strengthLabels[strength]}</span>
                </>
              )}
              {errors.password && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.password}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input id="reg-confirm" className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => { setForm(f=>({...f,confirm:e.target.value})); setErrors(x=>({...x,confirm:''})); }} style={errors.confirm?{borderColor:'var(--red)'}:{}} />
              {errors.confirm && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.confirm}</span>}
            </div>
            <div style={{display:'flex',gap:10}}>
              <button type="button" id="reg-back" className="btn btn-ghost" style={{flex:0.5}} onClick={()=>setStep(1)}>← Back</button>
              <button type="submit" id="reg-submit" className="btn btn-primary" style={{flex:1,padding:14}} disabled={loading}>
                {loading ? <><span className="spinner" style={{borderTopColor:'#050a14'}}></span> Creating...</> : '🚀 Create Account'}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.87rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/" style={{color:'var(--green)',fontWeight:600,textDecoration:'none'}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
