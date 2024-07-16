import React, { useState } from 'react';
import axios from 'axios'
import './AdminPage.css'
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [inputId, setInputId] = useState();
    const [inputPassword, setInputPassword] = useState('');
    const [myTData, setMyTData] = useState({})
    const navigate = useNavigate();

    const handleIdChange = (e) => {
        e.preventDefault();
        setInputId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setInputPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/user', {
                username: inputId,
                password: inputPassword,
            });
            if (response.data.message === 'Başarılı') {
                console.log('Login successful:', response.data);
                navigate('/admin/trueLogin');  // navigate asenkron değil, burada await gerekmiyor.
            } else {
                console.log('Login failed:', response.data.message);
            }
            setMyTData(response.data);
        } catch (error) {
            console.error('Login failed:', error);
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
            </form>
            <h1>{myTData.message}</h1>
        </div>
    );
};

export default AdminPage;