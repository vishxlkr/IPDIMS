import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AdminAccess = () => {
   const [searchParams] = useSearchParams();
   const { setAToken, aToken } = useContext(AdminContext);
   const navigate = useNavigate();

   useEffect(() => {
      const token = searchParams.get("token");
      const submissionId = searchParams.get("submissionId");
      const action = searchParams.get("action");

      if (token) {
         if (token !== aToken) {
            // Set token
            localStorage.setItem("aToken", token);
            setAToken(token);
         } else {
            // Token is set, ready to redirect
            toast.success("Logged in successfully as Admin.");
            if (submissionId && action === "assign") {
               navigate(
                  `/admin/submissions?action=assign&submissionId=${submissionId}`,
               );
            } else {
               navigate("/admin/submissions");
            }
         }
      } else {
         navigate("/login");
      }
   }, [searchParams, setAToken, navigate, aToken]);

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">
               Authenticating Admin...
            </h2>
            <p className="text-gray-500 mt-2">
               Please wait while we verify your access.
            </p>
         </div>
      </div>
   );
};

export default AdminAccess;
