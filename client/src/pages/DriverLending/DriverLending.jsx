import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getFirestore,doc,updateDoc } from 'firebase/firestore';
import {app} from "../../firebase"
import { useContext,AuthContext } from 'react';
const DriverLending = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  console.log(currentUser.uid)
  const [formData, setFormData] = useState({
    name:"",
    licenseNo: "",
    phoneNo: "",
    aadharId: "",
    pricePerDay: "",
    city: "",
    imgURL: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    const storage = getStorage();
    const imageRef = ref(storage, `images/${formData.image.name}`);
    await uploadBytes(imageRef, formData.image);

    // Get image URL
    const imgURL = await getDownloadURL(imageRef);

    // Add truck document to Firestore
    const firestore = getFirestore();
    const truckCollectionRef = collection(firestore, "driver");
    await addDoc(truckCollectionRef, {
      name:formData.name,
      licenseNo: formData.licenseNo,
      phoneNo: formData.phoneNo,
      aadharId: formData.aadharId,
      pricePerDay: formData.pricePerDay,
      city: formData.city,
      imgURL: imgURL,
      id:currentUser.uid,
      flag: 0
    });
    // const uid = currentUser.uid
    // const setIsDriver = async (uid, isDriverValue) => {
    //   try {
    //     // Get a reference to the user document with the specified UID
    //     const userDocRef = doc(app.firestore(), 'user', uid);
    
    //     // Update the isDriver field of the user document
    //     await updateDoc(userDocRef, {
    //       isDriver: 1 // Set the value of isDriver field
    //     });
    
    //     console.log('isDriver field updated successfully');
    //   } catch (error) {
    //     console.error('Error updating isDriver field:', error);
    //   }
    // };
    setFormData({
      name:'',
      licenseNo: "",
    phoneNo: "",
    aadharId: "",
    pricePerDay: "",
    city: "",
    imgURL: "",
    image: null,
    flag: 0 
    });
    navigate("/")
  };
  return (
    <div>
      <div className="Truck_lendingform-box2">
        <form onSubmit={handleSubmit} style={{ width: '70%' }}>
          <p style={{ color: 'gray', textAlign: 'left' }}>Enter your details</p>
          <div className="input-box">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              // required
            />
            <label>Name</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              // required
            />
            <label>Licence No.</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              name="aadharId"
              value={formData.aadharId}
              onChange={handleChange}
              // required
            />
            <label>Aadhar ID</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              // required
            />
            <label>Phone No.</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              // required
            />
            <label>Charge Per Day</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <label>Your City:</label>
          </div>
          <form className='photoForm' encType="multipart/form-data"  style={{ width: '100%' }}>
        <div className="input-image-box">
          <input accept="image/*" type='file' name='file' onChange={handleImageChange}/>
          </div>
          </form>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
       
      </div>
    </div>
  );
}

 export default DriverLending;

// import React, { useState } from "react";
// import "./TruckLending.scss";
// import { useContext } from "react";
// import { AuthContext } from "../../context/authContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function TruckLending() {
//   const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     phone: "",
//     address: "",
//     aadharId: "",
//     licensePlate: "",
//     ChasisNo: "",
//     makeModel: "",
//     ratePerKm: "",
//     weightClass: "0",
//     isOwner: 1,
//     city: "",
//   });
//   const [image, setImage] = useState(null);

//   const userFormData = {
//     phone: formData.phone,
//     address: formData.address,
//     isOwner: "1",
//     aadhar: formData.aadharId,
//     username: currentUser.username,
//   };
//   const truckFormData = new FormData();
//   truckFormData.append("LicensePlateNo", formData.licensePlate);
//   truckFormData.append("ChasisNo", formData.ChasisNo);
//   truckFormData.append("MakeModel", formData.makeModel);
//   truckFormData.append("RatePerKm", formData.ratePerKm);
//   truckFormData.append("WeightClass", formData.weightClass);
//   truckFormData.append("OwnerId", currentUser.id);
//   truckFormData.append("city", formData.city);
//   if (image) {
//     truckFormData.append("image", image);
//   }

//   const handleImage = (e) => {
//     const selectedImage = e.target.files[0];
//     setFormData({ ...formData, image: selectedImage });

//     if (selectedImage) {
//       setImage(selectedImage);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(userFormData);
//     // try {
//     //   const responseUser = await axios.put(
//     //     'http://localhost:3400/api/user/updateUser',
//     //     userFormData,
//     //     {
//     //       withCredentials: true,
//     //       // headers: {
//     //       //   'Content-Type': 'multipart/form-data',
//     //       // },
//     //     }
//     //   );

//     //   const responseTruck = await axios.post(
//     //     'http://localhost:3400/api/truck/addTruck',
//     //     truckFormData,
//     //     {
//     //       withCredentials: true,
//     //       headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //       },
//     //     }
//     //   );

//     //   // Use the responses as needed
//     //   console.log(responseUser.data);
//     //   console.log(responseTruck.data);
//     // } catch (error) {
//     //   console.error('Error submitting the form:', error.response.data);
//     // }
//     try {
//       const response = await axios.put(
//         "http://localhost:3400/api/user/updateUser",
//         userFormData,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error updating user profile:", error.response.data);
//     }
//     try {
//       const response = await axios.post(
//         "http://localhost:3400/api/truck/addTruck",
//         truckFormData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error adding your truck:", error.response.data);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div>
//       <div className="Truck_lendingform-box2">
//         <form onSubmit={handleSubmit} style={{ width: "70%" }}>
//           <div className="input-box">
//             <input
//               type="text"
//               maxLength="10"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               // required
//             />
//             <label>Phone No.</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               // required
//             />
//             <label>Address</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="text"
//               name="aadharId"
//               value={formData.aadharId}
//               onChange={handleChange}
//               // required
//             />
//             <label>Aadhar ID</label>
//           </div>

//           <p style={{ color: "gray", textAlign: "left" }}>
//             Enter your Truck details
//           </p>
//           <div className="input-box">
//             <input
//               type="text"
//               name="licensePlate"
//               value={formData.licensePlate}
//               onChange={handleChange}
//               // required
//             />
//             <label>Licence Plate No.</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="number"
//               name="ChasisNo"
//               value={formData.ChasisNo}
//               onChange={handleChange}
//               // required
//             />
//             <label>Chasis No.</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="text"
//               name="makeModel"
//               value={formData.makeModel}
//               onChange={handleChange}
//               // required
//             />
//             <label>Make & Model</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="number"
//               name="ratePerKm"
//               value={formData.ratePerKm}
//               onChange={handleChange}
//               // required
//             />
//             <label>Rate per KM</label>
//           </div>
//           <div className="input-box">
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//             />
//             <label>City Of Truck:</label>
//           </div>
//           <div className="input-box">
//             <label htmlFor="weight">Weight Class</label>
//             <br />
//             <select
//               name="weightClass"
//               value={formData.weightClass}
//               onChange={handleChange}
//             >
//               <option value="0" selected></option>
//               <option value="8">8 ton</option>
//               <option value="10">10 ton</option>
//               <option value="12">12 ton</option>
//             </select>
//           </div>
//           <div className="input-box">
//             <input
//               accept="image/*"
//               type="file"
//               name="file"
//               onChange={handleImage}
//             />
//           </div>

//           <button type="submit" className="btn">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TruckLending;
