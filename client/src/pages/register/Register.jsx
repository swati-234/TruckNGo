import React, { useContext, useState } from "react";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { AuthContext } from "../../context/authContext";
// import { register } from "../../../../api/Handlers/auth";
const Register = () => {
  const {register} = useContext(AuthContext)
  const [inputs, setInputs] = useState({
    email:"",
    password:"",
    name:""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if((inputs.email==="")||(inputs.password==="")||(inputs.name==="")){
        console.log("Not all feilds are filled");
        setError("Enter all the feilds");
        return;
    }
    try {
      await register(inputs.email,inputs.password,inputs.name);
      navigate("/");
    } catch (err) {
      navigate("/");
      setError(err.response.data);
    }
  };
  console.log(error)
  return (
    <>
    <div className="Rwrapper">
        <div className="form-box register">
        <h2>Registration</h2>
        
         <form>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="person"></ion-icon>
            </span>
            <input
              type="email"
              placeholder=""
              name="email"
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input
              type="password"
              placeholder=""
              name="password"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <label>Password</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input
              type="name"
              placeholder=""
              name="name"
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <label>Name</label>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn" onClick={handleClick}>
            Register
          </button>
          <div className="login-register">
            <p>
              Already have an account?<br />
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </form> 
      </div>
      </div>
    </>
  );
};

export default Register;
