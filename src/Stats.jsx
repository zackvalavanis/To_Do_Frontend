import { useLoaderData } from 'react-router-dom'

export function Stats () { 
  const activities = useLoaderData();
  console.log("these are my activities", activities.finished)
  const finishedActivities = activities.filter((activity) => activity.finished)
  const totalActivities = activities.length;
  const finishedCount = finishedActivities.length;
  const ratio = totalActivities > 0 ? (finishedCount / totalActivities).toFixed(2) : 0;

  return (
    <div>
    <h1>My Stats</h1>
    <p>Total Activities: {totalActivities}</p>
    <p>Finished Activities: {finishedCount}</p>
    <p>Completion Ratio: {ratio}</p>
  </div>
);
}