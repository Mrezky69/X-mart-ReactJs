import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import axios from 'axios';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, user } = location.state;

    console.log('user:', user);
    if (!user) {
        console.error('User is not defined');
        return null;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.hargaSatuan * item.quantity, 0);

    const handleConfirm = async () => {
        try {

            if (user.wallet < totalAmount) {
                alert("Saldo tidak mencukupi untuk melakukan transaksi ini.");
                return;
            }
            
            for (const item of cart) {
                await axios.post('http://localhost:4000/graphql', {
                    query: `
                    mutation SimpanTransaksi($transaksi: TransaksiInput!) {
                        simpanTransaksi(transaksi: $transaksi) {
                            message
                        }
                    }`,
                    variables: {
                        transaksi: {
                            qrCode: user.qrCode,
                            rfid: item.rfid,
                            hargaSatuan: item.hargaSatuan,
                            jumlah: item.quantity
                        }
                    }
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }

            await axios.put(`http://localhost:8080/api/customers/${user.id}`, {
                nama: user.nama,
                wallet: user.wallet - totalAmount
            });

            navigate('/');
        } catch (error) {
            console.error('Error during transaction save:', error);
        }
    };

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Checkout
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nama Barang</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Harga Satuan</TableCell>
                                    <TableCell align="center">Total Harga</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            {item.namaBarang}
                                        </TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="center">{item.hargaSatuan}</TableCell>
                                        <TableCell align="center">{item.hargaSatuan * item.quantity}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} align="right">Total</TableCell>
                                    <TableCell align="center">{totalAmount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" color="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;
