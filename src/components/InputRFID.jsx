import React, { useState } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const InputRFID = ({ onAddToCart }) => {
    const [rfid, setRfid] = useState('');
    const [cart, setCart] = useState([]);

    const handleAddToCart = () => {
        if (rfid) {
            fetch(`http://localhost:8080/api/barang/${rfid}`)
                .then((response) => response.json())
                .then((data) => {
                    setCart([...cart, data]);
                    setRfid('');
                    onAddToCart(data);
                })
                .catch((error) => {
                    console.error('Error fetching item:', error);
                });
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Input RFID Code
            </Typography>
            <TextField
                label="RFID Code"
                variant="outlined"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddToCart} fullWidth>
                Add to Cart
            </Button>
            <Typography variant="h5" gutterBottom marginTop={4}>
                Cart
            </Typography>
            <List>
                {cart.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={item.namaBarang} secondary={`Price: ${item.hargaSatuan}`} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default InputRFID;
