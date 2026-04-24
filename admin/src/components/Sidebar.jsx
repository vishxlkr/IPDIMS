import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { Home, FileText, Users, User, UserPlus } from "lucide-react";

const Sidebar = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const linkClasses = ({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 text-[15px] font-medium transition-colors ${
         isActive
            ? "bg-[#1c2233] text-white border-l-4 border-white"
            : "text-slate-400 hover:bg-[#1c2233] hover:text-white border-l-4 border-transparent"
      }`;

   return (
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col bg-[#222736] text-white shadow-xl lg:flex">
         <div className="flex h-[72px] shrink-0 items-center bg-[#0dcaf0] px-6">
            <h1
            className="cursor-pointer text-[22px] font-bold text-white "
            
         >
            IPDIMS
         </h1>
         </div>

         <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
            {aToken && (
               <>
                  <NavLink to="/admin/dashboard" className={linkClasses}>
                     <Home size={20} /> Dashboard
                  </NavLink>
                  <NavLink to="/admin/submissions" className={linkClasses}>
                     <FileText size={20} /> All Submissions
                  </NavLink>
                  <NavLink to="/admin/reviewers" className={linkClasses}>
                     <Users size={20} /> Manage Reviewers
                  </NavLink>
                  <NavLink to="/admin/authors" className={linkClasses}>
                     <User size={20} /> Authors
                  </NavLink>
                  <NavLink to="/admin/all-registration" className={linkClasses}>
                     <UserPlus size={20} /> All Registration
                  </NavLink>
               </>
            )}

            {rToken && (
               <>
                  <NavLink to="/reviewer/dashboard" className={linkClasses}>
                     <Home size={20} /> Dashboard
                  </NavLink>
                  <NavLink to="/reviewer/submissions" className={linkClasses}>
                     <FileText size={20} /> Assigned Submissions
                  </NavLink>
                  <NavLink to="/reviewer/profile" className={linkClasses}>
                     <User size={20} /> My Profile
                  </NavLink>
               </>
            )}
         </nav>
      </aside>
   );
};

export default Sidebar;
