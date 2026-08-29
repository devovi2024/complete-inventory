export function addFIFOLayer(item, { quantity, unitCost, purchaseDate = new Date(), note = '' }) {
  const qty = Number(quantity);
  const cost = Number(unitCost);
  if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(cost) || cost < 0) throw new Error('Quantity must be positive and unit cost cannot be negative');
  item.fifo_layers.push({ quantity: qty, remaining: qty, unit_cost: cost, purchase_date: purchaseDate, note });
  recalculate(item);
  return item;
}

export function consumeFIFO(item, requestedQuantity) {
  let remaining = Number(requestedQuantity);
  if (!Number.isFinite(remaining) || remaining <= 0) throw new Error('Quantity must be positive');
  if (item.total_qty < remaining) throw new Error(`Insufficient inventory. Available: ${item.total_qty}`);
  const consumed = [];
  for (const layer of [...item.fifo_layers].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date))) {
    if (!remaining) break;
    const used = Math.min(layer.remaining, remaining);
    layer.remaining -= used;
    remaining -= used;
    consumed.push({ quantity: used, unit_cost: layer.unit_cost });
  }
  item.fifo_layers = item.fifo_layers.filter(layer => layer.remaining > 0);
  recalculate(item);
  return { cogs: consumed.reduce((sum, row) => sum + row.quantity * row.unit_cost, 0), consumed };
}

export function calculateAvgCost(item) {
  const total = item.fifo_layers.reduce((sum, layer) => sum + layer.remaining * layer.unit_cost, 0);
  const qty = item.fifo_layers.reduce((sum, layer) => sum + layer.remaining, 0);
  return qty ? total / qty : 0;
}

function recalculate(item) {
  item.total_qty = item.fifo_layers.reduce((sum, layer) => sum + layer.remaining, 0);
  item.avg_cost = calculateAvgCost(item);
}
