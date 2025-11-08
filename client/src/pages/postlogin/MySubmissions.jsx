import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
   FileText,
   Clock,
   CheckCircle,
   XCircle,
   Download,
   X,
   Calendar,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Eye,
} from "lucide-react";

const MySubmissions = () => {
   const { token, backendUrl } = useContext(AppContext);
   const [submissions, setSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedSubmission, setSelectedSubmission] = useState(null);

   // Fetch user submissions
   useEffect(() => {
      const fetchSubmissions = async () => {
         try {
            const { data } = await axios.get(
               `${backendUrl}/api/user/my-submissions`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            );

            if (data.success) {
               setSubmissions(data.submissions || []);
            } else {
               toast.error(data.message || "Failed to fetch submissions");
            }
         } catch (error) {
            toast.error(
               error.response?.data?.message || "Error fetching submissions"
            );
         } finally {
            setLoading(false);
         }
      };

      fetchSubmissions();
   }, [token, backendUrl]);

   const openSubmissionModal = (submission) => {
      setSelectedSubmission(submission);
   };

   const closeSubmissionModal = () => {
      setSelectedSubmission(null);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
         <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
               My Submissions
            </h1>

            {submissions.length === 0 ? (
               <div className="text-center text-gray-400 mt-20">
                  <FileText size={40} className="mx-auto mb-4 opacity-60" />
                  <p className="text-lg">
                     You haven't made any submissions yet.
                  </p>
               </div>
            ) : (
               <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-700 text-gray-300">
                        <tr>
                           <th className="py-3 px-6 text-sm font-semibold">
                              #
                           </th>
                           <th className="py-3 px-6 text-sm font-semibold">
                              Title
                           </th>
                           <th className="py-3 px-6 text-sm font-semibold">
                              Event Name
                           </th>
                           <th className="py-3 px-6 text-sm font-semibold">
                              Date
                           </th>
                           <th className="py-3 px-6 text-sm font-semibold">
                              Status
                           </th>
                           <th className="py-3 px-6 text-sm font-semibold text-center">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {submissions.map((sub, index) => (
                           <tr
                              key={sub._id}
                              className="border-t border-slate-700 hover:bg-slate-750 transition cursor-pointer"
                              onClick={() => openSubmissionModal(sub)}
                           >
                              <td className="py-3 px-6 text-gray-400">
                                 {index + 1}
                              </td>
                              <td className="py-3 px-6 font-medium">
                                 {sub.title || "Untitled"}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                 {sub.eventName || "—"}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                 {new Date(sub.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-6">
                                 {sub.status.toLowerCase() === "accepted" ? (
                                    <div className="flex items-center gap-2 text-green-400 font-medium">
                                       <CheckCircle size={18} /> Accepted
                                    </div>
                                 ) : sub.status.toLowerCase() === "rejected" ? (
                                    <div className="flex items-center gap-2 text-red-400 font-medium">
                                       <XCircle size={18} /> Rejected
                                    </div>
                                 ) : sub.status.toLowerCase() ===
                                   "under review" ? (
                                    <div className="flex items-center gap-2 text-blue-400 font-medium">
                                       <Clock size={18} /> Under Review
                                    </div>
                                 ) : sub.status.toLowerCase() ===
                                   "revision requested" ? (
                                    <div className="flex items-center gap-2 text-orange-400 font-medium">
                                       <Clock size={18} /> Revision Requested
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2 text-yellow-400 font-medium">
                                       <Clock size={18} /> Pending
                                    </div>
                                 )}
                              </td>

                              <td className="py-3 px-6 text-center">
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       openSubmissionModal(sub);
                                    }}
                                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                 >
                                    <Eye size={16} /> View
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>

         {/* Modal */}
         {selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
               <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-white">
                        Submission Details
                     </h2>
                     <button
                        onClick={closeSubmissionModal}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                     {/* Status Badge */}
                     <div className="flex items-center justify-between">
                        <div>
                           {selectedSubmission.status === "Approved" ||
                           selectedSubmission.status === "approved" ? (
                              <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
                                 <CheckCircle size={24} /> Approved
                              </div>
                           ) : selectedSubmission.status === "Rejected" ||
                             selectedSubmission.status === "rejected" ? (
                              <div className="flex items-center gap-2 text-red-400 font-semibold text-lg">
                                 <XCircle size={24} /> Rejected
                              </div>
                           ) : (
                              <div className="flex items-center gap-2 text-yellow-400 font-semibold text-lg">
                                 <Clock size={24} /> Pending
                              </div>
                           )}
                        </div>
                        <div className="text-sm text-gray-400">
                           <Calendar className="inline mr-1" size={16} />
                           {new Date(
                              selectedSubmission.createdAt
                           ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </div>
                     </div>

                     {/* Title */}
                     <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-2">
                           {selectedSubmission.title || "Untitled"}
                        </h3>
                        <p className="text-sm text-gray-400">
                           Event: {selectedSubmission.eventName || "N/A"}
                        </p>
                     </div>

                     {/* Author Details */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center gap-3 mb-2">
                              <User className="text-blue-400" size={20} />
                              <p className="text-xs text-gray-400 font-medium">
                                 AUTHOR NAME
                              </p>
                           </div>
                           <p className="text-white font-medium">
                              {selectedSubmission.authorName || "N/A"}
                           </p>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center gap-3 mb-2">
                              <Mail className="text-blue-400" size={20} />
                              <p className="text-xs text-gray-400 font-medium">
                                 AUTHOR EMAIL
                              </p>
                           </div>
                           <p className="text-white font-medium ">
                              {selectedSubmission.authorEmail || "N/A"}
                           </p>
                        </div>

                        {selectedSubmission.authorAffiliation && (
                           <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 md:col-span-2">
                              <div className="flex items-center gap-3 mb-2">
                                 <Building
                                    className="text-blue-400"
                                    size={20}
                                 />
                                 <p className="text-xs text-gray-400 font-medium">
                                    AFFILIATION
                                 </p>
                              </div>
                              <p className="text-white font-medium">
                                 {selectedSubmission.authorAffiliation}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Description */}
                     {selectedSubmission.description && (
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center gap-3 mb-3">
                              <AlignLeft className="text-blue-400" size={20} />
                              <p className="text-xs text-gray-400 font-medium">
                                 DESCRIPTION
                              </p>
                           </div>
                           <p className="text-white leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.description}
                           </p>
                        </div>
                     )}

                     {/* Keywords */}
                     {selectedSubmission.keywords &&
                        selectedSubmission.keywords.length > 0 && (
                           <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                              <div className="flex items-center gap-3 mb-3">
                                 <Tag className="text-blue-400" size={20} />
                                 <p className="text-xs text-gray-400 font-medium">
                                    KEYWORDS
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {selectedSubmission.keywords.map(
                                    (keyword, idx) => (
                                       <span
                                          key={idx}
                                          className="bg-blue-600 bg-opacity-20 text-white-400 px-3 py-1 rounded-lg text-sm font-medium border border-blue-500 border-opacity-30"
                                       >
                                          {keyword}
                                       </span>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                     {/* Attachment */}
                     {selectedSubmission.attachment && (
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText
                                    className="text-blue-400"
                                    size={20}
                                 />
                                 <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">
                                       ATTACHMENT
                                    </p>
                                    <p className="text-white font-medium text-sm">
                                       Paper Submission
                                    </p>
                                 </div>
                              </div>
                              <a
                                 href={selectedSubmission.attachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                              >
                                 <Download size={18} />
                                 Download
                              </a>
                           </div>
                        </div>
                     )}

                     {/* Payment Screenshot */}
                     {selectedSubmission.paymentScreenshot && (
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText
                                    className="text-green-400"
                                    size={20}
                                 />
                                 <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">
                                       PAYMENT PROOF
                                    </p>
                                    <p className="text-white font-medium text-sm">
                                       Payment Screenshot
                                    </p>
                                 </div>
                              </div>
                              <a
                                 href={selectedSubmission.paymentScreenshot}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                              >
                                 <Download size={18} />
                                 View
                              </a>
                           </div>
                        </div>
                     )}

                     {/* Reviewer Info */}
                     {selectedSubmission.reviewer && (
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                           <div className="flex items-center gap-3 mb-2">
                              <User className="text-purple-400" size={20} />
                              <p className="text-xs text-gray-400 font-medium">
                                 REVIEWER
                              </p>
                           </div>
                           <p className="text-white font-medium">
                              {selectedSubmission.reviewer}
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex justify-end">
                     <button
                        onClick={closeSubmissionModal}
                        className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
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

export default MySubmissions;
