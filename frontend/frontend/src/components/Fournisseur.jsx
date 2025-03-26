import React, { useState, useEffect } from 'react';
import { fournisseurService } from '../service/api';
import FournisseurFormModal from './FournisseurFormModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Fournisseur() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const data = await fournisseurService.getAllFournisseurs();
      setFournisseurs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching fournisseurs:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: 'Confirmer la suppression?',
      text: 'Voulez-vous vraiment supprimer ce fournisseur? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non',
      confirmButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      await fournisseurService.deleteFournisseur(id);
      setFournisseurs(fournisseurs.filter(f => f._id !== id));
      MySwal.fire('Supprimé', 'Le fournisseur a été supprimé avec succès', 'success');
    } catch (err) {
      console.error('Error deleting fournisseur:', err);
      MySwal.fire('Erreur', 'Échec de la suppression du fournisseur', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedFournisseur(null);
    setShowModal(true);
  };

  const handleEditClick = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchFournisseurs();
  };

  const uniqueCities = [
    ...new Set(fournisseurs.map(f => f.VilleFournisseur).filter(Boolean))
  ];

  const filteredFournisseurs = fournisseurs.filter(f => {
    const matchesName = f.NomFournisseur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity ? f.VilleFournisseur === selectedCity : true;
    return matchesName && matchesCity;
  });

  return (
    <div className="p-6">
      <div className="flex mb-4 items-center justify-between">
        <div className="flex flex-grow items-center">
          <input
            type="text"
            placeholder="Recherche par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 mr-2 flex-grow"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border rounded bg-red-500 text-white py-2.5 px-2 rounded hover:bg-red-800"
          >
            <option value="">Filtrer par ville</option>
            {uniqueCities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
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

      <div className="overflow-x-auto">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom Fournisseur</th>
                <th className="p-3 text-left">Adresse</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFournisseurs.map((fournisseur, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{fournisseur.NomFournisseur}</td>
                  <td className="p-3">{fournisseur.AdresseFournisseur}</td>
                  <td className="p-3">{fournisseur.TelephoneFournisseur}</td>
                  <td className="p-3">{fournisseur.EmailFournisseur}</td>
                  <td className="p-3">{fournisseur.VilleFournisseur}</td>
                  <td className="p-3">{fournisseur.ContactFournisseur}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => handleEditClick(fournisseur)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={() => handleDelete(fournisseur._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <FournisseurFormModal
          fournisseur={selectedFournisseur}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Fournisseur;