import React, { useState, useEffect } from 'react';
import { stationService } from '../service/api';

const StationFormModal = ({ station, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    NomStation: '',
    AdresseStation: '',
    VilleStation: '',
    TelephoneStation: '',
    EmailStation: '',
    StatusStation: 'Actif' // Default to "Actif"
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (station) {
      setFormData({
        NomStation: station.NomStation || '',
        AdresseStation: station.AdresseStation || '',
        VilleStation: station.VilleStation || '',
        TelephoneStation: station.TelephoneStation || '',
        EmailStation: station.EmailStation || '',
        StatusStation: station.StatusStation || 'Actif'
      });
    } else {
      setFormData({
        NomStation: '',
        AdresseStation: '',
        VilleStation: '',
        TelephoneStation: '',
        EmailStation: '',
        StatusStation: 'Actif'
      });
    }
  }, [station]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (station) {
        await stationService.updateStation(station._id, formData);
      } else {
        await stationService.createStation(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving station:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la sauvegarde de la station.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{station ? "Modifier Station" : "Ajouter Station"}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom Station</label>
            <input
              type="text"
              name="NomStation"
              value={formData.NomStation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Station</label>
            <input
              type="text"
              name="AdresseStation"
              value={formData.AdresseStation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville Station</label>
            <input
              type="text"
              name="VilleStation"
              value={formData.VilleStation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone Station</label>
            <input
              type="text"
              name="TelephoneStation"
              value={formData.TelephoneStation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Station</label>
            <input
              type="email"
              name="EmailStation"
              value={formData.EmailStation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut Station</label>
            <select
              name="StatusStation"
              value={formData.StatusStation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
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
              {station ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationFormModal;