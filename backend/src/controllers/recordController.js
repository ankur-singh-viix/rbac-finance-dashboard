const { Record, RECORD_TYPES, CATEGORIES } = require('../models/Record');
const { validateRecordCreate, validateRecordUpdate } = require('../utils/validate');

const getAllRecords = async (req, res) => {
  const { type, category, startDate, endDate, minAmount, maxAmount } = req.query;
  const filter = {};

  if (type) {
    if (!Object.values(RECORD_TYPES).includes(type))
      return res.status(400).json({ success: false, message: `type must be one of: ${Object.values(RECORD_TYPES).join(', ')}` });
    filter.type = type;
  }

  if (category) {
    if (!CATEGORIES.includes(category))
      return res.status(400).json({ success: false, message: `category must be one of: ${CATEGORIES.join(', ')}` });
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start)) return res.status(400).json({ success: false, message: 'Invalid startDate' });
      filter.date.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end)) return res.status(400).json({ success: false, message: 'Invalid endDate' });
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) {
      const min = parseFloat(minAmount);
      if (isNaN(min)) return res.status(400).json({ success: false, message: 'Invalid minAmount' });
      filter.amount.$gte = min;
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      if (isNaN(max)) return res.status(400).json({ success: false, message: 'Invalid maxAmount' });
      filter.amount.$lte = max;
    }
  }

  const records = await Record.find(filter).sort({ date: -1 });
  res.json({ success: true, count: records.length, data: records });
};

const getRecordById = async (req, res) => {
  const record = await Record.findById(req.params.id);
  if (!record)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: record });
};

const createRecord = async (req, res) => {
  const errors = validateRecordCreate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  const { amount, type, category, date, notes } = req.body;
  const record = await Record.create({ amount, type, category, date, notes, createdBy: req.user._id });
  res.status(201).json({ success: true, data: record });
};

const updateRecord = async (req, res) => {
  const errors = validateRecordUpdate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  const updated = await Record.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!updated)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: updated });
};

const deleteRecord = async (req, res) => {
  const deleted = await Record.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, message: 'Record deleted' });
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };