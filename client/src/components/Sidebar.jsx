// export default Sidebar;
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FileText, User } from "lucide-react";

const Sidebar = () => {
   const linkClasses = ({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 text-[18px] font-semibold transition-colors ${
         isActive
            ? "bg-[#1c2233] text-white border-l-4 border-white"
            : "text-slate-400 hover:bg-[#1c2233] hover:text-white border-l-4 border-transparent"
      }`;

   return (
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-[280px] bg-[#2e3449] text-white border-r border-slate-800 overflow-y-auto">
         {/* Workspace Label */}

         {/* Navigation */}
         <nav className="flex flex-col py-2">
            <NavLink to="/dashboard/submissions" className={linkClasses}>
               <FileText size={25} />
               My Submissions
            </NavLink>

            <NavLink to="/dashboard/profile" className={linkClasses}>
               <User size={25} />
               My Profile
            </NavLink>
         </nav>
      </aside>
   );
};

export default Sidebar;
