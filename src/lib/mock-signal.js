import { generateSignal } from './signal-engine';

const mockStrategies = [
  {
    id: 'macro_trend_alignment',
    name: 'Macro Trend Alignment',
    type: 'macro',
    direction: 'LONG',
    weight: 1.0,
    status: 'active',
    confidence_boost: 8,
    rationale: 'DXY falling, USDT.D falling, bullish risk-on context',
  },
  {
    id: 'exchange_outflow_accumulation',
    name: 'Exchange Outflow Accumulation',
    type: 'onchain',
    direction: 'LONG',
    weight: 1.2,
    status: 'active',
    confidence_boost: 10,
    rationale: 'Whale netflow negative with rising volume',
  },
  {
    id: 'retail_crowd_bias',
    name: 'Retail Crowd Bias',
    type: 'anti_trade',
    direction: 'LONG',
    weight: 1.5,
    status: 'active',
    confidence_boost: 12,
    rationale: 'Retail crowd heavily shorted; short squeeze potential',
  },
  {
    id: 'order_block_retest',
    name: 'Order Block Retest',
    type: 'structure',
    direction: 'LONG',
    weight: 1.3,
    status: 'active',
    confidence_boost: 11,
    rationale: '1H OB retest and liquidity sweep',
  },
  {
    id: 'funding_rate_pressure',
    name: 'Funding Rate Pressure',
    type: 'anti_trade',
    direction: 'SHORT',
    weight: 1.1,
    status: 'weak',
    confidence_boost: 2,
    rationale: 'Funding positive but not extreme; partial counter-signal',
  },
];

export const mockSignal = generateSignal({
  symbol: 'BTCUSDT',
  timeframe: '1H',
  exchange: 'Bybit',
  currentPrice: 79795.14,
  atr14: 180,
  W_macro: 1,
  W_fund: 1,
  W_anti: 2,
  W_TA: 1,
  strategies: mockStrategies,
});

export default mockSignal;
