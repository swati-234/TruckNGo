// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'; // Import specific authentication methods
// import { createContext, useState } from 'react';
// import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';

// // Initialize Firebase app
// const firebaseConfig = {
//   apiKey: "AIzaSyB5HktMMx_2hAZgT8hpFrIk45YC73pHAeA",
//   authDomain: "truckngo-a7120.firebaseapp.com",
//   projectId: "truckngo-a7120",
//   storageBucket: "truckngo-a7120.appspot.com",
//   messagingSenderId: "202753669060",
//   appId: "1:202753669060:web:eba5cf5d88253922d5d691"
// };
// initializeApp(firebaseConfig);
// const firestore = getFirestore()
// const userCollection = collection(firestore,'user')
// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const auth = getAuth(); // Get the auth instance

//   const login = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setCurrentUser(userCredential);
//       console.log(userCredential);
//     } catch (error) {
//       console.log(error);
//       throw error; // Rethrow the error to be caught in the caller function
//     }
//   };
  

//   const logout = () => {
//     signOut(auth) // Use signOut method
//       .then(() => {
//         setCurrentUser(null);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };
  
  
//   const register = async (email, password, displayName) => {
//     try {
//       // Create user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
//       // Update user profile with display name
//       await updateProfile(userCredential.user, { displayName });
  
//       // Create user document in Firestore
//       const userData = {
//         name: userCredential.user.displayName,
//         id: userCredential.user.uid,
//         isOwner: 0,
//         isDriver: 0,
//         isRenter: 0,
//         isVerified: 0,
//         aadharId: "",
//         phoneNo: "",
//         address:""
//         // Add other fields as needed
//       };
  
//       // Add user document to Firestore
//       await addDoc(userCollection,userData);
  
//       // Return the user object
//       return userCredential.user;
//     } catch (error) {
//       // Handle registration errors
//       console.log(error)
//       throw error; // Rethrow the error to be caught in the caller function
//     }
//   };
  
//   return (
//     <AuthContext.Provider value={{ currentUser, login, logout,register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile,onAuthStateChanged } from 'firebase/auth';
import { createContext, useState, useEffect } from 'react';
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5HktMMx_2hAZgT8hpFrIk45YC73pHAeA",
  authDomain: "truckngo-a7120.firebaseapp.com",
  projectId: "truckngo-a7120",
  storageBucket: "truckngo-a7120.appspot.com",
  messagingSenderId: "202753669060",
  appId: "1:202753669060:web:eba5cf5d88253922d5d691"
};

initializeApp(firebaseConfig);
const firestore = getFirestore();
const userCollection = collection(firestore, 'user');
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Save user to local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        // Remove user from local storage
        localStorage.removeItem('currentUser');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      const userData = {
        name: userCredential.user.displayName,
        id: userCredential.user.uid,
        isOwner: 0,
        isDriver: 0,
        isRenter: 0,
        isVerified: 0,
        aadharId: "",
        phoneNo: "",
        address: ""
      };
      await addDoc(userCollection, userData);
      return userCredential.user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
