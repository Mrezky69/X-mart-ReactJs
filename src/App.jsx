import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InputRfidPage from './page/InputRfidPage';
import { Box } from '@mui/material';
import Navbar from './layouts/Navbar';
import Sidebar from './layouts/Sidebar';
import LoginPage from './page/LoginPage';
import CheckoutPage from './page/CheckoutPage';
import CustomerDetail from './page/CustomerDetailPage';
import DataPage from './page/DataPage';

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/transaksi-baru" element={<InputRfidPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/detail" element={<LoginPage />} />
            <Route path="/detail-customer" element={<CustomerDetail />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
