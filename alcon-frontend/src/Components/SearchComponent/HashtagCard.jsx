import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./HashtagCard.css";

const HashatgCard = ({hashtag, setIsSearchVisible}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Add your navigation logic here
    navigate(`/hashtagposts/${hashtag}`)
    setIsSearchVisible(false);
  };

  console.log("Hashtag Data in Card : ", hashtag);

  return (
    <div onClick={handleNavigate} className='py-1 cursor-pointer'>
      <div className="flex items-center " style={{
        backgroundColor: "#f2f2f2", // Use any shade of grey you prefer
        padding: "10px",
        borderRadius: "5px",
        /* Add any other styles you want for the card */
      }}>
        <div className="ml-3 " >
          <p>#{hashtag}</p>
        </div>
      </div>
    </div>
  );
}

export default HashatgCard;
