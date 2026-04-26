import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReviewerContext } from "../../context/ReviewerContext";
import { toast } from "react-toastify";

const ReviewerAccess = () => {
   const [searchParams] = useSearchParams();
   const { setRToken } = useContext(ReviewerContext);
   const navigate = useNavigate();

   useEffect(() => {
      const token = searchParams.get("token");
      const submissionId = searchParams.get("submissionId");

      if (!token) {
         toast.error("Invalid or missing magic link. Please login manually.");
         navigate("/login");
         return;
      }

      try {
         // Set token to localStorage and context immediately
         localStorage.setItem("rToken", token);
         setRToken(token);

         // Show success message and navigate
         toast.success("Magic link authenticated successfully!");

         if (submissionId) {
            navigate(
               `/reviewer/submissions?action=review&submissionId=${submissionId}`,
            );
         } else {
            navigate("/reviewer/submissions");
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

export default ReviewerAccess;
