import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import QRCode from 'qrcode.react';

const DataPage = () => {
    const [value, setValue] = useState(0);
    const [barang, setBarang] = useState([]);
    const [customers, setCustomers] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchBarang = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/barang/list');
                setBarang(response.data);
            } catch (error) {
                console.error('Error fetching barang data', error);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/customers/list');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customer data', error);
            }
        };

        fetchBarang();
        fetchCustomers();
    }, []);

    return (
        <Container sx={{ mt: 8 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="data tabs">
                    <Tab label="Data Barang" />
                    <Tab label="Data Customer" />
                </Tabs>
            </Box>
            <Box sx={{ width: '860px', overflowX: 'auto' }}>
            {value === 0 && (
                <TableContainer component={Paper}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ padding: '16px' }}>
                        Data Barang
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>RFID</TableCell>
                                <TableCell>Nama Barang</TableCell>
                                <TableCell>Harga Satuan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {barang.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell><QRCode value={item.id} size={150} /></TableCell>
                                    <TableCell>{item.namaBarang}</TableCell>
                                    <TableCell>Rp{item.hargaSatuan.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {value === 1 && (
                <TableContainer component={Paper}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ padding: '16px' }}>
                        Data Customer
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>QR Code</TableCell>
                                <TableCell>Nama</TableCell>
                                <TableCell>Wallet</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell><QRCode value={customer.qrCode} size={150} /></TableCell>
                                    <TableCell>{customer.nama}</TableCell>
                                    <TableCell>Rp{customer.wallet.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default DataPage;
