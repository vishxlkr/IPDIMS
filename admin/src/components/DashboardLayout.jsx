import { Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { useContext } from "react";

const DashboardLayout = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   if (!aToken && !rToken) {
      return null;
   }

   return (
      <main className="min-h-screen bg-slate-50 pt-[72px] text-slate-950 lg:ml-[280px]">
         <Outlet />
      </main>
   );
};

export default DashboardLayout;
