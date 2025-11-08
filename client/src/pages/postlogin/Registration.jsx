// import React from "react";
// import scanner from "../../assets/scanner.png";
// import registrationDetail from "../../assets/registrationDetail.jpg";

// const Registration = () => {
//    return (
//       <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16 font-sans">
//          <div className="max-w-5xl mx-auto space-y-12">
//             {/* Page Title */}
//             <header className="text-center">
//                <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6">
//                   Registration
//                </h2>
//             </header>

//             {/* Registration Details + QR */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
//                   <img
//                      src={registrationDetail}
//                      alt="Registration Details"
//                      className="rounded-lg shadow-md max-h-[500px] object-contain"
//                   />
//                </div>
//                <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
//                   <img
//                      src={scanner}
//                      alt="UPI Scanner"
//                      className="rounded-lg shadow-md max-h-[500px] object-contain"
//                   />
//                </div>
//             </div>

//             {/* Registration Form */}
//             <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-8">
//                <form className="space-y-6">
//                   {/* Paper ID */}
//                   <div>
//                      <label className="block font-semibold mb-2 text-indigo-300">
//                         Paper ID
//                      </label>
//                      <input
//                         type="text"
//                         placeholder="E.g. 10"
//                         className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                      />
//                   </div>

//                   {/* Paper Title */}
//                   <div>
//                      <label className="block font-semibold mb-2 text-indigo-300">
//                         Paper Title
//                      </label>
//                      <input
//                         type="text"
//                         placeholder="Enter your paper title"
//                         className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                      />
//                   </div>

//                   {/* Presenter Details */}
//                   <div>
//                      <h4 className="text-lg font-bold text-indigo-300 mb-4">
//                         Presenter Details
//                      </h4>
//                      <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Presentation Type
//                            </label>
//                            <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
//                               <option>Online</option>
//                               <option>In-person</option>
//                            </select>
//                         </div>
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Name
//                            </label>
//                            <input
//                               type="text"
//                               placeholder="Enter your name"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Designation
//                            </label>
//                            <input
//                               type="text"
//                               placeholder="E.g. Professor, NIT Rourkela"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Email Address
//                            </label>
//                            <input
//                               type="email"
//                               placeholder="yourmail@example.com"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Mobile
//                            </label>
//                            <input
//                               type="text"
//                               placeholder="E.g. 9876543210"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                      </div>
//                   </div>

//                   {/* Registration Category */}
//                   <div>
//                      <label className="block font-semibold mb-2 text-indigo-300">
//                         Registration Category
//                      </label>
//                      <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
//                         <option>Student</option>
//                         <option>Academician/ R&D Lab</option>
//                         <option>Industrialist</option>
//                         <option>Attendee</option>
//                         <option>Foreign Delegate</option>
//                      </select>
//                   </div>

//                   {/* Type of Registration */}
//                   <div>
//                      <label className="block font-semibold mb-2 text-indigo-300">
//                         Type of Registration
//                      </label>
//                      <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
//                         <option>Early Bird</option>
//                         <option>Late</option>
//                      </select>
//                   </div>

//                   {/* Payment Details */}
//                   <div>
//                      <h4 className="text-lg font-bold text-indigo-300 mb-4">
//                         Payment Details
//                      </h4>
//                      <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Total Amount Paid
//                            </label>
//                            <input
//                               type="text"
//                               placeholder="E.g. 6000"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div>
//                            <label className="block font-medium mb-2">
//                               Date of Payment
//                            </label>
//                            <input
//                               type="date"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div className="md:col-span-2">
//                            <label className="block font-medium mb-2">
//                               Transaction Reference Number (UTR)
//                            </label>
//                            <input
//                               type="text"
//                               placeholder="Enter transaction ID"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                         <div className="md:col-span-2">
//                            <label className="block font-medium mb-2">
//                               Payment Proof (JPG/JPEG/PDF)
//                            </label>
//                            <input
//                               type="file"
//                               className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
//                            />
//                         </div>
//                      </div>
//                   </div>

//                   {/* Accommodation */}
//                   <div>
//                      <h4 className="text-lg font-bold text-indigo-300 mb-4">
//                         Accommodation Requirement
//                      </h4>
//                      <div className="flex gap-6">
//                         <label>
//                            <input type="radio" name="accommodation" /> Yes
//                         </label>
//                         <label>
//                            <input type="radio" name="accommodation" /> No
//                         </label>
//                      </div>
//                   </div>

//                   {/* Food Preference */}
//                   <div>
//                      <h4 className="text-lg font-bold text-indigo-300 mb-4">
//                         Food Preference
//                      </h4>
//                      <div className="flex gap-6">
//                         <label>
//                            <input type="radio" name="food" /> Veg
//                         </label>
//                         <label>
//                            <input type="radio" name="food" /> Non-Veg
//                         </label>
//                         <label>
//                            <input type="radio" name="food" /> NA
//                         </label>
//                      </div>
//                   </div>

//                   {/* Additional Notes */}
//                   <div>
//                      <label className="block font-semibold mb-2 text-indigo-300">
//                         Additional Notes
//                      </label>
//                      <textarea
//                         placeholder="E.g. Any special requirements..."
//                         className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                         rows="4"
//                      />
//                   </div>

//                   {/* Submit Button */}
//                   <div className="text-center">
//                      <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-300">
//                         Register
//                      </button>
//                   </div>
//                </form>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default Registration;

/////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import scanner from "../../assets/scanner.png";
import registrationDetail from "../../assets/registrationDetail.jpg";
import Loading from "../../components/Loading";

const Registration = () => {
   const { token, loading, setLoading } = useContext(AppContext);
   const navigate = useNavigate();
   const location = useLocation();

   const backendUrl = "http://localhost:4000";

   useEffect(() => {
      if (!token) {
         navigate("/login", { state: { from: location.pathname } });
      }
   }, [token, navigate, location]);

   if (!token) return null; // prevents flicker

   const [formData, setFormData] = useState({
      paperTitle: "",
      presenterType: "Online",
      name: "",
      designation: "",
      email: "",
      mobile: "",
      registrationCategory: "Student",
      registrationType: "Early Bird",
      amountPaid: "",
      paymentDate: "",
      transactionRefNo: "",
      accommodationRequired: "No",
      foodPreference: "Veg",
      additionalNotes: "",
   });

   const [paymentProof, setPaymentProof] = useState(null);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleFileChange = (e) => {
      setPaymentProof(e.target.files[0]);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (!paymentProof) {
         toast.error("Please upload payment proof!");
         setLoading(false);
         return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("paymentProof", paymentProof);

      try {
         const res = await axios.post(
            `${backendUrl}/api/user/registration`,
            data,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         if (res.data.success) {
            toast.success("✅ Registration Successful!");

            // Reset form
            setFormData({
               paperTitle: "",
               presenterType: "Online",
               name: "",
               designation: "",
               email: "",
               mobile: "",
               registrationCategory: "Student",
               registrationType: "Early Bird",
               amountPaid: "",
               paymentDate: "",
               transactionRefNo: "",
               accommodationRequired: "No",
               foodPreference: "Veg",
               additionalNotes: "",
            });
            setPaymentProof(null);
         }
      } catch (err) {
         toast.error(err.response?.data?.message || "Something went wrong!");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16 font-sans">
         {loading && <Loading />}

         <div className="max-w-5xl mx-auto space-y-12">
            <header className="text-center">
               <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6">
                  Registration
               </h2>
            </header>

            {/* QR + Fees Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <img
                     src={registrationDetail}
                     alt="Registration Details"
                     className="rounded-lg shadow-md max-h-[500px] object-contain"
                  />
               </div>
               <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <img
                     src={scanner}
                     alt="UPI Scanner"
                     className="rounded-lg shadow-md max-h-[500px] object-contain"
                  />
               </div>
            </div>

            {/* FORM UI stays unchanged */}
            <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-8">
               <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Paper Title */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Paper Title
                     </label>
                     <input
                        type="text"
                        name="paperTitle"
                        value={formData.paperTitle}
                        onChange={handleChange}
                        placeholder="Enter your paper title"
                        required
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                     />
                  </div>

                  {/* Presenter Info */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Presenter Details
                     </h4>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block font-medium mb-2">
                              Presentation Type
                           </label>
                           <select
                              name="presenterType"
                              value={formData.presenterType}
                              onChange={handleChange}
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           >
                              <option>Online</option>
                              <option>In-person</option>
                           </select>
                        </div>

                        <div>
                           <label className="block font-medium mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div>
                           <label className="block font-medium mb-2">
                              Designation
                           </label>
                           <input
                              type="text"
                              name="designation"
                              value={formData.designation}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div>
                           <label className="block font-medium mb-2">
                              Email Address
                           </label>
                           <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div>
                           <label className="block font-medium mb-2">
                              Mobile
                           </label>
                           <input
                              type="text"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Registration Category */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Registration Category
                     </label>
                     <select
                        name="registrationCategory"
                        value={formData.registrationCategory}
                        onChange={handleChange}
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                     >
                        <option>Student</option>
                        <option>Academician/R&D Lab</option>
                        <option>Industrialist</option>
                        <option>Attendee</option>
                        <option>Foreign Delegate</option>
                     </select>
                  </div>

                  {/* Registration Type */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Type of Registration
                     </label>
                     <select
                        name="registrationType"
                        value={formData.registrationType}
                        onChange={handleChange}
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                     >
                        <option>Early Bird</option>
                        <option>Late</option>
                     </select>
                  </div>

                  {/* Payment Details */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Payment Details
                     </h4>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block font-medium mb-2">
                              Total Amount Paid
                           </label>
                           <input
                              type="number"
                              name="amountPaid"
                              value={formData.amountPaid}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div>
                           <label className="block font-medium mb-2">
                              Date of Payment
                           </label>
                           <input
                              type="date"
                              name="paymentDate"
                              value={formData.paymentDate}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div className="md:col-span-2">
                           <label className="block font-medium mb-2">
                              Transaction Reference Number (UTR)
                           </label>
                           <input
                              type="text"
                              name="transactionRefNo"
                              value={formData.transactionRefNo}
                              onChange={handleChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>

                        <div className="md:col-span-2">
                           <label className="block font-medium mb-2">
                              Payment Proof (JPG/JPEG/PDF)
                           </label>
                           <input
                              type="file"
                              accept=".jpg,.jpeg,.pdf"
                              onChange={handleFileChange}
                              required
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Accommodation */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Accommodation Requirement
                     </h4>
                     <div className="flex gap-6">
                        <label>
                           <input
                              type="radio"
                              name="accommodationRequired"
                              value="Yes"
                              checked={formData.accommodationRequired === "Yes"}
                              onChange={handleChange}
                           />{" "}
                           Yes
                        </label>

                        <label>
                           <input
                              type="radio"
                              name="accommodationRequired"
                              value="No"
                              checked={formData.accommodationRequired === "No"}
                              onChange={handleChange}
                           />{" "}
                           No
                        </label>
                     </div>
                  </div>

                  {/* Food */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Food Preference
                     </h4>
                     <div className="flex gap-6">
                        <label>
                           <input
                              type="radio"
                              name="foodPreference"
                              value="Veg"
                              checked={formData.foodPreference === "Veg"}
                              onChange={handleChange}
                           />{" "}
                           Veg
                        </label>
                        <label>
                           <input
                              type="radio"
                              name="foodPreference"
                              value="Non-Veg"
                              checked={formData.foodPreference === "Non-Veg"}
                              onChange={handleChange}
                           />{" "}
                           Non-Veg
                        </label>
                        <label>
                           <input
                              type="radio"
                              name="foodPreference"
                              value="NA"
                              checked={formData.foodPreference === "NA"}
                              onChange={handleChange}
                           />{" "}
                           NA
                        </label>
                     </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Additional Notes
                     </label>
                     <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                     />
                  </div>

                  <div className="text-center">
                     <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
                     >
                        {loading ? "Registering..." : "Register"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Registration;
