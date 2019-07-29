'use strict'
module.exports = (sequelize, DataTypes) => {
  const balance = sequelize.define(
    'balance',
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      amount: DataTypes.FLOAT,
    },
    {
      underscored: true,
    }
  )
  balance.associate = function(models) {
    // associations can be defined here
    balance.hasMany(models.flow, {
      foreignKey: 'balance_id',
    })
    balance.belongsTo(models.user, { foreignKey: 'user_id' })
  }
  return balance
}
