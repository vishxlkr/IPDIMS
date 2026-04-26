import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AdminAccess = () => {
   const [searchParams] = useSearchParams();
   const { setAToken } = useContext(AdminContext);
   const navigate = useNavigate();

   useEffect(() => {
      const token = searchParams.get("token");
      const submissionId = searchParams.get("submissionId");
      const action = searchParams.get("action");

      if (!token) {
         toast.error("Invalid or missing magic link. Please login manually.");
         navigate("/login");
         return;
      }

      try {
         // Set token to localStorage and context immediately
         localStorage.setItem("aToken", token);
         setAToken(token);

         // Show success message and navigate
         toast.success("Magic link authenticated successfully!");

         if (submissionId && action === "assign") {
            navigate(
               `/admin/submissions?action=assign&submissionId=${submissionId}`,
            );
         } else {
            navigate("/admin/submissions");
         }
      } catch (error) {
         console.error("Error processing magic link:", error);
         toast.error("Failed to process magic link. Please try again.");
         navigate("/login");
      }
   }, []); // Empty dependency array - run once on mount

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">
               Authenticating...
            </h2>
            <p className="text-gray-500 mt-2">
               Processing your secure magic link. Please wait...
            </p>
         </div>
      </div>
   );
};

export default AdminAccess;
