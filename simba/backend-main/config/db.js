const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',   // specify the dialect (postgres, mysql, etc.)
    logging: false,        // disable logging or set to console.log for queries
    pool: {
      max: 5,             // maximum number of connections in pool
      min: 0,             // minimum number of connections in pool
      acquire: 30000,     // maximum time (ms) that pool will try to get connection
      idle: 10000         // maximum time (ms) that a connection can be idle
    }
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;