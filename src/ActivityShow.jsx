import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityShow.css';
import { useAuth } from './AuthContext';  // Make sure this import is correct

export function ActivityShow({ eventId, selectedDate }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [finished, setFinished] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 12; // Start from 00:00
    const endTime = 12; // End at 23:59
    const interval = 15; // Interval in minutes

    for (let h = 0; h < 24; h++) { // Loop over 24 hours
      for (let m = 0; m < 60; m += interval) { // Loop in 15-minute intervals
        const hour = h % 12 === 0 ? 12 : h % 12; // Convert 24-hour format to 12-hour format
        const minute = m < 10 ? `0${m}` : m; // Ensure minutes are two digits
        const ampm = h < 12 ? 'AM' : 'PM'; // AM/PM notation

        const time = `${hour}:${minute} ${ampm}`;
        slots.push(time);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (eventId) {
      console.log(eventId);
      const fetchActivity = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/activities/${eventId}.json`);
          setActivity(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching activity:', error);
          setLoading(false);
        }
      };
      fetchActivity();
    }
  }, [eventId]);

  const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';

  const handleCreate = (params, successCallback) => {
    console.log('handleCreate', params);
    axios.post("http://localhost:3000/activities.json", params).then((response) => {
      console.log(response.data);
      setActivities([...activities, response.data]);
      successCallback();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    const finished = params.get('finished' === 'true');
    const processedParams = {
      ...Object.fromEntries(params.entries()), // Convert FormData to a plain object
      finished: finished,
    };

    handleCreate(processedParams, () => event.target.reset());
  };

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
            <input
              name='date'
              type='text'
              defaultValue={formattedDate}
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
                checked={finished === true}
                onChange={() => setFinished(false)}
              /> No
            </label>
          </div>
          <button type="submit" className="btn-submit">New Activity</button>
        </form>
      </div>
    );
  }

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

  return (
    <div className="activity-show-container">
      <h1 className="activity-title">{activity.name}</h1>
      <p className="activity-time">Start: {formatDate(activity.start_datetime)}</p>
      <p className="activity-time">End: {formatDate(activity.end_datetime)}</p>
      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-group">
          <input defaultValue={currentUser.id} name='User_id' type='hidden' />
        </div>
        <div className="form-group">
          <label htmlFor="title">Activity: </label>
          <input id="title" defaultValue={activity.name} name='title' type='text' />
        </div>
        <div className="form-group">
          <input
            name='date'
            type='hidden'
            defaultValue={formattedDate}
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
            /> Yes
          </label>
          <label>
            <input
              name="finished"
              type="radio"
              value="false"
              checked={true}
            /> No
          </label>
        </div>
        <button type="submit" className="btn-submit">Update Activity</button>
      </form>
    </div>
  );
}
