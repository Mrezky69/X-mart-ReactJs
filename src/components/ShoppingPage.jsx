import React, { useState, useEffect } from 'react';
import { getBarangList, simpanTransaksi } from '../api/api';

const ShoppingPage = () => {
    const [barangList, setBarangList] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState('');
    const [jumlah, setJumlah] = useState(1);
    const [totalHarga, setTotalHarga] = useState(0);

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

    const handleBarangChange = (event) => {
        setSelectedBarang(event.target.value);
        const selected = barangList.find((barang) => barang.id === event.target.value);
        setTotalHarga(selected ? selected.hargaSatuan * jumlah : 0);
    };

    const handleJumlahChange = (event) => {
        const newJumlah = parseInt(event.target.value);
        setJumlah(newJumlah);
        const selected = barangList.find((barang) => barang.id === selectedBarang);
        setTotalHarga(selected ? selected.hargaSatuan * newJumlah : 0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await simpanTransaksi(selectedBarang, jumlah);
            console.log('Transaksi berhasil disimpan');
        } catch (error) {
            console.error('Error saving transaksi:', error);
        }
    };

    return (
        <div>
            <h2>Halaman Belanja</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Pilih Barang:</label>
                    <select value={selectedBarang} onChange={handleBarangChange}>
                        <option value="">Pilih Barang</option>
                        {barangList.map((barang) => (
                            <option key={barang.id} value={barang.id}>
                                {barang.namaBarang} - Rp {barang.hargaSatuan}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Jumlah:</label>
                    <input type="number" min="1" value={jumlah} onChange={handleJumlahChange} />
                </div>
                <div>
                    <label>Total Harga:</label>
                    <span>Rp {totalHarga}</span>
                </div>
                <button type="submit">Beli</button>
            </form>
        </div>
    );
};

export default ShoppingPage;
