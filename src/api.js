
import axios from 'axios';
//export const baseURL = 'http://localhost:8080'; 
//export const baseURL = 'https://rendicion.onrender.com';
export const baseURL = 'https://api-5vp0.onrender.com';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getUsersByCompanyAndRole = async (companyName, role) => {
    const response = await api.get(`/api/users/by-company-and-role/`, {
        params: {
            company_name: companyName,
            role: role,
        },
    });
    return response.data;
};


export const getNumerosRendicion = (usuario) => {
    return api.get(`/documentos/numero-rendicion/`, { params: { usuario } });
};

export default api;
