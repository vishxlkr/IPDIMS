import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ReviewerContext = createContext();

const ReviewerContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [rToken, setRToken] = useState(
      localStorage.getItem("rToken") ? localStorage.getItem("rToken") : "",
   );

   useEffect(() => {
      const interceptor = axios.interceptors.response.use(
         (response) => response,
         (error) => {
            if (error.response && error.response.status === 401) {
               setRToken("");
               localStorage.removeItem("rToken");
               // Automatically redirect on 401 unauthorized
               window.location.href = "/login";
            }
            return Promise.reject(error);
         },
      );
      return () => axios.interceptors.response.eject(interceptor);
   }, []);

   const value = {
      rToken,
      setRToken,
      backendUrl,
   };

   return (
      <ReviewerContext.Provider value={value}>
         {props.children}
      </ReviewerContext.Provider>
   );
};

export default ReviewerContextProvider;
