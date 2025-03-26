import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "content-type": "application/json"
    }
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
export const employeeService = {
    getAllEmployees: (params = {}) => api.get('/employes', { params }).then(res => res.data),
    getEmployee: (id) => api.get(`/employes/${id}`).then(res => res.data),
    createEmployee: (data) => api.post('/employes', data).then(res => res.data),
    updateEmployee: (id, data) => api.put(`/employes/${id}`, data).then(res => res.data),
    deleteEmployee: (id) => api.delete(`/employes/${id}`).then(res => res.data),
};
export const PlanService = {
    getAllPlans: () => api.get('/plannings').then(res => res.data),
    getPlan: (id) => api.get(`/plannings/${id}`).then(res => res.data),
    createPlan: (data) => api.post('/plannings', data).then(res => res.data),
    updatePlan: (id, data) => api.put(`/plannings/${id}`, data).then(res => res.data),
    deletePlan: (id) => api.delete(`/plannings/${id}`).then(res => res.data),
};

export const pompeService = {
    getAllPompes: (params = {}) => api.get('/pompes', { params }).then(res => res.data),
    getPompe: (id) => api.get(`/pompes/${id}`).then(res => res.data),
    createPompe: (data) => api.post('/pompes', data).then(res => res.data),
    updatePompe: (id, data) => api.put(`/pompes/${id}`, data).then(res => res.data),
    deletePompe: (id) => api.delete(`/pompes/${id}`).then(res => res.data),
};

export const produitService = {
    getAllProduits: (params = {}) => api.get('/produits', { params }).then(res => res.data),
    getProduit: (id) => api.get(`/produits/${id}`).then(res => res.data),
    createProduit: (data) => api.post('/produits', data).then(res => res.data),
    updateProduit: (id, data) => api.put(`/produits/${id}`, data).then(res => res.data),
    deleteProduit: (id) => api.delete(`/produits/${id}`).then(res => res.data),
};
export const venteService = {
    getAllVentes: (params = {}) => api.get('/ventes', { params }).then(res => res.data),
    getVente: (id) => api.get(`/ventes/${id}`).then(res => res.data),
    createVente: (data) => api.post('/ventes', data).then(res => res.data),
    updateVente: (id, data) => api.put(`/ventes/${id}`, data).then(res => res.data),
    deleteVente: (id) => api.delete(`/ventes/${id}`).then(res => res.data),
  };
  export const fournisseurService = {
    getAllFournisseurs: () => api.get('/fournisseurs').then(res => res.data),
    getFournisseur: (id) => api.get(`/fournisseurs/${id}`).then(res => res.data),
    createFournisseur: (data) => api.post('/fournisseurs', data).then(res => res.data),
    updateFournisseur: (id, data) => api.put(`/fournisseurs/${id}`, data).then(res => res.data),
    deleteFournisseur: (id) => api.delete(`/fournisseurs/${id}`).then(res => res.data)
  };
  export const citerneService = {
    getAllCiternes: () => api.get('/citernes').then(res => res.data),
    getCiterne: (id) => api.get(`/citernes/${id}`).then(res => res.data),
    createCiterne: (data) => api.post('/citernes', data).then(res => res.data),
    updateCiterne: (id, data) => api.put(`/citernes/${id}`, data).then(res => res.data),
    deleteCiterne: (id) => api.delete(`/citernes/${id}`).then(res => res.data),
  };
  export const stationService = {
    getAllStations: () => api.get('/stations').then((res) => res.data),
    getStation: (id) => api.get(`/stations/${id}`).then((res) => res.data),
    createStation: (data) => api.post('/stations', data).then((res) => res.data),
    updateStation: (id, data) => api.put(`/stations/${id}`, data).then((res) => res.data),
    deleteStation: (id) => api.delete(`/stations/${id}`).then((res) => res.data),
  };
  export const authService = {
    register: (email, password) => 
      api.post('/auth/register', { email, password }).then(res => {
        localStorage.setItem('token', res.data.token);
        // No need to store adminId since /me will use the token
        return res.data.admin;
      }),
    login: (email, password) => 
      api.post('/auth/login', { email, password }).then(res => {
        localStorage.setItem('token', res.data.token);
        // No need to store adminId
        return res.data.admin;
      }),
      logout: () => {
        localStorage.removeItem('token'); // Clear the token from storage
        return Promise.resolve(); // Return a resolved promise (optional)
      }
  };
  

  export const adminService = {
    getAdmin: (id) => api.get(`/admin/${id}`).then(res => res.data),
    updateProfile: (id, data) => api.put(`/admin/${id}`, data).then(res => res.data),
  };