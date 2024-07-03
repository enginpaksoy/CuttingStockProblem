import React, { useState } from 'react';
import XYZInput from './XYZInput';

const CustomerPage = () => {
  const [inputs, setInputs] = useState([{ id: Date.now(), x: '', y: '', z: '' }]);

  const addNewInput = () => {
    setInputs([...inputs, { id: Date.now(), x: '', y: '', z: '' }]);
  };

  const handleInputChange = (id, field, value) => {
    setInputs(inputs.map(input => input.id === id ? { ...input, [field]: value } : input));
  };

  return (
    <div className="parent-container">
      <h1>Admin Page</h1>
      <p>Welcome to the Admin Page!</p>
      {inputs.map((input) => (
        <XYZInput
          key={input.id}
          id={input.id}
          x={input.x}
          y={input.y}
          z={input.z}
          onInputChange={handleInputChange}
          onAddNewInput={addNewInput}
        />
      ))}
    </div>
  );
};

export default CustomerPage;
