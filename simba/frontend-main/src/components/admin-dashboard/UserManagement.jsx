import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaClock } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
`;

const AddButton = styled.button`
  padding: 12px 20px;
  background: rgb(24, 52, 81);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  transition: 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgb(29, 57, 87);
  }
  svg {
    margin-right: 8px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  input {
    border: none;
    outline: none;
    flex: 1;
    margin-left: 10px;
    font-size: 16px;
  }
  svg {
    color: #888;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: rgb(27, 49, 73);
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  svg {
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const DialogBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease-in-out;
  width: 400px;
  text-align: center;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: red;
  font-size: 20px;
  z-index: 1001;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const FormButton = styled.button`
  padding: 10px 20px;
  background: rgb(33, 56, 80);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
  &:hover {
    background: rgb(16, 31, 47);
  }
`;

const DeleteConfirmationDialog = styled(DialogBox)`
  width: 300px;
`;

const DeleteButton = styled(FormButton)`
  background: rgb(130, 52, 60);
  margin-right: 10px;
  &:hover {
    background: rgb(130, 52, 60);
  }
`;

const CancelButton = styled(FormButton)`
  background: #6c757d;
  &:hover {
    background: #5a6268;
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [showAssignShiftDialog, setShowAssignShiftDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShift, setSelectedShift] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    emailaddress: '',
    password: '',
    role: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shifts");
        setShifts(response.data || []);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    fetchUsers();
    fetchShifts();
  }, []);

  const handleAssignShift = (user) => {
    if (user.role === 'Agent') {
      setSelectedUser(user);
      setShowAssignShiftDialog(true);
    }
  };

  const confirmAssignShift = async () => {
    if (!selectedUser || !selectedShift) return;
    try {
      await axios.post("http://localhost:5000/api/assign-shift", {
        userid: selectedUser.userid,
        shiftId: selectedShift,
      });
      setShowAssignShiftDialog(false);
      setSelectedShift('');
      alert('Shift assigned successfully!');
    } catch (error) {
      console.error("Error assigning shift:", error);
      alert('Failed to assign shift. Please try again.');
    }
  };

  const handleDeleteUser = (id) => {
    setDeletingUserId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deletingUserId}`);
      setUsers(users.filter((user) => user.userid !== deletingUserId));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setFormData({ 
      firstname: user.firstname,
      lastname: user.lastname,
      emailaddress: user.emailaddress,
      passwordhash: '',
      role: user.role
    });
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Debugging: Log the formData to ensure the password is captured
    console.log("Form Data Submitted:", formData);
  
    // Validate password for new users
    if (!formData.passwordhash && !editingUser) {
      alert("Password is required for new users.");
      return;
    }
  
    // Prepare the payload
    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      emailaddress: formData.emailaddress,
      role: formData.role,
    };
  
    // Include the password only if it's provided or for new users
    if (formData.passwordhash) {
      payload.password = formData.passwordhash;
    }
  
    try {
      let response;
      if (editingUser) {
        // Update user
        response = await axios.put(
          `http://localhost:5000/api/users/${editingUser.userid}`,
          payload
        );
        setUsers(
          users.map((user) =>
            user.userid === editingUser.userid ? response.data : user
          )
        );
      } else {
        // Create new user
        response = await axios.post("http://localhost:5000/api/users", payload);
        setUsers([...users, response.data]);
      }
  
      // Reset form and close dialog
      setShowDialog(false);
      setFormData({
        firstname: "",
        lastname: "",
        emailaddress: "",
        passwordhash: "",
        role: "",
      });
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || "Error saving user");
    }
  };
  
  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <AddButton onClick={() => setShowDialog(true)}>
          <FaPlus /> Add User
        </AddButton>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email Address</Th>
            <Th>Role</Th>
            <Th>Created Date</Th>
            <Th>Updated Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.userid}>
              <Td>{user.firstname}</Td>
              <Td>{user.lastname}</Td>
              <Td>{user.emailaddress}</Td>
              <Td>{user.role}</Td>
              <Td>{new Date(user.createddate).toLocaleDateString()}</Td>
              <Td>{new Date(user.updateddate).toLocaleDateString()}</Td>
              <Td>
                <ActionButtons>
                  <FaEdit color="rgb(16, 31, 47)" onClick={() => handleEditUser(user)} />
                  <FaTrash color="rgb(130, 52, 60)" onClick={() => handleDeleteUser(user.userid)} />
                  {user.role === 'Agent' && (
                    <FaClock color="blue" onClick={() => handleAssignShift(user)} />
                  )}
                </ActionButtons>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showAssignShiftDialog && (
        <Overlay onClick={() => setShowAssignShiftDialog(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <CloseIcon onClick={() => setShowAssignShiftDialog(false)} />
            <h3>Assign Shift to {selectedUser?.firstname} {selectedUser?.lastname}</h3>
            <FormSelect
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="">Select a Shift</option>
              {shifts.map((shift) => (
                <option key={shift.shift_id} value={shift.shift_id}>
                  {shift.shift_name} ({new Date(shift.shift_start_time).toLocaleString()} - {new Date(shift.shift_end_time).toLocaleString()})
                </option>
              ))}
            </FormSelect>
            <FormButton onClick={confirmAssignShift}>Assign</FormButton>
          </DialogBox>
        </Overlay>
      )}

      {showDeleteDialog && (
        <Overlay onClick={() => setShowDeleteDialog(false)}>
          <DeleteConfirmationDialog onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <DeleteButton onClick={confirmDelete}>Delete</DeleteButton>
            <CancelButton onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </CancelButton>
          </DeleteConfirmationDialog>
        </Overlay>
      )}

      {showDialog && (
        <Overlay onClick={() => setShowDialog(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <CloseIcon onClick={() => setShowDialog(false)} />
            <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleFormSubmit}>
              <FormInput
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                required
              />
              <FormInput
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                required
              />
              <FormInput
                type="email"
                name="emailaddress"
                placeholder="Email Address"
                value={formData.emailaddress}
                onChange={(e) => setFormData({ ...formData, emailaddress: e.target.value })}
                required
              />
              <FormInput
                type="password"
                name="passwordhash"
                placeholder="Password"
                value={formData.passwordhash}
                onChange={(e) => setFormData({ ...formData, passwordhash: e.target.value })}
                required={!editingUser}
              />
              <FormSelect
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
              </FormSelect>
              <FormButton type="submit">
                {editingUser ? 'Update User' : 'Add User'}
              </FormButton>
            </form>
          </DialogBox>
        </Overlay>
      )}
    </Container>
  );
};

export default UserManagement;