import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

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
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./DatosRecibo.css";
import api, { baseURL } from "../api";

const DatosRecibo = () => {
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
  const [confirmFinalizarDialogOpen, setConfirmFinalizarDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const { selectedCuentaContable, selectedRubro } = location.state || {};
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
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreRendicion, setNombreRendicion] = useState("");
  const [idRendicion, setIdRendicion] = useState("");
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [documentoIdToDelete, setDocumentoIdToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [documentDetail, setDocumentDetail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [showQrReader, setShowQrReader] = useState(false); // Controla visibilidad del lector
  const [qrResult, setQrResult] = useState(null); // Almacena resultado del QR
  const [qrError, setQrError] = useState(null); // Almacena errores del lector
  const [isScanning, setIsScanning] = useState(false); // Indica si está escaneando
  const [availableCameras, setAvailableCameras] = useState([]); // Lista de cámaras
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Estado para alternar entre cámaras

  useEffect(() => {
    if (qrResult) {
      handleProcessQrResult(); 
    }
  }, [qrResult]); //

  const handleProcessQrResult = async () => {
    try {
      if (!qrResult) {
        console.error("No se ha detectado un resultado del escaneo.");
        return;
      }

      console.log("Llamando a la API con el resultado:", qrResult);

      const response = await axios.post(`${baseURL}/api/process-qr/`, {
        data: qrResult, 
      });

      console.log("Respuesta del backend:", response.data);

      const processedData = response.data;

      setFormData((prevFormData) => ({
        ...prevFormData,
        fecha: processedData.fecha || "",
        ruc: processedData.ruc || "",
        tipoDoc: processedData.tipo || "",
        serie: processedData.serie || "",
        numero: processedData.numero || "",
        igv: processedData.igv || "",
        total: processedData.total || "",
      }));
      setSearchRuc(processedData.ruc || "");
      setError("");

      if (processedData.ruc) { // NUEVA LÍNEA: Si se obtuvo el RUC, ejecutar handleSearch
        handleSearch(processedData.ruc); // NUEVA LÍNEA: Llamar a handleSearch con el RUC
      }
      
    } catch (error) {
      setError("Error al procesar el QR. Por favor, inténtalo nuevamente.");
      console.error("Error al llamar a /api/process-qr/:", error);
    }
  };

  const handleCameraSwitch = (mode) => {
    setCameraFacingMode(mode);
    setShowQrReader(false); // Ocultar y reiniciar el lector QR
    setTimeout(() => setShowQrReader(true), 100); // Mostrar lector con la nueva cámara
  };

  useEffect(() => {
    // Enumerar cámaras disponibles
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setAvailableCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Selecciona la primera cámara disponible
        }
      })
      .catch((error) => {
        console.error("Error al enumerar dispositivos:", error);
        setQrError(
          "No se pudieron enumerar las cámaras. Verifica los permisos."
        );
      });
  }, []);

  const normalizeDate = (dateString) => {
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString; // Devuelve la fecha como está si ya tiene el formato correcto
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setDocumentDetail(null);
  };

  const [editRecord, setEditRecord] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.archivo) {
      errors.archivo = "Subir Recibo es obligatorio";
    }
    if (!formData.rubro) {
      errors.rubro = "Rubro es obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await axios.put(`${baseURL}/documentos/${editRecord.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Documento actualizado con éxito");
      setEditRecord(null);
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      setError(
        "Error al actualizar el documento. Por favor, intente nuevamente."
      );
    }
  };

  const handleFinalizarRendicion = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;

      if (!userId) {
        alert("Error: Usuario no autenticado");
        return;
      }

      // Paso 1: Obtener la última rendición
      const lastRendicionResponse = await axios.get(
        `${baseURL}/rendicion/last`,
        {
          params: {
            user_id: userId,
            tipo: "RENDICION",
          },
        }
      );

      if (lastRendicionResponse.data && lastRendicionResponse.data.id) {
        const rendicionId = lastRendicionResponse.data.id;

        // Paso 2: Actualizar la rendición obtenida a estado "ACTIVO"
        await axios.put(`${baseURL}/rendicion/${rendicionId}`, {
          estado: "POR APROBAR",
        });

        // Paso 3: Crear una nueva rendición
        const newRendicionResponse = await axios.post(`${baseURL}/rendicion/`, {
          user_id: userId,
        });
      } else {
      }
    } catch (error) {
      console.error("Error al finalizar la rendición:", error);
      setError(
        "Error al finalizar la rendición. Por favor, intente nuevamente."
      );
    }
  };

  useEffect(() => {
    const fetchRendicion = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        if (userId) {
          const response = await api.get(`/rendicion/last`, {
            params: {
              user_id: userId,
              tipo: "RENDICION", // Puedes reemplazarlo con el valor que necesites
            },
          });
          setNombreRendicion(response.data.nombre);
          setIdRendicion(response.data.id);
        } else {
          alert("Error: Usuario no autenticado");
        }
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


  const handleCloseConfirmDeleteDialog = () => {
    setDocumentoIdToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (documentoIdToDelete) {
      try {
        await axios.delete(`${baseURL}/documentos/${documentoIdToDelete}`);
        setRecords(
          records.filter((record) => record.id !== documentoIdToDelete)
        );
        handleCloseConfirmDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        setError(
          "Error al eliminar el documento. Por favor, intente nuevamente."
        );
        handleCloseConfirmDeleteDialog();
      }
    }
  };

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;
      const username = user ? user.email : null;

      if (userId && username) {
        const response = await api.get("/documentos/", {
          params: {
            company_name: user.company_name,
            estado: "POR APROBAR",
            username: username,
            tipo_solicitud: "",
            tipo_anticipo: "",
            numero_rendicion: nombreRendicion,
            fecha_solicitud_from: "",
            fecha_solicitud_to: "",
            fecha_rendicion_from: "",
            fecha_rendicion_to: "",
          },
        });
        setRecords(response.data);
      } else {
        alert("Error: Usuario no autenticado");
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (nombreRendicion) {
      fetchRecords();
    }
  }, [nombreRendicion]);

  useEffect(() => {
    if (idRendicion) {
      fetchRecords();
    }
  }, [idRendicion]);

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

  const handleSearchRucChange = (e) => {
    setSearchRuc(e.target.value);
  };


  const handleSearch = async (ruc) => {
    try {
      const response = await axios.get(
        `${baseURL}/consulta-ruc?ruc=${ruc || searchRuc}`
      );
      setSearchResult(response.data);
  
      // Actualiza formData manteniendo los datos existentes
      setFormData((prevFormData) => ({
      ...prevFormData,
        ruc: ruc || searchRuc,
        //tipoDoc: response.data.tipoDocumento,
      }));
  
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
      console.log(file);
      console.log(formData);
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
        console.log("############decodeResponse############");
        console.log(decodeResponse);

        if (decodeResponse.data.detail === "No QR code found in the image") {
          setError(
            "No se pudo leer el código QR. Esto puede deberse a: mala iluminación, reflejos, un código QR dañado o fuera de foco, o problemas de permisos para acceder a la cámara. Por favor, asegúrese de que el código QR esté claramente visible, en un lugar bien iluminado, y que su dispositivo tenga permisos para usar la cámara."
          );
        } else {
          const decodedRuc = decodeResponse.data.ruc;
          console.log(decodedRuc);

          let razonSocial = "Proveedor Desconocido"; // Valor por defecto
          try {
            const rucResponse = await axios.get(
              `${baseURL}/consulta-ruc?ruc=${decodedRuc}`
            );
            razonSocial = rucResponse.data.razonSocial || razonSocial;
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(
                "RUC no encontrado, utilizando valor por defecto para Razón Social."
              );
            } else {
              throw error; // Si no es 404, lanzamos el error para manejarlo fuera
            }
          }

          setFormData((prevFormData) => ({
            ...prevFormData,
            fecha: normalizeDate(decodeResponse.data.fecha || ""),
            ruc: decodeResponse.data.ruc || "",
            tipoDoc: decodeResponse.data.tipo || "",
            serie: decodeResponse.data.serie || "",
            numero: decodeResponse.data.numero || "",
            igv: decodeResponse.data.igv || "",
            total: decodeResponse.data.total || "",
            proveedor: razonSocial,
          }));
          setSearchRuc(decodeResponse.data.ruc || "");
          setError("");
          if (decodedRuc) {
            handleSearch(decodedRuc); 
          }
        }
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un código de error (código de estado no 2xx)
          console.error(
            "Error de respuesta del servidor:",
            error.response.data
          );
          setError(
            "Error al procesar el QR: " +
              (error.response.data.message || "Por favor, intente nuevamente.")
          );
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          console.error("No se recibió respuesta:", error.request);
          setError("No se recibió respuesta del servidor. Intente nuevamente.");
        } else {
          // Algo salió mal al configurar la solicitud
          console.error("Error al configurar la solicitud:", error.message);
          setError("Ocurrió un error. Intente nuevamente.");
        }
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
        setError("Error al subir el archivo. Por favor, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.archivo) {
      errors.archivo = "Subir Recibo es obligatorio";
    }
    if (!formData.rubro) {
      errors.rubro = "Rubro es obligatorio";
    }

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

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.id : null;
    const gerencia = user ? user.gerencia : null;
    const todayDate = new Date().toISOString().split("T")[0];

    const requestData = {
      fecha_solicitud: todayDate,
      dni: user.dni,
      usuario: loggedInUser,
      gerencia: gerencia,
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
      detalle: "",
      estado: "POR APROBAR",
      tipo_solicitud: "RENDICION",
      empresa: user.company_name,
      archivo: formData.archivo,
      tipo_cambio: formData.moneda === "USD" ? tipoCambio : 1,
      afecto: parseFloat(formData.afecto) || 0.0,
      inafecto: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
      rubro: formData.rubro,
      cuenta_contable: parseInt(formData.cuentaContable, 10),
      numero_rendicion: nombreRendicion,
      id_user: userId,
      id_numero_rendicion: idRendicion,
    };

    console.log("##################requestData##########",requestData);

    

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

  const [detalle, setDetalle] = useState("");

  const handleDialogClose = async (registerAnother) => {
    setDialogOpen(false);

    if (registerAnother) {
      setFormData({
        fecha: "",
        ruc: "",
        tipoDoc: "",
        cuentaContable: selectedCuentaContable || "",
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
      setSearchRuc("");
      setSearchResult(null);
      setError("");

      try {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;

        if (userId) {
          const response = await api.get(`/rendicion/last`, {
            params: {
              user_id: userId,
              tipo: "RENDICION", // Puedes reemplazarlo con el valor que necesites
            },
          });
          const { nombre } = response.data;
          navigate("/datos-recibo");
        } else {
          alert("Error: Usuario no autenticado");
        }
      } catch (error) {
        console.error("Error al obtener la última rendición:", error);
        alert("Error al obtener la última rendición. Intente nuevamente.");
      }
    } else {
      // localStorage.removeItem("numero_rendicion");
      navigate("/datos-recibo-table");
    }
  };

  return (
    <Container sx={{ marginTop: -20 }}>
      <Typography variant="h6" gutterBottom>
        RENDICIÓN: {nombreRendicion}
      </Typography>
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
              {formErrors.archivo && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {formErrors.archivo}
                </p>
              )}
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
                Escanear imagen adjunta
                <input type="file" hidden onChange={handleQrFileChange} />
              </Button>
            </div>
            <div className="col-md-4">
              <Button
                variant="outlined"
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
                onClick={() => {
                  setShowQrReader(true); // Mostrar lector QR
                  setIsScanning(true); // Mostrar mensaje de escaneando
                  setError(""); // Limpiar errores previos
                  setQrResult(null); // Limpiar resultado previo
                }}
              >
                Escanear QR
              </Button>

              {/* Botones para cambiar de cámara */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "#2E3192",
                    "&:hover": { backgroundColor: "#1F237A" },
                  }}
                  onClick={() => {
                    setCameraFacingMode("environment"); // Cambiar a cámara trasera
                    setShowQrReader(false); // Reiniciar lector QR
                    setTimeout(() => setShowQrReader(true), 100); // Mostrar nuevamente con nueva configuración
                  }}
                >
                  Cámara Trasera
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    backgroundColor: "#F15A29",
                    "&:hover": { backgroundColor: "#D44115" },
                  }}
                  onClick={() => {
                    setCameraFacingMode("user"); // Cambiar a cámara frontal
                    setShowQrReader(false); // Reiniciar lector QR
                    setTimeout(() => setShowQrReader(true), 100); // Mostrar nuevamente con nueva configuración
                  }}
                >
                  Cámara Frontal
                </Button>
              </Box>

              {/* Mensaje de estado */}
              {isScanning && (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Escaneando... Por favor, apunta al código QR.
                </Typography>
              )}

              {/* Lector QR */}
              {showQrReader && (
                <Box sx={{ marginTop: 2, position: "relative" }}>
                  <QrReader
                    constraints={{
                      facingMode: cameraFacingMode, // Alternar entre cámaras
                      width: { ideal: 1920 }, // Resolución ideal
                      height: { ideal: 1080 },
                    }}
                    scanDelay={500} // Escanea cada 500ms
                    onResult={(result, error) => {
                      if (result) {
                        console.log("Resultado del QR:", result.text);
                        setShowQrReader(false); // Oculta el lector QR
                        setIsScanning(false); // Detén el mensaje de escaneo
                        setError(""); // Limpia cualquier mensaje de error
                        setQrResult(result.text); // Almacena el resultado
                      }
                      if (error && error.name !== "NotFoundError") {
                        console.error("Error al leer el QR:", error);
                        setError(
                          "No se pudo leer el QR. Por favor, intenta nuevamente."
                        );
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                  {/* Marco visual */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "200px",
                      height: "200px",
                      border: "2px solid red",
                      boxSizing: "border-box",
                      borderRadius: "5px",
                    }}
                  ></div>
                </Box>
              )}

              {/* Mostrar error en caso de fallo */}
              {error && (
                <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
                  {error}
                </Typography>
              )}
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

          <form onSubmit={handleSubmit}>
            {["fecha", "ruc", "cuentaContable", "serie", "numero"].map(
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

            <FormControl
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 3 }}
              error={!!formErrors.rubro}
            >
              <InputLabel id="category-label">Rubro</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={handleCategoryChange}
                label="Rubro"
              >
                <MenuItem value="" disabled>
                  Seleccione un rubro
                </MenuItem>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.rubro && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {formErrors.rubro}
                </p>
              )}
            </FormControl>
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


          {/* trext are */}

          <div className="form-group">
              <label htmlFor="detalle">Detalle:</label>
              <textarea
                id="detalle"
                name="detalle"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                className="form-control"
                rows="4"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={editRecord ? handleUpdate : handleSubmit}
              sx={{
                marginTop: 4,
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
              }}
            >
              {editRecord ? "Actualizar" : "Solicitar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Datos enviados con éxito</DialogTitle>
        <DialogContent>
          <DialogContentText>Documento creado correctamente.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Adicionar Gasto
          </Button>
          <Button
            onClick={async () => {
              // await handleFinalizarRendicion();
              handleDialogClose(false);
            }}
            color="secondary"
          >
            Volver
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
          <DialogContentText>¿Desea eliminar este registro?</DialogContentText>
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
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle del Documento</DialogTitle>
        <DialogContent>
          {documentDetail ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(documentDetail).map(
                    ([key, value]) =>
                      key !== "id" &&
                      key !== "archivo" && (
                        <TableRow key={key}>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {key}
                          </TableCell>
                          <TableCell>
                            {value ? value.toString() : "-"}
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmFinalizarDialogOpen}
        onClose={() => setConfirmFinalizarDialogOpen(false)}
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de finalizar la rendición de gastos?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmFinalizarDialogOpen(false)}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={async () => {
              setConfirmFinalizarDialogOpen(false);
              await handleFinalizarRendicion();
              navigate("/colaborador");
            }}
            color="secondary"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default DatosRecibo;
