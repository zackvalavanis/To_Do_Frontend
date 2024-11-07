import { useLoaderData } from 'react-router-dom';

export function HomePage () { 

  const activities = useLoaderData();
  
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

  return ( 
    <div>
      {activities.map((activity) => {
        return (
          <div key={activity.id}>
            <h1>{activity.name}</h1>
            <p>{activity.date}</p>
              {activity.categories && activity.categories.map((category, index) => ( 
                <span key={index}>{category.category_type}</span> 
              ))}
            <p>{formatTime(activity.time_start)}</p>
            <p>{formatTime(activity.time_end)}</p>
          </div>
        );
      })}
    </div>
  );
}
