// import { database } from "../conn.js";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import jwt from "jsonwebtoken";
const firebaseConfig = {
  apiKey: "AIzaSyB5HktMMx_2hAZgT8hpFrIk45YC73pHAeA",
  authDomain: "truckngo-a7120.firebaseapp.com",
  projectId: "truckngo-a7120",
  storageBucket: "truckngo-a7120.appspot.com",
  messagingSenderId: "202753669060",
  appId: "1:202753669060:web:eba5cf5d88253922d5d691"
};
initializeApp(firebaseConfig);
const firestore = getFirestore()
// export const getUser = (req, res) => {
//   const userId = req.params.username;
//   const q = "SELECT * FROM user WHERE username=?";

//   database.query(q, [userId], (err, data) => {
//     if (err) return res.status(500).json(err);

//     if (data.length === 0) {
//       return res.status(404).json("User not found");
//     }

//     const { password, ...info } = data[0];
//     return res.json(info);
//   });
// };

export const getUserById = async (req, res) => {
  try {
    const firestore = getFirestore();

    // Create a query to find the document with the specified id
    const q = query(collection(firestore, "user"), where("id", "==", req.body.id));
    
    // Execute the query and get the snapshot of matching documents
    const querySnapshot = await getDocs(q);
    
    // Check if there are any matching documents
    if (querySnapshot.empty) {
      return res.status(404).json("User not found");
    }
    
    // Assuming there's only one document with the specified id, get its reference
    const userDocRef = doc(firestore, "user", querySnapshot.docs[0].id);
    
    const userSnapshot = await getDocs(userDocRef);
    if (!userSnapshot.exists()) {
      return res.status(404).json("User not found");
    }
    
    const userData = userSnapshot.data();
    // Exclude sensitive data like password before sending the response
    const { password, ...info } = userData;
    
    return res.json(info);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json(error);
  }
};
// export const getOwnedTruck = (req, res) => {
//   const getQuery = "SELECT * FROM trucks WHERE OwnerId=?";
//   // console.log(req.query.OwnerId)
//   // Use req.query.OwnerId to access the parameter from the URL
//   database.query(getQuery, [req.query.OwnerId], (getErr, getData) => {
//     if (getErr) {
//       console.error(getErr);
//       return res
//         .status(500)
//         .json({ error: "Internal Server Error", details: getErr.message });
//     }
//     // console.log(getData)
//     return res.status(200).json(getData);
//   });
// };
export const updateUser = async (req, res) => {
  try {
    const firestore = getFirestore();

    // Create a query to find the document with the specified id
    const q = query(collection(firestore, "user"), where("id", "==", req.body.id));
    
    // Execute the query and get the snapshot of matching documents
    const querySnapshot = await getDocs(q);
    
    // Check if there are any matching documents
    if (querySnapshot.empty) {
      return res.status(404).json("User not found");
    }
    
    // Assuming there's only one document with the specified id, get its reference
    const userDocRef = doc(firestore, "user", querySnapshot.docs[0].id);
    
    // Update the document with the new data
    await updateDoc(userDocRef, {
      phoneNo: req.body.phone,
      address: req.body.address,
      isOwner: req.body.isOwner,
      aadharId: req.body.aadhar,
    });

    console.log("User document updated successfully.");
    return res.status(200).json("User document updated successfully.");
  } catch (error) {
    console.error("Error updating user document:", error);
    return res.status(500).json(error);
  }
};