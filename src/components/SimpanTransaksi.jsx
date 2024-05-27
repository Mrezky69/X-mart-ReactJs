import React, { useState } from 'react';
import { Container, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const SimpanTransaksi = ({ cart }) => {
    const [transactionSaved, setTransactionSaved] = useState(false);

    const handleSaveTransaction = () => {
        const items = cart.map(item => ({
            rfid: item.rfid,
            hargaSatuan: item.hargaSatuan,
        }));

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
          mutation {
            simpanTransaksi(
              qrCode: "USER_QR_CODE",
              items: ${JSON.stringify(items)},
              jumlah: ${cart.length}
            ) {
              success
              message
            }
          }
        `,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.data.simpanTransaksi.success) {
                    setTransactionSaved(true);
                }
            })
            .catch((error) => {
                console.error('Error saving transaction:', error);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Simpan Transaksi
            </Typography>
            <List>
                {cart.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={item.namaBarang} secondary={`Price: ${item.hargaSatuan}`} />
                    </ListItem>
                ))}
            </List>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTransaction}
                fullWidth
                disabled={transactionSaved}
            >
                {transactionSaved ? 'Transaction Saved' : 'Save Transaction'}
            </Button>
            {transactionSaved && (
                <Typography variant="h6" align="center" color="primary" marginTop={2}>
                    Transaction has been saved successfully!
                </Typography>
            )}
        </Container>
    );
};

export default SimpanTransaksi;
