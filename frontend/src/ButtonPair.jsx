import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonPair = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleCustomerClick = () => {
    navigate('/customer');
  };

  return (
    <div className="button-pair">
      <button onClick={handleAdminClick}>Admin</button>
      <button onClick={handleCustomerClick}>Customer</button>
    </div>
  );
};

export default ButtonPair;