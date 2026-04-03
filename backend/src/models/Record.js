const mongoose = require('mongoose');

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

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', recordSchema);

module.exports = { RECORD_TYPES, CATEGORIES, Record };