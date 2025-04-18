const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async createUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await pool.query(query, [username, hashedPassword, role]);
    return rows[0];
  }
}

module.exports = User;