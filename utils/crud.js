import asyncHandler from './asyncHandler.js';

export const crud = (Model, { populate = '' } = {}) => ({
  list: asyncHandler(async (req, res) => {
    const query = { ...req.query, isDeleted: false };
    const search = query.search;
    delete query.search;
    
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    delete query.page;
    delete query.limit;
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { product_name: new RegExp(search, 'i') },
        { customer_name: new RegExp(search, 'i') },
        { employee_name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    const [data, total] = await Promise.all([
      Model.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .populate(populate),
      Model.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }),
  
  get: asyncHandler(async (req, res) => {
    const data = await Model.findOne({ _id: req.params.id, isDeleted: false })
      .populate(populate);
    
    if (!data) {
      res.status(404);
      throw new Error('Record not found');
    }
    
    res.json({ success: true, data });
  }),
  
  create: asyncHandler(async (req, res) => {
    const data = await Model.create(req.body);
    res.status(201).json({ success: true, data });
  }),
  
  update: asyncHandler(async (req, res) => {
    const data = await Model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate(populate);
    
    if (!data) {
      res.status(404);
      throw new Error('Record not found');
    }
    
    res.json({ success: true, data });
  }),
  
  remove: asyncHandler(async (req, res) => {
    const data = await Model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    
    if (!data) {
      res.status(404);
      throw new Error('Record not found');
    }
    
    res.json({ success: true, message: 'Deleted' });
  })
});