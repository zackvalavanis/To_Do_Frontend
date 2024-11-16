import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useLoaderData } from 'react-router-dom'; // Import the useLoaderData hook
import React from 'react';
import './stats.css'

// Register components with Chart.js
Chart.register(...registerables);

export function Stats() {
  // Access the loaded data using useLoaderData
  const activities = useLoaderData();

  const finishedActivities = activities.filter((activity) => activity.finished);
  const totalActivities = activities.length;
  const finishedCount = finishedActivities.length;
  const ratio = totalActivities > 0 ? (finishedCount / totalActivities).toFixed(2) : 0;

  const chartData = {
    labels: ['Total Activities', 'Finished Activities', 'Completion Ratio'],
    datasets: [
      {
        label: 'Activity Stats',
        data: [totalActivities, finishedCount, parseFloat(ratio) * 100],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f'],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => (typeof value === 'number' ? `${value}%` : value),
        },
      },
    },
  };

  return (
    <div className="stats-container">
      <h1 className="stats-header">My Stats</h1>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
