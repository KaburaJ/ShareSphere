import React, { useState } from 'react';
import './styles/auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from './back';
import { toast } from 'react-toastify';
import { useDarkMode } from './darkModeContext';

export const Login = () => {
  const [step, setStep] = useState(1);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const navigate = useNavigate()
  const [darkMode] = useDarkMode()

  const handleNext = (selectedStep) => {
    setStep(selectedStep);
  };

  const registrationData = {
    UserName: username,
    UserPassword: password
  };

  const logindata = async () => {
    try {
      let response = await axios.post('http://localhost:5002/users/login', registrationData, {
      withCredentials: true
    })

    console.log(response);
    if(response.ok){
      toast.success('Logged in successful', {
        position: 'top-center',
        autoClose: 3000, 
      })
      setTimeout(() => {
        navigate('/home');
      }, 3000); 
    }
    } catch (error) {
      console.log(error);
      toast.error('Username or password incorrect!',{
        position: 'top-center',
        autoClose:3000,
      })
      
    }
  };

  const Popup = () => {
    if (!response) return null;

    return (
      <div className="popup">
        <div className="popup-content">
          <p>Sign up successful. Please verify your email</p>
          <button onClick={() => setResponse(null)}>Close</button>
        </div>
      </div>
    );
  };

  const Navigation = () => {
    return (
      <div className="navigation" style={{ marginLeft: '20em' }}>
        {[1, 2].map((num) => (
          <div
            key={num}
            style={{borderRadius:"50%", height:"3em", width:"3em"}}
            className={`step-number ${step === num ? 'active' : ''}`}
            onClick={() => handleNext(num)}
          >
            {num}
          </div>
        ))}
      </div>
    );
  };

  const signUpContent = () => {
    const handleFormSubmit = (event) => {
      event.preventDefault();
      handleNext(step + 1);
    };
    const handleUserName = (e) => {
      setUserName(e.target.value);
    };
    const handlePassword = (e) => {
      setPassword(e.target.value);
    };

    switch (step) {
      case 1:
        return (
          <div className='username' style={{height:"100vh"}}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ fontWeight:"normal", color:"black", marginLeft: '24em'}}>Step 1 of 2</div>
              <input className='UserName' placeholder="Username" style={{ marginLeft: '28em'}} value={username} onChange={handleUserName} />
              <h4 style={{ marginLeft: '18em', color: '#e83d95' }}>
              Do not have an account? 
              <Link to="/signup" style={{ marginLeft: '2em', color: '#eb6eb0',fontSize: 'medium' }}>Sign up</Link>
            </h4>
            </form>
          </div>
        );
      case 2:
        return (
          <div className='password' style={{height:"100vh"}}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ color:"black", marginLeft: '3em'}}>Step 2 of 2</div>
              <input type='password' className='Password' placeholder="Password" style={{ height:"3em",marginLeft: '-1em'}} value={password} onChange={handlePassword} />
              <Link to="/home" style={{ marginLeft: '2em' }}>
              <button onClick={logindata} style={{backgroundColor: '#e83d95'}} >Sign in</button>
            </Link>
              <h4 style={{ marginLeft: '-1em', color: '#e83d95' }}>
              Do not have an account? 
              <Link to="/signup" style={{ marginLeft: '2em', color: '#eb6eb0',fontSize: 'medium' }}>Sign up</Link>
            </h4>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{marginLeft:'10em'}} className='signup'>
      {/* <BackButton/> */}
      {Navigation()}
      {signUpContent()}
      {Popup()}
    </div>
  );
};