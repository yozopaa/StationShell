// Employees.js
import React, { useState, useEffect } from 'react';
import { employeeService } from '../service/api';
import EmployeeFormModal from './EmployeeFormModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: 'Confirmer la suppression?',
      text: 'Voulez-vous vraiment supprimer cet employé? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non',
      confirmButtonColor: '#d33',
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp._id !== id));
      MySwal.fire('Supprimé', 'L\'employé a été supprimé avec succès', 'success');
    } catch (error) {
      console.error('Error deleting employee:', error);
      MySwal.fire('Erreur', 'Échec de la suppression de l\'employé', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchEmployees();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.NomEmploye.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEmployees = filteredEmployees.sort((a, b) => {
    if (sortOption === 'name') {
      return a.NomEmploye.localeCompare(b.NomEmploye);
    }
    if (sortOption === 'status') {
      if (a.Status === b.Status) return 0;
      return a.Status === 'Active' ? -1 : 1;
    }
    if (sortOption === 'age') {
      const ageA = new Date().getFullYear() - new Date(a.DateNaissance).getFullYear();
      const ageB = new Date().getFullYear() - new Date(b.DateNaissance).getFullYear();
      return ageA - ageB;
    }
    if (sortOption === 'station') {
      const stationA = a.station?.NomStation || '';
      const stationB = b.station?.NomStation || '';
      return stationA.localeCompare(stationB);
    }
    return 0;
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow bg-blue-500 text-white">
          <div className="text-sm mb-1">Nombre d'employés</div>
          <div className="text-3xl font-bold">{employees.length}</div>
        </div>
        <div className="p-4 rounded shadow bg-green-500 text-white">
          <div className="text-sm mb-1">Employés actifs</div>
          <div className="text-3xl font-bold">
            {employees.filter(emp => emp.Status === 'Active').length}
          </div>
        </div>
      </div>

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
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded bg-red-500 text-white py-2.5 px-2 rounded hover:bg-red-800"
          >
            <option value="">Trier par</option>
            <option value="name">Nom (A–Z)</option>
            <option value="status">Status</option>
            <option value="age">Âge</option>
            <option value="station">Station</option> {/* Added Station option */}
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
        <table className="min-w-full bg-white border text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center">CIN</th>
              <th className="border p-2 text-center">Nom</th>
              <th className="border p-2 text-center">Prénom</th>
              <th className="border p-2 text-center">Téléphone</th>
              <th className="border p-2 text-center">Adresse</th>
              <th className="border p-2 text-center">Date de Naissance</th>
              <th className="border p-2 text-center">Date d'Embauche</th>
              <th className="border p-2 text-center">Poste</th>
              <th className="border p-2 text-center">Station</th>
              <th className="border p-2 text-center">Statut</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="p-4">Chargement...</td>
              </tr>
            ) : (
              sortedEmployees.map(employee => (
                <tr key={employee.CINEmploye} className="border-b hover:bg-gray-100">
                  <td className="border p-2">{employee.CINEmploye}</td>
                  <td className="border p-2">{employee.NomEmploye}</td>
                  <td className="border p-2">{employee.PrenomEmploye}</td>
                  <td className="border p-2">{employee.TelephoneEmploye}</td>
                  <td className="border p-2">{employee.AdresseEmploye}</td>
                  <td className="border p-2">{new Date(employee.DateNaissance).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(employee.DateEmbauche).toLocaleDateString()}</td>
                  <td className="border p-2">{employee.Poste}</td>
                  <td className="border p-2">{employee.station?.NomStation || 'N/A'}</td>
                  <td className="border p-2">
                    <div className="flex items-center justify-center">
                      {employee.Status === 'Active'
                        ? <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        : <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      }
                      {employee.Status}
                    </div>
                  </td>
                  <td className="border p-2">
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                        onClick={() => handleEditClick(employee)}
                      >
                        Modifier
                      </button>
                     {/* <button 
                        className="bg-gray-800 text-white py-1 px-3 rounded text-sm"
                        onClick={() => handleDelete(employee._id)}
                      >
                        Supprimer
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody> 
        </table>
      </div>

      {showModal && (
        <EmployeeFormModal
          employee={selectedEmployee}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Employees;