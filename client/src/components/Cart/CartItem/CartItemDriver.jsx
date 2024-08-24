import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import prod from "../../../assets/truck1.jpg";
import axios from "axios";
import "./CartItem.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { getFirestore,where,getDocs,doc,getDoc,collection,query,updateDoc } from "firebase/firestore";
const CartItemDriver = ({ driver,setCartslide }) => {
  console.log(driver.flag)
  const firestore = getFirestore()
  // console.log(driver)
  const [dbDate, setDbDate] = useState(driver.bookedUpto);
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
  console.log(driver.licensePlate)
  }
  const { currentUser } = useContext(AuthContext);
  const [ownerData, setOwnerData] = useState(null);
  const [renterData, setRenterData] = useState(null);
  // console.log(driver.bookedBy);
  useEffect(() => {
    const fetchUserData = async (userId, setData) => {
      try {
        const userRef = collection(firestore,"user");
          const q = query(collection(firestore, "user"), where("id", "==", userId));
         const querySnapshot = await getDocs(q);
          // const querySnapshot = await driverRef.where("owner", "==", currentUser.uid).get();
          
          
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
    if (driver.id) {
      fetchUserData(driver.id, setOwnerData);
    }
    // Fetch renter data
    if (driver.bookedBy) {
      fetchUserData(driver.bookedBy, setRenterData);
    }
  }, [driver.owner, driver.bookedBy]);
  console.log(driver.licensePlate)
  const handleDelete = async () => {
    console.log(driver.licensePlate)
    try {
        const q = query(collection(firestore, "driver"), where("licenseNo", "==", driver.licenseNo));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Document with matching licensePlate exists
            const driverDocRef = querySnapshot.docs[0].ref;
            const driverData = querySnapshot.docs[0].data();
            
            // Check if flag attribute exists
            if (driverData.hasOwnProperty("flag")) {
                // Flag attribute exists, update its value to -1
                await updateDoc(driverDocRef, { flag: -1 });
            } else {
                // Flag attribute doesn't exist, add it and set it to -1
                await updateDoc(driverDocRef, { flag: -1 });
            }
        } else {
            // Document with matching licensePlate does not exist, log a warning
            console.warn("driver document does not exist");
        }
        setCartslide(x=>!x)
    } catch (error) {
        console.error("Error handling driver deletion:", error);
    }
};
const handleAccept = async () =>{
  try {
    const q = query(collection(firestore, "driver"), where("licenseNo", "==", driver.licenseNo));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Document with matching licensePlate exists
        const driverDocRef = querySnapshot.docs[0].ref;
        const driverData = querySnapshot.docs[0].data();
        
        // Check if flag attribute exists
        if (driverData.hasOwnProperty("flag")) {
            // Flag attribute exists, update its value to -1
            await updateDoc(driverDocRef, { flag: 2 });
        } else {
            // Flag attribute doesn't exist, add it and set it to -1
            await updateDoc(driverDocRef, { flag: 2 });
        }
    } else {
        // Document with matching licensePlate does not exist, log a warning
        console.warn("driver document does not exist");
    }
    setCartslide(x=>!x)
} catch (error) {
    console.error("Error handling driver deletion:", error);
}
}
const handleDecline = async () =>{
  try {
    const q = query(collection(firestore, "driver"), where("licenseNo", "==", driver.licenseNo));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Document with matching licensePlate exists
        const driverDocRef = querySnapshot.docs[0].ref;
        const driverData = querySnapshot.docs[0].data();
        
        // Check if flag attribute exists
        if (driverData.hasOwnProperty("flag")) {
            // Flag attribute exists, update its value to -1
            await updateDoc(driverDocRef, { flag: 0 });
        } else {
            // Flag attribute doesn't exist, add it and set it to -1
            await updateDoc(driverDocRef, { flag: 0 });
        }
    } else {
        // Document with matching licensePlate does not exist, log a warning
        console.warn("driver document does not exist");
    }
    setCartslide(x=>!x)
} catch (error) {
    console.error("Error handling driver deletion:", error);
}
}
const dateObject = new Date(driver.bookedUpto);

// Extracting the date in the format YYYY-MM-DD
// Check if dateObject is valid before calling toISOString()
const formattedDate = dateObject instanceof Date && !isNaN(dateObject) ? dateObject.toISOString().split('T')[0] : "";


  return (
    <div className="cart-products">
      <div className="cart-product">
        <div className="image-container">
          <img src={prod} alt="Product" />
          {/* <i className="fa-solid fa-driver-fast" style={{color:"#fc0", height:"24px", width:"24px"}}></i> */}
        </div>
        <div className="prod-details">
          <span className="name">{driver.makeModel}</span>
          {/* <div className="close-btn">
            <MdClose />
          </div> */}
            {ownerData && ownerData.id &&ownerData.id !== currentUser.uid&& (
  <div>Driver: {ownerData.name}</div>
)}
{renterData && ownerData && ownerData.id === currentUser.uid && (driver.flag===1||driver.flag===2)&&(
  <div>Hirer: {renterData.name}</div>
)}
{ownerData && ownerData.id === currentUser.uid&&(driver.flag===1||driver.flag===2||driver.flag===0)&& (
  (driver.flag===2||driver.flag===1) ? (
    <div>Booked Upto: {formattedDate}</div>
  ) : (
    <div className="delete"><div>Ready To lease</div>
    <button onClick={handleDelete} className="deleteButton">Delete</button></div>
  )
)}
{renterData && ownerData && ownerData.id !== currentUser.id && (driver.flag===1||driver.flag===2)&&(
  <div>Phone: {renterData.phoneNo}</div>
)}
{ownerData && ownerData.id === currentUser.uid && driver.flag===1 && (
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

export default CartItemDriver;
