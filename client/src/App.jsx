import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AppContext } from "./context/AppContext";

import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/prelogin/Home";
import Login from "./pages/prelogin/Login";
import Submission from "./pages/prelogin/Submission";
import ImportantDates from "./pages/prelogin/ImportantDates";
import Committee from "./pages/prelogin/Committee";
import Venue from "./pages/prelogin/Venue";
import ContactUs from "./pages/prelogin/ContactUs";
import Registration from "./pages/postlogin/Registration";

import MyProfile from "./pages/postlogin/MyProfile";
import MySubmissions from "./pages/postlogin/MySubmissions";
import AddSubmission from "./pages/postlogin/AddSubmission";

export default function App() {
   const { token } = useContext(AppContext);

   return (
      <>
         {/* Navbar always on top */}
         <Navbar />

         <ToastContainer />

         <div className="pt-16">
            <Routes>
               {/* Public */}
               <Route path="/" element={<Home />} />
               <Route
                  path="/login"
                  element={token ? <Navigate to="/dashboard" /> : <Login />}
               />
               <Route path="/submission" element={<Submission />} />
               <Route path="/important-dates" element={<ImportantDates />} />
               <Route path="/registration" element={<Registration />} />
               <Route path="/committee" element={<Committee />} />
               <Route path="/venue" element={<Venue />} />
               <Route path="/contact-us" element={<ContactUs />} />

               {/* Protected Dashboard */}
               <Route
                  path="/dashboard"
                  element={
                     token ? <DashboardLayout /> : <Navigate to="/login" />
                  }
               >
                  <Route index element={<Navigate to="submissions" />} />
                  <Route path="profile" element={<MyProfile />} />
                  <Route path="submissions" element={<MySubmissions />} />
               </Route>

               <Route
                  path="/add-submission"
                  element={token ? <AddSubmission /> : <Navigate to="/login" />}
               />
            </Routes>
         </div>
      </>
   );
}
