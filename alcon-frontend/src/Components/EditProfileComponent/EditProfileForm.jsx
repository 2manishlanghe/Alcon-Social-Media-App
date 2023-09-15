
import { useDispatch, useSelector } from "react-redux";

import { useToast } from "@chakra-ui/react";
import ChangeProfilePhotoModal from "./ChangeProfilePhotoModal";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";
import * as Yup from "yup"; // Import Yup for validation

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useDisclosure,InputLeftAddon,
  InputGroup,
  Tooltip,
  Box,
  Tag,
  HStack,
  VStack,
  Wrap,
  WrapItem,
  position,
} from "@chakra-ui/react";

import { FormHelperText } from '@mui/material';

// Define the validation schema using Yup


  

import { Select } from "@chakra-ui/react";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import {
  editUserDetailsAction,
  getUserProfileAction,
  removeProfilePicture,
} from "../../Redux/User/Action";

import { BsInfoLg } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const EditProfileForm = () => {
  const { user } = useSelector((store) => store);
  const toast = useToast();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    mobile: "",
    gender: "",
    website: "",
    private: false,
  });

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(`/${user.reqUser?.username}`);
  };

  useEffect(() => {
    const newValue = {};

    for (let item in initialValues) {
      if (user.reqUser && user.reqUser[item]) {
        newValue[item] = user.reqUser[item];
      }
    }

    formik.setValues(newValue);
  }, [user.reqUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: (values) => {
      const data = {
        jwt: token,
        data: { ...values, id: user.reqUser?.id },
      };
      dispatch(editUserDetailsAction(data));
    },
  });

  useEffect(() => {
    if (user.updatedUser) {
      if (user.updatedUser.message === "Username already taken. Cannot update details.") {
        toast({
          title: "Username already exists",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: 'top-right',
          variant: 'left-accent'

        });
      }
      else {
        toast({
          title: "Account updated...",

          status: "success",
          duration: 2000,
          isClosable: true,
          position: 'top-right',
          variant: 'left-accent'
        });
      }
    }
  }, [user.updatedUser]);
  // Function to handle profile image change
  async function handleProfileImageChange(event) {
    const selectedFile = event.target.files[0];
    const image = await uploadToCloudinary(selectedFile);
    console.log("Img Size", image.size);
    setImageFile(image);

    const data = {
      jwt: token,
      data: { image, id: user.reqUser?.id },
    };
    dispatch(editUserDetailsAction(data));
    onClose();
  }

  async function handleRemoveProfileImage(event) {
    setImageFile(null);
    const data = {
      jwt: token,
      data: { id: user.reqUser?.id },
    };
    dispatch(removeProfilePicture(data));
    onClose();
  }

  return (
    <div className="border rounded-md p-10 mt-4 bg-white">
      <div className="flex pb-7 ml-20">
        <AiOutlineArrowLeft
          onClick={handleBackButton}
          className="font-bold text-2xl  mr-5 cursor-pointer"
        />
        <h4>Edit Profile</h4>
      </div>

      <div className="flex pb-7 mt-4 ml-20">
        <div className="w-[15%]">
          <img
            className="w-12 h-12 rounded-full"
            src={
              imageFile ||
              user.reqUser?.image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
          />
        </div>

        <div>
          <p>{user.reqUser?.username}</p>
          <p
            onClick={onOpen}
            className="font-bold text-blue-500 cursor-pointer"
          >
            Change Profile Photo
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="6">
          {/* Name Field */}
          <FormControl className="flex ml-20" id="name">
            <FormLabel className="w-[15%]  ">
              Name <span className="font-bold text-red-600">*</span>
            </FormLabel>
            <div>
              <Input
                placeholder="Name"
                width={60}
                type="text"
                {...formik.getFieldProps("name")}
              />
            </div>

            <div>
              <BsInfoLg
                data-te-toggle="tooltip"
                title="Enter your full name."
              />
            </div>
          </FormControl>
          <FormControl className="flex  ml-20" id="username">
            <FormLabel className="w-[15%]">
              Username <span className="font-bold text-red-600">*</span>
            </FormLabel>
            <div>
              <Input
                placeholder="Username"
                width={60}
                type="text"
                {...formik.getFieldProps("username")}
              />
            </div>
            <BsInfoLg
              data-te-toggle="tooltip"
              title="Enter Username with atleast 6 characters."
            />
          </FormControl>
          <FormControl className="flex  ml-20" id="website">
            <FormLabel className="w-[15%]">
              Website <sup className="font-light text-gray-500">(optional)</sup>
            </FormLabel>
            <div>
              <Input
                placeholder="Website"
                width={60}
                type="text"
                {...formik.getFieldProps("website")}
              />
            </div>
            <BsInfoLg
              data-te-toggle="tooltip"
              title="Enter domain of your Website"
            />
          </FormControl>

          <FormControl className="flex ml-20" id="bio">
            <FormLabel className="w-[15%]">
              Bio <sup className="font-light">(optional)</sup>
            </FormLabel>
            <div className="w-50 relative">
              <Textarea
                placeholder="Bio"
                width={60}
                rows={2}
                {...formik.getFieldProps("bio")}
                onBlur={formik.handleBlur("bio")}
              />
              {/* Include validation for Bio */}
              {formik.touched.bio && formik.errors.bio && (
                <FormHelperText color="red">{formik.errors.bio}</FormHelperText>
              )}
            </div>
          </FormControl>
          <FormControl className="flex  ml-20" id="email">
            <FormLabel className="w-[15%]">
              Email address <span className="font-bold text-red-600">*</span>
            </FormLabel>
            <div>
              <Input
                placeholder="Email"
                width={60}
                type="email"
                readOnly
                {...formik.getFieldProps("email")}
                onBlur={formik.handleBlur("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <FormHelperText color="red">
                  {formik.errors.email}
                </FormHelperText>
              )}
            </div>
            <BsInfoLg
              data-te-toggle="tooltip"
              title="This is read only field."
            />
          </FormControl>
         

          <FormControl className="flex ml-20" id="gender">
            <FormLabel className="w-[15%]">Gender <sup className="font-light">(optional)</sup></FormLabel>
            <div >
              <Select width={60} {...formik.getFieldProps("gender")}>
                <option value="">Select Gender </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </FormControl>

          {/* Additional form fields */}
          {/* ... (Add other form fields here) */}

          
          <div>
            <Button colorScheme="blue" type="submit" className="ml-20" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Stack>
      </form>

      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        handleRemoveProfileImage={handleRemoveProfileImage}
      />
    </div>
  );
};

export default EditProfileForm;
