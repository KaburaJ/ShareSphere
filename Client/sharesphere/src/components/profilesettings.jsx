import React, { useState } from 'react';
import './styles/settings.css';
import SideBar from './navbar';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import BackButton from './back';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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
    } catch (error) {
      console.error('Error while uploading profile image:', error);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        'http://localhost:5003/user/profile/edit',
        {
          UserName:name,
          ProfileImage: selectedFile.toString(),
          ProfileDescription:bio,
        },
        { withCredentials: true }
      );

      console.log(response.data.message);
      setName('');
      setBio('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error while saving profile information:', error);
    }
  };

  return (
    <>
      <SideBar />
      <div className="settings-page">
        <BackButton/>
        <h2 className="settings-title">Settings</h2>
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              onChange={handleFileUpload}
              accept="image/*"
            />
            {selectedFile && (
              <div className="profile-image-preview">
                <Image
                  cloudName="dfqjfd2iv"
                  publicId={selectedFile}
                  width="50"
                  height="50"
                  crop="fill"
                  style={{width:"20vw", height:"15vh"}}
                  className="profile-image"
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">User Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Profile Description</label><br/>
            <textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="Enter your bio"
              required
            />
          </div>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default SettingsPage;
