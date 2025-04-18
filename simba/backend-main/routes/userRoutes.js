// Remove the "/users" prefix from your router since it will be added in the main server file
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Update routes to use root path
router.get("/", UserController.getUsers);
router.post("/", UserController.createUser);
router.put("/:userid", UserController.updateUser);
router.delete("/:userid", UserController.deleteUser);

module.exports = router;