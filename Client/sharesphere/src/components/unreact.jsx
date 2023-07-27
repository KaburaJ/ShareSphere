import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const DeleteReactionButton = ({ category, reactionType, categoryID, updateReactions }) => {
  const [clicked, setClicked] = React.useState(false);

  const handleDeleteReaction = async () => {
    try {
      await axios.delete('http://localhost:5003/react/delete', {
        data: {
          category,
          reactionType,
          categoryID,
        },
      });
      updateReactions(reactionType, false); // Update the reactions after performing the action
    } catch (error) {
      console.error('Error deleting reaction:', error);
    }
  };

  // Handle click on the "Delete Reaction" button
  const handleClick = () => {
    setClicked((prevClicked) => !prevClicked); // Toggle the clicked state
    handleDeleteReaction();
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faThumbsDown}
        onClick={handleClick}
        style={{ color: clicked ? 'blue' : 'black' }} // Apply blue color if clicked, black if not
      />
    </>
  );
};

export default DeleteReactionButton;
