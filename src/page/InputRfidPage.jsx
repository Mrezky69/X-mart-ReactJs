import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QRReader from '../components/QRReader';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const InputRfidPage = () => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData) {
            setUser(userData);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleAddToCart = async (scanResult) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/barang/${scanResult}`);
            if (response.data) {
                setCart((prevCart) => {
                    const itemIndex = prevCart.findIndex(item => item.id === response.data.id);
                    if (itemIndex >= 0) {
                        const updatedCart = [...prevCart];
                        updatedCart[itemIndex].quantity += 1;
                        return updatedCart;
                    } else {
                        return [...prevCart, { ...response.data, quantity: 1 }];
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching item:', error);
        }
    };

    const handleRemoveFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const handleIncrement = (id) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const itemIndex = updatedCart.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                updatedCart[itemIndex].quantity += 1;
            }
            return updatedCart;
        });
    };

    const handleDecrement = (id) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const itemIndex = updatedCart.findIndex(item => item.id === id);
            if (itemIndex >= 0 && updatedCart[itemIndex].quantity > 1) {
                updatedCart[itemIndex].quantity -= 1;
            }
            return updatedCart;
        });
    };

    const handleCheckout = async () => {
        try {
            for (const item of cart) {
                await axios.post('http://localhost:4000/graphql', {
                    query: `
                mutation {
                    checkinBarang(rfid: "${item.rfid}") {
                        success
                        message
                        barang {
                            rfid
                            namaBarang
                            hargaSatuan
                        }
                    }
                }`
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
            navigate('/checkout', { state: { cart, user } });
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <Container sx={{ mt: 8 }}>
            <Grid container spacing={4} justifyContent="center">
                {user && (
                    <Grid item xs={12}>
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    User Information
                                </Typography>
                                <Typography variant="body1">
                                    Name: {user.nama}
                                </Typography>
                                <Typography variant="body1">
                                    Wallet: Rp{user.wallet.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        List Barang
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nama Barang</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Harga Satuan</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row">
                                                {item.namaBarang}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box display="flex" alignItems="center" justifyContent="flex-end">
                                                    <IconButton color="secondary" onClick={() => handleDecrement(item.id)}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    {item.quantity}
                                                    <IconButton color="secondary" onClick={() => handleIncrement(item.id)}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">{item.hargaSatuan}</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="secondary" onClick={() => handleRemoveFromCart(item.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No items in cart
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {cart.length > 0 && (
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Scan Product QR Code
                    </Typography>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <QRReader onScanSuccess={handleAddToCart} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default InputRfidPage;
