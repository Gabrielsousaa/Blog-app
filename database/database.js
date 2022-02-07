const sequelize = require("sequelize");
const connection = new sequelize('blogadmin', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
    password: '1234'
})

module.exports = connection