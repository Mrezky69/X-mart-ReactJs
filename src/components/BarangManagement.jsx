import React, { useState, useEffect } from 'react';
import { getBarangList } from '../api/api';

const BarangManagement = () => {
    const [barangList, setBarangList] = useState([]);

    useEffect(() => {
        const fetchBarangList = async () => {
            try {
                const data = await getBarangList();
                setBarangList(data);
            } catch (error) {
                console.error('Error fetching barang list:', error);
            }
        };

        fetchBarangList();
    }, []);

    return (
        <div>
            <h2>Manajemen Barang</h2>
            <ul>
                {barangList.map((barang) => (
                    <li key={barang.id}>{barang.namaBarang}</li>
                ))}
            </ul>
        </div>
    );
};

export default BarangManagement;
