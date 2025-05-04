'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom verification_token ke tabel users
    await queryInterface.addColumn('users', 'verification_token', {
      type: Sequelize.STRING,
      allowNull: true, // Token bisa null karena ini hanya digunakan untuk verifikasi
      unique: true, // Token harus unik
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom verification_token jika migrasi dibatalkan
    await queryInterface.removeColumn('users', 'verification_token');
  }
};
