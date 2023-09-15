import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";

export const menu = [
  {
    title: "Home",
    icon: <AiOutlineHome className="text-3xl mr-5" />,
    activeIcon: <AiFillHome className="text-3xl mr-5" />,
  },
  {
    title: "Search",
    icon: <AiOutlineSearch className="text-3xl mr-5" />,
    activeIcon: <AiOutlineSearch className="text-3xl mr-5" />,
  },

  {
    title: "Create",
    icon: <AiOutlinePlusCircle className="text-3xl mr-5" />,
    activeIcon: <AiFillPlusCircle className="text-3xl mr-5" />,
  },
  {
    title: "Bookmark",
    icon: <BsBookmark className="text-2xl mr-6" />,
    activeIcon: <BsBookmarkFill className="text-2xl mr-6" />,
  },
];
