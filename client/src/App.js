import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import LandingPage from "./pages/landingPage/LandingPage";
import TruckLending from "./pages/TruckLending/TruckLending";
import DriverLending from "./pages/DriverLending/DriverLending";
import ExtraDetails from "./pages/TruckLending/extraDetail"; // Renamed extraDetails to ExtraDetails
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { getFirestore, doc, getDoc,query,getDocs,collection,where } from "firebase/firestore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookCard from "../src/pages/bookCard/BookCard";
import BookDriver from "../src/pages/bookDriver/BookCard"
import Update from "./components/update/Update";
// const Loading = () => {
//   return (
//     <div>
//       <p>Loading...</p>
//     </div>
//   );
// };
function App() {
  const { currentUser } = useContext(AuthContext);
  const [isOwner, setIsOwner] = useState(null); // State to hold the value of isOwner
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);
  console.log(currentUser)
  console.log(isOwner)
  useEffect(() => {
    // Function to fetch user document and update isOwner state
    const fetchUserDocument = async () => {
        if (currentUser) {
        try {
           const firestore = getFirestore();
      
         // Create a query to find the document with the specified UID
         const q = query(collection(firestore, "user"), where("id", "==", currentUser.uid));
         const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
              // Assuming there's only one document with the specified UID, get its reference
              const userDocRef = doc(firestore, "user", querySnapshot.docs[0].id);
      
              // Fetch the document snapshot
              const userDocSnapshot = await getDoc(userDocRef);
              console.log(userDocSnapshot.data())
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                console.log(userData.isOwner)
                if(userData.isOwner === "1" &&userData.isOwner){

                setIsOwner(1); // Update isOwner state
                console.log("QQQQ")
                setIsLoading(false)
    }
    console.log(isOwner)
              } else { 
        setIsOwner(0)
                console.warn("User document does not exist");
              }
            } else {
        setIsOwner(0)
              console.warn("User document not found");
            }
          } catch (error) {
        setIsOwner(0)
            console.error("Error getting user document:", error);
            setIsLoading(false)
          }
        }
      };
      

    fetchUserDocument(); 
  }, [currentUser,isOwner]);

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-dark`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
          </div>
          <div id="contact"> <Footer/></div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/TruckLending",
          element: isOwner === 1 ? <TruckLending /> : <ExtraDetails />, 
        },
        {
          path: "/DriverLending",
          element:<DriverLending/>, 
        },
        {
          path: "/BookCard",
          element: <BookCard />,
        },
        {
          path: "/Bookdriver",
          element: <BookDriver />,
        },
        {
          path: "/update",
          element: <Update />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
