'use client';
import { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/data';

const COLORS = ['#00e5a0','#00d4ff','#7c3aed','#f472b6','#ff4757','#fdcb6e','#55efc4','#74b9ff','#a29bfe','#fd79a8'];
const ICONS = ['🍽️','🛍️','🚗','🎬','💊','⚡','💼','💻','🏠','✈️','📚','💪','🎮','🎵','☕','🐾','💐','⛽','🎁','🏥'];

function CategoryModal({ cat, onClose, onSave }) {
  const [form, setForm] = useState(cat || { name: '', key: '', icon: '🍽️', color: '#00e5a0', budget: 0 });

  const handleSave = () => {
    if (!form.name.trim()) return;
    const key = form.key || form.name.toLowerCase().replace(/\s+/g, '_');
    onSave({ ...form, key });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{cat ? 'Edit Category' : 'Add Category'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Icon picker */}
          <div className="input-group">
            <label className="input-label">Icon</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 6 }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm(f=>({...f,icon:ic}))}
                  style={{ fontSize: '1.2rem', padding: 6, borderRadius: 8, border: form.icon === ic ? '2px solid var(--blue)' : '1px solid var(--border)', background: form.icon === ic ? 'var(--blue-dim)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Name</label>
            <input id="cat-name" className="input" placeholder="e.g. Groceries" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>

          <div className="input-group">
            <label className="input-label">Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(f=>({...f,color:c}))}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid white' : '3px solid transparent', cursor: 'pointer', transition: 'transform 0.2s', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }}>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Monthly Budget ($)</label>
            <input id="cat-budget" className="input" type="number" min="0" placeholder="0" value={form.budget} onChange={e=>setForm(f=>({...f,budget:+e.target.value}))} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button id="cat-save" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Category</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | cat object
  const [deleteId, setDeleteId] = useState(null);

  const load = () => { setCats(getCategories()); setLoading(false); };
  useEffect(() => { setTimeout(load, 500); }, []);

  const handleSave = (form) => {
    if (modal === 'add') addCategory(form);
    else updateCategory(form.id, form);
    setCats(getCategories());
    setModal(null);
  };

  const handleDelete = (id) => {
    deleteCategory(id);
    setCats(getCategories());
    setDeleteId(null);
  };

  if (loading) return (
    <div className="page">
      <div className="cat-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 130 }}></div>)}
      </div>
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Categories</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cats.length} categories configured</p>
        </div>
        <button id="add-cat-btn" className="btn btn-primary" onClick={() => setModal('add')}>+ Add Category</button>
      </div>

      {/* Category grid */}
      <div className="cat-grid">
        {cats.map(cat => (
          <div key={cat.id} className="glass" style={{ padding: 20, cursor: 'pointer', transition: 'var(--transition)', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cat.color }}></div>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 12 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{cat.name}</div>
            {cat.budget > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Budget: ${cat.budget}/mo</div>
            )}
            {cat.budget === 0 && <div className="badge badge-green" style={{ marginBottom: 8, fontSize: '0.7rem' }}>Income</div>}
            <div style={{ display: 'flex', gap: 6 }}>
              <button id={`edit-cat-${cat.id}`} className="btn btn-ghost" style={{ flex: 1, padding: '6px', fontSize: '0.78rem' }} onClick={() => setModal(cat)}>✏️ Edit</button>
              <button id={`del-cat-${cat.id}`} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '0.78rem' }} onClick={() => setDeleteId(cat.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗂️</div>
              <div className="modal-title" style={{ marginBottom: 8 }}>Delete Category?</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>This cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button id="confirm-del-cat" className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {modal && <CategoryModal cat={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
