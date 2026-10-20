const formatPrice = (value) => {
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Stat = ({ label, value }) => (
  <div
    style={{
      borderRadius: 12,
      background: 'rgba(148,163,184,0.08)',
      border: '1px solid rgba(148,163,184,0.15)',
      padding: 12,
      minHeight: 80,
    }}
  >
    <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700 }}>{value}</div>
  </div>
);

const PriceBox = ({ label, value }) => (
  <div
    style={{
      borderRadius: 12,
      background: 'rgba(15,118,110,0.12)',
      border: '1px solid rgba(45,212,191,0.25)',
      padding: 12,
      minHeight: 80,
    }}
  >
    <div style={{ fontSize: 11, color: '#7dd3fc', letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{value}</div>
  </div>
);

export default function SignalCard({ signal }) {
  const directionColor =
    signal.signal.direction === 'LONG'
      ? '#16a34a'
      : signal.signal.direction === 'SHORT'
        ? '#dc2626'
        : '#64748b';

  return (
    <div
      style={{
        width: '100%',
        background: '#0f172a',
        color: '#e2e8f0',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 20,
        padding: 22,
        boxShadow: '0 24px 60px rgba(15,23,42,0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ color: '#94a3b8', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {signal.exchange} • {signal.timeframe}
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: 30 }}>{signal.symbol}</h2>
        </div>

        <div
          style={{
            background: directionColor,
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {signal.signal.direction}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <Stat label="Confidence" value={`${signal.signal.confidence_percent}%`} />
        <Stat label="Entry" value={formatPrice(signal.signal.entry_price)} />
        <Stat label="SL" value={formatPrice(signal.signal.stop_loss)} />
        <Stat label="RR" value={signal.signal.risk_reward_ratio} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <PriceBox label="TP1" value={formatPrice(signal.signal.take_profit_1)} />
        <PriceBox label="TP2" value={formatPrice(signal.signal.take_profit_2)} />
        <PriceBox label="TP3" value={formatPrice(signal.signal.take_profit_3)} />
      </div>

      <div
        style={{
          marginBottom: 18,
          padding: 16,
          borderRadius: 12,
          background: 'rgba(15, 118, 110, 0.12)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 1.2, color: '#7dd3fc', textTransform: 'uppercase' }}>Rationale</div>
        <div style={{ marginTop: 8, lineHeight: 1.6 }}>
          <div><strong>Macro:</strong> {signal.rationale.macro}</div>
          <div><strong>Anti-trade:</strong> {signal.rationale.anti_trade_bias}</div>
          <div><strong>Technical:</strong> {signal.rationale.technical_trigger}</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, letterSpacing: 1.2, color: '#94a3b8', textTransform: 'uppercase' }}>Active strategies</div>

        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {signal.strategies.map((strategy) => (
            <div
              key={strategy.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(15,23,42,0.45)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{strategy.name}</div>
                <div style={{ fontSize: 12, color: '#a5b4fc' }}>{strategy.type}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    background:
                      strategy.direction === 'LONG'
                        ? 'rgba(22,163,74,0.15)'
                        : strategy.direction === 'SHORT'
                          ? 'rgba(220,38,38,0.15)'
                          : 'rgba(148,163,184,0.15)',
                    color:
                      strategy.direction === 'LONG'
                        ? '#4ade80'
                        : strategy.direction === 'SHORT'
                          ? '#f87171'
                          : '#cbd5e1',
                    padding: '6px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {strategy.direction}
                </div>

                <div style={{ fontSize: 12, color: '#94a3b8' }}>{strategy.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
