import React, { useState, useEffect } from 'react';
import { produitService, stationService } from '../service/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ProduitFormModal = ({ produit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    NomProduit: '',
    Type: '',
    Date_ajout: '',
    Unite: '',
    station: '' // Added station field
  });
  const [error, setError] = useState('');
  const [stations, setStations] = useState([]); // Added stations state

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationData = await stationService.getAllStations();
        setStations(stationData);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
    fetchStations();

    if (produit) {
      setFormData({
        NomProduit: produit.NomProduit || '',
        Type: produit.Type || '',
        Date_ajout: produit.Date_ajout
          ? new Date(produit.Date_ajout).toISOString().split('T')[0]
          : '',
        Unite: produit.Unite || '',
        station: produit.station?._id || produit.station || '' // Handle station as ObjectId
      });
    } else {
      setFormData({
        NomProduit: '',
        Type: '',
        Date_ajout: '',
        Unite: '',
        station: ''
      });
    }
  }, [produit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const action = produit ? 'modifier' : 'ajouter';
    const confirm = await MySwal.fire({
      title: 'Confirmer?',
      text: `Voulez-vous vraiment ${action} ce produit?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      const submissionData = {
        NomProduit: formData.NomProduit,
        Type: formData.Type,
        Date_ajout: new Date(formData.Date_ajout).toISOString(),
        Unite: formData.Unite,
        station: formData.station // Station ID
      };
      if (produit) {
        await produitService.updateProduit(produit._id, submissionData);
      } else {
        await produitService.createProduit(submissionData);
      }
      await MySwal.fire('Succès', `Produit ${action === 'ajouter' ? 'ajouté' : 'modifié'} avec succès`, 'success');
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving produit:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde du produit');
      MySwal.fire('Erreur', 'Échec de l\'opération', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {produit ? 'Modifier Produit' : 'Ajouter Produit'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Nom du Produit</label>
            <input
              type="text"
              name="NomProduit"
              value={formData.NomProduit}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Type</label>
            <input
              type="text"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Date d'ajout</label>
            <input
              type="date"
              name="Date_ajout"
              value={formData.Date_ajout}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Unité</label>
            <input
              type="text"
              name="Unite"
              value={formData.Unite}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
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
              {produit ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProduitFormModal;