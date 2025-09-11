import React from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pre-login pages
import Home from "./pages/prelogin/Home";
import Submission from "./pages/prelogin/Submission";
import Registration from "./pages/prelogin/Registration";
import ImportantDates from "./pages/prelogin/ImportantDates";
import Committee from "./pages/prelogin/Committee";
import Venue from "./pages/prelogin/Venue";
import ContactUs from "./pages/prelogin/ContactUs";

// Auth page
import AuthPage from "./pages/AuthPage";

// Author pages
import AuthorDashboard from "./pages/author/AuthorDashboard";
import MySubmissions from "./pages/author/MySubmissions";
import NewSubmission from "./pages/author/NewSubmission";
import AuthorPayments from "./pages/author/Payments";

// Reviewer pages
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard";
import AssignedPapers from "./pages/reviewer/AssignedPapers";
import SubmitReview from "./pages/reviewer/SubmitReview";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageSubmissions from "./pages/admin/ManageSubmissions";
import AdminPayments from "./pages/admin/Payments";

// ✅ Protect private routes
function RequireAuth({ children, allowedRole }) {
   const { user, token } = useAuth();

   if (!token || !user) {
      return <Navigate to="/auth" replace />;
   }

   if (allowedRole && user.role !== allowedRole) {
      const redirectPath =
         user.role === "admin"
            ? "/admin/dashboard"
            : user.role === "reviewer"
            ? "/reviewer/dashboard"
            : "/author/dashboard";
      return <Navigate to={redirectPath} replace />;
   }

   return children;
}

export default function App() {
   return (
      <AuthProvider>
         <Router>
            <Toaster position="top-right" />
            <Navbar />

            <div className="pt-16">
               {/* Add top padding so content is not hidden behind fixed navbar */}
               <Routes>
                  {/* ------------------ Pre-login pages ------------------ */}
                  <Route path="/" element={<Home />} />
                  <Route path="/submission" element={<Submission />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/important-dates" element={<ImportantDates />} />
                  <Route path="/committee" element={<Committee />} />
                  <Route path="/venue" element={<Venue />} />
                  <Route path="/contact-us" element={<ContactUs />} />

                  {/* ------------------ Auth page ------------------ */}
                  <Route path="/auth" element={<AuthPage />} />

                  {/* ------------------ Author routes ------------------ */}
                  <Route
                     path="/author/dashboard"
                     element={
                        <RequireAuth allowedRole="author">
                           <AuthorDashboard />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/author/submissions"
                     element={
                        <RequireAuth allowedRole="author">
                           <MySubmissions />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/author/new"
                     element={
                        <RequireAuth allowedRole="author">
                           <NewSubmission />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/author/payments"
                     element={
                        <RequireAuth allowedRole="author">
                           <AuthorPayments />
                        </RequireAuth>
                     }
                  />

                  {/* ------------------ Reviewer routes ------------------ */}
                  <Route
                     path="/reviewer/dashboard"
                     element={
                        <RequireAuth allowedRole="reviewer">
                           <ReviewerDashboard />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/reviewer/assigned"
                     element={
                        <RequireAuth allowedRole="reviewer">
                           <AssignedPapers />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/reviewer/review"
                     element={
                        <RequireAuth allowedRole="reviewer">
                           <SubmitReview />
                        </RequireAuth>
                     }
                  />

                  {/* ------------------ Admin routes ------------------ */}
                  <Route
                     path="/admin/dashboard"
                     element={
                        <RequireAuth allowedRole="admin">
                           <AdminDashboard />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/admin/users"
                     element={
                        <RequireAuth allowedRole="admin">
                           <ManageUsers />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/admin/submissions"
                     element={
                        <RequireAuth allowedRole="admin">
                           <ManageSubmissions />
                        </RequireAuth>
                     }
                  />
                  <Route
                     path="/admin/payments"
                     element={
                        <RequireAuth allowedRole="admin">
                           <AdminPayments />
                        </RequireAuth>
                     }
                  />

                  {/* ------------------ Fallback for unknown routes ------------------ */}
                  <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
            </div>

            <Footer />
         </Router>
      </AuthProvider>
   );
}
