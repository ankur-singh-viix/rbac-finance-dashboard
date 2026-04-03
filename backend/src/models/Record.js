const { v4: uuidv4 } = require('uuid');

const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

const CATEGORIES = [
  'salary',
  'freelance',
  'investment',
  'food',
  'transport',
  'utilities',
  'entertainment',
  'healthcare',
  'other',
];

// In-memory store — replaced by MongoDB in Step 7
const records = [];

class Record {
  constructor({ amount, type, category, date, notes, createdBy }) {
    this.id = uuidv4();
    this.amount = parseFloat(amount);
    this.type = type;
    this.category = category;
    this.date = date ? new Date(date).toISOString() : new Date().toISOString();
    this.notes = notes || '';
    this.createdBy = createdBy; // user id
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

const RecordStore = {
  getAll: () => records,

  findById: (id) => records.find((r) => r.id === id),

  create: (data) => {
    const record = new Record(data);
    records.push(record);
    return record;
  },

  update: (id, updates) => {
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const allowed = ['amount', 'type', 'category', 'date', 'notes'];
    allowed.forEach((key) => {
      if (updates[key] !== undefined) records[idx][key] = key === 'amount'
        ? parseFloat(updates[key])
        : updates[key];
    });
    records[idx].updatedAt = new Date().toISOString();
    return records[idx];
  },

  delete: (id) => {
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    records.splice(idx, 1);
    return true;
  },
};

module.exports = { RECORD_TYPES, CATEGORIES, RecordStore };