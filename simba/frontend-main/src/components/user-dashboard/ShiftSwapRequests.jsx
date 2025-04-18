import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftSwapRequests = () => {
    const [requests, setRequests] = useState([]);
    const [requesterName, setRequesterName] = useState("");
    const [requesterEmployeeId, setRequesterEmployeeId] = useState("");
    const [colleagueName, setColleagueName] = useState("");
    const [currentShiftName, setCurrentShiftName] = useState("");
    const [desiredShiftName, setDesiredShiftName] = useState("");
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [requesterEmail, setRequesterEmail] = useState(""); // New state for email
    const [showRequests, setShowRequests] = useState(false);
    const [editId, setEditId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch pending requests from the backend
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shift-swap/pending');
            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    useEffect(() => {
        if (showRequests) {
            fetchPendingRequests();
        }
    }, [showRequests]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!requesterName || !requesterEmployeeId || !colleagueName || !currentShiftName || !desiredShiftName || !reason.trim() || !startDate || !endDate || !requesterEmail) {
            alert("All fields are required!");
            return;
        }

        const newRequest = {
            requesterName,
            requesterEmployeeId,
            colleagueName,
            currentShiftName,
            desiredShiftName,
            reason,
            shiftStart: startDate,
            shiftEnd: endDate,
            requesterEmail, // Include email in the request
        };

        try {
            let response;
            if (editId) {
                response = await axios.put(`http://localhost:5000/api/shift-swap/${editId}`, newRequest);
                setEditId(null);
            } else {
                response = await axios.post('http://localhost:5000/api/shift-swap', newRequest);
            }
            console.log('Response:', response.data);
            setSuccessMessage("Your request has been successfully submitted. You will be responded to shortly.");
            fetchPendingRequests();
            resetForm();
            setTimeout(() => setSuccessMessage(""), 5000); // Clear success message after 5 seconds
        } catch (error) {
            console.error('Error submitting shift swap request:', error);
        }
    };

    const resetForm = () => {
        setRequesterName("");
        setRequesterEmployeeId("");
        setColleagueName("");
        setCurrentShiftName("");
        setDesiredShiftName("");
        setReason("");
        setStartDate("");
        setEndDate("");
        setRequesterEmail(""); // Reset email field
    };

    const handleEdit = (id) => {
        const requestToEdit = requests.find((request) => request.id === id);
        if (requestToEdit) {
            setRequesterName(requestToEdit.requester_name);
            setRequesterEmployeeId(requestToEdit.requester_employee_id);
            setColleagueName(requestToEdit.colleague_name);
            setCurrentShiftName(requestToEdit.current_shift_name);
            setDesiredShiftName(requestToEdit.desired_shift_name);
            setReason(requestToEdit.reason);
            setStartDate(requestToEdit.shift_start);
            setEndDate(requestToEdit.shift_end);
            setRequesterEmail(requestToEdit.requester_email); // Set email field
            setEditId(id);
        }
    };

    // Internal styling
    const styles = {
        container: {
            maxWidth: "700px",
            margin: "auto",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        heading: { color: "#2c3e50" },
        form: { display: "flex", flexDirection: "column", gap: "10px" },
        input: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
        },
        button: {
            backgroundColor: "#2c3e50",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        pendingButton: {
            backgroundColor: "blue",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "default", // Disable click
        },
        successMessage: {
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
        },
        tableContainer: { marginTop: "20px", textAlign: "left" },
        table: { width: "100%", borderCollapse: "collapse" },
        thTd: { border: "1px solid #ddd", padding: "8px", textAlign: "left" },
        tableHeader: { backgroundColor: "#2c3e50", color: "white" },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Shift Swap Requests</h2>

            {/* Success Message */}
            {successMessage && (
                <div style={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <label> Your Name: </label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    style={styles.input}
                />

                <label> Your Employee ID: </label>
                <input
                    type="text"
                    placeholder="Enter your employee ID"
                    value={requesterEmployeeId}
                    onChange={(e) => setRequesterEmployeeId(e.target.value)}
                    style={styles.input}
                />

                <label> Your Email: </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    style={styles.input}
                />

                <label> Colleague's Name: </label>
                <input
                    type="text"
                    placeholder="Enter colleague's name"
                    value={colleagueName}
                    onChange={(e) => setColleagueName(e.target.value)}
                    style={styles.input}
                />

                <label> Current Shift Name: </label>
                <input
                    type="text"
                    placeholder="Enter current shift name"
                    value={currentShiftName}
                    onChange={(e) => setCurrentShiftName(e.target.value)}
                    style={styles.input}
                />

                <label> Desired Shift Name: </label>
                <input
                    type="text"
                    placeholder="Enter desired shift name"
                    value={desiredShiftName}
                    onChange={(e) => setDesiredShiftName(e.target.value)}
                    style={styles.input}
                />

                <label> Reason for Swap: </label>
                <textarea
                    placeholder="Provide a reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={styles.input}
                ></textarea>

                <label> Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                />

                <label> End Date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    {editId ? "Update Swap Request" : "Submit Swap Request"}
                </button>
            </form>

            {/* Display pending requests */}
            {showRequests && (
                <div style={styles.tableContainer}>
                    <h3>Pending Requests</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Requester Name</th>
                                <th style={styles.tableHeader}>Colleague Name</th>
                                <th style={styles.tableHeader}>Current Shift</th>
                                <th style={styles.tableHeader}>Desired Shift</th>
                                <th style={styles.tableHeader}>Reason</th>
                                <th style={styles.tableHeader}>Start Date</th>
                                <th style={styles.tableHeader}>End Date</th>
                                <th style={styles.tableHeader}>Email</th>
                                <th style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td style={styles.thTd}>{request.requester_name}</td>
                                    <td style={styles.thTd}>{request.colleague_name}</td>
                                    <td style={styles.thTd}>{request.current_shift_name}</td>
                                    <td style={styles.thTd}>{request.desired_shift_name}</td>
                                    <td style={styles.thTd}>{request.reason}</td>
                                    <td style={styles.thTd}>{request.shift_start}</td>
                                    <td style={styles.thTd}>{request.shift_end}</td>
                                    <td style={styles.thTd}>{request.requester_email}</td>
                                    <td style={styles.thTd}>
                                        <button onClick={() => handleEdit(request.id)} style={styles.button}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShiftSwapRequests;