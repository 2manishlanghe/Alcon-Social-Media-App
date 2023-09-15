import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Auth from "../Auth/Auth";
import EditProfilePage from "../EditProfile/EditProfilePage";
import HomePage from "../HomePage/HomePage";
import Profile from "../Profile/Profile";
import TopNav from "../../Components/TopNav/TopNav";
import Setting from "../../Components/Setting/Setting";
import Bookmark from "../../Components/BookMark/Bookmark";
import HashtagPosts from "../../Components/HashtagPosts/HashtagPosts";

const Routers = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const pathsToCheck = ["login", "signup", "forgot", "reset", "/"];
  const isPathAuthorized = !pathsToCheck.some((path) =>
    location.pathname.includes(path)
  );
  
  let isAuthorised = isPathAuthorized;
console.log("condition",isAuthorised);
if (token) {
  isAuthorised = true;
}
  return (
    <div>
      {isAuthorised ? (
        <div className="flex bg-[#EDF2F7]">
          <div className="sidebarBox border border-l-slate-500 shadow w-[16%]">
            <Sidebar />
          </div>
          <div className="w-[80%]">
            <div className="fixed top-0 left-[16%] right-0">
              <TopNav />
            </div>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/p/:postId" element={<HomePage />} />
              <Route path="/user/:username" element={<Profile />} />
              <Route path="/account/edit" element={<EditProfilePage />} />
              <Route path="/bookmark" element={<Bookmark />} />
              <Route path="/hashtagposts/:hashtag" element={<HashtagPosts />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/signup" element={<Auth />} />
          <Route path="/forgot" element={<Auth />} />
          <Route path="/reset/:resetToken" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Auth />} />
          <Route path="/user/:username" element={<Profile />} />
        </Routes>
      )}
    </div>
  );
};

export default Routers;


