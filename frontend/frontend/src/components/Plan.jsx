import React, { useState, useEffect } from 'react';
import { PlanService } from '../service/api';
import PlanFormModal from './PlanFormModal';

const Plan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // New state for selected date
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month for calendar

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await PlanService.getAllPlans();
      setPlans(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await PlanService.deletePlan(id);
        setPlans(plans.filter(plan => plan._id !== id));
      } catch (err) {
        console.error('Error deleting plan:', err);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedPlan(null);
    setShowModal(true);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchPlans();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Filter and sort plans
  const filteredPlans = plans.filter(plan =>
    (plan.Employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.Date.includes(searchQuery)) &&
    (!selectedDate || plan.Date === selectedDate)
  );

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortOption === 'station-asc') {
      const stationA = a.station?.NomStation || '';
      const stationB = b.station?.NomStation || '';
      return stationA.localeCompare(stationB);
    } else if (sortOption === 'station-desc') {
      const stationA = a.station?.NomStation || '';
      const stationB = b.station?.NomStation || '';
      return stationB.localeCompare(stationA);
    }
    return 0;
  });

  // Group plans by date for agenda view
  const groupedPlans = sortedPlans.reduce((acc, plan) => {
    const date = plan.Date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(plan);
    return acc;
  }, {});

  // Calendar generation
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let week = Array(7).fill(null);

    // Adjust first day to start on Monday (0 = Sunday, 1 = Monday, etc.)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let day = 1; day <= daysInMonth; day++) {
      const position = startOffset + day - 1;
      const weekIndex = Math.floor(position / 7);
      const dayIndex = position % 7;

      if (!weeks[weekIndex]) weeks[weekIndex] = Array(7).fill(null);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      weeks[weekIndex][dayIndex] = { day, date: dateStr };
    }

    return weeks;
  };

  const calendarWeeks = generateCalendar();

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
    setSelectedDate(null); // Reset selected date when changing month
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-blue-500 text-white">
          <div className="text-sm mb-1">Total Plans</div>
          <div className="text-3xl font-bold">{plans.length}</div>
        </div>
        <div className="p-4 rounded shadow bg-green-500 text-white">
          <div className="text-sm mb-1">Plans pour aujourd'hui</div>
          <div className="text-3xl font-bold">
            {plans.filter(plan => plan.Date === new Date().toISOString().split('T')[0]).length}
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex mb-4 items-center justify-between space-x-2">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Recherche par Employé ou Date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 flex-grow"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded bg-red-500 text-white py-2.5 px-2 rounded hover:bg-red-800"
          >
            <option value="">Trier par station</option>
            <option value="station-asc">Station (A-Z)</option>
            <option value="station-desc">Station (Z-A)</option>
          </select>
        </div>
        <div className="flex space-x-2">
          
          <button
            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
            onClick={handleAddClick}
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Calendar and Agenda Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Précédent
            </button>
            <h2 className="text-xl font-bold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Suivant
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2">Lun</th>
                <th className="p-2">Mar</th>
                <th className="p-2">Mer</th>
                <th className="p-2">Jeu</th>
                <th className="p-2">Ven</th>
                <th className="p-2">Sam</th>
                <th className="p-2">Dim</th>
              </tr>
            </thead>
            <tbody>
              {calendarWeeks.map((week, index) => (
                <tr key={index}>
                  {week.map((dayObj, dayIndex) => {
                    const hasPlans = dayObj && plans.some(plan => plan.Date === dayObj.date);
                    return (
                      <td
                        key={dayIndex}
                        className={`p-2 text-center border ${dayObj && hasPlans ? 'bg-blue-100' : ''} ${dayObj && selectedDate === dayObj.date ? 'bg-blue-300' : ''} ${dayObj ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                        onClick={() => dayObj && handleDateClick(dayObj.date)}
                      >
                        {dayObj ? dayObj.day : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agenda View */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            Object.keys(groupedPlans).length > 0 ? (
              Object.keys(groupedPlans).map(date => (
                <div key={date} className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-bold mb-4">{date}</h2>
                  <div className="space-y-4">
                    {groupedPlans[date].map((plan, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <div>
                          <p><strong>Employé:</strong> {plan.Employee}</p>
                          <p><strong>Station:</strong> {plan.station?.NomStation || 'N/A'}</p>
                          <p><strong>Horaire:</strong> {plan.Hdebut} - {plan.HFin}</p>
                          <p><strong>Présence:</strong> {plan.Presence ? 'Oui' : 'Non'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                            onClick={() => handleEditClick(plan)}
                          >
                            Modifier
                          </button>
                          <button
                            className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                            onClick={() => handleDelete(plan._id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">Aucun plan trouvé.</div>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <PlanFormModal
          plan={selectedPlan}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Plan;