'use strict'
module.exports = (sequelize, DataTypes) => {
  const promotion = sequelize.define(
    'promotion',
    {
      title: DataTypes.STRING,
      promotion_category_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  )
  promotion.associate = function(models) {
    // associations can be defined here
    promotion.belongsTo(models.promotion_category)
  }
  return promotion
}
