import api from './api';

export const testApi = async () => {
	const response = await api.get('/users');

	return response.data;
};