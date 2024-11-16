import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function MyActivites() {
  const [activities, setActivities] = useState([]); // Initialize with an empty array

  // Fetch activities from the API
  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/activities.json');
      console.log('Fetched activities:', response.data);
      setActivities(response.data); // Update state with fetched activities
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    };
    const formattedDate = date.toLocaleString('en-US', options);
    console.log("Formatted date:", formattedDate); // Log the formatted date
    return formattedDate;
  };
  


  // Notify about upcoming events
  const notifyUpcomingEvents = () => {
    console.log('Checking for events within 15 minutes...');
    
    // Use Date.UTC() to capture current UTC time in milliseconds
    const nowUTC = Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    );

    activities.forEach((activity) => {
      // Convert activity start time from ISO string (which is UTC) to timestamp in UTC
      const eventStartTime = new Date(formatDate(activity.start_datetime));
      const eventStartTimeUTC = eventStartTime.getTime(); // This is already in UTC
      const timeDifference = eventStartTimeUTC - nowUTC;
      console.log(timeDifference);

      if (timeDifference > 0 && timeDifference <= 15 * 60 * 1000) {
        console.log(
          `Event "${activity.name}" starts in ${Math.floor(
            timeDifference / 60000
          )} minutes.`
        );
        toast.info(
          `Reminder: "${activity.name}" starts in ${Math.floor(
            timeDifference / 60000
          )} minutes!`,
          {
            position: 'top-right',
            // autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    });
  };

  // UseEffect for fetching data (only once) and setting up notifications
  useEffect(() => {
    fetchActivities(); // Fetch activities on component mount

    const intervalId = setInterval(() => {
      notifyUpcomingEvents();
    }, 30000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array to run only once on mount

  return ( 
    <div>
      <ToastContainer />
    </div>
  )
}
