import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./styles/modal.css"; // Import the CSS file for modal styles

export function CommentModal({ profileImage, commenterName, onSubmit }) {
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCommentSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  // Create a reference to the comment-modal div
  const modalRef = useRef();

  // Handle clicks outside the modal or on the close icon
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // Call the onSubmit function with an empty comment to close the modal
      onSubmit("");
    }
  };

  // Function to handle the close button click
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Add event listener for clicks outside the modal
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Return null if the modal is closed
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="comment-modal">
      <div ref={modalRef} className="comment-modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="close-icon"
          onClick={handleCloseModal}
          style={{position:"absolute",marginLeft:"15em", cursor:"pointer"}}
        />

        <img src={profileImage} alt={commenterName} className="commenter-image" />
        <div className="commenter-details">
          <p className="commenter-name">{commenterName}</p>
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
