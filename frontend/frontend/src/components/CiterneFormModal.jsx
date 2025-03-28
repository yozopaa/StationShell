import React, { useState, useEffect } from 'react';
import { citerneService, stationService } from '../service/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CiterneFormModal = ({ citerne, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Capacite: '',
    DateInstallation: '',
    TypeCarburant: '',
    Statut: '',
    station: ''
  });
  const [stations, setStations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getAllStations();
        setStations(data);
      } catch (err) {
        console.error('Error fetching stations:', err);
      }
    };
    fetchStations();

    if (citerne) {
      setFormData({
        Capacite: citerne.Capacite || '',
        DateInstallation: citerne.DateInstallation
          ? new Date(citerne.DateInstallation).toISOString().split('T')[0]
          : '',
        TypeCarburant: citerne.TypeCarburant || '',
        Statut: citerne.Statut || '',
        station: citerne.station?._id || ''
      });
    } else {
      setFormData({
        Capacite: '',
        DateInstallation: '',
        TypeCarburant: '',
        Statut: '',
        station: ''
      });
    }
  }, [citerne]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const action = citerne ? 'modifier' : 'ajouter';
    const confirm = await MySwal.fire({
      title: 'Confirmer?',
      text: `Voulez-vous vraiment ${action} cette citerne?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });

    if (!confirm.isConfirmed) return;

    try {
      const submissionData = {
        Capacite: Number(formData.Capacite),
        DateInstallation: new Date(formData.DateInstallation).toISOString(),
        TypeCarburant: formData.TypeCarburant,
        Statut: formData.Statut,
        station: formData.station
      };
      if (citerne) {
        await citerneService.updateCiterne(citerne._id, submissionData);
      } else {
        await citerneService.createCiterne(submissionData);
      }
      await MySwal.fire('Succès', `Citerne ${action === 'ajouter' ? 'ajoutée' : 'modifiée'} avec succès`, 'success');
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving citerne:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde de la citerne');
      MySwal.fire('Erreur', 'Échec de l\'opération', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {citerne ? 'Modifier Citerne' : 'Ajouter Citerne'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Capacité (L)</label>
            <input
              type="number"
              name="Capacite"
              value={formData.Capacite}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: 15000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Date d'Installation</label>
            <input
              type="date"
              name="DateInstallation"
              value={formData.DateInstallation}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Type de Carburant</label>
            <select
              name="TypeCarburant"
              value={formData.TypeCarburant}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un type</option>
              <option value="SSPL">SSPL</option>
              <option value="Diesel">Diesel</option>
              <option value="Milangeur">Milangeur</option>
              <option value="VPower">VPower</option>
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
              {citerne ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CiterneFormModal;
