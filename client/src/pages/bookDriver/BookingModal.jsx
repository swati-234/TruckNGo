import React, { useState, useEffect, useContext } from "react";
import "./BookCard.scss";
import { AuthContext } from '../../context/authContext';
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import 'firebase/firestore';
import { getDocs, query, where, doc, runTransaction, collection,getFirestore } from 'firebase/firestore';

export default function BookingModal({ driver, onClose, onBookNow }) {
  const firestore = getFirestore();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [kilometers, setKilometers] = useState('');
  const [bookUptoDate, setBookUptoDate] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    setCost(kilometers * driver.pricePerDay);
  }, [kilometers]);

  const handleBookNowClick = async () => {
    if (!kilometers || isNaN(parseFloat(kilometers))) {
      alert('Please enter a valid number of kilometers.');
      return;
    }

    if (!bookUptoDate) {
      alert('Please select a booking date.');
      return;
    }

    const bookForm = {
      BookedUpto: bookUptoDate,
      DistanceBooked: kilometers,
      BookedBy: currentUser.uid,
      LicenseNo: driver.licenseNo,
      flag:1
    };
    console.log(driver.licensePlate)
    try {
      const q = query(collection(firestore, "driver"), where("licenseNo", "==", bookForm.LicenseNo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('No truck found with the provided license plate number');
        return;
      }

      const driverId = querySnapshot.docs[0].id;
      const driverDocRef = doc(firestore, "driver", driverId);

      await runTransaction(firestore, async (transaction) => {
        const driverDoc = await transaction.get(driverDocRef);
        if (!driverDoc.exists) {
          throw new Error('Truck document does not exist');
        }

        const driverData = driverDoc.data();
        if (!driverData.bookedBy) {
          transaction.update(driverDocRef, { bookedBy: bookForm.BookedBy });
        }
        if (!driverData.bookedUpto) {
          transaction.update(driverDocRef, { bookedUpto: bookForm.BookedUpto });
        }
        if (!driverData.distanceBooked) {
          transaction.update(driverDocRef, { distanceBooked: bookForm.DistanceBooked });
        }
        if (!driverData.flag){
          transaction.update(driverDocRef, { flag: 1 });
        }
        else{
          transaction.update(driverDocRef, { flag: 1 });
        }
      });

      console.log('Driver successfully booked');
    } catch (error) {
      console.error('Error Booking:', error);
    }

    navigate("/");
    onClose();
  };

  var words = driver.name.split(' ');

  return (
    <div className="booking-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{words[1]} - Booking Details</h2>
        <div className="bookImage">
        <img src={driver.imgURL} alt="Truck Image" />
        </div>
        <form>
          <div className="detailsBar">
            <div className="infoBar">
              <div className="line">
                <label>Name:</label>
                <input type="text" value={driver.name} disabled />
                <label>License No:</label>
                <input type="text" value={driver.licenseNo} disabled />
              </div>
              <div className="line">
                <label>Phone No:</label>
                <input className="Chasis" type="text" value={driver.phoneNo} disabled />
                <label className="weight">Aadhar ID:</label>
                <input className="weightText" type="text" value={driver.aadharId} disabled />
              </div>
              <div className="line">
                <label>City:</label>
                <input type="text" value={driver.city} disabled />
                <label className="rate">Rate:</label>
                <input type="text" value={driver.pricePerDay + ' ₹'} disabled />
              </div>
            </div>
            <div className="formBar">
              <div className="line">
                <label>Days:</label>
                <input
                  type="number"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                />

                <label className="book">Book Upto Date:</label>
                <input
                  type="date"
                  value={bookUptoDate}
                  onChange={(e) => setBookUptoDate(e.target.value)}
                />
              </div>
              <div className="line">
                <label className="cost">Total Cost:</label>
                <input type="text" value={'₹ ' + cost} disabled />
                <button className="bookBtn" type="button" onClick={handleBookNowClick}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
