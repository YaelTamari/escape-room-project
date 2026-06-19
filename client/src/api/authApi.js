import { apiClient } from './apiClient';

export const loginUser = async (username, password) => {
    return await apiClient('/auth/login', 'POST', { username, password });
};

export const registerUser = async (username, password, role) => {
    return await apiClient('/auth/register', 'POST', { username, password, role });
};
