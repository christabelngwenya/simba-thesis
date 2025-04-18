import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminShiftSwapRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [reasons, setReasons] = useState({}); // State for reasons by request ID
    const [error, setError] = useState(null); // State for error messages
    const [success, setSuccess] = useState(null); // State for success messages

    // Fetch pending requests from the backend
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shift-swap/pending');
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            setError('Failed to fetch pending requests. Please try again.');
        }
    };

    // Handle approve/reject action
   const handleAction = async (id, action, requesterEmail) => {
    const reason = reasons[id];
    if (!reason) {
        setError('Please provide a reason for your decision.');
        return;
    }

    try {
        const response = await axios.put(`http://localhost:5000/api/shift-swap/${id}/action`, {
            status: action,
            reason: reason,
            requesterEmail: requesterEmail,
        });

        setSuccess(response.data.message);
        fetchPendingRequests();
        setReasons({ ...reasons, [id]: '' });
    } catch (error) {
        console.error('Error updating request status:', error);
        if (error.response) {
            setError(error.response.data.message || 'Failed to update request status.');
        } else {
            setError('Network error. Please try again.');
        }
    }
};

    // Fetch data on component mount
    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Basic styling
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        heading: {
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        th: {
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '12px',
            textAlign: 'left',
        },
        td: {
            border: '1px solid #ddd',
            padding: '10px',
            textAlign: 'left',
        },
        tr: {
            backgroundColor: '#f9f9f9',
        },
        button: {
            margin: '0 5px',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            border: 'none',
            color: 'white',
        },
        approveButton: {
            backgroundColor: '#2f3b52',
            '&:hover': {
                backgroundColor: '#2f3b52',
            },
        },
        rejectButton: {
            backgroundColor: '#dc3545',
            '&:hover': {
                backgroundColor: '#c82333',
            },
        },
        reasonInput: {
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
        },
        success: {
            color: 'green',
            marginBottom: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Pending Shift Swap Requests</h1>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Requester Name</th>
                        <th style={styles.th}>Employee ID</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Colleague Name</th>
                        <th style={styles.th}>Current Shift</th>
                        <th style={styles.th}>Desired Shift</th>
                        <th style={styles.th}>Reason</th>
                        <th style={styles.th}>Start Date</th>
                        <th style={styles.th}>End Date</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.map((request) => (
                        <tr key={request.id} style={styles.tr}>
                            <td style={styles.td}>{request.requester_name}</td>
                            <td style={styles.td}>{request.requester_employee_id}</td>
                            <td style={styles.td}>{request.requester_email}</td>
                            <td style={styles.td}>{request.colleague_name}</td>
                            <td style={styles.td}>{request.current_shift_name}</td>
                            <td style={styles.td}>{request.desired_shift_name}</td>
                            <td style={styles.td}>{request.reason}</td>
                            <td style={styles.td}>{request.shift_start}</td>
                            <td style={styles.td}>{request.shift_end}</td>
                            <td style={styles.td}>{request.status}</td>
                            <td style={styles.td}>
                                <input
                                    type="text"
                                    placeholder="Enter reason"
                                    value={reasons[request.id] || ''}
                                    onChange={(e) => setReasons({ ...reasons, [request.id]: e.target.value })}
                                    style={styles.reasonInput}
                                />
                                <button
                                    style={{ ...styles.button, ...styles.approveButton }}
                                    onClick={() => handleAction(request.id, 'approved', request.requester_email)}
                                >
                                    Approve
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.rejectButton }}
                                    onClick={() => handleAction(request.id, 'rejected', request.requester_email)}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminShiftSwapRequests;