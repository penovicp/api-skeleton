'use strict';

const _ = require('lodash');
const utils = require('../../utils/migrations');

module.exports = {
  up: function(queryInterface, Sequelize) {
    const baseSchema = {
      bio: {
        type: Sequelize.STRING(1000)
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    };

    return queryInterface.createTable('super_admins', _.extend({},
      utils.id,
      baseSchema,
      utils.timestamps
    ));
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('super_admins');
  }
};
