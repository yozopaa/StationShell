import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminService } from '../service/api';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    NomAdmin: '', PrenomAdmin: '', Address: '', Telephone: '', Role: ''
  });
  const [message, setMessage] = useState('');
  
  const adminId = '67e3c4d5600966a629e99a8f'; // Replace with your actual admin ID

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await adminService.getAdmin(adminId);
        setAdmin(data);
        setProfileData({
          NomAdmin: data.NomAdmin || '',
          PrenomAdmin: data.PrenomAdmin || '',
          Address: data.Address || '',
          Telephone: data.Telephone || '',
          Role: data.Role || ''
        });
      } catch (error) {
        console.error('Error fetching admin:', error);
        setMessage('Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // Handle input changes in edit mode
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Submit profile updates with SweetAlert feedback
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAdmin = await adminService.updateProfile(adminId, profileData);
      setAdmin(updatedAdmin);
      setEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Error updating profile',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Loading and error states
  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  if (!admin) return <div className="text-center mt-10 text-red-500">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
      {message && <div className="mb-4 text-center text-red-500">{message}</div>}

      {/* View Mode */}
      {!editing ? (
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="text-gray-700">Last Name:</strong> {admin.NomAdmin || 'Not set'}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">First Name:</strong> {admin.PrenomAdmin || 'Not set'}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Email:</strong> {admin.Email}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Address:</strong> {admin.Address || 'Not set'}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Phone:</strong> {admin.Telephone || 'Not set'}
          </p>
         
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="NomAdmin"
              value={profileData.NomAdmin}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="PrenomAdmin"
              value={profileData.PrenomAdmin}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="Address"
              value={profileData.Address}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="Telephone"
              value={profileData.Telephone}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
         
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProfile;