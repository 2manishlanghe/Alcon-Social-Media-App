import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Signin from "../../Components/Register/Signin";
import Signup from "../../Components/Register/Singup";
import "./Auth.css"
import ForgotPassword from "../../Components/Register/ForgotPassword";
import UpdatePass from "../../Components/Register/UpdatePass";



const Auth = () => {
  const location = useLocation();
  let { resetToken } = useParams();

  const [showResetPage,setShowResetPage] =useState(false)




  useEffect(()=>{

    if(resetToken){

      setShowResetPage(true)
      
    }

  },[resetToken])










  return (
    <div style={{ backgroundImage: `url(/14.png)`, backgroundRepeat: 'no-repeat', backgroundPosition: '', backgroundSize: '97%', backgroundPositionY: '330px' }}>

      <div className="flex items-center justify-center h-[100vh]" >
        <div className="relative mr-10 hidden lg:block">
          {/* <div className=" h-[35.3rem] w-[23rem]">
              <img
              className="h-full w-full"
              src="https://www.nicepng.com/png/detail/152-1525748_ethereum-logo-png-graphic-transparent-download-ethereum-logo.png"
              alt=""
            />
            

            </div> */}

        </div>

        <div className="form md:w-[35vw] lg:w-[28vw]">

          {/* {location.pathname === "/login" ? <Signin/> :  <Signup/>} */}

          {location.pathname === "/login" || location.pathname === "/" ? (
            <Signin />
          ) : location.pathname === "/signup" ? (
            <Signup />
          ) : location.pathname === "/forgot" ? (
            <ForgotPassword />
          ) : showResetPage ?(
            <UpdatePass/>
          ):null}
        </div>
      </div>

    </div>

  );
};

export default Auth;