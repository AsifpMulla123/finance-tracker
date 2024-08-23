import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { auth, db, provider } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function signupWithEmail(e) {
    setLoading(true);
    e.preventDefault();
    console.log("Name : ", name);
    console.log("Email : ", email);
    console.log("Password : ", password);
    console.log("Confirm Password : ", confirmPassword);
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            // console.log("user>>>>", user);
            toast.success("User Created successfully.");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            // creating a doc with the user id
            createDoc(user);
          })
          .catch((error) => {
            const userCode = error.code;
            console.log(userCode);
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password Don't match");
        setLoading(false);
      }
    } else {
      toast.error("All Fields are mandatory");
      setLoading(false);
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : user.name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc Already Exits");
      setLoading(false);
    }
  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          const user = result.user;
          // console.log(`token : ${token} and user : ${user}`);
          createDoc(user);
          navigate("/dashboard");
          setLoading(false);
          toast.success("user Authenticated");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          // console.log(
          //   `errorCode : ${errorCode} and errorMessage : ${errorMessage} and email : ${email} and credential : ${credential}`
          // );
          setLoading(false);
          toast.error(errorMessage);
        });
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }
  return (
    <div className="w-fit h-full shadow-2xl relative top-2/4 left-2/4 -translate-x-1/2 mt-8 p-6 rounded-lg">
      <h2 className="text-center font-semibold text-3xl mt-2">
        Sign Up on <span className="text-blue-500 font-semibold">FinTrack</span>
      </h2>
      <form className="pt-4">
        <div className="flex flex-col">
          <p>Full Name</p>
          <input
            type="text"
            placeholder="John Doe"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col pt-4">
          <p>Email</p>
          <input
            type="email"
            placeholder="JohnDoe@gmail.com"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col pt-4">
          <p>Password</p>
          <input
            value={password}
            type="password"
            placeholder="Example@123"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col pt-4">
          <p>Confirm Password</p>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Example@123"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 text-white w-full rounded-sm py-2 px-8 font-medium mt-4 hover:bg-blue-600"
          onClick={(e) => signupWithEmail(e)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <p className="text-center my-2">Or</p>
      <button
        className="flex justify-center items-center gap-2 border border-blue-500 w-full py-2 px-8 hover:bg-blue-500 hover:text-white font-medium"
        disabled={loading}
        onClick={googleAuth}
      >
        <FcGoogle />
        {loading ? "Loading..." : "Sign Up with Google"}
      </button>
      <p className="text-center mt-3">
        Already Have an Account?{" "}
        <Link
          to="/login"
          className="text-blue-500 cursor-pointer hover:underline"
        >
          sign in
        </Link>
      </p>
    </div>
  );
}

export default Signup;
