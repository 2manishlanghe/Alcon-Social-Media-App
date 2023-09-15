import React from "react";
import "../Setting/Setting.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

import {
  Flex,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  Button,
  Switch,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons"; // Import the back arrow icon

const Setting = () => {
  const navigate = useNavigate();
  const emailAddress = "langhe.cm@gmail.com";

  const handleProfile = () => {
    navigate(`/account/edit`);
  };

  const handleBackButton = () => {
    navigate(`/home`);
  };

  return (
    <div className="ml-[3%] ">
      <Card className="card height mt-6">
        <CardHeader>
          <Heading className="flex" size="lg">
            <AiOutlineArrowLeft
              onClick={handleBackButton}
              className="font-bold text-2xl mr-3 mt-1 cursor-pointer"
            />
            Settings
          </Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="5">
            <Box>
              <Heading size="md">Profile Setting</Heading>
              <Text pt="2" fontSize="sm">
                <label> Edit Info</label>
                <Button
                  className="ml-4"
                  colorScheme="blue"
                  variant="solid"
                  onClick={handleProfile}
                  size="sm"
                >
                  Edit Profile
                </Button>
              </Text>
            </Box>
            {/* <Box>
              <Heading size="md">Privacy Setting</Heading>
              <Text pt="3" fontSize="sm">
                Private Account
                <Switch className="ml-2" size="md" />
              </Text>
            </Box> */}
            <Box>
              <Heading size="md">Help Center</Heading>
              <Link to="">
                <Text pt="3" fontSize="sm">
                  Welcome to the Alcon Help Center! We're here to provide you
                  with the information and guidance you need to make the most of
                  our platform. Whether you're new to Alcon or a seasoned user,
                  you'll find answers to your questions here.
                </Text>
              </Link>
              <br></br>
              <Link to="">
                <Heading size="md">Contact Support</Heading>
                <Text pt="3" fontSize="sm">
                  If you can't find the information you're looking for or need
                  assistance with a specific issue, our support team is here to
                  help. Contact us through Alcon, or you can email us at &nbsp;
                  <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                </Text>
              </Link>
              <br></br>
              <Link to="">
                <Heading size="md">Stay Updated</Heading>
                <Text pt="3" fontSize="sm">
                  We're committed to making your experience on Alcon enjoyable
                  and safe. If you have any feedback or suggestions for
                  improving our Help Center, please let us know. Thank you for
                  being a part of our community!
                </Text>
              </Link>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
};

export default Setting;
