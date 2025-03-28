import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { citerneService } from '../service/api';
import CiterneFormModal from './CiterneFormModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Citerne = () => {
  const [citernes, setCiternes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCiterne, setSelectedCiterne] = useState(null);
  const [selectedStation, setSelectedStation] = useState('');
  
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

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

  const uniqueStations = useMemo(() => {
    const stations = citernes.map(c => c.station?.NomStation).filter(Boolean);
    return [...new Set(stations)];
  }, [citernes]);

  // Filter citernes based on selectedStation (if any)
  const filteredCiternes = useMemo(() => {
    if (!selectedStation) return citernes;
    return citernes.filter(c => c.station?.NomStation === selectedStation);
  }, [citernes, selectedStation]);

  const getChartData = () => {
    if (!selectedStation) return [];
    const filtered = citernes.filter(c => c.station?.NomStation === selectedStation);
    const typeMap = {};
    filtered.forEach(c => {
      const type = c.TypeCarburant;
      const capacity = parseFloat(c.Capacite);
      if (typeMap[type]) {
        typeMap[type] += capacity;
      } else {
        typeMap[type] = capacity;
      }
    });
    return Object.entries(typeMap).map(([type, capacity]) => ({ type, capacity }));
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

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-4">
        {/* Remove the sort select; keep only station selection */}
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="border rounded p-2 bg-blue-500 text-white"
        >
          <option value="">Choisir une station</option>
          {uniqueStations.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
      </div>

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

        {/* Responsive and Colorful Chart Section */}
        <div className="relative h-96 w-full">
          {selectedStation ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="type" label={{ value: '', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: '', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} L`} />
                <Legend />
                <Bar dataKey="capacity" fill="#82ca9d" name="Capacité" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">Veuillez sélectionner une station pour voir le graphique.</div>
          )}
        </div>
      </div>

      <div className="flex mb-4 items-center justify-between">
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
                <th className="p-3 text-left">Station</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCiternes.map((citerne, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{citerne.Capacite} L</td>
                  <td className="p-3">{new Date(citerne.DateInstallation).toLocaleDateString()}</td>
                  <td className="p-3">{citerne.TypeCarburant}</td>
                  <td className="p-3">{citerne.station?.NomStation || 'N/A'}</td>
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
