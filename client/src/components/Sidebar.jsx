// import React from "react";
// import { NavLink } from "react-router-dom";
// import { User, FileText } from "lucide-react";

// const Sidebar = () => {
//    const linkClasses = ({ isActive }) =>
//       `flex items-center gap-3 rounded-r-full px-6 py-4 text-sm font-semibold transition ${
//          isActive
//             ? "bg-cyan-600 text-white shadow-lg"
//             : "text-gray-300 hover:bg-slate-800 hover:text-white"
//       }`;

//    return (
//       <aside className="fixed left-0 top-16 w-[280px] h-[calc(100vh-4rem)] bg-slate-950 border-r border-slate-800 p-5 overflow-y-auto">
//          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-white shadow-sm">
//             <span className="text-lg font-bold">Reviewer</span>
//          </div>
//          <div className="flex flex-col gap-3">
//             <NavLink to="/dashboard/submissions" className={linkClasses}>
//                <FileText size={20} /> My Submissions
//             </NavLink>

//             {/* <NavLink to="/dashboard/profile" className={linkClasses}>
//                <User size={20} /> Profile
//             </NavLink> */}
//          </div>
//       </aside>
//    );
// };

// export default Sidebar;
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FileText, User } from "lucide-react";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 text-[15px] font-semibold transition ${
      isActive
        ? "bg-slate-800 text-white border-l-4 border-cyan-500"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-[280px] bg-slate-900 text-white border-r border-slate-800 overflow-y-auto">
      
   
      

      {/* Workspace Label */}
     

      {/* Navigation */}
      <nav className="flex flex-col py-2">
        <NavLink to="/dashboard/submissions" className={linkClasses}>
          <FileText size={18} />
          My Submissions
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClasses}>
          <User size={18} />
          My Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;