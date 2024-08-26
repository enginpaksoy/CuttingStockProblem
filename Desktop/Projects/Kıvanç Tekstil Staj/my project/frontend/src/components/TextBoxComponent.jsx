import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TextBoxComponent.css";

const TextBoxComponent = ({ message }) => {
  const [inputs, setInputs] = useState(["", ""]);
  const [name, setName] = useState("");
  const [serverData, setServerData] = useState([]);
  const names = ["Units", "Size"];
  const dims = ["(count)", "(mm)"];
  const [itemCount, setItemCount] = useState(0);
  const [view, setView] = useState("list-stock");
  const [viewName, setViewName] = useState("");

  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  const handleClick = async () => {
    setView("list-stock");
    setViewName("Admin:");
    await axios
      .post("http://localhost:3001/add-stock", {
        username: message,
        unit: inputs[0],
        size: inputs[1],
      })
    handleShowStock();
  };

  const handleShowStock = async () => {
    try {
      setView("stocks");
      setViewName("Admin:");
      setName("username");
      
      const response = await axios.get("http://localhost:3001/list-stock");
      setServerData(response.data.stockList);
      setItemCount(response.data.stockCount);
      
      setInputs(["", ""]);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };
  const handleShowOrder = async () => {
    setView("orders");
    setViewName("Customer:");
    setName("customername");
    await axios
      .get("http://localhost:3001/list-order")
      .then(function (response) {
        console.log(response);
        setServerData(response.data.orderList);
        setItemCount(response.data.orderCount);
      });
    setInputs(["", ""]);
  };

  const handleDeleteItem = async (index) => {
    const itemToDelete = serverData[index];
    const fieldType = itemToDelete.customername ? "customername" : "username";

    try {
      const response = await axios.post("http://localhost:3001/delete-item", {
        collectionName: view,
        fieldType,
        value: itemToDelete[fieldType],
        unit: itemToDelete.unit,
        size: itemToDelete.size,
      });
      console.log("Item deleted", response);
      const newData = serverData.filter((_, i) => i !== index);
      setServerData(newData);
      setItemCount(newData.length);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleCuttingStockClick = () => {
    navigate("/admin/trueLogin/index");
  };

  return (
    <>
      <div className="form-container3">
        {inputs.map((input, index) => (
          <div key={index} className="textBox">
            <label htmlFor={names[index]}>{names[index]}:</label>
            <input
              type="text"
              value={input}
              placeholder={dims[index]}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
        ))}
        <button className="center-button3" onClick={handleClick}>
          Add to Stocks
        </button>
        <button className="center-button3" onClick={handleShowStock}>
          List Stocks
        </button>
        <button className="center-button3" onClick={handleShowOrder}>
          List Orders
        </button>
        <button className="center-button3" onClick={handleCuttingStockClick}>
          Cutting Stock Problem
        </button>
      </div>
      <div>
        {itemCount > 0 && (
          <div className="form-container3">
            <ul>
              {serverData.map((item, i) => (
                <li key={i}>
                  <div className="li-content">
                    <span>
                      <strong>{viewName}</strong> {item[name]},
                      <strong> Unit:</strong> {item.unit},
                      <strong> Size:</strong> {item.size}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="button5"
                    onClick={() => handleDeleteItem(i)}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default TextBoxComponent;
