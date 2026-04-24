// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { FileText, User } from "lucide-react";

// const DashboardLayout = () => {
//    const linkClasses = ({ isActive }) =>
//       `flex items-center gap-3 rounded-r-full px-6 py-4 text-sm font-semibold transition ${
//          isActive
//             ? "bg-cyan-600 text-white shadow-lg"
//             : "text-gray-300 hover:bg-slate-800 hover:text-white"
//       }`;

//    return (
//       <div className="flex">
//          <aside className="fixed left-0 top-16 w-[280px] h-[calc(100vh-4rem)] bg-slate-950 border-r border-slate-800 p-5 overflow-y-auto">
//             <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-white shadow-sm">
//                <span className="text-lg font-bold">Reviewer</span>
//             </div>
//             <nav className="flex flex-col gap-3">
//                <NavLink to="/dashboard/submissions" className={linkClasses}>
//                   <FileText size={20} /> My Submissions
//                </NavLink>

//                <NavLink to="/dashboard/profile" className={linkClasses}>
//                   <User size={20} /> Profile
//                </NavLink>
//             </nav>
//          </aside>

//          <main className="ml-[280px] flex-1 bg-slate-800 text-white p-8 min-h-screen">
//             <Outlet />
//          </main>
//       </div>
//    );
// };

// export default DashboardLayout;


import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* BELOW NAVBAR */}
      <div className="flex pt-16">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-[280px] p-8 bg-slate-50 text-slate-900 min-h-screen">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;