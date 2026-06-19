import { apiClient } from './apiClient';

export const getAssets = async (type, page = 1, limit = 10) => {
    const response = await apiClient(`/assets?type=${type}&page=${page}&limit=${limit}`);
    return response; 
};