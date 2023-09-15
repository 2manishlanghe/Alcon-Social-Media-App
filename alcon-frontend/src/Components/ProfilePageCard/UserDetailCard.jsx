// import React, { useEffect, useState } from "react";
// import { TbCircleDashed } from "react-icons/tb";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { followUserAction, unFollowUserAction } from "../../Redux/User/Action";
// // import { isReqUser } from '../../Config/Logic'

// const UserDetailCard = ({ user, isRequser, isFollowing }) => {

//   const token = localStorage.getItem("token");
//   const { post } = useSelector((store) => store);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isFollow,setIsFollow]=useState(false);

//   const goToAccountEdit = () => {
//     navigate("/account/edit");
//   };

//   console.log("user --- ", user);

//   const data = {
//     jwt: token,
//     userId: user?.id,
//   };

//   const handleFollowUser = () => {
//     dispatch(followUserAction(data));
//     console.log("follow");
//     setIsFollow(true)
//   };

//   const handleUnFollowUser = () => {
//     dispatch(unFollowUserAction(data));
//   };

//   useEffect(()=>{
// setIsFollow(isFollowing)
//   },[isFollowing])

//   return (
//     <div className="py-10">
//       <div className="flex items-center">
//         <div className="w-[15%]">
//            <img
//           className="w-32 h-32 rounded-full"
//           src={
//             user?.image ||
//             "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//           }
//           alt=""
//         />
//         </div>

//         <div className="ml-10 space-y-5 text-xs">
//           <div className=" flex space-x-10 items-center">
//             <p className="text-base">{user?.username}</p>
//             <button className="text-xs py-1 bg-green-300  px-5 bg-slate-100 rounded-md font-semibold">
//               {isRequser ? (
//                 <span className="" onClick={goToAccountEdit}>Edit profile</span>
//               ) : isFollow ? (
//                 <span onClick={handleUnFollowUser} className="text-primary">Unfollow </span>
//               ) : (
//                 <span onClick={handleFollowUser}>Follow</span>
//               )}
//             </button>
//             {/* <button className="text-xs py-1 px-5 bg-slate-100 hover:bg-slate-300 rounded-md font-semibold">
//               {isRequser ? "Add tools" : "Message"}
//             </button>
//             <TbCircleDashed className="text-xl" /> */}
//           </div>

//           <div className="flex space-x-10">
//             <div>
//               <span className="font-semibold mr-2">
//                 {post?.reqUserPost?.length || 0}
//               </span>
//               <span>posts</span>
//             </div>

//             <div>
//               <span className="font-semibold mr-2">
//                 {user?.follower?.length}
//               </span>
//               <span>followers</span>
//             </div>
//             <div>
//               <span className="font-semibold mr-2">
//                 {user?.following?.length}
//               </span>
//               <span>following</span>
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold">{user?.name}</p>
//             <p className="font-thin text-sm">{user?.bio}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetailCard;

import React, { useEffect, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followUserAction, unFollowUserAction } from "../../Redux/User/Action";

const UserDetailCard = ({ user, isRequser, isFollowing }) => {
  const token = localStorage.getItem("token");
  const { post } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollow, setIsFollow] = useState(isFollowing); // Initialize isFollow state with the isFollowing prop.

  const goToAccountEdit = () => {
    navigate("/account/edit");
  };

  const data = {
    jwt: token,
    userId: user?.id,
  };

  const toggleFollowUser = () => {
    if (isFollow) {
      // If already following, unfollow.
      dispatch(unFollowUserAction(data));
      setIsFollow(false); // Update the state to reflect the change.
    } else {
      // If not following, follow.
      dispatch(followUserAction(data));
      setIsFollow(true); // Update the state to reflect the change.
    }
  };

  return (
    <div className="py-10">
      <div className="flex items-center">
        <div className="w-[15%]">
          <img
            className="w-32 h-32 rounded-full"
            src={
              user?.image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
          />
        </div>

        <div className="ml-10 space-y-5 text-xs">
          <div className=" flex space-x-5  items-center">
            <p className="text-base text-xl font-semibold">{user?.username}</p>
            <button
              className="text-md text-white font-bold py-2 bg-blue-600  px-4 rounded-md "
              onClick={isRequser ? goToAccountEdit : toggleFollowUser} // Use the toggleFollowUser function.
            >
              {isRequser ? (
                <span className="text-md font-bold">Edit profile</span>
              ) : isFollow ? (
                <span className="text-white bg-blue-400">Unfollow</span>
              ) : (
                <span>Follow</span>
              )}
            </button>
          </div>

          <div className="flex space-x-8">
            <div>
              <span className="font-bold text-lg mr-2">
                {post?.reqUserPost?.length || 0}
              </span>
              <span className="text-base">posts</span>
            </div>

            <div>
              <span className="font-bold text-lg mr-2">
                {user?.follower?.length}
              </span>
              <span className="text-base">followers</span>
            </div>
            <div>
              <span className="font-bold text-lg mr-2">
                {user?.following?.length}
              </span>
              <span className="text-base">following</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-md">{user?.name}</p>
            <p className="font-thin text-md">{user?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;
