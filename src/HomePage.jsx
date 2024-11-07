import { useLoaderData } from 'react-router-dom';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export function HomePage() { 
  const formatTime = (time) => {
    if (!time || typeof time !== 'string') {
      return "Invalid Time"; 
    }

    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return "Invalid Time";  
    }

    return date.toLocaleTimeString();  
  };

  const activities = useLoaderData();

  const events = activities.map((activity) => ({
    title: activity.name,
    start: new Date(activity.time_start).toISOString(),
    end: new Date(activity.time_end).toISOString(),
  }));

  return (
    <div className="w-full h-[80vh] mx-auto"> {/* Tailwind classes for full width and height */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
      />
    </div>
  );
}
