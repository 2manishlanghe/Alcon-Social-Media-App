import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import React, { useEffect, useState, useRef } from "react";
import {
  HStack,
  MenuButton,
  MenuList,
  Box,
  Menu,
  MenuItem,
} from "@chakra-ui/react";

import { FiChevronDown } from "react-icons/fi";
import { FaPhotoVideo, FaTimes } from "react-icons/fa";
import "./CreatePostModal.css";
import { GoLocation } from "react-icons/go";
import { IoMdHappy } from "react-icons/io";

import { GrEmoji } from "react-icons/gr";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPost, editPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import CommentModal from "../../Comment/CommentModal";
import { CloseButton, Heading } from "@chakra-ui/react";
import { BsEmojiSmile } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import InputEmoji from "react-input-emoji";

const CreatePostModal = ({
  onOpen,
  isOpen,
  onClose,
  isEdit = false,
  post = null,
}) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };
  const handleDocumentClick = (event) => {
    const emojiPicker = document.querySelector(".emoji-picker"); // Replace with the appropriate selector for your emoji picker container

    // Check if the click target is not within the emoji picker
    if (emojiPicker && !emojiPicker.contains(event.target)) {
      // Emoji picker is open and the click was outside of it, so close it
      setShowEmoji(false);
    }
  };

  useEffect(() => {
    if (showEmoji) {
      // Add the click event listener to the document
      document.addEventListener("click", handleDocumentClick);
    } else {
      // Remove the click event listener when the emoji picker is closed
      document.removeEventListener("click", handleDocumentClick);
    }

    // Clean up by removing the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showEmoji]); // Listen for changes to the showEmoji sta

  const addEmoji = (emoji) => {
    setText(text + emoji.native); // Append the selected emoji to the existing text
  };
  const finalRef = React.useRef(null);

  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    postData.caption = text;
  }, [text]);

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);

  const [postData, setPostData] = useState({
    image: "",
    caption: "",
    location: "",
    selectedOption: "public",
  });

  // ADD location started

  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSelect = (place) => {
    setSelectedPlace(place);
    const location = place?.label;
    console.log("Location", location);
    setPostData((prevValues) => ({ ...prevValues, location }));
  };
  const handleNewSearch = (value) => {
    if (!value) {
      setSelectedPlace(null);
    }
  };
  useEffect(() => {
    if (post) {
      if (post.post) {
        setPostData({
          ...postData,
          caption: post?.post?.caption ? post?.post?.caption : "",
          location: post?.post?.location ? post?.post?.location : "",
          visibility: post?.post?.visibility ? post?.post?.visibility : "",
        });
      }
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setText(e.target.value);
    setPostData((prevValues) => ({ ...prevValues, [name]: value }));
    console.log(value);
  };

  useEffect(() => {
    console.log("files", file);
  }, [file]);

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }

  function handleDragLeave(event) {
    setIsDragOver(false);
  }

  const handleOnChange = async (e) => {
    console.log(e.target.value);

    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      const url = await uploadToCloudinary(file);
      setPostData((prevValues) => ({ ...prevValues, image: url }));
    } else {
      setFile(null);
      alert("Please select an image.");
    }
  };

  const handleSubmit = async () => {
    handleNewSearch();
    const data = {
      jwt: token,
      data: postData,
    };
    if (token) {
      dispatch(createPost(data));
      onClose();
      setPostData({
        ...postData,
        image: "",
        caption: "",
        location: "",
      });
    }
    console.log("data --- ", data);
    console.log("emoji", text);
  };
  const handleEditPost = async () => {
    const data = {
      jwt: token,
      data: {
        ...post.post,
        ...postData,
      },
    };
    if (token) {
      await dispatch(editPost(data));
      onClose();
    }
  };

  const handleClick = () => {
    if (isEdit) {
      handleEditPost();
    } else {
      handleSubmit();
    }
  };

  const [selectedOption, setSelectedOption] = useState("Public");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const visibility = option;
    setPostData((prevValues) => ({ ...prevValues, visibility }));
  };

  return (
    <div>
      <Modal
        size={"4xl"}
        className=""
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setFile(null);
          setIsDragOver(false);
        }}
      >
        <ModalOverlay />
        <ModalContent fontSize={"sm"}>
          <div className="flex justify-between py-4 px-10 items-center">
            <Heading size={"sm"}>
              {isEdit ? "Edit Post" : "Create New Post"}{" "}
            </Heading>
            <ModalCloseButton />
            <div className="flex justify-between py-1 px-10 items-center">
              <Button
                className="inline-flex"
                colorScheme="blue"
                onClick={handleClick}
                size={"sm"}
                variant="ghost"
              ></Button>
              {/* <FaTimes /> */}
            </div>

            <hr className="hrLine" />
          </div>
          <ModalBody>
            <div className="modalBodyBox flex h-[60vh] justify-between">
              <div className="w-[50%]">
                {isEdit ? (
                  <img src={postData.image} alt=""></img>
                ) : (
                  !file && (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`drag-drop h-full`}
                    >
                      <div className="flex justify-center flex-col items-center">
                        <FaPhotoVideo
                          className={`text-3xl ${
                            isDragOver ? "text-blue-800" : ""
                          }`}
                        />
                        <p>Drag photos here </p>
                      </div>

                      <label for="file-upload" className="custom-file-upload">
                        Select from computer
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/* video/*"
                        multiple
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  )
                )}
                {file && (
                  <img
                    className=""
                    src={URL.createObjectURL(file)}
                    alt="dropped-img"
                  />
                )}
              </div>
              <div className="w-[1px] border h-full"></div>
              <div className="w-[50%]">
                <div className="flex items-center px-2">
                  <img
                    className="w-7 h-7 rounded-full"
                    src={
                      user?.reqUser?.image ||
                      "https://cdn.pixabay.com/photo/2023/02/28/03/42/ibex-7819817_640.jpg"
                    }
                    alt=""
                  />{" "}
                  <p className="font-semibold ml-4">
                    {user?.reqUser?.username}
                  </p>
                </div>
                <div className="px-2">
                  <div className="relative">
                    <textarea
                      className="captionInput form-control form-control-solid"
                      placeholder="Write a caption..."
                      name="caption"
                      rows="5"
                      value={postData.caption}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={toggleEmojiPicker}
                      // onClick={() => setShowEmoji(!showEmoji)}
                      className="absolute right-2 top-2 cursor-pointer"
                    >
                      <BsEmojiSmile size={24} />
                    </span>

                    {showEmoji && (
                      <div className="absolute right-2 top-10  ">
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
                </div>

                <hr />
                <div className="p-2">
                  <GooglePlacesAutocomplete
                    selectProps={{
                      value: selectedPlace,
                      onChange: handleSelect,
                      placeholder: "Add Location..",
                      name: "location",
                    }}
                  />
                </div>
                <hr />
                <div>
                  <Menu>
                    <MenuButton
                      transition="all 0.3s"
                      _focus={{ boxShadow: "none" }}
                    >
                      <b> Post-Privacy:</b> {selectedOption}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleOptionClick("Public")}>
                        Public
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionClick("Only-me")}>
                        Only-me
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionClick("To-friends")}>
                        To-friends
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
            </div>
            <div className="float-right">
              <Button onClick={handleClick} colorScheme="blue" size={"sm"}>
                {isEdit ? "Update" : "Share"}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default CreatePostModal;
