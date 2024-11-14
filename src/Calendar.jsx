import { useLoaderData } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Modal } from './Modal.jsx';
import './Calendar.css';
import { ActivityShow } from './ActivityShow.jsx';

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

      // Create Date objects from the UTC start and end times
      const startUTC = new Date(start_datetime); // Date object in UTC
      const endUTC = new Date(end_datetime);     // Date object in UTC

      if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
        console.error('Invalid date:', start_datetime, end_datetime);
        return null; // Skip invalid events
      }

      return { 
        id, 
        title: name, 
        start: startUTC,  // Use UTC Date objects directly
        end: endUTC,      // Use UTC Date objects directly
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
    const selectedDate = info.start; // This is already a Date object in UTC
    setSelectedDate(selectedDate); // Set it as a Date object

    // Clear current activity (since no event is selected)
    setCurrentActivity({});
    setSelectedEventId(null);

    setIsModalVisible(true); // Show modal with selected date
  };

  // Create a new event on the backend
  
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
        timeZone="UTC"  // Set to UTC to display everything in UTC
        eventClick={handleEventClick}
      />
      <Modal show={isModalVisible} onClose={handleClose}>   
        <ActivityShow eventId={selectedEventId} selectedDate={selectedDate} activity={currentActivity} />
      </Modal>
    </div>
  );
}
