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
    maintainAspectRatio:false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: '#049ffb',
        backgroundColor: '#049ffb',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: '#58B63B',
        backgroundColor: '#58B63B',
      },
    ],
  };
  
  export default function CustomDoughnutChart({dataset = data}) {
      return (
          <Bar options={
              options
          } data={dataset}></Bar>
      )
  }
  