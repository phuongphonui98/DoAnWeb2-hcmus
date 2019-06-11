'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    HoTen: DataTypes.STRING,
    SDT: DataTypes.STRING,
    SoXe: DataTypes.STRING,
    ImagePath: DataTypes.STRING,
    X: DataTypes.STRING,
    Y: DataTypes.STRING,
    Check: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};