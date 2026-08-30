import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Shareholder from '../models/Shareholder.js';

const founders = [
  { name: 'Arfan', designation: 'Senior Partner', role: 'senior', amount: 4000 },
  { name: 'Rustom', designation: 'Junior Partner', role: 'junior', amount: 1000 }
];

await connectDB();

for (const founder of founders) {
  const existing = await Shareholder.findOne({ name: founder.name, isDeleted: false });
  
  if (existing) {
    if (!existing.investments.length) {
      existing.investments.push({ amount: founder.amount, date: new Date(), note: 'Initial capital' });
      await existing.save();
      console.log(`Added initial investment for ${founder.name}`);
    } else {
      console.log(`${founder.name} already has investment history`);
    }
    continue;
  }
  
  await Shareholder.create({
    name: founder.name,
    designation: founder.designation,
    role: founder.role,
    investments: [{ amount: founder.amount, date: new Date(), note: 'Initial capital' }]
  });
  
  console.log(`Created ${founder.name} with ৳${founder.amount}`);
}

await mongoose.disconnect();