const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Grup extends Model {}
  Grup.init({
    id_grup:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume:         { type: DataTypes.STRING(255), allowNull: false },
    descriere:    { type: DataTypes.TEXT },
    creat_de:     { type: DataTypes.INTEGER, allowNull: false },
    data_crearii: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    este_privata: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Grup',
    tableName: 'grup',
    timestamps: false
  });
  return Grup;
};