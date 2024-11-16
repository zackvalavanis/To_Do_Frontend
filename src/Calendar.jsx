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

      // Create Date objects from the UTC start and end times
      const startUTC = new Date(start_datetime); // Date object in UTC
      const endUTC = new Date(end_datetime);     // Date object in UTC

      if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
        console.error('Invalid date:', start_datetime, end_datetime);
        return null; // Skip invalid events
      }
      // console.log(start_datetime)

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

  const getMonthBackgroundColor = (monthIndex) => {
    console.log("Month Index: ", monthIndex); // Log the current month index
    switch (monthIndex) {
      case 9: return 'rgba(255, 69, 0, 0.4)';  // November - Autumn Red (Thanksgiving)
      case 10: return 'rgba(34, 139, 34, 0.4)';  // December - Red (Christmas)
      case 11: return 'rgba(255, 215, 0, 0.4)'; // January - Bright Gold (New Year)
      case 0: return 'rgba(255, 182, 193, 0.4)'; // February - Soft Pink (Valentine's Day)
      case 1: return 'rgba(34, 139, 34, 0.4)';  // March - Emerald Green (St. Patrick's Day)
      case 2: return 'rgba(255, 255, 224, 0.4)'; // April - Pastel Yellow (Easter)
      case 3: return 'rgba(230, 230, 250, 0.4)'; // May - Lavender (Mother's Day)
      case 4: return 'rgba(135, 206, 235, 0.4)'; // June - Sky Blue (Summer)
      case 5: return 'rgba(255, 0, 0, 0.4)';    // July - Red (Independence Day)
      case 6: return 'rgba(255, 127, 80, 0.4)'; // August - Bright Coral (Beach/Hot Weather)
      case 7: return 'rgba(255, 140, 0, 0.4)';  // September - Pumpkin Orange (Fall/Harvest)
      case 8: return 'rgba(255, 94, 77, 0.4)';  // October - Pumpkin Orange (Fall/Harvest)
      default: return 'rgba(255, 255, 255, 0.4)'; // Default - White
    }
  };

    const handleDatesSet = (info) => {
      const monthIndex = info.view.currentStart.getMonth(); // Get the current month index
      const backgroundColor = getMonthBackgroundColor(monthIndex);
    
      const calendarApi = calendarRef.current?.getApi();
      const calendarElement = calendarApi?.el;
    
      console.log('calendarElement:', calendarElement); // Log for debugging
      console.log('backgroundColor:', backgroundColor); // Log for debugging
    
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
        datesSet={handleDatesSet}  // Use datesSet instead of datesRender
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
