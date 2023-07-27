import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsClapping, faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const ReactButton = ({ Category, ReactionType, CategoryID, updateReactions }) => {
  const [reacted, setReacted] = React.useState(false);
  const [count, setCount] = React.useState(0); // New state variable to store the number of likes

  React.useEffect(() => {
    // Check if the user has already liked the comment/reply
    const checkReaction = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5003/react/check",
          {
            Category: Category,
            ReactionType: ReactionType,
            CategoryID: CategoryID,
          },
          {
            withCredentials: true,
          }
        );
        setReacted(response.data.result);
        setCount(response.data.count); // Set the initial count of likes
      } catch (error) {
        console.error("Error checking reaction:", error);
      }
    };

    checkReaction();
  }, [Category, ReactionType, CategoryID]);

  const handleReact = async () => {
    try {
      if (reacted) {
        // Unlike the comment/reply
        await axios.delete("http://localhost:5003/react/delete", {
          data: {
            Category: Category,
            ReactionType: ReactionType,
            CategoryID: CategoryID,
          },
          withCredentials: true,
        });
        setCount((prevCount) => prevCount - 1); // Decrement the count by 1
      } else {
        // Like the comment/reply
        await axios.post(
          "http://localhost:5003/react",
          {
            Category: Category,
            ReactionType: ReactionType,
            CategoryID: CategoryID,
          },
          {
            withCredentials: true,
          }
        );
        setCount((prevCount) => prevCount + 1); // Increment the count by 1
      }
      // Update the reactions after performing the action
      updateReactions(ReactionType, !reacted, CategoryID);
      setReacted(!reacted);
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  return (
    <button onClick={handleReact} style={{ background: "none", border: "none" }}>
      {ReactionType === "Like" && (
        <FontAwesomeIcon
          icon={faThumbsUp}
          style={{
            color: reacted ? "blue" : "gray",
            marginRight: "0.3em",
          }}
        />
      )}
      {ReactionType === "Love" && (
        <FontAwesomeIcon
          icon={faHeart}
          style={{
            color: reacted ? "red" : "gray",
            marginRight: "0.3em",
          }}
        />
      )}
      {ReactionType === "Celebrate" && (
        <FontAwesomeIcon
          icon={faHandsClapping}
          style={{
            color: reacted ? "gold" : "gray",
            marginRight: "0.3em",
          }}
        />
      )}
      {count > 0 && <span style={{ color: "gray" }}>{count}</span>}
    </button>
  );
};

export default ReactButton;
