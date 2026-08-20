const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Message dipakai buat nyimpen riwayat percakapan (chat history).
 * Satu percakapan dikelompokkin pake `sessionId`, jadi tiap baris
 * di tabel ini adalah SATU pesan (baik dari user maupun dari bot).
 *
 * Fitur ini HANYA aktif kalau user setuju nyimpen riwayat
 * (dikontrol lewat flag `saveHistory` di controller, bukan di sini).
 */
const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      // dipake buat ngelompokin pesan-pesan dalam satu percakapan
    },
    role: {
      type: DataTypes.ENUM('user', 'bot'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        fields: ['sessionId'],
      },
    ],
  }
);

module.exports = Message;
