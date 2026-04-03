const { RecordStore, RECORD_TYPES, CATEGORIES } = require('../models/Record');
const { validateRecordCreate, validateRecordUpdate } = require('../utils/validate');

const getAllRecords = (req, res) => {
  const { type, category, startDate, endDate, minAmount, maxAmount } = req.query;
  let records = RecordStore.getAll();

  if (type) {
    if (!Object.values(RECORD_TYPES).includes(type))
      return res.status(400).json({ success: false, message: `type must be one of: ${Object.values(RECORD_TYPES).join(', ')}` });
    records = records.filter((r) => r.type === type);
  }

  if (category) {
    if (!CATEGORIES.includes(category))
      return res.status(400).json({ success: false, message: `category must be one of: ${CATEGORIES.join(', ')}` });
    records = records.filter((r) => r.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start)) return res.status(400).json({ success: false, message: 'Invalid startDate' });
    records = records.filter((r) => new Date(r.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end)) return res.status(400).json({ success: false, message: 'Invalid endDate' });
    end.setHours(23, 59, 59, 999);
    records = records.filter((r) => new Date(r.date) <= end);
  }

  if (minAmount) {
    const min = parseFloat(minAmount);
    if (isNaN(min)) return res.status(400).json({ success: false, message: 'Invalid minAmount' });
    records = records.filter((r) => r.amount >= min);
  }

  if (maxAmount) {
    const max = parseFloat(maxAmount);
    if (isNaN(max)) return res.status(400).json({ success: false, message: 'Invalid maxAmount' });
    records = records.filter((r) => r.amount <= max);
  }

  res.json({ success: true, count: records.length, data: records });
};

const getRecordById = (req, res) => {
  const record = RecordStore.findById(req.params.id);
  if (!record)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: record });
};

const createRecord = (req, res) => {
  const errors = validateRecordCreate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  const { amount, type, category, date, notes } = req.body;
  const record = RecordStore.create({ amount, type, category, date, notes, createdBy: req.user.id });
  res.status(201).json({ success: true, data: record });
};

const updateRecord = (req, res) => {
  const errors = validateRecordUpdate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  const updated = RecordStore.update(req.params.id, req.body);
  if (!updated)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: updated });
};

const deleteRecord = (req, res) => {
  const deleted = RecordStore.delete(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, message: 'Record deleted' });
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };