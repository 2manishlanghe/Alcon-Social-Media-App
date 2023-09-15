import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineCloudUpload, AiFillDelete } from "react-icons/ai";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function ChangeProfilePhotoModal({
  img,
  isOpen,
  onOpen,
  onClose,
  handleProfileImageChange,
  handleRemoveProfileImage,
}) {
  const [imageFile, setImageFile] = useState(img);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useSelector((store) => store);
  const [imagePreview, setImagePreview] = useState(null);
  const toast = useToast();
  useEffect(() => {
    if (user && user.reqUser && user.reqUser.image) {
      const userProfile = user.reqUser.image;
      setImageFile(userProfile);
    }
  }, [user]);

  console.log("profile URL", imageFile); // Add this line

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Upload Profile Picture</ModalHeader>

        <IconButton
          icon={<ImCancelCircle />}
          aria-label="Close"
          position="absolute"
          top="1rem"
          right="1rem"
          onClick={onClose}
        />

        <ModalBody>
          <div className="flex flex-col items-center">
            <div className="w-80 h-80 rounded-full rounded-full overflow-hidden border border-gray-400 flex-shrink-0 mb-4">
              <img
                className="w-80 h-80 rounded-full"
                src={
                  user.reqUser?.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt=""
              />
            </div>

            <input
              onChange={(event) => {
                const selectedFile = event.target.files[0];
                if (selectedFile) {
                  if (selectedFile.size > 500 * 1024) {
                    toast({
                      title: "Image size exceeds 500KB",
                      status: "error",

                      duration: 2000,
                      isClosable: true,
                      position: "top-right",
                      variant: "left-accent",
                    });
                  } else {
                    setImageFile(selectedFile);
                    handleProfileImageChange(event); // Call the callback to handle image change
                    toast({
                      title: "User profile updated.",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                      position: "top-right",
                      variant: "left-accent",
                    });
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(selectedFile);
                  }
                }
              }}
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/png, image/gif, image/jpeg"
              className="w-8 h-8 border border-gray-400 rounded-full cursor-pointer mb-4"
            />
          </div>
        </ModalBody>

        <div className="flex justify-center pb-4">
          <label
            htmlFor="profileImage"
            className="cursor-pointer font-bold py-2 px-4 text-green-600 border border-red-600 rounded-full flex items-center justify-center mr-2"
          >
            <AiOutlineCloudUpload className="mr-1" />
            Upload
          </label>
          <button
            onClick={handleRemoveProfileImage}
            className="font-bold py-2 px-4 text-red-600 border border-red-600 rounded-full flex items-center justify-center mr-2"
          >
            <AiFillDelete className="mr-1" />
            Remove
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default ChangeProfilePhotoModal;
