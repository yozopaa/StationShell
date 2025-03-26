import React, { useState, useEffect } from 'react';
import { produitService } from '../service/api';
import ProduitFormModal from './ProduitFormModel';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState(''); // '', 'nom', 'type', 'station-asc', 'station-desc'

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const data = await produitService.getAllProduits();
      setProduits(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching produits:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: 'Confirmer la suppression?',
      text: 'Voulez-vous vraiment supprimer ce produit? Cette action est irréversible.',
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
      await produitService.deleteProduit(id);
      setProduits(produits.filter(p => p._id !== id));
      MySwal.fire('Supprimé', 'Le produit a été supprimé avec succès', 'success');
    } catch (err) {
      console.error('Error deleting produit:', err);
      MySwal.fire('Erreur', 'Échec de la suppression du produit', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedProduit(null);
    setShowModal(true);
  };

  const handleEditClick = (produit) => {
    setSelectedProduit(produit);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchProduits();
  };

  // Filter by NomProduit or Station (case-insensitive)
  const filteredProduits = produits.filter(p =>
    p.NomProduit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.station?.NomStation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered list based on sortOption
  const sortedProduits = filteredProduits.sort((a, b) => {
    if (sortOption === 'nom') {
      return a.NomProduit.localeCompare(b.NomProduit);
    }
    if (sortOption === 'type') {
      return a.Type.localeCompare(b.Type);
    }
    if (sortOption === 'station-asc') {
      const stationA = a.station?.NomStation || '';
      const stationB = b.station?.NomStation || '';
      return stationA.localeCompare(stationB);
    }
    if (sortOption === 'station-desc') {
      const stationA = a.station?.NomStation || '';
      const stationB = b.station?.NomStation || '';
      return stationB.localeCompare(stationA);
    }
    return 0;
  });

  // Calculate stats (example)
  const totalProduits = produits.length;

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-yellow-400 text-black">
          <div className="text-sm mb-1">Nombre de Produits</div>
          <div className="text-3xl font-bold">{totalProduits}</div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex mb-4 items-center justify-between">
        <div className="flex flex-grow items-center">
          <input 
            type="text" 
            placeholder="Recherche par Nom ou Station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 mr-2 flex-grow"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded bg-red-500 text-white py-2.5 px-2 rounded hover:bg-red-800"
          >
            <option value="">Trier par</option>
            <option value="nom">Nom</option>
            <option value="type">Type</option>
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

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg text-center">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-center">Nom Produit</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Date d'Ajout</th>
                <th className="p-3 text-center">Unité</th>
                <th className="p-3 text-center">Station</th> {/* New column */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProduits.map((produit, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{produit.NomProduit}</td>
                  <td className="p-3">{produit.Type}</td>
                  <td className="p-3">
                    {new Date(produit.Date_ajout).toLocaleDateString()}
                  </td>
                  <td className="p-3">{produit.Unite}</td>
                  <td className="p-3">{produit.station?.NomStation || 'N/A'}</td> {/* Display station */}
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => handleEditClick(produit)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={() => handleDelete(produit._id)}
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

      {/* Modal for add/edit produit */}
      {showModal && (
        <ProduitFormModal 
          produit={selectedProduit}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Produits;