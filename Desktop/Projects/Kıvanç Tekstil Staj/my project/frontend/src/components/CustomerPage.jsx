import "./CustomerPage.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const [inputId, setInputId] = useState("");
  const [myTData, setMyTData] = useState({});
  const navigate = useNavigate();

  const handleIdChange = (e) => {
    e.preventDefault();
    setInputId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customername = { customername: inputId };
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/customer",
        customername
      );
      if (response.data.message === "Başarılı") {
        navigate("/customer/trueLogin", { state: customername });
      }
      setMyTData(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="CustomerPage">
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="id">ID:</label>
        <input
          type="text"
          id="id"
          name="id"
          placeholder="Enter your customer ID"
          value={inputId}
          onChange={handleIdChange}
        />
        <button className="center-button" type="submit">
          Submit
        </button>
      </form>
      <h1 style={{ color: "white" }}>{myTData.message}</h1>
    </div>
  );
};

export default CustomerPage;
