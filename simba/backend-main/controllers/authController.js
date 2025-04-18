const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { emailaddress, password } = req.body;

  if (!emailaddress || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { emailaddress } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is missing");
    }

    const token = jwt.sign(
      { 
        userid: user.userid,
        email: user.emailaddress,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    res.json({
      message: "Login successful",
      user: {
        userid: user.userid,
        username: `${user.firstname} ${user.lastname}`,
        email: user.emailaddress,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logout successful" });
};

const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({
    user: {
      userid: req.user.userid,
      username: `${req.user.firstname} ${req.user.lastname}`,
      email: req.user.email,
      role: req.user.role
    }
  });
};

module.exports = {
  login,
  logout,
  getCurrentUser
};