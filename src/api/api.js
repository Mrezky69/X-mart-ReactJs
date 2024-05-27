import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const authenticateUser = async (qrCode) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/customers/${qrCode}`);
        return response.data;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw new Error('Failed to authenticate user');
    }
};


export const getBarangList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/barang/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching barang list:', error);
    throw new Error('Failed to fetch barang list');
  }
};

export const simpanTransaksi = async (transaksiData) => {
  try {
    const response = await axios.post(`${BASE_URL}/transaksi/simpan`, transaksiData);
    return response.data;
  } catch (error) {
    console.error('Error saving transaksi:', error);
    throw new Error('Failed to save transaksi');
  }
};
