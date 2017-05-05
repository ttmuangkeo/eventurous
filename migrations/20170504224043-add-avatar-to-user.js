'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'avatar', Sequelize.STRING);
    },

    down: function(queryInterface, Sequelize) {
        queryInterface.removeColumn('users, avatar', Sequelize.STRING);
    }
};
