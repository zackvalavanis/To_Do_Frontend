import { useLoaderData } from 'react-router-dom';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export function HomePage() { 

  const activities = useLoaderData();

  const events = activities.map((activity) => {
    const event = {
      title: 'Jogging',
      start: '2024-11-06T20:00:00.000Z', 
      // new Date(activity.time_start).toISOString(),
      end: '2024-11-06T21:00:00.000Z',
      // new Date(activity.time_end).toISOString(),
    };
    console.log(event);  // Log each event to ensure it's being mapped correctly
    return event;
  });
  

  return (
    <div className="w-full h-[80vh] mx-auto"> {/* Tailwind classes for full width and height */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        timeZone='local'
      />
    </div>
  );
}
