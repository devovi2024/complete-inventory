import asyncHandler from '../utils/asyncHandler.js';
import Inventory from '../models/Inventory.js';
import { addFIFOLayer } from '../utils/fifo.js';
import { audit } from '../utils/audit.js';
export const addLayer = asyncHandler(async (req, res) => { const item = await Inventory.findOne({ _id: req.params.id, isDeleted: false }); if (!item) { res.status(404); throw new Error('Inventory item not found'); } addFIFOLayer(item, { quantity: req.body.quantity, unitCost: req.body.unitCost, purchaseDate: req.body.purchaseDate, note: req.body.note }); await item.save(); await audit(req, 'inventory.layer.added', 'Inventory', item._id, { quantity: req.body.quantity, unitCost: req.body.unitCost }); res.status(201).json({ success: true, data: item }); });
export const createInventory = asyncHandler(async (req, res) => { const { quantity, unitCost, purchaseDate, note, ...fields } = req.body; const item = new Inventory(fields); if (quantity != null && unitCost != null) addFIFOLayer(item, { quantity, unitCost, purchaseDate, note }); await item.save(); res.status(201).json({ success: true, data: item }); });
