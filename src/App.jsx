import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import SignalCard from './components/SignalCard';
import { mockSignal } from './lib/mock-signal';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'market', label: 'Market' },
  { key: 'settings', label: 'Settings' },
];

const defaultSettings = {
  defaultExchange: 'Bybit',
  signalMode: 'AUTO',
  maxRisk: 1.5,
  aiSignalEnabled: true,
  useTestnet: true,
  apiKey: '',
  apiSecret: '',
  msgTemplate: '🚀 ALERT: {name} ({ticker})\nDirection: {direction}\nConfidence: {confidence}%\nPrice: ${price}',
  tgChannels: [
    { id: 1, name: 'VIP Signals', chatId: '@vip_signals', botToken: '***1234' },
  ],
};

function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const marketRows = [
    { id: 'BTCUSDT', name: 'Bitcoin', ticker: 'BTC', price: '79795.14', change: '+2.41%', signal: 'Bullish', momentum: 'Strong' },
    { id: 'ETHUSDT', name: 'Ethereum', ticker: 'ETH', price: '3412.22', change: '+1.76%', signal: 'Bullish', momentum: 'Moderate' },
    { id: 'SOLUSDT', name: 'Solana', ticker: 'SOL', price: '162.34', change: '-0.31%', signal: 'Neutral', momentum: 'Soft' },
  ];

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020817', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: 240,
            background: '#0f172a',
            borderRight: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '24px 18px',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Trading Bot</div>
          <nav style={{ display: 'grid', gap: 8 }}>
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={`/${item.key === 'dashboard' ? '' : item.key}`}
                onClick={() => setSelectedTab(item.key)}
                style={{
                  textDecoration: 'none',
                  color: selectedTab === item.key ? '#fff' : '#cbd5e1',
                  background: selectedTab === item.key ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: '1px solid transparent',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 24 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <div style={{ display: 'grid', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                      <div style={{ color: '#94a3b8', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>Portfolio</div>
                      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>$1,245,000</div>
                      <div style={{ color: '#4ade80', marginTop: 6 }}>+5.4% this week</div>
                    </div>

                    <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                      <div style={{ color: '#94a3b8', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>Tracked Assets</div>
                      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>{marketRows.length}</div>
                      <div style={{ color: '#94a3b8', marginTop: 6 }}>2 Crypto / 1 Asset watch</div>
                    </div>

                    <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                      <div style={{ color: '#94a3b8', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>AI Confidence</div>
                      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>{mockSignal.signal.confidence_percent}%</div>
                      <div style={{ color: '#38bdf8', marginTop: 6 }}>{mockSignal.signal.direction}</div>
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                    <SignalCard signal={mockSignal} />
                  </div>
                </div>
              }
            />

            <Route
              path="/market"
              element={
                <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                  <h2 style={{ marginTop: 0 }}>Market Explorer</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Asset</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>24h</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Signal</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Momentum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketRows.map((row) => (
                        <tr key={row.id} style={{ borderTop: '1px solid rgba(148,163,184,0.2)' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <strong>{row.name}</strong> <span style={{ color: '#94a3b8' }}>{row.ticker}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>${row.price}</td>
                          <td style={{ padding: '12px 8px', color: row.change.startsWith('+') ? '#4ade80' : '#f87171' }}>{row.change}</td>
                          <td style={{ padding: '12px 8px' }}>{row.signal}</td>
                          <td style={{ padding: '12px 8px' }}>{row.momentum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            />

            <Route
              path="/settings"
              element={
                <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid rgba(148,163,184,0.2)' }}>
                  <h2 style={{ marginTop: 0 }}>System Settings</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                      <h3 style={{ marginTop: 0 }}>AI Signal Engine</h3>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        <span>Default Exchange</span>
                        <select
                          value={settings.defaultExchange}
                          onChange={(e) => handleSettingChange('defaultExchange', e.target.value)}
                          style={{ padding: 10, borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)' }}
                        >
                          <option value="Bybit">Bybit</option>
                          <option value="Binance">Binance</option>
                          <option value="OKX">OKX</option>
                        </select>
                      </label>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        <span>Signal Mode</span>
                        <select
                          value={settings.signalMode}
                          onChange={(e) => handleSettingChange('signalMode', e.target.value)}
                          style={{ padding: 10, borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)' }}
                        >
                          <option value="AUTO">Auto</option>
                          <option value="MANUAL">Manual</option>
                          <option value="WATCH">Watch only</option>
                        </select>
                      </label>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        <span>Max Risk per Trade (%)</span>
                        <input
                          type="number"
                          value={settings.maxRisk}
                          onChange={(e) => handleSettingChange('maxRisk', Number(e.target.value))}
                          style={{ padding: 10, borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)' }}
                        />
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <input
                          type="checkbox"
                          checked={settings.aiSignalEnabled}
                          onChange={(e) => handleSettingChange('aiSignalEnabled', e.target.checked)}
                        />
                        Enable AI Signal Generation
                      </label>

                      <button style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none', background: '#38bdf8', color: '#082f49', fontWeight: 700 }}>
                        Generate Test Signal
                      </button>
                    </div>

                    <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                      <h3 style={{ marginTop: 0 }}>Exchange API</h3>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        <span>API Key</span>
                        <input
                          type="password"
                          value={settings.apiKey}
                          onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                          placeholder="Enter Binance / Bybit key"
                          style={{ padding: 10, borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)' }}
                        />
                      </label>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        <span>Secret</span>
                        <input
                          type="password"
                          value={settings.apiSecret}
                          onChange={(e) => handleSettingChange('apiSecret', e.target.value)}
                          placeholder="Enter secret key"
                          style={{ padding: 10, borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)' }}
                        />
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <input
                          type="checkbox"
                          checked={settings.useTestnet}
                          onChange={(e) => handleSettingChange('useTestnet', e.target.checked)}
                        />
                        Use Testnet
                      </label>

                      <button style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#052e16', fontWeight: 700 }}>
                        Connect Exchange
                      </button>
                    </div>

                    <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                      <h3 style={{ marginTop: 0 }}>Telegram Integrations</h3>
                      <div style={{ display: 'grid', gap: 10 }}>
                        {settings.tgChannels.map((ch) => (
                          <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: '#020817', border: '1px solid rgba(148,163,184,0.2)' }}>
                            <div>
                              <strong>{ch.name}</strong>
                              <div style={{ color: '#94a3b8', fontSize: 12 }}>{ch.chatId}</div>
                            </div>
                            <span style={{ color: '#4ade80' }}>OK</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                      <h3 style={{ marginTop: 0 }}>Message Templates</h3>
                      <textarea
                        rows="5"
                        value={settings.msgTemplate}
                        onChange={(e) => handleSettingChange('msgTemplate', e.target.value)}
                        style={{ width: '100%', borderRadius: 8, background: '#020817', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.2)', padding: 12, resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
