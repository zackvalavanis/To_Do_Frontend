import { useLoaderData } from 'react-router-dom';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios'


export function Calendar() {
  const activities = useLoaderData();
  const events = activities.map((activity) => {
    const { id, name, start_datetime, end_datetime} = activity;

    const startDate = new Date(start_datetime);
    const endDate = new Date(end_datetime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(`Invalid start or end date for activity: ${name}`);
      return null;
    }
    const startLocal = startDate.toISOString().replace('Z', '');
    const endLocal = endDate.toISOString().replace('Z', '');

    return {
      id: id,
      title: name || 'Untitled Event',
      start: startLocal,  
      end: endLocal,
      display: 'block',
    };
  }).filter(event => event !== null); 


  const handleSelect = (selectInfo) => { 
    const title = prompt('Enter event title', 'New Event');
    if(title){ 
      const newEvent = { 
        id: id,
        title: title, 
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]); // Add the new event to the state
    }
    selectInfo.view.calendar.unselect(); // Deselect the area
  };

    // Handler for clicking on an event
    const handleEventClick = (clickInfo) => {
      console.log('Event ID:', clickInfo.event.id);
      const newTitle = prompt('Enter new title for the event:', clickInfo.event.title);
      if (newTitle) {
        clickInfo.event.setProp('title', newTitle); 

        const updatedEvent = { name: newTitle }
        axios.patch(`http://localhost:3000/activities/${clickInfo.event.id}.json`, updatedEvent ).then((response) => { 
          console.log( 'updatedEvent', response.data)
        })
      }
    };

  return (
      <div className="w-full h-[80vh] mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          editable={true} // Allow editing of events
          selectable={true} // Allow selecting a date range
          timeZone="local"
          select={handleSelect} // Handle date range selection
          eventClick={handleEventClick} // Handle event click to edit title
        />
    <div className='form-create'>
      <form>
        Name: <input name='name' type='text'/>





      </form>


    </div>
    </div>
  );
}
