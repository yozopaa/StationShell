import React, { useState, useEffect } from 'react';
import { pompeService, employeeService, stationService } from '../service/api';

const PompeFormModal = ({ pompe, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Numero: '',
    Statut: '',
    Debit: '',
    NombrePistole: '',
    Employee: '',
    station: '' // Added station field
  });
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]); // Added stations state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await employeeService.getAllEmployees();
        const stationData = await stationService.getAllStations();
        setEmployees(employeeData);
        setStations(stationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (pompe) {
      setFormData({
        Numero: pompe.Numero || '',
        Statut: pompe.Statut || '',
        Debit: pompe.Debit || '',
        NombrePistole: pompe.NombrePistole || '',
        Employee: pompe.Employee || '',
        station: pompe.station?._id || pompe.station || '' // Handle station as ObjectId
      });
    } else {
      setFormData({
        Numero: '',
        Statut: '',
        Debit: '',
        NombrePistole: '',
        Employee: '',
        station: ''
      });
    }
  }, [pompe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submissionData = {
        Numero: formData.Numero,
        Statut: formData.Statut,
        Debit: Number(formData.Debit),
        NombrePistole: Number(formData.NombrePistole),
        Employee: formData.Employee,
        station: formData.station // Station ID
      };
      if (pompe) {
        await pompeService.updatePompe(pompe._id, submissionData);
      } else {
        await pompeService.createPompe(submissionData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving pompe:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the pompe');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{pompe ? 'Modifier Pompe' : 'Ajouter Pompe'}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Numéro</label>
            <input
              type="text"
              name="Numero"
              value={formData.Numero}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Statut</label>
            <select
              name="Statut"
              value={formData.Statut}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner...</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Débit</label>
            <input
              type="number"
              name="Debit"
              value={formData.Debit}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: 150"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Nombre de Pistoles</label>
            <input
              type="number"
              name="NombrePistole"
              value={formData.NombrePistole}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: 2"
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
              <option value="">Sélectionner un Employé</option>
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
              <option value="">Sélectionner une Station</option>
              {stations.map((station) => (
                <option key={station._id} value={station._id}>
                  {station.NomStation}
                </option>
              ))}
            </select>
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
              {pompe ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PompeFormModal;