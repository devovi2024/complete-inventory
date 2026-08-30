export function totalOf(shareholder) {
  return (shareholder.investments || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

export function withSharePercent(shareholders) {
  const records = shareholders.map(item => {
    const data = typeof item.toObject === 'function' ? item.toObject({ virtuals: true }) : { ...item };
    data.totalInvestment = Number(data.totalInvestment ?? totalOf(data));
    return data;
  });
  
  const totalInvestment = records.reduce((sum, item) => sum + item.totalInvestment, 0);
  
  const data = records.map(item => ({
    ...item,
    sharePercent: totalInvestment ? Number(((item.totalInvestment / totalInvestment) * 100).toFixed(2)) : 0
  }));
  
  return { totalInvestment, data };
}

export function combinedHistory(shareholders) {
  return shareholders
    .flatMap(item => (item.investments || []).map(entry => ({
      id: entry._id,
      shareholderId: item._id,
      name: item.name,
      role: item.role,
      designation: item.designation,
      date: entry.date,
      amount: Number(entry.amount),
      note: entry.note || ''
    })))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}