import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Eye,
   Trash2,
   Filter,
   Search,
   Download,
   UserPlus,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
   Clock,
   CheckCircle,
   XCircle,
   AlertCircle,
   FileEdit,
   UserCheck,
   MessageSquare,
   Bell,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const AdminSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [reviewers, setReviewers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
   const [selectedReviewer, setSelectedReviewer] = useState("");
   const [feedbacks, setFeedbacks] = useState([]);
   const [newFeedbackFlags, setNewFeedbackFlags] = useState({});

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchSubmissions();
      fetchReviewers();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submissions`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setSubmissions(data.submissions || []);

            // Track which submissions have new feedback
            const feedbackMap = {};
            (data.submissions || []).forEach((sub) => {
               feedbackMap[sub._id] = sub.hasNewFeedback || false;
            });
            setNewFeedbackFlags(feedbackMap);
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

   const fetchReviewers = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/all-reviewer`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setReviewers(data.reviewers || []);
         }
      } catch (error) {
         console.error("Error fetching reviewers:", error);
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
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.email
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
         );
      }

      setFilteredSubmissions(filtered);
   };

   const getStatistics = () => {
      return {
         pending: submissions.filter((s) => s.status === "Pending").length,
         underReview: submissions.filter((s) => s.status === "Under Review")
            .length,
         accepted: submissions.filter((s) => s.status === "Accepted").length,
         rejected: submissions.filter((s) => s.status === "Rejected").length,
         revisionRequested: submissions.filter(
            (s) => s.status === "Revision Requested"
         ).length,
         unassigned: submissions.filter((s) => !s.reviewer).length,
      };
   };

   const stats = getStatistics();

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setSelectedSubmission(data.submission);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
         toast.error("Failed to load submission details");
      }
   };

   const handleViewFeedback = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            { headers: { atoken } }
         );

         console.log("Feedback data received:", data);

         if (data.success) {
            // Sort feedbacks newest first
            const sortedFeedbacks = (data.submission.feedback || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setFeedbacks(sortedFeedbacks);
            setSelectedSubmission(data.submission);
            setShowFeedbackModal(true);

            // Remove green dot once opened
            setNewFeedbackFlags((prev) => ({ ...prev, [submissionId]: false }));

            // Optional: Mark as seen on backend
            try {
               await axios.put(
                  `${backendUrl}/api/admin/mark-feedback-seen/${submissionId}`,
                  {},
                  { headers: { atoken } }
               );
            } catch (err) {
               console.log("Could not mark feedback as seen:", err);
            }
         }
      } catch (error) {
         console.error("Error fetching feedback:", error);
         toast.error("Failed to load feedbacks");
      }
   };

   const handleNotifyAuthor = async (feedbackId) => {
      if (!selectedSubmission) return;

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/notify-author`,
            {
               submissionId: selectedSubmission._id,
               feedbackId: feedbackId,
            },
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Author notified successfully!");
         } else {
            toast.error(data.message || "Failed to notify author");
         }
      } catch (error) {
         console.error("Error notifying author:", error);
         toast.error(
            error.response?.data?.message || "Failed to notify author"
         );
      }
   };

   const openAssignModal = (submission) => {
      setSelectedSubmission(submission);
      setSelectedReviewer(submission.reviewer?._id || "");
      setShowAssignModal(true);
   };

   const handleAssignReviewer = async () => {
      if (!selectedReviewer || !selectedSubmission) {
         toast.error("Please select a reviewer");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/assign-submission`,
            {
               submissionId: selectedSubmission._id,
               reviewerId: selectedReviewer,
            },
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Reviewer assigned successfully!");
            setShowAssignModal(false);
            setSelectedReviewer("");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to assign reviewer");
         }
      } catch (error) {
         console.error("Error assigning reviewer:", error);
         toast.error(
            error.response?.data?.message || "Failed to assign reviewer"
         );
      }
   };

   const handleChangeStatus = async (submissionId, newStatus) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/change-submission-status`,
            {
               submissionId,
               status: newStatus,
            },
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Status updated successfully!");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to update status");
         }
      } catch (error) {
         console.error("Error updating status:", error);
         toast.error(
            error.response?.data?.message || "Failed to update status"
         );
      }
   };

   const handleDeleteSubmission = async (submissionId) => {
      if (!window.confirm("Are you sure you want to delete this submission?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            toast.success("Submission deleted successfully!");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to delete submission");
         }
      } catch (error) {
         console.error("Error deleting submission:", error);
         toast.error(
            error.response?.data?.message || "Failed to delete submission"
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
               <h1 className="text-4xl font-bold text-gray-800">Submissions</h1>
               <p className="text-gray-600 mt-2">
                  Manage and track all manuscript submissions
               </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.pending}
                        </p>
                     </div>
                     <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Under Review
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.underReview}
                        </p>
                     </div>
                     <FileEdit className="w-8 h-8 text-blue-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Accepted
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.accepted}
                        </p>
                     </div>
                     <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Rejected
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.rejected}
                        </p>
                     </div>
                     <XCircle className="w-8 h-8 text-red-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Revision Req
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.revisionRequested}
                        </p>
                     </div>
                     <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Unassigned
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.unassigned}
                        </p>
                     </div>
                     <UserCheck className="w-8 h-8 text-purple-500" />
                  </div>
               </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title, author, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                     >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Revision Requested">
                           Revision Requested
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
                              Paper #
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
                              Reviewer
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? (
                           [...filteredSubmissions]
                              .sort(
                                 (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                              )
                              .map((submission, index) => {
                                 const paperNumber =
                                    submissions.length -
                                    submissions.findIndex(
                                       (s) => s._id === submission._id
                                    );
                                 return (
                                    <tr
                                       key={submission._id}
                                       className="hover:bg-gray-50 transition-colors"
                                    >
                                       <td className="px-6 py-4">
                                          <div className="text-sm font-bold text-gray-700">
                                             {submission.paperId ?? "-"}
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                             {submission.title || "Untitled"}
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div className="text-sm text-gray-900">
                                             {submission.author?.name || "N/A"}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                             {submission.author?.email}
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <select
                                             value={submission.status}
                                             onChange={(e) =>
                                                handleChangeStatus(
                                                   submission._id,
                                                   e.target.value
                                                )
                                             }
                                             onClick={(e) =>
                                                e.stopPropagation()
                                             }
                                             className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer ${
                                                submission.status === "Accepted"
                                                   ? "bg-green-100 text-green-800"
                                                   : submission.status ===
                                                     "Rejected"
                                                   ? "bg-red-100 text-red-800"
                                                   : submission.status ===
                                                     "Under Review"
                                                   ? "bg-blue-100 text-blue-800"
                                                   : submission.status ===
                                                     "Revision Requested"
                                                   ? "bg-orange-100 text-orange-800"
                                                   : "bg-yellow-100 text-yellow-800"
                                             }`}
                                          >
                                             <option value="Pending">
                                                Pending
                                             </option>
                                             <option value="Under Review">
                                                Under Review
                                             </option>
                                             <option value="Accepted">
                                                Accepted
                                             </option>
                                             <option value="Rejected">
                                                Rejected
                                             </option>
                                             <option value="Revision Requested">
                                                Revision Requested
                                             </option>
                                          </select>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div className="flex items-center justify-between w-full">
                                             {submission.reviewer ? (
                                                <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                                   <User className="w-4 h-4 text-purple-600" />
                                                   {submission.reviewer.name ||
                                                      "Unknown"}
                                                </span>
                                             ) : (
                                                <span className="text-sm italic text-gray-500">
                                                   Not Assigned
                                                </span>
                                             )}

                                             <button
                                                onClick={() =>
                                                   openAssignModal(submission)
                                                }
                                                className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                                             >
                                                <UserPlus className="w-4 h-4" />
                                                {submission.reviewer
                                                   ? "Change"
                                                   : "Assign"}
                                             </button>
                                          </div>
                                       </td>

                                       <td className="px-6 py-4">
                                          <div className="flex items-center gap-2">
                                             <button
                                                onClick={() =>
                                                   handleViewDetails(
                                                      submission._id
                                                   )
                                                }
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                             >
                                                <Eye className="w-5 h-5" />
                                             </button>
                                             <button
                                                onClick={() =>
                                                   handleViewFeedback(
                                                      submission._id
                                                   )
                                                }
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
                                                title="View Feedback"
                                             >
                                                <MessageSquare className="w-5 h-5" />
                                                {newFeedbackFlags[
                                                   submission._id
                                                ] && (
                                                   <span className="absolute top-1 right-1 block w-2 h-2 bg-green-500 rounded-full"></span>
                                                )}
                                             </button>
                                             <button
                                                onClick={() =>
                                                   handleDeleteSubmission(
                                                      submission._id
                                                   )
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                             >
                                                <Trash2 className="w-5 h-5" />
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })
                        ) : (
                           <tr>
                              <td
                                 colSpan="6"
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
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
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
                     <div className="flex items-center justify-between">
                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              selectedSubmission.status === "Accepted"
                                 ? "bg-green-100 text-green-800"
                                 : selectedSubmission.status === "Rejected"
                                 ? "bg-red-100 text-red-800"
                                 : selectedSubmission.status === "Under Review"
                                 ? "bg-blue-100 text-blue-800"
                                 : selectedSubmission.status ===
                                   "Revision Requested"
                                 ? "bg-orange-100 text-orange-800"
                                 : "bg-yellow-100 text-yellow-800"
                           }`}
                        >
                           {selectedSubmission.status}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                           <Calendar size={16} />
                           {new Date(
                              selectedSubmission.createdAt
                           ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                           {selectedSubmission.title || "Untitled"}
                        </h3>
                        {selectedSubmission.eventName && (
                           <p className="text-sm text-gray-600">
                              Event: {selectedSubmission.eventName}
                           </p>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR NAME
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {selectedSubmission.author?.name ||
                                 selectedSubmission.authorName ||
                                 "N/A"}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR EMAIL
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium break-all">
                              {selectedSubmission.author?.email ||
                                 selectedSubmission.authorEmail ||
                                 "N/A"}
                           </p>
                        </div>

                        {(selectedSubmission.author?.organization ||
                           selectedSubmission.authorAffiliation) && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    AFFILIATION
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedSubmission.author?.organization ||
                                    selectedSubmission.authorAffiliation}
                              </p>
                           </div>
                        )}
                     </div>

                     {selectedSubmission.description && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <AlignLeft className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 DESCRIPTION
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.description}
                           </p>
                        </div>
                     )}

                     {selectedSubmission.keywords &&
                        selectedSubmission.keywords.length > 0 && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                 <Tag className="text-blue-600" size={18} />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    KEYWORDS
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {selectedSubmission.keywords.map(
                                    (keyword, idx) => (
                                       <span
                                          key={idx}
                                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                                       >
                                          {keyword}
                                       </span>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText
                                    className="text-blue-600"
                                    size={20}
                                 />
                                 <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">
                                       ATTACHMENT
                                    </p>
                                    <p className="text-gray-900 font-medium text-sm">
                                       Paper Submission
                                    </p>
                                 </div>
                              </div>
                              <a
                                 href={selectedSubmission.attachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                              >
                                 <Download size={18} />
                                 Download
                              </a>
                           </div>
                        </div>
                     )}

                     {selectedSubmission.reviewer && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-purple-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 ASSIGNED REVIEWER
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {selectedSubmission.reviewer.name}
                           </p>
                           <p className="text-sm text-gray-600">
                              {selectedSubmission.reviewer.email}
                           </p>
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     {!selectedSubmission.reviewer && (
                        <button
                           onClick={() => {
                              setShowDetailsModal(false);
                              openAssignModal(selectedSubmission);
                           }}
                           className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                        >
                           <UserPlus size={18} />
                           Assign Reviewer
                        </button>
                     )}
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Feedback Modal */}
         {showFeedbackModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                           Feedback History
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                           {selectedSubmission.title}
                        </p>
                     </div>
                     <button
                        onClick={() => {
                           setShowFeedbackModal(false);
                           setFeedbacks([]);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Feedback List */}
                  <div className="p-6 space-y-4">
                     {feedbacks.length > 0 ? (
                        feedbacks.map((feedback, index) => (
                           <div
                              key={feedback._id || index}
                              className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm"
                           >
                              {/* Reviewer Info */}
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                       {feedback.reviewer?.name?.charAt(0) ||
                                          "R"}
                                    </div>
                                    <div>
                                       <p className="font-semibold text-gray-900">
                                          {feedback.reviewer?.name ||
                                             "Reviewer"}
                                       </p>
                                       <p className="text-xs text-gray-600 flex items-center gap-1">
                                          <Calendar size={12} />
                                          {new Date(
                                             feedback.createdAt
                                          ).toLocaleDateString("en-US", {
                                             year: "numeric",
                                             month: "short",
                                             day: "numeric",
                                             hour: "2-digit",
                                             minute: "2-digit",
                                          })}
                                       </p>
                                    </div>
                                 </div>

                                 {/* Notify Button */}
                                 <button
                                    onClick={() =>
                                       handleNotifyAuthor(feedback._id)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                 >
                                    <Bell size={16} />
                                    Notify Author
                                 </button>
                              </div>

                              {/* Feedback Text */}
                              <div className="bg-white rounded-lg p-4 border border-blue-100">
                                 <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {feedback.comment || "No feedback text"}
                                 </p>
                              </div>

                              {/* Recommendation */}
                              {feedback.recommendation && (
                                 <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                       Recommendation:
                                    </span>
                                    <span
                                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                 ${
                                    feedback.recommendation === "Accepted"
                                       ? "bg-green-100 text-green-800"
                                       : feedback.recommendation === "Rejected"
                                       ? "bg-red-100 text-red-800"
                                       : "bg-orange-100 text-orange-800"
                                 }`}
                                    >
                                       {feedback.recommendation}
                                    </span>
                                 </div>
                              )}
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-12">
                           <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                           <p className="text-gray-500 text-lg font-medium">
                              No feedback yet
                           </p>
                           <p className="text-gray-400 text-sm mt-2">
                              Feedbacks from reviewers will appear here
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
                     <button
                        onClick={() => {
                           setShowFeedbackModal(false);
                           setFeedbacks([]);
                        }}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Assign Reviewer Modal */}
         {showAssignModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Assign Reviewer
                     </h2>
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewer("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Submission Title
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                           {selectedSubmission.title}
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Select Reviewer *
                        </label>
                        <select
                           value={selectedReviewer}
                           onChange={(e) => setSelectedReviewer(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">-- Select a Reviewer --</option>
                           {reviewers
                              .filter((r) => r.isActive)
                              .map((reviewer) => (
                                 <option
                                    key={reviewer._id}
                                    value={reviewer._id}
                                 >
                                    {reviewer.name} - {reviewer.email}
                                 </option>
                              ))}
                        </select>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewer("");
                        }}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleAssignReviewer}
                        disabled={!selectedReviewer}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <UserPlus size={18} />
                        Assign Reviewer
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminSubmissions;
