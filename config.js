const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    connectionLimit: 10000,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    mailSendFrom: 'donotreply@theonemoment.com',
    mailPassword: 'zse45rdx123@',
};