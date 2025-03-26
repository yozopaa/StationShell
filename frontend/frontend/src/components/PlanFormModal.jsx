import React, { useState, useEffect } from 'react';
import { PlanService, stationService, employeeService } from '../service/api';

const PlanFormModal = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Date: '',
    Hdebut: '',
    HFin: '',
    Employee: '',
    Presence: false,
    station: ''
  });
  const [stations, setStations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationData = await stationService.getAllStations();
        const employeeData = await employeeService.getAllEmployees();
        setStations(stationData);
        setEmployees(employeeData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    if (plan) {
      setFormData({
        Date: plan.Date || '',
        Hdebut: plan.Hdebut || '',
        HFin: plan.HFin || '',
        Employee: plan.Employee || '', // Will now be an ID from the dropdown
        Presence: plan.Presence || false,
        station: plan.station?._id || ''
      });
    } else {
      setFormData({
        Date: '',
        Hdebut: '',
        HFin: '',
        Employee: '',
        Presence: false,
        station: ''
      });
    }
  }, [plan]);

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
        Employee: formData.Employee, // Now an employee ID
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
      setError(err.response?.data?.message || 'An error occurred while saving the plan');
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
              {employees.map((employee, idx) => (
                <option 
                  key={idx} 
                  value={`${employee.NomEmploye} ${employee.PrenomEmploye}`}
                >
                  {employee.NomEmploye} {employee.PrenomEmploye}
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

export default PlanFormModal;