import React from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";

// Protect private routes
function RequireAuth({ children }) {
   const { user, token } = useAuth();
   if (!token && !user) {
      return <Navigate to="/" replace />;
   }
   return children;
}

export default function App() {
   return (
      <AuthProvider>
         <Router>
            <Toaster position="top-right" />
            <Routes>
               {/* Public auth page */}
               <Route path="/" element={<AuthPage />} />

               {/* Protected homepage */}
               <Route
                  path="/home"
                  element={
                     <RequireAuth>
                        <Homepage />
                     </RequireAuth>
                  }
               />

               {/* Redirect unknown routes */}
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </Router>
      </AuthProvider>
   );
}
