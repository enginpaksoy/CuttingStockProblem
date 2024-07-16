import './TrueLoginPageC.css'
import TextBoxComponentC from './TextBoxComponentC.jsx'
import { useLocation } from 'react-router-dom';

const TrueLoginPageC = () =>{
    const location = useLocation();
    const message = location.state?.message
    return(
        <div className='TrueLoginPage'>
            <TextBoxComponentC message={message}></TextBoxComponentC>
        </div>
    );
};

export default TrueLoginPageC;