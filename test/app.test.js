const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { createApp } = require('../src/app');

test('creates a charge', async () => {
  const res = await request(createApp()).post('/charges').send({ amountCents: 1299, token: 'tok_visa' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.status, 'succeeded');
});

test('rejects bad refund payloads', async () => {
  const res = await request(createApp()).post('/refunds').send({});
  assert.strictEqual(res.status, 400);
});
