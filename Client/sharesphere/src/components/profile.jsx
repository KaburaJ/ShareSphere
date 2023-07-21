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

  const handleUserActivity = async () => {
    navigate('/activity')
  }

  const handleEditProfile = async () => {
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
    })

    setTimeout(() => {
      setShowLogoutDialog(true)
    }, 4000);


  }

  const handleUserLogOut = async (password) => {
    try {
      const logoutData = {
        password: password
      };

      let response = await axios.post('http://localhost:5003/users/logout', logoutData, {
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
    <div style={darkMode ? { backgroundColor: "black", color: "white",marginTop:"-1em"} : {}}>
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
      <div className={`profile ${darkMode ? 'profile-dark-mode' : ''}`}>
      <SideBar className="sideBar" />
      <div className="signup">
        <div className="back" style={{ marginTop:"1em",marginLeft: "22%" }}>
          <BackButton />
        </div>
        <div className="profile-container">
          <div className='profile-header'>
          </div>

          {<FontAwesomeIcon icon={faTrash} onClick={handleProfileDelete} style={{ color: "#F9FAFC", cursor: "pointer", marginLeft: "75%" }} />}
          {isFormComplete ? (
            <div className="card">
              <img src={profile.ProfileImage} alt="" />
              <h1>{profile.UserName}</h1>
              <p className="title">{profile.ProfileDescription}</p>
              <p>{profile.ProfileDescription}</p>
              <p style={{ display: "block" }}>
                <button className="contact" style={{ marginBottom: ".4em" }}>View activity</button>
              </p>
            </div>
          ) : (
            createProfileContent()
          )}
          <div className="card">
            <img src={profile.ProfileImage} alt="John" style={profileStyle} />
            <h1 style={{ marginTop: "1em" }}>{profile.UserName}</h1>
            <p className="title">{profile.ProfileDescription}</p>
            {/* <p>{profile.ProfileDescription}</p> */}
            <p style={{ marginBottom: "1.5em" }}>
              <button onClick={handleUserActivity} style={{ marginTop: "1em", width: "70%" }}>View activity</button>
            </p>
            <p style={{ marginBottom: "1.5em" }}><button onClick={handleEditProfile} style={{ width: "70%" }}>Edit Profile</button></p>
            {!hasProfile && (
              <p style={{ marginBottom: "1.5em" }}>
                <button onClick={Navigation()} style={{ width: "100%" }}>
                  Create Profile
                </button>
              </p>
            )}
            <p style={{ marginBottom: "1.5em" }}>
              <button onClick={handleLogOutButtonClick} style={{ marginTop: "1em", width: "70%" }}>Log Out</button>
            </p>
            {showLogoutDialog && (
              <LogoutDialog
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={handleUserLogOut}
              />
            )}

          </div>
          <div className="actions-card">
            <h1 style={{ marginTop: "1.5em" }}>Metrics</h1>
            <p className="title">Posts:{postsCount}</p>
            <p className="title">Followers:{followers}</p>
            <p className="title">Following:{following}</p>
            <p style={{ marginBottom: "1.5em" }}>
              <button onClick={handleFollowers} style={{ width: "70%" }}>Relationships</button>
            </p>
            <p style={{ marginBottom: "1.5em" }}><button onClick={handleEditProfile} style={{ width: "70%" }}>Message</button></p>
          </div>

          <div className="details-card">
            <p className="title" style={{ marginTop: "1em", marginBottom: "1em" }}>
              FirstName<br /><p style={{ marginTop: ".5em", fontSize: "10", fontWeight: "100" }}>{details.FirstName}</p></p>
            <p className="title" style={{ marginTop: "1em", marginBottom: "1em" }}>
              LastName<br /><p style={{ marginTop: ".5em", fontSize: "10", fontWeight: "100" }}>{details.LastName}</p></p>
            <p className="title" style={{ marginTop: "1em", marginBottom: "1em" }}>
              Age<br /><p style={{ marginTop: ".5em", fontSize: "10", fontWeight: "100" }}>{details.UserAge}</p></p>
            <p className="title" style={{ marginTop: "1em", marginBottom: "1em" }}>
              Email Address<br /><p style={{ marginTop: ".5em", fontSize: "10", fontWeight: "100" }}>{details.UserEmail}</p></p>
            <p className="title" style={{ marginTop: "1em", marginBottom: "1em" }}>
              Date Joined<br />
              <p style={{ marginTop: ".5em", fontSize: "10", fontWeight: "100" }}>
                {details.timestamp ? details.timestamp.slice(0, 10) : ""}
              </p>
            </p>

          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

