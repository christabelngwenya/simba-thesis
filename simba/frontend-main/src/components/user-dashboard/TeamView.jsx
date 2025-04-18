import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const styles = {
  container: {
    padding: '20px',
  },
  filters: {
    marginBottom: '20px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  calendar: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '700px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  thTd: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  eventContent: {
    fontSize: '0.9em',
    lineHeight: '1.2',
  },
};

const localizer = momentLocalizer(moment);

const TeamView = () => {
  const [schedules, setSchedules] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Static data for illustration
    const staticSchedules = [
      {
        id: 1,
        employeeName: 'John Doe',
        shiftType: 'Morning Shift',
        startTime: '2025-02-22T08:00:00',
        endTime: '2025-02-22T16:00:00',
        employeeId: 1,
        teamId: 'team1',
        role: 'Developer',
        department: 'Engineering',
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        shiftType: 'Evening Shift',
        startTime: '2025-02-22T16:00:00',
        endTime: '2025-02-22T23:00:00',
        employeeId: 2,
        teamId: 'team2',
        role: 'Designer',
        department: 'Design',
      },
    ];

    const staticTeams = [
      { id: 'team1', name: 'Team 1' },
      { id: 'team2', name: 'Team 2' },
    ];

    const staticRoles = [
      { id: 'developer', name: 'Developer' },
      { id: 'designer', name: 'Designer' },
    ];

    const staticDepartments = [
      { id: 'engineering', name: 'Engineering' },
      { id: 'design', name: 'Design' },
    ];

    setSchedules(staticSchedules);
    setTeams(staticTeams);
    setRoles(staticRoles);
    setDepartments(staticDepartments);
    setLoading(false);
  }, []);

  const filteredSchedules = schedules.filter(schedule => 
    (selectedTeam === 'all' || schedule.teamId === selectedTeam) &&
    (selectedRole === 'all' || schedule.role === selectedRole) &&
    (selectedDepartment === 'all' || schedule.department === selectedDepartment)
  );

  const events = filteredSchedules.map(schedule => ({
    id: schedule.id,
    title: `${schedule.employeeName} - ${schedule.shiftType}`,
    start: new Date(schedule.startTime),
    end: new Date(schedule.endTime),
    resource: {
      employeeId: schedule.employeeId,
      teamId: schedule.teamId,
      shiftType: schedule.shiftType
    }
  }));

  const CustomEvent = ({ event }) => (
    <div style={styles.eventContent}>
      <strong>{event.title}</strong>
      <div>
        {moment(event.start).format('HH:mm')} - 
        {moment(event.end).format('HH:mm')}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <select 
          style={styles.select}
          value={selectedTeam} 
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="all">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select 
          style={styles.select}
          value={selectedRole} 
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        <select 
          style={styles.select}
          value={selectedDepartment} 
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(department => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={styles.calendar}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              components={{
                event: CustomEvent
              }}
              views={['month', 'week', 'day']}
              defaultView="week"
            />
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thTd}>Employee Name</th>
                <th style={styles.thTd}>Shift Type</th>
                <th style={styles.thTd}>Start Time</th>
                <th style={styles.thTd}>End Time</th>
                <th style={styles.thTd}>Team</th>
                <th style={styles.thTd}>Role</th>
                <th style={styles.thTd}>Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map(schedule => (
                <tr key={schedule.id}>
                  <td style={styles.thTd}>{schedule.employeeName}</td>
                  <td style={styles.thTd}>{schedule.shiftType}</td>
                  <td style={styles.thTd}>{moment(schedule.startTime).format('YYYY-MM-DD HH:mm')}</td>
                  <td style={styles.thTd}>{moment(schedule.endTime).format('YYYY-MM-DD HH:mm')}</td>
                  <td style={styles.thTd}>{teams.find(team => team.id === schedule.teamId)?.name}</td>
                  <td style={styles.thTd}>{schedule.role}</td>
                  <td style={styles.thTd}>{schedule.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TeamView;