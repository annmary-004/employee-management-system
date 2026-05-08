import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

export const getEmployees = () => axios.get(API_URL);
export const getEmployeeById = (id: string) => axios.get(`${API_URL}/${id}`);
export const addEmployee = (employee: any) => axios.post(API_URL, employee);
export const updateEmployee = (id: string, employee: any) => axios.put(`${API_URL}/${id}`, employee);
export const deleteEmployee = (id: string) => axios.delete(`${API_URL}/${id}`);
