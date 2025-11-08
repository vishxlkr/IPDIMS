import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { LogOut } from "lucide-react";

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
      navigate("/login");
   };

   return (
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0b0f19] border-b border-gray-800 px-6 flex items-center justify-between z-50">
         <h1
            className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition"
            onClick={() => navigate("/")}
         >
            IPDIMS
         </h1>

         <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-700/60 rounded-full text-sm font-medium text-white">
               {aToken ? "Admin" : rToken ? "Reviewer" : "Guest"}
            </span>
            <button
               onClick={logout}
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            >
               <LogOut size={16} /> Logout
            </button>
         </div>
      </nav>
   );
};

export default Navbar;
