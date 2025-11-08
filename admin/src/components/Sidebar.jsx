import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { Home, FileText, Users, User } from "lucide-react";

const Sidebar = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
         isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`;

   return (
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#0b0f19] border-r border-gray-800 p-4 overflow-y-auto">
         <div className="flex flex-col gap-2">
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
                     <User size={20} /> All Registration
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
         </div>
      </aside>
   );
};

export default Sidebar;
