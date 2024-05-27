import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';

const QRReader = ({ onScanSuccess }) => {
    const [scanResult, setScanResult] = useState('');

    const handleScan = async (result) => {
        if (result) {
            setScanResult(result.text);
            onScanSuccess(result.text);
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const image = new Image();
                image.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0, image.width, image.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        setScanResult(code.data);
                        onScanSuccess(code.data);
                    } else {
                        console.error('QR code not found');
                    }
                };
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <QrScanner
                    delay={300}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                />
            </Box>
            {/* <Typography variant="body1" align="center">
                {scanResult ? `Scanned QR Code: ${scanResult}` : 'No QR code scanned'}
            </Typography> */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <Button
                    variant="contained"
                    component="label"
                >
                    Upload QR Code
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileUpload}
                    />
                </Button>
            </Box>
        </Container>
    );
};

export default QRReader;
