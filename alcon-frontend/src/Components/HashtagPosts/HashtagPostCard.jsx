import React from 'react';
import "../ProfilePageCard/ReqUserPostCard.css";
import {AiFillHeart} from "react-icons/ai";
import {FaComment} from "react-icons/fa";
import "./HashtagPostCard.css";

const HashtagPostCard = ({post}) => {
  return (
    <div className='p-2'>
        <div className='post w-60 h-60 '>
            <img className=' cursor-pointer' src={post?.image} alt="" />
            <div className='overlay'>
                <div className='overlay-text flex justify-between '>
                    {/* <div className='flex items-center'><AiFillHeart className='mr-2'/> <span>{post?.likedByUsers?.length}</span></div>
                    <div className='flex items-center'><FaComment className='mr-2'/> <span>{post?.comments?.length}</span></div> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default HashtagPostCard;