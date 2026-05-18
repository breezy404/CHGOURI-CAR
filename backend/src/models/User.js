// User Database Model
// CHGOURI CAR Marrakech Car Rental

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM('client', 'admin'),
    defaultValue: 'client'
  }
}, {
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('passwordHash')) {
        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    }
  }
});

// Instance method to check password validity
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
