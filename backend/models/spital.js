
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Spital extends Model {}
  Spital.init({
    id_spital:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume:                 { type: DataTypes.STRING(255), allowNull: false },
    locatie:              { type: DataTypes.STRING(255), allowNull: false },
    latitudine:           { type: DataTypes.DECIMAL(10, 8) },
    longitudine:          { type: DataTypes.DECIMAL(11, 8) },
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