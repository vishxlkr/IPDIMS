import React from "react";
import { NavLink } from "react-router-dom";
import { User, FileText } from "lucide-react";

const Sidebar = () => {
   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
         isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`;

   return (
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#0b0f19] border-r border-gray-800 p-4 overflow-y-auto">
         <div className="flex flex-col gap-2">
            <NavLink to="/dashboard/profile" className={linkClasses}>
               <User size={20} /> Profile
            </NavLink>

            <NavLink to="/dashboard/submissions" className={linkClasses}>
               <FileText size={20} /> My Submissions
            </NavLink>
         </div>
      </aside>
   );
};

export default Sidebar;
