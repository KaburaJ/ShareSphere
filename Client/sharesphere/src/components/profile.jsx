import React, { useEffect, useState } from 'react';
import './styles/profile.css';
import profileImage from '../images/walllp.jpg';
import SideBar from './navbar';
import './styles/auth.css';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BackButton from './back';
import { ToastContainer, toast } from 'react-toastify';
import LogoutDialog from './logoutDialog';
import { useDarkMode } from './darkModeContext';
import BasicInfoDialog from './basicInformation';

export const Profile = () => {
  const profileStyle = {
    width: '100%',

  };

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [response, setResponse] = useState(null)
  const [profile, setProfile] = useState('')
  const [activity, setUserActivity] = useState([])
  const [usernameEdit, setUserNameEdit] = useState('')
  const [profileImageEdit, setProfileImageEdit] = useState(null)
  const [profileDescriptionEdit, setProfileDescriptionEdit] = useState('')
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [details, setDetails] = useState([])
  const [myFollowers, setMyFollowers] = useState('')
  const [hasProfile, setHasProfile] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [darkMode] = useDarkMode()
  const [showBasicInfoDialog, setShowBasicInfoDialog] = useState(false);



  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete('http://localhost:5003/user/deleteaccount', {
        withCredentials: true
      });

      if (response.status === 200) {
        // Account deleted successfully, redirect to /signup
        navigate('/signup');
      } else {
        console.error('Error while deleting account:', response.data);
      }
    } catch (error) {
      console.error('Error while deleting account:', error);
    }
  };


  const handleBasicInfo = () => {
    setShowBasicInfoDialog(true);
  };

  const handleBasicInfoDialogClose = () => {
    setShowBasicInfoDialog(false);
  };


  const handleNext = (selectedStep) => {
    setStep(selectedStep);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('upload_preset', 'ibu9fmn9');

    const url = 'https://api.cloudinary.com/v1_1/dfqjfd2iv/image/upload';

    try {
      const response = await axios.post(url, formData);

      console.log('Profile image uploaded successfully!');
      setSelectedFile(response.data.secure_url);
      // setIsFormComplete(true);
    } catch (error) {
      console.error('Error while uploading profile image:', error);
    }
  };

  const handleSaveFile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5003/user/profile',
        {
          ProfileImage: selectedFile.toString(),
          ProfileDescription: caption,
        },
        { withCredentials: true }
      );

      console.log(response.data.message);
      setResponse(response.data.message)
      setCaption('');

      console.log('Profile URL saved successfully!');
      setIsFormComplete(true);
    } catch (error) {
      console.error('Error while saving profile image:', error);
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
      <div className="navigation" style={{ marginLeft: '65%', width: '100%' }}>
        {[1, 2].map((num) => (
          <div
            key={num}
            className={`step-number ${step === num ? 'active' : ''}`}
            onClick={() => handleNext(num)}
          >
            {num}
          </div>
        ))}
      </div>
    );
  };

  const createProfileContent = () => {
    const handleFormSubmit = (event) => {
      event.preventDefault();
      handleNext(step + 1);
    };
    switch (step) {
      case 1:
        return (
          <div className="profile-image-container" style={{ display: "none", marginLeft: '70%', marginRight: '25%', width: '100%' }}>
            <form onSubmit={handleFormSubmit} className="input">
              <input type="file" onChange={handleFileUpload} />
              <button type="submit">Upload</button>
            </form>
            {selectedFile && (
              <div className="posts">
                <Image cloudName="dfqjfd2iv" publicId={selectedFile} className="post-image" />
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="profile-description-container">
            <form
              onSubmit={handleSaveFile}
              className="caption-form"
              style={{ marginLeft: '65%', marginRight: '25%', width: '100%' }}
            >
              <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button type="submit" disabled={!selectedFile || !caption} style={{ marginLeft: '33%' }}>
                Save Profile
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  const handleProfileDelete = async () => {
    try {
      let response = await axios.delete('http://localhost:5003/deleteprofile', {
        withCredentials: true
      })
      setResponse(response.data)
      console.log(response.data);
    } catch (error) {

    }
  }

  const viewProfile = async () => {
    try {
      let response = await axios.get('http://localhost:5003/viewprofile', {
        withCredentials: true
      });
      if (response.data.results.recordset[0]) {
        setProfile(response.data.results.recordset[0]);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error while retrieving user profile:', error);
    }
  };


  useEffect(() => {
    viewProfile()
  }, [])

  const handleUserActivity = () => {
    navigate('/activity')
  }

  const handleEditProfile = () => {
    navigate("/profilesettings")
  }

  const getFollowers = async () => {
    try {
      const response = await axios.get('http://localhost:5003/followers', {
        withCredentials: true
      });
      setFollowers(response.data.results[0].FollowerCount);
      console.log(`followers: ${response.data.results[0].FollowerCount}`);
    } catch (error) {
      console.error('Error while counting followers:', error);
    }
  };

  useEffect(() => {
    getFollowers();
  }, []);


  const getFollowing = async () => {
    try {
      let response = await axios.get('http://localhost:5003/following', {
        withCredentials: true
      })
      setFollowing(response.data.results[0].FollowerCount)
    } catch (error) {
      console.error('Error while counting following:', error);
    }

  }

  useEffect(() => {
    getFollowing()
  }, [])

  const getPostsCount = async () => {
    try {
      let response = await axios.get('http://localhost:5003/postscount', {
        withCredentials: true
      })
      setPostsCount(response.data.results[0].PostCount)
    } catch (error) {
      console.error('Error while counting posts:', error);
    }

  }

  useEffect(() => {
    getPostsCount()
  }, [])

  const thatUserDetails = async () => {
    try {
      let response = await axios.get('http://localhost:5003/thatuser', {
        withCredentials: true
      })
      setDetails(response.data[0])
      // console.log(response.data[0]);
    } catch (error) {
      console.error('Error while retrieving user details:', error);
    }
  }

  useEffect(() => {
    thatUserDetails()
  }, [])

  const handleFollowers = () => {
    navigate("/users")
  }

  const handleLogOutButtonClick = async () => {
    toast.warn('Do you want to log out?', {
      position: "top-center",
      autoClose: 3000
    });

    setTimeout(() => {
      setShowLogoutDialog(true);
    }, 4000);
  };

  const handleUserLogOut = async (password) => {
    try {
      const logoutData = {
        password: password
      };

      let response = await axios.post('http://localhost:5002/users/logout', logoutData, {
        withCredentials: true
      });

      if (response.ok) {
        setShowLogoutDialog(false);
        toast.success('You have logged out', {
          position: "top-center",
          autoClose: 3000
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };


  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white"} : {}}>
      {showLogoutDialog && (
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      )}
      {showLogoutDialog && (
        <LogoutDialog
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={handleUserLogOut}
        />
      )}
      {showBasicInfoDialog && (
        <BasicInfoDialog
          onClose={handleBasicInfoDialogClose}
          details={details} // Pass the user details to BasicInfoDialog
        />
      )}
      <div className={`profile ${darkMode ? 'profile-dark-mode' : ''}`}>
        <div className="signup">
          {/* <div className="back" style={{ position:"absolute"}}>
            <BackButton />
          </div> */}
          <div className="profile-container">
            {<FontAwesomeIcon icon={faTrash} onClick={handleProfileDelete} style={{ color: "#F9FAFC", cursor: "pointer", marginLeft: "75%" }} />}
            {isFormComplete ? (
              <div className="profile-image">
                <Image cloudName="dfqjfd2iv" publicId={profile.ProfileImage} className="profile-image" />
              </div>
            ) : (
              createProfileContent()
            )}
            <div className="profile-pic">
              <img src={profile.ProfileImage} style={{ position: "absolute", borderRadius: "50%", width: "12em", height: "12em", marginTop: "-11em" }}></img>
            </div>
            </div>
            <div className="profile-details">
              <h1>{profile.UserName}</h1>
              <p className="title" style={{ marginBottom: ".5em" }}>{profile.ProfileDescription}</p>
              <div>
                <button onClick={handleEditProfile} className="profile-button">Message</button>
                <button onClick={handleEditProfile} className="profile-button">Edit Profile</button>
                <button onClick={handleLogOutButtonClick} className="profile-button">Log Out</button>
              </div>
              {!hasProfile && (
                <p>
                  <button onClick={Navigation()} className="profile-button">
                    Create Profile
                  </button>
                </p>
              )}
            </div>

            {/* Horizontal Fields */}
            <div className="horizontal-fields">
              <div className="field">
                <h2>{postsCount}</h2>
                <p>Posts</p>
              </div>
              <div className="field">
                <h2>{followers}</h2>
                <p>Followers</p>
              </div>
              <div className="field">
                <h2>{following}</h2>
                <p>Following</p>
              </div>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={handleDeleteAccount}
                style={{ color: "#E83D95", cursor: "pointer", marginLeft: "1rem" }}
              />
            </div>

            <div className="profile-metrics" style={{ borderTop: "1px solid #ccc", paddingTop: "1em" }}>
              <button onClick={handleUserActivity} className="profile-button">View activity</button>
              <button onClick={handleFollowers} className="profile-button">Relationships</button>
              <button onClick={handleBasicInfo} className="profile-button">Basic Information</button>
            </div>
        </div>
      </div>
    </div>
  );
};