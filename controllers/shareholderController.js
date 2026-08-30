import asyncHandler from '../utils/asyncHandler.js';
import Shareholder from '../models/Shareholder.js';
import { audit } from '../utils/audit.js';
import { combinedHistory, withSharePercent } from '../utils/shareholders.js';

function payload(shareholders) {
  const { totalInvestment, data } = withSharePercent(shareholders);
  return { data, totalInvestment, history: combinedHistory(data) };
}

export const listShareholders = asyncHandler(async (req, res) => {
  const shareholders = await Shareholder.find({ isDeleted: false }).sort({ role: 1, name: 1 });
  res.json({ success: true, ...payload(shareholders) });
});

export const getShareholder = asyncHandler(async (req, res) => {
  const shareholders = await Shareholder.find({ isDeleted: false }).sort({ role: 1, name: 1 });
  const { data, totalInvestment } = withSharePercent(shareholders);
  const item = data.find(entry => String(entry._id) === req.params.id);
  
  if (!item) {
    res.status(404);
    throw new Error('Shareholder not found');
  }
  
  res.json({ success: true, data: item, totalInvestment });
});

export const addInvestment = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  
  if (!Number.isFinite(amount) || amount <= 0) {
    res.status(400);
    throw new Error('Investment amount must be greater than 0');
  }
  
  const shareholder = await Shareholder.findOne({ _id: req.params.id, isDeleted: false });
  
  if (!shareholder) {
    res.status(404);
    throw new Error('Shareholder not found');
  }
  
  shareholder.investments.push({
    amount,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    note: req.body.note || ''
  });
  
  await shareholder.save();
  
  await audit(req, 'shareholder.investment.added', 'Shareholder', shareholder._id, {
    amount,
    date: req.body.date
  });
  
  const shareholders = await Shareholder.find({ isDeleted: false }).sort({ role: 1, name: 1 });
  
  res.status(201).json({ success: true, ...payload(shareholders) });
});