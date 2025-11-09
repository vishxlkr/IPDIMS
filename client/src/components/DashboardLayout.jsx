import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
   return (
      <div className="flex min-h-screen">
         {/* Sidebar */}
         <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
            <NavLink
               to="/dashboard/profile"
               className={({ isActive }) =>
                  `px-4 py-2 rounded hover:bg-gray-700 ${
                     isActive ? "bg-gray-700" : ""
                  }`
               }
            >
               Profile
            </NavLink>
            <NavLink
               to="/dashboard/submissions"
               className={({ isActive }) =>
                  `px-4 py-2 rounded hover:bg-gray-700 ${
                     isActive ? "bg-gray-700" : ""
                  }`
               }
            >
               My Submissions
            </NavLink>
         </aside>

         {/* Main Content */}
         <main className="flex-1 bg-gray-800 text-white p-8">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
