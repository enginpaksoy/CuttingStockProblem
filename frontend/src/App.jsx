import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ButtonPair from './ButtonPair';
import AdminPage from './AdminPage';
import CustomerPage from './CustomerPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App home-page">
              <ButtonPair />
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            <div className="App admin-page">
              <AdminPage />
            </div>
          }
        />
        <Route
          path="/customer"
          element={
            <div className="App customer-page">
              <CustomerPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;