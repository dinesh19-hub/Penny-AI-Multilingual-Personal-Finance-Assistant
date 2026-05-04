'use client';
import { useState, useEffect } from 'react';
import { getTransactions, getCategories, aiInsights, monthlyData } from '@/lib/data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Link from 'next/link';
import AddTransactionModal from '@/components/AddTransactionModal';

function StatCard({ icon, label, value, sub, color, change }) {
  return (
    <div className="glass stat-card" style={{ '--card-color': color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{icon}</div>
        {change && <span className={`badge ${change > 0 ? 'badge-green' : 'badge-red'}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}%</span>}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Poppins,sans-serif', color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1f3c', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>${p.value.toLocaleString()} {p.name}</div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTransactions(getTransactions());
      setCategories(getCategories());
      setLoading(false);
    }, 800);
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const getCatColor = (catKey) => categories.find(c => c.key === catKey)?.color || '#8899aa';
  const recent = transactions.slice(0, 5);

  if (loading) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ height: 140, borderRadius: 20 }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100 }}></div>)}
      </div>
      <div className="skeleton" style={{ height: 200 }}></div>
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>
            Good morning, <span className="glow-text">Dinesh</span> 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </p>
        </div>
        <button id="add-tx-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add</button>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(240,244,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Total Balance</div>
            <div className="balance-amount">${balance.toLocaleString('en', {minimumFractionDigits:2})}</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--green)' }}>Live · Synced just now</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.5)', marginBottom: 2 }}>Income</div>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '1rem' }}>+${totalIncome.toLocaleString('en',{minimumFractionDigits:2})}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.5)', marginBottom: 2 }}>Expenses</div>
              <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: '1rem' }}>-${totalExpense.toLocaleString('en',{minimumFractionDigits:2})}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
        <StatCard icon="💰" label="Monthly Income" value={`$${totalIncome.toLocaleString()}`} color="var(--green)" change={8.5} />
        <StatCard icon="💸" label="Monthly Expenses" value={`$${totalExpense.toLocaleString()}`} color="var(--red)" change={-5.2} />
        <StatCard icon="🎯" label="Savings Rate" value={`${savingsRate}%`} color="var(--blue)" sub="Target: 30%" />
        <StatCard icon="📊" label="Transactions" value={transactions.length} color="var(--purple)" sub="This month" />
      </div>

      {/* Chart + AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-title">Income vs Expense</div>
            <span className="badge badge-green">This Year</span>
          </div>
          <div className="chart-container" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#00e5a0" strokeWidth={2} fill="url(#gradIncome)" name="income" />
                <Area type="monotone" dataKey="expense" stroke="#ff4757" strokeWidth={2} fill="url(#gradExpense)" name="expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🧠</span> AI Insights
          </div>
          {aiInsights.map(insight => (
            <div key={insight.id} className={`insight-card ${insight.type}`}>
              <span style={{ fontSize: '1.1rem' }}>{insight.icon}</span>
              <span style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-header">
          <div className="section-title">Recent Transactions</div>
          <Link href="/transactions" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>View All →</Link>
        </div>
        {recent.map(tx => (
          <div key={tx.id} className="tx-row">
            <div className="cat-icon" style={{ background: `${getCatColor(tx.category)}20` }}>{tx.icon}</div>
            <div className="tx-info">
              <div className="tx-name">{tx.description}</div>
              <div className="tx-meta">{tx.category} · {tx.date}</div>
            </div>
            <div className={`tx-amount ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onAdd={() => { setTransactions(getTransactions()); setShowModal(false); }} />}
    </div>
  );
}
