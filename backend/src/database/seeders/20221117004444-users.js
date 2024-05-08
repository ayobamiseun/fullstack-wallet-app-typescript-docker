'use strict';

const bcrypt = require('bcryptjs');

// All seeded users share the same dev password: "Test1234!"
const hash = bcrypt.hashSync('Test1234!', 10);

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        { username: "test1",       password: hash, accountId: 1, email: "test1@example.com" },
        { username: "ayobami",     password: hash, accountId: 2, email: "test2@example.com" },
        { username: "victorseun",  password: hash, accountId: 3, email: "test3@example.com" },
        { username: "seunayobami", password: hash, accountId: 4, email: "test4@example.com" },
        { username: "adegoke",     password: hash, accountId: 5, email: "test5@example.com" },
      ],
      {}
    );
  },

  async down (queryInterface) { queryInterface.bulkDelete('users', null, {}) }
};
