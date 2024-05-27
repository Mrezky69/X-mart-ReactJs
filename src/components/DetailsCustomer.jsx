import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const DetailsCustomer = ({ qrCode }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/customers/${qrCode}`)
            .then((response) => response.json())
            .then((data) => {
                setCustomer(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching customer details:', error);
                setLoading(false);
            });
    }, [qrCode]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" marginTop={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Customer Details
            </Typography>
            {customer ? (
                <Box>
                    <Typography variant="h6">Name: {customer.nama}</Typography>
                    <Typography variant="h6">Email: {customer.email}</Typography>
                    <Typography variant="h6">Phone: {customer.telepon}</Typography>
                </Box>
            ) : (
                <Typography variant="body1">Customer not found</Typography>
            )}
        </Container>
    );
};

export default DetailsCustomer;
