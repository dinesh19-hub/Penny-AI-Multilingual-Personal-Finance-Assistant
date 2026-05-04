'use client';
import { useState } from 'react';
import { getCategories, addTransaction } from '@/lib/data';

const EXPENSE_ICONS = { food: '🍽️', shopping: '🛍️', transport: '🚗', entertainment: '🎬', health: '💊', utilities: '⚡', other: '📦' };
const INCOME_ICONS = { salary: '💼', freelance: '💻', investment: '📈', other: '💰' };

export default function AddTransactionModal({ onClose, onAdd }) {
  const cats = getCategories();
  const [form, setForm] = useState({
    description: '', amount: '', category: cats[0]?.key || '', type: 'expense',
    date: new Date().toISOString().split('T')[0], icon: cats[0]?.icon || '💸',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const expenseCats = cats.filter(c => !['salary','freelance'].includes(c.key));
  const incomeCats = cats.filter(c => ['salary','freelance'].includes(c.key));
  const currentCats = form.type === 'expense' ? expenseCats : incomeCats;

  const handleCatChange = (key) => {
    const cat = cats.find(c => c.key === key);
    setForm(f => ({ ...f, category: key, icon: cat?.icon || '💸' }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    addTransaction({
      ...form,
      amount: form.type === 'expense' ? -Math.abs(+form.amount) : Math.abs(+form.amount),
    });
    onAdd();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Add Transaction</div>

        {/* Type toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 10, padding: 4, marginBottom: 20, border: '1px solid var(--border)' }}>
          {['expense', 'income'].map(t => (
            <button key={t} id={`type-${t}`} onClick={() => {
              const firstCat = t === 'expense' ? expenseCats[0] : incomeCats[0];
              setForm(f => ({ ...f, type: t, category: firstCat?.key || '', icon: firstCat?.icon || '💸' }));
            }}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.87rem', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s',
                background: form.type === t ? (t === 'expense' ? 'var(--red)' : 'var(--green)') : 'transparent',
                color: form.type === t ? (t === 'expense' ? 'white' : '#050a14') : 'var(--text-muted)',
              }}>
              {t === 'expense' ? '↓ Expense' : '↑ Income'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">Description</label>
            <input id="tx-desc" className="input" placeholder="e.g. Coffee at Starbucks" value={form.description} onChange={e => { setForm(f=>({...f,description:e.target.value})); setErrors(x=>({...x,description:''})); }} style={errors.description?{borderColor:'var(--red)'}:{}} />
            {errors.description && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.description}</span>}
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Amount ($)</label>
              <input id="tx-amount" className="input" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => { setForm(f=>({...f,amount:e.target.value})); setErrors(x=>({...x,amount:''})); }} style={errors.amount?{borderColor:'var(--red)'}:{}} />
              {errors.amount && <span style={{color:'var(--red)',fontSize:'0.8rem'}}>{errors.amount}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input id="tx-date" className="input" type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {currentCats.map(cat => (
                <button type="button" key={cat.key} id={`cat-select-${cat.key}`} onClick={() => handleCatChange(cat.key)}
                  className={`chip ${form.category === cat.key ? 'active-green' : ''}`}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" id="save-tx-btn" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <><span className="spinner" style={{borderTopColor:'#050a14'}}></span> Adding...</> : '+ Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
