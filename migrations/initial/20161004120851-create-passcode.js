'use strict';

const _ = require('lodash');
const utils = require('../../utils/migrations');

module.exports = {
  up: function(queryInterface, Sequelize) {
    const baseSchema = {
      code: {
        type: Sequelize.STRING,
        allowNull: false
      }
    };

    return queryInterface.createTable('passcodes', _.extend({},
      utils.id,
      baseSchema,
      utils.timestamps
    ))
    .then(function() {
      return queryInterface.addColumn('passcodes', 'userId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    })
    .then(function() {
      return queryInterface.addIndex('passcodes', ['code', 'userId'], {
        indicesType: 'UNIQUE'
      });
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeIndex('passcodes', ['code', 'userId'])
      .then(function() {
        return queryInterface.removeColumn('passcodes', 'userId');
      })
      .then(function() {
        return queryInterface.dropTable('passcodes');
      });
  }
};
