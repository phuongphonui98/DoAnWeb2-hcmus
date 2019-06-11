'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Email: {
        type: Sequelize.STRING
      },
      Password: {
        type: Sequelize.STRING
      },
      HoTen: {
        type: Sequelize.STRING
      },
      SDT: {
        type: Sequelize.STRING
      },
      SoXe: {
        type: Sequelize.STRING
      },
      ImagePath: {
        type: Sequelize.STRING
      },
      X: {
        type: Sequelize.STRING
      },
      Y: {
        type: Sequelize.STRING
      },
      Check: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Users');
  }
};