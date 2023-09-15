import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfileAction } from "../../Redux/User/Action";
import ReqUserPostCard from "../ProfilePageCard/ReqUserPostCard";
import CommentModal from "../Comment/CommentModal";
import { searchHashtagPostAction } from "../../Redux/Post/Action";
import HashtagPostCard from "./HashtagPostCard";
import { useParams } from 'react-router-dom';

const HashtagPosts = () => {
  const dispatch = useDispatch();
  const [userIds, setUserIds] = useState([]);
  const token = localStorage.getItem("token");
  const reqUser = useSelector((store) => store.user.reqUser);
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hashtagPosts = useSelector((store) => store);
  const { hashtag } = useParams();
//   useEffect(() => {
//     dispatch(getUserProfileAction(token));
//   }, [token]);

//   useEffect(() => {
//     if (reqUser) {
//       const newIds = reqUser?.following?.map((user) => user.id);
//       setUserIds([reqUser?.id, ...newIds]);
//     }
//   }, [reqUser]);

  useEffect(() => {
    const data = {
      hashtag: hashtag,
      jwt: token,
    };
    console.log("Data",data.jwt);
    dispatch(searchHashtagPostAction(data));
  }, [hashtag, token]);

  console.log("HashatgPosts" , hashtagPosts.post.searchHashtagPost);

  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    onOpen();
  };

  return (
    <div className="mt-20 pt-10 flex flex-wrap">
      {hashtagPosts.post.searchHashtagPost && hashtagPosts.post.searchHashtagPost.length > 0 ? (
        hashtagPosts.post.searchHashtagPost.map((item, index) => (
          <div key={index} onClick={() => handleOpenCommentModal(item)} className="hash-tag-post-card">
            <HashtagPostCard post={item} />
          </div>
        ))
      ) : (
        <p className="text-center w-100 mt-20 text-5xl text-gray-300">
          No posts found for this hashtag.
        </p>
      )}
      {/* {isOpen && selectedPost && (
        <CommentModal
          postData={selectedPost}
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
        />
      )} */}
    </div>
  );
};

export default HashtagPosts;
