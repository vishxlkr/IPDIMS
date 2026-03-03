import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReviewerContext } from "../../context/ReviewerContext";
import { toast } from "react-toastify";

const ReviewerAccess = () => {
   const [searchParams] = useSearchParams();
   const { setRToken, rToken } = useContext(ReviewerContext);
   const navigate = useNavigate();

   useEffect(() => {
      const token = searchParams.get("token");

      if (token) {
         if (token !== rToken) {
            // Set token
            localStorage.setItem("rToken", token);
            setRToken(token);
         } else {
            // Token is set, ready to redirect
            toast.success("Logged in automatically via magic link!");
            navigate("/reviewer/submissions");
         }
      } else {
         navigate("/login");
      }
   }, [searchParams, setRToken, navigate, rToken]);

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">
               Authenticating...
            </h2>
            <p className="text-gray-500 mt-2">
               Please wait while we verify your access.
            </p>
         </div>
      </div>
   );
};

export default ReviewerAccess;
