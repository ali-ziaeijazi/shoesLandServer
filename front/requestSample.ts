// fetchData.ts

import apiClient from './apiClient';

const fetchData = async (): Promise<void> => {
  try {
    const response = await apiClient.get('/protected-data');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
