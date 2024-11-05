import React from 'react';
import './Home.css'; // Importar el archivo CSS

const Home = ({ user }) => {
    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    // return (
    //     <div className="home-container">
    //         <div className="home-card">
    //             <h1 className="home-title">Bienvenido, {user.full_name}</h1>
    //             {/* Eliminar los botones */}
    //         </div>
    //     </div>
    // );
};

export default Home;
