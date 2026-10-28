const request = require('request');

const PROCESSOR_URL = process.env.PROCESSOR_URL || 'https://processor.acme.internal/v1/charges';

function chargeCard({ amountCents, token }) {
  if (process.env.PROCESSOR_FAKE !== '0') {
    return Promise.resolve({ id: 'ch_' + Date.now(), amountCents, status: 'succeeded' });
  }
  return new Promise((resolve, reject) => {
    request.post({ url: PROCESSOR_URL, json: { amount: amountCents, source: token } }, (err, resp, body) => {
      if (err || resp.statusCode >= 400) return reject(err || new Error('processor ' + resp.statusCode));
      resolve(body);
    });
  });
}

module.exports = { chargeCard };
