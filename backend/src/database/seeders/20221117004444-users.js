'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "test1",
          password: "sr9b422b35eff8c9915c7bcabe41d4et",
          accountId: 1,
          email: "test1@example.com",
        },
        {
          username: "ayobami",
          password: "r2f3aa181d111a2e2f5d1e1c251e6a5y",
          accountId: 2,
          email: "test2@example.com",
        },
        {
          username: "victorseun",
          password: "3eb0e365d29cb6267d337be6c81ebarr",
          accountId: 3,
          email: "test3@example.com",
        },
        {
          username: "seunayobami",
          password: "312c966efe39686e5d653e7891c09288",
          accountId: 4,
          email: "test4@example.com",
        },
        {
          username: "adegoke",
          password: "4a44df0a7b7cf6e9030a1b343cac87ae",
          accountId: 5,
          email: "test4@example.com",
        },
      ],
      {}
    );
  },

  async down (queryInterface) { queryInterface.bulkDelete('users', null, {}) }
};