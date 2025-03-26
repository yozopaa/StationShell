import React, { useEffect, useState, useRef } from 'react';
import { employeeService, pompeService, produitService, venteService, stationService } from '../service/api';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [pompes, setPompes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('general'); // Default to 'general'

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stations
        const stationData = await stationService.getAllStations();
        setStations(stationData);

        // Fetch initial data based on selected station
        fetchEmployees(selectedStation);
        fetchPompes(selectedStation);
        fetchProduits(selectedStation);
        fetchVentes(selectedStation);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchEmployees = async (stationId) => {
    try {
      const query = stationId === 'general' ? {} : { stationId };
      const data = await employeeService.getAllEmployees(query);
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchPompes = async (stationId) => {
    try {
      const query = stationId === 'general' ? {} : { stationId };
      const data = await pompeService.getAllPompes(query);
      setPompes(data);
    } catch (error) {
      console.error('Error fetching pompes:', error);
    }
  };

  const fetchProduits = async (stationId) => {
    try {
      const query = stationId === 'general' ? {} : { stationId };
      const data = await produitService.getAllProduits(query);
      setProduits(data);
    } catch (error) {
      console.error('Error fetching produits:', error);
    }
  };

  const fetchVentes = async (stationId) => {
    try {
      const query = stationId === 'general' ? {} : { stationId };
      const data = await venteService.getAllVentes(query);
      setVentes(data);
    } catch (error) {
      console.error('Error fetching ventes:', error);
    }
  };

  const handleStationChange = (e) => {
    const stationId = e.target.value;
    setSelectedStation(stationId);
    fetchEmployees(stationId);
    fetchPompes(stationId);
    fetchProduits(stationId);
    fetchVentes(stationId);
  };

  // **Line Chart Data: Sales per Day for Current Month**
  const getDaysInMonth = () => {
    const days = [];
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const salesByDate = {};
  ventes.forEach((vente) => {
    const date = new Date(vente.DateVente);
    const dateStr = date.toISOString().split("T")[0];
    salesByDate[dateStr] = (salesByDate[dateStr] || 0) + (vente.PrixVente || 0); // Use PrixVente instead of count
  });

  const days = getDaysInMonth();
  const salesPerDay = days.map((day) => salesByDate[day] || 0);

  const lineChartData = {
    labels: days.map((day) => day.split("-")[2]),
    datasets: [
      {
        label: 'Sales Amount (DH)',
        data: salesPerDay,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Sales Amount (DH)' },
      },
      x: {
        title: { display: true, text: 'Day of Month' },
      },
    },
  };

  // **Pie Chart Data: Sales Distribution by Type**
  const salesByType = {};
  ventes.forEach((vente) => {
    const type = vente.TypeVente || 'Unknown';
    salesByType[type] = (salesByType[type] || 0) + (vente.PrixVente || 0); // Use PrixVente instead of count
  });

  const pieChartData = {
    labels: Object.keys(salesByType),
    datasets: [
      {
        label: 'Sales by Type (DH)',
        data: Object.values(salesByType),
        backgroundColor: [
          'rgba(255, 1, 56, 0.8)',
          'rgba(17, 142, 226, 0.8)',
          'rgba(239, 176, 18, 0.8)',
          'rgba(26, 195, 195, 0.8)',
          'rgba(74, 15, 191, 0.8)',
          'rgba(213, 120, 26, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Distribution by Type (DH)' },
    },
  };

  // Download functions (unchanged)
  const downloadLinePNG = () => {
    const chart = lineChartRef.current;
    if (chart) {
      const link = document.createElement('a');
      link.href = chart.toBase64Image();
      link.download = 'sales_per_day.png';
      link.click();
    }
  };

  const downloadLinePDF = () => {
    const chart = lineChartRef.current;
    if (chart) {
      const imgData = chart.toBase64Image();
      const pdf = new jsPDF('landscape');
      const imgWidth = 260;
      const imgHeight = (chart.height * imgWidth) / chart.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('sales_per_day.pdf');
    }
  };

  const downloadPiePNG = () => {
    const chart = pieChartRef.current;
    if (chart) {
      const link = document.createElement('a');
      link.href = chart.toBase64Image();
      link.download = 'sales_by_type.png';
      link.click();
    }
  };

  const downloadPiePDF = () => {
    const chart = pieChartRef.current;
    if (chart) {
      const imgData = chart.toBase64Image();
      const pdf = new jsPDF('portrait');
      const imgWidth = 180;
      const imgHeight = (chart.height * imgWidth) / chart.width;
      pdf.addImage(imgData, 'PNG', 15, 20, imgWidth, imgHeight);
      pdf.save('sales_by_type.pdf');
    }
  };

  return (
    <div className="p-6">
      {/* Station Filter */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700"></label>
        <select
          value={selectedStation}
          onChange={handleStationChange}
          className="border rounded p-2 bg-red-500 text-white"
        >
          <option value="general">Général (Toutes les stations)</option>
          {stations.map((station) => (
            <option key={station._id} value={station._id}>
              {station.NomStation}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-red-500 text-white">
          <div className="text-sm mb-1">Ventes quotidiennes</div>
          <div className="text-2xl font-bold">
            {ventes.reduce((sum, p) => sum + (p.PrixVente || 0), 0).toFixed(2)} DH
          </div>
        </div>
        <div className="p-4 rounded shadow bg-green-500 text-white">
          <div className="text-sm mb-1">Employés actifs</div>
          <div className="text-2xl font-bold">
            {employees.filter(emp => emp.Status === 'Active').length}
          </div>
        </div>
        <div className="p-4 rounded shadow bg-yellow-400 text-gray-800">
          <div className="text-sm mb-1">Nombre des produits</div>
          <div className="text-2xl font-bold">{produits.length}</div>
        </div>
        <div className="p-4 rounded shadow bg-blue-500 text-white">
          <div className="text-sm mb-1">Pompes actives</div>
          <div className="text-2xl font-bold">
            {pompes.filter(p => p.Statut === 'Actif').length}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded shadow bg-white flex flex-col h-96">
          <h2 className="text-lg font-semibold mb-2">Ventes par jour (mois en cours)</h2>
          <div className="flex-grow overflow-hidden">
            <Line ref={lineChartRef} data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="flex justify-end space-x-2 mt-2 shrink-0">
            <button
              onClick={downloadLinePNG}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
            >
              Télécharger PNG
            </button>
            <button
              onClick={downloadLinePDF}
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 text-sm"
            >
              Télécharger PDF
            </button>
          </div>
        </div>

        <div className="p-4 rounded shadow bg-white flex flex-col h-96">
          <h2 className="text-lg font-semibold mb-2">Ventes par type</h2>
          <div className="flex-grow overflow-hidden">
            <Pie ref={pieChartRef} data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="flex justify-end space-x-2 mt-2 shrink-0">
            <button
              onClick={downloadPiePNG}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
            >
              Télécharger PNG
            </button>
            <button
              onClick={downloadPiePDF}
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 text-sm"
            >
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;