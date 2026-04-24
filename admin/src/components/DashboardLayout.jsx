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
      <main className="min-h-screen bg-[#f4f7f6] pt-[72px] lg:ml-[280px]">
         <div className="p-8">
            <Outlet />
         </div>
      </main>
   );
};

export default DashboardLayout;
