// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhYF67GMIGoSpxhyjJzh2c-BZDaMdTwXQ",
  authDomain: "soundcloud-398901.firebaseapp.com",
  projectId: "soundcloud-398901",
  storageBucket: "soundcloud-398901.appspot.com",
  messagingSenderId: "819196180091",
  appId: "1:819196180091:web:cc10b57f02ca27899bd4de",
  measurementId: "G-7ZNXY0E75P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
