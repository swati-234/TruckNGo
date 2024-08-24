// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth}  from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5HktMMx_2hAZgT8hpFrIk45YC73pHAeA",
  authDomain: "truckngo-a7120.firebaseapp.com",
  projectId: "truckngo-a7120",
  storageBucket: "truckngo-a7120.appspot.com",
  messagingSenderId: "202753669060",
  appId: "1:202753669060:web:eba5cf5d88253922d5d691"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const analytics = getAnalytics(app);