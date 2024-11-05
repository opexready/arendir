import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,        // Importar FormControl
  InputLabel,         // Importar InputLabel
  Select 
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./DatosRecibo.css";
import api, { baseURL } from "../api";
import lupaIcon from '../assets/lupa-icon.png';

const DatosRecibo = () => {
  const categoryOptions = [
    { value: "63111", label: "Servicio transporte De carga" },
    { value: "63112", label: "Movilidad" },
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
  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setCategory(selectedValue);
    const selectedOption = categoryOptions.find(
        (option) => option.value === selectedValue
    );
    setFormData((prevFormData) => ({
        ...prevFormData,
        cuentaContable: selectedValue,
        rubro: selectedOption ? selectedOption.label : "",
    }));
 };

  const [records, setRecords] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCuentaContable, selectedRubro, numeroRendicion } =
    location.state || {};
  const [formData, setFormData] = useState({
    fecha: "",
    ruc: "",
    tipoDoc: "",
    cuentaContable: selectedCuentaContable || "",
    serie: "",
    numero: "",
    rubro: selectedRubro || "",
    moneda: "PEN", 
    afecto: "",
    igv: "",
    inafecto: "",
    total: "",
    archivo: "", 
  });
  const [tipoCambio, setTipoCambio] = useState("");
  const [searchRuc, setSearchRuc] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreRendicion, setNombreRendicion] = useState("");

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [documentoIdToDelete, setDocumentoIdToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});



  useEffect(() => {
    const fetchRendicion = async () => {
      try {
        const response = await api.get(`/rendicion/last`, {
          params: { user_id: 22 } // Ajusta el parámetro según tu lógica
        });
        setNombreRendicion(response.data.nombre); // Almacena el valor de nombre en el estado
      } catch (error) {
        console.error("Error al obtener el nombre de la rendición:", error);
      }
    };
  
    fetchRendicion();
  }, []);



  const handleViewFile = (fileLocation) => {
    setSelectedFile(fileLocation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = async (documentoId) => {
    try {
      await axios.delete(`${baseURL}/documentos/${documentoId}`);
      setRecords(records.filter(record => record.id !== documentoId)); // Elimina el documento del estado
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      setError("Error al eliminar el documento. Por favor, intente nuevamente.");
    }
  }

  const handleOpenConfirmDeleteDialog = (documentoId) => {
    setDocumentoIdToDelete(documentoId);
    setConfirmDeleteDialogOpen(true);
  };
  
  const handleCloseConfirmDeleteDialog = () => {
    setDocumentoIdToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };
  
  const handleConfirmDelete = async () => {
    if (documentoIdToDelete) {
      try {
        await axios.delete(`${baseURL}/documentos/${documentoIdToDelete}`);
        setRecords(records.filter(record => record.id !== documentoIdToDelete)); // Elimina el documento del estado
        handleCloseConfirmDeleteDialog(); // Cierra el diálogo después de la eliminación
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        setError("Error al eliminar el documento. Por favor, intente nuevamente.");
        handleCloseConfirmDeleteDialog();
      }
    }
  };
  

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       setIsLoading(true); // Activa el estado de carga
        
  //       // Llamada a la API para obtener los registros
  //       const response = await api.get("/documentos/", {
  //         params: {
  //           company_name: "innova",
  //           estado: "POR APROBAR",
  //           username: "colauser1@gmail.com",
  //           tipo_solicitud: "",
  //           tipo_anticipo: "",
  //           numero_rendicion: "R00002",
  //           fecha_solicitud_from: "",
  //           fecha_solicitud_to: "",
  //           fecha_rendicion_from: "",
  //           fecha_rendicion_to: "",
  //         },
  //       });
        
  //       // Almacena los datos obtenidos en el estado 'records'
  //       setRecords(response.data);
  //     } catch (error) {
  //       console.error("Error al obtener los registros:", error);
  //     } finally {
  //       setIsLoading(false); // Desactiva el estado de carga
  //     }
  //   };
    
  //   fetchRecords(); // Llama a la función cuando se monta el componente
  // }, []);
  
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true); // Activa el estado de carga
  
        // Llamada a la API para obtener los registros, usando nombreRendicion dinámicamente
        const response = await api.get("/documentos/", {
          params: {
            company_name: "innova",
            estado: "POR APROBAR",
            username: "colauser1@gmail.com",
            tipo_solicitud: "",
            tipo_anticipo: "",
            numero_rendicion: nombreRendicion, // Usa nombreRendicion dinámicamente
            fecha_solicitud_from: "",
            fecha_solicitud_to: "",
            fecha_rendicion_from: "",
            fecha_rendicion_to: "",
          },
        });
  
        // Almacena los datos obtenidos en el estado 'records'
        setRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      } finally {
        setIsLoading(false); // Desactiva el estado de carga
      }
    };
  
    // Llama a fetchRecords solo si nombreRendicion tiene un valor
    if (nombreRendicion) {
      fetchRecords();
    }
  }, [nombreRendicion]); // Ejecuta el efecto cuando nombreRendicion cambia
  

  useEffect(() => {
    if (formData.igv) {
      const afectoValue = (parseFloat(formData.igv) / 0.18).toFixed(2);
      setFormData((prevFormData) => ({
        ...prevFormData,
        afecto: afectoValue,
      }));
    }
  }, [formData.igv]);
  useEffect(() => {
    if (formData.moneda === "USD" && formData.fecha) {
      fetchTipoCambio(formData.fecha);
    }
  }, [formData.moneda, formData.fecha]);
  useEffect(() => {
    if (formData.total && formData.afecto && formData.igv) {
      const total = parseFloat(formData.total);
      const afecto = parseFloat(formData.afecto);
      const igv = parseFloat(formData.igv);
      const inafectoValue = (total - (afecto + igv)).toFixed(2);

      setFormData((prevFormData) => ({
        ...prevFormData,
        inafecto: inafectoValue,
      }));
    }
  }, [formData.total, formData.afecto, formData.igv]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchTipoCambio = async (fecha) => {
    try {
      const response = await axios.get(
        `${baseURL}/tipo-cambio/?fecha=${fecha}`
      );
      setTipoCambio(response.data.precioVenta);
      console.log("Tipo de cambio obtenido:", response.data.precioVenta);
    } catch (error) {
      setError(
        "Error al obtener el tipo de cambio. Por favor, intente nuevamente."
      );
    }
  };

  const handleNewExpense = () => {
    // Acciones para el botón "Nuevo"
   // navigate("/ruta-nuevo"); // Reemplaza "/ruta-nuevo" con la ruta correspondiente
    setShowForm(true); 
  };

  const handleContinueExpense = () => {
    // Acciones para el botón "Seguir Gasto"
   // navigate("/ruta-seguir"); // Reemplaza "/ruta-seguir" con la ruta correspondiente
    setShowForm(true);
  };

  const handleSearchRucChange = (e) => {
    setSearchRuc(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/consulta-ruc?ruc=${searchRuc}`
      );
      setSearchResult(response.data);
      setFormData({
        ...formData,
        ruc: searchRuc,
        tipoDoc: response.data.tipoDocumento,
      });
      setError("");
    } catch (error) {
      setError("Error al buscar el RUC. Asegúrese de que el número es válido.");
      setSearchResult(null);
    }
  };

  const handleQrFileChange = async (event) => {
    const file = event.target.files[0];
    setQrFile(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);

      try {
        const decodeResponse = await axios.post(
          `${baseURL}/decode-qr/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (decodeResponse.data.detail === "No QR code found in the image") {
          setError(
            "No se encontró un código QR en la imagen. Por favor, intente con otra imagen."
          );
        } else {
          const decodedRuc = decodeResponse.data.ruc;
          const rucResponse = await axios.get(
            `${baseURL}/consulta-ruc?ruc=${decodedRuc}`
          );
          const razonSocial = rucResponse.data.razonSocial;

          setFormData((prevFormData) => ({
            ...prevFormData,
            fecha: decodeResponse.data.fecha || "",
            ruc: decodeResponse.data.ruc || "",
            tipoDoc: decodeResponse.data.tipo || "",
            serie: decodeResponse.data.serie || "",
            numero: decodeResponse.data.numero || "",
            igv: decodeResponse.data.igv || "",
            total: decodeResponse.data.total || "",
            proveedor: razonSocial || "Proveedor Desconocido",
          }));
          setError(""); 
        }
      } catch (error) {
        setError(
          "Error al procesar el QR. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false); 
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);

      try {
        const uploadResponse = await axios.post(
          `${baseURL}/upload-file-firebase/`,
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
        setError(
          "Error al subir el archivo. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validar campos obligatorios
    if (!formData.archivo) {
      errors.archivo = "Subir Recibo es obligatorio";
    }
    if (!formData.rubro) {
      errors.rubro = "Rubro es obligatorio";
    }
  
    // Mostrar errores si existen
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");
    let loggedInUser = "";

    if (token) {
      const decodedToken = jwtDecode(token);
      loggedInUser = decodedToken.sub;
    } else {
      console.error("Token not found in localStorage.");
    }

    const todayDate = new Date().toISOString().split("T")[0];

    const requestData = {
      fecha_solicitud: todayDate,
      dni: formData.dni || "12345678",
      usuario: loggedInUser,
      gerencia: "Gerencia de Finanzas",
      ruc: formData.ruc,
      proveedor: formData.proveedor || "Proveedor Desconocido",
      fecha_emision: formData.fecha,
      moneda: formData.moneda || "PEN",
      tipo_documento: formData.tipoDoc,
      serie: formData.serie,
      correlativo: formData.numero,
      tipo_gasto: "Servicios",
      sub_total: parseFloat(formData.total) - parseFloat(formData.igv),
      igv: parseFloat(formData.igv),
      no_gravadas: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
      importe_facturado: parseFloat(formData.total),
      tc: formData.moneda === "USD" ? tipoCambio : 1,
      anticipo: 0.0,
      total: parseFloat(formData.total),
      pago: parseFloat(formData.total),
      detalle: "Pago por servicios de consultoría",
      estado: "POR APROBAR",
      tipo_solicitud: "RENDICION",
      empresa: "innova",
      archivo: formData.archivo,
      tipo_cambio: formData.moneda === "USD" ? tipoCambio : 1,
      afecto: parseFloat(formData.afecto) || 0.0,
      inafecto: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
      rubro: formData.rubro,
      cuenta_contable: parseInt(formData.cuentaContable, 10),
      numero_rendicion: nombreRendicion,
    };

    try {
      await axios.post(`${baseURL}/documentos/`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setDialogOpen(true);
    } catch (error) {
      setError("Error al enviar los datos. Por favor, intente nuevamente.");
    }
  };


  const handleNewExpense2 = () => {
    setShowForm(true); 
  };
  
  const handleContinueExpense2 = () => {
    setShowForm(true);
  };

  


  // const handleDialogClose = async (registerAnother) => {
  //   setDialogOpen(false);

  //   if (registerAnother) {

  //     setFormData({
  //       fecha: "",
  //       ruc: "",
  //       tipoDoc: "",
  //       cuentaContable: selectedCuentaContable || "",
  //       serie: "",
  //       numero: "",
  //       rubro: selectedRubro || "",
  //       moneda: "PEN", 
  //       afecto: "",
  //       igv: "",
  //       inafecto: "",
  //       total: "",
  //       archivo: "",
  //   });
  //   setSearchRuc(""); // Opcional: limpiar otros campos relacionados
  //   setSearchResult(null);
  //   setError("");

  //     try {
  //       const userString = localStorage.getItem("user");
  //       const user = userString ? JSON.parse(userString) : null;
  //       const userId = user ? user.id : null;

  //       if (userId) {
  //         const response = await api.get(`/rendicion/last`, {
  //           params: { user_id: userId },
  //         });
  //         const { nombre } = response.data;
  //         navigate("/colaborador/rendicion-gastos");
  //       } else {
  //         alert("Error: Usuario no autenticado");
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener la última rendición:", error);
  //       alert("Error al obtener la última rendición. Intente nuevamente.");
  //     }
  //   } else {
  //     localStorage.removeItem("numero_rendicion");
  //     navigate("/colaborador");
  //   }
  // };
  const handleDialogClose = async (registerAnother) => {
    setDialogOpen(false);

    if (registerAnother) {
        // Agrega este código para limpiar el formulario
        setFormData({
            fecha: "",
            ruc: "",
            tipoDoc: "",
            cuentaContable: selectedCuentaContable || "",
            serie: "",
            numero: "",
            rubro: selectedRubro || "",
            moneda: "PEN", 
            afecto: "",
            igv: "",
            inafecto: "",
            total: "",
            archivo: "",
        });
        setSearchRuc(""); // Opcional: limpiar otros campos relacionados
        setSearchResult(null);
        setError("");

        try {
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            const userId = user ? user.id : null;

            if (userId) {
                const response = await api.get(`/rendicion/last`, {
                    params: { user_id: userId },
                });
                const { nombre } = response.data;
                navigate("/colaborador/datos-recibo"); // Si quieres mantener la misma página, elimina esta línea o reemplaza con `navigate(0)` si necesitas un reload.
            } else {
                alert("Error: Usuario no autenticado");
            }
        } catch (error) {
            console.error("Error al obtener la última rendición:", error);
            alert("Error al obtener la última rendición. Intente nuevamente.");
        }
    } else {
        localStorage.removeItem("numero_rendicion");
        navigate("/colaborador");
    }
};


  return (
    
    <Container sx={{ marginTop: -20 }}>

<Container sx={{ marginBottom: 2 }}> 
      <Box display="flex" justifyContent="flex-end">
      <Button
  variant="contained"
  color="primary"
  sx={{ marginRight: 2 }}
  onClick={handleNewExpense2}
>
  Nuevo Registro
</Button>
<Button
  variant="contained"
  color="secondary"
  onClick={handleContinueExpense2}
>
  Finalizar Rendición
</Button>
{showForm && (
  <Button
    variant="contained"
    color="secondary"
    onClick={() => alert("Movilidad seleccionada")}
  >
    Movilidad
  </Button>
)}

      </Box>

      


    </Container>
    {showForm && (
      <Card sx={{ boxShadow: 10 }}>
        <CardContent>
          <div className="form-group row">
            <div className="col-md-4">
              <TextField
                label="Buscar por RUC"
                variant="outlined"
                fullWidth
                value={searchRuc}
                onChange={handleSearchRucChange}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                  backgroundColor: "#2E3192",
                  "&:hover": { backgroundColor: "#1F237A" },
                }}
              >
                Buscar
              </Button>
            </div>

            <div className="col-md-4">
            <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            marginTop: 2,
            borderColor: "#2E3192",
            color: "#2E3192",
            "&:hover": {
              backgroundColor: "#F15A29",
              borderColor: "#F15A29",
              color: "white",
            },
          }}
        >
          Subir Recibo
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
        {formErrors.archivo && <p style={{ color: 'red', marginTop: '5px' }}>{formErrors.archivo}</p>}

            </div>

            <div className="col-md-4">
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  marginTop: 2,
                  borderColor: "#2E3192",
                  color: "#2E3192",
                  "&:hover": {
                    backgroundColor: "#F15A29",
                    borderColor: "#F15A29",
                    color: "white",
                  },
                }}
              >
                Escanear QR
                <input type="file" hidden onChange={handleQrFileChange} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              {error && <Alert severity="error">{error}</Alert>}
              {searchResult && (
                <Alert severity="success">
                  <p>
                    <strong>Razón Social:</strong> {searchResult.razonSocial}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {searchResult.direccion}
                  </p>
                  <p>
                    <strong>Estado:</strong> {searchResult.estado}
                  </p>
                </Alert>
              )}
            </>
          )}

          {/* <form onSubmit={handleSubmit}>
            {["fecha", "ruc", "cuentaContable", "serie", "numero", "rubro"].map(
              (field) => (
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
              )
            )}

            <TextField
              label="Tipo de Documento"
              variant="outlined"
              fullWidth
              margin="normal"
              id="tipoDoc"
              name="tipoDoc"
              value={formData.tipoDoc}
              onChange={handleChange}
              select
            >
              <MenuItem value="Factura">Factura</MenuItem>
              <MenuItem value="Recibo por Honorarios">
                Recibo por Honorarios
              </MenuItem>
              <MenuItem value="Boleta de Venta">Boleta de Venta</MenuItem>
              <MenuItem value="Boleto Aéreo">Boleto Aéreo</MenuItem>
              <MenuItem value="Nota de Crédito">Nota de Crédito</MenuItem>
              <MenuItem value="Nota de Débito">Nota de Débito</MenuItem>
              <MenuItem value="Ticket o cinta emitido por máquina registradora">
                Ticket o cinta emitido por máquina registradora
              </MenuItem>
              <MenuItem value="Recibo Servicio Público">
                Recibo Servicio Público
              </MenuItem>
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
              <MenuItem value="PEN">PEN</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </TextField>

            <TextField
              label="Afecto"
              variant="outlined"
              fullWidth
              margin="normal"
              id="afecto"
              name="afecto"
              value={formData.afecto}
            />

            {["igv", "inafecto", "total"].map((field) => (
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
              sx={{
                marginTop: 4,
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
              }}
            >
              Solicitar
            </Button>
          </form> */}

          <form onSubmit={handleSubmit}>
            {["fecha", "ruc", "cuentaContable", "serie", "numero"].map((field) => (
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

            {/* Rubro field with Select */}
            {/* <FormControl fullWidth variant="outlined" sx={{ marginBottom: 3 }}>
              <InputLabel id="category-label">Rubro</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={handleCategoryChange}
                label="Rubro"
              >
                <MenuItem value="" disabled>Seleccione un rubro</MenuItem>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

<FormControl fullWidth variant="outlined" sx={{ marginBottom: 3 }} error={!!formErrors.rubro}>
  <InputLabel id="category-label">Rubro</InputLabel>
  <Select
    labelId="category-label"
    id="category"
    value={category}
    onChange={handleCategoryChange}
    label="Rubro"
  >
    <MenuItem value="" disabled>Seleccione un rubro</MenuItem>
    {categoryOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
  {formErrors.rubro && <p style={{ color: 'red', marginTop: '5px' }}>{formErrors.rubro}</p>}
</FormControl>


            {/* Tipo de Documento */}
            <TextField
              label="Tipo de Documento"
              variant="outlined"
              fullWidth
              margin="normal"
              id="tipoDoc"
              name="tipoDoc"
              value={formData.tipoDoc}
              onChange={handleChange}
              select
            >
              <MenuItem value="Factura">Factura</MenuItem>
              <MenuItem value="Recibo por Honorarios">Recibo por Honorarios</MenuItem>
              <MenuItem value="Boleta de Venta">Boleta de Venta</MenuItem>
              <MenuItem value="Boleto Aéreo">Boleto Aéreo</MenuItem>
              <MenuItem value="Nota de Crédito">Nota de Crédito</MenuItem>
              <MenuItem value="Nota de Débito">Nota de Débito</MenuItem>
              <MenuItem value="Ticket o cinta emitido por máquina registradora">
                Ticket o cinta emitido por máquina registradora
              </MenuItem>
              <MenuItem value="Recibo Servicio Público">Recibo Servicio Público</MenuItem>
            </TextField>

            {/* Moneda */}
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
              <MenuItem value="PEN">PEN</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </TextField>

            {/* Afecto */}
            <TextField
              label="Afecto"
              variant="outlined"
              fullWidth
              margin="normal"
              id="afecto"
              name="afecto"
              value={formData.afecto}
            />

            {/* Campos IGV, Inafecto y Total */}
            {["igv", "inafecto", "total"].map((field) => (
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 4,
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
              }}
            >
              Solicitar
            </Button>
          </form>

        </CardContent>
      </Card>
)}

<Typography variant="h6" gutterBottom>
  RENDICIÓN: {nombreRendicion}
</Typography>

{isLoading ? (
  <CircularProgress />
) : (
//   <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
//   <Table>
//     <TableHead sx={{ backgroundColor: '#2E3192' }}> {/* Fondo de la cabecera en azul oscuro */}
//       <TableRow>
//         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de Ítem</TableCell>
//         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rubro</TableCell>
//         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
//         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ver Archivo</TableCell> {/* Nueva columna para ver archivo */}
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {records.map((record, index) => (
//         <TableRow key={record.id}>
//           <TableCell>{index + 1}</TableCell>
//           <TableCell>{record.rubro}</TableCell>
//           <TableCell>{record.total}</TableCell>
//           <TableCell>
//             {record.archivo && (
//               <Button variant="text" onClick={() => handleViewFile(record.archivo)}>
//                 <img src={lupaIcon} alt="Ver Archivo" style={{ width: 24 }} />
//               </Button>
//             )}
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

<TableContainer component={Paper} sx={{ marginBottom: 4 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#1F237A' }}>
        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de Ítem</TableCell>
        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rubro</TableCell>
        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ver Archivo</TableCell>
        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Eliminar</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {records.map((record, index) => (
        <TableRow key={record.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{record.rubro}</TableCell>
          <TableCell>{record.total}</TableCell>
          <TableCell>
            {record.archivo && (
              <Button variant="text" onClick={() => handleViewFile(record.archivo)}>
                <img src={lupaIcon} alt="Ver Archivo" style={{ width: 24 }} />
              </Button>
            )}
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleOpenConfirmDeleteDialog(record.id)}
            >
              Eliminar
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



)}


      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Datos enviados con éxito</DialogTitle>
        <DialogContent>
          <DialogContentText>Documento creado correctamente.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Adicionar Gasto
          </Button>
          <Button onClick={() => handleDialogClose(false)} color="secondary">
            Finalizar Rendición
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Archivo del Documento</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <iframe
              src={selectedFile}
              width="100%"
              height="600px"
              title="Archivo del Documento"
              frameBorder="0"
            />
          )}
        </DialogContent>
      </Dialog>

     
      <Dialog
  open={confirmDeleteDialogOpen}
  onClose={handleCloseConfirmDeleteDialog}
>
  <DialogTitle>Confirmación</DialogTitle>
  <DialogContent>
    <DialogContentText>
      ¿Desea eliminar este registro?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseConfirmDeleteDialog} color="primary">
      No
    </Button>
    <Button onClick={handleConfirmDelete} color="secondary">
      Sí
    </Button>
  </DialogActions>
</Dialog>



    </Container>
  );
};

export default DatosRecibo;
