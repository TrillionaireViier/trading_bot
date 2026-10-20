import { clampConfidence, getSignalDirectionFromScore } from './signal-types';

const getDirectionWeight = (direction) => {
  if (direction === 'LONG') return 1;
  if (direction === 'SHORT') return -1;
  return 0;
};

const buildLevels = (currentPrice, direction, atr14) => {
  const risk = 1.2 * atr14;

  if (direction === 'LONG') {
    const entry = currentPrice;
    const stopLoss = entry - risk;
    const tp1 = entry + (entry - stopLoss);
    const tp2 = entry + 2 * (entry - stopLoss);
    const tp3 = entry + 3.5 * (entry - stopLoss);

    return {
      entry,
      stop_loss: stopLoss,
      take_profit_1: tp1,
      take_profit_2: tp2,
      take_profit_3: tp3,
      risk_reward_ratio: '1:3.5',
    };
  }

  if (direction === 'SHORT') {
    const entry = currentPrice;
    const stopLoss = entry + risk;
    const tp1 = entry - (stopLoss - entry);
    const tp2 = entry - 2 * (stopLoss - entry);
    const tp3 = entry - 3.5 * (stopLoss - entry);

    return {
      entry,
      stop_loss: stopLoss,
      take_profit_1: tp1,
      take_profit_2: tp2,
      take_profit_3: tp3,
      risk_reward_ratio: '1:3.5',
    };
  }

  return {
    entry: currentPrice,
    stop_loss: currentPrice,
    take_profit_1: currentPrice,
    take_profit_2: currentPrice,
    take_profit_3: currentPrice,
    risk_reward_ratio: '1:0',
  };
};

const resolveStrategyScore = (strategy) => {
  if (strategy.status === 'inactive') return 0;

  const weight = strategy.status === 'weak' ? strategy.weight * 0.5 : strategy.weight;
  const directionWeight = getDirectionWeight(strategy.direction);

  if (strategy.direction === 'NEUTRAL') return 0;

  return weight * directionWeight;
};

export function generateSignal({
  W_macro = 0,
  W_fund = 0,
  W_anti = 0,
  W_TA = 0,
  strategies = [],
  currentPrice = 0,
  atr14 = 1,
  symbol = 'BTCUSDT',
  timeframe = '1H',
  exchange = 'Bybit',
}) {
  const strategyScore = strategies.reduce((sum, strategy) => {
    return sum + resolveStrategyScore(strategy);
  }, 0);

  const totalScore = W_macro + W_fund + (W_anti * 1.5) + W_TA + strategyScore;
  const direction = getSignalDirectionFromScore(totalScore);
  const confidence = clampConfidence(totalScore);
  const levels = buildLevels(currentPrice, direction, atr14);

  return {
    symbol,
    timeframe,
    exchange,
    signal: {
      direction,
      confidence_percent: Math.round(confidence),
      current_price: currentPrice,
      entry_price: levels.entry,
      stop_loss: levels.stop_loss,
      take_profit_1: levels.take_profit_1,
      take_profit_2: levels.take_profit_2,
      take_profit_3: levels.take_profit_3,
      risk_reward_ratio: levels.risk_reward_ratio,
    },
    strategies,
    rationale: {
      macro: W_macro > 0 ? 'Bullish' : W_macro < 0 ? 'Bearish' : 'Neutral',
      anti_trade_bias:
        W_anti > 0
          ? 'Short Squeeze Potential'
          : W_anti < 0
            ? 'Crowd Pressure Against Trend'
            : 'Balanced Crowd Sentiment',
      technical_trigger:
        direction === 'LONG'
          ? 'Bullish structure + reclaimed liquidity zone'
          : direction === 'SHORT'
            ? 'Bearish structure + rejected liquidity zone'
            : 'No clear directional trigger',
    },
  };
}

export default generateSignal;
