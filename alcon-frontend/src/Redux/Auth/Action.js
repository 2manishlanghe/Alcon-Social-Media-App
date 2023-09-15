import { FORGOT, SIGN_IN, SIGN_UP,SIGN_UP_WITH_MS ,LOGOUT } from "./ActionType";

export const signinAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:5454/signin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(data.email + ":" + data.password),
      },
    });

    if (!res.ok) {
      throw new Error("Invalid email or password"); 
    }

    const token = res.headers.get("Authorization");

    localStorage.setItem("token", token);
    console.log("token from header :- ", token);
    dispatch({ type: SIGN_IN, payload: token });
  } catch (error) {
    console.log("catch error ", error);
    throw error; 
  }
};



export const signupAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:5454/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const user = await res.json();
    console.log("Signup :- ",user)
    dispatch({ type: SIGN_UP, payload: user });
  } catch (error) {
    console.log("catch error ", error);
  }
};

export const signupActionMS = (data) => async (dispatch) => {
  console.log("data...........",data)
  try {
    const res = await fetch(`http://localhost:5454/signup/ms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const token = res.headers.get("Authorization");
      const responseBody = await res.json(); // Parse the response body as JSON

      console.log("Signup Response:", responseBody);

      // Dispatch an action to handle the response
      dispatch({ type: SIGN_UP_WITH_MS, payload: token });

      // Store the token in your state or local storage
     console.log("token"+token)
      localStorage.setItem("token", token);

      // Do any other actions you want after successful signup
    } else {
      const errorResponse = await res.json(); // Parse the error response as JSON

      // Handle error response
      console.log("Error response:", errorResponse);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    // Make an API call to your logout endpoint
    // For example, if you have a "/logout" endpoint:
    await fetch("http://localhost:5454/logout", {
      method: "GET",
    });

    // Clear the token from local storage
    localStorage.removeItem("token");
    
    // Dispatch the LOGOUT action to reset the user state
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.log("catch error", error);
    // Handle the error, e.g., display an error message to the user
  }
};

export const forgotAction = (email) => async (dispatch) => {
  console.log(email);
  try {
    const emailString = email.email; // Extract the email address from the email object
    console.warn(emailString);
    const res = await fetch(`http://localhost:5454/forgotPassword?email=${emailString}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });


    // Handle other response statuses if needed

    dispatch({ type: FORGOT });
  } catch (error) {
    console.log("catch error", error);
    // Handle the error, e.g., display an error message to the user
  }
};

export const UpdatePasswordAction = (data, token) => async (dispatch) => {
  console.log(token);
  console.log(data);
  try {
    const res = await fetch(`http://localhost:5454/resetPassword/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(data), // Pass the data in the request body
    });


    dispatch({ type: "UpdatePassword" }); // Replace "UpdatePassword" with the correct action type
  } catch (error) {
    console.log("catch error", error);
    // Handle the error, e.g., display an error message to the user
  }
};