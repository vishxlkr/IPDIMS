import { useState, useEffect } from "react";
import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();
import axios from "axios";
const AdminContextProvider = (props) => {
   const [aToken, setAToken] = useState(
      localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "",
   );

   const backendUrl = import.meta.env.VITE_BACKEND_URL;

   useEffect(() => {
      const interceptor = axios.interceptors.response.use(
         (response) => response,
         (error) => {
            if (error.response && error.response.status === 401) {
               setAToken("");
               localStorage.removeItem("aToken");
               // If there is an authorization failure, redirect to login
               window.location.href = "/login";
            }
            return Promise.reject(error);
         },
      );
      return () => axios.interceptors.response.eject(interceptor);
   }, []);

   const value = {
      aToken,
      setAToken,
      backendUrl,
   };

   return (
      <AdminContext.Provider value={value}>
         {props.children}
      </AdminContext.Provider>
   );
};

export default AdminContextProvider;
