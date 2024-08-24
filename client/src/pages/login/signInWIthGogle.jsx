import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

const SignInWithGoogle = () => {
  const handleSignInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      console.log("Signed in user:", user);
      // You can perform additional actions after successful sign-in, such as updating state or navigating to another page
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
  );
};

export default SignInWithGoogle;
