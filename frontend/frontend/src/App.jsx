import {useEffect , useState } from 'react'
import './index.css'
import axios from  'axios'
import Layout from './components/layout/layout'
import Dashboard from './components/Dashboard'
import Pompes from './components/Pompes';
import Employees from './components/Employees';
import Produits from './components/Produits'
import Citerne from './components/Citerne'
import { Routes, Route } from 'react-router-dom';
import Plan from './components/Plan';
import Ventes from './components/Ventes';
import Station from './components/Station';
import Fournisseurs from './components/Fournisseur'
import Adminprofile from './components/Adminprofile'
import LoginPage from './auth/LoginPage'
import Register from './auth/Register'
function App() {
//   const [count, setCount] = useState([])
// useEffect(()=>{
//   const fetchh = async () => {
// const response = await axios.get('http://localhost:5000/api/employes')
// setCount(response.data)
// }
// fetchh()
//   },[])

  
  return (
    <>
<Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pompes" element={<Pompes />} />
        <Route path="employees" element={<Employees />} />
        <Route path="produits" element={<Produits />} />
         <Route path="plan" element={<Plan />} />
         <Route path="citerne" element={<Citerne />} />
         <Route path="ventes" element={<Ventes />} />
         <Route path="fournisseurs" element={<Fournisseurs />} />
         <Route path="station" element={<Station />} />
         <Route path="admin" element={<Adminprofile />} />
     
    
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<Register />} />
    </Routes>
    </>
  )
}

export default App

