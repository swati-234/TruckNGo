import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import {auth} from "../../firebase"
import {
  SignInWithRedirect,
  signInWithRedirect
} from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import "./login.scss";
const Login = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser)
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs.email,inputs.password);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };
  const provider = new GoogleAuthProvider();
  const handleGoogleSignin = () => {
    signInWithRedirect(auth,provider)
  //   await updateProfile(userCredential.user, { displayName });
  //   const userData = {
  //     name: userCredential.user.displayName,
  //     id: userCredential.user.uid,
  //     isOwner: 0,
  //     isDriver: 0,
  //     isRenter: 0,
  //     isVerified: 0,
  //     aadharId: "",
  //     phoneNo: "",
  //     address: ""
  //   };
  //   await addDoc(userCollection, userData);
  //   return userCredential.user;
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
  }
  return (
    <div className="wrapperLogin">
      <div className="form-box login">
        <h2>Login</h2>
        <form>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="mail"></ion-icon>
            </span>
            <input
              type="text"
              name="email"
              onChange={handleChange}
              required
            />
            <label >Email</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <label>Password</label>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="#">Forgot Password</Link>
          </div>
          {err && <div className="error">{err}</div>}
          <button type="submit" className="btn" onClick={handleLogin}>
            Login
          </button>
          <button className="btn" onClick={handleGoogleSignin}>
            SignIn With Google
          </button>
          
          <div className="Email-display" style={{ display: "none" }}>
            Welcome, <span id="user-Email"></span>!
          </div>

          <div className="login-register">
            <p>
              Don't have an account?
              <br />
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
