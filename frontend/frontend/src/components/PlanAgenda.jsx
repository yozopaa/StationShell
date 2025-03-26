import React, { useState, useEffect } from 'react';
import { PlanService, stationService, employeeService } from '../service/api';

const PlanAgenda = () => {
  const [plans, setPlans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [plansData, employeesData, stationsData] = await Promise.all([
          PlanService.getAllPlans(),
          employeeService.getAllEmployees(),
          stationService.getAllStations()
        ]);
        setPlans(plansData);
        setEmployees(employeesData);
        setStations(stationsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredPlans = plans.filter(plan => 
    plan.Date === selectedDate && 
    (selectedEmployee ? plan.Employee === selectedEmployee : true)
  );

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSavePlan = () => {
    PlanService.getAllPlans().then(data => {
      setPlans(data);
      setShowModal(false);
    });
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      try {
        await PlanService.deletePlan(id);
        setPlans(plans.filter(plan => plan._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression du plan:', err);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Filters and Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />
          <select 
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Tous les employés</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp.Nom}>
                {emp.Nom}
              </option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleAddPlan}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un Plan
        </button>
      </div>

      {/* Agenda View */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div>Chargement...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center text-gray-500">Aucun plan pour cette date</div>
        ) : (
          filteredPlans.map(plan => (
            <div 
              key={plan._id} 
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{plan.Employee}</div>
                <div>{plan.station?.NomStation || 'Aucune station'}</div>
                <div className="text-sm text-gray-600">
                  {plan.Hdebut} - {plan.HFin}
                </div>
                <div className="text-sm">
                  Présence: {plan.Presence ? 'Oui' : 'Non'}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditPlan(plan)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDeletePlan(plan._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit Plan */}
      {showModal && (
        <PlanFormModal
          plan={selectedPlan}
          employees={employees}
          stations={stations}
          onSave={handleSavePlan}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// PlanFormModal Component (slightly modified from previous version)
const PlanFormModal = ({ plan, employees, stations, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Date: plan ? plan.Date : new Date().toISOString().split('T')[0],
    Hdebut: plan ? plan.Hdebut : '',
    HFin: plan ? plan.HFin : '',
    Employee: plan ? plan.Employee : '',
    Presence: plan ? plan.Presence : false,
    station: plan ? plan.station?._id : ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submissionData = {
        Date: formData.Date,
        Hdebut: formData.Hdebut,
        HFin: formData.HFin,
        Employee: formData.Employee,
        Presence: formData.Presence,
        station: formData.station
      };
      
      if (plan) {
        await PlanService.updatePlan(plan._id, submissionData);
      } else {
        await PlanService.createPlan(submissionData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving plan:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{plan ? 'Modifier Plan' : 'Ajouter Plan'}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Date</label>
            <input
              type="date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Heure de Début</label>
            <input
              type="time"
              name="Hdebut"
              value={formData.Hdebut}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Heure de Fin</label>
            <input
              type="time"
              name="HFin"
              value={formData.HFin}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Employé</label>
            <select
              name="Employee"
              value={formData.Employee}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un employé</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp.Nom}>
                  {emp.Nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Station</label>
            <select
              name="station"
              value={formData.station}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner une station</option>
              {stations.map(station => (
                <option key={station._id} value={station._id}>
                  {station.NomStation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Présence</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="Presence"
                checked={formData.Presence}
                onChange={handleChange}
                className="mr-2"
              />
              <span>{formData.Presence ? 'Présent' : 'Absent'}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {plan ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanAgenda;