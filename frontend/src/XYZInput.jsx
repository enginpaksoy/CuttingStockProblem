import React from 'react';

const XYZInput = ({ id, x, y, z, onInputChange, onAddNewInput }) => {
  const handleInputChange = (field, value) => {
    onInputChange(id, field, value);
  };

  return (
    <div className="XYZInput">
      <input
        type="text"
        value={x}
        onChange={(e) => handleInputChange('x', e.target.value)}
        placeholder="x"
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        value={y}
        onChange={(e) => handleInputChange('y', e.target.value)}
        placeholder="y"
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        value={z}
        onChange={(e) => handleInputChange('z', e.target.value)}
        placeholder="z"
        style={{ marginRight: '10px' }}
      />
      <button className="small-button" onClick={onAddNewInput}>+</button>
    </div>
  );
};

export default XYZInput;