import "./Cart.scss";
import CartItem from "./CartItem/CartItem";
import CartItemDriver from "./CartItem/CartItemDriver";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../context/authContext';
import axios from "axios";
import { getFirestore, collection, getDocs,query,where } from 'firebase/firestore';
const Cart = ({ setCartslide }) => {
  const firestore = getFirestore()
  const [ownedTruck, setOwnedTruck] = useState([]);
  const [rentTruck, setRentTruck] = useState([]); 
  const [truckRequests, setTruckRequests] = useState([]); 
  const [ownedDriver,setOwnedDriver] = useState([]);
  const [rentDriver,setRentDriver] = useState([]);
  const [driverRequests,setDriverRequests] = useState([]);
  let hcOwnedTruck ;
  let hcRentTruck ;
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser.uid)
  useEffect(() => {
    const fetchOwnedTrucks = async () => {
      try {
          const truckRef = collection(firestore,"truck");
          const q = query(collection(firestore, "truck"), where("owner", "==", currentUser.uid));
         const querySnapshot = await getDocs(q);
          // const querySnapshot = await truckRef.where("owner", "==", currentUser.uid).get();
          
          const ownedTrucks = [];
          querySnapshot.forEach((doc) => {
            const truckData = doc.data();
            if (!truckData.hasOwnProperty("flag") || (truckData.flag !==-1 && truckData.flag!=1)) {
              ownedTrucks.push({ id: doc.id, ...truckData });
          }
          });
  
          setOwnedTruck(ownedTrucks);
          console.log(ownedTrucks)
      } catch (error) {
          console.error("Error fetching owned trucks:", error);
      }
  };
  
    const fetchRentTrucks = async () => {
      try {
        const truckRef = collection(firestore,"truck");
        const q = query(collection(firestore, "truck"), where("bookedBy", "==", currentUser.uid));
       const querySnapshot = await getDocs(q);
        // const querySnapshot = await truckRef.where("owner", "==", currentUser.uid).get();
        
        const rentedTrucks = [];
        querySnapshot.forEach((doc) => {
          const truckData = doc.data();
          if (truckData.hasOwnProperty("flag") && (truckData.flag===2)) {
            rentedTrucks.push({ id: doc.id, ...truckData });
        }
        });

        setRentTruck(rentedTrucks);
        console.log(rentedTrucks)
    } catch (error) {
        console.error("Error fetching owned trucks:", error);
    }
    };
    const fetchTruckRequests = async () => {
      try {
        const truckRef = collection(firestore,"truck");
        const q = query(collection(firestore, "truck"), where("owner", "==", currentUser.uid));
       const querySnapshot = await getDocs(q);
        // const querySnapshot = await truckRef.where("owner", "==", currentUser.uid).get();
        
        const truckRequests = [];
        querySnapshot.forEach((doc) => {
          const truckData = doc.data();
            if (truckData.hasOwnProperty("flag") && (truckData.flag===1)) {
              truckRequests.push({ id: doc.id, ...truckData });
          }
           
        });

        setTruckRequests(truckRequests);
        // console.log(rentedTrucks)
    } catch (error) {
        console.error("Error fetching owned trucks:", error);
    }
    };
    Promise.all([fetchOwnedTrucks(), fetchRentTrucks(),fetchTruckRequests()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [currentUser.id]);
  useEffect(() => {
    const fetchOwnedDrivers = async () => {
      try {
          const truckRef = collection(firestore,"driver");
          const q = query(collection(firestore, "driver"), where("id", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          // const querySnapshot = await driverRef.where("owner", "==", currentUser.uid).get();
          console.log(querySnapshot)
          
          const ownedDrivers = [];
          querySnapshot.forEach((doc) => {
            const driverData = doc.data();
            if (!driverData.hasOwnProperty("flag") || (driverData.flag !==-1 && driverData.flag!=1)) {
              ownedDrivers.push({ id: doc.id, ...driverData });
          }
          });
  
          setOwnedDriver(ownedDrivers);
          console.log(ownedDrivers)
      } catch (error) {
          console.error("Error fetching owned drivers:", error);
      }
  };
  
    const fetchRentDriver = async () => {
      try {
        const truckRef = collection(firestore,"driver");
        const q = query(collection(firestore, "driver"), where("bookedBy", "==", currentUser.uid));
       const querySnapshot = await getDocs(q);
        // const querySnapshot = await DriverRef.where("owner", "==", currentUser.uid).get();
        
        const rentedDrivers = [];
        querySnapshot.forEach((doc) => {
          const driverData = doc.data();
          if (driverData.hasOwnProperty("flag") && (driverData.flag===2)) {
            rentedDrivers.push({ id: doc.id, ...driverData });
        }
        });

        setRentDriver(rentedDrivers);
        console.log(rentedDrivers)
    } catch (error) {
        console.error("Error fetching owned Drivers:", error);
    }
    };
    const fetchDriverRequests = async () => {
      try {
        const DriverRef = collection(firestore,"driver");
        const q = query(collection(firestore, "driver"), where("id", "==", currentUser.uid));
       const querySnapshot = await getDocs(q);
        // const querySnapshot = await DriverRef.where("owner", "==", currentUser.uid).get();
        
        const driverRequests = [];
        querySnapshot.forEach((doc) => {
          const driverData = doc.data();
            if (driverData.hasOwnProperty("flag") && (driverData.flag===1)) {
              driverRequests.push({ id: doc.id, ...driverData });
          }
           
        });

        setDriverRequests(driverRequests);
        // console.log(rentedDrivers)
    } catch (error) {
        console.error("Error fetching owned Drivers:", error);
    }
    };
    Promise.all([fetchOwnedDrivers(), fetchRentDriver(),fetchDriverRequests()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [currentUser.id]);

  if (!loading) {
    // hcOwnedTruck = ownedTruck;
    // hcRentTruck  = rentTruck;
    console.log(ownedTruck);
    console.log("hi");
    console.log(rentTruck); 
  }

  return (
    <div className="cart-layout">
      <div className="opaque-layer"></div>
      <div className="cart-layer">
        <div className="header">
          <span>Manage</span>
          <div
            className="close-button"
            onClick={() => setCartslide((x) => !x)}
          ></div>
        </div>
        
        {/* <div className="empty-cart">
          <BsCartX />
          <p>Nothing in here !</p>
          <span>Return To Shopping</span>
        </div> */}
        <>
        <div className="headText3">
          <span>Your Trucks</span>
          <div
            className="close-button"
            onClick={() => setCartslide((x) => !x)}
          ></div>
          </div>

          <div className="headText1">Trucks You Own</div>
          <div className="cart-items">
          {ownedTruck.map((truck) => (
              <CartItem key={truck.id} truck={truck} setCartslide = {setCartslide} />
            ))}
          </div>
          <div className="headText2">Trucks You Rent</div>
          <div className="cart-items">
          {rentTruck.map((truck) => (
              <CartItem key={truck.id} truck={truck} setCartslide = {setCartslide}/>
            ))}
          </div>
          <div className="headText2">Requests for Bookings</div>
          <div className="cart-items">
          {truckRequests.map((truck) => (
              <CartItem key={truck.id} truck={truck} setCartslide = {setCartslide}/>
            ))}
          </div>

          
          {/* <div className="cart-footer">
            <div className="subtotal">
              <span className="text">Subtotal:</span>
              <span className="text total">&#8377;12234</span>
            </div>
            <div className="button">
              <button className="checkout-cta">Checkout</button>
            </div>
          </div> */}
          <div>
          <div className="headText3">
          <span>Your Jobs</span>
          <div
            className="close-button"
            onClick={() => setCartslide((x) => !x)}
          ></div>
          </div>

        </div>
          <div className="headText1">Current Job</div>
          <div className="cart-items">
          {ownedDriver.map((driver) => (
              <CartItemDriver key={driver.id} driver={driver} setCartslide = {setCartslide} />
            ))}
          </div>
          <div className="headText2">Hired Drivers</div>
          <div className="cart-items">
          {rentDriver.map((driver) => (
              <CartItemDriver key={driver.id} driver={driver} setCartslide = {setCartslide}/>
            ))}
          </div>
          <div className="headText2">Requests for Hiring</div>
          <div className="cart-items">
          {driverRequests.map((driver) => (
              <CartItemDriver key={driver.id} driver={driver} setCartslide = {setCartslide}/>
            ))}
          </div>
          {/* <div className="cart-footer">
            <div className="subtotal">
              <span className="text">Subtotal:</span>
              <span className="text total">&#8377;12234</span>
            </div>
            <div className="button">
              <button className="checkout-cta">Checkout</button>
            </div>
          </div> */}
        </>
      </div>
    </div>
  );
};

export default Cart;
