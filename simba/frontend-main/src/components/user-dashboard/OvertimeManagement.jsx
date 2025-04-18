import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color:rgb(21, 34, 65);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Message = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => (props.error ? "#dc3545" : "#28a745")};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background: rgb(23, 38, 55);
  color: white;
  padding: 10px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

const OvertimeManagement = () => {
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [requests, setRequests] = useState([]);

  // Fetch user's overtime requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/overtime", {
        params: { employeeId },
      });
      // Ensure the response data is an array
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setRequests([]); // Set to empty array in case of error
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchRequests();
    }
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fullName || !employeeId || !jobTitle || !date || !startTime || !endTime || !reason) {
      setError(true);
      setMessage("All fields are required!");
      return;
    }
  
    // Format the date as YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0];
  
    const newRequest = {
      fullName,
      employeeId,
      jobTitle,
      date: formattedDate, // Use the formatted date
      startTime,
      endTime,
      reason,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/overtime", newRequest);
      setMessage("Overtime request submitted successfully!");
      setError(false);
      fetchRequests(); // Refresh the list of requests
      // Clear the form
      setFullName("");
      setEmployeeId("");
      setJobTitle("");
      setDate(new Date());
      setStartTime("");
      setEndTime("");
      setReason("");
    } catch (err) {
      setError(true);
      setMessage("Error submitting overtime request. Please try again.");
      console.error("Error submitting request:", err);
    }
  };

  return (
    <Container>
      <h2>Overtime Request</h2>
      {message && <Message error={error}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select Date"
        />
        <Input
          type="time"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          type="time"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <TextArea
          placeholder="Reason for Overtime"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </Form>

      <h3>Your Overtime Requests</h3>
      <Table>
        <thead>
          <tr>
            <Th>Full Name</Th>
            <Th>Employee ID</Th>
            <Th>Job Title</Th>
            <Th>Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Reason</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <Td>{request.full_name}</Td>
                <Td>{request.employee_id}</Td>
                <Td>{request.job_title}</Td>
                <Td>{new Date(request.date).toLocaleDateString()}</Td>
                <Td>{request.start_time}</Td>
                <Td>{request.end_time}</Td>
                <Td>{request.reason}</Td>
                <Td>{request.status}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No overtime requests found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OvertimeManagement;