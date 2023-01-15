'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('accounts',
    [
      { balance: 7.89 },
      { balance: 2300.47 },
      { balance: 7777777777.77 },
      { balance: 9999999999.99 },
      { balance: 1450.54 },
    ], { });
  },

  async down (queryInterface) { queryInterface.bulkDelete('accounts', null, {}) }
};