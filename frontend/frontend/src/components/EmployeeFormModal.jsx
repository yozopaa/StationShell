import React, { useState, useEffect } from 'react';
import { employeeService, stationService } from '../service/api'; // Import stationService
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EmployeeFormModal = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState(employee || {
    CINEmploye: '',
    NomEmploye: '',
    PrenomEmploye: '',
    TelephoneEmploye: '',
    AdresseEmploye: '',
    DateNaissance: '',
    DateEmbauche: '',
    Poste: '',
    Status: 'Active',
    station: '', // Add station field
  });
  const [stations, setStations] = useState([]); // State for stations list
  const [error, setError] = useState('');

  // Fetch stations when the modal loads
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationData = await stationService.getAllStations();
        setStations(stationData);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to load stations');
      }
    };
    fetchStations();

    if (employee) {
      const formattedEmployee = {
        ...employee,
        DateNaissance: employee.DateNaissance ? new Date(employee.DateNaissance).toISOString().split('T')[0] : '',
        DateEmbauche: employee.DateEmbauche ? new Date(employee.DateEmbauche).toISOString().split('T')[0] : '',
        station: employee.station?._id || '', // Use station ID if populated
      };
      setFormData(formattedEmployee);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const action = employee ? 'update' : 'add';
    const confirm = await MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this employee?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      const submissionData = {
        ...formData,
        DateNaissance: new Date(formData.DateNaissance).toISOString(),
        DateEmbauche: new Date(formData.DateEmbauche).toISOString(),
        station: formData.station || undefined, // Ensure station is sent as ID
      };

      if (employee) {
        await employeeService.updateEmployee(employee._id, submissionData);
      } else {
        await employeeService.createEmployee(submissionData);
      }
      await MySwal.fire('Success', `Employee ${action}ed successfully`, 'success');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(error.response?.data?.message || 'An error occurred while saving the employee');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{employee ? 'Modifier' : 'Ajouter'} Employé</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="CINEmploye"
              value={formData.CINEmploye}
              onChange={handleChange}
              placeholder="CIN"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="NomEmploye"
              value={formData.NomEmploye}
              onChange={handleChange}
              placeholder="Nom"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="PrenomEmploye"
              value={formData.PrenomEmploye}
              onChange={handleChange}
              placeholder="Prénom"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="TelephoneEmploye"
              value={formData.TelephoneEmploye}
              onChange={handleChange}
              placeholder="Téléphone"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="AdresseEmploye"
              value={formData.AdresseEmploye}
              onChange={handleChange}
              placeholder="Adresse"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date de Naissance</label>
            <input
              type="date"
              name="DateNaissance"
              value={formData.DateNaissance}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date d'Embauche</label>
            <input
              type="date"
              name="DateEmbauche"
              value={formData.DateEmbauche}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="Poste"
              value={formData.Poste}
              onChange={handleChange}
              placeholder="Poste"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Statut</label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Station</label>
            <select
              name="station"
              value={formData.station}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionner une station</option>
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
              {employee ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;