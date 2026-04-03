const { RecordStore, RECORD_TYPES, CATEGORIES } = require('../models/Record');

// GET /api/records
const getAllRecords = (req, res) => {
  const records = RecordStore.getAll();
  res.json({ success: true, count: records.length, data: records });
};

// GET /api/records/:id
const getRecordById = (req, res) => {
  const record = RecordStore.findById(req.params.id);
  if (!record)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: record });
};

// POST /api/records
const createRecord = (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  // Validate required fields
  if (amount === undefined || !type || !category)
    return res.status(400).json({
      success: false,
      message: 'amount, type, and category are required',
    });

  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
    return res.status(400).json({
      success: false,
      message: 'amount must be a positive number',
    });

  if (!Object.values(RECORD_TYPES).includes(type))
    return res.status(400).json({
      success: false,
      message: `type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`,
    });

  if (!CATEGORIES.includes(category))
    return res.status(400).json({
      success: false,
      message: `category must be one of: ${CATEGORIES.join(', ')}`,
    });

  const record = RecordStore.create({
    amount,
    type,
    category,
    date,
    notes,
    createdBy: req.user.id,
  });

  res.status(201).json({ success: true, data: record });
};

// PATCH /api/records/:id
const updateRecord = (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (amount !== undefined && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0))
    return res.status(400).json({
      success: false,
      message: 'amount must be a positive number',
    });

  if (type && !Object.values(RECORD_TYPES).includes(type))
    return res.status(400).json({
      success: false,
      message: `type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`,
    });

  if (category && !CATEGORIES.includes(category))
    return res.status(400).json({
      success: false,
      message: `category must be one of: ${CATEGORIES.join(', ')}`,
    });

  const updated = RecordStore.update(req.params.id, { amount, type, category, date, notes });
  if (!updated)
    return res.status(404).json({ success: false, message: 'Record not found' });

  res.json({ success: true, data: updated });
};

// DELETE /api/records/:id
const deleteRecord = (req, res) => {
  const deleted = RecordStore.delete(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, message: 'Record deleted' });
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };