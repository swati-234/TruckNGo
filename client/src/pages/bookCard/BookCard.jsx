
import React, { useState, useEffect } from "react";
import "./BookCard.scss";
import IconButton from "@mui/material/IconButton";
import DirectionsIcon from "@mui/icons-material/Directions";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Avatar from "@mui/material/Avatar";
import Header from "../../components/LandingPage/Header";
import Spinner from "../../components/Spinner";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import BookingModal from "./BookingModal";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from "../../firebase";
const iconButtonStyle = {
  cursor: "pointer",
  color: "#fc0",
};

function DestinationBox({ truck, onBookNowClick }) {
  const handleBookNowClick = () => {
    onBookNowClick(truck);
  };

  return (
    <div className="box">
      <div className="content">
      <img src={truck.imgURL} alt="Truck Image" />
        <h3>
          <IconButton style={iconButtonStyle}>
            <DirectionsIcon />
          </IconButton>{" "}
          {truck.city || "No City"}
          <div className="rating">
            {truck.ratePerKm}/Km{" "}
            <IconButton style={iconButtonStyle}>
              <CurrencyRupeeIcon />
            </IconButton>
          </div>
        </h3>
        <p onClick={handleBookNowClick}>{truck.makeModel}</p>
        <span>
          License Plate No: {truck.licensePlate || "No License Plate"}
        </span>
        <br />
        <span>Weight Class: {truck.weightClass || "No Weight Class"}</span>
        <br />
        <div className="bottmPlate">
          <span>Chasis No: {truck.ChasisNo || "No Chasis No"}</span>
          <button className="button-33" onClick={handleBookNowClick}>
            Book Now
          </button>
        </div>
        {/* Render image using img tag */}
      </div>
    </div>
  );
}
function BookCard() {
  const isDateValid = (truck) => {
    const currentDate = new Date(); // Get the current date
    const bookedUptoDate = new Date(truck.BookedUpto); // Parse the BookedUpto date from the truck
  
    // Compare the two dates
    return bookedUptoDate > currentDate;
  };
  
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", weightClass: "" });
  const [selectedTruck, setSelectedTruck] = useState(null);

  useEffect(() => {
    const firestore = getFirestore();
    const truckCollectionRef = collection(firestore, 'truck');

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(truckCollectionRef);
        const truckData = [];
        querySnapshot.forEach((doc) => {
          // Convert Firestore document to plain JavaScript object
          const data = doc.data();
          // Include document ID
          if( (data.flag!==-1&&data.flag!==2)){
            truckData.push({ id: doc.id, ...data });
          }
        });
        setTrucks(truckData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trucks:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // trucks = trucks[0]
  // trucks.map((truck) =>(console.log(truck.id)))
  const navigate = useNavigate();
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleBookNow = (truck) => {
    setSelectedTruck(truck);
  };

  const handleBookNowConfirmation = (truck, kilometers, date) => {
    console.log("Truck:", truck);
    console.log("Kilometers:", kilometers);
    console.log("Date:", date);
    
  };
 console.log(trucks);
  const filteredTrucks = trucks.filter((truck) => {
    return (
      (!filters.city ||
        truck.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.weightClass === "" ||
        (truck.weightClass !== null &&
          truck.weightClass.toString() === filters.weightClass))
    );
  });

  return (
    <div>
       <div className="bookingheader">
        <div className="bookingHeading">
          <h1>Browse</h1>
        </div>
        <div className="filters">
          <label className="cityFilter">
            City:
            <Select
              style={{ border: "1px solid black", background:"white" , marginLeft:"10px", padding:"0px  10px ", borderRadius:"10px" }}
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            >
              <MenuItem value="">City</MenuItem>
              <MenuItem value="Varanasi">Varanasi</MenuItem>
              <MenuItem value="Goa">Goa</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Kolkata">Kolkata</MenuItem>
              <MenuItem value="Vadodara">Vadodara</MenuItem>
              <MenuItem value="Dehradun">Dheradun</MenuItem>
              <MenuItem value="Jabalpur">Jabalpur</MenuItem>
            </Select>
          </label>
          
          <label className="weightClass">
            Weight Class:
            <Select
              style={{ border: "1px solid black", background:"white" , marginLeft:"10px", padding:"0px 10px ", borderRadius:"10px" }}
              value={filters.weightClass}
              onChange={(e) => handleFilterChange("weightClass", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="8">8 Ton</MenuItem>
              <MenuItem value="10">10 Ton</MenuItem>
              <MenuItem value="12">12 Ton</MenuItem>
            </Select>
          </label>
        </div>
        </div>
      <section className="destination" id="destination">
        {loading ? (
          <Spinner />
        ) : (
          <div className="box-container" id="destination-container">
            {filteredTrucks.map((truck, index) => (
  !isDateValid(truck) && (
    <DestinationBox
      key={index}
      truck={truck}
      onBookNowClick={() => handleBookNow(truck)}
    />
  )
))}
          </div>
        )}
      </section>

      {selectedTruck && (
        <BookingModal
          truck={selectedTruck}
          onClose={() => setSelectedTruck(null)}
          onBookNow={handleBookNowConfirmation}
        />
      )}
    </div>
  );
}

export default BookCard;
