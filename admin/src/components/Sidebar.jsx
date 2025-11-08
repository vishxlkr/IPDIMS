import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { Home, FileText, Users, User } from "lucide-react";

const Sidebar = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3 px-4 cursor-pointer rounded-lg transition ${
         isActive
            ? "bg-[#e9ecff] border-r-4 border-blue-600 text-blue-700 font-semibold"
            : "hover:bg-gray-100 text-gray-700"
      }`;

   return (
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
         <h2 className="text-xl font-bold mb-6">Dashboard</h2>

         {aToken ? (
            <>
               <NavLink to="/admin/dashboard" className={linkClasses}>
                  <Home size={20} />
                  <p>Dashboard</p>
               </NavLink>

               <NavLink to="/admin/submissions" className={linkClasses}>
                  <FileText size={20} />
                  <p>All Submissions</p>
               </NavLink>

               <NavLink to="/admin/reviewers" className={linkClasses}>
                  <Users size={20} />
                  <p>Manage Reviewers</p>
               </NavLink>

               <NavLink to="/admin/authors" className={linkClasses}>
                  <User size={20} />
                  <p>Authors</p>
               </NavLink>

               <NavLink to="/admin/all-registration" className={linkClasses}>
                  <User size={20} />
                  <p>All Registration</p>
               </NavLink>
            </>
         ) : rToken ? (
            <>
               <NavLink to="/reviewer/dashboard" className={linkClasses}>
                  <Home size={20} />
                  <p>Dashboard</p>
               </NavLink>

               <NavLink to="/reviewer/submissions" className={linkClasses}>
                  <FileText size={20} />
                  <p>Assigned Submissions</p>
               </NavLink>

               <NavLink to="/reviewer/profile" className={linkClasses}>
                  <User size={20} />
                  <p>My Profile</p>
               </NavLink>
            </>
         ) : (
            <p className="text-gray-500">No access token found.</p>
         )}
      </aside>
   );
};

export default Sidebar;
