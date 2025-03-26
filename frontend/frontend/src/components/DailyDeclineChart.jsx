import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailyDeclineChart = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Diesel',
        data: [15000, 14800, 14500, 14300, 14000, 13800, 13500],
        borderColor: 'rgba(128, 0, 128, 1)',
        backgroundColor: 'rgba(128, 0, 128, 0.2)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Millangeur',
        data: [5000, 4900, 4800, 4700, 4600, 4500, 4400],
        borderColor: 'rgba(0, 128, 0, 1)',
        backgroundColor: 'rgba(0, 128, 0, 0.2)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'SSPL',
        data: [1000, 980, 960, 940, 920, 900, 880],
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'VPower',
        data: [3000, 2950, 2900, 2850, 2800, 2750, 2700],
        borderColor: 'rgba(255, 215, 0, 1)',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Daily Decline of Carburant Levels' },
    },
  };

  const downloadPNG = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement('a');
      link.href = chart.toBase64Image();
      link.download = 'daily_decline_chart.png';
      link.click();
    }
  };

  const downloadPDF = () => {
    const chart = chartRef.current;
    if (chart) {
      const imgData = chart.toBase64Image();
      const pdf = new jsPDF('landscape');
      const imgWidth = 260;
      const imgHeight = (chart.height * imgWidth) / chart.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('daily_decline_chart.pdf');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex justify-end space-x-2 mt-2 shrink-0">
        <button
          onClick={downloadPNG}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
        >
          Télécharger PNG
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 text-sm"
        >
          Télécharger PDF
        </button>
      </div>
    </div>
  );
};

export default DailyDeclineChart;