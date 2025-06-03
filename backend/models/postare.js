 const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Postare extends Model {}
  Postare.init({
    id_postare:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titlu:         { type: DataTypes.STRING(255), allowNull: false },
    continut:      { type: DataTypes.TEXT, allowNull: false },
    tip:           { type: DataTypes.ENUM('text','eveniment'), defaultValue: 'text' },
    creat_de:      { type: DataTypes.INTEGER, allowNull: false },
    id_grup:       { type: DataTypes.INTEGER },
    data_postarii: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Postare',
    tableName: 'postare',
    timestamps: false
  });
  return Postare;
};