import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for styling

// Create a Context for activities
const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);
  
  // Fetch activities from the server
  useEffect(() => {
    axios.get('http://localhost:3000/activities.json')
      .then((response) => {
        setActivities(response.data);
        console.log("Activities fetched:", response.data); // Add this line to check if the data is being loaded correctly
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);
  

  return (
    <ActivityContext.Provider value={{ activities, setActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

// Custom hook to use activities
export function useActivities() {
  return useContext(ActivityContext);
}

// Function to format the date
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
  return date.toLocaleString('en-US', options);
};

export function App() {
  const { activities } = useActivities();

  // Function to notify about upcoming events
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
      <ToastContainer /> {/* This renders the toast notifications */}
      {/* Your other components */}
    </div>
  )
}
