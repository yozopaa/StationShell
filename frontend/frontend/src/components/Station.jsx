import React, { useState, useEffect } from 'react';
import { stationService } from '../service/api';
import StationFormModal from './StationFormModal';

const Station = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await stationService.getAllStations();
      setStations(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stations:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStation(null);
    setShowModal(true);
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        await stationService.deleteStation(id);
        fetchStations();
      } catch (error) {
        console.error("Error deleting station:", error);
      }
    }
  };

  const handleSave = () => {
    fetchStations();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stations</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600"
        >
          Ajouter Station
        </button>
      </div>

      {stations.length === 0 ? (
        <div className="text-gray-500">Aucune station disponible.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div
              key={station._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {station.NomStation}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Adresse:</span> {station.AdresseStation}
                  </p>
                  <p>
                    <span className="font-medium">Ville:</span> {station.VilleStation}
                  </p>
                  <p>
                    <span className="font-medium">Téléphone:</span> {station.TelephoneStation}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {station.EmailStation || "N/A"}
                  </p>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      station.StatusStation === "Actif"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {station.StatusStation || "N/A"}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(station)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(station._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <StationFormModal
          station={selectedStation}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Station;