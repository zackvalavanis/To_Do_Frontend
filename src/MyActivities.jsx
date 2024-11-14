import { useLoaderData} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'


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