import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import "./DatosRecibo.css"; // Asegúrate de que la ruta sea correcta
import api, { baseURL } from "../api"; // Asegúrate de que la ruta sea correcta

const DocumentoDetail = () => {
  const { documento_id } = useParams();
  const navigate = useNavigate();
  const [documento, setDocumento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fecha_emision: "",
    ruc: "",
    tipo_documento: "",
    cuenta_contable: "",
    serie: "",
    numero: "",
    rubro: "",
    moneda: "PEN",
    afecto: "",
    igv: "",
    inafecto: "",
    total: "",
    archivo: "",
  });
  const categoryOptions = [
    { value: "63111", label: "Servicio transporte De carga" },
    { value: "6312", label: "Correos" },
    { value: "6313", label: "Alojamiento" },
    { value: "6314", label: "Alimentación" },
    { value: "6315", label: "Otros gastos de viaje" },
    { value: "6321", label: "Asesoria - Administrativa" },
    { value: "6322", label: "Asesoria - Legal y tributaria" },
    { value: "6323", label: "Asesoria - Auditoría y contable" },
    { value: "6324", label: "Asesoria - Mercadotecnia" },
    { value: "6325", label: "Asesoria - Medioambiental" },
    { value: "6326", label: "Asesoria - Investigación y desarrollo" },
    { value: "6327", label: "Asesoria - Producción" },
    { value: "6329", label: "Asesoria - Otros" },
    {
      value: "6343",
      label: "Mantto y Reparacion - Inmuebles, maquinaria y equipo",
    },
    { value: "6344", label: "Mantto y Reparacion - Intangibles" },
    { value: "6351", label: "Alquileres - Terrenos" },
    { value: "6352", label: "Alquileres - Edificaciones" },
    {
      value: "6353",
      label: "Alquileres - Maquinarias y equipos de explotación",
    },
    { value: "6354", label: "Alquileres - Equipo de transporte" },
    { value: "6356", label: "Alquileres - Equipos diversos" },
    { value: "6361", label: "Energía eléctrica" },
    { value: "6362", label: "Gas" },
    { value: "6363", label: "Agua" },
    { value: "6364", label: "Teléfono" },
    { value: "6365", label: "Internet" },
    { value: "6366", label: "Radio" },
    { value: "6367", label: "Cable" },
    { value: "6371", label: "Publicidad" },
    { value: "6372", label: "Publicaciones" },
    { value: "6373", label: "Servicio de Relaciones públicas" },
    { value: "6391", label: "Gastos bancarios" },
    { value: "6431", label: "Impuesto predial" },
    { value: "6432", label: "Arbitrios municipales y seguridad ciudadana" },
    { value: "6433", label: "Impuesto al patrimonio vehicular" },
    { value: "6434", label: "Licencia de funcionamiento" },
    { value: "6439", label: "Otros" },
    { value: "653", label: "Suscripciones" },
    { value: "654", label: "Licencias y derechos de vigencia" },
    { value: "656", label: "Suministros" },
    { value: "659", label: "Otros gastos de gestión" },
    { value: "6591", label: "Donaciones" },
    { value: "6592", label: "Sanciones administrativas" },
  ];

  useEffect(() => {
    const fetchDocumento = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/documentos/${documento_id}`
        );
        setDocumento(response.data);
        // Actualiza el estado del formulario con los datos del documento
        setFormData({
          fecha_emision: response.data.fecha_emision,
          ruc: response.data.ruc,
          tipo_documento: response.data.tipo_documento,
          cuenta_contable: response.data.cuenta_contable,
          serie: response.data.serie,
          numero: response.data.correlativo,
          rubro: response.data.rubro,
          moneda: response.data.moneda,
          afecto: response.data.afecto,
          igv: response.data.igv,
          inafecto: response.data.no_gravadas,
          total: response.data.total,
          archivo: response.data.archivo,
        });
      } catch (error) {
        console.error("Error al obtener el documento:", error);
        setError("Error al obtener el documento.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumento();
  }, [documento_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rubro") {
      const selectedOption = categoryOptions.find(option => option.label === value);
      if (selectedOption) {
        setFormData({
        ...formData,
          [name]: value,
          cuenta_contable: selectedOption.value, // Actualiza la cuenta contable
        });
        return; // Sale de la función para evitar la actualización duplicada
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);

      try {
        const uploadResponse = await axios.post(
          `${baseURL}/upload-file-firebase/`, // Reemplaza con tu endpoint de subida de archivos
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const fileLocation = uploadResponse.data.file_url;

        setFormData((prevFormData) => ({
          ...prevFormData,
          archivo: fileLocation,
        }));
        setError("");
      } catch (error) {
        setError("Error al subir el archivo. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envía la solicitud PUT para actualizar el documento
      await axios.put(`${baseURL}/documentos/${documento_id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Puedes mostrar un mensaje de éxito al usuario
      alert("Documento actualizado con éxito");
      navigate("/datos-recibo-table"); // Redirigir a la página anterior
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      setError(
        "Error al actualizar el documento. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <Container sx={{ marginTop: -20 }}>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Card sx={{ boxShadow: 10 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Editar Documento
            </Typography>
            <form onSubmit={handleSubmit}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Subir Recibo
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>

              {["fecha_emision", "ruc", "serie", "numero"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ))}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 3 }}
              >
                <InputLabel id="rubro-label">Rubro</InputLabel>
                <Select
                  labelId="rubro-label"
                  id="rubro"
                  value={formData.rubro}
                  onChange={handleChange}
                  label="Rubro"
                >
                  <MenuItem value="" disabled>
                    Seleccione un rubro
                  </MenuItem>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Tipo de Documento"
                variant="outlined"
                fullWidth
                margin="normal"
                id="tipo_documento"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                select
              >
                {["Factura", "Recibo por Honorarios", "Boleta de Venta"].map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                label="Moneda"
                variant="outlined"
                fullWidth
                margin="normal"
                id="moneda"
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                select
              >
                {["PEN", "USD"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              {["afecto", "igv", "inafecto", "total"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ))}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 4 }}
              >
                Actualizar Documento
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default DocumentoDetail;
