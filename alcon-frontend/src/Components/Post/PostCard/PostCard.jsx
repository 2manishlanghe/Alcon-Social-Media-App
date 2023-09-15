import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsDot,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditPostMenu from "../PostCard/EditPostMenu";
import { GoLocation } from "react-icons/go";
import {
  isPostLikedByUser,
  isReqUserPost,
  isSavedPost,
} from "../../../Config/Logic";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { createComment } from "../../../Redux/Comment/Action";
import {
  deletePostAction,
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../../Redux/Post/Action";
import CommentModal from "../../Comment/CommentModal";
import "./PostCard.css";

const PostCard = ({
  userProfileImage,
  username,
  location,
  caption,
  postImage,
  createdAt,
  post,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCommnetInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const [commentContent, setCommentContent] = useState("");

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const [numberOfLikes, setNumberOfLike] = useState(0);

  const data = {
    jwt: token,
    postId: post.id,
  };

  const handleAddComment = (comments) => {
    //console.log("comment",comments);
    const da = {
      jwt: token,
      postId: post.id,
      data: {
        content: comments,
      },
    };
    //console.log("comment content ", commentContent);
    dispatch(createComment(da));
    setCommentContent("");
  };

  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment(e.target.value);
    } else if (e.key === "Backspace") {
      setSelectedEmoji(); // Clear the selected emoji when the backspace key is pressed
    }
  };

  // const handleOnEnterPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleAddComment();

  //   } else return;
  // };

  const handleLikePost = () => {
    dispatch(likePostAction(data));
    setIsPostLiked(true);
    setNumberOfLike(numberOfLikes + 1);
  };

  const handleUnLikePost = () => {
    dispatch(unLikePostAction(data));
    setIsPostLiked(false);
    setNumberOfLike(numberOfLikes - 1);
  };

  const handleSavePost = (postId) => {
    dispatch(savePostAction(data));
    setIsSaved(true);
  };

  const handleUnSavePost = () => {
    dispatch(unSavePostAction(data));
    setIsSaved(false);
  };

  const handleNavigate = (username) => {
    navigate(`/${username}`);
  };

  const [showEmoji, setShowEmoji] = useState(false);

  const addEmoji = (emoji) => {
    setSelectedEmoji(emoji.native);
    setCommentContent(commentContent + emoji.native); // Append the selected emoji to the comment content
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length);
  }, [user.reqUser, post]);

  useEffect(() => {
    // Update the commentContent state when the postData prop changes
    setCommentContent(post?.content || "");
  }, [post]);

  const handleOpenCommentModal = () => {
    navigate(`/p/${post.id}`);
    onOpen();
  };

  const handleDeletePost = (postId) => {
    const data = {
      jwt: token,
      postId,
    };
    dispatch(deletePostAction(data));
  };
  //console.log("comment content ", commentContent);

  const isOwnPost = isReqUserPost(post, user.reqUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddComment();
  };

  return (
    <div>
      <div className="flex flex-col items-center w-full border bg-white rounded-md">
        <div className="flex justify-between items-center w-full py-4 px-3">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full"
              src={user.reqUser?.image}
              alt=""
            />
            <div className="pl-2">
              <p className="font-semibold text-sm flex items-center">
                <span
                  onClick={() => handleNavigate(username)}
                  className="cursor-pointer"
                >
                  {username}
                </span>
                <span className="flex items-center text-gray-500 italic">
                  {" "}
                  <BsDot />
                  {createdAt}
                </span>{" "}
              </p>
              <p className="font-thin text-sm flex">
                <GoLocation />
                {location}
              </p>
              <p className="font-thin text-sm">Caption: {caption} </p>
            </div>
          </div>
          <div>
            <div className="dropdown">
              <EditPostMenu post={post} />
            </div>
          </div>
        </div>
        <div className="w-full">
          <img className="w-full" src={postImage} alt="" />
        </div>
        <div className="flex justify-between items-center w-full px-3 py-2">
          <div className="flex items-center space-x-2 ">
            {isPostLiked ? (
              <AiFillHeart
                onClick={handleUnLikePost}
                className="text-2xl hover:opacity-50 cursor-pointer text-red-600"
              />
            ) : (
              <AiOutlineHeart
                onClick={handleLikePost}
                className="text-2xl hover:opacity-50 cursor-pointer "
              />
            )}
            <FaRegComment
              onClick={handleOpenCommentModal}
              className="text-xl hover:opacity-50 cursor-pointer"
            />
            {/* <RiSendPlaneLine className="text-xl hover:opacity-50 cursor-pointer" /> */}
          </div>
          <div className="cursor-pointer">
            {isSaved ? (
              <BsBookmarkFill
                onClick={() => handleUnSavePost(post.id)}
                className="text-xl"
              />
            ) : (
              <BsBookmark
                onClick={() => handleSavePost(post.id)}
                className="text-xl hover:opacity-50 cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="w-full py-1 px-3">
          {numberOfLikes > 0 && (
            <p className="text-sm">{numberOfLikes} likes </p>
          )}
          {post?.comments?.length > 0 && (
            <p
              onClick={handleOpenCommentModal}
              className="opacity-50 text-sm py-2 -z-0 cursor-pointer"
            >
              View all {post?.comments?.length} comments
            </p>
          )}
        </div>
        <div className="border border-t w-full relative">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex items-center px-3">
              <input
                onKeyPress={handleOnEnterPress}
                onChange={handleCommnetInputChange}
                className="commentInput"
                type="text"
                placeholder="Add a comment..."
                value={commentContent}
              />
              <span
                onClick={() => setShowEmoji(!showEmoji)}
                className="absolute left-2 top-2 cursor-pointer"
              >
                <BsEmojiSmile size={16} />
              </span>

              {showEmoji && (
                <div className="absolute right-0 bottom-1">
                  <Picker
                    emojiSize={20}
                    emojiButtonSize={40}
                    onEmojiSelect={addEmoji}
                    maxFrequentRows={0}
                    perLine={10}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <CommentModal
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleUnSavePost={handleUnSavePost}
        handleUnLikePost={handleUnLikePost}
        isPostLiked={isPostLiked}
        isSaved={isSaved}
        postData={post}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
};

export default PostCard;
