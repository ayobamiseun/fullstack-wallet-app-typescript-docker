'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transactions',
    [
      {
        value: 1000,
        debitedAccountId: 4,
        creditedAccountId: 5,
        createdAt: '2021-10-26T20:20:42.916Z'
      },
      {
        value: 300.40,
        debitedAccountId: 3,
        creditedAccountId: 2,
        createdAt: '2020-02-26T20:20:42.916Z'
      },
      {
        value: 15000.00,
        debitedAccountId: 4,
        creditedAccountId: 3,
        createdAt: '2021-10-21T20:20:42.916Z'
      },
      {
        value: 77.79,
        debitedAccountId: 1,
        creditedAccountId: 5,
        createdAt: '2019-01-12T20:20:42.916Z'
      },
      {
        value: 99.00,
        debitedAccountId: 4,
        creditedAccountId: 2,
        createdAt: '2022-05-20T20:20:42.916Z'
      },
      {
        value: 250.71,
        debitedAccountId: 3,
        creditedAccountId: 1,
        createdAt: '2019-05-12T20:20:42.916Z'
      },
      {
        value: 7000.00,
        debitedAccountId: 3,
        creditedAccountId: 4,
        createdAt: '2020-10-01T20:20:42.916Z'
      },
    ], { });
  },

  async down (queryInterface) { queryInterface.bulkDelete('transactions', null, {}) }
};
