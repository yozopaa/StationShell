import React, { useState, useEffect } from 'react';
import { fournisseurService } from '../service/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const FournisseurFormModal = ({ fournisseur, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    NomFournisseur: '',
    AdresseFournisseur: '',
    TelephoneFournisseur: '',
    EmailFournisseur: '',
    VilleFournisseur: '',
    ContactFournisseur: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        NomFournisseur: fournisseur.NomFournisseur || '',
        AdresseFournisseur: fournisseur.AdresseFournisseur || '',
        TelephoneFournisseur: fournisseur.TelephoneFournisseur || '',
        EmailFournisseur: fournisseur.EmailFournisseur || '',
        VilleFournisseur: fournisseur.VilleFournisseur || '',
        ContactFournisseur: fournisseur.ContactFournisseur || ''
      });
    } else {
      setFormData({
        NomFournisseur: '',
        AdresseFournisseur: '',
        TelephoneFournisseur: '',
        EmailFournisseur: '',
        VilleFournisseur: '',
        ContactFournisseur: ''
      });
    }
  }, [fournisseur]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const action = fournisseur ? 'modifier' : 'ajouter';
    const confirm = await MySwal.fire({
      title: 'Confirmer?',
      text: `Voulez-vous vraiment ${action} ce fournisseur?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      if (fournisseur) {
        await fournisseurService.updateFournisseur(fournisseur._id, formData);
      } else {
        await fournisseurService.createFournisseur(formData);
      }
      await MySwal.fire('Succès', `Fournisseur ${action === 'ajouter' ? 'ajouté' : 'modifié'} avec succès`, 'success');
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving fournisseur:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde du fournisseur');
      MySwal.fire('Erreur', 'Échec de l\'opération', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {fournisseur ? 'Modifier Fournisseur' : 'Ajouter Fournisseur'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Nom Fournisseur</label>
            <input
              type="text"
              name="NomFournisseur"
              value={formData.NomFournisseur}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Adresse</label>
            <input
              type="text"
              name="AdresseFournisseur"
              value={formData.AdresseFournisseur}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Téléphone</label>
            <input
              type="text"
              name="TelephoneFournisseur"
              value={formData.TelephoneFournisseur}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="EmailFournisseur"
              value={formData.EmailFournisseur}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Ville</label>
            <input
              type="text"
              name="VilleFournisseur"
              value={formData.VilleFournisseur}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Contact</label>
            <input
              type="text"
              name="ContactFournisseur"
              value={formData.ContactFournisseur}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Optionnel"
            />
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
              {fournisseur ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FournisseurFormModal;