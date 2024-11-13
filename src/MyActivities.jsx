export function MyActivites () { 
  const Activities = useLoaderData();



  return ( 
    <div>
      <h1>
        My Activities
      </h1>
      {Activities.map((activity) => (
        <div key={activity.id}>

        </div>
      ))}
    </div>
  )
}