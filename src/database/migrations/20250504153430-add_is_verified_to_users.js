'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,  // Pastikan kolom ini tidak boleh null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'is_verified');
  },
};

