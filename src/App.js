import logo from './logo.svg';
import './App.css';
import { addDoc } from 'firebase/firestore'
import swal from 'sweetalert';
import { Audio } from 'react-loader-spinner';
import { Route, Routes } from 'react-router-dom';
import Login from './component/Login/Login';
import Home from './component/Home/Home';
import { useContext, createContext, useState, useEffect } from 'react';
import AuthContextProvider from './context/AuthContext';
import Protected from './component/ProtectedRoute/Protected';
import { redirect } from 'react-router-dom';

import { useNavigate, Navigate } from 'react-router-dom';
import Logout from './component/Home/Logout';
import Navbar from './component/Navbar';
import OverallDetails from './component/Home/Files/OverallDetails';
import OverallValutationIdDetails from './component/Home/Valuation/OverallValutationIdDetails';
import ValuationVerify from './component/Home/Valuation/valuationverify';
import Bank from './component/Home/Valuation/Bank';
 import EditValuation from './component/Home/Valuation/EditValuation';
function App() {
  document.write = "Gud Services...";
  const [navVisible, showNavbar] = useState(false);
  return (
    <AuthContextProvider>
      <div className="App">

        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="*" element={<> not found</>} />
          <Route path="/home/view/:id" element={<OverallDetails />} />
          <Route path="/home/val_id/:id" element={<OverallValutationIdDetails />} />
          <Route path="/home/verify/:id" element={<ValuationVerify />} />
          <Route path="/home/editvaluation/:id" element={<EditValuation />} />
          <Route path="/home/bank/" element={<Bank />} />

          <Route path="/home" element={
            <Protected>
              <Home />
            </Protected>} />
          {/* <Route path="/" element={<Login />} />
          <Route path="/product" element={<Products />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<> not found</>} />
          <Route path="/home" element={
            <Protected>
              <Home />

            </Protected>} />
          <Route path='/dashboard' element={<Protected><Dashboard /></Protected>} /> */}

        </Routes>

      </div>


    </AuthContextProvider>

  );
}

export default App;

