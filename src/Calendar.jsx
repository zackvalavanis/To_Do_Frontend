import { useLoaderData } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Modal } from './Modal.jsx';
import './Calendar.css';
import { ActivityShow } from './ActivityShow.jsx'

export function Calendar() {
  const activities = useLoaderData() || [];
  const [events, setEvents] = useState([]);
  const [ stuff, setStuff] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [ currentActivity, setCurrentActivity] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null); // Store selected event ID

  useEffect(() => {
    const formattedEvents = activities.map((activity) => {
      const { id, title, start, end, description, finished } = activity;

      // Ensure that start and end are in the correct ISO 8601 format (with timezone info)
      const startLocal = new Date(start).toISOString();
      const endLocal = new Date(end).toISOString();

      if (isNaN(new Date(startLocal).getTime()) || isNaN(new Date(endLocal).getTime())) {
        console.error('Invalid date:', start, end);
        return null;  // Skip if dates are invalid
      }

      return { 
        id, 
        title, 
        start: startLocal, 
        end: endLocal, 
        description, 
        finished, 
        display: 'block'  // This makes the event visible
      };
    }).filter(event => event !== null);  // Remove invalid events

    setEvents(formattedEvents);
  }, [activities]);  // Re-run whenever activities data changes


  const handleIndex = () => { 
    // console.log(handleIndex);
    axios.get("http://localhost:3000/activities.json").then((response) => { 
      console.log(response.data);
      setStuff([...stuff, response.data])
    })
  }

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    // console.log('Event ID', event.id);
    if (event.id) {
      setSelectedEventId(event.id);  
    }
    // Get event data
    const clickedEvent = {
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.start.toISOString(),
      end: clickInfo.event.end ? clickInfo.event.end.toISOString() : '',
      finished: clickInfo.event.extendedProps.finished,
    };
  
    // Set the modal visibility to true and pass the event data to the modal
    setIsModalVisible(true);
    setCurrentActivity(clickedEvent);
  };
  

  const handleShow = (activity) => { 
    // console.log('handleShow', activity);
    setIsModalVisible(true);
    setCurrentActivity(activity)
  }

  const handleClose = () => { 
    // console.log(handleClose);
    setIsModalVisible(false)
    setSelectedEventId(null);
  }

  useEffect(handleIndex, []);

  return (
        <div className="w-full h-[80vh] mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}  // Pass formatted events here
        editable={true}
        selectable={true}
        select={handleShow}
        timeZone="local"
        eventClick={handleEventClick}
      />
        <Modal show={isModalVisible} onClose={handleClose}>   
        <ActivityShow eventId={selectedEventId}/>
        </Modal>
    </div>
);
}
