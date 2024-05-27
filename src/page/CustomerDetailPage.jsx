import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { Container, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@mui/material';

const CustomerDetail = () => {
    const location = useLocation();
    const { customer } = location.state;
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/transaksi?qrCode=${customer.qrCode}`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };

        fetchTransactions();
    }, [customer.qrCode]);

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>Customer Detail</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Customer Information</Typography>
                            <Typography variant="body1"><strong>Nama:</strong> {customer.nama}</Typography>
                            <Typography variant="body1"><strong>Wallet:</strong> Rp{customer.wallet.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
            <br />
            <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>Transactions</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nama Barang</TableCell>
                            <TableCell>Harga Satuan</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell align='center'>Tanggal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.rfid}</TableCell>
                                <TableCell>Rp{transaction.hargaSatuan.toLocaleString()}</TableCell>
                                <TableCell>{transaction.jumlah}</TableCell>
                                <TableCell>{new Date(transaction.tanggalJam).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
                    <Card>
                        <CardContent>
                            <QRCode value={customer.qrCode} size={150} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CustomerDetail;
