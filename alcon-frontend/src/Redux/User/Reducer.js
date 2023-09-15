import {
  GET_USERS_BY_USER_IDS,
  GET_USER_BY_USERNAME,
  GET_USER_PROFILE,
  SEARCH_USER,
  UPDATE_USER,
  REMOVE_PROFILE_PICTURE,
} from "./ActionType";

const initialState = {
  reqUser: null,
  findByUsername: null,
  searchResult: [],
  updatedUser: null,
  userByIds: [],
  userId: [],
};

export const userReducer = (store = initialState, { type, payload }) => {
  if (type === GET_USER_PROFILE) {
    return { ...store, reqUser: payload };
  } else if (type === GET_USER_BY_USERNAME) {
    return { ...store, findByUsername: payload };
  } else if (type === GET_USERS_BY_USER_IDS) {
    return { ...store, userByIds: payload };
  } else if (type === SEARCH_USER) {
    return { ...store, searchResult: payload };
  } else if (type === UPDATE_USER) {
    return { ...store, updatedUser: payload };
  } else if (type === REMOVE_PROFILE_PICTURE) {
    return { ...store, userId: payload };
  }
  return store;
};
