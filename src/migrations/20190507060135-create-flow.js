'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('flows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      balance_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'balances',
          },
          key: 'id',
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      credit: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      debit: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('flows')
  },
}
