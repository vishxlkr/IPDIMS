import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";

const DashboardLayout = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   if (!aToken && !rToken) {
      return null;
   }

   return (
      <div className="ml-64 mt-16 min-h-screen bg-gray-900 text-white p-8">
         <Outlet />
      </div>
   );
};

export default DashboardLayout;
