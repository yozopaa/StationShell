import React, { useState, useEffect } from 'react';
import { venteService, employeeService, stationService, produitService } from '../service/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const VenteFormModal = ({ vente, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    EmployeeVente: '',
    QuantiteVente: '',
    DateVente: '',
    ModePaiement: '',
    TypeVente: '',
    ProduitNom: '', // Changed to ProduitNom to store product ID
    PrixVente: '',
    station: ''
  });
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [produits, setProduits] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await employeeService.getAllEmployees();
        const stationData = await stationService.getAllStations();
        const produitData = await produitService.getAllProduits();
        setProduits(produitData);
        setEmployees(employeeData);
        setStations(stationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    if (vente) {
      setFormData({
        EmployeeVente: vente.EmployeeVente || '',
        QuantiteVente: vente.QuantiteVente || '',
        DateVente: vente.DateVente
          ? new Date(vente.DateVente).toISOString().split('T')[0]
          : '',
        ModePaiement: vente.ModePaiement || '',
        PrixVente: vente.PrixVente || '',
        TypeVente: vente.TypeVente || '',
        ProduitNom: vente.ProduitNom?._id || vente.ProduitNom || '', // Set to product ID
        station: vente.station?._id || vente.station || ''
      });
    } else {
      setFormData({
        EmployeeVente: '',
        QuantiteVente: '',
        DateVente: '',
        ModePaiement: '',
        TypeVente: '',
        PrixVente: '',
        ProduitNom: '',
        station: ''
      });
    }
  }, [vente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const action = vente ? 'modifier' : 'ajouter';
    const confirm = await MySwal.fire({
      title: 'Confirmer?',
      text: `Voulez-vous vraiment ${action} cette vente?`,
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
        EmployeeVente: formData.EmployeeVente,
        QuantiteVente: Number(formData.QuantiteVente),
        DateVente: new Date(formData.DateVente).toISOString(),
        ModePaiement: formData.ModePaiement,
        TypeVente: formData.TypeVente,
        ProduitNom: formData.ProduitNom, // Send product ID
        PrixVente: Number(formData.PrixVente),
        station: formData.station
      };
      if (vente) {
        await venteService.updateVente(vente._id, submissionData);
      } else {
        await venteService.createVente(submissionData);
      }
      await MySwal.fire('Succès', `Vente ${action === 'ajouter' ? 'ajoutée' : 'modifiée'} avec succès`, 'success');
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving vente:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde de la vente');
      MySwal.fire('Erreur', 'Échec de l\'opération', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{vente ? 'Modifier Vente' : 'Ajouter Vente'}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Employé</label>
            <select
              name="EmployeeVente"
              value={formData.EmployeeVente}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un Employé</option>
              {employees.map((employee, idx) => (
                <option 
                  key={idx} 
                  value={`${employee.NomEmploye} ${employee.PrenomEmploye}`}
                >
                  {employee.NomEmploye} {employee.PrenomEmploye}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Quantité Vendue</label>
            <input
              type="number"
              name="QuantiteVente"
              value={formData.QuantiteVente}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: 100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Prix Vendu</label>
            <input
              type="number"
              name="PrixVente"
              value={formData.PrixVente}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: 100"
            />
          </div>
          <div>
               <label className="block text-sm text-gray-600">Type Vente</label>
            <select
              name="TypeVente"
              value={formData.TypeVente}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un type</option>
              <option value="Servic">Service </option>
              <option value="Carburant">Carburant</option>
              <option value="Produit">Produit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Produit</label>
            <select
              name="ProduitNom"
              value={formData.ProduitNom}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un produit</option>
              {produits.map((p) => (
                <option 
                  key={p._id} 
                  value={p._id}
                >
                  {p.NomProduit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Date de Vente</label>
            <input
              type="date"
              name="DateVente"
              value={formData.DateVente}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Mode de Paiement</label>
            <select
              name="ModePaiement"
              value={formData.ModePaiement}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner...</option>
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="Chèque">Chèque</option>
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
              {vente ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenteFormModal;