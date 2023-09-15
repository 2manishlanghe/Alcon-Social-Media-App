import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { followUserAction } from "../../Redux/User/Action";

const SuggestionsUserCard = ({ image, username, description, userid }) => {
  console.warn("userID", userid);

  const token = localStorage.getItem("token");
  const { post } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [isFollow, setIsFollow] = useState(false);

  const data = {
    jwt: token,
    userId: userid,
  };
  const handleFollowUser = async () => {
    console.log("JWT", data.jwt);
    dispatch(followUserAction(data));
    console.log("follow");
    setIsFollow(true);
  };

  // const handleFollowUser = async () => {
  //   try {
  //     // Set the Authorization header with the token
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // Make the PUT request with the headers
  //     await axios.put(`http://localhost:5454/api/users/follow/${userid}`, { headers });

  //     // Update the UI to show the "Following" status
  //     setIsFollowing(true);
  //   } catch (error) {
  //     // Handle any errors
  //     console.error(error);
  //   }
  // };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img className="w-11 h-11 rounded-full" src={image} alt="" />
        <div className="ml-2">
          <p className="text-xsm cursor-pointer font-bold">{username}</p>
          <p className="text-xsm text-gray-500">{description}</p>
        </div>
      </div>
      {!isFollow ? (
        <p
          className="text-blue-400 ml-25 text-sm cursor-pointer font-bold"
          onClick={handleFollowUser}
        >
          Follow
        </p>
      ) : (
        <p className="text-gray-500 ml-25 text-sm cursor-pointer font-semibold">
          Following
        </p>
      )}
    </div>
  );
};

export default SuggestionsUserCard;
