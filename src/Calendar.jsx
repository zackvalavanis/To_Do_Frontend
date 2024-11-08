import { useLoaderData } from 'react-router-dom';
import React, { useState } from 'react';  // Import useState hook
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export function Calendar() {
  const activities = useLoaderData();
  const [events, setEvents] = useState(
    activities.map((activity) => {
      const { id, name, date, start_datetime, end_datetime } = activity;
      console.log('Date:', date);

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
        date: date,
        title: name || 'Untitled Event',
        start: startLocal,
        end: endLocal,
        display: 'block',
      };
    }).filter((event) => event !== null)
  );

  const handleSelect = (selectInfo) => {
    const title = prompt('Enter event title', 'New Event');
    if (title) {
      const newId = Date.now(); // Generate a new id for the new event
      const newEvent = {
        id: newId,
        date: selectInfo.startStr.split('T')[0], // Extract date part
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]); // Add the new event to the state
    }
    selectInfo.view.calendar.unselect(); // Deselect the area
  };

  const handleEventClick = (clickInfo) => {
    console.log('Event ID:', clickInfo.event.id); // Correctly shows event ID
    console.log('Event Date:', clickInfo.event.startStr.split('T')[0]); // Extracts date part
    console.log(clickInfo.event);

    const newTitle = prompt('Enter new title for the event:', clickInfo.event.title);
    if (newTitle) {
      clickInfo.event.setProp('title', newTitle); // Update the event title

      const updatedEvent = { name: newTitle };
      axios.patch(`http://localhost:3000/activities/${clickInfo.event.id}.json`, updatedEvent)
        .then((response) => {
          console.log('Updated Event:', response.data);
        });
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
      <div className="form-create">
        <form>
          Name: <input name="name" type="text" />
        </form>
      </div>
    </div>
  );
}
