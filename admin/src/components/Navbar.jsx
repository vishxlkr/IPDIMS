import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
   const { aToken, setAToken } = useContext(AdminContext);
   const { rToken, setRToken } = useContext(ReviewerContext);

   const logout = () => {
      const clientUrl =
         import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";
      if (aToken) {
         setAToken("");
         localStorage.removeItem("aToken");
      }
      if (rToken) {
         setRToken("");
         localStorage.removeItem("rToken");
      }

      window.location.assign(clientUrl);
   };

   return (
      <nav className="fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:left-[280px] lg:px-8">
         <h1 className=" text-[22px] font-bold text-slate-800 transition ">
            {aToken ? "Admin" : rToken ? "Reviewer" : "Guest"}
         </h1>

         <div className="flex items-center gap-5">
            <button
               onClick={logout}
               className="flex items-center gap-2 rounded bg-accent px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0bacce]"
            >
               <LogOut size={16} /> Logout
            </button>
         </div>
      </nav>
   );
};

export default Navbar;
