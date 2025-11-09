import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AdminRegistrations = () => {
   const [registrations, setRegistrations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [selectedRegistration, setSelectedRegistration] = useState(null);

   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   // ✅ Fetch all registrations
   const fetchRegistrations = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/registrations`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setRegistrations(data.registrations || []);
         } else {
            toast.error("Failed to fetch registrations");
         }
      } catch (error) {
         console.error("Error:", error);
         toast.error("Server error in fetching registrations");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchRegistrations();
   }, []);

   // ✅ Delete Registration
   const handleDeleteRegistration = async (id) => {
      if (!window.confirm("Are you sure you want to delete this registration?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/registrations/${id}`,
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Registration deleted successfully ✅");
            fetchRegistrations(); // refresh table
         } else {
            toast.error(data.message || "Failed to delete registration");
         }
      } catch (error) {
         toast.error(
            error.response?.data?.message || "Error deleting registration"
         );
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Registrations
               </h1>
               <p className="text-gray-600 mt-2">
                  Manage and track all conference registrations
               </p>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Paper ID
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Presenter
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Category
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Amount Paid
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Proof
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>

                     <tbody className="bg-white divide-y divide-gray-200">
                        {registrations.length > 0 ? (
                           registrations.map((reg) => (
                              <tr
                                 key={reg._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4 font-bold text-gray-800">
                                    #{reg.paperId}
                                 </td>
                                 <td className="px-6 py-4 text-gray-900">
                                    {reg.paperTitle}
                                 </td>

                                 <td className="px-6 py-4">
                                    <div className="text-gray-900 font-medium">
                                       {reg.name}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                       {reg.email}
                                    </div>
                                 </td>

                                 <td className="px-6 py-4 text-gray-700">
                                    {reg.registrationCategory}
                                 </td>
                                 <td className="px-6 py-4 text-gray-700">
                                    ₹{reg.amountPaid}
                                 </td>

                                 <td className="px-6 py-4">
                                    <a
                                       href={reg.paymentProof}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                       <Download size={18} /> File
                                    </a>
                                 </td>

                                 {/* ✅ ACTION BUTTONS */}
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => {
                                             setSelectedRegistration(reg);
                                             setShowModal(true);
                                          }}
                                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-medium"
                                       >
                                          <Eye size={14} /> View
                                       </button>

                                       <button
                                          onClick={() =>
                                             handleDeleteRegistration(reg._id)
                                          }
                                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium"
                                       >
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="7"
                                 className="text-center py-6 text-gray-500"
                              >
                                 No registrations found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* ✅ VIEW DETAILS MODAL */}
         {showModal && selectedRegistration && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center px-6 py-4 border-b bg-indigo-600 text-white rounded-t-2xl">
                     <h2 className="text-xl font-bold">Registration Details</h2>
                     <button
                        onClick={() => setShowModal(false)}
                        className="text-white hover:bg-white/20 rounded-full p-2"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  <div className="px-8 py-6 space-y-6">
                     <div className="bg-gray-50 border rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500">
                           PAPER ID
                        </p>
                        <h3 className="text-3xl font-bold text-indigo-600">
                           #{selectedRegistration.paperId}
                        </h3>
                        <p className="text-gray-900 font-semibold mt-2">
                           {selectedRegistration.paperTitle}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 border">
                           <p className="text-xs text-gray-500 font-semibold">
                              PRESENTER
                           </p>
                           <p className="text-gray-900 font-medium">
                              {selectedRegistration.name}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border">
                           <p className="text-xs text-gray-500 font-semibold">
                              EMAIL
                           </p>
                           <p className="text-gray-900 font-medium">
                              {selectedRegistration.email}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border">
                           <p className="text-xs text-gray-500 font-semibold">
                              AMOUNT PAID
                           </p>
                           <p className="text-green-600 font-semibold text-lg">
                              ₹ {selectedRegistration.amountPaid}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border">
                           <p className="text-xs text-gray-500 font-semibold">
                              DATE OF PAYMENT
                           </p>
                           <p className="text-gray-900 font-medium">
                              {selectedRegistration.paymentDate}
                           </p>
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 border">
                        <p className="text-xs text-gray-500 font-semibold">
                           TRANSACTION REF NO
                        </p>
                        <p className="text-gray-900 font-medium">
                           {selectedRegistration.transactionRefNo}
                        </p>

                        <a
                           href={selectedRegistration.paymentProof}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                           View / Download File
                        </a>
                     </div>
                  </div>

                  <div className="px-6 py-4 border-t bg-gray-100 rounded-b-2xl text-right">
                     <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminRegistrations;
