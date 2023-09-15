import { useDisclosure } from "@chakra-ui/hooks";
import React, { useRef, useState } from "react";

import { useNavigate } from "react-router";
import { menu } from "./SidebarConfig";
import "./Sidebar.css";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useSelector } from "react-redux";
import CreatePostModal from "../Post/Create/CreatePostModal";
import logo from "../Sidebar/logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Home");
  const excludedBoxRef = useRef(null);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((store) => store);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Profile") {
      navigate(`/user/${user.reqUser?.username}`);
    } else if (tab === "Home") {
      navigate("/home");
    } else if (tab === "Create") {
      onOpen();
    } else if (tab === "Bookmark") {
      navigate("/bookmark");
    }
    if (tab === "Search") {
      setIsSearchBoxVisible(true);
    } else setIsSearchBoxVisible(false);
  };

  function handleClick() {
    setShowDropdown(!showDropdown);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 pb-10 flex bg-[#ffff] h-screen">
      <div
        className={`${
          activeTab === "Search" ? "px-3" : "px-10"
        } flex flex-col justify-between h-full `}
      >
        <div className="pt-10">
          <div className="mr-5 flex">
            {!isSearchBoxVisible && (
              <img className="w-10" src={logo} alt="Alcon" />
            )}
            <h2 className="pt-4 pl-2 text-4xl md:text-3xl sm:text-2xl">
              Alcon
            </h2>
          </div>
          <div className="mt-5">
            {menu.map((item) => (
              <div
                onClick={() => handleTabClick(item.title)}
                className="flex items-center mb-5 cursor-pointer "
              >
                {activeTab === item.title ? item.activeIcon : item.icon}
                <p
                  className={` ${
                    activeTab === item.title ? "font-bold text-lg" : "text-lg"
                  } ${isSearchBoxVisible ? "hidden" : "block"}`}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isSearchBoxVisible && (
        <div className="search-component-container">
          <SearchComponent setIsSearchVisible={setIsSearchBoxVisible} />
        </div>
      )}

      <CreatePostModal onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
    </div>
  );
};

export default Sidebar;
