'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('datxes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TenKH: {
        type: Sequelize.STRING
      },
      To: {
        type: Sequelize.STRING
      },
      From: {
        type: Sequelize.STRING
      },
      Price: {
        type: Sequelize.STRING
      },
      TenTX: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('datxes');
  }
};