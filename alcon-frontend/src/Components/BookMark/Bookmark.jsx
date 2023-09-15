import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findUserPost } from "../../Redux/Post/Action";
import { getUserProfileAction } from "../../Redux/User/Action";
import ReqUserPostCard from "../ProfilePageCard/ReqUserPostCard";
import { reqUserPostAction } from "../../Redux/Post/Action";
import CommentModal from "../Comment/CommentModal";
import { useNavigate } from "react-router-dom";

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react"; // Import Chakra UI Modal components
import BookMarkPostDisplay from "./BookMarkPostDisplay";


const Bookmark = () => {
  const dispatch = useDispatch();
  const [userIds, setUserIds] = useState([]);
  const token = localStorage.getItem("token");
  const reqUser = useSelector((store) => store.user.reqUser);
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id);
      setUserIds([reqUser?.id, ...newIds]);
    }
  }, [reqUser]);

  useEffect(() => {
    setUserIds([reqUser?.id]);
  }, [reqUser?.id]);

  useEffect(() => {
    const data = {
      userId: userIds.join(","),
      jwt: token,
    };
   
    if (userIds.length > 0) {
      dispatch(reqUserPostAction(data));
    }
  }, [userIds, token]);

  useEffect(() => {
    if (reqUser && reqUser.savedPost?.length === 0) {
      dispatch(findUserPost(reqUser?.id));
    }
  }, [reqUser?.id, dispatch]);

  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    console.warn("before open comment model....." , post);
    onOpen();
  };
  

  return (
    <div className="mt-20 pt-10 flex flex-wrap">
      {reqUser && reqUser.savedPost?.length > 0 ? (
        reqUser.savedPost.map((item, index) => (
          <div key={index} onClick={() => handleOpenCommentModal(item)}>
            <ReqUserPostCard post={item} />
          </div>
        ))
      ) : (
        <p className="text-center w-100 mt-20 text-5xl text-gray-300">
          Please save a post.
        </p>
      )}



      {isOpen && selectedPost && (
        <BookMarkPostDisplay
        postData={selectedPost} // Pass the selected post as postData
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
        />
      )}
    </div>

    
  );
};

export default Bookmark;
