// React Imports
import React, {useState} from 'react';
import { json, useNavigate } from 'react-router-dom'; // Correctly import useNavigate
// CSS Imports
import './HomePage.css'; // Ensure this file exists

const HomePage = () => {

  const [myTData, setMyTData] = useState({})

  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleCustomerClick = () => {
    navigate('/customer'); // Assuming you have a customer route defined
  };

  const fetchData = async () => {
    const url = `http://localhost:3001/api/data`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    setMyTData(json)
  } catch (error) {
    console.error(error.message);
  }
  }

  return (
    <div className="HomePage">
      <div className='form-container3'>
      <button className="center-button" onClick={handleAdminClick}>Admin</button>
      <button className="center-button" onClick={handleCustomerClick}>Customer</button>
      <button onClick={fetchData}>Datayı Çek</button>
      <h1>{myTData.message}</h1>
      </div>
    </div>
  );
};

export default HomePage;