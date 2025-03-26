import React, { useState, useEffect } from 'react';
import { citerneService } from '../service/api';
import CiterneFormModal from './CiterneFormModal';
import DailyDeclineChart from './DailyDeclineChart';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Citerne = () => {
  const [citernes, setCiternes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCiterne, setSelectedCiterne] = useState(null);
  const [sortOption, setSortOption] = useState(''); // State for station sorting

  useEffect(() => {
    fetchCiternes();
  }, []);

  const fetchCiternes = async () => {
    try {
      const data = await citerneService.getAllCiternes();
      setCiternes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching citernes:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: 'Confirmer la suppression?',
      text: 'Voulez-vous vraiment supprimer cette citerne? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non',
      confirmButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) return;

    try {
      await citerneService.deleteCiterne(id);
      setCiternes(citernes.filter(c => c._id !== id));
      MySwal.fire('Supprimé', 'La citerne a été supprimée avec succès', 'success');
    } catch (err) {
      console.error('Error deleting citerne:', err);
      MySwal.fire('Erreur', 'Échec de la suppression de la citerne', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedCiterne(null);
    setShowModal(true);
  };

  const handleEditClick = (citerne) => {
    setSelectedCiterne(citerne);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchCiternes();
  };

  // Sort citernes based on the selected sort option
  const sortedCiternes = [...citernes].sort((a, b) => {
    if (sortOption === 'station-asc') {
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

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Diesel</div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">15,000 L</div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
          {/* Other fuel type cards remain unchanged */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Millangeur</div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">5,000 L</div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">SSPL</div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">1,000 L</div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">VPower</div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">3,000 L</div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-80 w-full overflow-hidden">
          <DailyDeclineChart />
        </div>
      </div>

      <div className="flex mb-4 items-center justify-between">
        <div className="flex space-x-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded p-2 bg-red-500 text-white"
          >
            <option value="">Trier par station</option>
            <option value="station-asc">Station (A-Z)</option>
            <option value="station-desc">Station (Z-A)</option>
          </select>
        </div>
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
          onClick={handleAddClick}
        >
          Ajouter
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Capacité (L)</th>
                <th className="p-3 text-left">Date d'Installation</th>
                <th className="p-3 text-left">Type de Carburant</th>
                <th className="p-3 text-left">Station</th> {/* New column */}
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCiternes.map((citerne, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{citerne.Capacite} L</td>
                  <td className="p-3">{new Date(citerne.DateInstallation).toLocaleDateString()}</td>
                  <td className="p-3">{citerne.TypeCarburant}</td>
                  <td className="p-3">{citerne.station?.NomStation || 'N/A'}</td> {/* Display station */}
                  <td className="p-3 flex items-center justify-center">
                    {citerne.Statut === 'Actif' ? (
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    )}
                    {citerne.Statut}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => handleEditClick(citerne)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={() => handleDelete(citerne._id)}
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
        <CiterneFormModal
          citerne={selectedCiterne}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Citerne;