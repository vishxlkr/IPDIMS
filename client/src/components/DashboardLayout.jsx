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
