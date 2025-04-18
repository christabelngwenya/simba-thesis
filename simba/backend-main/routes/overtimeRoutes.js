const express = require("express");
const router = express.Router();
const overtimeController = require("../controllers/overtimeController");

router.post("/overtime", overtimeController.createOvertimeRequest);
router.get("/overtime", overtimeController.getOvertimeRequests);

module.exports = router;