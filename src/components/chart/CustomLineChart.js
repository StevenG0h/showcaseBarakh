import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
  } from 'chart.js';
  import { Bar, Line } from 'react-chartjs-2';
  import { faker } from '@faker-js/faker';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
  
  export default function CustomLineChart({dataset, chartTitle}) {
      return (
          <Line options={
            {
              maintainAspectRatio:false,
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: chartTitle,
                },
              },
            }
          } data={dataset}></Line>
      )
  }
  