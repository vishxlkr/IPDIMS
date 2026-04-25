import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { Eye, Download, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AdminRegistrations = () => {
   const [registrations, setRegistrations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [selectedRegistration, setSelectedRegistration] = useState(null);
   const [reviewReason, setReviewReason] = useState("");
   const [reviewSubmitting, setReviewSubmitting] = useState(false);

   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   //  Fetch all registrations
   const fetchRegistrations = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/registrations`,
            {
               headers: { atoken },
            },
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

   //  Delete Registration
   const handleDeleteRegistration = async (id) => {
      if (!window.confirm("Are you sure you want to delete this registration?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/registrations/${id}`,
            { headers: { atoken } },
         );

         if (data.success) {
            toast.success("Registration deleted successfully ✅");
            fetchRegistrations(); // refresh table
         } else {
            toast.error(data.message || "Failed to delete registration");
         }
      } catch (error) {
         toast.error(
            error.response?.data?.message || "Error deleting registration",
         );
      }
   };

   const handleRegistrationReview = async (approved) => {
      if (!selectedRegistration?._id) return;

      if (!approved && !reviewReason.trim()) {
         toast.error("Please enter reason for non-approval");
         return;
      }

      try {
         setReviewSubmitting(true);

         const { data } = await axios.put(
            `${backendUrl}/api/admin/registrations/${selectedRegistration._id}/approval`,
            {
               approved,
               reason: approved ? "" : reviewReason.trim(),
            },
            { headers: { atoken } },
         );

         if (data.success) {
            if (data.emailSent === false) {
               toast.warning(
                  data.message ||
                     "Registration updated, but email notification failed",
               );
            } else {
               toast.success(
                  data.message || "Registration updated successfully",
               );
            }
            setShowModal(false);
            setSelectedRegistration(null);
            setReviewReason("");
            await fetchRegistrations();
         } else {
            toast.error(data.message || "Failed to update registration");
         }
      } catch (error) {
         toast.error(
            error.response?.data?.message || "Failed to update registration",
         );
      } finally {
         setReviewSubmitting(false);
      }
   };

   const closeRegistrationModal = () => {
      setShowModal(false);
      setSelectedRegistration(null);
      setReviewReason("");
   };

   if (loading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-950">
                  Registrations
               </h1>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden border border-slate-200">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-transparent">
                     <thead className="bg-white">
                        <tr>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Paper ID
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Presenter
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Category
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Amount Paid
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left font-semibold text-xs text-slate-500 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>

                     <tbody className="bg-white divide-y divide-transparent">
                        {registrations.length > 0 ? (
                           registrations.map((reg) => (
                              <tr
                                 key={reg._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4 font-bold text-slate-950">
                                    #{reg.paperId}
                                 </td>
                                 <td className="px-6 py-4 text-slate-950">
                                    {reg.paperTitle}
                                 </td>

                                 <td className="px-6 py-4">
                                    <div className="text-slate-950 font-medium">
                                       {reg.name}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                       {reg.email}
                                    </div>
                                 </td>

                                 <td className="px-6 py-4 text-slate-700">
                                    {reg.registrationCategory}
                                 </td>
                                 <td className="px-6 py-4 text-slate-700">
                                    ₹{reg.amountPaid}
                                 </td>

                                 <td className="px-6 py-4">
                                    {reg.approved ? (
                                       <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                                          Approved
                                       </span>
                                    ) : reg.rejectionReason ? (
                                       <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold">
                                          Not Approved
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold">
                                          Pending
                                       </span>
                                    )}
                                 </td>

                                 {/*  ACTION BUTTONS */}
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => {
                                             setSelectedRegistration(reg);
                                             setReviewReason(
                                                reg.rejectionReason || "",
                                             );
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
                                 className="text-center py-6 text-slate-500"
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

         {/*  VIEW DETAILS MODAL */}
         {showModal && selectedRegistration && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-indigo-600 text-white rounded-t-2xl">
                     <h2 className="text-xl font-bold">Registration Details</h2>
                     <button
                        type="button"
                        onClick={closeRegistrationModal}
                        className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close registration details"
                     >
                        <X size={22} />
                     </button>
                  </div>

                  <div className="px-8 py-6 space-y-6">
                     <div className="bg-gray-50 border rounded p-4">
                        <p className="text-xs font-semibold text-slate-500">
                           PAPER ID
                        </p>
                        <h3 className="text-3xl font-bold text-indigo-600">
                           #{selectedRegistration.paperId}
                        </h3>
                        <p className="text-slate-950 font-semibold mt-2">
                           {selectedRegistration.paperTitle}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded p-4 border">
                           <p className="text-xs text-slate-500 font-semibold">
                              PRESENTER
                           </p>
                           <p className="text-slate-950 font-medium">
                              {selectedRegistration.name}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded p-4 border">
                           <p className="text-xs text-slate-500 font-semibold">
                              EMAIL
                           </p>
                           <p className="text-slate-950 font-medium">
                              {selectedRegistration.email}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded p-4 border">
                           <p className="text-xs text-slate-500 font-semibold">
                              AMOUNT PAID
                           </p>
                           <p className="text-green-600 font-semibold text-lg">
                              ₹ {selectedRegistration.amountPaid}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded p-4 border">
                           <p className="text-xs text-slate-500 font-semibold">
                              DATE OF PAYMENT
                           </p>
                           <p className="text-slate-950 font-medium">
                              {selectedRegistration.paymentDate}
                           </p>
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded p-4 border">
                        <p className="text-xs text-slate-500 font-semibold">
                           TRANSACTION REF NO
                        </p>
                        <p className="text-slate-950 font-medium">
                           {selectedRegistration.transactionRefNo}
                        </p>

                        <a
                           href={selectedRegistration.paymentProof}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                           View Trasaction Photo
                        </a>
                     </div>

                     <div className="bg-gray-50 rounded p-4 border space-y-3">
                        <p className="text-xs text-slate-500 font-semibold">
                           APPROVAL STATUS
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                           {selectedRegistration.approved
                              ? "Approved"
                              : selectedRegistration.rejectionReason
                                ? "Not Approved"
                                : "Pending"}
                        </p>

                        {!selectedRegistration.approved && (
                           <div>
                              <label
                                 htmlFor="reviewReason"
                                 className="block text-xs font-semibold text-slate-500 mb-2"
                              >
                                 Reason for non-approval
                              </label>
                              <textarea
                                 id="reviewReason"
                                 value={reviewReason}
                                 onChange={(e) =>
                                    setReviewReason(e.target.value)
                                 }
                                 rows={4}
                                 placeholder="Write reason if registration is not approved"
                                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="px-6 py-4 border-t bg-gray-100 rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3">
                     <button
                        onClick={() => handleRegistrationReview(false)}
                        disabled={
                           reviewSubmitting || selectedRegistration.approved
                        }
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                     >
                        {reviewSubmitting
                           ? "Submitting..."
                           : "Not Approve & Send Mail"}
                     </button>
                     <button
                        onClick={() => handleRegistrationReview(true)}
                        disabled={
                           reviewSubmitting || selectedRegistration.approved
                        }
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                     >
                        {reviewSubmitting
                           ? "Submitting..."
                           : "Approve & Send Mail"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminRegistrations;
