// // notificationActions.js

// import { FETCH_NOTIFICATIONS_FAILURE, FETCH_NOTIFICATIONS_REQUEST, FETCH_NOTIFICATIONS_SUCCESS } from "./ActionType";


// // notificationActions.js
  
//   const fetchNotificationsRequest = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5454/getNotifications`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             //Authorization: "Bearer " + data.jwt,
//           },
//         }
//       );
  
//       if (response.ok) {
//         const notifications = await response.json();
//         console.warn(notifications);
//         // Process the notifications received from the backend
//       } else {
//         // Handle error cases
//       }
//     } catch (error) {
//       // Handle network or other runtime errors
//     }
//   };
//   export const fetchNotificationsSuccess = (notifications) => ({
//     type: FETCH_NOTIFICATIONS_SUCCESS,
//     payload: notifications,
//   });
  
//   export const fetchNotificationsFailure = (error) => ({
//     type: FETCH_NOTIFICATIONS_FAILURE,
//     payload: error,
//   });
