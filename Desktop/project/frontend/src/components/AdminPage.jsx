import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import './AdminPage.css'

const AdminPage = () => {
    const navigate = useNavigate();
    const [inputId, setInputId] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [message, setMessage] = useState('');

    const correctId = "1234567";
    const correctPassword = "123456";

    const handleIdChange = (e) => {
        setInputId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setInputPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputId === correctId && inputPassword === correctPassword) {
            navigate('/trueLogin');
        } else {
            setMessage('Error: Incorrect ID or password.');
        }
    };

    return(
        <div className='AdminPage'>
            <form className='form-container' onSubmit={handleSubmit}>
                <label htmlFor='id'>ID:</label>
                <input type="text" id="id" name="id" placeholder="Enter your ID" value={inputId} onChange={handleIdChange} />
                
                <label htmlFor='password'>Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" value={inputPassword} onChange={handlePasswordChange} />

                <button className='center-button' type="submit">Submit</button>
                {message && <p className='message'>{message}</p>}
            </form>
        </div>
    );
};

export default AdminPage;