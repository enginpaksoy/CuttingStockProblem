import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const handleCustomerClick = () => {
    navigate("/customer");
  };

  return (
    <div className="HomePage">
      <div className="form-container3">
        <button className="center-button" onClick={handleAdminClick}>
          Admin
        </button>
        <button className="center-button" onClick={handleCustomerClick}>
          Customer
        </button>
      </div>
    </div>
  );
};

export default HomePage;
