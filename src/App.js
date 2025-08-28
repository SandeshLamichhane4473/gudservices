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
import Insurance from './component/Home/Insurance';
 
import Logout from './component/Home/Logout';
import Navbar from './component/Navbar';
import OverallDetails from './component/Home/Files/OverallDetails';
import OverallValutationIdDetails from './component/Home/Valuation/OverallValutationIdDetails';
import ValuationVerify from './component/Home/Valuation/valuationverify';
import Bank from './component/Home/Valuation/Bank';
 import EditValuation from './component/Home/Valuation/EditValuation';
import DashboardLayout from './layout/DashboardLayout';
import Construction from './component/Valuation/Construction';
import Valuation from './component/Valuation/Valuation';
import EditValuationNew from './component/Valuation/EditValuationNew';
import BankNew from './component/Valuation/BankNew';
import DashboardLayoutIns from './layout/DashboardLayoutIns';
import References from './component/Home/References';
import FileDetails from './component/Home/Files/EditFileDetails';
import ViewFiles from './component/Home/Files/ViewFiles';
import Reports from './component/Home/Files/Reports';
function App() {
  document.write = "Gud Services...";
  const [navVisible, showNavbar] = useState(false);
  return (
    <AuthContextProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<> not found</>} />

{/* new valutaion */}
          <Route path="/new" element={<DashboardLayout />}>
            <Route index element={<h2>Welcome to Dashboard</h2>} />
              <Route path="banks" element={<BankNew />} />
            <Route path="construction" element={<Construction />} />
             <Route path="valuation" element={<Valuation />} />
            <Route path="valuation/:id" element={<EditValuationNew />} />
          
            <Route path="logout" element={<Logout />} />
          </Route>

{/* new insurance */}
            <Route path="/newins" element={<DashboardLayoutIns />}>
            <Route index element={<h2>Welcome to New Insurance</h2>} />
              <Route path="insurance" element={<Insurance />} />
            <Route path="newreferences" element={<References />} />
             <Route path="editref" element={<ViewFiles />} />
             <Route path="view/:id" element={<OverallDetails />} />
              <Route path="reports" element={<Reports />} />
  
            <Route path="logout" element={<Logout />} />
          </Route>




          <Route path="/home/view/:id" element={<OverallDetails />} />
          <Route path="/home/val_id/:id" element={<OverallValutationIdDetails />} />
          <Route path="/home/verify/:id" element={<ValuationVerify />} />
          <Route path="/home/editvaluation/:id" element={<EditValuation />} />
          <Route path="/home/bank/" element={<Bank />} />

          <Route path="/home" element={
            <Protected>
              <Home />
            </Protected>} />
        </Routes>

      </div>


    </AuthContextProvider>

  );
}

export default App;

