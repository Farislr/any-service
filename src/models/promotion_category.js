'use strict'
module.exports = (sequelize, DataTypes) => {
  const promotion_category = sequelize.define(
    'promotion_category',
    {
      name: DataTypes.STRING,
      display_name: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  )
  promotion_category.associate = function(models) {
    // associations can be defined here
    promotion_category.hasMany(models.promotion, {
      foreignKey: 'promotion_category_id',
    })
  }
  return promotion_category
}
