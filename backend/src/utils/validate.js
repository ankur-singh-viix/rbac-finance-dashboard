const { RECORD_TYPES, CATEGORIES } = require('../models/Record');
const { ROLES } = require('../models/User');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidDate = (date) => !isNaN(new Date(date));

const validateUserCreate = (body) => {
  const errors = [];
  const { name, email, password, role } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2)
    errors.push('name must be at least 2 characters');

  if (!email || !isValidEmail(email))
    errors.push('a valid email is required');

  if (!password || password.length < 6)
    errors.push('password must be at least 6 characters');

  if (role && !Object.values(ROLES).includes(role))
    errors.push(`role must be one of: ${Object.values(ROLES).join(', ')}`);

  return errors;
};

const validateUserUpdate = (body) => {
  const errors = [];
  const { name, role, isActive } = body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2))
    errors.push('name must be at least 2 characters');

  if (role !== undefined && !Object.values(ROLES).includes(role))
    errors.push(`role must be one of: ${Object.values(ROLES).join(', ')}`);

  if (isActive !== undefined && typeof isActive !== 'boolean')
    errors.push('isActive must be a boolean');

  return errors;
};

const validateRecordCreate = (body) => {
  const errors = [];
  const { amount, type, category, date } = body;

  if (amount === undefined || amount === '')
    errors.push('amount is required');
  else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
    errors.push('amount must be a positive number');

  if (!type)
    errors.push('type is required');
  else if (!Object.values(RECORD_TYPES).includes(type))
    errors.push(`type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`);

  if (!category)
    errors.push('category is required');
  else if (!CATEGORIES.includes(category))
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);

  if (date && !isValidDate(date))
    errors.push('date must be a valid date string');

  return errors;
};

const validateRecordUpdate = (body) => {
  const errors = [];
  const { amount, type, category, date } = body;

  if (amount !== undefined && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0))
    errors.push('amount must be a positive number');

  if (type !== undefined && !Object.values(RECORD_TYPES).includes(type))
    errors.push(`type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`);

  if (category !== undefined && !CATEGORIES.includes(category))
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);

  if (date !== undefined && !isValidDate(date))
    errors.push('date must be a valid date string');

  return errors;
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateRecordCreate,
  validateRecordUpdate,
};