// ✅ DashboardLayout.jsx
import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { Home, FileText, Users, User } from "lucide-react";

const DashboardLayout = ({ withNavbar = false }) => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3 px-4 rounded-lg transition
       ${
          isActive
             ? "bg-indigo-600 text-white"
             : "text-gray-300 hover:bg-gray-700"
       }
      `;

   return (
      <div className="flex min-h-screen">
         {/* ✅ FIXED SIDEBAR (Now pushed down after navbar) */}
         <aside
            className="
            w-64 bg-gray-900 border-r p-6 flex flex-col gap-4
            fixed left-0 top-16 bottom-0
            overflow-y-auto
         "
         >
            {aToken ? (
               <>
                  <NavLink to="/admin/dashboard" className={linkClasses}>
                     <Home size={20} /> <p>Dashboard</p>
                  </NavLink>
                  <NavLink to="/admin/submissions" className={linkClasses}>
                     <FileText size={20} /> <p>All Submissions</p>
                  </NavLink>
                  <NavLink to="/admin/reviewers" className={linkClasses}>
                     <Users size={20} /> <p>Manage Reviewers</p>
                  </NavLink>
                  <NavLink to="/admin/authors" className={linkClasses}>
                     <User size={20} /> <p>Authors</p>
                  </NavLink>
                  <NavLink to="/admin/all-registration" className={linkClasses}>
                     <User size={20} /> <p>All Registration</p>
                  </NavLink>
               </>
            ) : rToken ? (
               <>
                  <NavLink to="/reviewer/dashboard" className={linkClasses}>
                     <Home size={20} /> <p>Dashboard</p>
                  </NavLink>
                  <NavLink to="/reviewer/submissions" className={linkClasses}>
                     <FileText size={20} /> <p>Assigned Submissions</p>
                  </NavLink>
                  <NavLink to="/reviewer/profile" className={linkClasses}>
                     <User size={20} /> <p>My Profile</p>
                  </NavLink>
               </>
            ) : (
               <p>No Access</p>
            )}
         </aside>

         {/* ✅ content automatically respects sidebar + navbar */}
         <main className="flex-1 bg-gray-100 p-8 ml-64 mt-16 overflow-auto">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
