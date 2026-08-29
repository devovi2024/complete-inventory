import { Router } from 'express';
import { createInventory, addLayer } from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import { crud } from '../utils/crud.js';
import Inventory from '../models/Inventory.js';
const router = Router(); const handlers = crud(Inventory);
router.use(protect); router.get('/', handlers.list); router.post('/', createInventory); router.get('/:id', handlers.get); router.put('/:id', handlers.update); router.delete('/:id', handlers.remove); router.post('/:id/layers', addLayer);
export default router;
