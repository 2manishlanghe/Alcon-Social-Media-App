import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Box, FormControl, FormErrorMessage, Input, Button, useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

import { forgotAction } from "../../Redux/Auth/Action";
import { useDispatch} from "react-redux";
import { useState } from "react";
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
 
});

const ForgotPassword = () => {
  
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch(); 
const initialValues = { email: ""}
const [error,setError]=useState("");
const handleSubmit = async (values, actions) => {
  // console.log(values);
  try {
    await dispatch(forgotAction(values));
    actions.setSubmitting(false);
    toast({
      title: "Please check your email to set new Password. ",
      status: "success",
      duration: 2000,
      isClosable: true,
      position:'top-right',
      variant:'left-accent'
    });
    navigate('/login');
  } catch (error) {
    console.warn(error);
    console.warn({ email: 'User not found' });
  }
};


// const handleSubmit = async (values, actions) => {
//   console.log(values);
//   try {
//     await dispatch(forgotAction(values));
//     actions.setSubmitting(false);
//   } catch (error) {
//     console.warn(error);
//     // Handle the error, e.g., display an error message to the user
//   }
// };



  return (
    <div className=" ">
      <div
        className="border border-slate-300"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          borderRadius: '14px'
        }}
      >
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
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb={4}
                    >
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
                

                <Button
                  className="w-full"
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                >
                  Send Login Link
                </Button>

                <p className="text-center py-2 font-bold text-sm">
                  Back to Login{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="ml-2 text-blue-700 cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
