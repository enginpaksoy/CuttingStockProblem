import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage'; 
import CustomerPage from './components/CustomerPage'; 
import TrueLoginPage from './components/TrueLoginPage'; 
import TrueLoginPageC from './components/TrueLoginPageC';
import Index from './components/Index';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/admin/trueLogin" element={<TrueLoginPage />} />
        <Route path="/customer/trueLogin" element={<TrueLoginPageC />} />
        <Route path="/admin/trueLogin/index" element={<Index />} />
      </Routes>
    </Router>
  );
};

export default App;