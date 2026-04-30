// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider, { AdminContext } from "./context/AdminContext.jsx";
import ReviewerContextProvider from "./context/ReviewerContext.jsx";

createRoot(document.getElementById("root")).render(
   <BrowserRouter>
      <AdminContextProvider>
         <ReviewerContextProvider>
            <App />
         </ReviewerContextProvider>
      </AdminContextProvider>
   </BrowserRouter>,
);
