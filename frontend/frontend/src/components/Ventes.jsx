import React, { useState, useEffect } from 'react';
import { venteService } from '../service/api';
import VenteFormModal from './VenteFormModel';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Ventes = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVente, setSelectedVente] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchVentes();
  }, []);

  const fetchVentes = async () => {
    try {
      const data = await venteService.getAllVentes();
      setVentes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ventes:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: 'Confirmer la suppression?',
      text: 'Voulez-vous vraiment supprimer cette vente? Cette action est irréversible.',
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
      await venteService.deleteVente(id);
      setVentes(ventes.filter(v => v._id !== id));
      MySwal.fire('Supprimé', 'La vente a été supprimée avec succès', 'success');
    } catch (err) {
      console.error('Error deleting vente:', err);
      MySwal.fire('Erreur', 'Échec de la suppression de la vente', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedVente(null);
    setShowModal(true);
  };

  const handleEditClick = (vente) => {
    setSelectedVente(vente);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchVentes();
  };

  const filteredVentes = ventes.filter(v =>
    v.ModePaiement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(v.DateVente).toLocaleDateString().includes(searchQuery) ||
    v.station?.NomStation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVentes = filteredVentes.sort((a, b) => {
    if (sortOption === 'quantity') {
      return b.QuantiteVente - a.QuantiteVente;
    } else if (sortOption === 'station-asc') {
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

  const totalDebit = ventes.reduce((sum, v) => sum + v.PrixVente, 0);

  return (
    <div className="p-6">
      <div className="flex mb-4 items-center justify-between">
        <div className="flex flex-grow items-center">
          <input
            type="text"
            placeholder="Recherche par date, mode de paiement ou station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 mr-2 flex-grow"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded bg-red-500 text-white py-2.5 px-2 rounded hover:bg-red-8000"
          >
            <option value="">Trier par</option>
            <option value="quantity">Quantité (décroissant)</option>
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

      <div className="overflow-x-auto">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded shadow bg-yellow-400 text-black">
                <div className="text-sm mb-1">Total des Ventes</div>
                <div className="text-3xl font-bold">{totalDebit} DH</div>
              </div>
            </div>
            <table className="min-w-full bg-white border rounded-lg text-center">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-center">Employé</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Type Produit</th>
                  <th className="p-3 text-center">Prix Vendu</th>
                  <th className="p-3 text-center">Quantité Vendue</th>
                  <th className="p-3 text-center">Mode de Paiement</th>
                  <th className="p-3 text-center">Station</th> {/* New column */}
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedVentes.map((vente, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">{vente.EmployeeVente}</td>
                    <td className="p-3">
                      {new Date(vente.DateVente).toLocaleDateString()}
                    </td>
                    <td className="p-3">{vente.TypeVente}</td>
                    <td className="p-3">{vente.PrixVente}</td>
                    <td className="p-3">{vente.QuantiteVente}</td>
                    <td className="p-3">{vente.ModePaiement}</td>
                    <td className="p-3">{vente.station?.NomStation || 'N/A'}</td> {/* Display station */}
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                          onClick={() => handleEditClick(vente)}
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                          onClick={() => handleDelete(vente._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {showModal && (
        <VenteFormModal
          vente={selectedVente}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Ventes;