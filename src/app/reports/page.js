'use client';
import { useState, useEffect } from 'react';
import { getTransactions, getCategories, monthlyData, spendingTrendData } from '@/lib/data';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1f3c', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || 'var(--blue)', fontWeight: 600 }}>${p.value?.toLocaleString()} {p.name}</div>
      ))}
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.6;
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ReportsPage() {
  const [txs, setTxs] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('trend');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setTimeout(() => { setTxs(getTransactions()); setCats(getCategories()); setLoading(false); }, 700);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    const data = txs.map(t => `${t.date},${t.description},${t.category},${t.amount}`).join('\n');
    const blob = new Blob([`Date,Description,Category,Amount\n${data}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'penny-ai-report.csv'; a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const catExpenses = cats.map(c => ({
    name: c.name, icon: c.icon, color: c.color,
    value: Math.abs(txs.filter(t => t.category === c.key && t.type === 'expense').reduce((s, t) => s + t.amount, 0)),
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  const totalExpense = catExpenses.reduce((s, c) => s + c.value, 0);

  const insights = [
    { icon: '📊', title: 'Top Category', desc: catExpenses[0] ? `${catExpenses[0].icon} ${catExpenses[0].name} ($${catExpenses[0].value.toFixed(2)})` : 'N/A', color: 'var(--blue)' },
    { icon: '📈', title: 'Highest Income Month', desc: 'June · $7,100', color: 'var(--green)' },
    { icon: '💡', title: 'Avg Monthly Spend', desc: `$${Math.round(monthlyData.reduce((s,m)=>s+m.expense,0)/monthlyData.length).toLocaleString()}`, color: 'var(--purple)' },
    { icon: '🎯', title: 'Best Savings Month', desc: 'March · 44% saved', color: 'var(--yellow)' },
  ];

  if (loading) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }}></div>)}
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Financial insights & analytics</p>
        </div>
        <button id="export-btn" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
          {exporting ? <><span className="spinner" style={{borderTopColor:'#050a14'}}></span> Exporting...</> : '⬇ Export CSV'}
        </button>
      </div>

      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} className="glass" style={{ padding: '16px 20px', borderLeft: `3px solid ${ins.color}` }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>{ins.icon}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{ins.title}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: ins.color }}>{ins.desc}</div>
          </div>
        ))}
      </div>

      {/* Chart toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ key: 'trend', label: '📈 Spending Trend' }, { key: 'monthly', label: '📊 Monthly Comparison' }].map(c => (
          <button key={c.key} id={`chart-${c.key}`} className={`chip ${activeChart === c.key ? 'active' : ''}`} onClick={() => setActiveChart(c.key)}>{c.label}</button>
        ))}
      </div>

      {/* Main chart */}
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-header">
          <div className="section-title">{activeChart === 'trend' ? 'Weekly Spending Trend' : 'Monthly Income vs Expense'}</div>
        </div>
        <div className="chart-container" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'trend' ? (
              <AreaChart data={spendingTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#00d4ff" strokeWidth={2} fill="url(#gradSpend)" name="spend" />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#556677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#00e5a0" radius={[4,4,0,0]} name="income" />
                <Bar dataKey="expense" fill="#ff4757" radius={[4,4,0,0]} name="expense" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Category Breakdown</div>
          {catExpenses.map(cat => (
            <div key={cat.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontSize: '0.87rem', fontWeight: 500 }}>{cat.name}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.87rem', color: cat.color }}>${cat.value.toFixed(2)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(cat.value / totalExpense) * 100}%`, background: cat.color }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Expense Split</div>
          <div style={{ position: 'relative', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catExpenses} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" labelLine={false} label={renderLabel}>
                  {catExpenses.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--red)' }}>${totalExpense.toFixed(0)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {catExpenses.slice(0, 4).map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }}></div>
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{c.name}</span>
                <span style={{ fontWeight: 600 }}>{((c.value / totalExpense) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
