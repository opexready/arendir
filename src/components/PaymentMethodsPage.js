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
            Elige el plan ideal para tu empresa y empieza a rendir en tiempo real.
          </p>
        </div>

        {/* Header principal */}
        <div className="header">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logo.png?alt=media&token=bf0a8b6f-f892-4884-aa3b-1e28a20f9f8b"
            alt="Arendir Logo"
          />
          <div className="right-section">
            {/* Iconos sociales */}
            <div className="social-iconss">
              <a
                href="https://www.facebook.com/share/18Kqj8454V/?mibextid=LQQJ4d"
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

      {/* Nueva Sección de Descripción de Planes */}
      <section id="pricing" className="plans-section">
        <div className="plans-container">
          <div className="plans-title" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2 className="plan-description">Descripción de Planes</h2>
          </div>
          <p className="plans-subtitle">
            Elige el plan según el tamaño de tu equipo y el volumen de comprobantes que manejas.
          </p>
          <div className="plans-grid">
            <div className="plan">
              <h3>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR35.png?alt=media&token=2136de01-56dd-4ae0-81b0-d68744259824"
                  alt="icon"
                  className="plan-icon"
                />
                Personal
              </h3>
              <p className="plan-tagline">Para independientes o equipos pequeños</p>
              <ul>
                <li className="text-card">Hasta 25 comprobantes al mes desde WhatsApp, en automático</li>
                <li className="text-card">1 usuario por razón social</li>
                <li className="text-card">Descarga tus facturas desde WhatsApp y email</li>
              </ul>
              <p className="plan-price">S/ 8 <span>/ mensual</span></p>
              <button className="plan-cta" onClick={handleHomeClick}>Elegir plan</button>
            </div>

            <div className="plan featured">
              <span className="plan-badge">Más elegido</span>
              <h3>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR35.png?alt=media&token=2136de01-56dd-4ae0-81b0-d68744259824"
                  alt="icon"
                  className="plan-icon"
                />
                Negocio
              </h3>
              <p className="plan-tagline">Para empresas en crecimiento</p>
              <ul>
                <li className="text-card">Comprobantes ilimitados desde WhatsApp, por texto o foto</li>
                <li className="text-card">Descarga tu historial de gastos a Excel y PDF</li>
                <li className="text-card">Acceso a Arendir, tu asistente financiero 24/7</li>
              </ul>
              <p className="plan-price">S/ 15 <span>/ mensual</span></p>
              <button className="plan-cta" onClick={handleHomeClick}>Elegir plan</button>
            </div>

            <div className="plan">
              <h3>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR35.png?alt=media&token=2136de01-56dd-4ae0-81b0-d68744259824"
                  alt="icon"
                  className="plan-icon"
                />
                Corporativo
              </h3>
              <p className="plan-tagline">Para empresas con múltiples equipos</p>
              <ul>
                <li className="text-card">Cantidad de comprobantes personalizada</li>
                <li className="text-card">Múltiples usuarios por razón social</li>
                <li className="text-card">Panel de control para ver todas tus facturas</li>
                <li className="text-card">Todo lo incluido en el Plan Negocio</li>
              </ul>
              <p className="plan-price">S/ 25 <span>/ mensual</span></p>
              <button className="plan-cta" onClick={handleHomeClick}>Hablar con ventas</button>
            </div>
          </div>
        </div>
      </section>

      {/* métddos de pago */}
      <section className="method-section">
        <div className="plans-container">
          <div className="plans-title" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2 className="method-description">Métodos de Pago</h2>
          </div>
          <div className="payment-methods-grid">
            <div className="payment-method2">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/yapeicono.png?alt=media&token=b9bbf281-b3ae-4d0e-9d86-7ea78e1ba3b0"
                alt="Yape Logo"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/YAPE.png?alt=media&token=41b4f25f-889f-486e-8e8f-360f2dd3b616"
                alt="Yape QR"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/BCP.png?alt=media&token=0a37d741-54c4-4dee-b867-d099b39756d1"
                alt="BCP Logo"
              />
              <p className="left-aligned">
                <span className="az">Número de Cuenta BCP en soles es:</span>{" "}
                19191892571076
                <br />
                <span className="az">
                  Número de Cuenta Interbancaria es:
                </span>{" "}
                00219119189257107658
              </p>
            </div>
            <div className="payment-method2">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/plinicono.png?alt=media&token=1299286a-be8e-4238-9c88-d69ea37514cf"
                alt="Plin Logo"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/PLIN.png?alt=media&token=882ea5a6-c930-414f-b631-c12162d3c43e"
                alt="Plin QR"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/interbank.png?alt=media&token=66d6dd01-f84a-4f08-8f17-7db25e9b5b2a"
                alt="Interbank Logo"
              />
              <p className="left-aligned">
                <span className="cv">
                  Número de Cuenta Simple Soles en Interbank es:
                </span>{" "}
                8983325007330
                <br />
                <span className="cv">
                  Número de Cuenta Interbancario en Interbank es:
                </span>
                00389801332500733040
              </p>
            </div>
          </div>
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "var(--fs-small)",
            color: "var(--color-text-light)",
          }}
        >
          Si tienes dudas sobre cómo realizar un pago,{" "}
          <a
            href="https://wa.me/921136926"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-primary)", fontWeight: "bold", textDecoration: "none" }}
          >
            contáctanos
          </a>{" "}
          y te ayudaremos en el proceso.
        </p>
      </section>

      {/* Footer */}
      <footer className="new-footer">
        <div
          className="footer-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start", // Alinea todos los elementos al inicio (arriba)
            gap: "40px", // Espaciado entre columnas
            padding: "20px 0",
            flexWrap: "wrap", // Adaptación para pantallas pequeñas
          }}
        >
          {/* Logo */}
          <div
            className="footer-logo"
            style={{ textAlign: "center", minWidth: "150px" }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
              alt="Arendir Logo Blanco"
              style={{ maxWidth: "150px" }}
            />
          </div>

          {/* Sobre Arendir */}
          <div
            className="footer-section"
            style={{ textAlign: "center", minWidth: "150px" }}
          >
            <h4>Sobre Arendir</h4>
            <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
              <li>
              <span>Quiénes somos</span>
              </li>
              <li>
              <span>Servicios</span>
              </li>
              <li>
              <span>Tarifario</span>
              </li>
              <li>
                <a href="mailto:opexready.soporte@gmail.com">Soporte</a>
              </li>
            </ul>
          </div>

          {/* Síguenos */}
          <div
            className="footer-section"
            style={{ textAlign: "center", minWidth: "150px" }}
          >
            <h4>Síguenos</h4>
            <div
              className="social-icons"
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <a
                href="https://www.facebook.com/share/18Kqj8454V/?mibextid=LQQJ4d"
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
          </div>

          {/* Contáctanos */}
          <div
            className="footer-section"
            style={{ textAlign: "center", minWidth: "150px" }}
          >
            <h4>Contáctanos</h4>
            <a
              href="https://wa.me/921136926"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
              style={{
                textDecoration: "none",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fab fa-whatsapp" style={{ marginRight: "8px" }}></i>
              Chatea por WhatsApp
            </a>
          </div>
          <div className="footer-text">
            ©️ 2025 OPEX READY S.A.C Todos los derechos reservados RUC
            20612958271
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentMethodsPage;
