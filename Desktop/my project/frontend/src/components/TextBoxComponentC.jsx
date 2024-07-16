import React, { useState } from 'react';
import axios from 'axios'
import './TextBoxComponent.css'

const MyComp = ({item}) => {
  return (<div key={item.size}>
    <h1>{item.unit}</h1>
    <h1>{item.size}</h1>
  </div>)
}

const TextBoxComponent = ({customer}) => {
  const [inputs, setInputs] = useState(['', '']);
  const [serverData, setServerData] = useState([])
  const names = ['Units', 'Size'] 
  const dims = ['(count)', '(mm)'] 

  const handleChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  const handleClick = async () => {
    console.log({customer})
    await axios.post('http://localhost:3001/add-order', {
      unit: inputs[0],
      size: inputs[1]
    }).then(function (response) {
      console.log("Hello Baby I am back", response)
    })

    setInputs(['', '']);
  };

  const handleShow = async () => {
    // Save data logic here
    // After saving, clear the inputs
    await axios.get('http://localhost:3001/list-order').then(function (response) {
      console.log(response)
      setServerData(response.data)
    })

    setInputs(['', '']);
  };

  return (
    <>
      <div className = "form-container3">
        {inputs.map((input, index) => (
          <div key={index} className = "textBox">
            <label htmlFor={names[index]}>{names[index]}:</label>
            <input
              type="text"
              value={input}
              placeholder={dims[index]}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
        ))}
        <button className = "center-button3"onClick={handleClick}>Order</button>
        <button className = "center-button3"onClick={handleShow}>List</button>
      </div>
      <div>
      <table>
            <tr>
              <th>Unit</th>
              <th>Size</th>
            </tr>
            {serverData.map((item,i) => <tr key={i}>
              <th>{item.unit}</th>
              <th>{item.size}</th>
            </tr>)}
        </table>
      </div>
    </>
  );
};

export default TextBoxComponent;