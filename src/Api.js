import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7056/api', 
});

export const getResourceCards = () => api.get('/ResourceCards');
export const createResourceCard = (data) => api.post('/ResourceCards', data);
export const updateResourceCard = (id, data) => api.put(`/ResourceCards/${id}`, data);
export const deleteResourceCard = (id) => api.delete(`/ResourceCards/${id}`);

export default api;
