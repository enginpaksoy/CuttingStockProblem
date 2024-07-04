import React from 'react';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import './HomePage.css'; // Ensure this file exists

const HomePage = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleCustomerClick = () => {
    navigate('/customer'); // Assuming you have a customer route defined
  };

  return (
    <div className="HomePage">
      <button className="center-button" onClick={handleAdminClick}>Admin</button>
      <button className="center-button" onClick={handleCustomerClick}>Customer</button>
    </div>
  );
};

export default HomePage;