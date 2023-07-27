import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BackButton from './back';

export const Signup = () => {
  const [step, setStep] = useState(1);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [userage, setUserAge] = useState(0);
  const [useremail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();


  const handleNext = (num) => {
    setStep(num);
  };

  const handlePrevious = (step) => {
    setStep(step - 1);
  };

  const registrationData = {
    FirstName: firstname,
    LastName: lastname,
    UserName: username,
    UserAge: userage,
    UserEmail: useremail,
    UserPassword: password,
    c_password: cpassword
  };

  const fetchdata = () => {
    fetch('http://localhost:5002/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        setResponse(json);
      })
      .catch(error => console.error(error));
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

  const handleNavigationSubmit = (num) => {
    if (isComplete) {
      if (num >= step) {
        handleNext(num);
      } else if (num <= step) {
        handlePrevious(num);
      }
    }
  };

  const Navigation = () => {
    return (
      <div className="navigation">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div
            key={num}
            style={{borderRadius:"50%", height:"3em", width:"3em"}}
            className={`step-number ${step === num ? 'active' : ''}`}
            onClick={() => handleNavigationSubmit(num)}
          >
            {num}
          </div>
        ))}
      </div>
    );
  };

  const bottom = () => {
    return (
      <h4 style={{ marginLeft: '1em', color: '#e83d95' }}>
        Already have an account? 
        <Link to="/login" style={{ marginLeft: '1em', color: '#eb6eb0', fontSize: 'medium' }}>Sign in</Link>
      </h4>
    );
  };

  const signUpContent = () => {
    const handleFormSubmit = (event) => {
      event.preventDefault();
      if (isComplete) {
        handleNext(step + 1);
        setIsComplete(false);
      }
    };

    const handleFirstName = (e) => {
      setFirstName(e.target.value);
      setIsComplete(true);
    };

    const handleLastName = (e) => {
      setLastName(e.target.value);
      setIsComplete(true);
    };

    const handleUserName = (e) => {
      setUserName(e.target.value);
      setIsComplete(true);
    };

    const handleUserAge = (e) => {
      setUserAge(e.target.value);
      setIsComplete(true);
    };

    const handleUserEmail = (e) => {
      setUserEmail(e.target.value);
      setIsComplete(true);
    };

    const handlePassword = (e) => {
      setPassword(e.target.value);
      setIsComplete(true);
    };

    const handleCPassword = (e) => {
      setCPassword(e.target.value);
      setIsComplete(true);
    };
    
    const handleSignUpSubmit = (event) => {
      handleFormSubmit(event);
      handleSignUp(event);
    };

    const handleSignUp = async () => {
      try {
        await fetchdata();
        toast.success('Sign up successful. Please verify your email', {
          position: 'top-center',
          autoClose: 3000, 
        });
  
        setTimeout(() => {
          navigate('/home');
        }, 3000); 
      } catch (error) {
        if (password !== cpassword) {
          toast.error('The password and confirm password do not match');
        }
        toast.error('Error signing up. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    };

    switch (step) {
      case 1:
        return (
          <>
          <div className='firstname'>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"6em"}}>Step 1 of 7</div>
              <input className='FirstName' placeholder="First name" value={firstname} onChange={handleFirstName} />
              {bottom()}
            </form>
          </div>
          </>
        );
      case 2:
        return (
          <div className='lastname'>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"6em"}}>Step 2 of 7</div>
              <input className='LastName' placeholder="Last name" value={lastname} onChange={handleLastName} />
            </form>
          </div>
        );
      case 3:
        return (
          <div className='username'style={{marginLeft:"45%"}}>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"-9em"}}>Step 3 of 7</div>
              <input className='UserName' style={{marginLeft:"-17em"}} placeholder="Username" value={username} onChange={handleUserName} />
            </form>
          </div>
        );
      case 4:
        return (
          <div className='userage'>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"6em"}}>Step 4 of 7</div>
              <input className='UserAge' placeholder="Age" value={userage} onChange={handleUserAge} />
            </form>
          </div>
        );
      case 5:
        return (
          <div className='useremail'>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"6em"}}>Step 5 of 7</div>
              <input className='UserEmail' placeholder="Email" value={useremail} onChange={handleUserEmail} />
            </form>
          </div>
        );
      case 6:
        return (
          <div className='password'>
            <form onSubmit={handleFormSubmit}>
              <div style={{marginLeft:"6em"}}>Step 6 of 7</div>
              <input type="password" className='Password' placeholder="Password" value={password} onChange={handlePassword} />
            </form>
          </div>
        );
        case 7:
          return (
            <div className='c-password'>
              <form onSubmit={handleSignUpSubmit}>
                <div style={{marginLeft:"-22em"}}>Step 7 of 7</div>
                <input
                  type="password"
                  className='c-password'
                  placeholder="Confirm Password"
                  value={cpassword}
                  onChange={handleCPassword}
                />
                <button type="submit" style={{marginLeft:"6em"}}>
                  Sign Up
                </button>
              </form>
            </div>
          );
        default:
          return null;
      }
  };


  return (
    <div className='signup' style={{position:"fixed", backgroundColor:"#f4e4ec", height: "100vh"}}>
      {/* <BackButton /> */}
      {Navigation()}
      {signUpContent()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastContainerClassName="custom-toast-container"
      />
    </div>
  );
  
};






