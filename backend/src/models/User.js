const { v4: uuidv4 } = require('uuid');

const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

// In-memory user store (replaced by MongoDB in Step 7)
const users = [];

class User {
  constructor({ name, email, password, role = ROLES.VIEWER }) {
    this.id = uuidv4();
    this.name = name;
    this.email = email.toLowerCase().trim();
    this.password = password; // plain text for now — hashed in Step 8
    this.role = role;
    this.isActive = true;
    this.createdAt = new Date().toISOString();
  }
}

const UserStore = {
  getAll: () => users,

  findById: (id) => users.find((u) => u.id === id),

  findByEmail: (email) => users.find((u) => u.email === email.toLowerCase().trim()),

  create: (data) => {
    const user = new User(data);
    users.push(user);
    return user;
  },

  update: (id, updates) => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const allowed = ['name', 'role', 'isActive'];
    allowed.forEach((key) => {
      if (updates[key] !== undefined) users[idx][key] = updates[key];
    });
    return users[idx];
  },

  delete: (id) => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },
};

module.exports = { ROLES, UserStore };