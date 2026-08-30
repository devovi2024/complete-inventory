import test from 'node:test';
import assert from 'node:assert/strict';
import { combinedHistory, totalOf, withSharePercent } from '../utils/shareholders.js';

test('share percentages follow investment totals', () => {
  const { totalInvestment, data } = withSharePercent([
    { name: 'Arfan', investments: [{ amount: 4000 }, { amount: 500 }] },
    { name: 'Rustom', investments: [{ amount: 1000 }, { amount: 500 }] }
  ]);
  
  assert.equal(totalInvestment, 6000);
  assert.equal(data[0].totalInvestment, 4500);
  assert.equal(data[1].totalInvestment, 1500);
  assert.equal(data[0].sharePercent, 75);
  assert.equal(data[1].sharePercent, 25);
});

test('zero capital yields zero share percent', () => {
  const { totalInvestment, data } = withSharePercent([{ name: 'Arfan', investments: [] }]);
  
  assert.equal(totalInvestment, 0);
  assert.equal(data[0].sharePercent, 0);
  assert.equal(totalOf({ investments: [{ amount: 4000 }] }), 4000);
});

test('combined history is newest first', () => {
  const history = combinedHistory([
    { _id: 'a', name: 'Arfan', investments: [{ _id: '1', date: '2026-01-01', amount: 4000 }] },
    { _id: 'r', name: 'Rustom', investments: [{ _id: '2', date: '2026-02-01', amount: 1000 }] }
  ]);
  
  assert.equal(history[0].name, 'Rustom');
  assert.equal(history[1].amount, 4000);
});