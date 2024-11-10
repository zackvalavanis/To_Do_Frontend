import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Make sure this import is correct


export function ActivityShow({ eventId }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); 

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
  if (!activity) {
    return (
      <div>
        <p>Activity not found, add activity below!</p>
        <form>
          <div>
          UserID: <input defaultValue={currentUser.id} name='User_id' type='text' />
          </div>
          <div>
          Title: <input name='title' type='text' /> 
          </div>
          <div>
          start: <input name='start_datetime' type='text' />
          </div>
          <div>
            End: <input name='end_datetime' type='text'/>
          </div>
          <div>
          Completed:
          <label>
            <input 
              name="finished" 
              type="radio" 
              value="yes" 
            /> Yes
          </label>
          <label>
            <input 
              name="finished" 
              type="radio" 
              value="no" 
              defaultChecked={true} 
            /> No
          </label>
          </div>
        </form>
          <button>New Activity</button> 
      </div>
    );
  }

  return (
    <div>
      <h1>{activity.name}</h1>
      Start: <p>{new Date(activity.start_datetime).toLocaleString()}</p>
      End: <p>{new Date(activity.end_datetime).toLocaleString()}</p>
      <button>Update Activity</button>
    </div>

  );
}


// create_table "activities", force: :cascade do |t|
// t.integer "user_id"
// t.datetime "date", null: false
// t.boolean "finished", default: false
// t.datetime "created_at", null: false
// t.datetime "updated_at", null: false
// t.string "name"
// t.datetime "start_datetime", null: false
// t.datetime "end_datetime", null: false
// t.string "time_zone", default: "UTC"
// end