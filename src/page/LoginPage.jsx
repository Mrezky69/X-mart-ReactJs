import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QRReader from '../components/QRReader';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleScanSuccess = async (scanResult) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/${scanResult}`);
            if (response) {
                sessionStorage.setItem('userData', JSON.stringify(response.data));
                const currentPath = window.location.pathname;
                if (currentPath === '/') {
                    navigate('/transaksi-baru');
                } else if (currentPath === '/detail') {
                    navigate('/detail-customer', { state: { customer: response.data } });
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Scan QR Code Here
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <QRReader onScanSuccess={handleScanSuccess} />
            </Box>
        </Container>
    );
};

export default LoginPage;
