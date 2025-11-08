import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
   const { aToken, setAToken } = useContext(AdminContext);
   const { rToken, setRToken } = useContext(ReviewerContext);
   const navigate = useNavigate();

   const logout = () => {
      if (aToken) {
         setAToken("");
         localStorage.removeItem("aToken");
      }
      if (rToken) {
         setRToken("");
         localStorage.removeItem("rToken");
      }
      navigate("/");
   };

   return (
      <>
         {/* ✅ Fixed Navbar */}
         <div
            className="
               fixed top-0 left-0 w-full
               flex justify-between items-center
               px-6 py-3 
               bg-[rgba(10,10,10,0.8)] backdrop-blur-lg
               text-white z-50
               border-b border-white/10
            "
         >
            <h1
               className="text-xl font-bold tracking-wide cursor-pointer hover:text-blue-400 transition"
               onClick={() => navigate("/")}
            >
               IPDIMS
            </h1>

            <span className="px-3 py-1 bg-gray-700/60 rounded-full text-xs sm:text-sm font-medium">
               {aToken ? "Admin" : rToken ? "Reviewer" : "Guest"}
            </span>

            <button
               onClick={logout}
               className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-sm font-semibold transition"
            >
               Logout
            </button>
         </div>

         {/* ✅ Spacer (auto pushes entire page down by navbar height) */}
         <div className="h-16"></div>
      </>
   );
};

export default Navbar;
