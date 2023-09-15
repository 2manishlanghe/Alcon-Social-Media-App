import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import './Singup.css'
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupAction } from "../../Redux/Auth/Action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is Required"),
  username: Yup.string()
    .min(6, "Username must be at least 6 characters")
    .max(30, "Username cannot be more than 30 characters long")
    .required("Username is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot be more than 30 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Required"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot be more than 30 characters long")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is Required"),
});

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const initialValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  };
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  console.log("auth :-", auth.signup?.username);

  const handleSubmit = async (values, actions) => {
    try {
      const response = await fetch(`http://localhost:5454/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Signup success, redirect to login page
        navigate("/login");
        toast({
          title: "Email has been sent. Please verify your email",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
         
          variant:'left-accent'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.log("Error:", error);
      // Handle the error and show an error message to the user
      // setErrorMessage(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position:'top-right',
        variant:'left-accent'
      });
    }

    actions.setSubmitting(false);
  };
  

  useEffect(()=>{
if(auth.signup?.username){
  setIsSignup(true);
  navigate("/login")
  toast({
    title: 'Email has been sent. Please verify your email',
    status: 'success',
    duration: 2000,
    isClosable: true,
    position:'top-right',
    variant:'left-accent'
  })
}
  },[auth.signup])
  
  return (
    <div className="backImg" >
        <div className="border border-slate-300 " style={{
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',borderRadius: '14px'
           }}>
           <Box p={5} display="flex" flexDirection="column" alignItems="center">
             <div className="flex mb-3">
             <img
          className="border border-red-800 w-10"
          src="https://simg.nicepng.com/png/small/152-1525748_ethereum-logo-png-graphic-transparent-download-ethereum-logo.png"
          alt="alcon-icon"
          /><h2 className="mt-4 ml-2 text-4xl">Alcon</h2>
        </div>
        
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
                    mb={3}
                  >
                    <FormLabel className="text-sm">Email <span className="req">*</span></FormLabel>
                    <Input
                      className="w-full"
                      {...field}
                      id="email"
                      placeholder="Email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="username">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.username && form.touched.username}
                    mb={3}
                  >
                    <FormLabel className="text-sm">User Name <span className="req">*</span></FormLabel>
                    <Input {...field} id="username" placeholder="username"  />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="name">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                    mb={3}
                  >
                    <FormLabel className="text-sm">Full Name<span className="req">*</span></FormLabel>
                    <Input {...field} id="name" placeholder="Full Name" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                    mb={3}
                  >
                    <FormLabel className="text-sm">Password <span className="req">*</span></FormLabel>
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="confirmPassword">
  {({ field, form }) => (
    <FormControl
      isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}
      mb={3}
    >
      <FormLabel className="text-sm">Confirm Password <span className="req">*</span></FormLabel>
      <Input
        {...field}
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
      />
      <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
    </FormControl>
  )}
</Field>

              
              <Button
                className="w-full"
                mt={1}
                colorScheme="blue"
                type="submit"
                isLoading={formikProps.isSubmitting}
              >
                Sign Up
              </Button>
              <p className="text-center py-2 font-bold text-sm">Already have an account <span onClick={()=>navigate("/login")} className="ml-2 text-blue-700 cursor-pointer">Sign In</span></p>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
    {/* <div className="w-full border border-slate-300 mt-5" style={{
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
      }}>
<p className="text-center py-2 font-bold text-sm">If You Have Already Account <span onClick={()=>navigate("/login")} className="ml-2 text-blue-700 cursor-pointer">Sign In</span></p>
      </div> */}
    </div>
  );
};

export default Signup;