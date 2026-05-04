'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
          <div className="logo-text" style={{ fontSize: '1.8rem', display: 'block', fontFamily: 'Poppins,sans-serif', fontWeight: 800, background: 'linear-gradient(135deg,#00e5a0,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Penny AI</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 6 }}>Your smart finance companion</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({...f, email: e.target.value})); setErrors(x => ({...x, email: ''})); }}
              style={errors.email ? { borderColor: 'var(--red)' } : {}}
            />
            {errors.email && <span style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{errors.email}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                className="input"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(f => ({...f, password: e.target.value})); setErrors(x => ({...x, password: ''})); }}
                style={{ paddingRight: 44, ...(errors.password ? { borderColor: 'var(--red)' } : {}) }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--blue)', cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          <button id="login-btn" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderTopColor: '#050a14' }}></span> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div className="divider" style={{ flex: 1, margin: 0 }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or continue with</span>
          <div className="divider" style={{ flex: 1, margin: 0 }}></div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button id="google-login" className="btn btn-secondary" style={{ flex: 1 }}>
            <span>🌐</span> Google
          </button>
          <button id="apple-login" className="btn btn-secondary" style={{ flex: 1 }}>
            <span>🍎</span> Apple
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.87rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
