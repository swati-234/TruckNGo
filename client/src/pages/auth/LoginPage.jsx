import { React } from "react";
import { useState, useRef } from "react";
import "./loginPage.scss";
import { auth } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
function LoginPage({ setAuthtile }) {
  const mountedStyle = { animation: "inAnimation 250ms ease-in" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);
  const [newUser, setNewuser] = useState("");
  const provider = new GoogleAuthProvider();
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(newUser)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      setAuthtile((x) => !x); // Update auth state
    } catch (error) {
      const errorCode = error.code;
      setErrorMessage(errorCode);
      console.error(error.message); // Log the error message for debugging
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(email)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      setAuthtile((x) => !x); // Update auth state
    } catch (error) {
      const errorCode = error.code;
      setErrorMessage(errorCode);
      console.error(error.message); // Log the error message for debugging
    }
  };
  const handleGoogleSignin = () => {
    signInWithRedirect(auth, provider);
  };
  return (
    <>
      <div className="transparentBG">
        <div className="box">
          <div className="authHead">
            <button id="close" onClick={() => setAuthtile((x) => !x)}>
              close
            </button>
          </div>
          <div className="bodywrap">
            <div id="Sign">
              <h1>
                Sign{" "}
                {newUser ? (
                  <span className="transitionDiv" style={mountedStyle}>
                    up
                  </span>
                ) : (
                  <span className="transitionDiv">in</span>
                )}{" "}
                to CRATE
              </h1>
            </div>
            <a onClick={handleGoogleSignin} className="authBtn">
              <img
                src={require("../../assets/google.png")}
                alt="google_logo"
                id="glogo"
              />
              <p>Sign in with Google</p>
            </a>
            <a href="#" className="btn1">
              <img
                src={require("../../assets/apple.png")}
                alt="apple_logo"
                id="alogo"
              />
              <p>Sign in with Apple</p>
            </a>
            <div id="line">
              <p className="authPara">or</p>
            </div>
            <div className="input">
              <form
                ref={formRef}
                onSubmit={newUser?handleSignUp:handleLogin}
              >
                <input
                  type="email"
                  className="other_login_cred"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Phone,email or username."
                />

                <input
                  type="password"
                  className="other_login_cred"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {!newUser ? (
                  <p>
                    New here ?{" "}
                    <span onClick={() => setNewuser((x) => !x)}> Sign Up</span>
                  </p>
                ) : (
                  <p>
                    Already a user ?{" "}
                    <span
                      style={mountedStyle}
                      onClick={() => setNewuser((x) => !x)}
                    >
                      {" "}
                      Sign in
                    </span>
                  </p>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit" id="btn3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
