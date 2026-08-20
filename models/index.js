const sequelize = require('../config/database');
const Admin = require('./admin.model');
const Product = require('./product.model');
const Message = require('./message.model');

module.exports = {
  sequelize,
  Admin,
  Product,
  Message,
};
