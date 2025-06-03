const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CategorieArticol extends Model {}
  CategorieArticol.init({
    id_categorie: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume:         { type: DataTypes.STRING(100), allowNull: false }
  }, {
    sequelize,
    modelName: 'CategorieArticol',
    tableName: 'categorie_articol',
    timestamps: false
  });
  return CategorieArticol;
};