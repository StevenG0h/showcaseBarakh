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
    ArcElement,
  } from 'chart.js';
  import { Bar, Line } from 'react-chartjs-2';
  import { faker } from '@faker-js/faker';
  
  ChartJS.register(
    ArcElement,
    Title,
    Tooltip
  );
  
  export const options = {
    
  };
  
  
  
  
  export default function CustomDoughnutChart({dataset, chartTitle}) {
      return (
          <Bar title='' options={
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
          } data={dataset}></Bar>
      )
  }
  