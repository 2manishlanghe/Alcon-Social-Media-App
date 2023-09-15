import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Button,
  Stack,
  Flex,
} from "@chakra-ui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deletePostAction } from "../../../Redux/Post/Action";
import CreatePostModal from "../Create/CreatePostModal.jsx";
import { useEffect, useState } from "react";

const EditPostMenu = ({ post }) => {
  const [showEditModel, setEditShowModel] = useState(false);
  const [postData, setPostData] = useState(null);
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const { editedPost } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    if (editedPost) {
    }
  }, [editedPost]);

  const handleDeletePost = () => {
    const data = {
      jwt: token,
      postId: post.id,
    };
    console.log("EditPostMenu", post);
    dispatch(deletePostAction(data));
  };

  const handleEditPost = () => {
    const updatedPostData = {
      jwt: token,
      post: {
        ...post,
        caption: post.caption,
        location: post.location,
      },
    };

    setEditShowModel(true);
    setPostData(updatedPostData);
  };

  return (
    <Flex justifyContent="center" mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="More server options"
            icon={<BsThreeDotsVertical />}
            variant="solid"
            w="fit-content"
          />
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button
                onClick={handleEditPost}
                w="194px"
                variant="ghost"
                rightIcon={<BiEdit />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
              >
                Edit
              </Button>
              <Button
                onClick={handleDeletePost}
                w="194px"
                variant="ghost"
                rightIcon={<RiDeleteBin6Line />}
                justifyContent="space-between"
                fontWeight="normal"
                colorScheme="red"
                fontSize="sm"
              >
                Delete
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <CreatePostModal
        isOpen={showEditModel}
        isEdit={showEditModel}
        post={postData}
        onClose={() => {
          setEditShowModel(false);
          setPostData(null);
        }}
      />
    </Flex>
  );
};
export default EditPostMenu;
