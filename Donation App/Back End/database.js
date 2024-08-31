let Sequelize = require('sequelize');

let sequelize = new Sequelize('expense-tracker-app', 'root', 'neelimavarma1996',
    {dialect: 'mysql', host: 'localhost'}
)

module.exports = sequelize;