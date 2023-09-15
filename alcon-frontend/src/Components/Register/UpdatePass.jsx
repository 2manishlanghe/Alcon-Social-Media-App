import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
   Button,
   FormLabel
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { UpdatePasswordAction } from "../../Redux/Auth/Action";


const validationSchema = Yup.object().shape({
  newPassword: Yup.string().min(8, "Password must be at least 8 characters").required("Password Required"),
  conformPassword:Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match").required("Confirm Password Required")
});
const UpdatePass = () => {
  const initialValues = { newPassword: "", conformPassword:"" };
  const dispatch = useDispatch();
   const navigate = useNavigate();
   const location =useLocation();
  const { user} = useSelector((store) => store);
  const toast = useToast();

  const token = localStorage.getItem("token");
  console.log("token in signin page ", token)
  console.log("reqUser -: ", user);
  const path = location.pathname;
  const token1 = path.substring(path.lastIndexOf('/') + 1);

  const [tokenValue, setTokenValue] = useState(token1);
  useEffect(()=>{
    console.warn("location",location);
    console.warn(tokenValue);
    
  })
  const handleSubmit = async (values, actions) => {
    try {
      const token = tokenValue; // Assuming tokenValue is already defined
      console.log(values);
      await dispatch(UpdatePasswordAction(values, token));
      actions.setSubmitting(false);
  
      // Show success toast notification
      toast({
        title: "Password updated successfully!",
        status: "success",
        duration: 2000,
        position:'top-right',
        variant:'left-accent',
        onCloseComplete: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      // Handle error and show error toast notification
      console.error(error);
      toast({
        title: "Failed to update password. Please try again.",
        status: "error",
        position:'top-right',
        variant:'left-accent',
        duration: 2000,
      });
      actions.setSubmitting(false);
    }
  };
  // const handleSubmit = (values, actions) => {
  //   const token = tokenValue; // Assuming tokenValue is already defined
  //   console.log(values);
  //   dispatch(UpdatePasswordAction(values, token));
  //   actions.setSubmitting(false);
  // };
  return (
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

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <Form className="w-full">
                <Field name="newPassword">
                  {({ field, form }) => (
                    
                    <FormControl
                      isInvalid={form.errors.newPassword && form.touched.newPassword}
                      mb={4}
                    ><FormLabel>Password</FormLabel>
                      <Input
                      type="password"
                        className="w-full"
                        {...field}
                        id="newPassword"
                        placeholder="Password"
                      />
                      <FormErrorMessage>{form.errors.newPassword}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="conformPassword">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.conformPassword && form.touched.conformPassword}
                      mb={4}
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                      type="password"
                        className="w-full"
                        {...field}
                        id="conformPassword"
                        placeholder="Confirm Password"
                      />
                      <FormErrorMessage>{form.errors.conformPassword}</FormErrorMessage>
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
                  Update Password
                </Button>

               
               

                {/* <p className="text-center py-2 font-bold text-sm"> Back to Login <span onClick={() => navigate("/login")} className="ml-2 text-blue-700 cursor-pointer">Login</span></p> */}

              </Form>
            )}
          </Formik>
        </Box>
      
      </div>
    </div>

  )
}

export default UpdatePass