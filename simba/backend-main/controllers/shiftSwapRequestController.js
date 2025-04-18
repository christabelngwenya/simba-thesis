const nodemailer = require('nodemailer');
const shiftSwapRequestModel = require('../models/shiftSwapRequest');
require('dotenv').config()

// Create a new shift swap request
const createShiftSwapRequest = async (req, res) => {
    const {
        requesterName,
        requesterEmployeeId,
        colleagueName,
        currentShiftName,
        desiredShiftName,
        reason,
        shiftStart,
        shiftEnd,
        requesterEmail,
    } = req.body;

    try {
        const request = await shiftSwapRequestModel.createShiftSwapRequest(
            requesterName,
            requesterEmployeeId,
            colleagueName,
            currentShiftName,
            desiredShiftName,
            reason,
            shiftStart,
            shiftEnd,
            requesterEmail
        );
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Error creating shift swap request', error });
    }
};

// Get all pending shift swap requests
const getPendingRequests = async (req, res) => {
    try {
        const requests = await shiftSwapRequestModel.getPendingRequests();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending requests', error });
    }
};

// Update a shift swap request
const updateShiftSwapRequest = async (req, res) => {
    const { id } = req.params;
    const {
        requesterName,
        requesterEmployeeId,
        colleagueName,
        currentShiftName,
        desiredShiftName,
        reason,
        shiftStart,
        shiftEnd,
        requesterEmail,
        status,
    } = req.body;

    try {
        const updatedRequest = await shiftSwapRequestModel.updateShiftSwapRequest(
            id,
            requesterName,
            requesterEmployeeId,
            colleagueName,
            currentShiftName,
            desiredShiftName,
            reason,
            shiftStart,
            shiftEnd,
            requesterEmail,
            status
        );
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error updating shift swap request', error });
    }
};

// Delete a shift swap request
const deleteShiftSwapRequest = async (req, res) => {
    const { id } = req.params;

    try {
        await shiftSwapRequestModel.deleteShiftSwapRequest(id);
        res.status(200).json({ message: 'Shift swap request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shift swap request', error });
    }
};

// Approve/Reject a shift swap request and send email

const handleAction = async (req, res) => {
    const { id } = req.params;
    const { status, reason, requesterEmail } = req.body;

    try {
        // 1. Update status only
        const updatedRequest = await shiftSwapRequestModel.updateShiftSwapRequest(id, status);
        if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });

        // 2. Get full request details
        const request = await shiftSwapRequestModel.getRequestById(id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // 3. Send email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"Admin" <${process.env.EMAIL_USER}>`,
            to: requesterEmail,
            subject: `Your Shift Swap Request has been ${status}`,
            html: `<h1>Hello ${request.requester_name}</h1>
                 <p>Your request has been <strong>${status}</strong></p>
                 <p>Reason: ${reason}</p>`
        });

        res.status(200).json({ 
            message: `Request ${status} successfully`, 
            updatedRequest 
        });

    } catch (error) {
        console.error('Error in handleAction:', error);
        res.status(500).json({ 
            message: 'Error processing request',
            error: error.message 
        });
    }
};
module.exports = {
    createShiftSwapRequest,
    getPendingRequests,
    updateShiftSwapRequest,
    deleteShiftSwapRequest,
    handleAction,
};
