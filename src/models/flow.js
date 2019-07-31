'use strict'
module.exports = (sequelize, DataTypes) => {
  const flow = sequelize.define(
    'flow',
    {
      balance_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      credit: { type: DataTypes.FLOAT, defaultValue: 0 },
      debit: { type: DataTypes.FLOAT, defaultValue: 0 },
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
