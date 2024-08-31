let sequelize = require('../database');

let Sequelize = require('sequelize');

let Org = sequelize.define('org',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
        
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isRegistered: Sequelize.BOOLEAN,
    goal: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    mission: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    target: {
        type: Sequelize.TEXT,
        allowNull: false,
    },total: {
        type: Sequelize.INTEGER
    }

    
});

module.exports = Org;

