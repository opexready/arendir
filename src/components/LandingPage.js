import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Asegúrate de tener el archivo CSS para los estilos

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLoginClick = () => {
    navigate('/login'); // Redirigir al login
  };

  const currentSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // Cambia las diapositivas cada 5 segundos
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logo.png?alt=media&token=bf0a8b6f-f892-4884-aa3b-1e28a20f9f8b"
          alt="Arendir Logo"
        />
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#">Quienes somos</a>
            </li>
            <li>
              <a href="#">Servicios</a>
            </li>
            <li>
              <a href="#">Contactanos</a>
            </li>
          </ul>
        </nav>
        <div className="right-section">
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <div className="buttons">
            <button onClick={handleLoginClick} className="button btn-login">
              Ingresar
            </button>
            <a href="#" className="button btn-register">
              Registro
            </a>
          </div>
        </div>
      </header>

      {/* Slider */}
      <section className="slider">
        <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide1.png?alt=media&token=3bf465dc-c288-442a-b57b-113b2f375061"
            alt="Slide 1"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide2.png?alt=media&token=73e8e0d8-c11b-4133-a791-1473796f6035"
            alt="Slide 2"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide3.png?alt=media&token=22623873-a054-4e97-8b16-3daf235259df"
            alt="Slide 3"
          />
        </div>
        <div className="slide-text">
          Ofrecemos una solución de software integral para la gestión de rendiciones de gastos
        </div>
        <div className="dots">
          <span className={`dot ${currentIndex === 0 ? 'active' : ''}`} onClick={() => currentSlide(0)}></span>
          <span className={`dot ${currentIndex === 1 ? 'active' : ''}`} onClick={() => currentSlide(1)}></span>
          <span className={`dot ${currentIndex === 2 ? 'active' : ''}`} onClick={() => currentSlide(2)}></span>
        </div>
        <div className="login-form">
          <h3>Iniciar sesión</h3>
          <input type="text" placeholder="Email o teléfono" />
          <input type="password" placeholder="Contraseña" />
          <button className="btn-submit">Iniciar sesión</button>
          <a href="#">¿Has olvidado tu contraseña?</a>
          <a href="#">Iniciar sesión con Google</a>
          <a href="#">¿Estás empezando a usar Arendir? Unirse ahora</a>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
  <div className="info-background">
    <div className="info-content">
      <div className="info-content2">
        <h2>
          Nuestro sistema está diseñado para simplificar y optimizar el proceso de control de
          gastos corporativos
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget
          dolor.
        </p>
      </div>
      <div className="logo-container">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco.png?alt=media&token=d730a36b-5bc6-4c54-8bc8-1350ae15c5ac"
          alt="Arendir Logo Blanco"
          className="info-logo"
        />
      </div>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/compu.png?alt=media&token=b4252030-527d-4596-b618-6a0f16f1ff87"
        alt="Ilustración de computadora"
        className="compu-img"
      />
    </div>
  </div>
</section>


      {/* Feature Section */}
      <section className="feature-section">
        <div className="container feature-container">
          <div className="left-content">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/imagen1.png?alt=media&token=1f4ebb86-5352-41e9-92af-9c93891ede87"
              alt="Feature Image"
              className="feature-image"
            />
          </div>
          <div className="right-content">
            <h2>
              Nos destacamos por brindar una experiencia de usuario fluida y un soporte técnico
              dedicado, adaptándonos a las necesidades específicas de cada empresa, nuestro sistema optimiza
              el control de gastos.
            </h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco.png?alt=media&token=d730a36b-5bc6-4c54-8bc8-1350ae15c5ac"
            alt="Arendir Logo Blanco"
          />
        </div>
        <div className="section">
          <h4>SOBRE ARENDIR</h4>
          <ul>
            <li>
              <a href="#">Nuestra historia y principios</a>
            </li>
            <li>
              <a href="#">Información</a>
            </li>
            <li>
              <a href="#">Trabaja con nosotros</a>
            </li>
          </ul>
        </div>
        <div className="section">
          <h4>SÍGUENOS</h4>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="section">
          <h4>CONTÁCTANOS</h4>
          <div className="whatsapp">
            <a href="https://wa.me/1234567890" style={{ color: '#fff', textDecoration: 'none' }}>
              <i className="fab fa-whatsapp"></i> Chatea por Whatsapp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
