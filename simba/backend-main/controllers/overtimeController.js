const overtimeModel = require("../models/overtimeModel");

const createOvertimeRequest = async (req, res) => {
  const { fullName, employeeId, jobTitle, date, startTime, endTime, reason } = req.body;

  // Validate input data
  if (!fullName || !employeeId || !jobTitle || !date || !startTime || !endTime || !reason) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const request = await overtimeModel.createOvertimeRequest(
      fullName,
      employeeId,
      jobTitle,
      date,
      startTime,
      endTime,
      reason
    );
    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating overtime request:", error);
    res.status(500).json({ message: "Error creating overtime request", error: error.message });
  }
};

const getOvertimeRequests = async (req, res) => {
  const { employeeId } = req.query;

  // Validate employeeId
  if (!employeeId) {
    return res.status(400).json({ message: "Employee ID is required!" });
  }

  try {
    const requests = await overtimeModel.getOvertimeRequests(employeeId);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching overtime requests:", error);
    res.status(500).json({ message: "Error fetching overtime requests", error: error.message });
  }
};

module.exports = {
  createOvertimeRequest,
  getOvertimeRequests,
};