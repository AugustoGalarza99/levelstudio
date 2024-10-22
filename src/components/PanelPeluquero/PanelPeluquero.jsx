import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import GeneradorCodigo from '../GeneradorCodigo/GeneradorCodigo';
import CalendarioPeluquero from '../CalendarioPeluquero/CalendarioPeluquero';



const PanelPeluquero = () => {
    const [uidPeluquero, setUidPeluquero] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          setUidPeluquero(user.uid); // Obtenemos el UID del peluquero autenticado
        } else {
          console.log('No hay usuario autenticado.');
        }
      }, []);



    return (
        <div>
            <h1>Mi agenda</h1>
            <GeneradorCodigo />
            {uidPeluquero ? (
                <CalendarioPeluquero uidPeluquero={uidPeluquero} />
            ) : (
                <p>Cargando el UID del peluquero...</p>
            )}
        </div>
    );
};

export default PanelPeluquero;
