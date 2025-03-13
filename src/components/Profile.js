import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    role: "",
    company_name: "",
    cargo: "",
    dni: "",
    zona_venta: "",
    area: "",
    ceco: "",
    gerencia: "",
    jefe_id: "",
    cuenta_bancaria: "",
    banco: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await api.get("/api/users/me/");
          setUser(userResponse.data);
          setFormData(userResponse.data); // Llenar el formulario con los datos del usuario
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los datos actualizados a la API
      const response = await api.put(`/api/users/${user.id}/`, formData);
      if (response.data) {
        alert("Datos actualizados correctamente");
        setUser(response.data); // Actualizar el estado del usuario con los nuevos datos
      }
    } catch (error) {
      console.error("Error al actualizar los datos", error);
      alert("Error al actualizar los datos");
    }
  };

  return (
    <div className="container" style={{ marginTop: "-100px" }}>
      <h1 className="text-primary">Perfil de Usuario</h1>
      <div className="row">
        <div className="col-md-8">
          <h2 className="text-white bg-primary p-2">Información del Usuario</h2>
          {user && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled // El nombre de usuario no se puede editar
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <input
                  type="text"
                  className="form-control"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled // El rol no se puede editar
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Empresa</label>
                <input
                  type="text"
                  className="form-control"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled // La empresa no se puede editar
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cargo</label>
                <input
                  type="text"
                  className="form-control"
                  name="cargo"
                  value={formData.cargo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  name="dni"
                  value={formData.dni || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Zona de venta</label>
                <input
                  type="text"
                  className="form-control"
                  name="zona_venta"
                  value={formData.zona_venta || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Área</label>
                <input
                  type="text"
                  className="form-control"
                  name="area"
                  value={formData.area || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">CECO</label>
                <input
                  type="text"
                  className="form-control"
                  name="ceco"
                  value={formData.ceco || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Gerencia</label>
                <input
                  type="text"
                  className="form-control"
                  name="gerencia"
                  value={formData.gerencia || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Jefe ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="jefe_id"
                  value={formData.jefe_id || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cuenta bancaria</label>
                <input
                  type="text"
                  className="form-control"
                  name="cuenta_bancaria"
                  value={formData.cuenta_bancaria || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Banco</label>
                <input
                  type="text"
                  className="form-control"
                  name="banco"
                  value={formData.banco || ""}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;