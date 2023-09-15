import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate, useParams } from "react-router-dom";
  import { createComment } from "../../Redux/Comment/Action"; // Import your action creator
  import { findPostByIdAction } from "../../Redux/Post/Action";
  import { BsEmojiSmile } from "react-icons/bs";
  import Picker from "@emoji-mart/react";
  import CommentCard from "../Comment/CommentCard";
  
  const BookMarkPostDisplay = ({ isOpen, onClose, postData }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { post, comments } = useSelector((store) => store);
    const [commentContent, setCommentContent] = useState("");
    // const { postId } = useParams();
    const navigate = useNavigate();
    const [postId , setPostId] = useState();
    
    useEffect(() => {
      dispatch(findPostByIdAction({ jwt, postId: postData.id }));
    }, [postId, comments?.createdComment]);
  
    const addEmoji = (emoji) => {
      setCommentContent(commentContent + emoji.native);
    };
  
    const handleAddComment = () => {
      // Check if commentContent is not empty before dispatching
      if (commentContent.trim() !== "") {
        const data = {
          jwt,
          postId: postData.id,
          data: {
            content: commentContent,
          },
        };
        dispatch(createComment(data)); // Dispatch your createComment action
        setCommentContent("");
      }
    };
  
    const handleCommnetInputChange = (e) => {
      setCommentContent(e.target.value);
    };
  
    const handleOnEnterPress = (e) => {
      if (e.key === "Enter") {
        handleAddComment();
      }
    };
  
    const handleClose = () => {
      onClose();
      //navigate("/home");
    };
  
    const [showEmoji, setShowEmoji] = useState(false);
  
    return (
      <div>
        <Modal size={"3xl"} onClose={handleClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <div className="flex h-[75vh] ">
                <div className="w-[40%] flex flex-col justify-center">
                  <img
                    className="max-h-[300px] max-w-[300px]"
                    src={post.singlePost?.image || postData.image}
                    alt=""
                  />
                </div>
                <div className="w-[55%] pl-10 relative">
                  <div className="reqUser flex justify-between items-center ">
                    <div className="flex items-center">
                      <div className="">
                        <img
                          className="w-9 h-9 rounded-full"
                          src={
                             postData.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p>{post?.singlePost?.user?.name || postData?.user?.name}</p>
                        <p>{post?.singlePost?.user?.username || postData?.user?.username}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
  
                  <div className="comments ">
                  {(
    (post?.singlePost?.comments?.length > 0 &&
      post?.singlePost?.comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))) ||
    (postData?.comments?.length > 0 &&
      postData?.comments.map((content, index) => (
        <CommentCard key={index} comment={content} />
      )))
  )}
  
                  </div>
  
                  <div className=" absolute bottom-0 w-[90%]">
                    <div className=" w-full flex items-center px-3 ">
                      <span
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="absolute left-2 top-2 cursor-pointer"
                      >
                        <BsEmojiSmile size={15} />
                      </span>
  
                      {showEmoji && (
                        <div className="absolute right-0 bottom-1 ">
                          <Picker
                            emojiSize={20}
                            emojiButtonSize={30}
                            onEmojiSelect={addEmoji}
                            maxFrequentRows={0}
                            perLine={10}
                          />
                        </div>
                      )}
                      <input
                        onKeyPress={handleOnEnterPress}
                        className="commentInput w-[70%]"
                        placeholder="    Add Comment..."
                        type="text"
                        onChange={handleCommnetInputChange}
                        value={commentContent}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  
  export default BookMarkPostDisplay;
  