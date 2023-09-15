import React, { useState } from "react";
import '../TopNav/TopNav.css';
import {
  Avatar,
  Text,
  HStack,
  VStack,
  Stack,
  MenuButton,
  MenuList,
  Box,
  Menu,
  MenuItem,
} from "@chakra-ui/react";
import { FiChevronDown} from 'react-icons/fi'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Notification from "../Notification/Notification";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../Redux/Auth/Action";
import { useMsal } from '@azure/msal-react';

const TopNav = () => {

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const dispatch = useDispatch();
  const { instance ,accounts} = useMsal();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfile = () => {
    navigate(`/user/${user.reqUser?.username}`);
  };
  const handleSetting = () => {
    navigate("/setting");
  };
  
  const handleLogout = () => {

    instance.logoutRedirect({
      onRedirectNavigate: () => { return false }
  });
    localStorage.clear();
    localStorage.removeItem("token");
    // dispatch()
    try {
       dispatch(logoutAction());
      // Navigate the user to the login page or perform any other desired actions
    } catch (error) {
      console.log("Logout error:", error);
      // Handle the error, e.g., display an error message to the user
    }
    navigate("/login");
  };

  const { user } = useSelector((store) => store);
  return (
    <nav className="top-navbar">
      <div className="container">
        <div className="right-section">
          <ul className="notification pr-7">
            <li className="notification-item">
              <Notification />
            </li>
          </ul>
          <ul className="user-profile">
            <li className="user-profile-item">
              <Stack direction="row">
                <Menu>
                <MenuButton
              // py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    user.reqUser?.image ||
                    'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  // spacing="1px"
                  // ml="2"
                  >
                  <Text fontSize="sm" className=""> {user.reqUser?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                  {user.reqUser?.username}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleSetting}>Setting</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;