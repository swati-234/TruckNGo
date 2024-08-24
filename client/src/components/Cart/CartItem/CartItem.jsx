import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import prod from "../../../assets/truck1.jpg";
import axios from "axios";
import "./CartItem.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { getFirestore,where,getDocs,doc,getDoc,collection,query,updateDoc } from "firebase/firestore";
const CartItem = ({ truck,setCartslide }) => {
  console.log(truck.flag)
  const firestore = getFirestore()
  // console.log(truck)
  const [dbDate, setDbDate] = useState(truck.bookedUpto);
  const [isDateValid, setIsDateValid] = useState(false);

  useEffect(() => {
    const currentDate = new Date(); // Get the current date
    const databaseDate = new Date(dbDate); // Parse the date from the database
    
    // Compare the two dates
    const isAfterCurrentDate = databaseDate > currentDate;
    setIsDateValid(isAfterCurrentDate);
  }, [dbDate]);
  if(!isDateValid){
    console.log("**")
  console.log(truck.licensePlate)
  }
  const { currentUser } = useContext(AuthContext);
  const [ownerData, setOwnerData] = useState(null);
  const [renterData, setRenterData] = useState(null);
  // console.log(truck.bookedBy);
  useEffect(() => {
    const fetchUserData = async (userId, setData) => {
      try {
        const userRef = collection(firestore,"user");
          const q = query(collection(firestore, "user"), where("id", "==", userId));
         const querySnapshot = await getDocs(q);
          // const querySnapshot = await truckRef.where("owner", "==", currentUser.uid).get();
          
          
          if (!querySnapshot.empty) {
             // Assuming there's only one document with the specified UID, get its reference
             const userDocRef = doc(firestore, "user", querySnapshot.docs[0].id);
            
            // Fetch the document snapshot
            const userDocSnapshot = await getDoc(userDocRef);
            
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
                      console.log(userData)
                      setData(userData)
          }
             } else {
           console.warn("User document does not exist");
            }
            }
       catch (error) {
        console.error("Error fetching user data:", error.response.data);
      }
    };

    // Fetch owner data
    if (truck.owner) {
      fetchUserData(truck.owner, setOwnerData);
    }
    // Fetch renter data
    if (truck.bookedBy) {
      fetchUserData(truck.bookedBy, setRenterData);
    }
  }, [truck.owner, truck.bookedBy]);
  console.log(truck.licensePlate)
  const handleDelete = async () => {
    console.log(truck.licensePlate)
    try {
        const q = query(collection(firestore, "truck"), where("licensePlate", "==", truck.licensePlate));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Document with matching licensePlate exists
            const truckDocRef = querySnapshot.docs[0].ref;
            const truckData = querySnapshot.docs[0].data();
            
            // Check if flag attribute exists
            if (truckData.hasOwnProperty("flag")) {
                // Flag attribute exists, update its value to -1
                await updateDoc(truckDocRef, { flag: -1 });
            } else {
                // Flag attribute doesn't exist, add it and set it to -1
                await updateDoc(truckDocRef, { flag: -1 });
            }
        } else {
            // Document with matching licensePlate does not exist, log a warning
            console.warn("Truck document does not exist");
        }
        setCartslide(x=>!x)
    } catch (error) {
        console.error("Error handling truck deletion:", error);
    }
};
const handleAccept = async () =>{
  try {
    const q = query(collection(firestore, "truck"), where("licensePlate", "==", truck.licensePlate));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Document with matching licensePlate exists
        const truckDocRef = querySnapshot.docs[0].ref;
        const truckData = querySnapshot.docs[0].data();
        
        // Check if flag attribute exists
        if (truckData.hasOwnProperty("flag")) {
            // Flag attribute exists, update its value to -1
            await updateDoc(truckDocRef, { flag: 2 });
        } else {
            // Flag attribute doesn't exist, add it and set it to -1
            await updateDoc(truckDocRef, { flag: 2 });
        }
    } else {
        // Document with matching licensePlate does not exist, log a warning
        console.warn("Truck document does not exist");
    }
    setCartslide(x=>!x)
} catch (error) {
    console.error("Error handling truck deletion:", error);
}
}
const handleDecline = async () =>{
  try {
    const q = query(collection(firestore, "truck"), where("licensePlate", "==", truck.licensePlate));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Document with matching licensePlate exists
        const truckDocRef = querySnapshot.docs[0].ref;
        const truckData = querySnapshot.docs[0].data();
        
        // Check if flag attribute exists
        if (truckData.hasOwnProperty("flag")) {
            // Flag attribute exists, update its value to -1
            await updateDoc(truckDocRef, { flag: 0 });
        } else {
            // Flag attribute doesn't exist, add it and set it to -1
            await updateDoc(truckDocRef, { flag: 0 });
        }
    } else {
        // Document with matching licensePlate does not exist, log a warning
        console.warn("Truck document does not exist");
    }
    setCartslide(x=>!x)
} catch (error) {
    console.error("Error handling truck deletion:", error);
}
}
const dateObject = new Date(truck.bookedUpto);

// Extracting the date in the format YYYY-MM-DD
// Check if dateObject is valid before calling toISOString()
const formattedDate = dateObject instanceof Date && !isNaN(dateObject) ? dateObject.toISOString().split('T')[0] : "";


  return (
    <div className="cart-products">
      <div className="cart-product">
        <div className="image-container">
          <img src={prod} alt="Product" />
          {/* <i className="fa-solid fa-truck-fast" style={{color:"#fc0", height:"24px", width:"24px"}}></i> */}
        </div>
        <div className="prod-details">
          <span className="name">{truck.makeModel}</span>
          {/* <div className="close-btn">
            <MdClose />
          </div> */}
            {ownerData && ownerData.id &&ownerData.id !== currentUser.uid&& (
  <div>Owner: {ownerData.name}</div>
)}
{renterData && ownerData && ownerData.id === currentUser.uid && (truck.flag===1||truck.flag===2)&&(
  <div>Renter: {renterData.name}</div>
)}
{ownerData && ownerData.id === currentUser.uid&&(truck.flag===1||truck.flag===2||truck.flag===0)&& (
  (truck.flag===2||truck.flag===1) ? (
    <div>Booked Upto: {formattedDate}</div>
  ) : (
    <div className="delete"><div>Ready To lease</div>
    <button onClick={handleDelete} className="deleteButton">Delete</button></div>
  )
)}
{renterData && ownerData && ownerData.id !== currentUser.id && (truck.flag===1||truck.flag===2)&&(
  <div>Phone: {renterData.phoneNo}</div>
)}
{ownerData && ownerData.id === currentUser.uid && truck.flag===1 && (
  // isDateValid ? (
  //   <div>Booked Upto: {formattedDate}</div>
  // ) : (
    <div className="delete">
    <button onClick={handleAccept} className="acceptButton">Accept</button>
    <button onClick={handleDecline} className="declineButton">Decline</button></div>
//)
)}


        </div>
      </div>
    </div>
  );
};

export default CartItem;
