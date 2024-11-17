import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useLoaderData } from 'react-router-dom'; // Import the useLoaderData hook
import './stats.css';

// Register Chart.js components
Chart.register(...registerables);

export function Stats() {
  // Load activity data using useLoaderData hook
  const activities = useLoaderData();

  // Filter activities to find completed ones
  const finishedActivities = activities.filter((activity) => activity.finished);
  const totalActivities = activities.length;
  const finishedCount = finishedActivities.length;

  // Calculate completion ratio as a percentage
  const completionRatio = totalActivities > 0 
    ? ((finishedCount / totalActivities) * 100).toFixed(2) 
    : 0;

  // Chart configuration
  const chartData = {
    labels: ['Total Activities', 'Finished Activities', 'Completion Ratio (%)'],
    datasets: [
      {
        label: 'Activity Statistics',
        data: [totalActivities, finishedCount, parseFloat(completionRatio)],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f'], // Colors for each bar
        borderWidth: 1, // Adds subtle borders to bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true, // Start Y-axis at zero
        ticks: {
          callback: (value) =>
            typeof value === 'number' ? `${value}%` : value, // Format Y-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top', // Position legend above the chart
      },
    },
  };

  // JSX rendering the chart and its container
  return (
    <div className="stats-container">
      <h1 className="stats-header">My Stats</h1>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
