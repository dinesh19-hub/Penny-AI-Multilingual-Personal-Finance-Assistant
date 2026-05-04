'use client';
import './globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '⊞', label: 'dashboard' },
  { href: '/transactions', icon: '↔', label: 'transactions' },
  { href: '/ai', icon: '✦', label: 'aiAssistant' },
  { href: '/reports', icon: '📈', label: 'reports' },
  { href: '/profile', icon: '◎', label: 'profile' },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isAuth = pathname === '/' || pathname === '/register';

  return (
    <html lang="en">
      <head>
        <title>Penny AI – Multilingual Finance Assistant</title>
        <meta name="description" content="Penny AI – Your smart multilingual personal finance assistant powered by AI. Track expenses, get insights, and manage your money smarter." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
      </head>
      <body>
        {isAuth ? (
          children
        ) : (
          <div className="app-layout">
            <Sidebar pathname={pathname} t={t} />
            <main className="main-content">{children}</main>
            <BottomNav pathname={pathname} t={t} />
          </div>
        )}
      </body>
    </html>
  );
}

function Sidebar({ pathname, t }) {
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="logo">
        <div className="logo-icon">💰</div>
        <span className="logo-text">Penny AI</span>
      </Link>
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {t(item.label)}
            {item.label === 'aiAssistant' && (
              <span className="nav-badge" style={{ marginLeft: 'auto' }}>AI</span>
            )}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: '1rem', margin: 0, border: 'none', boxShadow: 'none' }}>D</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Dinesh Kumar</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>dinesh@pennyai.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function BottomNav({ pathname, t }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{t(item.label).split(' ')[0]}</span>
        </Link>
      ))}
    </nav>
  );
}
