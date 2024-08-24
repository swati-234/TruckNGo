import React, { useState, useEffect, useContext } from "react";
import "./BookCard.scss";
import { AuthContext } from '../../context/authContext';
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import 'firebase/firestore';
import { getDocs, query, where, doc, runTransaction, collection,getFirestore } from 'firebase/firestore';

export default function BookingModal({ truck, onClose, onBookNow }) {
  const firestore = getFirestore();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [kilometers, setKilometers] = useState('');
  const [bookUptoDate, setBookUptoDate] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    setCost(kilometers * truck.ratePerKm);
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
      LicensePlateNo: truck.licensePlate,
      flag:1
    };
    console.log(truck.licensePlate)
    try {
      const q = query(collection(firestore, "truck"), where("licensePlate", "==", bookForm.LicensePlateNo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('No truck found with the provided license plate number');
        return;
      }

      const truckId = querySnapshot.docs[0].id;
      const truckDocRef = doc(firestore, "truck", truckId);

      await runTransaction(firestore, async (transaction) => {
        const truckDoc = await transaction.get(truckDocRef);
        if (!truckDoc.exists) {
          throw new Error('Truck document does not exist');
        }

        const truckData = truckDoc.data();
        if (!truckData.bookedBy) {
          transaction.update(truckDocRef, { bookedBy: bookForm.BookedBy });
        }
        if (!truckData.bookedUpto) {
          transaction.update(truckDocRef, { bookedUpto: bookForm.BookedUpto });
        }
        if (!truckData.distanceBooked) {
          transaction.update(truckDocRef, { distanceBooked: bookForm.DistanceBooked });
        }
        if (!truckData.flag){
          transaction.update(truckDocRef, { flag: 1 });
        }
        else{
          transaction.update(truckDocRef, { flag: 1 });
        }
      });

      console.log('Truck successfully booked');
    } catch (error) {
      console.error('Error Booking:', error);
    }

    navigate("/");
    onClose();
  };

  var words = truck.makeModel.split(' ');

  return (
    <div className="booking-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{words[1]} - Booking Details</h2>
        <div className="bookImage">
        <img src={truck.imgURL} alt="Truck Image" />
        </div>
        <form>
          <div className="detailsBar">
            <div className="infoBar">
              <div className="line">
                <label>Make Model:</label>
                <input type="text" value={truck.makeModel} disabled />
                <label>License Plate No:</label>
                <input type="text" value={truck.licensePlate} disabled />
              </div>
              <div className="line">
                <label>Chasis No:</label>
                <input className="Chasis" type="text" value={truck.ChasisNo} disabled />
                <label className="weight">Weight Class:</label>
                <input className="weightText" type="text" value={truck.weightClass + ' Ton'} disabled />
              </div>
              <div className="line">
                <label>City:</label>
                <input type="text" value={truck.city} disabled />
                <label className="rate">Rate:</label>
                <input type="text" value={truck.ratePerKm + ' ₹'} disabled />
              </div>
            </div>
            <div className="formBar">
              <div className="line">
                <label>Kilometers:</label>
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
