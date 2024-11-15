import { useLoaderData} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect } from 'react'
import { format } from 'date-fns';


export function MyActivites () { 
  const initialActivities = useLoaderData();
  const [activities, setActivities] = useState(initialActivities);


  const formatDate = (isoString) => { 
    const date = new Date(isoString);

    const options = { 
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12:true,
      timeZone: 'UTC'
    };
    return date.toLocaleString('en-US', options)
  }

  const handleDestroy = (id) => { 
    console.log(handleDestroy, id);
    axios.delete(`http://localhost:3000/activities/${id}.json`).then(() => { 
      setActivities((prevActivities => prevActivities.filter((activity) => activity.id !== id)));
    })
    .catch((error) => { 
      console.log("Error deleting", error)
    })
  }
  const notifyUpcomingEvents = () => {
    console.log("Checking for events 10 minutes away...");
  
    // Capture the current time in UTC (in milliseconds)
    const nowUTC = Date.now(); // Current time in UTC (milliseconds since Jan 1, 1970)
  
    activities.forEach((activity) => {
      // Convert activity start time from UTC to a timestamp
      const eventStartTime = new Date(formatDate(activity.start_datetime)); // ISO string is already in UTC
      const eventStartTimeUTC = eventStartTime.getTime(); // Get the timestamp in UTC (milliseconds)
      console.log(eventStartTime)
  
      console.log("Event start time in UTC:", eventStartTimeUTC);
      console.log("Current time in UTC:", nowUTC);
      
      // Calculate the time difference in milliseconds
      const timeDifference = eventStartTimeUTC - nowUTC;
      console.log(timeDifference)
      // Check if the event is starting within the next 10 minutes
      if (timeDifference > 0 && timeDifference <= 15 * 60 * 1000) {
        console.log(`Event ${activity.name} starts in ${Math.floor(timeDifference / 60000)} minutes.`);
        toast.info(`Reminder: "${activity.name}" starts in ${Math.floor(timeDifference / 60000)} minutes!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };
  
  useEffect(() => {
    if (activities.length > 0) {
      console.log("Setting up notifications for events:", activities);
      const intervalId = setInterval(() => {
        notifyUpcomingEvents(); // No need to pass events explicitly
      }, 10000); // Check every minute
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [activities]);

  return ( 
    <div>
      <h1>
        My Activities
      </h1>
      {activities.map((activity) => (
        <div key={activity.id}>
          <h1>{activity.name}</h1>
          <p>{formatDate(activity.start_datetime)}</p>
          <p>{formatDate(activity.end_datetime)}</p>
          <button onClick={() => handleDestroy(activity.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}