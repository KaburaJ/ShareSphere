import React, { useState } from 'react';
import axios from 'axios';
import { Image, Video } from 'cloudinary-react';
import SideBar from './navbar';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';
import './styles/posts.css';

export function Posts() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [darkMode] = useDarkMode();

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'ibu9fmn9');

      const url = selectedFile.type && selectedFile.type.startsWith('image')
        ? 'https://api.cloudinary.com/v1_1/dfqjfd2iv/image/upload'
        : 'https://api.cloudinary.com/v1_1/dfqjfd2iv/video/upload';

      try {
        const response = await axios.post(url, formData);

        console.log('Post uploaded successfully!');
        setSelectedFile(response.data.secure_url);
      } catch (error) {
        console.error('Error while uploading post:', error);
      }
    }
  };

  const handleSaveFile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5003/posts',
        {
          PostURL: selectedFile.toString(),
          PostDescription: caption,
        },
        { withCredentials: true }
      );

      console.log(response);
      setCaption('');

      console.log('Post URL saved successfully!');
    } catch (error) {
      console.error('Error while saving post URL:', error);
    }
  };

  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white", marginTop: "-1em" } : { marginTop: "-1em" }}>
      <SideBar />
      <div className="posts" style={darkMode ? { backgroundColor: "black", color: "white", marginLeft: "15em", height: "110vh" } : { marginLeft: "15em", height: "110vh" }}>
        <BackButton />
        <form onSubmit={handleFileUpload} className="input">
          <input style={{ marginLeft: "1.8em" }} type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button type="submit">Upload</button>
        </form>
        <div className="posts">
          {selectedFile && typeof selectedFile === 'string' && (
            <div className="post-image-container">
              {/* Use 'Image' component for images and 'Video' component for videos */}
              {selectedFile.startsWith('https://res.cloudinary.com/') && selectedFile.endsWith('.jpg') && (
                <Image cloudName="dfqjfd2iv" publicId={selectedFile} className="post-image" />
              )}
              {selectedFile.startsWith('https://res.cloudinary.com/') && (selectedFile.endsWith('.mp4') || selectedFile.endsWith('.webm')) && (
                <Video cloudName="dfqjfd2iv" publicId={selectedFile} className="post-image" controls />
              )}
            </div>
          )}
        </div>
        <form onSubmit={handleSaveFile} className="caption-form">
          <input
            type="text"
            placeholder="Enter caption"
            value={caption}
            style={{ marginTop: "2em", width: "500px" }}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: "10em" }} disabled={!selectedFile || !caption}>
            Save Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default Posts;
