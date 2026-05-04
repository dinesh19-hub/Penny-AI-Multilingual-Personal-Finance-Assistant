'use client';
import { useState, useRef, useEffect } from 'react';
import { aiSuggestedPrompts, aiResponses } from '@/lib/data';

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin: '2px 0' }}></p>;
  });
}

export default function AIPage() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: "👋 Hi! I'm **Penny**, your AI finance assistant. I can help you analyze your spending, find saving opportunities, and give you personalized financial advice. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const getResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('spend') || lower.includes('spent')) return aiResponses.spend();
    if (lower.includes('save') || lower.includes('saving')) return aiResponses.save();
    if (lower.includes('income') || lower.includes('earn')) return aiResponses.income();
    return aiResponses.default(msg);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const aiMsg = { id: Date.now() + 1, role: 'ai', text: getResponse(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, aiMsg]);
    setIsTyping(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  const toggleRecording = () => {
    setRecording(r => !r);
    if (!recording) {
      setTimeout(() => {
        setRecording(false);
        sendMessage('Analyze my spending this month');
      }, 2000);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', gap: 0 }}>
      {/* Header */}
      <div style={{ padding: '0 0 16px', borderBottom: '1px solid var(--border)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}>✦</div>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>Penny <span className="glow-blue">AI</span></h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--green)' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }}></span> Online · Ready to help
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
            {msg.role === 'ai' && (
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>✦</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className={`chat-bubble ${msg.role}`}>
                {formatMessage(msg.text)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>✦</div>
            <div className="chat-bubble ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 18px' }}>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div style={{ padding: '12px 0' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Prompts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {aiSuggestedPrompts.map((p, i) => (
              <button key={i} id={`prompt-${i}`} className="chip" onClick={() => sendMessage(p)} style={{ fontSize: '0.8rem' }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 16px', transition: 'border-color 0.3s' }}
            onFocus={() => {}} ref={r => { if (r) { const inp = r.querySelector('textarea'); if (inp) { r.style.borderColor = '#00d4ff'; r.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; } } }}
          >
            <textarea
              id="ai-input"
              placeholder="Ask Penny anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: 'Inter,sans-serif', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
            />
            <button
              id="ai-send"
              className="btn btn-primary"
              style={{ padding: '8px 16px', borderRadius: 10, minWidth: 'auto' }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
            >→</button>
          </div>
          <button id="ai-mic" className="mic-btn" onClick={toggleRecording} style={{ flexShrink: 0, width: 44, height: 44 }} title={recording ? 'Recording...' : 'Voice input'}>
            {recording ? '⏹' : '🎤'}
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>Penny AI · Responses are generated based on your financial data</p>
      </div>
    </div>
  );
}
