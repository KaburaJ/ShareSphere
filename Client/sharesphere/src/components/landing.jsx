import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
// import logo from '../images/sharelogo2-removebg-preview.png';
import './styles/landing.css';

export const Landing = () => {
  const navigate = useNavigate();

  const handleEmailSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="landing">
      <div className="landing-content">
        {/* <img className="logo" src={logo} alt="ShareSphere Logo" /> */}
        <h1 className="heading" style={{color: "black"}}>Welcome to ShareSphere</h1>
        <div className="sign-up-options">
          <button className="email-signup-button" onClick={handleEmailSignup}>
            Sign up with Email
          </button>
          <p className="or-divider">Or</p>
          <button className="google-signup-button">Sign up with Google</button>
          <p className="terms-of-service">
            By signing up, you agree to the <Link to="/" className='terms'>Terms of Service</Link> and{' '}
            <Link to="/" className='privacy'>Privacy Policy</Link>, including Cookie Use.
          </p>
          <p className="signin-prompt">
            Already have an account? <Link to="/login" style={{fontSize:"medium"}}>Sign in</Link>
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
