import React, { useState, useEffect } from 'react';
import { pompeService } from '../service/api';
import PompeFormModal from './PompeFormModal';

const Pompes = () => {
  const [pompes, setPompes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPompe, setSelectedPompe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState(''); // '', 'numero', 'status', 'debit', 'station-asc', 'station-desc'

  useEffect(() => {
    fetchPompes();
  }, []);

  const fetchPompes = async () => {
    try {
      const data = await pompeService.getAllPompes();
      setPompes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pompes:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pompe?')) {
      try {
        await pompeService.deletePompe(id);
        setPompes(pompes.filter(pompe => pompe._id !== id));
      } catch (err) {
        console.error('Error deleting pompe:', err);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedPompe(null);
    setShowModal(true);
  };

  const handleEditClick = (pompe) => {
    setSelectedPompe(pompe);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchPompes(); // Refresh the list after add/edit
  };

  // Filter by Numero or Station (case-insensitive)
  const filteredPompes = pompes.filter(p =>
    p.Numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.station?.NomStation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered list based on sortOption
  const sortedPompes = filteredPompes.sort((a, b) => {
    if (sortOption === 'numero') {
      return a.Numero.localeCompare(b.Numero);
    }
    if (sortOption === 'status') {
      if (a.Statut === b.Statut) return 0;
      return a.Statut === 'Actif' ? -1 : 1;
    }
    if (sortOption === 'debit') {
      return b.Debit - a.Debit;
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

  // Calculate stats
  const totalPompes = pompes.length;
  const activePompes = pompes.filter(p => p.Statut === 'Actif').length;
  const totalDebit = pompes.reduce((sum, p) => sum + p.Debit, 0);

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-yellow-400 text-black">
          <div className="text-sm mb-1">Nombre de Pompes</div>
          <div className="text-3xl font-bold">{totalPompes}</div>
        </div>
        <div className="p-4 rounded shadow bg-green-500 text-white">
          <div className="text-sm mb-1">Pompes Actives</div>
          <div className="text-3xl font-bold">{activePompes}</div>
        </div>
        <div className="p-4 rounded shadow bg-blue-500 text-white">
          <div className="text-sm mb-1">Total Débit</div>
          <div className="text-3xl font-bold">{totalDebit}</div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex mb-4 items-center justify-between">
        <div className="flex flex-grow items-center">
          <input 
            type="text" 
            placeholder="Recherche par Numéro ou Station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 mr-2 flex-grow"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded bg-red-700 text-white py-2.5 px-2 hover:bg-red-800"
          >
            <option value="">Trier par</option>
            <option value="numero">Numéro</option>
            <option value="status">Statut</option>
            <option value="debit">Débit</option>
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
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg text-center">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-center">Numéro</th>
                <th className="p-3 text-center">Statut</th>
                <th className="p-3 text-center">Débit</th>
                <th className="p-3 text-center">Employé</th>
                <th className="p-3 text-center">Station</th> {/* New column */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPompes.map((pompe, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{pompe.Numero}</td>
                  <td className="p-3 flex items-center justify-center">
                    {pompe.Statut === 'Actif' ? (
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    )}
                    {pompe.Statut}
                  </td>
                  <td className="p-3">{pompe.Debit}</td>
                  <td className="p-3">{pompe.Employee}</td>
                  <td className="p-3">{pompe.station?.NomStation || 'N/A'}</td> {/* Display station */}
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => handleEditClick(pompe)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={() => handleDelete(pompe._id)}
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

      {/* Modal for add/edit pompe */}
      {showModal && (
        <PompeFormModal 
          pompe={selectedPompe}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Pompes;