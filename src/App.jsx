// src/App.js
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Navbar from './components/Navbar/Navbar';
import ReservaPage from './pages/ReservaPage';
import Peluquero from './pages/Peluquero';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPeluquero from './pages/Login';
import Estado from './pages/Estado';
import ReservaManual from './pages/ReservaManual';
import Horarios from './pages/Horarios';
import Servicios from './pages/Servicios';
import Loader from './components/Loader/Loader';
import ResponsiveNavbar from './components/ResponsiveNavbar/ResponsiveNavbar';
import './App.css';
import Finanzas from './pages/Finanzas';


// Componentes simples para las páginas
const NotFound = () => {
  return <h2>Página no encontrada</h2>;
};

function App() {
  const [user, loadingAuth] = useAuthState(auth);  // Monitoreamos el estado de autenticación
  const [isPeluquero, setIsPeluquero] = useState(null); // Estado para verificar si es peluquero

  const checkIfPeluquero = async (user) => {
    const docRef = doc(db, 'peluqueros', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setIsPeluquero(true);
    } else {
      setIsPeluquero(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkIfPeluquero(user);
    } else {
      setIsPeluquero(null); // Reiniciar en caso de que no haya usuario
    }
  }, [user]);

  if (loadingAuth) {
    return <div><Loader /> </div>; // O cualquier otro indicador de carga
  }

  return (
    <Router /*basename='/juan'*/>
      {/*<BottomNavbar isPeluquero={isPeluquero} /> */}
      <div className="app-layout">    
      <ResponsiveNavbar isPeluquero={isPeluquero} />
      

      {/* <Navbar /> */}  
      <div className="app-content">
        <Routes>
          <Route path='/' element={<ReservaPage />} />
          <Route path="/estado" element={<Estado />} />
          {/*<Route path="/productos" element={<Productos />} />*/}
          <Route path="/login" element={<LoginPeluquero />} />

          {/* Ruta protegida para el panel del peluquero */}
          <Route path="/finanzas" element={<ProtectedRoute isPeluquero={isPeluquero}><Finanzas /></ProtectedRoute>} />
          <Route path="/agenda" element={<ProtectedRoute isPeluquero={isPeluquero}><Peluquero /></ProtectedRoute>} />
          <Route path="/reservamanual" element={<ProtectedRoute isPeluquero={isPeluquero}><ReservaManual /></ProtectedRoute>} />
          <Route path="/horarios" element={<ProtectedRoute isPeluquero={isPeluquero}><Horarios /></ProtectedRoute>} />
          <Route path="/servicios" element={<ProtectedRoute isPeluquero={isPeluquero}><Servicios /></ProtectedRoute>} />

          {/* Si el usuario intenta ir a una ruta que no existe */}
          <Route path="*" element={<NotFound />} />
        </Routes>        
      </div>
      </div> 
    </Router>
  );
}

export default App;
