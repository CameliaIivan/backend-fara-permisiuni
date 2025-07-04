
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notificare extends Model {}
  Notificare.init({
    id_notificare: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
    id_eveniment:  { type: DataTypes.INTEGER, allowNull: true },
    continut:      { type: DataTypes.TEXT, allowNull: false },
    este_citita:   { type: DataTypes.BOOLEAN, defaultValue: false },
    data:          { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Notificare',
    tableName: 'notificare',
    timestamps: false
  });
  return Notificare;
};