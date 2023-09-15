import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from "../Auth/Reducer";
import { commentReducer } from "../Comment/Reducer";
import { postReducer } from "../Post/Reducer";
import { userReducer } from "../User/Reducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { searchHashtagReducer } from "../Hashatg/Reducer";
const rootReducers = combineReducers({
  hashtag: searchHashtagReducer,
  post: postReducer,
  comments: commentReducer,
  user: userReducer,
  auth: AuthReducer,
});

export const store = legacy_createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(thunk))
);
