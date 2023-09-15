import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import { suggetions, timeDifference } from "../../Config/Logic";
import { findUserPost } from "../../Redux/Post/Action";
import {
  findByUserIdsAction,
  getUserProfileAction,
} from "../../Redux/User/Action";
import "./HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const [userIds, setUserIds] = useState([]);
  const token = localStorage.getItem("token");
  const reqUser = useSelector((store) => store.user.reqUser);
  const { post } = useSelector((store) => store); // Only accessing the 'post' state
  const [suggestedUser, setSuggestedUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id);
      setUserIds([reqUser?.id, ...newIds]);
      setSuggestedUser(suggetions(reqUser));
    }
  }, [reqUser]);

  useEffect(() => {
    const data = {
      userIds: userIds.join(","), // Removed [userIds] to properly join the array
      jwt: token,
    };

    if (userIds.length > 0) {
      dispatch(findUserPost(data));
      dispatch(findByUserIdsAction(data));
    }
  }, [userIds, post.createdPost, post.deletedPost]);

  // Make sure 'post.userPost' is an array before sorting
  const sortedPosts = Array.isArray(post.userPost)
    ? [...post.userPost]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .reverse()
    : [];

  return (
    <div className="">
      <div className="flex w-[100%] justify-center mt-[8%]">
        <div className="flex flex-col w-[60%] px-10 items-center">
          <div className="space-y-10 postsBox w-full">
            {sortedPosts.length > 0 &&
              sortedPosts.map((item) => (
                <PostCard
                  userProfileImage={
                    item.user.userImage
                      ? item.user.userImage
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  username={item?.user?.username}
                  location={item?.location}
                  caption={item?.caption}
                  postImage={item?.image}
                  createdAt={timeDifference(item?.createdAt)}
                  postId={item?.id}
                  post={item}
                />
              ))}
          </div>
        </div>
        <div className="w-[30%]">
          <HomeRight suggestedUser={suggestedUser} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
