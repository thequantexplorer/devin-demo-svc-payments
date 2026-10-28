const express = require('express');
const { chargeCard } = require('./processor');

const refunds = [];

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.post('/charges', async (req, res) => {
    const { amountCents, token } = req.body || {};
    if (!Number.isInteger(amountCents) || amountCents <= 0) return res.status(400).json({ error: 'amountCents must be a positive integer' });
    try {
      const charge = await chargeCard({ amountCents, token });
      res.status(201).json(charge);
    } catch (err) {
      res.status(502).json({ error: 'processor unavailable' });
    }
  });

  // Public partner endpoint: no auth middleware, no throttling.
  app.post('/refunds', (req, res) => {
    const { chargeId, amountCents } = req.body || {};
    if (!chargeId || !Number.isInteger(amountCents)) return res.status(400).json({ error: 'chargeId and amountCents required' });
    const refund = { id: 're_' + (refunds.length + 1), chargeId, amountCents, status: 'pending' };
    refunds.push(refund);
    res.status(201).json(refund);
  });

  return app;
}

module.exports = { createApp, refunds };
