import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Asegúrate de tener el archivo CSS para los estilos
import "@fortawesome/fontawesome-free/css/all.css"; // Estilos de Font Awesome

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLoginClick = () => {
    navigate("/login"); // Redirigir al login
  };

  const methodsPageClick = () => {
    navigate("/payment-methods"); // Redirigir al login
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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
      <header>
        <div className="top-bar">
          <p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pcblanco.png?alt=media&token=4b2317e9-b04b-4ff6-9ead-349fb037327f"
              alt="icono"
              className="top-bar-icon"
            />
            ¿Qué esperas para probar Arendir? Tenemos <strong>7 días</strong>.
            <a href="#" className="top-bar-link">
              prueba gratis.
            </a>
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
                <a onClick={() => scrollToSection("about")} href="#about">
                  Quiénes somos
                </a>
              </li>
              <li>
                <a onClick={() => scrollToSection("services")} href="#services">
                  Servicios
                </a>
              </li>
              <li>
                <a onClick={() => scrollToSection("pricing")} href="#pricing">
                  Tarifario
                </a>
              </li>
              <li>
                <a href="/payment-methods" className="subscripcion">
                  Obtener Subscripción
                </a>
              </li>
            </ul>
          </nav>
          <div className="right-section">
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
            <div className="buttons">
              <button onClick={handleLoginClick} className="button btn-login">
                Ingresar
              </button>
              <a href="#" className="button btn-register">
                Registro
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Slider */}
      <section className="slider">
        <div
          className="slides"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
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
        <div className="text-form">
          Ofrecemos una solución de software integral para la gestión de
          rendiciones de ga
          <span className="highlight">stos</span>
        </div>
        <div className="dots">
          <span
            className={`dot ${currentIndex === 0 ? "active" : ""}`}
            onClick={() => setCurrentIndex(0)}
          ></span>
          <span
            className={`dot ${currentIndex === 1 ? "active" : ""}`}
            onClick={() => setCurrentIndex(1)}
          ></span>
          <span
            className={`dot ${currentIndex === 2 ? "active" : ""}`}
            onClick={() => setCurrentIndex(2)}
          ></span>
        </div>
      </section>

      {/* Info Section */}
      <section id="about" className="info-section">
        <div className="info-background">
          <div className="info-content">
            <div className="info-content2">
              <h2>
                ¿Quiénes som<span className="highlight">os?</span>
              </h2>
              <p>
                Nos especializamos en digitalizar y optimizar la gestión de
                rendición de gastos empresariales, ofreciendo soluciones
                innovadoras para administrar reembolsos de manera eficiente y en
                tiempo real. Nuestra plataforma combina tecnología avanzada y
                atención personalizada, adaptándose a las necesidades de cada
                cliente. Con integridad y transparencia, garantizamos procesos
                confiables que impulsan el control y la eficiencia empresarial.
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
      <section id="services" className="feature-section">
        <div class="container right-title">
          <h2>Servicios</h2>
        </div>
        <div className="container feature-container">
          <div className="left-content">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/fondocelular.jpg?alt=media&token=2e81d0f2-830b-4880-80eb-b44341cfc603"
              alt="Feature Image"
              className="feature-image"
            />
          </div>
          <div className="right-content">
            <p>
              El servicio principal es facilitar la gestión de rendición de
              gastos de empresas a través de una plataforma digital que agiliza
              el proceso y aumente la transparencia. Esto permite a las
              organizaciones optimizar el control y la rendición de gastos,
              mejorando la eficiencia. La empresa se presenta como una solución
              integral para la administración de gastos, destacando su enfoque
              en la simplicidad y en el ahorro de tiempo y recursos.
            </p>
          </div>
        </div>
        <div class="container_logo2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0"
            alt="Ilustración de computadora"
            className="info-logo2"
          />
        </div>
      </section>

      <section id="pricing" className="plans-section">
        <div className="plans-container">
          <div className="plans-title">
            <h2>Planes</h2>
          </div>
          <div className="plans-grid">
            <div className="plan">
              <h3>Personal</h3>
              <p>Obtén el mejor precio para uso personal</p>
              <button className="plan-button">Comprar</button>
              <p className="plan-price">S/ 8 / Mensual</p>
            </div>
            <div className="plan">
              <h3>Negocio</h3>
              <p>Accede a las funciones principales al iniciar tu negocio</p>
              <button className="plan-button">Comprar</button>
              <p className="plan-price">S/ 15 / Mensual</p>
            </div>
            <div className="plan">
              <h3>Corporativo</h3>
              <p>Desbloquea todas las funciones, ideal para empresas</p>
              <button className="plan-button">Comprar</button>
              <p className="plan-price">S/ 25 / Mensual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Socios estratégicos Section */}
      <section className="partners-section">
        <div className="partners-header">
          <h2>Nuestros socios estratégicos</h2>
        </div>
        <div className="partners-logos">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa1.png?alt=media&token=e1b80f2f-83fd-487f-94a3-b52b652e851b"
            alt="Socio 1"
            className="partner-logo"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa3.png?alt=media&token=633634d0-09e8-42c4-8708-350b82fdd86c"
            alt="Socio 2"
            className="partner-logo"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa4.png?alt=media&token=fc3b7769-9abc-4357-8361-16c27192e152"
            alt="Socio 3"
            className="partner-logo"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa2.png?alt=media&token=aa29c4bf-f40c-42e5-8e99-f87d35a28e8a"
            alt="Socio 4"
            className="partner-logo"
          />
        </div>
      </section>

      {/* Nuevo Footer */}
      <footer className="new-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
              alt="Arendir Logo Blanco"
            />
          </div>
          <div className="footer-section">
            <h4>Sobre Arendir</h4>
            <ul>
              <li>
                <a href="#">Quienes somos</a>
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

export default LandingPage;
