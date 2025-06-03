// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Spital = sequelize.define(
//   "spital",
//   {
//     id_spital: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     nume: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     locatie: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     tip_serviciu: {
//       type: DataTypes.STRING,
//     },
//     grad_accesibilitate: {
//       type: DataTypes.STRING,
//     },
//     contact: {
//       type: DataTypes.STRING,
//     },
//     website: {
//       type: DataTypes.STRING,
//     },
//     descriere: {
//       type: DataTypes.TEXT,
//     },
//     creat_de: {
//       type: DataTypes.INTEGER,
//       allowNull: false, // doar admin poate popula acest câmp
//     },
//     data_crearii: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     modificat_de: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     data_modificarii: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Spital
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Spital extends Model {}
  Spital.init({
    id_spital:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume:                 { type: DataTypes.STRING(255), allowNull: false },
    locatie:              { type: DataTypes.STRING(255), allowNull: false },
    tip_serviciu:         { type: DataTypes.STRING(100) },
    grad_accesibilitate:  { type: DataTypes.STRING(50) },
    contact:              { type: DataTypes.STRING(100) },
    website:              { type: DataTypes.STRING(255) },
    descriere:            { type: DataTypes.TEXT },
    creat_de:             { type: DataTypes.INTEGER, allowNull: false },
    data_crearii:         { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    modificat_de:         { type: DataTypes.INTEGER },
    data_modificarii:     { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Spital',
    tableName: 'spital',
    timestamps: false
  });
  return Spital;
};