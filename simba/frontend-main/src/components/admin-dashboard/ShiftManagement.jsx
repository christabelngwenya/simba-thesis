import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import Modal from "react-modal";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FloatingContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const FloatingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  margin: 1.5rem 0;
  th, td {
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  th {
    background: rgba(27, 43, 60, 0.9);
    color: white;
  }
`;

const FloatingButton = styled.button`
  background: ${props => props.danger ? 'rgba(231, 76, 60, 0.9)' : 'rgba(27, 43, 60, 0.9)'};
  color: white;
  border: none;
  padding: ${props => props.small ? '0.5rem 1rem' : '0.8rem 1.5rem'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;
  &:hover {
    background: ${props => props.danger ? 'rgba(231, 76, 60, 1)' : 'rgba(27, 43, 60, 1)'};
    transform: translateY(-2px);
  }
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  min-width: 500px;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);
  }
  input, select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.8);
    &:focus {
      outline: 2px solid rgba(27, 43, 60, 0.5);
    }
  }
`;

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)"
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'none',
    border: 'none',
    padding: '0'
  }
};

const ShiftManagement = () => {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [showShiftTypeModal, setShowShiftTypeModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [shiftsRes, shiftTypesRes] = await Promise.all([
          api.get("/shifts"),
          api.get("/shift-types")
        ]);
        
        setShifts(shiftsRes.data);
        setShiftTypes(shiftTypesRes.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShiftTypeSubmit = async () => {
    const newErrors = {};
    if (!formData.shiftname) newErrors.shiftname = "Required";
    if (!formData.defaultduration || formData.defaultduration < 1) 
      newErrors.defaultduration = "Must be at least 1 hour";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const method = isEditMode ? "put" : "post";
      const url = isEditMode ? `/shift-types/${formData.shifttypeid}` : "/shift-types";
      
      const { data } = await api[method](url, {
        shiftname: formData.shiftname,
        defaultduration: formData.defaultduration,
        shiftcategory: formData.shiftcategory
      });

      setShiftTypes(prev => isEditMode ? 
        prev.map(st => st.shifttypeid === data.shifttypeid ? data : st) : 
        [...prev, data]
      );
      setShowShiftTypeModal(false);
      setFormData({});
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Operation failed" });
    }
  };

  const handleShiftSubmit = async () => {
    const newErrors = {};
    if (!formData.shifttypeid) newErrors.shifttypeid = "Required";
    if (!formData.shiftstarttime) newErrors.shiftstarttime = "Required";
    if (!formData.shiftendtime) newErrors.shiftendtime = "Required";
    if (formData.shiftendtime <= formData.shiftstarttime) {
      newErrors.shiftendtime = "Must be after start time";
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const method = isEditMode ? "put" : "post";
      const url = isEditMode ? `/shifts/${formData.shiftid}` : "/shifts";
      
      const { data } = await api[method](url, {
        shifttypeid: formData.shifttypeid,
        shiftstarttime: new Date(formData.shiftstarttime).toISOString(),
        shiftendtime: new Date(formData.shiftendtime).toISOString(),
        shiftlocation: formData.shiftlocation || null
      });

      setShifts(prev => isEditMode ? 
        prev.map(s => s.shiftid === data.shiftid ? data : s) : 
        [...prev, data]
      );
      setShowShiftModal(false);
      setFormData({});
    } catch (err) {
      console.error("Shift submission error:", err.response?.data);
      setErrors({ 
        submit: err.response?.data?.message || "Failed to save shift" 
      });
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await api.delete(`/shifts/${shiftId}`);
      setShifts(prev => prev.filter(shift => shift.shiftid !== shiftId));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleDeleteShiftType = async (shiftTypeId) => {
    try {
      await api.delete(`/shift-types/${shiftTypeId}`);
      setShiftTypes(prev => prev.filter(st => st.shifttypeid !== shiftTypeId));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEditShiftType = (shiftType) => {
    setFormData({
      shiftname: shiftType.shiftname,
      defaultduration: shiftType.defaultduration,
      shiftcategory: shiftType.shiftcategory,
      shifttypeid: shiftType.shifttypeid
    });
    setIsEditMode(true);
    setShowShiftTypeModal(true);
  };

  const handleEditShift = (shift) => {
    setFormData({
      ...shift,
      shiftstarttime: new Date(shift.shiftstarttime),
      shiftendtime: new Date(shift.shiftendtime)
    });
    setIsEditMode(true);
    setShowShiftModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <FloatingContainer>
      <h2>Shift Management</h2>
      <ActionSection>
        <FloatingButton onClick={() => setShowShiftTypeModal(true)}>
          + New Shift Type
        </FloatingButton>
        <FloatingButton onClick={() => setShowShiftModal(true)}>
          + New Shift
        </FloatingButton>
      </ActionSection>

      <FloatingTable>
        <thead>
          <tr>
            <th>Shift Type</th>
            <th>Default Duration</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shiftTypes.map(type => (
            <tr key={type.shifttypeid}>
              <td>{type.shiftname}</td>
              <td>{type.defaultduration}h</td>
              <td>{type.shiftcategory || '-'}</td>
              <td>
                <FloatingButton small onClick={() => handleEditShiftType(type)}>
                  Edit
                </FloatingButton>
                <FloatingButton small danger onClick={() => handleDeleteShiftType(type.shifttypeid)}>
                  Delete
                </FloatingButton>
              </td>
            </tr>
          ))}
        </tbody>
      </FloatingTable>

      <FloatingTable>
        <thead>
          <tr>
            <th>Shift Type</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift.shiftid}>
              <td>{shiftTypes.find(t => t.shifttypeid === shift.shifttypeid)?.shiftname || shift.shifttypeid}</td>
              <td>{new Date(shift.shiftstarttime).toLocaleString()}</td>
              <td>{new Date(shift.shiftendtime).toLocaleString()}</td>
              <td>
                {Math.round(
                  (new Date(shift.shiftendtime) - new Date(shift.shiftstarttime)) / 3600000
                )}h
              </td>
              <td>
                <FloatingButton small onClick={() => handleEditShift(shift)}>
                  Edit
                </FloatingButton>
                <FloatingButton small danger onClick={() => handleDeleteShift(shift.shiftid)}>
                  Delete
                </FloatingButton>
              </td>
            </tr>
          ))}
        </tbody>
      </FloatingTable>

      <Modal
        isOpen={showShiftTypeModal}
        onRequestClose={() => {
          setShowShiftTypeModal(false);
          setIsEditMode(false);
          setFormData({});
        }}
        style={customStyles}
      >
        <ModalContent>
          <h3>{isEditMode ? 'Edit' : 'Create New'} Shift Type</h3>
          <FormField>
            <label>Shift Name</label>
            <input
              value={formData.shiftname || ''}
              onChange={e => setFormData({...formData, shiftname: e.target.value})}
            />
            {errors.shiftname && <div className="error">{errors.shiftname}</div>}
          </FormField>
          <FormField>
            <label>Default Duration (hours)</label>
            <input
              type="number"
              value={formData.defaultduration || ''}
              onChange={e => setFormData({...formData, defaultduration: parseInt(e.target.value)})}
              min="1"
            />
            {errors.defaultduration && <div className="error">{errors.defaultduration}</div>}
          </FormField>
          <FormField>
            <label>Category</label>
            <select
              value={formData.shiftcategory || ''}
              onChange={e => setFormData({...formData, shiftcategory: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgical">Surgical</option>
              <option value="Outpatient">Outpatient</option>
            </select>
          </FormField>
          {errors.submit && <div className="error">{errors.submit}</div>}
          <ActionSection>
            <FloatingButton onClick={handleShiftTypeSubmit}>
              Save
            </FloatingButton>
            <FloatingButton onClick={() => {
              setShowShiftTypeModal(false);
              setIsEditMode(false);
              setFormData({});
            }}>
              Cancel
            </FloatingButton>
          </ActionSection>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showShiftModal}
        onRequestClose={() => {
          setShowShiftModal(false);
          setIsEditMode(false);
          setFormData({});
          setErrors({});
        }}
        style={customStyles}
      >
        <ModalContent>
          <h3>{isEditMode ? 'Edit' : 'Create New'} Shift</h3>
          <FormField>
            <label>Shift Type</label>
            <select
              value={formData.shifttypeid || ''}
              onChange={e => setFormData({...formData, shifttypeid: e.target.value})}
            >
              <option value="">Select Shift Type</option>
              {shiftTypes.map(type => (
                <option key={type.shifttypeid} value={type.shifttypeid}>
                  {type.shiftname}
                </option>
              ))}
            </select>
            {errors.shifttypeid && <div className="error">{errors.shifttypeid}</div>}
          </FormField>
          <FormField>
            <label>Start Time</label>
            <input
              type="datetime-local"
              value={formData.shiftstarttime?.toISOString()?.slice(0, 16) || ''}
              onChange={e => setFormData({
                ...formData, 
                shiftstarttime: new Date(e.target.value)
              })}
            />
            {errors.shiftstarttime && <div className="error">{errors.shiftstarttime}</div>}
          </FormField>
          <FormField>
            <label>End Time</label>
            <input
              type="datetime-local"
              value={formData.shiftendtime?.toISOString()?.slice(0, 16) || ''}
              onChange={e => setFormData({
                ...formData, 
                shiftendtime: new Date(e.target.value)
              })}
            />
            {errors.shiftendtime && <div className="error">{errors.shiftendtime}</div>}
          </FormField>
          <FormField>
            <label>Location</label>
            <input
              value={formData.shiftlocation || ''}
              onChange={e => setFormData({...formData, shiftlocation: e.target.value})}
              placeholder="Enter shift location"
            />
          </FormField>
          {errors.submit && <div className="error">{errors.submit}</div>}
          <ActionSection>
            <FloatingButton onClick={handleShiftSubmit}>
              {isEditMode ? 'Update' : 'Save'}
            </FloatingButton>
            <FloatingButton onClick={() => {
              setShowShiftModal(false);
              setIsEditMode(false);
              setFormData({});
              setErrors({});
            }}>
              Cancel
            </FloatingButton>
          </ActionSection>
        </ModalContent>
      </Modal>
    </FloatingContainer>
  );
};

export default ShiftManagement;