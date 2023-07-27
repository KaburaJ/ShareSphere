import React, { useState } from 'react';
import axios from 'axios';
import { Image, Video } from 'cloudinary-react';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';
import './styles/upload.css';

export function Posts() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
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
        setSelectedFile(response.data.secure_url); // Corrected this line
        setPreviewUrl(response.data.secure_url); // Set the preview URL to the uploaded image or video
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
      setSelectedFile(null);
      setCaption('');
      setPreviewUrl(null);

      console.log('Post URL saved successfully!');
    } catch (error) {
      console.error('Error while saving post URL:', error);
    }
  };

  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white" } : { backgroundColor:"#F4E4EC" }}>
      <div className="posts-container" style={{ marginLeft: "15em", height: "100vh" }}>
        <BackButton />

        <form onSubmit={handleFileUpload} className="upload-form">
          <label htmlFor="file-input" style={{height:"3em"}}>
            Choose File
            <input id="file-input" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          </label>
          <button type="submit" style={{height:"3.8em", fontWeight:"bold"}}>Upload</button>
        </form>
        {previewUrl && (
          <div className="post-preview">
            {/* Use 'Image' component for images and 'Video' component for videos */}
            {selectedFile.type && selectedFile.type.startsWith('image') && (
              <img src={previewUrl} alt="Post Preview" />
            )}
            {selectedFile.type && (selectedFile.type.startsWith('video') || selectedFile.type.startsWith('audio')) && (
              <video src={previewUrl} alt="Post Preview" controls />
            )}
          </div>
        )}
        <form onSubmit={handleSaveFile} className="caption-form" style={{height:"3em"}}>
          <input
          style={{marginLeft:"1.5em", borderRadius:"10px"}}
            type="text"
            placeholder="Enter caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type="submit" style={{backgroundColor:"#E83D95"}} disabled={!selectedFile || !caption}>
            Save Post
          </button>
        </form>
        {previewUrl && (
          <div className="caption-preview">
            {previewUrl.endsWith('.jpg') || previewUrl.endsWith('.jpg') || previewUrl.endsWith('.jpeg') || previewUrl.endsWith('.png') ? (
              <img
                src={previewUrl}
                alt=""
                className="post-image"
                style={{ width: "8em", height: "8em" }}
              />
            ) : previewUrl.endsWith('.mp4') || previewUrl.endsWith('.mp3') || previewUrl.endsWith('.gif') ? (
              <video
                controls
                src={previewUrl}
                alt=""
                className="post-image"
                style={{ width: "8em", height: "8em" }}
              />
            ) : null
            }
            <strong>Caption Preview:</strong> {caption || 'No caption'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;