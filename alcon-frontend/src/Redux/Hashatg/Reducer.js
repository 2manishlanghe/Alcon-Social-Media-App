import {
    SEARCH_HASHTAG,
  } from "./ActionType";

  const initialState = {
    searchResult:[],
  };

  export const searchHashtagReducer = (store = initialState, { type, payload }) => {
   
     if (type === SEARCH_HASHTAG) {
      return { ...store, searchResult: payload };
    }
    return store;
  };
  