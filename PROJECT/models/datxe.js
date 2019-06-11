'use strict';
module.exports = (sequelize, DataTypes) => {
  const datxe = sequelize.define('datxe', {
    TenKH: DataTypes.STRING,
    To: DataTypes.STRING,
    From: DataTypes.STRING,
    Price: DataTypes.STRING,
    TenTX: DataTypes.STRING
  }, {});
  datxe.associate = function(models) {
    // associations can be defined here
  };
  return datxe;
};