import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, FileText, User } from "lucide-react";

const DashboardLayout = () => {
   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
         isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`;

   return (
      <div className="flex">
         {/* Sidebar (Same UI Like Admin/Reviewer Sidebar) */}
         <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#0b0f19] border-r border-gray-800 p-4 overflow-y-auto">
            <nav className="flex flex-col gap-2">
               <NavLink to="/dashboard/profile" className={linkClasses}>
                  <User size={20} /> Profile
               </NavLink>

               <NavLink to="/dashboard/submissions" className={linkClasses}>
                  <FileText size={20} /> My Submissions
               </NavLink>
            </nav>
         </aside>

         {/* Main Content */}
         <main className="ml-64 flex-1 bg-gray-800 text-white p-8 min-h-screen">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
