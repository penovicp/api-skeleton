'use strict';

module.exports = function(sequelize, DataTypes) {
  const passcode = sequelize.define('passcode', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        passcode.belongsTo(models.user);
      }
    }
  });

  return passcode;
};
