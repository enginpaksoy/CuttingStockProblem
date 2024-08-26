import React, { useState } from "react";
import axios from "axios";
import "./TextBoxComponentC.css";

const TextBoxComponentC = ({ message }) => {
  const [inputs, setInputs] = useState(["", ""]);
  const [serverData, setServerData] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const names = ["Units", "Size"];
  const dims = ["(count)", "(mm)"];

  const handleChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  const handleClick = async () => {
    console.log({ message });
    await axios.post("http://localhost:3001/add-order", {
      customername: message,
      unit: inputs[0],
      size: inputs[1],
    });

    setInputs(["", ""]);
  };

  const handleShow = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/list-order-customer",
        {
          params: { customername: message },
        }
      );
      setServerData(response.data.orderList);
      setItemCount(response.data.orderCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setInputs(["", ""]);
  };

  const handleDeleteItem = async (index) => {
    const itemToDelete = serverData[index];
    const fieldType = "customername";

    try {
      await axios.post("http://localhost:3001/delete-item", {
        collectionName: "orders",
        fieldType,
        value: itemToDelete[fieldType],
        unit: itemToDelete.unit,
        size: itemToDelete.size,
      });

      const newData = serverData.filter((_, i) => i !== index);
      setServerData(newData);
      setItemCount(newData.length);
    } catch (error) {
      console.error("Error deleting item", error);
    }
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
          Order
        </button>
        <button className="center-button3" onClick={handleShow}>
          List
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
                      <strong>Customer:</strong> {item.customername},
                      <strong> Unit: </strong> {item.unit},
                      <strong> Size: </strong> {item.size}
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

export default TextBoxComponentC;
