import { useLoaderData} from 'react-router-dom'


export function MyActivites () { 
  const Activities = useLoaderData();

  const formatDate = (isoString) => { 
    const date = new Date(isoString);
  
    const options = { 
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12:true
    };
    return date.toLocaleString('en-US', options)
  }


  return ( 
    <div>
      <h1>
        My Activities
      </h1>
      {Activities.map((activity) => (
        <div key={activity.id}>
          <h1>{activity.name}</h1>
          <p>{formatDate(activity.start_datetime)}</p>
          <p>{formatDate(activity.end_datetime)}</p>
        </div>
      ))}
    </div>
  )
}