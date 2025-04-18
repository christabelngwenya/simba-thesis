import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const ThTd = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Button = styled.button`
  padding: 6px 12px;
  background-color: ${(props) => (props.approve ? '#4CAF50' : '#f44336')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    opacity: 0.8;
  }
`;

const AdminOvertimeManagement = () => {
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllOvertimeRequests = async () => {
      try {
        const response = await axios.get('/api/overtime/admin/requests');
        console.log('Fetched data:', response.data); // Log the fetched data
        setOvertimeRequests(response.data);
      } catch (err) {
        console.error('Error fetching overtime requests:', err); // Log the error
        setError('Failed to fetch overtime requests');
      }
    };
    fetchAllOvertimeRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/overtime/admin/requests/${id}`, { status });
      const updatedRequests = overtimeRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      );
      setOvertimeRequests(updatedRequests);
    } catch (err) {
      setError('Failed to update request status');
    }
  };

  return (
    <Container>
      <h1>Overtime Requests Management</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Table>
        <thead>
          <tr>
            <ThTd>Full Name</ThTd>
            <ThTd>Surname</ThTd>
            <ThTd>Job Title</ThTd>
            <ThTd>Overtime Date</ThTd>
            <ThTd>Start Time</ThTd>
            <ThTd>End Time</ThTd>
            <ThTd>Reason</ThTd>
            <ThTd>Status</ThTd>
            <ThTd>Actions</ThTd>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(overtimeRequests) ? (
    overtimeRequests.map((request) => (
      <tr key={request.id}>
        <ThTd>{request.full_name}</ThTd>
        <ThTd>{request.surname}</ThTd>
        <ThTd>{request.job_title}</ThTd>
        <ThTd>{new Date(request.overtime_date).toLocaleDateString()}</ThTd>
        <ThTd>{request.start_time}</ThTd>
        <ThTd>{request.end_time}</ThTd>
        <ThTd>{request.reason}</ThTd>
        <ThTd>{request.status}</ThTd>
        <ThTd>
          <Button approve onClick={() => handleUpdateStatus(request.id, 'Approved')}>
            Approve
          </Button>
          <Button onClick={() => handleUpdateStatus(request.id, 'Denied')}>
            Deny
          </Button>
        </ThTd>
      </tr>
    ))
  ) : null}
</tbody>

      </Table>
    </Container>
  );
};

export default AdminOvertimeManagement;