import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext";
import { ReviewerContext } from "./context/ReviewerContext";

import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import ManageReviewers from "./pages/admin/ManageReviewers";
import AdminAuthors from "./pages/admin/AdminAuthors";

// Reviewer Pages
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard";
import ReviewerSubmissions from "./pages/reviewer/ReviewerSubmissions";
import ReviewerProfile from "./pages/reviewer/ReviewerProfile";
import Navbar from "./components/Navbar";

const App = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const isAdmin = Boolean(aToken);
   const isReviewer = Boolean(rToken);

   return (
      <>
         <Navbar />
         <ToastContainer />
         <Routes>
            {/* Login Route */}
            <Route
               path="/login"
               element={isAdmin || isReviewer ? <Navigate to="/" /> : <Login />}
            />

            {/* Admin Routes */}
            {isAdmin && (
               <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="admin/dashboard" />} />
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  <Route
                     path="admin/submissions"
                     element={<AdminSubmissions />}
                  />
                  <Route path="admin/reviewers" element={<ManageReviewers />} />
                  <Route path="admin/authors" element={<AdminAuthors />} />
                  <Route path="admin/authors" element={<AdminAuthors />} />
               </Route>
            )}

            {/* Reviewer Routes */}
            {isReviewer && (
               <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="reviewer/dashboard" />} />
                  <Route
                     path="reviewer/dashboard"
                     element={<ReviewerDashboard />}
                  />
                  <Route
                     path="reviewer/submissions"
                     element={<ReviewerSubmissions />}
                  />
                  <Route
                     path="reviewer/profile"
                     element={<ReviewerProfile />}
                  />
               </Route>
            )}

            {/* Fallback */}
            <Route
               path="*"
               element={
                  isAdmin || isReviewer ? (
                     <Navigate to="/" />
                  ) : (
                     <Navigate to="/login" />
                  )
               }
            />
         </Routes>
      </>
   );
};

export default App;
