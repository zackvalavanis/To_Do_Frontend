import { useLoaderData } from 'react-router-dom';
import React, { useState, useEffect, useRef} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Modal } from './Modal.jsx';
import './Calendar.css';
import { ActivityShow } from './ActivityShow.jsx';


export function Calendar() {
  const activities = useLoaderData() || [];
  const [events, setEvents] = useState([]); // change to curly and see if it works 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
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
  };


  const handleShow = (info) => {
    const selectedDate = info.start; 
    setSelectedDate(selectedDate); 

    setCurrentActivity({});
    setSelectedEventId(null);

    setIsModalVisible(true);
  };

  
  const handleClose = () => { 
    setIsModalVisible(false);
    setSelectedEventId(null);
  };

  const getMonthBackgroundColor = (monthIndex) => {
    switch (monthIndex) {
      case 9: return 'rgba(255, 69, 0, 0.4)';  
      case 10: return 'rgba(34, 139, 34, 0.4)';  
      case 11: return 'rgba(255, 215, 0, 0.4)'; 
      case 0: return 'rgba(255, 182, 193, 0.4)'; 
      case 1: return 'rgba(34, 139, 34, 0.4)';  
      case 2: return 'rgba(255, 255, 224, 0.4)'; 
      case 3: return 'rgba(230, 230, 250, 0.4)'; 
      case 4: return 'rgba(135, 206, 235, 0.4)'; 
      case 5: return 'rgba(255, 0, 0, 0.4)';    
      case 6: return 'rgba(255, 127, 80, 0.4)';
      case 7: return 'rgba(255, 140, 0, 0.4)';  
      case 8: return 'rgba(255, 94, 77, 0.4)';  
      default: return 'rgba(255, 255, 255, 0.4)'; 
    }
  };

    const handleDatesSet = (info) => {
      const monthIndex = info.view.currentStart.getMonth(); 
      const backgroundColor = getMonthBackgroundColor(monthIndex);
    
      const calendarApi = calendarRef.current?.getApi();
      const calendarElement = calendarApi?.el;
    
      if (calendarElement) {
        // Target the specific view container for the month grid
        const monthGrid = calendarElement.querySelector('.fc-dayGridMonth-view'); // FullCalendar class for the month view
        if (monthGrid) {
          monthGrid.style.backgroundColor = backgroundColor; // Set background color for the month grid
        } else {
          console.error("Month grid view not found.");
        }
      }
    };
    
    
  

  return (
   <div className="w-full h-[80vh] mx-auto">
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
      <Modal show={isModalVisible} onClose={handleClose}>   
        <ActivityShow 
        eventId={selectedEventId} 
        selectedDate={selectedDate} 
        activity={currentActivity} 
        setEvents={setEvents}/>
      </Modal>
    </div>
  );
}
