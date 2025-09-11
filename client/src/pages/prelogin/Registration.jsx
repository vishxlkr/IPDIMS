import React from "react";
import scanner from "../../assets/scanner.png";
import registrationDetail from "../../assets/registrationDetail.jpg";

const Registration = () => {
   return (
      <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16 font-sans">
         <div className="max-w-5xl mx-auto space-y-12">
            {/* Page Title */}
            <header className="text-center">
               <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6">
                  Registration
               </h2>
            </header>

            {/* Registration Details + QR */}
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

            {/* Registration Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-8">
               <form className="space-y-6">
                  {/* Paper ID */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Paper ID
                     </label>
                     <input
                        type="text"
                        placeholder="E.g. 10"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                     />
                  </div>

                  {/* Paper Title */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Paper Title
                     </label>
                     <input
                        type="text"
                        placeholder="Enter your paper title"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                     />
                  </div>

                  {/* Presenter Details */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Presenter Details
                     </h4>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block font-medium mb-2">
                              Presentation Type
                           </label>
                           <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
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
                              placeholder="Enter your name"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Designation
                           </label>
                           <input
                              type="text"
                              placeholder="E.g. Professor, NIT Rourkela"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Email Address
                           </label>
                           <input
                              type="email"
                              placeholder="yourmail@example.com"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Mobile
                           </label>
                           <input
                              type="text"
                              placeholder="E.g. 9876543210"
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
                     <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
                        <option>Student</option>
                        <option>Academician/ R&D Lab</option>
                        <option>Industrialist</option>
                        <option>Attendee</option>
                        <option>Foreign Delegate</option>
                     </select>
                  </div>

                  {/* Type of Registration */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Type of Registration
                     </label>
                     <select className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2">
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
                              type="text"
                              placeholder="E.g. 6000"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Date of Payment
                           </label>
                           <input
                              type="date"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block font-medium mb-2">
                              Transaction Reference Number (UTR)
                           </label>
                           <input
                              type="text"
                              placeholder="Enter transaction ID"
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block font-medium mb-2">
                              Payment Proof (JPG/JPEG/PDF)
                           </label>
                           <input
                              type="file"
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
                           <input type="radio" name="accommodation" /> Yes
                        </label>
                        <label>
                           <input type="radio" name="accommodation" /> No
                        </label>
                     </div>
                  </div>

                  {/* Food Preference */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Food Preference
                     </h4>
                     <div className="flex gap-6">
                        <label>
                           <input type="radio" name="food" /> Veg
                        </label>
                        <label>
                           <input type="radio" name="food" /> Non-Veg
                        </label>
                        <label>
                           <input type="radio" name="food" /> NA
                        </label>
                     </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Additional Notes
                     </label>
                     <textarea
                        placeholder="E.g. Any special requirements..."
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        rows="4"
                     />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                     <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-300">
                        Register
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Registration;
