const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // Import the Sequelize model

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createddate', 'ASC']],
      attributes: { exclude: ['passwordhash'] } // Exclude password hash
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { firstname, lastname, emailaddress, password, role } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstname,
      lastname,
      emailaddress,
      passwordhash,
      role
    });

    // Return user data without password
    const userData = user.get({ plain: true });
    delete userData.passwordhash;

    res.status(201).json(userData);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error creating user",
      details: error.errors?.map(e => e.message) || error.message
    });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, emailaddress, password, role } = req.body;
    const { userid } = req.params;

    let updateData = { firstname, lastname, emailaddress, role };

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordhash = await bcrypt.hash(password, salt);
    }

    const [affectedCount] = await User.update(updateData, {
      where: { userid: userid },
      returning: true,
      individualHooks: true
    });

    if (affectedCount === 0) return res.status(404).json({ error: "User not found" });

    const updatedUser = await User.findByPk(userid, {
      attributes: { exclude: ['passwordhash'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Error updating user",
      details: error.errors?.map(e => e.message) || error.message
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params; // Match parameter name
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const deletedCount = await User.destroy({
      where: { userid } // Ensure this matches the DB field
    });

    if (deletedCount === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Error deleting user",
      details: error.message
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
