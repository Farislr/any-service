'use strict'
module.exports = (sequelize, DataTypes) => {
  const social_user = sequelize.define(
    'social_user',
    {
      user_id: DataTypes.INTEGER,
      provider_id: DataTypes.INTEGER,
      provider: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  )
  social_user.associate = function(models) {
    // associations can be defined here
    social_user.belongsTo(models.user, { foreignKey: 'user_id' })
  }
  return social_user
}
