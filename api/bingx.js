import crypto from 'node:crypto';

const getBaseUrl = (market) => {
  if (String(market).toLowerCase() === 'swap') {
    return 'https://open-api.bingx.com/openApi/swap/v2/trade';
  }
  return 'https://open-api.bingx.com/openApi/spot/v2/trade';
};

const normalizeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizePercentArray = (values, fallback = []) => {
  if (Array.isArray(values)) {
    return values
      .map((v) => normalizeNumber(v, NaN))
      .filter((v) => Number.isFinite(v));
  }

  if (typeof values === 'string') {
    return values
      .split(',')
      .map((v) => normalizeNumber(v.trim(), NaN))
      .filter((v) => Number.isFinite(v));
  }

  return fallback;
};

const buildStrategyPlan = ({ symbol, side, quantity, price, takeProfit, stopLoss, conditionalOrders }) => {
  const entryPrice = normalizeNumber(price, 0);
  const levels = [];

  if (entryPrice > 0) {
    for (const tp of normalizePercentArray(takeProfit, [])) {
      if (tp > 1) {
        levels.push({
          type: 'TAKE_PROFIT',
          side: 'SELL',
          triggerPrice: Number((entryPrice * tp).toFixed(8)),
          ratio: tp,
          quantity
        });
      }
    }

    for (const sl of normalizePercentArray(stopLoss, [])) {
      if (sl > 0 && sl < 1) {
        levels.push({
          type: 'STOP_LOSS',
          side: 'BUY',
          triggerPrice: Number((entryPrice * sl).toFixed(8)),
          ratio: sl,
          quantity
        });
      }
    }
  }

  const customOrders = Array.isArray(conditionalOrders) ? conditionalOrders : [];

  return {
    symbol,
    side,
    quantity,
    entryPrice,
    plannedLevels: levels,
    customOrders,
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = req.body || {};
    const apiKey = body.apiKey || process.env.BINGX_API_KEY;
    const apiSecret = body.apiSecret || process.env.BINGX_API_SECRET;
    const market = String(body.market || 'spot').toLowerCase();
    const symbol = String(body.symbol || 'BTCUSDT').toUpperCase();
    const side = String(body.side || 'BUY').toUpperCase();
    const quantity = normalizeNumber(body.quantity, 0.01);
    const price = body.price ? normalizeNumber(body.price, 0) : 0;

    if (!apiKey || !apiSecret) {
      return res.status(400).json({ error: 'Missing BingX API credentials. Set BINGX_API_KEY and BINGX_API_SECRET on Vercel or pass them in the request.' });
    }

    if (!symbol || !Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid symbol or quantity.' });
    }

    const baseUrl = getBaseUrl(market);
    const timestamp = Date.now();
    const params = {
      symbol,
      side,
      quantity: quantity.toString(),
      recvWindow: '5000',
      timestamp: String(timestamp),
    };

    if (price > 0) {
      params.price = price.toString();
    }

    const query = new URLSearchParams(params).toString();
    const signature = crypto.createHmac('sha256', apiSecret).update(query).digest('hex');

    const response = await fetch(`${baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-BINGX-APIKEY': apiKey,
      },
      body: new URLSearchParams({
        ...params,
        signature,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.msg || data?.message || 'BingX request failed',
        raw: data,
      });
    }

    const strategy = buildStrategyPlan({
      symbol,
      side,
      quantity,
      price,
      takeProfit: body.takeProfit,
      stopLoss: body.stopLoss,
      conditionalOrders: body.conditionalOrders,
    });

    return res.status(200).json({
      ok: true,
      exchange: 'bingx',
      symbol,
      side,
      quantity,
      market,
      strategy,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'Unexpected server error',
    });
  }
}
