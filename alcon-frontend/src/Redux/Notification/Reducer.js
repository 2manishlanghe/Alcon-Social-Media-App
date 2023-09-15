// import {
//     FETCH_NOTIFICATIONS_REQUEST,
//     FETCH_NOTIFICATIONS_SUCCESS,
//     FETCH_NOTIFICATIONS_FAILURE,
//   } from './notificationActions';
  
//   const initialState = {
//     notifications: [],
//     loading: false,
//     error: null,
//   };
  
//   const Reducer = (state = initialState, action) => {
//     switch (action.type) {
//       case FETCH_NOTIFICATIONS_REQUEST:
//         return {
//           ...state,
//           loading: true,
//         };
//       case FETCH_NOTIFICATIONS_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           notifications: action.payload,
//         };
//       case FETCH_NOTIFICATIONS_FAILURE:
//         return {
//           ...state,
//           loading: false,
//           error: action.payload,
//         };
//       default:
//         return state;
//     }
//   };
  
//   export default Reducer;