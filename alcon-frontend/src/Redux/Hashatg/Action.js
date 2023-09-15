import {
    SEARCH_HASHTAG
  } from "./ActionType";

  export const searchHashtagAction = (data) => async (dispatch) => {
    try {
  
      console.log("searchHashtagActio method :" + data.hashtag);
      const res = await fetch(`http://localhost:5454/api/posts/search?prefix=${data.hashtag}`, {
        method: "GET",
  
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.jwt,
        },
  
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
  
      console.log(" -- res data --", res);
  
      const users = await res.json();
      console.log("---Hashatg---"+ users);
  
      console.log("--- find by Hashatgs  --- ", users);
  
      dispatch({ type: SEARCH_HASHTAG, payload: users });
  
    } catch (error) {
      console.log("catch error -  ", error);
    }
  };