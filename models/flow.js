'use strict'
module.exports = (sequelize, DataTypes) => {
  const flow = sequelize.define(
    'flow',
    {
      description: DataTypes.STRING,
      credit: DataTypes.FLOAT,
      debit: DataTypes.FLOAT,
    },
    {}
  )
  flow.associate = function(models) {
    // associations can be defined here
    flow.belongsToMany(models.balance, {
      through: models.balance_flow,
      foreignKey: 'flow_id',
    })
  }
  return flow
}
