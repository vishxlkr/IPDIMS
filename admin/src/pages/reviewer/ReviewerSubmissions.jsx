import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Eye,
   Search,
   Filter,
   Download,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
   MessageSquare,
   Send,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const ReviewerSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [feedbackText, setFeedbackText] = useState("");
   const [decision, setDecision] = useState("Under Review");
   const [rating, setRating] = useState("");
   const [feedbacks, setFeedbacks] = useState([]); // 🆕 to show all previous feedbacks

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const rtoken = localStorage.getItem("rToken");

   useEffect(() => {
      fetchSubmissions();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions`,
            {
               headers: { rtoken },
            }
         );

         if (data.success) {
            setSubmissions(data.submissions || []);
         } else {
            toast.error(data.message || "Failed to fetch submissions");
         }
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error(
            error.response?.data?.message || "Error fetching submissions"
         );
      } finally {
         setLoading(false);
      }
   };

   const filterSubmissions = () => {
      let filtered = submissions;
      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }
      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.user?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
         );
      }
      setFilteredSubmissions(filtered);
   };

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions/${submissionId}`,
            { headers: { rtoken } }
         );

         if (data.success) {
            const sortedFeedbacks = (data.submission.feedback || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setFeedbacks(sortedFeedbacks);
            setSelectedSubmission(data.submission);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
         toast.error("Failed to load submission details");
      }
   };

   const openReviewModal = (submission) => {
      setSelectedSubmission(submission);
      setFeedbackText("");
      setDecision("Under Review");
      setRating("");
      setShowReviewModal(true);
   };

   const handleSubmitReview = async () => {
      if (!feedbackText.trim()) {
         toast.error("Please provide feedback");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/reviewer/submissions/${selectedSubmission._id}/review`,
            {
               feedbackText,
               rating: rating || null,
               decision,
            },
            { headers: { rtoken } }
         );

         if (data.success) {
            toast.success("Review submitted successfully!");
            setShowReviewModal(false);
            setFeedbackText("");
            setDecision("Under Review");
            setRating("");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to submit review");
         }
      } catch (error) {
         console.error("Error submitting review:", error);
         toast.error(
            error.response?.data?.message || "Failed to submit review"
         );
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Assigned Submissions
               </h1>
               <p className="text-gray-600 mt-2">
                  Review and provide feedback on assigned manuscripts
               </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-black pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full text-gray-800 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                     >
                        <option value="All">All Status</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Revision Required">
                           Revision Required
                        </option>
                     </select>
                  </div>
               </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Paper ID
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? (
                           filteredSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4 font-semibold text-gray-700">
                                    {submission.paperId ?? "-"}
                                 </td>
                                 <td className="px-6 py-4">
                                    {submission.title || "Untitled"}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div>
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                             ? "bg-red-100 text-red-800"
                                             : submission.status ===
                                               "Revision Required"
                                             ? "bg-orange-100 text-orange-800"
                                             : "bg-blue-100 text-blue-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() =>
                                             handleViewDetails(submission._id)
                                          }
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                       >
                                          <Eye className="w-5 h-5" />
                                       </button>
                                       <button
                                          onClick={() =>
                                             openReviewModal(submission)
                                          }
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                       >
                                          <MessageSquare className="w-5 h-5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="5"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No submissions found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Details Modal */}
         {showDetailsModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Submission Details
                     </h2>
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     {/* Paper Details */}
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                           {selectedSubmission.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                           Paper ID: {selectedSubmission.paperId}
                        </p>
                        <p className="text-sm text-gray-600">
                           Event: {selectedSubmission.eventName}
                        </p>
                        <p className="text-sm text-gray-600">
                           Submitted on:{" "}
                           {new Date(
                              selectedSubmission.createdAt
                           ).toLocaleString()}
                        </p>
                     </div>

                     {/* Author Details */}
                     <div className="bg-gray-50 p-4 rounded-xl border">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                           <User size={18} /> Author Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                           <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {selectedSubmission.authorName}
                           </p>
                           <p>
                              <span className="font-semibold">Email:</span>{" "}
                              {selectedSubmission.authorEmail}
                           </p>
                           <p>
                              <span className="font-semibold">
                                 Affiliation:
                              </span>{" "}
                              {selectedSubmission.authorAffiliation ||
                                 "Not Provided"}
                           </p>
                        </div>
                     </div>

                     {/* Keywords */}
                     {selectedSubmission.keywords?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Tag size={18} /> Keywords
                           </h4>
                           <div className="flex gap-2 flex-wrap mt-2">
                              {selectedSubmission.keywords.map((kw, idx) => (
                                 <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                 >
                                    {kw}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Abstract / Description */}
                     <div className="bg-white p-4 rounded-xl border">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                           <AlignLeft size={18} /> Description
                        </h4>
                        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                           {selectedSubmission.description}
                        </p>
                     </div>

                     {/* Manuscript Attachment */}
                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <FileText size={18} /> Manuscript File
                           </h4>

                           <a
                              href={`${backendUrl}/${selectedSubmission.attachment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                           >
                              <Download size={16} /> Download Manuscript
                           </a>
                        </div>
                     )}

                     {/* Previous Reviewer Feedback */}
                     {feedbacks.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900">
                              Previous Feedback
                           </h4>
                           {feedbacks.map((fb, idx) => (
                              <div
                                 key={idx}
                                 className="bg-white p-3 rounded-lg border shadow-sm mb-2"
                              >
                                 <p className="text-sm text-gray-700">
                                    {fb.comment}
                                 </p>
                                 <p className="text-xs text-gray-500 mt-1">
                                    Recommendation:{" "}
                                    <strong>{fb.recommendation}</strong>
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    {new Date(fb.createdAt).toLocaleString()}
                                 </p>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           openReviewModal(selectedSubmission);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                     >
                        <MessageSquare size={16} /> Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Review Modal */}
         {showReviewModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                     <h2 className="text-xl font-bold text-gray-800">
                        Submit Review
                     </h2>
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setFeedbackText("");
                           setDecision("Under Review");
                           setRating("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-semibold mb-1">
                           Decision *
                        </label>
                        <select
                           value={decision}
                           onChange={(e) => setDecision(e.target.value)}
                           className="w-full border border-gray-300 rounded-lg p-2"
                        >
                           <option value="Under Review">Under Review</option>
                           <option value="Accepted">Accept</option>
                           <option value="Rejected">Reject</option>
                           <option value="Revision Required">
                              Revision Required
                           </option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold mb-1">
                           Feedback *
                        </label>
                        <textarea
                           value={feedbackText}
                           onChange={(e) => setFeedbackText(e.target.value)}
                           rows={6}
                           placeholder="Provide detailed feedback..."
                           className="w-full border border-gray-300 rounded-lg p-2"
                        />
                     </div>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-2">
                     <button
                        onClick={() => setShowReviewModal(false)}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleSubmitReview}
                        disabled={!feedbackText.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                     >
                        <Send size={16} /> Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ReviewerSubmissions;
