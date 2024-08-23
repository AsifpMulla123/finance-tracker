import React, { useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const logoutFunc = () => {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged out successfully.");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  return (
    <div className="bg-blue-500 text-white h-11 sticky px-4 py-2 top-0 left-0 flex justify-between items-center shadow-md z-50">
      <p className="font-semibold text-base ml-4">FinTrack</p>
      <div className="flex justify-center items-center mr-4 gap-4">
        {user &&
          (user.photoURL ? (
            <div className="relative cursor-pointer">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="rounded-full w-9 h-9"
              />
            </div>
          ) : (
            <FaUserCircle size={30} className="cursor-pointer" />
          ))}
        {user && (
          <p
            onClick={logoutFunc}
            className="opacity-80 cursor-pointer hover:opacity-100 transition-all"
          >
            Logout
          </p>
        )}
      </div>
    </div>
  );
}

export default Navbar;
