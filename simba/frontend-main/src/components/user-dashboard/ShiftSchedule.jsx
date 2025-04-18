import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import axios from 'axios';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';
import styled from '@emotion/styled';

// Styled components for better CSS management
const Container = styled.div`
  padding: 20px;
  height: 100vh;
`;

const CalendarContainer = styled.div`
  height: calc(100% - 40px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const localizer = momentLocalizer(moment);

// Validation function for API response
const isValidShift = (shift) => {
  return (
    shift?.id &&
    moment(shift.startTime).isValid() &&
    moment(shift.endTime).isValid() &&
    shift.type &&
    shift.location
  );
};

const ShiftSchedule = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Dynamic API call (commented out for now) ---
  // const fetchShifts = useCallback(async () => {
  //   try {
  //     const { data } = await axios.get('/api/shifts', {
  //       timeout: 10000, // 10-second timeout
  //     });

  //     const formattedShifts = data.reduce((acc, shift) => {
  //       if (!isValidShift(shift)) {
  //         console.warn('Invalid shift format:', shift);
  //         return acc;
  //       }

  //       const start = moment(shift.startTime).toDate();
  //       const end = moment(shift.endTime).toDate();

  //       if (start >= end) {
  //         console.warn('Invalid shift times:', shift);
  //         return acc;
  //       }

  //       return [
  //         ...acc,
  //         {
  //           id: shift.id,
  //           title: `${shift.type} - ${shift.location}`,
  //           start,
  //           end,
  //           resource: {
  //             type: shift.type,
  //             location: shift.location,
  //             breaks: shift.breaks || [],
  //           },
  //         },
  //       ];
  //     }, []);

  //     setShifts(formattedShifts);
  //     setError(null);
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //       err.message ||
  //       'Failed to load shifts'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    // Static data for demonstration
    const staticShifts = [
      {
        id: 1,
        type: 'Morning Shift',
        location: 'Hospital A',
        startTime: moment().add(1, 'days').set({ hour: 8, minute: 0 }).toISOString(),
        endTime: moment().add(1, 'days').set({ hour: 16, minute: 0 }).toISOString(),
        breaks: ['10:00-10:15', '12:00-12:30']
      },
      {
        id: 2,
        type: 'Evening Shift',
        location: 'Hospital B',
        startTime: moment().add(1, 'days').set({ hour: 16, minute: 0 }).toISOString(),
        endTime: moment().add(1, 'days').set({ hour: 22, minute: 0 }).toISOString(),
        breaks: ['18:00-18:15', '20:00-20:30']
      }
    ];

    const formattedShifts = staticShifts.reduce((acc, shift) => {
      if (!isValidShift(shift)) {
        console.warn('Invalid shift format:', shift);
        return acc;
      }

      const start = moment(shift.startTime).toDate();
      const end = moment(shift.endTime).toDate();

      if (start >= end) {
        console.warn('Invalid shift times:', shift);
        return acc;
      }

      return [
        ...acc,
        {
          id: shift.id,
          title: `${shift.type} - ${shift.location}`,
          start,
          end,
          resource: {
            type: shift.type,
            location: shift.location,
            breaks: shift.breaks || [],
          },
        },
      ];
    }, []);

    setShifts(formattedShifts);
    setLoading(false);
  }, []);

  const CustomEvent = useCallback(({ event }) => (
    <div style={{ padding: '4px', fontSize: '0.9em' }}>
      <strong>{event.title}</strong>
      <div>
        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
      </div>
      {event.resource.breaks.length > 0 && (
        <div>
          Breaks: {event.resource.breaks.join(', ')}
        </div>
      )}
    </div>
  ), []);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <CalendarContainer>
        <Calendar
          localizer={localizer}
          events={shifts}
          startAccessor="start"
          endAccessor="end"
          components={{ event: CustomEvent }}
          views={['day', 'week', 'month']}
          defaultView="week"
          defaultDate={new Date()}
          min={new Date(new Date().setHours(6, 0, 0))}  // 6 AM
          max={new Date(new Date().setHours(22, 0, 0))}  // 10 PM
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.resource.type.includes('Morning') ? '#90caf9' : '#ef9a9a',
              borderRadius: '4px',
              border: 'none',
            },
          })}
        />
      </CalendarContainer>
    </Container>
  );
};

ShiftSchedule.propTypes = {
  // Add PropTypes if this component receives any props
};

export default ShiftSchedule;