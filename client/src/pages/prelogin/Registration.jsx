import React from "react";
import scanner from "../../assets/scanner.png";
import registrationDetail from "../../assets/registrationDetail.jpg";

const Registration = () => {
   return (
      <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-16 font-sans text-gray-800">
         {/* Page Title */}
         <h2 className="text-3xl font-bold text-center mb-12">Registration</h2>

         {/* Registration Details + QR Section */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Registration Details Image */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-center">
               <img
                  src={registrationDetail}
                  alt="Registration Details"
                  className="rounded-lg shadow-md max-h-[500px] object-contain"
               />
            </div>

            {/* QR Code Image */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
               <img
                  src={scanner}
                  alt="UPI Scanner"
                  className="rounded-lg shadow-md max-h-[500px] object-contain"
               />
            </div>
         </div>

         {/* Registration Form */}
         <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <form className="space-y-6">
               {/* Paper ID */}
               <div>
                  <label className="block font-medium mb-2">Paper ID</label>
                  <input
                     type="text"
                     placeholder="E.g. 10"
                     className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
               </div>

               {/* Paper Title */}
               <div>
                  <label className="block font-medium mb-2">Paper Title</label>
                  <input
                     type="text"
                     placeholder="Enter your paper title"
                     className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
               </div>

               {/* Presenter Details */}
               <div>
                  <h4 className="text-lg font-semibold mb-4">
                     Presenter Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="block font-medium mb-2">
                           Presentation Type
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                           <option>Online</option>
                           <option>In-person</option>
                        </select>
                     </div>
                     <div>
                        <label className="block font-medium mb-2">Name</label>
                        <input
                           type="text"
                           placeholder="Enter your name"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div>
                        <label className="block font-medium mb-2">
                           Designation
                        </label>
                        <input
                           type="text"
                           placeholder="E.g. Professor, NIT Rourkela"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div>
                        <label className="block font-medium mb-2">
                           Email Address
                        </label>
                        <input
                           type="email"
                           placeholder="yourmail@example.com"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div>
                        <label className="block font-medium mb-2">Mobile</label>
                        <input
                           type="text"
                           placeholder="E.g. 9876543210"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                  </div>
               </div>

               {/* Registration Category */}
               <div>
                  <label className="block font-medium mb-2">
                     Registration Category
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                     <option>Student</option>
                     <option>Academician/ R&D Lab</option>
                     <option>Industrialist</option>
                     <option>Attendee</option>
                     <option>Foreign Delegate</option>
                  </select>
               </div>

               {/* Type of Registration */}
               <div>
                  <label className="block font-medium mb-2">
                     Type of Registration
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                     <option>Early Bird</option>
                     <option>Late</option>
                  </select>
               </div>

               {/* Payment Details */}
               <div>
                  <h4 className="text-lg font-semibold mb-4">
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
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div>
                        <label className="block font-medium mb-2">
                           Date of Payment
                        </label>
                        <input
                           type="date"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block font-medium mb-2">
                           Transaction Reference Number (UTR)
                        </label>
                        <input
                           type="text"
                           placeholder="Enter transaction ID"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block font-medium mb-2">
                           Payment Proof (JPG/JPEG/PDF)
                        </label>
                        <input
                           type="file"
                           className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                     </div>
                  </div>
               </div>

               {/* Accommodation */}
               <div>
                  <h4 className="text-lg font-semibold mb-4">
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
                  <div className="mt-4">
                     <label className="block font-medium mb-2">
                        Accommodation Type (if Yes)
                     </label>
                     <div className="flex gap-6">
                        <label>
                           <input type="radio" name="accommodationType" />{" "}
                           Hostel
                        </label>
                        <label>
                           <input type="radio" name="accommodationType" />{" "}
                           Guesthouse
                        </label>
                        <label>
                           <input type="radio" name="accommodationType" /> NA
                        </label>
                     </div>
                  </div>
               </div>

               {/* Food Preference */}
               <div>
                  <h4 className="text-lg font-semibold mb-4">
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

               {/* Extra Text */}
               <div>
                  <label className="block font-medium mb-2">
                     Additional Notes
                  </label>
                  <textarea
                     placeholder="E.g. Any special requirements..."
                     className="w-full border border-gray-300 rounded-lg px-4 py-2"
                     rows="4"
                  />
               </div>

               {/* Submit Button */}
               <div className="text-center">
                  <button
                     type="submit"
                     className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                     Register
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default Registration;
