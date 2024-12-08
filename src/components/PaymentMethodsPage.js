import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Reutilizamos los estilos de la landing page
import "@fortawesome/fontawesome-free/css/all.css";

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  // Maneja la redirección a la página principal
  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div>
      {/* Header */}
      <header>
        {/* Barra superior */}
        <div className="top-bar">
          <p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pcblanco.png?alt=media&token=4b2317e9-b04b-4ff6-9ead-349fb037327f"
              alt="icono"
              className="top-bar-icon"
            />
            Aprende más sobre nuestros <strong>Métodos de Pago</strong>.
          </p>
        </div>

        {/* Header principal */}
        <div className="header">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logo.png?alt=media&token=bf0a8b6f-f892-4884-aa3b-1e28a20f9f8b"
            alt="Arendir Logo"
          />
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#">Quiénes somos</a>
              </li>
              <li>
                <a href="#">Servicios</a>
              </li>
              <li>
                <a href="#">Tarifario</a>
              </li>
              <li>
                <a href="#">Soporte</a>
              </li>
            </ul>
          </nav>
          <div className="right-section">
            {/* Iconos sociales */}
            <div className="social-iconss">
              <a
                href="https://www.instagram.com/arendir_pe/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/arendir_pe/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/105542709/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>

            {/* Botón regresar */}
            <div className="buttons">
              <button onClick={handleHomeClick} className="button btn-login">
                Regresar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sección Métodos de Pago */}
      <section className="payment-methods-section">
        <div className="container">
          <h2 className="right-title2">Métodos de Pago</h2>
          <p className="payment-description">
            En Arendir, ofrecemos diversos métodos de pago para adaptarnos a tus
            necesidades:
          </p>

          <div className="payment-methods-grid">
            {/* Método Yape */}
            <div className="payment-method">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/yapeicono.png?alt=media&token=b9bbf281-b3ae-4d0e-9d86-7ea78e1ba3b0"
                alt="Yape Logo"
              />
              <p>Yape</p>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/YAPE.png?alt=media&token=41b4f25f-889f-486e-8e8f-360f2dd3b616"
                alt="Yape QR"
              />
            </div>

            {/* Método Plin */}
            <div className="payment-method">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/plinicono.png?alt=media&token=1299286a-be8e-4238-9c88-d69ea37514cf"
                alt="Plin Logo"
              />
              <p>Plin</p>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/PLIN.png?alt=media&token=882ea5a6-c930-414f-b631-c12162d3c43e"
                alt="Plin QR"
              />
            </div>

            {/* Método BCP */}
            <div className="payment-method">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/BCP.png?alt=media&token=0a37d741-54c4-4dee-b867-d099b39756d1"
                alt="BCP Logo"
              />
              <p>BCP</p>
              <p>Número de Cuenta: 823848239849832409039249</p>
            </div>

            {/* Método Interbank */}
            <div className="payment-method">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/interbank.png?alt=media&token=66d6dd01-f84a-4f08-8f17-7db25e9b5b2a"
                alt="Interbank Logo"
              />
              <p>Interbank</p>
              <p>Número de Cuenta: 2343245465654654</p>
            </div>
          </div>

          <p className="payment-note">
            Si tienes dudas sobre cómo realizar un pago,{" "}
            <strong>contáctanos</strong> y te ayudaremos en el proceso.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="new-footer">
        <div className="footer-container">
          {/* Logo del footer */}
          <div className="footer-logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
              alt="Arendir Logo Blanco"
            />
          </div>

          {/* Secciones del footer */}
          <div className="footer-section">
            <h4>Sobre Arendir</h4>
            <ul>
              <li>
                <a href="#">Quiénes somos</a>
              </li>
              <li>
                <a href="#">Servicios</a>
              </li>
              <li>
                <a href="#">Tarifario</a>
              </li>
              <li>
                <a href="#">Soporte</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Síguenos</h4>
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

          <div className="footer-section">
            <h4>Contáctanos</h4>
            <a href="https://wa.me/1234567890" className="whatsapp-link">
              <i className="fab fa-whatsapp"></i> Chatea por WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentMethodsPage;
