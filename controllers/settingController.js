import asyncHandler from '../utils/asyncHandler.js';
import Setting from '../models/Setting.js';
export const getSettings = asyncHandler(async (req, res) => { let data = await Setting.findOne(); if (!data) data = await Setting.create({}); res.json({ success: true, data }); });
export const updateSettings = asyncHandler(async (req, res) => { const data = await Setting.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }); res.json({ success: true, data }); });
