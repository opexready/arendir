import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "@fortawesome/fontawesome-free/css/all.css";
import RegisterForm from "./RegisterForm";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleShowRegister = () => setShowRegisterForm(true);
  const handleCloseRegister = () => setShowRegisterForm(false);
  const handleLoginClick = () => navigate("/login");
  const methodsPageClick = () => navigate("/payment-methods");

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header>
        <div className="top-bar">
          <p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pcblanco.png?alt=media&token=4b2317e9-b04b-4ff6-9ead-349fb037327f"
              alt="icono"
              className="top-bar-icon"
            />
            ¿Qué esperas para probar Arendir? Tenemos <strong>7 días</strong> gratis.
            <a href="#" className="top-bar-link" onClick={handleShowRegister}>
              Empezar ahora
            </a>
          </p>
        </div>

        <div className="header">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logo.png?alt=media&token=bf0a8b6f-f892-4884-aa3b-1e28a20f9f8b"
            alt="Arendir Logo"
          />
          <nav>
            <ul className="nav-links">
              <li>
                <a onClick={() => scrollToSection("about")} href="#about">Quiénes somos</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("services")} href="#services">Servicios</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("pricing")} href="#pricing">Tarifario</a>
              </li>
              <li>
                <button onClick={methodsPageClick} className="button btn-method">
                  Obtener Suscripción
                </button>
              </li>
            </ul>
          </nav>
          <div className="right-section">
            <div className="social-iconss">
              <a href="https://www.facebook.com/share/18Kqj8454V/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/arendir_pe/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/105542709/admin/dashboard/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="buttons">
              <button onClick={handleLoginClick} className="button btn-login">Ingresar</button>
              <a href="#" onClick={handleShowRegister} className="button btn-register">Registro</a>
            </div>
          </div>
        </div>
      </header>

      {showRegisterForm && (
        <RegisterForm open={showRegisterForm} onClose={handleCloseRegister} />
      )}

      {/* HERO */}
      <section className="slider">
        <div className="hero-eyebrow">Rendición de gastos con Inteligencia Artificial</div>
        <div className="text-form">
          Tus rendiciones de gastos, viáticos y movilidad,
          <span className="highlight"> listas para SUNAT en segundos</span>
        </div>
        <p className="hero-subtext">
          Arendir usa IA para leer tus comprobantes y extraer automáticamente razón social, fecha,
          tipo de documento, base imponible, IGV, inafecto y total. Sin digitar, sin Excel, sin errores.
        </p>
        <div className="hero-ctas">
          <button className="btn-hero-primary" onClick={handleShowRegister}>
            Prueba gratis 7 días
          </button>
          <button className="btn-hero-secondary" onClick={() => scrollToSection("services")}>
            Ver cómo funciona
          </button>
        </div>
        <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide1.png?alt=media&token=3bf465dc-c288-442a-b57b-113b2f375061"
            alt="Panel de rendición de gastos Arendir"
            className="slide-image"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide2.png?alt=media&token=73e8e0d8-c11b-4133-a791-1473796f6035"
            alt="Registro de comprobantes por WhatsApp"
            className="slide-image"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/slide2.png?alt=media&token=73e8e0d8-c11b-4133-a791-1473796f6035"
            alt="Control de gastos empresariales"
            className="slide-image"
          />
        </div>
        <div className="dots">
          <span className={`dot ${currentIndex === 0 ? "active" : ""}`} onClick={() => setCurrentIndex(0)}></span>
          <span className={`dot ${currentIndex === 1 ? "active" : ""}`} onClick={() => setCurrentIndex(1)}></span>
          <span className={`dot ${currentIndex === 2 ? "active" : ""}`} onClick={() => setCurrentIndex(2)}></span>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Compatible con requisitos SUNAT</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">Tiempo real</div>
          <div className="stat-label">Rendición al instante, no a fin de mes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">0</div>
          <div className="stat-label">Comprobantes perdidos o digitados a mano</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">MYPE y PYME</div>
          <div className="stat-label">Pensado para empresas peruanas</div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="how-section">
        <h2>¿Cómo <span className="highlight">funciona?</span></h2>
        <p className="how-subtitle">
          De la foto del comprobante a la rendición lista, en tres pasos.
        </p>
        <div className="how-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Envía tu comprobante</h3>
            <p>Tu equipo toma una foto de la boleta o factura y la envía por WhatsApp, o la sube directamente desde la plataforma.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>La IA extrae los datos</h3>
            <p>Arendir identifica automáticamente razón social, fecha, tipo de documento, base imponible, IGV, inafecto y total, listos para SUNAT.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Rendición en tiempo real</h3>
            <p>El usuario agrega el motivo del gasto y la rendición queda registrada al instante, con todos los comprobantes almacenados.</p>
          </div>
        </div>
      </section>

      {/* QUIENES SOMOS */}
      <section id="about" className="info-section">
        <div className="info-background">
          <div className="info-content">
            <div className="info-content2">
              <h2>¿Quiénes som<span className="highlight">os?</span></h2>
              <p>
                Somos una empresa peruana especializada en digitalizar la rendición de gastos de viaje,
                viáticos y gastos operativos de empresas mype y pyme. Combinamos inteligencia artificial
                con atención personalizada para que cada rendición se procese en tiempo real, con control
                total y sin trabajo manual. Con integridad y transparencia, ayudamos a las empresas peruanas
                a tener mejor control de sus gastos.
              </p>
            </div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/compu.png?alt=media&token=b4252030-527d-4596-b618-6a0f16f1ff87"
              alt="Plataforma Arendir en computadora"
              className="compu-img"
            />
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="services" className="feature-section">
        <div className="container right-title">
          <h2>Todo lo que necesitas para <span className="highlight">controlar tus gastos</span></h2>
        </div>
        <div className="container feature-container">
          <div className="left-content">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/fondocelular.jpg?alt=media&token=2e81d0f2-830b-4880-80eb-b44341cfc603"
              alt="Registro de gastos desde el celular"
              className="feature-image"
            />
          </div>
          <div className="right-content">
            <p>
              Arendir centraliza la gestión de gastos de viaje, viáticos, anticipos y movilidad de toda
              tu empresa en una sola plataforma. La IA lee cada comprobante y extrae la información que
              exige SUNAT, mientras tú mantienes el control y la transparencia de cada rendición, en
              tiempo real y sin hojas de cálculo.
            </p>
            <ul className="feature-grid">
              <li><i className="fas fa-robot"></i> Lectura automática de comprobantes con IA</li>
              <li><i className="fas fa-file-invoice"></i> Datos SUNAT: RUC, IGV, base imponible y más</li>
              <li><i className="fas fa-route"></i> Gastos de movilidad integrados</li>
              <li><i className="fas fa-money-bill-wave"></i> Control de anticipos por usuario</li>
              <li><i className="fas fa-cloud"></i> Almacenamiento seguro de comprobantes</li>
              <li><i className="fas fa-bolt"></i> Rendición y control en tiempo real</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="pricing" className="plans-section">
        <div className="plans-container">
          <div className="plans-title" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2 className="plan-description">Elige el plan para tu empresa</h2>
          </div>
          <p className="plans-subtitle">
            Planes flexibles según el tamaño de tu equipo y el volumen de comprobantes que manejas.
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
              <button className="plan-cta" onClick={handleShowRegister}>Elegir plan</button>
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
              <button className="plan-cta" onClick={handleShowRegister}>Elegir plan</button>
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
              <button className="plan-cta" onClick={methodsPageClick}>Hablar con ventas</button>
            </div>
          </div>
        </div>
      </section>

      {/* METODOS DE PAGO */}
      <section className="method-section">
        <div className="plans-container">
          <div className="plans-title" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2 className="method-description">Métodos de pago</h2>
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
                <span className="az">Número de Cuenta BCP en soles:</span> 19191892571076
                <br />
                <span className="az">Cuenta Interbancaria:</span> 00219119189257107658
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
                <span className="cv">Cuenta Simple Soles en Interbank:</span> 8983325007330
                <br />
                <span className="cv">Cuenta Interbancaria Interbank:</span> 00389801332500733040
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIOS */}
      <section className="partners-section">
        <div className="partners-header">
          <h2>Nuestros socios estratégicos</h2>
        </div>
        <div className="partners-logos">
          <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/CL1.png?alt=media&token=5d5d38ab-8c1f-41e6-84d9-48dcee457c3e" alt="Socio 1" className="partner-logo" />
          <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/CL2.png?alt=media&token=35dde679-873b-4d9b-bff7-624440d22c5e" alt="Socio 2" className="partner-logo" />
          <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/CL3.png?alt=media&token=c7cd24d4-f608-4065-9822-5da8f42b6d56" alt="Socio 3" className="partner-logo" />
          <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/CL4.png?alt=media&token=c805fe90-9b9a-4788-b9fa-c35fca941ab4" alt="Socio 4" className="partner-logo" />
        </div>
      </section>

      <footer className="new-footer">
        <div
          className="footer-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "40px",
            padding: "20px 0",
            flexWrap: "wrap",
          }}
        >
          <div className="footer-logo" style={{ textAlign: "center", minWidth: "150px" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
              alt="Arendir Logo Blanco"
              style={{ maxWidth: "150px" }}
            />
          </div>

          <div className="footer-section" style={{ textAlign: "center", minWidth: "150px" }}>
            <h4>Sobre Arendir</h4>
            <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
              <li><a onClick={() => scrollToSection("about")} href="#about">Quiénes somos</a></li>
              <li><a onClick={() => scrollToSection("services")} href="#services">Servicios</a></li>
              <li><a onClick={() => scrollToSection("pricing")} href="#pricing">Tarifario</a></li>
              <li><a href="mailto:opexready.soporte@gmail.com">Soporte</a></li>
            </ul>
          </div>

          <div className="footer-section" style={{ textAlign: "center", minWidth: "150px" }}>
            <h4>Síguenos</h4>
            <div className="social-icons" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <a href="https://www.facebook.com/share/18Kqj8454V/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/arendir_pe/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/105542709/admin/dashboard/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section" style={{ textAlign: "center", minWidth: "150px" }}>
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
            © 2025 OPEX READY S.A.C. Todos los derechos reservados. RUC 20612958271
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
