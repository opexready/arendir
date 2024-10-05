import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';  // Asegúrate de agregar el CSS específico para la landing

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');  // Redirige al componente de Login
    };

    return (
        <div>
            <header className="header">
                <img src="/assets/logo.png" alt="Arendir Logo" />
                <nav>
                    <ul className="nav-links">
                        <li><a href="#">Quienes somos</a></li>
                        <li><a href="#">Servicios</a></li>
                        <li><a href="#">Contactanos</a></li>
                    </ul>
                </nav>
                <div className="right-section">
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="buttons">
                        <button className="button btn-login" onClick={handleLoginRedirect}>Inicio</button>
                        <a href="#" className="button btn-register">Registro</a>
                    </div>
                </div>
            </header>

            <section className="slider">
                <div className="slides">
                    <img src="/assets/slide1.png" alt="Slide 1" />
                    <img src="/assets/slide2.png" alt="Slide 2" />
                    <img src="/assets/slide3.png" alt="Slide 3" />
                </div>
                <div className="slide-text">
                    Ofrecemos una solución de software integral para la gestión de rendiciones de gastos
                </div>
                <div className="dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </section>

            <section className="info-section">
                {/* Resto de la landing */}
            </section>
        </div>
    );
};

export default LandingPage;
