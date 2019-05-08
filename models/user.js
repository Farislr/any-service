'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_confirmed: DataTypes.BOOLEAN
  }, {
    underscored: true
  });
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.balance, {foreignKey: 'user_id'})
  };
  return user;
};
