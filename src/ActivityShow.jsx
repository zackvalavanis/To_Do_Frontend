import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityShow.css';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export function ActivityShow({ eventId, selectedDate, setEvents, events }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [finished, setFinished] = useState(false);


  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 12;
    const endTime = 12;
    const interval = 15;
    
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += interval) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const minute = m < 10 ? `0${m}` : m;
        const ampm = h < 12 ? 'AM' : 'PM';
        
        const time = `${hour}:${minute} ${ampm}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Function to handle activity creation
const handleCreate=(params, successCallback)=> {
  console.log('handleCreate', params);

  axios.post("http://localhost:3000/activities.json", params).then((response)=> {
      console.log(response.data);
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: response.data.id,
          title: response.data.name,
          start: new Date(response.data.start_datetime),
          end: new Date(response.data.end_datetime),
        },
      ]);
      toast.success('Created new Activity!')
      successCallback();
    });
}
  
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (eventId) {
      const fetchSingleActivity = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/activities/${eventId}.json`);
          setActivity(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching activity:', error);
          setLoading(false);
        }
      };
      fetchSingleActivity();
    }
  }, [eventId]);

  const combineDateAndTime = (date, timeString) => {
    if (!date || !timeString) {
        console.error('Invalid date or time values');
        return NaN;
    }

    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    let hourInt = parseInt(hour, 10);
    if (period === 'PM' && hourInt !== 12) {
        hourInt += 12;
    } else if (period === 'AM' && hourInt === 12) {
        hourInt = 0;
    }

    const dateTimeString = `${date}T${String(hourInt).padStart(2, '0')}:${minute}:00.000Z`;
    const dateTime = new Date(dateTimeString);
    return isNaN(dateTime) ? NaN : dateTime;
  };

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

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12; // Convert to 12-hour format
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour}:${minute} ${ampm}`;
  };
  

  const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';

  useEffect(() => {
    if (activity) {
      setFinished(activity.finished); // Sync local state with activity
    }
  }, [activity]);

  const handleUpdate = async (event, id, successCallback) => {
    event.preventDefault();
    const params = new FormData(event.target);
  
    const selectedDate = params.get('date');
    const startTime = params.get('start_datetime');
    const endTime = params.get('end_datetime');
  
    const startDatetime = combineDateAndTime(selectedDate, startTime);
    const endDatetime = combineDateAndTime(selectedDate, endTime);
  
    if (isNaN(startDatetime) || isNaN(endDatetime)) {
      console.error('Invalid date or time format');
      return;
    }
  
    const processedParams = {
      user_id: params.get('user_id'),
      name: params.get('name'),
      finished: params.get('finished'),
      start_datetime: startDatetime.toISOString(),
      end_datetime: endDatetime.toISOString(),
    };
  
    try {
      const response = await axios.patch(`http://localhost:3000/activities/${id}.json`, processedParams);
      const updatedActivity = response.data;
  
      // Update local activity and state
      setActivity(updatedActivity);
      setFinished(updatedActivity.finished);
  
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedActivity.id
            ? {
                ...event,
                title: updatedActivity.name,
                start: new Date(updatedActivity.start_datetime),
                end: new Date(updatedActivity.end_datetime),
              }
            : event
        )
      );
  
      toast.success('Successfully Updated!', { icon: '🚀' });
      successCallback && successCallback();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };
  
  
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    const selectedDate = params.get('date');
    const startTime = params.get('start_datetime');
    const endTime = params.get('end_datetime');

    const startDatetime = combineDateAndTime(selectedDate, startTime);
    const endDatetime = combineDateAndTime(selectedDate, endTime);

    if (isNaN(startDatetime) || isNaN(endDatetime)) {
        console.error('Invalid date or time format');
        return;
    }

    const processedParams = {
        user_id: params.get('user_id'),
        name: params.get('name'),
        finished: params.get('finished') === 'true',
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime.toISOString(),
    };

    handleCreate(processedParams, () => event.target.reset());
  };

  const handleDestroy = (id) => { 
    console.log(handleDestroy, id);
    axios.delete(`http://localhost:3000/activities/${id}.json`).then(() => { 
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      toast.success('Deleted Activity')
    })
    .catch((error) => { 
      console.log("Error deleting", error)
    })
  }


  if (!activity) {
    return (
      <div className="activity-show-container">
        <p className="activity-not-found">Activity not found, add activity below!</p>
        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <input defaultValue={currentUser.id} name='user_id' type='hidden' />
          </div>
          <div className="form-group">
            <label htmlFor="title">Activity: </label>
            <input id="title" name='name' type='text' />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date: </label>
            <input
              name='date'
              type='date'
              defaultValue={formattedDate} // Pre-fill with selectedDate
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_datetime">Start: </label>
            <select name="start_datetime" id="start_datetime">
              <option value="">Select Start Time</option>
              {timeSlots.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="end_datetime">End: </label>
            <select name="end_datetime" id="end_datetime">
              <option value="">Select End Time</option>
              {timeSlots.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Completed: </label>
            <label>
              <input
                name="finished"
                type="radio"
                value="true"
                checked={finished === true}
                onChange={() => setFinished(true)}
              /> Yes
            </label>
            <label>
              <input
                name="finished"
                type="radio"
                value="false"
                checked={finished === false}
                onChange={() => setFinished(false)}
              /> No
            </label>
          </div>
          <button type="submit" className="btn-submit">New Activity</button>
        </form>
      </div>
    );
  }

  return (
    <div className="activity-show-container">
      <h1 className="activity-title">{activity.name}</h1>
      <p className="activity-time">Start: {formatDate(activity.start_datetime)}</p>
      <p className="activity-time">End: {formatDate(activity.end_datetime)}</p>
      <form onSubmit={(e) => handleUpdate(e, activity.id)} className="activity-form">
        <div className="form-group">
          <input defaultValue={currentUser.id} name="user_id" type="hidden" />
        </div>
        <div className="form-group">
          <label htmlFor="title">Activity: </label>
          <input
            id="title"
            name="name"
            type="text"
            defaultValue={activity.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date: </label>
          <input
            id="date"
            name="date"
            type='date'
            defaultValue={activity.start_datetime.split('T')[0]} // Use the start_datetime for default value
          />
        </div>
        <div className="form-group">
          <label htmlFor="start_datetime">Start Time: </label>
          <select
            name="start_datetime"
            id="start_datetime"
            defaultValue={formatTime(activity.start_datetime)}
          >
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="end_datetime">End Time: </label>
          <select
            name="end_datetime"
            id="end_datetime"
            defaultValue={formatTime(activity.end_datetime)}
          >
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Completed: </label>
          <label>
            <input
              name="finished"
              type="radio"
              value="true"
              checked={finished === true} // Use the `finished` state
              onChange={() => setFinished(true)} // Update the `finished` state
            /> Yes
          </label>
          <label>
            <input
              name="finished"
              type="radio"
              value="false"
              checked={finished === false} // Use the `finished` state
              onChange={() => setFinished(false)} // Update the `finished` state
            /> No
          </label>
        </div>
        <button type="submit" className="btn-submit">
          Update Activity
        </button>
      </form>
      <button onClick={() => handleDestroy(activity.id)}>Delete</button>
    </div>
  );
}
