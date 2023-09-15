import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
  InputRightElement,
  InputGroup,
  Button,
  FormLabel
} from "@chakra-ui/react";
import  { lazy, Suspense } from "react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signinAction } from "../../Redux/Auth/Action";
import {signupActionMS} from "../../Redux/Auth/Action";
import { getUserProfileAction } from "../../Redux/User/Action";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../../Config';
import { PublicClientApplication } from '@azure/msal-browser'; 
import { useMsal } from '@azure/msal-react';
import { useAuthenticated } from '@azure/msal-react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Enter Email Address"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Enter Password"),
});

const AuthenticatedTemplateLazy = lazy(() => import('@azure/msal-react').then(module => ({ default: module.AuthenticatedTemplate })));


 

const Signin = () => {

  const { instance, accounts, inProgress } = useMsal();
  
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const initialValues = { email: "", password: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signin } = useSelector((store) => store);
  const toast = useToast();
  const [error, setError] = useState(""); // Add error state

  const token = localStorage.getItem("token");
  console.log("token in signin page ", token)
  console.log("reqUser -: ", user);

  const handleLogin = () => {
    if (accounts.length === 0) {
      // Only attempt login if there are no accounts
      instance.loginRedirect(loginRequest);
    }
  };
  
  useEffect(() => {
    

    if (user?.username && token) {
      navigate("/home");
      // navigate(`/user/${user?.username}`);
      toast({
        title: "Signin successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position:'top-right',
        variant:'left-accent'

      });

    }
  }, [user?.username,token]);
  
  useEffect(() => {
    if (accounts?.length > 0) {
      console.warn("accounts ",instance);
      const accountData = accounts[0]; // Assuming the first account is the relevant one
      // console.log("accountData",JSON.stringify(accountData, null, 2));
      dispatch(signupActionMS(accountData));
    //  instance?.PublicClientApplication?.clearCache();

      // msalClient.clearCache();
      // instance.setActiveAccount(null);
      // instance.logout();
    }
    else if (inProgress === "login") {
      return <span>Login is currently in progress!</span>
  }

  }, [accounts]);

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token || signin));
  }, [signin, token]);

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate("/home");
      // navigate(`/user/${user.reqUser?.username}`);
      toast({
        title: "Signin successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position:'top-right',
        variant:'left-accent'

      });

    }
  }, [user?.reqUser]);

 

  const handleSubmit = async (values, actions) => {
    // console.log(values);
    try {
      await dispatch(signinAction(values));
      actions.setSubmitting(false);
    } catch (error) {
      console.log("Error occurred while signing in:", error);
      if (error.message === "User is not verified") {
        setError("User is not verified");
        toast({
                  title: "User is not verified",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                  position:'top-right',
                  variant:'left-accent'
                });
      } else  {
        setError("Invalid email or password");
        toast({
                  title: "Invalid email or password",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                  position:'top-right',
                  variant:'left-accent'
                });
      }
    }
  };
  

  return (
    <MsalProvider instance={instance}>
    <div className=" ">
      <div className="border border-slate-300" style={{
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', borderRadius: '14px'
      }}>
        <Box p={8} display="flex" flexDirection="column" alignItems="center">
          <div className="flex">
            <img
              className="border border-red-800 mb-5 w-10"
              src={'https://simg.nicepng.com/png/small/152-1525748_ethereum-logo-png-graphic-transparent-download-ethereum-logo.png'}
              alt=""
            />
            <h2 className="mt-4 ml-2 text-4xl">Alcon</h2>
          </div>
          {/* {error && <div className="text-red-500">{error}</div>} */}
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <Form className="w-full">
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb={4}
                    >
                      <FormLabel>Email</FormLabel>
                      <Input
                        className="w-full"
                        {...field}
                        id="email"
                        placeholder="Enter Email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                      mb={4}
                    >
                      <FormLabel>Password</FormLabel>
                      <InputGroup size='md'>
                        <Input
                          {...field}
                          id="password"
                          type={show ? 'text' : 'password'}
                          placeholder='Enter password'
                        />
                        <InputRightElement width='4.5rem'>
                          <Button h='2rem' className="bg-white" size='lg' onClick={handleClick}>
                            {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  className="w-full"
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                >
                  Sign In
                </Button>

                <Button
                  className="w-full text-blue"
                  mt={2}
                  type="submit"
                  onClick={() => navigate("/forgot")}
                >
                  Forgot Password ?
                </Button>

                <p className="text-center py-2 font-bold text-sm">
                  Don't have an Account?{" "}
                  <span onClick={() => navigate("/signup")} className="ml-2 text-blue-700 cursor-pointer">
                    Sign Up
                  </span>
                </p>
                
                <Button
                  className="w-full text-blue"
                  mt={2}
                  
                  onClick={handleLogin}
                >
                <MicrosoftIcon/> Login with Microsoft
                </Button>
                
                
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
    </MsalProvider>
  );
};

export default Signin;
