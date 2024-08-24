
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

function DestinationBox({ driver, onBookNowClick }) {
  const handleBookNowClick = () => {
    onBookNowClick(driver);
  };

  return (
    <div className="box">
      <div className="content">
      <img src={driver.imgURL} alt=" Image" />
        <h3>
          <IconButton style={iconButtonStyle}>
            <DirectionsIcon />
          </IconButton>{" "}
          {driver.city || "No City"}
          <div className="rating">
            {driver.pricePerDay}{" "}
            <IconButton style={iconButtonStyle}>
              <CurrencyRupeeIcon />
            </IconButton>
          </div>
        </h3>
        <p onClick={handleBookNowClick}>{driver.phoneNo}</p>
        <span>
          Name: {driver.name || "No Name"}
        </span>
        <br />
        <span>License No.: {driver.licenseNo || "No License No"}</span>
        <br />
        <div className="bottmPlate">
          <span>Phone No: {driver.phoneNo || "No Chasis No"}</span>
          <button className="button-33" onClick={handleBookNowClick}>
            Book Now
          </button>
        </div>
        {/* Render image using img tag */}
      </div>
    </div>
  );
}
function BookDriver() {
  const isDateValid = (truck) => {
    const currentDate = new Date(); // Get the current date
    const bookedUptoDate = new Date(truck.BookedUpto); // Parse the BookedUpto date from the truck
  
    // Compare the two dates
    return bookedUptoDate > currentDate;
  };
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", weightClass: "" });
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    const firestore = getFirestore();
    const driverCollectionRef = collection(firestore, 'driver');

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(driverCollectionRef);
        const driverData = [];
        querySnapshot.forEach((doc) => {
          // Convert Firestore document to plain JavaScript object
          const data = doc.data();
          // Include document ID
          if( (data.flag!==-1&&data.flag!==2)){
            driverData.push({ id: doc.id, ...data });
          }
        });
        setDrivers(driverData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Drivers:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // drivers = trucks[0]
  // trucks.map((truck) =>(console.log(truck.id)))
  const navigate = useNavigate();
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleBookNow = (driver) => {
    setSelectedDriver(driver);
  };

  const handleBookNowConfirmation = (truck, kilometers, date) => {
    console.log("Truck:", truck);
    console.log("Kilometers:", kilometers);
    console.log("Date:", date);
    
  };
 console.log(drivers);
  const filteredDrivers = drivers.filter((driver) => {
    return (
      (!filters.city ||
        driver.city?.toLowerCase().includes(filters.city.toLowerCase()))
    );
  });

  return (
    <div>
       <div className="bookingheader">
        <div className="bookingHeading">
          <h1>Browse</h1>
        </div>
        </div>
      <section className="destination" id="destination">
        {loading ? (
          <Spinner />
        ) : (
          <div className="box-container" id="destination-container">
            {filteredDrivers.map((driver, index) => (
  !isDateValid(driver) && (
    <DestinationBox
      key={index}
      driver={driver}
      onBookNowClick={() => handleBookNow(driver)}
    />
  )
))}       
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
        </div>
          </div>
        )}
      </section>

      {selectedDriver && (
        <BookingModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onBookNow={handleBookNowConfirmation}
        />
      )}
    </div>
  );
}

export default BookDriver;
