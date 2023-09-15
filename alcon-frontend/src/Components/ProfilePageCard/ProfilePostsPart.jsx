import React, { useEffect, useState } from "react";
import { BsBookmark } from "react-icons/bs";
import { GrTable } from "react-icons/gr";
import { RiVideoFill, RiVideoLine } from "react-icons/ri";
import { BiBookmark, BiUserPin } from "react-icons/bi";
import { AiOutlineTable, AiOutlineUser } from "react-icons/ai";
import ReqUserPostCard from "./ReqUserPostCard";
import { useDispatch, useSelector } from "react-redux";
import { reqUserPostAction, savePostAction } from "../../Redux/Post/Action";
import PostCard from "../Post/PostCard/PostCard";
import { useDisclosure } from "@chakra-ui/react";
import CommentModal from "../Comment/CommentModal";
import PostDisplay from "../Post/PostCard/PostDisplay";
import { isReqUser } from "../../Config/Logic";

const ProfilePostsPart = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Post");
  const { post } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const isRequser = isReqUser(user?.reqUser?.id, user?.findByUsername?.id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const tabs = [
  //   {
  //     tab: "Post",
  //     icon: <AiOutlineTable className="text-xs" />,
  //     activeTab: "",
  //   },

  //   {
  //     tab: "Saved",
  //     icon: <BiBookmark className="text-xs" />,
  //     activeTab: "",
  //     hideForRequestedUser: isRequser,
  //   },
  // ];

  useEffect(() => {
    const data = {
      jwt: token,
      userId: user?.id,
    };
    dispatch(reqUserPostAction(data));
  }, [user, post.createdPost]);

  const [selectedPost, setSelectedPost] = useState();

  const handleOpenPostCard = (post) => {
    setSelectedPost(post);
    console.log("post data....", post);
    onOpen();
  };

  return (
    <div className="">
      <div>
        <hr />
        <div className="flex font-bold">
          <AiOutlineTable className="text-base ml-80 mt-0" />

          <p className="ml-2">POSTS</p>
        </div>
        <div className="flex flex-wrap ">
          {post.reqUserPost?.length > 0 ? (
            post.reqUserPost.map((item, index) => (
              <div key={index} onClick={() => handleOpenPostCard(item)}>
                <ReqUserPostCard post={item} />
              </div>
            ))
          ) : (
            <p className="text-center w-100 mt-20 text-5xl text-gray-300">
              Please upload a new post.
            </p>
          )}
          {isOpen && selectedPost && (
            <PostDisplay
              postData={selectedPost} // Pass the selected post as postData
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePostsPart;
