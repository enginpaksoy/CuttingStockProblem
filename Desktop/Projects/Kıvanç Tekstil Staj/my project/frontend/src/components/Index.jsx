import React, { useState } from "react";
import axios from "axios";
import "./Index.css";
import Visual from "./Visiual";

const Index = () => {
  const [isdrawing, setIsDrawing] = useState(false);
  const [length, setLength] = useState("");
  const [OrderArray, setOrderArray] = useState([[[]]]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [serverData, setServerData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [stockLength, setStockLength] = useState(0);

  const handleLengthChange = (e) => {
    e.preventDefault();
    setLength(e.target.value);
  };

  const Optimize = async () => {
    try {
      const response = await axios.post("http://localhost:3001/optimize");
      const results = response.data.results;
      
      //The code goes through each group of items in results, 
      //makes copies of those items, and puts the copies into OrderArray so the original items stay unchanged.
      results.forEach((subArray, i) => { 
        OrderArray[i] = subArray.map(element => ({ ...element }));
      });
      
      setIsDrawing(true);
      setTotalWaste(response.data.total_remaining);
      setTotalElements(response.data.element_count);
      setStockLength(response.data.stock_size);
      setOrderArray(results);
    } catch (error) {
      console.error("Error optimizing:", error);
    }
  };

  const handleSetLength = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/save-stock-length",
        { length: length }
      );
      console.log(response.data.results);
    } catch (error) {
      console.error("Error optimizing:", error);
    }
  };

  const handleShowOrder = async () => {
    await axios
      .get("http://localhost:3001/list-order")
      .then(function (response) {
        console.log(response);
        setServerData(response.data.orderList);
      });
  };

  return (
    <>
      <div className="Index">
        {!isdrawing && (
          <>
            <h1 style={{ color: "white" }}>Optimization</h1>
            <form className="form-container4">
              <label htmlFor="length">Stock Size:</label>
              <input
                type="number2"
                id="length"
                name="length"
                placeholder="(mm)"
                value={length}
                onChange={handleLengthChange}
                required
              />
              <div>
                <button
                  className="button5"
                  onClick={() => {
                    handleSetLength();
                  }}
                >
                  Add to production
                </button>
                <button
                  className="button5"
                  onClick={() => {
                    Optimize();
                    handleShowOrder();
                  }}
                >
                  Optimize
                </button>
              </div>
            </form>
          </>
        )}
        {isdrawing && (
          <>
            <h1 style={{ color: "white" }}>Results</h1>
            <div className="form-container4">
              <div className="stats">
                <p>
                  <strong>Total Waste: </strong> {totalWaste} <br />
                  <strong>Total Element: </strong> {totalElements} <br />
                  <strong>Stock Length: </strong> {stockLength}
                </p>
              </div>
              <ul>
                {serverData.map((item, i) => (
                  <li key={i}>
                    <div className="li-content">
                      <span>
                        <strong>Customer: </strong> {item.customername},&nbsp;
                        <strong>Unit: </strong> {item.unit},&nbsp;
                        <strong>Size: </strong> {item.size}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Visual OrderArray={OrderArray}></Visual>
          </>
        )}
      </div></>);};

export default Index;
