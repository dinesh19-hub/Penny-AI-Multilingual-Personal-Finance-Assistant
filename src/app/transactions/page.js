'use client';
import { useState, useEffect } from 'react';
import { getTransactions, getCategories, addTransaction, deleteTransaction } from '@/lib/data';
import AddTransactionModal from '@/components/AddTransactionModal';

export default function TransactionsPage() {
  const [txs, setTxs] = useState([]);
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setTxs(getTransactions());
    setCats(getCategories());
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 600); }, []);

  const filtered = txs
    .filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCat === 'all' || t.category === filterCat;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
      return 0;
    });

  const getCat = (key) => cats.find(c => c.key === key);

  const handleDelete = (id) => {
    deleteTransaction(id);
    setTxs(getTransactions());
    setDeleteId(null);
  };

  if (loading) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 70, borderRadius: 12 }}></div>)}
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{filtered.length} entries found</p>
        </div>
        <button id="add-tx-page-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Transaction</button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
        <input id="tx-search" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>✕</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'income', 'expense'].map(type => (
          <button key={type} id={`filter-${type}`} className={`chip ${filterType === type ? 'active' : ''}`} onClick={() => setFilterType(type)}>
            {type === 'income' ? '↑' : type === 'expense' ? '↓' : '⊕'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <div style={{ height: 20, width: 1, background: 'var(--border)' }}></div>
        <select id="filter-cat" className="input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {cats.map(c => <option key={c.key} value={c.key}>{c.icon} {c.name}</option>)}
        </select>
        <select id="sort-by" className="input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Total Income', val: filtered.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0), color: 'var(--green)' },
          { label: 'Total Expense', val: Math.abs(filtered.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)), color: 'var(--red)' },
          { label: 'Net Balance', val: filtered.reduce((s,t)=>s+t.amount,0), color: 'var(--blue)' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 700, color: s.color, fontSize: '1.1rem' }}>
              {s.val >= 0 ? '+' : ''}{s.val.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="glass" style={{ padding: '8px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</div>
            <div>No transactions found</div>
          </div>
        ) : filtered.map(tx => {
          const cat = getCat(tx.category);
          return (
            <div key={tx.id} className="tx-row" style={{ justifyContent: 'space-between' }}>
              <div className="cat-icon" style={{ background: `${cat?.color || '#8899aa'}20` }}>{tx.icon}</div>
              <div className="tx-info">
                <div className="tx-name">{tx.description}</div>
                <div className="tx-meta">{cat?.icon} {cat?.name || tx.category} · {tx.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={`tx-amount ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </div>
                <button
                  onClick={() => setDeleteId(tx.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', opacity: 0.5, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0.5}
                >🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
              <div className="modal-title" style={{ marginBottom: 8 }}>Delete Transaction?</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>This action cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button id="confirm-delete" className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onAdd={() => { setTxs(getTransactions()); setShowModal(false); }} />}
    </div>
  );
}
