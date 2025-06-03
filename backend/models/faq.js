// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Faq = sequelize.define(
//   "faq",
//   {
//     id_faq: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     intrebare: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     raspuns: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     data_crearii: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     data_modificarii: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     creat_de: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Faq
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Faq extends Model {}
  Faq.init({
    id_faq:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    intrebare:   { type: DataTypes.TEXT, allowNull: false },
    raspuns:     { type: DataTypes.TEXT, allowNull: false },
    creat_de:    { type: DataTypes.INTEGER, allowNull: false },
    data_crearii:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_modificarii:{ type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Faq',
    tableName: 'faq',
    timestamps: false
  });
  return Faq;
};