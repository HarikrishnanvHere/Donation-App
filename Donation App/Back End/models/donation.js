let sequelize = require('../database');

let Sequelize = require('sequelize');

let Donation = sequelize.define('donation',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
        
    },
    date: {
        type:Sequelize.STRING,
        allowNull: false
    }

    
});

module.exports = Donation;