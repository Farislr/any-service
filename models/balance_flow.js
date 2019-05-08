'use strict';
module.exports = (sequelize, DataTypes) => {
  const balance_flow = sequelize.define('balance_flow', {
    balance_id: DataTypes.INTEGER,
    flow_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  balance_flow.associate = function(models) {
    // associations can be defined here
  };
  return balance_flow;
};