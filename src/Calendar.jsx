import { useLoaderData } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
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
  const [isEventModal, setIsEventModal] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null); // Ref for the calendar

  useEffect(() => {
    const formattedEvents = activities.map((activity) => {
      const { id, name, start_datetime, end_datetime, description, finished } = activity;

      const startUTC = new Date(start_datetime); 
      const endUTC = new Date(end_datetime);   

      if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
        console.error('Invalid date:', start_datetime, end_datetime);
        return null; // Skip invalid events
      }

      return { 
        id, 
        title: name, 
        start: startUTC,  
        end: endUTC,      
        description, 
        finished, 
        display: 'block' 
      };
    }).filter(event => event !== null); 

    setEvents(formattedEvents); 
  }, [activities]);

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
    setIsEventModal(true); // Make modal larger for event details
  };

  const handleShow = (info) => {
    console.log("Date clicked:", info.start);  // Check if this logs when clicking a date
    const selectedDate = info.start; 
    setSelectedDate(selectedDate); 

    setCurrentActivity({});
    setSelectedEventId(null);

    setIsModalVisible(true);
    setIsEventModal(false); // Modal should be smaller for date selection
  };

  const handleClose = () => { 
    setIsModalVisible(false);
    setSelectedEventId(null);
    setIsEventModal(false); // Reset the modal size
  };

  const handleDatesSet = (info) => {
    const monthIndex = info.view.currentStart.getMonth(); 
    const backgroundColor = getMonthBackgroundColor(monthIndex);
    
    const calendarApi = calendarRef.current?.getApi();
    const calendarElement = calendarApi?.el;
    
    if (calendarElement) {
      const monthGrid = calendarElement.querySelector('.fc-dayGridMonth-view');
      if (monthGrid) {
        monthGrid.style.backgroundColor = backgroundColor;
      } else {
        console.error("Month grid view not found.");
      }
    }
  };

  const getMonthBackgroundColor = (monthIndex) => {
    switch (monthIndex) {
      case 9: return 'rgba(255, 69, 0, 0.4)';
      case 10: return 'rgba(34, 139, 34, 0.4)';
      case 11: return 'rgba(255, 215, 0, 0.4)';
      case 0: return 'rgba(255, 182, 193, 0.4)';
      default: return 'rgba(255, 255, 255, 0.4)';
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        select={handleShow}
        timeZone="UTC"
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
      />
      <Modal show={isModalVisible} onClose={handleClose} isLarge={isEventModal}>   
        <ActivityShow 
          eventId={selectedEventId} 
          selectedDate={selectedDate} 
          activity={currentActivity} 
          setEvents={setEvents} />
      </Modal>
    </div>
  );
}
