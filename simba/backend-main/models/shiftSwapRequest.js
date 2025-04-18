const pool = require('../config/db');

const createShiftSwapRequest = async (
    requesterName,
    requesterEmployeeId,
    colleagueName,
    currentShiftName,
    desiredShiftName,
    reason,
    shiftStart,
    shiftEnd,
    requesterEmail
) => {
    const query = `
        INSERT INTO shift_swap_requests (
            requester_name, requester_employee_id, colleague_name, 
            current_shift_name, desired_shift_name, reason, 
            shift_start, shift_end, requester_email, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    const values = [
        requesterName,
        requesterEmployeeId,
        colleagueName,
        currentShiftName,
        desiredShiftName,
        reason,
        shiftStart,
        shiftEnd,
        requesterEmail,
        'pending', // Default status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getPendingRequests = async () => {
    const query = `
        SELECT * FROM shift_swap_requests
        WHERE status = 'pending';
    `;
    const result = await pool.query(query);
    return result.rows;
};

const updateShiftSwapRequest = async (id, status) => {
    const query = `
        UPDATE shift_swap_requests
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;
    const values = [status, id];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error in updateShiftSwapRequest:', error);
        throw error;
    }
};
const deleteShiftSwapRequest = async (id) => {
    const query = `
        DELETE FROM shift_swap_requests
        WHERE id = $1;
    `;
    await pool.query(query, [id]);
};
const getRequestById = async (id) => {
    const query = `
        SELECT * FROM shift_swap_requestsa
        WHERE id = $1;
    `;
    const values = [id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the first matching request
    } catch (error) {
        console.error('Error in getRequestById:', error);
        throw error;
    }
};
module.exports = {
    createShiftSwapRequest,
    getPendingRequests,
    updateShiftSwapRequest,
    deleteShiftSwapRequest,
    getRequestById, // Add this line
};