import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { QrReader } from "react-qr-reader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { esES } from "@mui/x-date-pickers/locales";
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


// ─── Componente principal ─────────────────────────────────────────────────────
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

  const [showQrReader2, setShowQrReader2] = useState(false);
  const [qrResult2, setQrResult2] = useState(null);
  const [qrError2, setQrError2] = useState(null);
  const [isScanning2, setIsScanning2] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
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
  const [scanTimeout, setScanTimeout] = useState(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [formData, setFormData] = useState({
    fecha: null,
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
  const [tipoCambio, setTipoCambio] = useState(1);
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
  const [showQrReader, setShowQrReader] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [mainCameraId, setMainCameraId] = useState(null);
  const [cameraInitialized, setCameraInitialized] = useState(false);

  // ─── Estados para lectura de ticket con Claude Vision ─────────────────────
  const [ticketFile, setTicketFile] = useState(null);
  const [ticketResult, setTicketResult] = useState(null);
  const [ticketError, setTicketError] = useState(null);
  // Preview de la imagen seleccionada
  const [ticketPreview, setTicketPreview] = useState(null);
  // Popup de revisión de datos extraídos
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // ─── handleTicketFileChange: llama al backend que usa Claude Vision ──────────
  const handleTicketFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTicketFile(file);
    limpiarFormulario();
    setTicketError(null);

    // Mostrar preview de la imagen
    const previewUrl = URL.createObjectURL(file);
    setTicketPreview(previewUrl);

    setIsLoading(true);

    try {
      const formDataImg = new FormData();
      formDataImg.append("file", file);

      const response = await axios.post(
        `${baseURL}/extract-ticket/`,
        formDataImg,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const processedData = response.data;

      // Poblar el formulario con los datos extraídos
      setFormData((prev) => ({
        ...prev,
        fecha: normalizeDate(processedData.fecha || ""),
        ruc: processedData.ruc || "",
        tipoDoc: processedData.tipo || "Boleta de Venta",
        serie: processedData.serie || "",
        numero: processedData.numero || "",
        igv: processedData.igv != null ? String(processedData.igv) : "",
        afecto:
          processedData.afecto != null ? String(processedData.afecto) : "",
        inafecto:
          processedData.inafecto != null
            ? String(processedData.inafecto)
            : "0",
        total: processedData.total != null ? String(processedData.total) : "",
      }));

      setSearchRuc(processedData.ruc || "");

      if (processedData.ruc) {
        handleSearch(processedData.ruc);
      }

      setTicketResult(processedData);
      setReviewDialogOpen(true);
    } catch (err) {
      console.error("Error al procesar ticket con IA:", err);
      setTicketError(
        <span>
          Error al leer ticket con IA. Consejos:
          <ul>
            <li>Use una imagen nítida y bien iluminada</li>
            <li>Asegúrese que todos los datos sean visibles</li>
            <li>Evite sombras, reflejos o imágenes borrosas</li>
            <li>Formatos soportados: JPG, PNG, WEBP</li>
          </ul>
        </span>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScanner2 = () => {
    limpiarFormulario();
    setShowQrReader2(true);
    setIsScanning2(true);
    setError("");
    setQrResult2(null);
    setQrError2(null);

    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }

    const timeout = setTimeout(() => {
      if (!qrResult2) {
        setQrError2(
          "No se pudo leer el QR después de 30 segundos. Por favor, intenta nuevamente."
        );
        setShowQrReader2(false);
        setIsScanning2(false);
      }
    }, 30000);

    setScanTimeout(timeout);
  };

  useEffect(() => {
    if (qrResult2) {
      handleProcessQrResult2();
    }
  }, [qrResult2]);

  const handleProcessQrResult2 = async () => {
    try {
      if (!qrResult2) return;

      const response = await axios.post(`${baseURL}/api/process-qr/`, {
        data: qrResult2,
      });

      const processedData = response.data;

      setFormData((prevFormData) => ({
        ...prevFormData,
        fecha: normalizeDate(processedData.fecha || ""),
        ruc: processedData.ruc || "",
        tipoDoc: processedData.tipo || "",
        serie: processedData.serie || "",
        numero: processedData.numero || "",
        igv: processedData.igv || "",
        total: processedData.total || "",
        afecto: processedData.afecto || "",
        inafecto: processedData.inafecto || "",
      }));
      setSearchRuc(processedData.ruc || "");
      setError("");

      if (processedData.ruc) {
        handleSearch(processedData.ruc);
      }
    } catch (error) {
      setError("Error al procesar el QR. Por favor, inténtalo nuevamente.");
    }
  };

  const handleCameraSwitch2 = (mode) => {
    setCameraFacingMode(mode);
    setShowQrReader2(false);
    setTimeout(() => setShowQrReader2(true), 100);
  };

  const limpiarFormulario = () => {
    setFormData({
      fecha: null,
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
    setCategory("");
    setSearchRuc("");
    setSearchResult(null);
    setError("");
    setQrError(null);
    setQrError2(null);
    setDetalle("");
    setQrFile(null);
    setQrResult(null);
    setQrResult2(null);
    setShowQrReader(false);
    setShowQrReader2(false);
    setIsScanning(false);
    setIsScanning2(false);
    setTicketFile(null);
    setTicketResult(null);
    setTicketError(null);
    setTicketPreview(null);
    setReviewDialogOpen(false);
  };

  const formatNumber = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "" : num.toFixed(2);
  };

  useEffect(() => {
    if (qrResult) {
      handleProcessQrResult();
    }
    return () => {
      if (html5QrScanner.current) {
        html5QrScanner.current.clear();
      }
    };
  }, [qrResult]);

  const handleProcessQrResult = async () => {
    try {
      if (!qrResult) return;

      const response = await axios.post(`${baseURL}/api/process-qr/`, {
        data: qrResult,
      });

      const processedData = response.data;

      setFormData((prevFormData) => ({
        ...prevFormData,
        fecha: normalizeDate(processedData.fecha || ""),
        ruc: processedData.ruc || "",
        tipoDoc: processedData.tipo || "",
        serie: processedData.serie || "",
        numero: processedData.numero || "",
        igv: processedData.igv || "",
        total: processedData.total || "",
        afecto: processedData.afecto || "",
        inafecto: processedData.inafecto || "",
      }));
      setSearchRuc(processedData.ruc || "");
      setError("");

      if (processedData.ruc) {
        handleSearch(processedData.ruc);
      }
    } catch (error) {
      setError("Error al procesar el QR. Por favor, inténtalo nuevamente.");
    }
  };

  const handleCameraSwitch = () => {
    if (html5QrScanner) {
      html5QrScanner.clear();
      setShowQrReader(false);
      setTimeout(() => {
        initScanner();
      }, 100);
    }
  };

  const html5QrScanner = useRef(null);

  const initScanner = () => {
    if (html5QrScanner.current) {
      html5QrScanner.current.clear();
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      facingMode: "environment",
    };

    html5QrScanner.current = new Html5QrcodeScanner(
      "qr-reader-container",
      config,
      false
    );

    html5QrScanner.current.render(
      (decodedText) => {
        limpiarFormulario();
        if (scanTimeout) {
          clearTimeout(scanTimeout);
          setScanTimeout(null);
        }
        setError(null);
        setQrError(null);
        setQrResult(decodedText);
        setShowQrReader(false);
        setIsScanning(false);

        if (html5QrScanner.current) {
          html5QrScanner.current.clear();
        }
      },
      (error) => {
        console.error("Error al leer el QR:", error);
      }
    );

    setShowQrReader(true);
  };

  useEffect(() => {
    const findHighestResolutionCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          setQrError("No se encontraron cámaras disponibles");
          return;
        }

        let bestCamera = null;
        let maxResolution = 0;

        for (const device of videoDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: { exact: device.deviceId },
                width: { ideal: 4096 },
                height: { ideal: 2160 },
              },
            });

            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            const resolution = settings.width * settings.height;

            if (resolution > maxResolution) {
              maxResolution = resolution;
              bestCamera = device;
            }

            track.stop();
          } catch (error) {
            console.warn(
              `No se pudo acceder a la cámara ${device.label}:`,
              error
            );
          }
        }

        if (bestCamera) {
          setMainCameraId(bestCamera.deviceId);
          setCameraInitialized(true);
        }
      } catch (error) {
        setQrError("Error al acceder a las cámaras. Verifica los permisos.");
      }
    };

    findHighestResolutionCamera();
  }, []);

  const normalizeDate = (dateString) => {
    if (!dateString) return null;

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      return new Date(dateString);
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
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

      const lastRendicionResponse = await axios.get(
        `${baseURL}/api/rendicion/last`,
        {
          params: {
            id_user: userId,
            tipo: "RENDICION",
          },
        }
      );

      if (lastRendicionResponse.data && lastRendicionResponse.data.id) {
        const rendicionId = lastRendicionResponse.data.id;

        await axios.put(`${baseURL}/api/rendicion/${rendicionId}`, {
          estado: "POR APROBAR",
        });

        await axios.post(`${baseURL}/api/rendicion/`, {
          id_user: userId,
        });
      }
    } catch (error) {
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
          const response = await api.get(`/api/rendicion/last`, {
            params: {
              id_user: userId,
              tipo: "RENDICION",
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
    return () => {
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
    };
  }, [scanTimeout]);

  const fetchTipoCambio = async (fecha) => {
    try {
      const formattedDate = fecha.toISOString().split("T")[0];

      const response = await axios.get(
        `${baseURL}/tipo-cambio/?fecha=${formattedDate}`
      );
      const precioVenta = response.data.precioVenta;
      setTipoCambio(precioVenta);

      setFormData((prev) => ({
        ...prev,
        afecto: (parseFloat(prev.afecto) * precioVenta).toFixed(2),
        igv: (parseFloat(prev.igv) * precioVenta).toFixed(2),
        inafecto: prev.inafecto
          ? (parseFloat(prev.inafecto) * precioVenta).toFixed(2)
          : "0.00",
        total: (parseFloat(prev.total) * precioVenta).toFixed(2),
      }));
    } catch (error) {
      setError(
        "Error al obtener el tipo de cambio. Por favor, intente nuevamente."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "moneda") {
      if (value === "PEN") {
        setTipoCambio(1);
        setFormData((prev) => ({
          ...prev,
          afecto: parseFloat(prev.afecto) / tipoCambio,
          igv: parseFloat(prev.igv) / tipoCambio,
          inafecto: prev.inafecto ? parseFloat(prev.inafecto) / tipoCambio : 0,
          total: parseFloat(prev.total) / tipoCambio,
        }));
      } else if (value === "USD" && formData.fecha) {
        fetchTipoCambio(formData.fecha);
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      fecha: date,
    }));
  };

  const handleSearchRucChange = (e) => {
    setSearchRuc(e.target.value);
  };

  const handleSearch = async (ruc) => {
    try {
      const rucToSearch = typeof ruc === "string" ? ruc : searchRuc;
      const response = await axios.get(
        `${baseURL}/consulta-ruc/?ruc=${encodeURIComponent(rucToSearch)}`
      );

      setSearchResult(response.data);

      setFormData((prevFormData) => ({
        ...prevFormData,
        ruc: rucToSearch,
        proveedor: response.data.razon_social || "Proveedor Desconocido",
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
    limpiarFormulario();
    setQrError(null);

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
          setQrError(
            <span>
              No se pudo leer el código QR. Recomendaciones:
              <ul>
                <li>Asegúrate de que el código esté bien iluminado</li>
                <li>Acerca más la cámara al código</li>
                <li>Evita reflejos y sombras</li>
                <li>Si el código es de color, prueba con fondo blanco</li>
              </ul>
            </span>
          );
        } else {
          const decodedRuc = decodeResponse.data.ruc;

          let razonSocial = "Proveedor Desconocido";
          try {
            const rucResponse = await axios.get(
              `${baseURL}/consulta-ruc?ruc=${decodedRuc}`
            );
            razonSocial = rucResponse.data.razon_social || razonSocial;
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn("RUC no encontrado.");
            } else {
              throw error;
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
            afecto: decodeResponse.data.afecto || "",
            inafecto: decodeResponse.data.inafecto || "",
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
          setError(
            "Error al procesar el QR: " +
              (error.response.data.message || "Por favor, intente nuevamente.")
          );
        } else if (error.request) {
          setError("No se recibió respuesta del servidor. Intente nuevamente.");
        } else {
          setError("Ocurrió un error. Intente nuevamente.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartScanner = () => {
    limpiarFormulario();
    setShowQrReader(true);
    setIsScanning(true);
    setError("");
    setQrResult(null);
    setQrError(null);

    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }

    const timeout = setTimeout(() => {
      if (!qrResult) {
        setQrError(
          "No se pudo leer el QR después de 30 segundos. Por favor, intenta nuevamente."
        );
        setShowQrReader(false);
        setIsScanning(false);
        if (html5QrScanner.current) {
          html5QrScanner.current.clear();
        }
      }
    }, 30000);

    setScanTimeout(timeout);
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

  useEffect(() => {
    if (showQrReader) {
      setTimeout(() => {
        initScanner();
      }, 100);
    }
  }, [showQrReader]);

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
    }

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.id : null;
    const gerencia = user ? user.gerencia : null;
    const todayDate = new Date().toLocaleDateString("en-CA");

    const requestData = {
      fecha_solicitud: todayDate,
      dni: user.dni,
      usuario: loggedInUser,
      gerencia: gerencia,
      ruc: formData.ruc,
      proveedor: formData.proveedor || "Proveedor Desconocido",
      fecha_emision: formData.fecha
        ? new Date(formData.fecha).toLocaleDateString("en-CA")
        : null,
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
      detalle: detalle,
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
      id_empresa: user.id_empresa,
    };

    try {
      await axios.post(`${baseURL}/documentos/`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setDialogOpen(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(
          error.response.data.message ||
            "Este documento ya se encuentra registrado"
        );
      } else {
        setError("Error al enviar los datos. Por favor, intente nuevamente.");
      }
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
        rubro: selectedRubro || "",
        moneda: "PEN",
        afecto: "",
        igv: "",
        inafecto: "",
        total: "",
        archivo: "",
      });
      setCategory("");
      setSearchRuc("");
      setSearchResult(null);
      setError("");
      setDetalle("");
      setQrFile(null);
      setQrResult(null);
      setShowQrReader(false);
      setIsScanning(false);
      setTicketFile(null);
      setTicketResult(null);
      setTicketError(null);
      setTicketPreview(null);

      try {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;

        if (userId) {
          await api.get(`/api/rendicion/last`, {
            params: {
              id_user: userId,
              tipo: "RENDICION",
            },
          });
          navigate("/datos-recibo");
        } else {
          alert("Error: Usuario no autenticado");
        }
      } catch (error) {
        alert("Error al obtener la última rendición. Intente nuevamente.");
      }
    } else {
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

            {/* ─── Botón: Leer datos de ticket con IA (Claude Vision) ─────── */}
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
                📷 Leer ticket con IA
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  capture="environment"
                  onChange={handleTicketFileChange}
                />
              </Button>

              {/* Preview de la imagen cargada */}
              {ticketPreview && (
                <Box
                  sx={{
                    marginTop: 1,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden",
                    maxHeight: 150,
                  }}
                >
                  <img
                    src={ticketPreview}
                    alt="Vista previa del ticket"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </Box>
              )}

              {/* Estado de carga de IA */}
              {isLoading && ticketFile && (
                <Alert severity="info" sx={{ marginTop: 1 }}>
                  🤖 Claude está analizando el comprobante...
                </Alert>
              )}

              {/* Datos extraídos exitosamente */}
              {ticketResult && !isLoading && (
                <Alert severity="success" sx={{ marginTop: 1 }}>
                  ✅ Datos extraídos con IA
                </Alert>
              )}

              {/* Error de extracción */}
              {ticketError && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {ticketError}
                </Alert>
              )}
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
                onClick={handleStartScanner}
              >
                Escanear QR
              </Button>

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
                  onClick={handleCameraSwitch}
                >
                  Reiniciar Escáner
                </Button>
              </Box>

              {isScanning && (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Escaneando... Por favor, apunta al código QR.
                </Typography>
              )}

              {showQrReader && (
                <Box
                  sx={{
                    marginTop: 2,
                    position: "relative",
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                  id="qr-reader-container"
                >
                  {/* Html5QrcodeScanner se auto-inyectará aquí */}
                </Box>
              )}

              {qrError && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {qrError}
                </Alert>
              )}
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
                onClick={handleStartScanner2}
              >
                Escanear QR 2
              </Button>
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
                  onClick={() => handleCameraSwitch2("environment")}
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
                  onClick={() => handleCameraSwitch2("user")}
                >
                  Cámara Frontal
                </Button>
              </Box>
              {isScanning2 && (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Escaneando... Por favor, apunta al código QR.
                </Typography>
              )}

              {showQrReader2 && (
                <Box
                  sx={{
                    marginTop: 2,
                    position: "relative",
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                >
                  <QrReader
                    constraints={{
                      facingMode: cameraFacingMode,
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      aspectRatio: 16 / 9,
                      focusMode: "continuous",
                    }}
                    scanDelay={100}
                    onResult={(result, error) => {
                      if (result) {
                        limpiarFormulario();
                        if (scanTimeout) {
                          clearTimeout(scanTimeout);
                          setScanTimeout(null);
                        }
                        setError(null);
                        setQrError2(null);
                        setQrResult2(result.text);
                        setShowQrReader2(false);
                        setIsScanning2(false);
                      }
                      if (error) {
                        console.error("Error al leer el QR:", error);
                      }
                    }}
                    videoContainerStyle={{
                      paddingTop: "100%",
                      position: "relative",
                      width: "100%",
                    }}
                    videoStyle={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              {qrError2 && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {qrError2}
                </Alert>
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
              {error && !qrError && <Alert severity="error">{error}</Alert>}
              {searchResult && (
                <Alert severity="success">
                  <p>
                    <strong>Razón Social:</strong> {searchResult.razon_social}
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
              (field) => {
                if (field === "fecha") {
                  return (
                    <LocalizationProvider
                      key={field}
                      dateAdapter={AdapterDateFns}
                      adapterLocale={esLocale}
                      localeText={
                        esES.components.MuiLocalizationProvider.defaultProps
                          .localeText
                      }
                    >
                      <DatePicker
                        label="Fecha"
                        value={formData.fecha}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                            required: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  );
                }
                return (
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
                );
              }
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
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                label="Inafecto"
                variant="outlined"
                fullWidth
                margin="normal"
                id="inafecto"
                name="inafecto"
                value={formData.inafecto}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!formData.total || !formData.afecto || !formData.igv) {
                    setError(
                      "Faltan datos para realizar el cálculo. Complete Total, Afecto e IGV primero."
                    );
                    return;
                  }

                  const total = parseFloat(formData.total) || 0;
                  const afecto = parseFloat(formData.afecto) || 0;
                  const igv = parseFloat(formData.igv) || 0;
                  const inafectoValue = total - (afecto + igv);

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    inafecto: inafectoValue.toFixed(2),
                  }));

                  setError("");
                }}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#2E3192",
                  "&:hover": { backgroundColor: "#1F237A" },
                  whiteSpace: "nowrap",
                }}
              >
                Calcular
              </Button>
            </Box>
            {["igv", "total"].map((field) => (
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
      {/* ─── Popup revisión de datos extraídos por IA ─── */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          ✅ Datos extraídos
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se han completado los campos automáticamente. Por favor{" "}
            <strong>revisa y corrige los datos</strong> antes de enviar, ya que
            la lectura automática puede contener errores.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setReviewDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#2E3192",
              "&:hover": { backgroundColor: "#1F237A" },
            }}
          >
            Revisar datos
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default DatosRecibo;
