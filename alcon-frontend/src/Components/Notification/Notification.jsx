import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Avatar,
  Image,
  Divider,
  Box,
} from "@chakra-ui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { timeDifference } from "../../Config/Logic";
import axios from "axios";

const Notification = () => {
  const [notification, setNotification] = useState([]);
  const { user, post } = useSelector((store) => store);
  const [getRows, setRows] = useState([0]);
  const [notificationId, setnotificationId] = useState("");

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const url = "http://localhost:5454/notifications/getNotifications";
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((item) => item.status === 0);

          if (data.length > 0) {
            setnotificationId(data[0].id);
          }
          setRows(filteredData.length);
          setNotification(data);
        } else {
          console.error("Error:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const url = `http://localhost:5454/notifications/${notificationId}/status`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 1 }), // Set the new status value here (1 in this example)
        });

        if (response.ok) {
          // Handle success if needed
        } else {
          console.error("Error:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Sort notifications by date in descending order
  const sortedNotifications = notification.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );

  return (
    <Flex justifyContent="center" mt={3}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <button type="button" className="btn position-relative">
            <IoMdNotificationsOutline className="text-2xl" />
            <span className="position-absolute top-2 start-100 translate-middle badge rounded-pill bg-danger">
              {getRows === 0 ? "1" : getRows}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-100"
          _focus={{ boxShadown: "none" }}
          width={"28rem"}
        >
          <PopoverArrow />
          <div className="flex">
            <PopoverHeader fontWeight="bold">Notification</PopoverHeader>
            <PopoverCloseButton />
          </div>
          <PopoverBody w="full" className="overflow-y-auto h-80">
            <Tabs isLazy colorScheme="green">
              {/* <TabList>
                <Tab
                  _focus={{ boxShadow: "none" }}
                  fontSize="xs"
                  fontWeight="bold"
                  w="100%"
                ></Tab>
              </TabList> */}
              <TabPanels>
                <TabPanel>
                  {sortedNotifications.map((notification) => {
                    const userObject = user.userByIds.find(
                      (u) => u.id === notification.userId
                    );
                    const userProfilePicture = userObject
                      ? userObject.image
                      : null;
                    const postObject = post.userPost.find(
                      (p) => p.id === notification.postId
                    );
                    const postImage = postObject ? postObject.image : null;

                    return (
                      <div
                        className={`grid grid-cols-4 ${
                          notification.status === 0 ? "bg-gray-100" : ""
                        } p-2 rounded-lg`}
                        key={notification.id}
                        onClick={handleClick}
                      >
                        <div className=" flex items-center">
                          {userProfilePicture ? (
                            <Avatar
                              alt={notification.userId}
                              src={userProfilePicture}
                            />
                          ) : (
                            <Avatar
                              alt="Default User"
                              src="URL_TO_DEFAULT_USER_PROFILE_PICTURE"
                              className="mr-1"
                            />
                          )}
                        </div>
                        <div className="col-span-2 flex flex-col items-center justify-center">
                          {" "}
                          {/* Changed to 'items-center justify-center' */}
                          <small className="opacity-100 text-xs font-semibold text-center">
                            {notification.message}
                          </small>
                          <div className="mt-1 text-xs opacity-60 text-center">
                            {timeDifference(notification.createAt)}
                          </div>
                        </div>
                        <div className=" flex items-center ml-10">
                          {postImage ? (
                            <Box boxSize="40px">
                              <Image
                                src={postImage}
                                alt={notification.postId}
                              />
                            </Box>
                          ) : (
                            <Box boxSize="40px">
                              <Image
                                alt="not found"
                                src="https://bit.ly/broken-link"
                              />
                            </Box>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default Notification;
