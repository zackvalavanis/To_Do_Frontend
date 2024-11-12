import { useLoaderData } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Modal } from './Modal.jsx';
import './Calendar.css';
import { ActivityShow } from './ActivityShow.jsx';
import * as dateFnsTz from 'date-fns-tz';
const zonedTimeToUtc = dateFnsTz.zonedTimeToUtc;



export function Calendar() {
  const activities = useLoaderData() || [];
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch and format activities once on mount
  useEffect(() => {
    const formattedEvents = activities.map((activity) => {
      const { id, name, start_datetime, end_datetime, description, finished } = activity;
  
      // Convert to Date objects
      const startLocal = new Date(start_datetime);
      const endLocal = new Date(end_datetime);
  
      // Check if the dates are valid
      if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
        console.error('Invalid date:', start_datetime, end_datetime);
        return null; // Skip invalid events
      }
  
      return { 
        id, 
        title: name, 
        start: startLocal,  // Pass Date objects
        end: endLocal,      // Pass Date objects
        description, 
        finished, 
        display: 'block' 
      };
    }).filter(event => event !== null); // Only include valid events
    
    setEvents(formattedEvents); // Update the state with the formatted events
  }, [activities]);

  // Handle event click (to show activity details)
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEventId(event.id);

    const clickedEvent = {
      title: event.title,
      description: event.extendedProps.description,
      start: event.start,
      end: event.end ? event.end : null,
      finished: event.extendedProps.finished,
    };
    setCurrentActivity(clickedEvent); // Store event details in currentActivity
    setIsModalVisible(true); // Show modal
  };

  // Handle date selection (no activity selected)
  const handleShow = (info) => {
    const selectedDate = info.start; // This is already a Date object in the local time zone
    setSelectedDate(selectedDate); // Set it as a Date object

    // Clear current activity (since no event is selected)
    setCurrentActivity({});
    setSelectedEventId(null);

    setIsModalVisible(true); // Show modal with selected date
  };

  // Create a new event on the backend
  const handleCreateEvent = async () => {
    try {
      // Ensure start and end times are in ISO format, and convert to Chicago time
      const startDateTime = new Date(selectedDate);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      // Convert both start and end times to Chicago time
      const chicagoTimeZone = 'America/Chicago';
      const formattedStartDateTime = zonedTimeToUtc(startDateTime, chicagoTimeZone).toISOString();
      const formattedEndDateTime = zonedTimeToUtc(endDateTime, chicagoTimeZone).toISOString();

      const newEvent = {
        name: 'New Activity', // Default name, can be edited in modal
        start_datetime: formattedStartDateTime,  // Send in ISO format
        end_datetime: formattedEndDateTime,      // Send in ISO format
        finished: false,
        time_zone: chicagoTimeZone,             // Include time zone if needed
      };

      // Send the new event data to your backend (use your API call method here)
      const response = await axios.post('/activities', { activity: newEvent });
      setEvents([...events, response.data]); // Add the new event to the calendar
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Close the modal
  const handleClose = () => { 
    setIsModalVisible(false);
    setSelectedEventId(null);
  };

  return (
    <div className="w-full h-[80vh] mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        select={handleShow}
        timeZone="local"  // This makes sure FullCalendar shows the events in the local time zone
        eventClick={handleEventClick}
      />
      <Modal show={isModalVisible} onClose={handleClose}>   
        <ActivityShow eventId={selectedEventId} selectedDate={selectedDate} activity={currentActivity} />
        {selectedDate && !selectedEventId && (
          <div>
            <button onClick={handleCreateEvent}>Create Event</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
