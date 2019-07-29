'use strict'
module.exports = (sequelize, DataTypes) => {
  const flow = sequelize.define(
    'flow',
    {
      balance_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      credit: DataTypes.FLOAT,
      debit: DataTypes.FLOAT,
    },
    {}
  )
  flow.associate = function(models) {
    // associations can be defined here
    flow.belongsTo(models.balance, {
      foreignKey: 'balance_id',
    })
  }
  return flow
}
